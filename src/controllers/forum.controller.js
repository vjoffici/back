const Forum = require('../models/Forum');
const Post = require('../models/Post');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all forums
// @route   GET /api/forums
// @access  Private
exports.getForums = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  
  let query = { isPublic: true };
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (category) {
    query.category = category;
  }
  
  const forums = await Forum.find(query)
    .populate('creator', 'name email')
    .sort({ createdAt: -1 });
  
  res.json({
    status: 'success',
    data: forums
  });
});

// @desc    Create new forum
// @route   POST /api/forums
// @access  Private
exports.createForum = asyncHandler(async (req, res) => {
  const { name, description, category, isPublic } = req.body;
  
  const forum = await Forum.create({
    name,
    description,
    category,
    isPublic: isPublic !== undefined ? isPublic : true,
    creator: req.user.id,
    members: [req.user.id]
  });
  
  const populatedForum = await Forum.findById(forum._id)
    .populate('creator', 'name email');
  
  res.status(201).json({
    status: 'success',
    data: populatedForum
  });
});

// @desc    Get forum by ID
// @route   GET /api/forums/:id
// @access  Private
exports.getForumById = asyncHandler(async (req, res) => {
  const forum = await Forum.findById(req.params.id)
    .populate('creator', 'name email')
    .populate('members', 'name email');
  
  if (!forum) {
    throw new ApiError(404, 'Forum not found');
  }
  
  res.json({
    status: 'success',
    data: forum
  });
});

// @desc    Join forum
// @route   POST /api/forums/:id/join
// @access  Private
exports.joinForum = asyncHandler(async (req, res) => {
  const forum = await Forum.findById(req.params.id);
  
  if (!forum) {
    throw new ApiError(404, 'Forum not found');
  }
  
  if (forum.members.includes(req.user.id)) {
    throw new ApiError(400, 'Already a member of this forum');
  }
  
  forum.members.push(req.user.id);
  await forum.save();
  
  res.json({
    status: 'success',
    message: 'Joined forum successfully'
  });
});

// @desc    Get posts in a forum
// @route   GET /api/forums/:id/posts
// @access  Private
exports.getForumPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ forum: req.params.id })
    .populate('author', 'name email')
    .populate('comments.author', 'name')
    .sort({ createdAt: -1 });
  
  res.json({
    status: 'success',
    data: posts
  });
});

// @desc    Create post in forum
// @route   POST /api/forums/:id/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  
  const forum = await Forum.findById(req.params.id);
  
  if (!forum) {
    throw new ApiError(404, 'Forum not found');
  }
  
  const post = await Post.create({
    forum: req.params.id,
    author: req.user.id,
    title,
    content
  });
  
  const populatedPost = await Post.findById(post._id)
    .populate('author', 'name email');
  
  res.status(201).json({
    status: 'success',
    data: populatedPost
  });
});

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  
  const likeIndex = post.likes.indexOf(req.user.id);
  
  if (likeIndex > -1) {
    // Unlike
    post.likes.splice(likeIndex, 1);
  } else {
    // Like
    post.likes.push(req.user.id);
  }
  
  await post.save();
  
  res.json({
    status: 'success',
    data: { likes: post.likes.length }
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  
  const post = await Post.findById(req.params.id);
  
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  
  post.comments.push({
    author: req.user.id,
    content
  });
  
  await post.save();
  
  const updatedPost = await Post.findById(post._id)
    .populate('comments.author', 'name');
  
  res.json({
    status: 'success',
    data: updatedPost
  });
});
