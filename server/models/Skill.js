const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Skill name is required'], trim: true, maxlength: 100 },
    category: { type: String, required: [true, 'Category is required'], trim: true, maxlength: 50 },
    proficiency: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

skillSchema.index({ userId: 1, name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
