const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const otpController = require('../controllers/otp.controller');
const { authLimiter } = require('../middleware/rateLimiter');

// Apply strict rate limiting to OTP routes
router.use(authLimiter);

// Validation rules
const sendOTPValidation = [
  body('email').isEmail().normalizeEmail()
];

const verifyOTPValidation = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
];

// Routes
router.post('/send', sendOTPValidation, otpController.sendOTP);
router.post('/verify', verifyOTPValidation, otpController.verifyOTP);

module.exports = router;
