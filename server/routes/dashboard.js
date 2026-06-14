const express = require('express');
const { protect, authorizeOwnership } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Controllers
const { getProfile, createProfile, updateProfile } = require('../controllers/profileController');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const { getProjects, getProject, createProject, updateProject, deleteProject, togglePublish } = require('../controllers/projectController');
const { getExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController');
const { getEducation, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { getCertifications, createCertification, updateCertification, deleteCertification } = require('../controllers/certificationController');
const { getLanguages, createLanguage, updateLanguage, deleteLanguage } = require('../controllers/languageController');
const { getInterests, createInterest, updateInterest, deleteInterest } = require('../controllers/interestController');
const { getSections, createSection, updateSection, deleteSection, addItem, updateItem, deleteItem, reorderItems } = require('../controllers/customSectionController');
const { getContact, createContact, updateContact, getMessages, getMessage, updateMessage, deleteMessage } = require('../controllers/contactController');
const { downloadResume, previewResume } = require('../controllers/resumeController');
const { getSettings, updateSettings, reorderSections } = require('../controllers/resumeSettingsController');
const { createTogglePublish, createSingletonTogglePublish } = require('../controllers/togglePublishController');
const { createReorderHandler } = require('../controllers/reorderController');

// Validators
const {
  validateProfile, validateSkill, validateProject, validateExperience,
  validateEducation, validateCertification, validateContact,
  validateLanguage, validateInterest, validateCustomSection, validateCustomSectionItem,
} = require('../validators/dashboard');

// Models
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Language = require('../models/Language');
const Interest = require('../models/Interest');
const CustomSection = require('../models/CustomSection');
const { Contact } = require('../models/Contact');
const { ContactMessage } = require('../models/Contact');

const router = express.Router();

// All routes require authentication
router.use(protect);

// ===========================================================================
// Profile
// ===========================================================================
router.get('/profile', getProfile);
router.post('/profile', validateProfile, createProfile);
router.put('/profile', validateProfile, updateProfile);

// ===========================================================================
// Skills
// ===========================================================================
router.get('/skills', getSkills);
router.post('/skills', validateSkill, createSkill);
router.put('/skills/:id', authorizeOwnership(Skill), validateSkill, updateSkill);
router.delete('/skills/:id', authorizeOwnership(Skill), deleteSkill);
router.patch('/skills/:id/publish', authorizeOwnership(Skill), createTogglePublish());
router.put('/skills/reorder', createReorderHandler(Skill));

// ===========================================================================
// Projects
// ===========================================================================
router.get('/projects', getProjects);
router.get('/projects/:id', authorizeOwnership(Project), getProject);
router.post('/projects', validateProject, createProject);
router.put('/projects/:id', authorizeOwnership(Project), validateProject, updateProject);
router.delete('/projects/:id', authorizeOwnership(Project), deleteProject);
router.patch('/projects/:id/publish', authorizeOwnership(Project), togglePublish);
router.put('/projects/reorder', createReorderHandler(Project));

// ===========================================================================
// Experience
// ===========================================================================
router.get('/experiences', getExperiences);
router.post('/experiences', validateExperience, createExperience);
router.put('/experiences/:id', authorizeOwnership(Experience), validateExperience, updateExperience);
router.delete('/experiences/:id', authorizeOwnership(Experience), deleteExperience);
router.patch('/experiences/:id/publish', authorizeOwnership(Experience), createTogglePublish());
router.put('/experiences/reorder', createReorderHandler(Experience));

// ===========================================================================
// Education
// ===========================================================================
router.get('/education', getEducation);
router.post('/education', validateEducation, createEducation);
router.put('/education/:id', authorizeOwnership(Education), validateEducation, updateEducation);
router.delete('/education/:id', authorizeOwnership(Education), deleteEducation);
router.patch('/education/:id/publish', authorizeOwnership(Education), createTogglePublish());
router.put('/education/reorder', createReorderHandler(Education));

// ===========================================================================
// Certifications
// ===========================================================================
router.get('/certifications', getCertifications);
router.post('/certifications', validateCertification, createCertification);
router.put('/certifications/:id', authorizeOwnership(Certification), validateCertification, updateCertification);
router.delete('/certifications/:id', authorizeOwnership(Certification), deleteCertification);
router.patch('/certifications/:id/publish', authorizeOwnership(Certification), createTogglePublish());
router.put('/certifications/reorder', createReorderHandler(Certification));

// ===========================================================================
// Languages
// ===========================================================================
router.get('/languages', getLanguages);
router.post('/languages', validateLanguage, createLanguage);
router.put('/languages/:id', authorizeOwnership(Language), validateLanguage, updateLanguage);
router.delete('/languages/:id', authorizeOwnership(Language), deleteLanguage);
router.patch('/languages/:id/publish', authorizeOwnership(Language), createTogglePublish());
router.put('/languages/reorder', createReorderHandler(Language));

// ===========================================================================
// Interests
// ===========================================================================
router.get('/interests', getInterests);
router.post('/interests', validateInterest, createInterest);
router.put('/interests/:id', authorizeOwnership(Interest), validateInterest, updateInterest);
router.delete('/interests/:id', authorizeOwnership(Interest), deleteInterest);
router.patch('/interests/:id/publish', authorizeOwnership(Interest), createTogglePublish());
router.put('/interests/reorder', createReorderHandler(Interest));

// ===========================================================================
// Custom Sections (user-defined sections with nested items)
// ===========================================================================
router.get('/custom-sections', getSections);
router.post('/custom-sections', validateCustomSection, createSection);
router.put('/custom-sections/:id', authorizeOwnership(CustomSection), validateCustomSection, updateSection);
router.delete('/custom-sections/:id', authorizeOwnership(CustomSection), deleteSection);
router.patch('/custom-sections/:id/publish', authorizeOwnership(CustomSection), createTogglePublish());

// Items within a custom section
router.post('/custom-sections/:id/items', authorizeOwnership(CustomSection), validateCustomSectionItem, addItem);
router.put('/custom-sections/:id/items/:itemId', authorizeOwnership(CustomSection), validateCustomSectionItem, updateItem);
router.delete('/custom-sections/:id/items/:itemId', authorizeOwnership(CustomSection), deleteItem);
router.put('/custom-sections/:id/items/reorder', authorizeOwnership(CustomSection), reorderItems);

// ===========================================================================
// Contact
// ===========================================================================
router.get('/contact', getContact);
router.post('/contact', validateContact, createContact);
router.put('/contact', validateContact, updateContact);
router.patch('/contact/publish', createSingletonTogglePublish(Contact));

// ===========================================================================
// Messages
// ===========================================================================
router.get('/messages', getMessages);
router.get('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), getMessage);
router.put('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), updateMessage);
router.delete('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), deleteMessage);

// ===========================================================================
// Resume Settings (section order, theme, preferences)
// ===========================================================================
router.get('/resume-settings', getSettings);
router.put('/resume-settings', updateSettings);
router.put('/resume-settings/reorder', reorderSections);

// ===========================================================================
// Resume PDF
// ===========================================================================
router.get('/resume/download', downloadResume);
router.get('/resume/preview', previewResume);

// ===========================================================================
// Image Upload
// ===========================================================================
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }
  res.status(200).json({ success: true, message: 'Image uploaded.', imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;
