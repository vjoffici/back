const Item = require('../models/Item');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all items
// @route   GET /api/items
// @access  Public
exports.getAllItems = asyncHandler(async (req, res, next) => {
  const items = await Item.find().populate('createdBy', 'name email');

  res.json({
    status: 'success',
    results: items.length,
    data: { items }
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('createdBy', 'name email');

  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  res.json({
    status: 'success',
    data: { item }
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res, next) => {
  const { title, description, price } = req.body;

  const item = await Item.create({
    title,
    description,
    price,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { item }
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res, next) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  // Check if user is the creator
  if (item.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to update this item');
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    status: 'success',
    data: { item }
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, 'Item not found');
  }

  // Check if user is the creator
  if (item.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, 'Not authorized to delete this item');
  }

  await item.deleteOne();

  res.json({
    status: 'success',
    message: 'Item deleted successfully'
  });
});
