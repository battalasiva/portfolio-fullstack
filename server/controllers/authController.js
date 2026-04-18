const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// Helper — Send token response (used by both signup and login)
// ---------------------------------------------------------------------------
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();
  const userData = user.toSafeObject();

  res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Account created successfully' : 'Login successful',
    token,
    data: userData,
  });
};

// ---------------------------------------------------------------------------
// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
// ---------------------------------------------------------------------------
const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if username already taken
  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Username is already taken. Please choose another.',
    });
  }

  // Check if email already registered
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'An account with this email already exists.',
    });
  }

  // Create user — password hashing happens in the pre-save hook (User model)
  const user = await User.create({ username, email, password });

  sendTokenResponse(user, HTTP_STATUS.CREATED, res);
});

// ---------------------------------------------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ---------------------------------------------------------------------------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and explicitly include password (select: false in schema)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  // Compare password using the model's instance method
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  sendTokenResponse(user, HTTP_STATUS.OK, res);
});

// ---------------------------------------------------------------------------
// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ---------------------------------------------------------------------------
const getMe = asyncHandler(async (req, res) => {
  // req.user is set by the protect middleware
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found.',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: user.toSafeObject(),
  });
});

// ---------------------------------------------------------------------------
// @desc    Check if a username is available
// @route   GET /api/auth/check-username/:username
// @access  Public
// ---------------------------------------------------------------------------
const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const exists = await User.findOne({ username: username.toLowerCase() });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    available: !exists,
    message: exists ? 'Username is already taken.' : 'Username is available.',
  });
});

module.exports = { signup, login, getMe, checkUsername };
