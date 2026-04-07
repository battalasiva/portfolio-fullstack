const express = require('express');
const aiService = require('../services/aiService');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();

// ---------------------------------------------------------------------------
// @desc    Chat with AI about a user's portfolio
// @route   POST /api/chat
// @access  Public
//
// Body: { message: string, username: string }
// The username tells the AI whose portfolio context to load.
// ---------------------------------------------------------------------------
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { message, username } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Message is required and must be a string.',
      });
    }

    if (!username || typeof username !== 'string') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Username is required to provide portfolio context.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'AI service is not configured.',
      });
    }

    // Resolve username to userId
    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found.',
      });
    }

    const response = await aiService.chat(message, user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  })
);

module.exports = router;
