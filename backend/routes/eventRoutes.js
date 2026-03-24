const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getEventGuests,
  updateGuestStatus
} = require('../controllers/eventController');

const validateEvent = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .custom((value) => {
      // Accept ISO8601 format or datetime-local format
      const date = new Date(value);
      return !isNaN(date.getTime());
    }).withMessage('Valid date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('total_seats').isInt({ min: 1 }).withMessage('Total seats must be at least 1')
];

// Public routes
router.get('/', getAllEvents);

// Unified Creator Routes - Native access granted to any valid session
router.get('/organizer/my-events', authenticateToken, getOrganizerEvents);
router.get('/organizer/:id/guests', authenticateToken, getEventGuests);
router.put('/organizer/guest/:bookingId', authenticateToken, updateGuestStatus);
router.post('/', authenticateToken, validateEvent, createEvent);
router.put('/:id', authenticateToken, validateEvent, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

// Public route - must be after specific routes
router.get('/:id', getEventById);

module.exports = router;

