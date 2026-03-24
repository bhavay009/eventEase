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
    { title: 'Diljit Dosanjh - Dil-Luminati Tour', category: 'concerts', location: 'JLN Stadium, Delhi', price: 6999, total_seats: 15000, image_url: '/event_edm.png' },
    { title: 'Kisi Ko Batana Mat ft. Anubhav Singh Bassi', category: 'comedy', location: 'Auditorium, Mumbai', price: 999, total_seats: 1200, image_url: '/event_comedy.png' },
    { title: 'Zomaland by Zomato', category: 'festivals', location: 'Mahalaxmi Race Course, Mumbai', price: 899, total_seats: 10000, image_url: '/event_vip.png' },
    { title: 'Boiler Room: New Delhi', category: 'concerts', location: 'Secret Location, Delhi', price: 3499, total_seats: 800, image_url: '/event_edm.png' },
    { title: 'Karan Aujla - It Was All A Dream', category: 'concerts', location: 'Pune, Maharashtra', price: 4999, total_seats: 5000, image_url: '/event_jazz.png' },
    { title: 'Samay Raina Unfiltered', category: 'comedy', location: 'Kolkata, West Bengal', price: 1499, total_seats: 900, image_url: '/event_comedy.png' },
    { title: 'Echoes of Earth - Greenest Music Festival', category: 'festivals', location: 'Bengaluru, Karnataka', price: 2499, total_seats: 3000, image_url: '/event_vip.png' },
    { title: 'Candlelight: A Tribute to Coldplay', category: 'concerts', location: 'Royal Opera House, Mumbai', price: 1999, total_seats: 400, image_url: '/event_jazz.png' },
    { title: 'Neon Night Kickback', category: 'house', location: 'Penthouse Vibe, Mumbai', price: 1500, total_seats: 50, image_url: '/event_jazz.png' },
    { title: 'Underground Techno Set', category: 'party', location: 'Abandoned Warehouse, Delhi', price: 2000, total_seats: 120, image_url: '/event_edm.png' },
    { title: 'Exclusive Rooftop Gathering', category: 'local', location: 'Secret Location, Goa', price: 3000, total_seats: 40, image_url: '/event_vip.png' }
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
    const { search, category, location, date, source, page = 1, limit = 12 } = req.query;

    let dbEvents = [];
    let includeMock = true;

    // SCENARIO 1: Strict Host Parties (Used by Local Kickbacks)
    if (source === 'database') {
       dbEvents = await prisma.event.findMany({
         where: { source_type: 'host' },
         include: { bookings: true },
         orderBy: { date: 'asc' }
       });
       includeMock = false; // Never show mock data in host parties
    } 
    // SCENARIO 2: ALL Events (Platform + Host + Mock)
    else {
       dbEvents = await prisma.event.findMany({
         include: { bookings: true },
         orderBy: { date: 'asc' }
       });
    }

    // Process DB Events
    const processedDbEvents = dbEvents.map(e => {
        const booked = e.bookings ? e.bookings.reduce((sum, b) => sum + b.seats, 0) : 0;
        let targetDate = new Date(e.date);
        
        // Emulate upcoming dates for older records
        if (targetDate < new Date()) {
           targetDate = new Date();
           targetDate.setDate(targetDate.getDate() + Math.floor(Math.random() * 30) + 1);
        }

        return {
           ...e,
           date: targetDate.toISOString(),
           source: 'Database',
           booked_seats: booked,
           remaining_seats: e.total_seats - booked
        }
    });

    // Combine with Mock if applicable
    let all = processedDbEvents;
    if (includeMock) {
       all = [...all, ...mockEvents()];
    }

    // Comprehensive Filtering
    const q = (search || '').toLowerCase();
    const loc = (location || '').toLowerCase();

    let filtered = all.filter(e => {
      const matchSearch = !q || e.title.toLowerCase().includes(q) || (e.description && e.description.toLowerCase().includes(q));
      const matchLocation = !loc || e.location.toLowerCase().includes(loc);
      
      let matchCategory = true;
      if (category) {
        const cats = category.toLowerCase().split(',');
        matchCategory = cats.some(c => (e.category || '').toLowerCase().includes(c.trim()));
      }

      let matchDate = true;
      if (date) {
        matchDate = new Date(e.date).toDateString() === new Date(date).toDateString();
      }

      // If strict source requested, filtered at DB level already, but secondary check
      if (source === 'database' && e.source_type !== 'host') return false;

      return matchSearch && matchLocation && matchCategory && matchDate;
    });

    // Pagination
    const total = filtered.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const totalPages = Math.ceil(total / limitNum);
    const start = (pageNum - 1) * limitNum;

    const resultEvents = filtered.slice(start, start + limitNum).map(event => {
      if (event.source === 'Database') return event;
      return {
        ...event,
        booked_seats: Math.floor(event.total_seats * 0.7),
        remaining_seats: Math.floor(event.total_seats * 0.3)
      };
    });

    res.json({
      success: true,
      events: resultEvents,
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
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'API Error' });
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

    const { title, description, date, location, price, total_seats, image_url, sessions, category } = req.body;
    const organizerId = req.user.userId; // Get organizer ID from authenticated user

    if (!organizerId) {
      return res.status(401).json({ success: false, message: 'Organizer ID not found in token' });
    }

    console.log('Creating event with organizer_id:', organizerId);

    const event = await prisma.event.create({
      data: {
        title,
        description: description || 'Local Event configured by Host.',
        date: new Date(date),
        location,
        price: parseFloat(price) || 0,
        total_seats: parseInt(total_seats) || 50,
        category: category || 'open',
        image_url: image_url || null,
        organizer_id: organizerId,
        source_type: 'host',
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

const getEventGuests = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const organizerId = req.user.userId;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || event.organizer_id !== organizerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized or event not found' });
    }

    const guests = await prisma.booking.findMany({
      where: { event_id: eventId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
    res.json({ success: true, guests });
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ success: false, message: 'Error fetching guests' });
  }
};

const updateGuestStatus = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const { status } = req.body; // 'approved' or 'rejected'
    const organizerId = req.user.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { event: true }
    });

    if (!booking || booking.event.organizer_id !== organizerId) {
      return res.status(403).json({ success: false, message: 'Unauthorized or booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { payment_status: status } 
    });

    res.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error('Error updating guest status:', error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getEventGuests,
  updateGuestStatus
};
