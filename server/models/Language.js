const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Language name is required'], trim: true, maxlength: 100 },
    proficiency: {
      type: String,
      enum: ['native', 'fluent', 'advanced', 'intermediate', 'basic'],
      default: 'intermediate',
    },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

languageSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Language', languageSchema);
