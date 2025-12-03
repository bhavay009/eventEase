const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const {
  createBooking,
  getBookingById,
  getUserBookings
} = require('../controllers/bookingController');

const validateBooking = [
  body('event_id').isInt({ min: 1 }).withMessage('Valid event ID is required'),
  body('seats').isInt({ min: 1 }).withMessage('At least 1 seat is required')
];

router.post('/', authenticateToken, validateBooking, createBooking);
router.get('/:id', authenticateToken, getBookingById);
router.get('/user/:id', authenticateToken, getUserBookings);

module.exports = router;

