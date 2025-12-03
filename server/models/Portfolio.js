const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  bio_one: {
    type: String,
    required: [true, 'First bio paragraph is required']
  },
  bio_two: {
    type: String,
    required: [true, 'Second bio paragraph is required']
  },
  bio_three: {
    type: String,
    required: [true, 'Third bio paragraph is required']
  },
  skills: [{
    category: {
      type: String,
      required: true
    },
    technologies: [{
      type: String,
      required: true
    }]
  }],
  resumeUrl: {
    type: String,
    required: [true, 'Resume URL is required']
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);