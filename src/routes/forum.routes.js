const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Forum routes
router.get('/', forumController.getForums);
router.post('/', forumController.createForum);
router.get('/:id', forumController.getForumById);
router.post('/:id/join', forumController.joinForum);

// Forum posts routes
router.get('/:id/posts', forumController.getForumPosts);
router.post('/:id/posts', forumController.createPost);

// Post interaction routes
router.post('/posts/:id/like', forumController.likePost);
router.post('/posts/:id/comment', forumController.addComment);

module.exports = router;
