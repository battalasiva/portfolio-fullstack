const Education = require('../models/Education');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// @desc    Get all education entries for logged-in user
// @route   GET /api/dashboard/education
// @access  Private
// ---------------------------------------------------------------------------
const getEducation = asyncHandler(async (req, res) => {
  const education = await Education.find({ userId: req.user.id }).sort({
    isCurrent: -1,
    startDate: -1,
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: education });
});

// ---------------------------------------------------------------------------
// @desc    Create an education entry
// @route   POST /api/dashboard/education
// @access  Private
// ---------------------------------------------------------------------------
const createEducation = asyncHandler(async (req, res) => {
  if (req.body.isCurrent) {
    req.body.endDate = null;
  }

  const education = await Education.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Education added successfully.',
    data: education,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update an education entry
// @route   PUT /api/dashboard/education/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const updateEducation = asyncHandler(async (req, res) => {
  delete req.body.userId;

  if (req.body.isCurrent) {
    req.body.endDate = null;
  }

  const education = await Education.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Education updated successfully.',
    data: education,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete an education entry
// @route   DELETE /api/dashboard/education/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteEducation = asyncHandler(async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Education deleted successfully.',
  });
});

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
