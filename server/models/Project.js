const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Subtitle is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  technologies: {
    type: String,
    required: [true, 'Technologies are required']
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  links: {
    androidLink: {
      type: String,
      default: null
    },
    iosLink: {
      type: String,
      default: null
    },
    sourceLink: {
      type: String,
      default: null
    },
    projectLink: {
      type: String,
      default: null
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);