const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Skill — Individual skill entries per user.
// Grouped by category on the frontend (e.g., "Frontend", "Backend", "DevOps").
// ---------------------------------------------------------------------------
const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [100, 'Skill name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate skill names per user within the same category
skillSchema.index({ userId: 1, name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
