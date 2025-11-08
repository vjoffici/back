const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res) => {
  const { search, category, status } = req.query;
  
  let query = {};
  
  if (search) {
    query.$text = { $search: search };
  }
  
  if (category) {
    query.category = category;
  }
  
  if (status) {
    query.status = status;
  }
  
  const projects = await Project.find(query)
    .populate('owner', 'name email')
    .populate('collaborators', 'name')
    .sort({ createdAt: -1 });
  
  res.json({
    status: 'success',
    data: projects
  });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res) => {
  const { title, description, githubLink, technologies, category, status } = req.body;
  
  const project = await Project.create({
    title,
    description,
    githubLink,
    technologies,
    category,
    status,
    owner: req.user.id,
    ownerEmail: req.user.email
  });
  
  const populatedProject = await Project.findById(project._id)
    .populate('owner', 'name email');
  
  res.status(201).json({
    status: 'success',
    data: populatedProject
  });
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('collaborators', 'name email');
  
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  
  // Increment views
  project.views += 1;
  await project.save();
  
  res.json({
    status: 'success',
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  
  // Check if user is owner
  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to update this project');
  }
  
  project = await Project.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  ).populate('owner', 'name email');
  
  res.json({
    status: 'success',
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  
  // Check if user is owner
  if (project.owner.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to delete this project');
  }
  
  await project.deleteOne();
  
  res.json({
    status: 'success',
    message: 'Project deleted successfully'
  });
});

// @desc    Like/Unlike project
// @route   POST /api/projects/:id/like
// @access  Private
exports.likeProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }
  
  const likeIndex = project.likes.indexOf(req.user.id);
  
  if (likeIndex > -1) {
    // Unlike
    project.likes.splice(likeIndex, 1);
  } else {
    // Like
    project.likes.push(req.user.id);
  }
  
  await project.save();
  
  res.json({
    status: 'success',
    data: { likes: project.likes.length }
  });
});
