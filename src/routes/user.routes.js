const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middleware/auth');

// All user routes require authentication
router.use(auth);

// Routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
