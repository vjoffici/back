const { validationResult } = require('express-validator');
const OTP = require('../models/OTP');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendOTPEmail } = require('../utils/emailService');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP to email
// @route   POST /api/otp/send
// @access  Public
exports.sendOTP = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  const { email } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Generate OTP
  const otp = generateOTP();

  // Delete any existing OTPs for this email
  await OTP.deleteMany({ email });

  // Save new OTP
  await OTP.create({ email, otp });

  // Send OTP email
  const emailResult = await sendOTPEmail(email, otp);

  if (!emailResult.success) {
    throw new ApiError(500, 'Failed to send OTP email. Please try again.');
  }

  res.status(200).json({
    status: 'success',
    message: 'OTP sent to your email successfully'
  });
});

// @desc    Verify OTP
// @route   POST /api/otp/verify
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  const { email, otp } = req.body;

  // Find OTP
  const otpRecord = await OTP.findOne({ email, otp });

  if (!otpRecord) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // OTP is valid - delete it
  await OTP.deleteOne({ _id: otpRecord._id });

  res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully'
  });
});
