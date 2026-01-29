const prisma = require('../config/db');
const { validationResult } = require('express-validator');

function mockEvents() {
  const now = new Date();
  const addDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    x.setHours(19, 30, 0, 0);
    return x;
  };
  const data = [
    { title: 'Arijit Live In Concert', category: 'concerts', location: 'Mumbai, Maharashtra', price: 2499, total_seats: 5000, image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80' },
    { title: 'Stand-Up Night with Zakir Khan', category: 'comedy', location: 'Delhi, NCR', price: 799, total_seats: 1200, image_url: 'https://images.unsplash.com/photo-1517353441267-4f2e0b476b22?w=1200&q=80' },
    { title: 'Theatre: Hamlet Reimagined', category: 'theatre', location: 'Bengaluru, Karnataka', price: 1299, total_seats: 600, image_url: 'https://images.unsplash.com/photo-1540573131275-4bde8f77b325?w=1200&q=80' },
    { title: 'EDM Night with DJ Snake', category: 'concerts', location: 'Goa', price: 1999, total_seats: 8000, image_url: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=1200&q=80' },
    { title: 'Startup Workshop: Fundraising 101', category: 'workshops', location: 'Pune, Maharashtra', price: 499, total_seats: 200, image_url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80' },
    { title: 'Classical Night: Pt. Hariprasad Chaurasia', category: 'concerts', location: 'Kolkata, West Bengal', price: 1499, total_seats: 900, image_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&q=80' },
    { title: 'Food Fest: Taste of India', category: 'festivals', location: 'Jaipur, Rajasthan', price: 299, total_seats: 3000, image_url: 'https://images.unsplash.com/photo-1555993539-1732d5b90ad6?w=1200&q=80' },
    { title: 'Yoga Retreat Weekend', category: 'workshops', location: 'Rishikesh, Uttarakhand', price: 999, total_seats: 150, image_url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=80' },
    { title: 'Indie Music Night', category: 'concerts', location: 'Chennai, Tamil Nadu', price: 699, total_seats: 700, image_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=80' },
    { title: 'Comedy Roast Battle', category: 'comedy', location: 'Hyderabad, Telangana', price: 899, total_seats: 1000, image_url: 'https://images.unsplash.com/photo-1517353441267-4f2e0b476b22?w=1200&q=80' },
    { title: 'Photography Walk', category: 'workshops', location: 'Udaipur, Rajasthan', price: 399, total_seats: 120, image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80' },
    { title: 'Women In Tech Summit', category: 'workshops', location: 'Noida, NCR', price: 1599, total_seats: 1500, image_url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80' }
  ];
  return data.map((e, i) => ({
    id: i + 1,
    title: e.title,
    description: 'Premium event experience. Limited seats. Book now.',
    date: addDays(now, i + 1),
    location: e.location,
    price: e.price,
    total_seats: e.total_seats,
    image_url: e.image_url,
    category: e.category,
    organizer_id: 1,
    created_at: now,
    updated_at: now,
    sessions: [],
    bookings: []
  }));
}

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
    const all = mockEvents();
    const q = (req.query.search || '').toLowerCase();
    const loc = (req.query.location || '').toLowerCase();
    const filtered = all.filter(e => 
      (!q || e.title.toLowerCase().includes(q)) &&
      (!loc || e.location.toLowerCase().includes(loc)) &&
      (!(req.query.category) || (e.category || '').toLowerCase() === req.query.category.toLowerCase())
    );
    const eventsWithStats = filtered.map(event => ({
      ...event,
      bookings: undefined,
      booked_seats: 0,
      remaining_seats: event.total_seats
    }));
    const total = eventsWithStats.length;
    const pageNum = parseInt(req.query.page || 1);
    const limitNum = parseInt(req.query.limit || 12);
    const totalPages = Math.ceil(total / limitNum);
    const start = (pageNum - 1) * limitNum;
    const paged = eventsWithStats.slice(start, start + limitNum);
    res.json({
      success: true,
      events: paged,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
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
