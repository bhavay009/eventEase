const prisma = require('../config/db');
const { validationResult } = require('express-validator');

const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { event_id, seats } = req.body;
    const user_id = req.user.userId;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(event_id) },
      include: {
        bookings: true
      }
    });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const totalBookedSeats = event.bookings.reduce((sum, b) => sum + b.seats, 0);
    const remainingSeats = event.total_seats - totalBookedSeats;

    if (seats > remainingSeats) {
      return res.status(400).json({
        success: false,
        message: `Only ${remainingSeats} seats available`
      });
    }

    if (seats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid number of seats'
      });
    }

    const amount = event.price * seats;

    const booking = await prisma.booking.create({
      data: {
        user_id,
        event_id: parseInt(event_id),
        seats: parseInt(seats),
        amount,
        payment_status: 'paid' // In production, integrate with payment gateway
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            price: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const user_role = req.user.role;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        event: {
          include: {
            sessions: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Users can only view their own bookings, admins can view all
    if (user_role !== 'admin' && booking.user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.userId;
    const user_role = req.user.role;

    // Users can only view their own bookings, admins can view any user's bookings
    const targetUserId = user_role === 'admin' ? parseInt(id) : user_id;

    if (user_role !== 'admin' && parseInt(id) !== user_id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const bookings = await prisma.booking.findMany({
      where: { user_id: targetUserId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            date: true,
            location: true,
            price: true,
            image_url: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings
};

