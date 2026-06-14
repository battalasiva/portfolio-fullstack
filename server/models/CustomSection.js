const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// CustomSection — User-defined resume sections.
//
// Architecture: Two-level structure.
//   1. CustomSection — the section itself (title, order, visibility)
//   2. CustomSectionItem — items within a section (title, description, dates)
//
// Example: User creates section "Awards" with items:
//   - "Best Developer 2024" at "Google" (Jan 2024)
//   - "Hackathon Winner" at "MLH" (Mar 2023)
// ---------------------------------------------------------------------------

const customSectionItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 200, default: '' },
    subtitle: { type: String, trim: true, maxlength: 200, default: null },
    description: { type: String, maxlength: 5000, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    isCurrent: { type: Boolean, default: false },
    url: { type: String, trim: true, maxlength: 500, default: null },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const customSectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Section title is required'], trim: true, maxlength: 100 },
    items: { type: [customSectionItemSchema], default: [] },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomSection', customSectionSchema);
