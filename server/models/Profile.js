const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Profile — One per user. Contains all personal/professional info.
//
// Design:
//   socialLinks     — Array of { platform, url } for LinkedIn, GitHub, etc.
//   personalDetails — Array of { label, value, link? } for nationality, DOB,
//                     visa, availability, gender, etc. Also supports custom
//                     user-defined fields. The frontend controls which
//                     predefined options to show; the backend stores them all
//                     the same way.
// ---------------------------------------------------------------------------

const socialLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      maxlength: [50, 'Platform name cannot exceed 50 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
  },
  { _id: true }
);

const personalDetailSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    value: {
      type: String,
      required: [true, 'Value is required'],
      trim: true,
      maxlength: [500, 'Value cannot exceed 500 characters'],
    },
    link: {
      type: String,
      trim: true,
      default: null,
      maxlength: [500, 'Link cannot exceed 500 characters'],
    },
  },
  { _id: true }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },

    // --- Core fields (always visible) ---
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      maxlength: [3000, 'Summary cannot exceed 3000 characters'],
    },
    profileImage: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      default: null,
    },

    // --- Social / professional links ---
    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },

    // --- Personal details (dynamic key-value with optional clickable link) ---
    // Predefined options: Nationality, Date of Birth, Gender/Pronoun, Visa,
    // Availability, Work Mode, Relocation, Expected Salary, Driving License,
    // Security Clearance, Marital Status, Disability, Passport/ID, Second Phone
    // Custom: user can add any label they want
    personalDetails: {
      type: [personalDetailSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
