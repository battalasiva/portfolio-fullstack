const Project = require('../models/Project');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
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
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) {
    return res.status(404).json({ 
      success: false, 
      message: 'Project not found' 
    });
  }
  
  res.json({ success: true, data: project });
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Public
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  
  res.status(201).json({ success: true, data: project });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Public
const updateProject = asyncHandler(async (req, res) => {
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
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Public
const deleteProject = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};