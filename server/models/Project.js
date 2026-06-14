const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    subtitle: { type: String, trim: true, maxlength: 200, default: null },
    description: { type: String, required: [true, 'Description is required'], maxlength: 5000 },
    technologies: { type: String, required: [true, 'Technologies are required'] },
    image: { type: String, default: null },
    links: {
      androidLink: { type: String, default: null },
      iosLink: { type: String, default: null },
      sourceLink: { type: String, default: null },
      projectLink: { type: String, default: null },
    },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
