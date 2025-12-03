const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login } = require('../controllers/authController');

const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);

module.exports = router;

