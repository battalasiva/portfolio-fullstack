const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Portfolio validation rules
const validatePortfolio = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('bio_one').trim().notEmpty().withMessage('First bio paragraph is required'),
  body('bio_two').trim().notEmpty().withMessage('Second bio paragraph is required'),
  body('bio_three').trim().notEmpty().withMessage('Third bio paragraph is required'),
  body('resumeUrl').isURL().withMessage('Valid resume URL is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

// Project validation rules
const validateProject = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('subtitle').trim().notEmpty().withMessage('Subtitle is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('technologies').trim().notEmpty().withMessage('Technologies are required'),
  body('image').trim().notEmpty().withMessage('Image is required'),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  handleValidationErrors
];

// Contact validation rules
const validateContact = [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  handleValidationErrors
];

// Contact message validation rules
const validateContactMessage = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('subject').optional().trim(),
  handleValidationErrors
];

module.exports = {
  validatePortfolio,
  validateProject,
  validateContact,
  validateContactMessage,
  handleValidationErrors
};