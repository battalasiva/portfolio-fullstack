const express = require('express');
const {
  resolveUser, fetchFullPortfolio, fetchProfile, fetchSkills, fetchProjects,
  fetchExperiences, fetchEducation, fetchCertifications, fetchLanguages,
  fetchInterests, fetchCustomSections, fetchContact,
} = require('../services/portfolioService');
const { ContactMessage } = require('../models/Contact');
const { downloadPublicResume } = require('../controllers/resumeController');
const { validateContactMessage } = require('../validators/dashboard');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();

// Resolve username for all /:username routes
const resolveUsername = asyncHandler(async (req, res, next) => {
  const user = await resolveUser(req.params.username);
  if (!user) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'User not found.' });
  req.portfolioUser = user;
  next();
});

router.use('/:username', resolveUsername);

// Full portfolio (all sections in one call)
router.get('/:username', asyncHandler(async (req, res) => {
  const data = await fetchFullPortfolio(req.portfolioUser._id);
  if (!data.profile) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Portfolio not set up yet.' });
  res.status(HTTP_STATUS.OK).json({ success: true, data: { user: { username: req.portfolioUser.username }, ...data } });
}));

// Individual section endpoints
const sectionHandler = (fetcher, notFoundMsg) => asyncHandler(async (req, res) => {
  const data = await fetcher(req.portfolioUser._id);
  if (data === null && notFoundMsg) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: notFoundMsg });
  res.status(HTTP_STATUS.OK).json({ success: true, data: data || [] });
});

router.get('/:username/profile', sectionHandler(fetchProfile, 'Profile not found.'));
router.get('/:username/skills', sectionHandler(fetchSkills));
router.get('/:username/projects', sectionHandler(fetchProjects));
router.get('/:username/experiences', sectionHandler(fetchExperiences));
router.get('/:username/education', sectionHandler(fetchEducation));
router.get('/:username/certifications', sectionHandler(fetchCertifications));
router.get('/:username/languages', sectionHandler(fetchLanguages));
router.get('/:username/interests', sectionHandler(fetchInterests));
router.get('/:username/custom-sections', sectionHandler(fetchCustomSections));
router.get('/:username/contact', sectionHandler(fetchContact, 'Contact not found.'));

// Resume PDF download
router.get('/:username/resume', downloadPublicResume);

// Contact message
router.post('/:username/messages', validateContactMessage, asyncHandler(async (req, res) => {
  const message = await ContactMessage.create({ ...req.body, recipientId: req.portfolioUser._id });
  res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Message sent.', data: { id: message._id } });
}));

module.exports = router;
