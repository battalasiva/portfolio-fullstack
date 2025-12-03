const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');
const { validatePortfolio } = require('../middleware/validation');

// @route   GET /api/portfolio
router.get('/', getPortfolio);

// @route   POST /api/portfolio
router.post('/', validatePortfolio, createPortfolio);

// @route   PUT /api/portfolio
router.put('/', validatePortfolio, updatePortfolio);

// @route   DELETE /api/portfolio
router.delete('/', deletePortfolio);

module.exports = router;