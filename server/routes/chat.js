const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// POST /api/chat - Send message to AI
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string'
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Gemini API key not configured'
      });
    }

    const conversationHistory = history || [];
    const response = await aiService.chat(message, conversationHistory);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat request',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
