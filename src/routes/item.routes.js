const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

// Protected routes (require authentication)
router.post('/', auth, itemController.createItem);
router.put('/:id', auth, itemController.updateItem);
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router;
