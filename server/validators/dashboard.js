const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
const validateProfile = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Professional title is required')
    .isLength({ max: 150 })
    .withMessage('Title cannot exceed 150 characters'),
  body('summary')
    .trim()
    .notEmpty()
    .withMessage('Summary is required')
    .isLength({ max: 3000 })
    .withMessage('Summary cannot exceed 3000 characters'),
  body('profileImage').optional({ nullable: true }).trim(),
  body('location').optional({ nullable: true }).trim(),
  body('phone').optional({ nullable: true }).trim(),
  body('email').optional({ nullable: true }).trim(),

  // Social links
  body('socialLinks')
    .optional()
    .isArray()
    .withMessage('Social links must be an array'),
  body('socialLinks.*.platform')
    .if(body('socialLinks').exists())
    .trim()
    .notEmpty()
    .withMessage('Platform name is required'),
  body('socialLinks.*.url')
    .if(body('socialLinks').exists())
    .trim()
    .notEmpty()
    .withMessage('URL is required'),

  // Personal details
  body('personalDetails')
    .optional()
    .isArray()
    .withMessage('Personal details must be an array'),
  body('personalDetails.*.label')
    .if(body('personalDetails').exists())
    .trim()
    .notEmpty()
    .withMessage('Detail label is required'),
  body('personalDetails.*.value')
    .if(body('personalDetails').exists())
    .trim()
    .notEmpty()
    .withMessage('Detail value is required'),
  body('personalDetails.*.link')
    .optional({ nullable: true })
    .trim(),

  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Skill
// ---------------------------------------------------------------------------
const validateSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 100 })
    .withMessage('Skill name cannot exceed 100 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters'),
  body('proficiency')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Proficiency must be beginner, intermediate, advanced, or expert'),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Project
// ---------------------------------------------------------------------------
const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 3000 })
    .withMessage('Description cannot exceed 3000 characters'),
  body('technologies')
    .trim()
    .notEmpty()
    .withMessage('Technologies are required'),
  body('subtitle').optional({ nullable: true }).trim(),
  body('image').optional({ nullable: true }).trim(),
  body('featured').optional().isBoolean().withMessage('Featured must be boolean'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'archived'])
    .withMessage('Status must be active, inactive, or archived'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean'),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
const validateExperience = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 150 })
    .withMessage('Company name cannot exceed 150 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isLength({ max: 150 })
    .withMessage('Role cannot exceed 150 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('description').optional({ nullable: true }).trim(),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('isCurrent').optional().isBoolean().withMessage('isCurrent must be boolean'),
  body('location').optional({ nullable: true }).trim(),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
const validateEducation = [
  body('institution')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ max: 200 })
    .withMessage('Institution name cannot exceed 200 characters'),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required')
    .isLength({ max: 200 })
    .withMessage('Degree cannot exceed 200 characters'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('fieldOfStudy').optional({ nullable: true }).trim(),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('End date must be a valid date'),
  body('isCurrent').optional().isBoolean().withMessage('isCurrent must be boolean'),
  body('grade').optional({ nullable: true }).trim(),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Certification
// ---------------------------------------------------------------------------
const validateCertification = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Certification title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Issuer is required')
    .isLength({ max: 200 })
    .withMessage('Issuer cannot exceed 200 characters'),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Issue date must be a valid date'),
  body('expiryDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  body('credentialId').optional({ nullable: true }).trim(),
  body('credentialUrl').optional({ nullable: true }).trim(),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
const validateContact = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone').optional({ nullable: true }).trim(),
  body('address').optional({ nullable: true }).trim(),
  body('socialLinks').optional().isArray().withMessage('Social links must be an array'),
  body('socialLinks.*.platform')
    .if(body('socialLinks').exists())
    .trim()
    .notEmpty()
    .withMessage('Platform name is required'),
  body('socialLinks.*.url')
    .if(body('socialLinks').exists())
    .trim()
    .notEmpty()
    .withMessage('URL is required'),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Contact Message (sent by visitors — no auth)
// ---------------------------------------------------------------------------
const validateContactMessage = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('subject').optional().trim(),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Language
// ---------------------------------------------------------------------------
const validateLanguage = [
  body('name').trim().notEmpty().withMessage('Language name is required').isLength({ max: 100 }),
  body('proficiency').optional().isIn(['native', 'fluent', 'advanced', 'intermediate', 'basic']),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Interest
// ---------------------------------------------------------------------------
const validateInterest = [
  body('name').trim().notEmpty().withMessage('Interest name is required').isLength({ max: 100 }),
  body('icon').optional({ nullable: true }).trim(),
  handleValidationErrors,
];

// ---------------------------------------------------------------------------
// Custom Section
// ---------------------------------------------------------------------------
const validateCustomSection = [
  body('title').trim().notEmpty().withMessage('Section title is required').isLength({ max: 100 }),
  handleValidationErrors,
];

const validateCustomSectionItem = [
  body('title').optional().trim().isLength({ max: 200 }),
  body('subtitle').optional({ nullable: true }).trim(),
  body('description').optional({ nullable: true }),
  body('startDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date'),
  body('endDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date'),
  body('isCurrent').optional().isBoolean(),
  body('url').optional({ nullable: true }).trim(),
  handleValidationErrors,
];

module.exports = {
  validateProfile,
  validateSkill,
  validateProject,
  validateExperience,
  validateEducation,
  validateCertification,
  validateContact,
  validateContactMessage,
  validateLanguage,
  validateInterest,
  validateCustomSection,
  validateCustomSectionItem,
};
