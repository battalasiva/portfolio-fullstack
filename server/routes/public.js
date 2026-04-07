const express = require('express');
const {
  resolveUser,
  fetchFullPortfolio,
  fetchProfile,
  fetchSkills,
  fetchProjects,
  fetchExperiences,
  fetchEducation,
  fetchCertifications,
  fetchContact,
} = require('../services/portfolioService');
const { ContactMessage } = require('../models/Contact');
const { downloadPublicResume } = require('../controllers/resumeController');
const { validateContactMessage } = require('../validators/dashboard');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();

// ---------------------------------------------------------------------------
// Middleware — Resolve username to userId for all /:username routes
// Runs once, attaches req.portfolioUser so individual handlers don't repeat it
// ---------------------------------------------------------------------------
const resolveUsername = asyncHandler(async (req, res, next) => {
  const user = await resolveUser(req.params.username);

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found.',
    });
  }

  req.portfolioUser = user;
  next();
});

// Apply to all routes under /:username
router.use('/:username', resolveUsername);

// ---------------------------------------------------------------------------
// @desc    Get complete public portfolio (all sections in one call)
// @route   GET /api/u/:username
// @access  Public
//
// This is the PRIMARY endpoint — frontend calls this on initial page load.
// Returns everything in a single response. All 7 queries run in parallel.
// ---------------------------------------------------------------------------
router.get(
  '/:username',
  asyncHandler(async (req, res) => {
    const { _id: userId, username } = req.portfolioUser;

    const data = await fetchFullPortfolio(userId);

    if (!data.profile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'This user has not set up their portfolio yet.',
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        user: { username },
        ...data,
      },
    });
  })
);

// ---------------------------------------------------------------------------
// Individual section endpoints — for granular fetching / lazy loading
// Frontend can call these if it only needs to refresh one section.
// ---------------------------------------------------------------------------

// @route   GET /api/u/:username/profile
router.get(
  '/:username/profile',
  asyncHandler(async (req, res) => {
    const profile = await fetchProfile(req.portfolioUser._id);

    if (!profile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    res.status(HTTP_STATUS.OK).json({ success: true, data: profile });
  })
);

// @route   GET /api/u/:username/skills
router.get(
  '/:username/skills',
  asyncHandler(async (req, res) => {
    const skills = await fetchSkills(req.portfolioUser._id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: skills });
  })
);

// @route   GET /api/u/:username/projects
router.get(
  '/:username/projects',
  asyncHandler(async (req, res) => {
    const projects = await fetchProjects(req.portfolioUser._id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: projects });
  })
);

// @route   GET /api/u/:username/experiences
router.get(
  '/:username/experiences',
  asyncHandler(async (req, res) => {
    const experiences = await fetchExperiences(req.portfolioUser._id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: experiences });
  })
);

// @route   GET /api/u/:username/education
router.get(
  '/:username/education',
  asyncHandler(async (req, res) => {
    const education = await fetchEducation(req.portfolioUser._id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: education });
  })
);

// @route   GET /api/u/:username/certifications
router.get(
  '/:username/certifications',
  asyncHandler(async (req, res) => {
    const certifications = await fetchCertifications(req.portfolioUser._id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: certifications });
  })
);

// @route   GET /api/u/:username/contact
router.get(
  '/:username/contact',
  asyncHandler(async (req, res) => {
    const contact = await fetchContact(req.portfolioUser._id);

    if (!contact) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Contact info not found.',
      });
    }

    res.status(HTTP_STATUS.OK).json({ success: true, data: contact });
  })
);

// ---------------------------------------------------------------------------
// @desc    Download public resume PDF
// @route   GET /api/u/:username/resume
// @access  Public
// ---------------------------------------------------------------------------
router.get('/:username/resume', downloadPublicResume);

// ---------------------------------------------------------------------------
// @desc    Send a contact message to a portfolio owner
// @route   POST /api/u/:username/messages
// @access  Public
// ---------------------------------------------------------------------------
router.post(
  '/:username/messages',
  validateContactMessage,
  asyncHandler(async (req, res) => {
    const message = await ContactMessage.create({
      ...req.body,
      recipientId: req.portfolioUser._id,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Message sent successfully.',
      data: { id: message._id },
    });
  })
);

module.exports = router;
