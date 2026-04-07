const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Project — Portfolio projects per user.
// ---------------------------------------------------------------------------
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
      default: null,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    technologies: {
      type: String,
      required: [true, 'Technologies are required'],
    },
    image: {
      type: String,
      default: null,
    },
    links: {
      androidLink: { type: String, default: null },
      iosLink: { type: String, default: null },
      sourceLink: { type: String, default: null },
      projectLink: { type: String, default: null },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'archived'],
      default: 'active',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
