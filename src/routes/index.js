const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const itemRoutes = require('./item.routes');
const otpRoutes = require('./otp.routes');
const forumRoutes = require('./forum.routes');
const projectRoutes = require('./project.routes');

// Apply rate limiting to all API routes
router.use(apiLimiter);

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/otp', otpRoutes);
router.use('/forums', forumRoutes);
router.use('/projects', projectRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend API v1.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      items: '/api/items',
      health: '/health'
    }
  });
});

module.exports = router;
