const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, getMe, checkUsername } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../validators/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ---------------------------------------------------------------------------
// Rate limiter — Stricter limit for auth endpoints (brute-force protection)
// ---------------------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per window
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// Public Routes
// ---------------------------------------------------------------------------
router.post('/signup', authLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.get('/check-username/:username', checkUsername);

// ---------------------------------------------------------------------------
// Private Routes (JWT required)
// ---------------------------------------------------------------------------
router.get('/me', protect, getMe);

module.exports = router;
