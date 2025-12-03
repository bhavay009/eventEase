const prisma = require('../config/db');
const { validationResult } = require('express-validator');

const getAllEvents = async (req, res) => {
  try {
    const { search, category, location, date, page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let where = {};
    
    if (search) {
      where.title = { contains: search };
    }
    
    if (location) {
      where.location = { contains: location };
    }
    
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = {
        gte: dateObj,
        lt: nextDay
      };
    }

    // Get total count for pagination
    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      include: {
        sessions: true,
        bookings: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { date: 'asc' },
      skip,
      take: limitNum
    });

    const eventsWithStats = events.map(event => {
      const bookedSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
      return {
        ...event,
        bookings: undefined, // Remove from response
        booked_seats: bookedSeats,
        remaining_seats: event.total_seats - bookedSeats
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({ 
      success: true, 
      events: eventsWithStats,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: {
        sessions: {
          orderBy: { start_time: 'asc' }
        },
        bookings: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const totalBookedSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
    const remainingSeats = event.total_seats - totalBookedSeats;

    res.json({
      success: true,
      event: {
        ...event,
        booked_seats: totalBookedSeats,
        remaining_seats: remainingSeats
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ success: false, message: 'Error fetching event' });
  }
};

const createEvent = async (req, res) => {
  try {
    console.log('Create event request:', {
      body: req.body,
      user: req.user,
      userId: req.user?.userId
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, date, location, price, total_seats, image_url, sessions } = req.body;
    const organizerId = req.user.userId; // Get organizer ID from authenticated user

    if (!organizerId) {
      return res.status(401).json({ success: false, message: 'Organizer ID not found in token' });
    }

    console.log('Creating event with organizer_id:', organizerId);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        price: parseFloat(price),
        total_seats: parseInt(total_seats),
        image_url: image_url || null,
        organizer_id: organizerId,
        sessions: sessions ? {
          create: sessions.map(s => ({
            start_time: new Date(s.start_time),
            end_time: new Date(s.end_time)
          }))
        } : undefined
      },
      include: {
        sessions: true,
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    console.error('Create event error:', error);
    // Return more detailed error message
    const errorMessage = error.message || 'Error creating event';
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const organizerId = req.user.userId;

    // Check if event exists and belongs to organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (existingEvent.organizer_id !== organizerId) {
      return res.status(403).json({ success: false, message: 'You can only update your own events' });
    }

    const { title, description, date, location, price, total_seats, image_url } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location) updateData.location = location;
    if (price) updateData.price = parseFloat(price);
    if (total_seats) updateData.total_seats = parseInt(total_seats);
    if (image_url !== undefined) updateData.image_url = image_url;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        sessions: true
      }
    });

    res.json({ success: true, event });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(500).json({ success: false, message: 'Error updating event' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user.userId;

    // Check if event exists and belongs to organizer
    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEvent) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (existingEvent.organizer_id !== organizerId) {
      return res.status(403).json({ success: false, message: 'You can only delete your own events' });
    }

    await prisma.event.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(500).json({ success: false, message: 'Error deleting event' });
  }
};

const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { search, location, date, page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    let where = { organizer_id: organizerId };
    
    if (search) {
      where.title = { contains: search };
    }
    
    if (location) {
      where.location = { contains: location };
    }
    
    if (date) {
      const dateObj = new Date(date);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      where.date = {
        gte: dateObj,
        lt: nextDay
      };
    }

    // Get total count for pagination
    const total = await prisma.event.count({ where });

    const events = await prisma.event.findMany({
      where,
      include: {
        sessions: true,
        bookings: true,
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { date: 'asc' },
      skip,
      take: limitNum
    });

    const eventsWithStats = events.map(event => {
      const bookedSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
      return {
        ...event,
        bookings: undefined, // Remove from response
        booked_seats: bookedSeats,
        remaining_seats: event.total_seats - bookedSeats
      };
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({ 
      success: true, 
      events: eventsWithStats,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get organizer events error:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
};

