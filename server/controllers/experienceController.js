const Experience = require('../models/Experience');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// @desc    Get all experiences for logged-in user
// @route   GET /api/dashboard/experiences
// @access  Private
// ---------------------------------------------------------------------------
const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await Experience.find({ userId: req.user.id }).sort({
    isCurrent: -1,
    startDate: -1,
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: experiences });
});

// ---------------------------------------------------------------------------
// @desc    Create an experience
// @route   POST /api/dashboard/experiences
// @access  Private
// ---------------------------------------------------------------------------
const createExperience = asyncHandler(async (req, res) => {
  // If marked as current, clear endDate
  if (req.body.isCurrent) {
    req.body.endDate = null;
  }

  const experience = await Experience.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Experience added successfully.',
    data: experience,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update an experience
// @route   PUT /api/dashboard/experiences/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const updateExperience = asyncHandler(async (req, res) => {
  delete req.body.userId;

  if (req.body.isCurrent) {
    req.body.endDate = null;
  }

  const experience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Experience updated successfully.',
    data: experience,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete an experience
// @route   DELETE /api/dashboard/experiences/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteExperience = asyncHandler(async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Experience deleted successfully.',
  });
});

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience };
