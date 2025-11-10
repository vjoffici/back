const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendOTPEmail } = require('../utils/emailService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP for login
// @route   POST /api/auth/login-otp
// @access  Public
exports.sendLoginOTP = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
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

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-login-otp
// @access  Public
exports.verifyLoginOTP = asyncHandler(async (req, res, next) => {
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

  // OTP is valid - find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Delete the OTP
  await OTP.deleteOne({ _id: otpRecord._id });

  // Generate token
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    }
  });
});

// @desc    Register new user with OTP
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
  }

  const { name, email, password, phone, latitude, longitude } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user (include optional phone and location)
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone: phone || '',
    latitude: typeof latitude !== 'undefined' ? latitude : null,
    longitude: typeof longitude !== 'undefined' ? longitude : null
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        latitude: user.latitude,
        longitude: user.longitude
      },
      token
    }
  });
});
