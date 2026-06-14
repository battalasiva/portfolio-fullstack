const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institution: { type: String, required: [true, 'Institution name is required'], trim: true, maxlength: 200 },
    degree: { type: String, required: [true, 'Degree is required'], trim: true, maxlength: 200 },
    fieldOfStudy: { type: String, trim: true, maxlength: 200, default: null },
    description: { type: String, maxlength: 5000, default: null },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    grade: { type: String, trim: true, default: null },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
