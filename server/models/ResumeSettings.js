const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// ResumeSettings — Per-user resume configuration.
//
// Controls:
//   sectionOrder — Array of section keys in display order. Frontend uses this
//                  for drag-and-drop reordering. PDF service renders in this order.
//   theme        — Colors, fonts, spacing for resume rendering.
//   preferences  — Date format, skill display style, etc.
//
// Default section order matches a standard professional resume.
// Custom sections are referenced by their MongoDB _id prefixed with "custom_".
// ---------------------------------------------------------------------------

const DEFAULT_SECTION_ORDER = [
  'profile',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'interests',
  'contact',
];

const resumeSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    // --- Section ordering ---
    // Array of section keys. Built-in keys: profile, summary, experience,
    // education, skills, projects, certifications, languages, interests, contact.
    // Custom sections use: "custom_<mongoId>"
    sectionOrder: {
      type: [String],
      default: DEFAULT_SECTION_ORDER,
    },

    // --- Sections visibility (which sections appear in resume) ---
    // Key = section key, value = boolean. Missing key = visible by default.
    hiddenSections: {
      type: Map,
      of: Boolean,
      default: {},
    },

    // --- Theme ---
    theme: {
      accentColor: { type: String, default: '#0f3460', maxlength: 20 },
      fontFamily: {
        type: String,
        enum: ['Helvetica', 'Times-Roman', 'Courier'],
        default: 'Helvetica',
      },
      fontSize: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
      },
      lineSpacing: {
        type: String,
        enum: ['compact', 'normal', 'relaxed'],
        default: 'normal',
      },
    },

    // --- Preferences ---
    preferences: {
      dateFormat: {
        type: String,
        enum: ['MMM YYYY', 'MM/YYYY', 'YYYY', 'MMMM YYYY'],
        default: 'MMM YYYY',
      },
      skillDisplay: {
        type: String,
        enum: ['comma', 'pills', 'bars', 'grouped'],
        default: 'grouped',
      },
      showProfileImage: { type: Boolean, default: true },
      showIcons: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Static method to get or create settings for a user
resumeSettingsSchema.statics.getOrCreate = async function (userId) {
  let settings = await this.findOne({ userId });
  if (!settings) {
    settings = await this.create({ userId });
  }
  return settings;
};

module.exports = mongoose.model('ResumeSettings', resumeSettingsSchema);
