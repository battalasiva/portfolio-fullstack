const Portfolio = require('../models/Portfolio');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get portfolio info
// @route   GET /api/portfolio
// @access  Public
const getPortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOne();
  
  if (!portfolio) {
    return res.status(404).json({ 
      success: false, 
      message: 'Portfolio not found. Please create one first.' 
    });
  }
  
  res.json({ success: true, data: portfolio });
});

// @desc    Create portfolio info
// @route   POST /api/portfolio
// @access  Public
const createPortfolio = asyncHandler(async (req, res) => {
  const existingPortfolio = await Portfolio.findOne();
  
  if (existingPortfolio) {
    return res.status(400).json({ 
      success: false, 
      message: 'Portfolio already exists. Use PUT to update.' 
    });
  }
  
  const portfolio = await Portfolio.create(req.body);
  
  res.status(201).json({ success: true, data: portfolio });
});

// @desc    Update portfolio info
// @route   PUT /api/portfolio
// @access  Public
const updatePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOneAndUpdate(
    {}, 
    req.body, 
    { new: true, runValidators: true }
  );
  
  if (!portfolio) {
    return res.status(404).json({ 
      success: false, 
      message: 'Portfolio not found. Create one first.' 
    });
  }
  
  res.json({ success: true, data: portfolio });
});

// @desc    Delete portfolio info
// @route   DELETE /api/portfolio
// @access  Public
const deletePortfolio = asyncHandler(async (req, res) => {
  const portfolio = await Portfolio.findOneAndDelete();
  
  if (!portfolio) {
    return res.status(404).json({ 
      success: false, 
      message: 'Portfolio not found' 
    });
  }
  
  res.json({ success: true, message: 'Portfolio deleted successfully' });
});

module.exports = {
  getPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};