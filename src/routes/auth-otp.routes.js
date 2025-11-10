const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authOtpController = require('../controllers/auth-otp.controller');
const { authLimiter } = require('../middleware/rateLimiter');

// Apply strict rate limiting to auth routes
router.use(authLimiter);

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('phone').optional().isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
];

const loginOTPValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

const verifyOTPValidation = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
];

// Routes
router.post('/register', registerValidation, authOtpController.register);
router.post('/login-otp', loginOTPValidation, authOtpController.sendLoginOTP);
router.post('/verify-login-otp', verifyOTPValidation, authOtpController.verifyLoginOTP);

module.exports = router;
