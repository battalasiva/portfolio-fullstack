const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certification = require('../models/Certification');
const Language = require('../models/Language');
const Interest = require('../models/Interest');
const CustomSection = require('../models/CustomSection');
const ResumeSettings = require('../models/ResumeSettings');
const { Contact } = require('../models/Contact');

// ---------------------------------------------------------------------------
// Field selections for public API
// ---------------------------------------------------------------------------
const PROFILE_FIELDS = 'name title summary profileImage location phone email socialLinks personalDetails';
const SKILL_FIELDS = 'name category proficiency order';
const PROJECT_FIELDS = 'title subtitle description technologies image links featured order';
const EXPERIENCE_FIELDS = 'company role description startDate endDate isCurrent location order';
const EDUCATION_FIELDS = 'institution degree fieldOfStudy description startDate endDate isCurrent grade order';
const CERTIFICATION_FIELDS = 'title issuer description issueDate expiryDate credentialId credentialUrl order';
const LANGUAGE_FIELDS = 'name proficiency order';
const INTEREST_FIELDS = 'name icon order';
const CUSTOM_SECTION_FIELDS = 'title items order';
const CONTACT_FIELDS = 'email phone address socialLinks';

// ---------------------------------------------------------------------------
// Resolve username
// ---------------------------------------------------------------------------
const resolveUser = async (username) => {
  return User.findOne({ username: username.toLowerCase() }).lean();
};

// ---------------------------------------------------------------------------
// Public fetchers — isPublished: true, sorted by order
// ---------------------------------------------------------------------------
const fetchProfile = (userId) =>
  Profile.findOne({ userId }).select(PROFILE_FIELDS).lean();

const fetchSkills = (userId) =>
  Skill.find({ userId, isPublished: true }).select(SKILL_FIELDS).sort({ order: 1, category: 1, name: 1 }).lean();

const fetchProjects = (userId) =>
  Project.find({ userId, status: 'active', isPublished: true }).select(PROJECT_FIELDS).sort({ order: 1, featured: -1, createdAt: -1 }).lean();

const fetchExperiences = (userId) =>
  Experience.find({ userId, isPublished: true }).select(EXPERIENCE_FIELDS).sort({ order: 1, isCurrent: -1, startDate: -1 }).lean();

const fetchEducation = (userId) =>
  Education.find({ userId, isPublished: true }).select(EDUCATION_FIELDS).sort({ order: 1, isCurrent: -1, startDate: -1 }).lean();

const fetchCertifications = (userId) =>
  Certification.find({ userId, isPublished: true }).select(CERTIFICATION_FIELDS).sort({ order: 1, issueDate: -1 }).lean();

const fetchLanguages = (userId) =>
  Language.find({ userId, isPublished: true }).select(LANGUAGE_FIELDS).sort({ order: 1, name: 1 }).lean();

const fetchInterests = (userId) =>
  Interest.find({ userId, isPublished: true }).select(INTEREST_FIELDS).sort({ order: 1, name: 1 }).lean();

const fetchCustomSections = (userId) =>
  CustomSection.find({ userId, isPublished: true }).select(CUSTOM_SECTION_FIELDS).sort({ order: 1 }).lean();

const fetchContact = (userId) =>
  Contact.findOne({ userId, isPublished: true }).select(CONTACT_FIELDS).lean();

const fetchResumeSettings = (userId) =>
  ResumeSettings.findOne({ userId }).lean();

// ---------------------------------------------------------------------------
// Combined fetch — all sections in parallel
// ---------------------------------------------------------------------------
const fetchFullPortfolio = async (userId) => {
  const [
    profile, skills, projects, experiences, education,
    certifications, languages, interests, customSections,
    contact, resumeSettings,
  ] = await Promise.all([
    fetchProfile(userId),
    fetchSkills(userId),
    fetchProjects(userId),
    fetchExperiences(userId),
    fetchEducation(userId),
    fetchCertifications(userId),
    fetchLanguages(userId),
    fetchInterests(userId),
    fetchCustomSections(userId),
    fetchContact(userId),
    fetchResumeSettings(userId),
  ]);

  return {
    profile, skills, projects, experiences, education,
    certifications, languages, interests, customSections,
    contact, resumeSettings,
  };
};

module.exports = {
  resolveUser,
  fetchProfile, fetchSkills, fetchProjects, fetchExperiences,
  fetchEducation, fetchCertifications, fetchLanguages, fetchInterests,
  fetchCustomSections, fetchContact, fetchResumeSettings,
  fetchFullPortfolio,
};
