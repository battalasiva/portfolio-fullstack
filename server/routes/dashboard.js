const express = require('express');
const { protect, authorizeOwnership } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Controllers
const { getProfile, createProfile, updateProfile } = require('../controllers/profileController');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');
const {
  getProjects, getProject, createProject, updateProject, deleteProject, togglePublish,
} = require('../controllers/projectController');
const {
  getExperiences, createExperience, updateExperience, deleteExperience,
} = require('../controllers/experienceController');
const {
  getEducation, createEducation, updateEducation, deleteEducation,
} = require('../controllers/educationController');
const {
  getCertifications, createCertification, updateCertification, deleteCertification,
} = require('../controllers/certificationController');
const {
  getContact, createContact, updateContact,
  getMessages, getMessage, updateMessage, deleteMessage,
} = require('../controllers/contactController');
const { downloadResume, previewResume } = require('../controllers/resumeController');
const { createTogglePublish, createSingletonTogglePublish } = require('../controllers/togglePublishController');
const { Contact } = require('../models/Contact');

// Validators
const {
  validateProfile, validateSkill, validateProject,
  validateExperience, validateEducation, validateCertification,
  validateContact,
} = require('../validators/dashboard');

// Models (for authorizeOwnership)
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const { ContactMessage } = require('../models/Contact');

const router = express.Router();

// ---------------------------------------------------------------------------
// All routes below require authentication
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// Profile — /api/dashboard/profile
// ---------------------------------------------------------------------------
router.get('/profile', getProfile);
router.post('/profile', validateProfile, createProfile);
router.put('/profile', validateProfile, updateProfile);

// ---------------------------------------------------------------------------
// Skills — /api/dashboard/skills
// ---------------------------------------------------------------------------
router.get('/skills', getSkills);
router.post('/skills', validateSkill, createSkill);
router.put('/skills/:id', authorizeOwnership(Skill), validateSkill, updateSkill);
router.delete('/skills/:id', authorizeOwnership(Skill), deleteSkill);
router.patch('/skills/:id/publish', authorizeOwnership(Skill), createTogglePublish());

// ---------------------------------------------------------------------------
// Projects — /api/dashboard/projects
// ---------------------------------------------------------------------------
router.get('/projects', getProjects);
router.get('/projects/:id', authorizeOwnership(Project), getProject);
router.post('/projects', validateProject, createProject);
router.put('/projects/:id', authorizeOwnership(Project), validateProject, updateProject);
router.delete('/projects/:id', authorizeOwnership(Project), deleteProject);
router.patch('/projects/:id/publish', authorizeOwnership(Project), togglePublish);

// ---------------------------------------------------------------------------
// Experience — /api/dashboard/experiences
// ---------------------------------------------------------------------------
router.get('/experiences', getExperiences);
router.post('/experiences', validateExperience, createExperience);
router.put('/experiences/:id', authorizeOwnership(Experience), validateExperience, updateExperience);
router.delete('/experiences/:id', authorizeOwnership(Experience), deleteExperience);
router.patch('/experiences/:id/publish', authorizeOwnership(Experience), createTogglePublish());

// ---------------------------------------------------------------------------
// Education — /api/dashboard/education
// ---------------------------------------------------------------------------
router.get('/education', getEducation);
router.post('/education', validateEducation, createEducation);
router.put('/education/:id', authorizeOwnership(Education), validateEducation, updateEducation);
router.delete('/education/:id', authorizeOwnership(Education), deleteEducation);
router.patch('/education/:id/publish', authorizeOwnership(Education), createTogglePublish());

// ---------------------------------------------------------------------------
// Certifications — /api/dashboard/certifications
// ---------------------------------------------------------------------------
router.get('/certifications', getCertifications);
router.post('/certifications', validateCertification, createCertification);
router.put('/certifications/:id', authorizeOwnership(Certification), validateCertification, updateCertification);
router.delete('/certifications/:id', authorizeOwnership(Certification), deleteCertification);
router.patch('/certifications/:id/publish', authorizeOwnership(Certification), createTogglePublish());

// ---------------------------------------------------------------------------
// Contact — /api/dashboard/contact
// ---------------------------------------------------------------------------
router.get('/contact', getContact);
router.post('/contact', validateContact, createContact);
router.put('/contact', validateContact, updateContact);
router.patch('/contact/publish', createSingletonTogglePublish(Contact));

// ---------------------------------------------------------------------------
// Messages — /api/dashboard/messages
// ---------------------------------------------------------------------------
router.get('/messages', getMessages);
router.get('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), getMessage);
router.put('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), updateMessage);
router.delete('/messages/:id', authorizeOwnership(ContactMessage, 'recipientId'), deleteMessage);

// ---------------------------------------------------------------------------
// Resume — /api/dashboard/resume
// ---------------------------------------------------------------------------
router.get('/resume/download', downloadResume);
router.get('/resume/preview', previewResume);

// ---------------------------------------------------------------------------
// Image Upload — /api/dashboard/upload
// ---------------------------------------------------------------------------
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully.',
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
