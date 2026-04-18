const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    company: { type: String, required: [true, 'Company name is required'], trim: true, maxlength: 150 },
    role: { type: String, required: [true, 'Role is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 2000, default: null },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    location: { type: String, trim: true, default: null },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
