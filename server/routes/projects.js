const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects with filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { status, featured, limit, page } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (featured !== undefined) filter.featured = featured === 'true';
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const projects = await Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip);
      
    const total = await Project.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: projects,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: projects.length,
        totalRecords: total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE new project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json({ success: true, data: savedProject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    
    res.json({ success: true, data: project });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID' 
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Project deleted successfully',
      data: project 
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;