const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Profile — One per user. Contains personal/summary info for the portfolio.
// ---------------------------------------------------------------------------
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // One profile per user
      index: true,
    },
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
      maxlength: [2000, 'Summary cannot exceed 2000 characters'],
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
    website: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
