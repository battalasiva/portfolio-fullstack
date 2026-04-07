const Profile = require('../models/Profile');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// @desc    Get logged-in user's profile
// @route   GET /api/dashboard/profile
// @access  Private
// ---------------------------------------------------------------------------
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });

  if (!profile) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Profile not found. Please create one.',
    });
  }

  res.status(HTTP_STATUS.OK).json({ success: true, data: profile });
});

// ---------------------------------------------------------------------------
// @desc    Create profile (one per user)
// @route   POST /api/dashboard/profile
// @access  Private
// ---------------------------------------------------------------------------
const createProfile = asyncHandler(async (req, res) => {
  const existing = await Profile.findOne({ userId: req.user.id });

  if (existing) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Profile already exists. Use PUT to update.',
    });
  }

  const profile = await Profile.create({ ...req.body, userId: req.user.id });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Profile created successfully.',
    data: profile,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update profile
// @route   PUT /api/dashboard/profile
// @access  Private
// ---------------------------------------------------------------------------
const updateProfile = asyncHandler(async (req, res) => {
  // Prevent userId from being overwritten
  delete req.body.userId;

  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!profile) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Profile not found. Create one first.',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully.',
    data: profile,
  });
});

module.exports = { getProfile, createProfile, updateProfile };
