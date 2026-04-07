const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const { Contact } = require('../models/Contact');

// ---------------------------------------------------------------------------
// Field selections — only return what the frontend needs (no userId, __v)
// ---------------------------------------------------------------------------
const PROFILE_FIELDS = 'name title summary profileImage location website';
const SKILL_FIELDS = 'name category proficiency';
const PROJECT_FIELDS = 'title subtitle description technologies image links featured';
const EXPERIENCE_FIELDS = 'company role description startDate endDate isCurrent location';
const EDUCATION_FIELDS = 'institution degree fieldOfStudy startDate endDate isCurrent grade';
const CERTIFICATION_FIELDS = 'title issuer issueDate expiryDate credentialId credentialUrl';
const CONTACT_FIELDS = 'email phone address socialLinks';

// ---------------------------------------------------------------------------
// Resolve username → userId. Returns null if not found.
// ---------------------------------------------------------------------------
const resolveUser = async (username) => {
  return User.findOne({ username: username.toLowerCase() }).lean();
};

// ---------------------------------------------------------------------------
// Individual section fetchers — each returns lean JS objects
// ---------------------------------------------------------------------------
const fetchProfile = (userId) => {
  return Profile.findOne({ userId }).select(PROFILE_FIELDS).lean();
};

const fetchSkills = (userId) => {
  return Skill.find({ userId }).select(SKILL_FIELDS).sort({ category: 1, name: 1 }).lean();
};

const fetchProjects = (userId) => {
  return Project.find({ userId, status: 'active', isPublished: true })
    .select(PROJECT_FIELDS)
    .sort({ featured: -1, createdAt: -1 })
    .lean();
};

const fetchExperiences = (userId) => {
  return Experience.find({ userId })
    .select(EXPERIENCE_FIELDS)
    .sort({ isCurrent: -1, startDate: -1 })
    .lean();
};

const fetchEducation = (userId) => {
  return Education.find({ userId })
    .select(EDUCATION_FIELDS)
    .sort({ isCurrent: -1, startDate: -1 })
    .lean();
};

const fetchCertifications = (userId) => {
  return Certification.find({ userId })
    .select(CERTIFICATION_FIELDS)
    .sort({ issueDate: -1 })
    .lean();
};

const fetchContact = (userId) => {
  return Contact.findOne({ userId }).select(CONTACT_FIELDS).lean();
};

// ---------------------------------------------------------------------------
// Combined fetch — all sections in parallel. Single DB round-trip.
// Used by: full portfolio endpoint, resume generation, AI context.
// ---------------------------------------------------------------------------
const fetchFullPortfolio = async (userId) => {
  const [profile, skills, projects, experiences, education, certifications, contact] =
    await Promise.all([
      fetchProfile(userId),
      fetchSkills(userId),
      fetchProjects(userId),
      fetchExperiences(userId),
      fetchEducation(userId),
      fetchCertifications(userId),
      fetchContact(userId),
    ]);

  return { profile, skills, projects, experiences, education, certifications, contact };
};

module.exports = {
  resolveUser,
  fetchProfile,
  fetchSkills,
  fetchProjects,
  fetchExperiences,
  fetchEducation,
  fetchCertifications,
  fetchContact,
  fetchFullPortfolio,
};
