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
  getOrganizerEvents
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

// Admin/Organizer routes - must be before /:id route
router.get('/organizer/my-events', authenticateToken, requireAdmin, getOrganizerEvents);
router.post('/', authenticateToken, requireAdmin, validateEvent, createEvent);
router.put('/:id', authenticateToken, requireAdmin, validateEvent, updateEvent);
router.delete('/:id', authenticateToken, requireAdmin, deleteEvent);

// Public route - must be after specific routes
router.get('/:id', getEventById);

module.exports = router;

