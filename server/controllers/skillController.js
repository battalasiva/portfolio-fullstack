const Skill = require('../models/Skill');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// @desc    Get all skills for logged-in user
// @route   GET /api/dashboard/skills
// @access  Private
// ---------------------------------------------------------------------------
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find({ userId: req.user.id }).sort({ category: 1, name: 1 });

  res.status(HTTP_STATUS.OK).json({ success: true, data: skills });
});

// ---------------------------------------------------------------------------
// @desc    Create a skill
// @route   POST /api/dashboard/skills
// @access  Private
// ---------------------------------------------------------------------------
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create({ ...req.body, userId: req.user.id });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Skill added successfully.',
    data: skill,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update a skill
// @route   PUT /api/dashboard/skills/:id
// @access  Private (ownership verified by middleware — req.resource available)
// ---------------------------------------------------------------------------
const updateSkill = asyncHandler(async (req, res) => {
  delete req.body.userId;

  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Skill updated successfully.',
    data: skill,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete a skill
// @route   DELETE /api/dashboard/skills/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteSkill = asyncHandler(async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Skill deleted successfully.',
  });
});

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
