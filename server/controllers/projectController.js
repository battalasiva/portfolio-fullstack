const Project = require('../models/Project');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS, PAGINATION_DEFAULTS } = require('../utils/constants');
const { deleteFile } = require('../utils/fileHelper');

// ---------------------------------------------------------------------------
// @desc    Get all projects for logged-in user
// @route   GET /api/dashboard/projects
// @access  Private
// ---------------------------------------------------------------------------
const getProjects = asyncHandler(async (req, res) => {
  const { status, featured, limit, page } = req.query;

  const filter = { userId: req.user.id };
  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured === 'true';

  const pageNum = parseInt(page) || PAGINATION_DEFAULTS.PAGE;
  const limitNum = Math.min(
    parseInt(limit) || PAGINATION_DEFAULTS.LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    Project.countDocuments(filter),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: projects,
    pagination: {
      current: pageNum,
      total: Math.ceil(total / limitNum),
      count: projects.length,
      totalRecords: total,
    },
  });
});

// ---------------------------------------------------------------------------
// @desc    Get single project
// @route   GET /api/dashboard/projects/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const getProject = asyncHandler(async (req, res) => {
  // req.resource is set by authorizeOwnership middleware
  res.status(HTTP_STATUS.OK).json({ success: true, data: req.resource });
});

// ---------------------------------------------------------------------------
// @desc    Create a project
// @route   POST /api/dashboard/projects
// @access  Private
// ---------------------------------------------------------------------------
const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create({ ...req.body, userId: req.user.id });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Project created successfully.',
    data: project,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update a project
// @route   PUT /api/dashboard/projects/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const updateProject = asyncHandler(async (req, res) => {
  delete req.body.userId;

  const oldProject = req.resource;

  // Clean up old image if a new one is provided
  if (
    req.body.image &&
    req.body.image !== oldProject.image &&
    oldProject.image &&
    oldProject.image.startsWith('/uploads/')
  ) {
    deleteFile(oldProject.image);
  }

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Project updated successfully.',
    data: project,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete a project
// @route   DELETE /api/dashboard/projects/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteProject = asyncHandler(async (req, res) => {
  const project = req.resource;

  // Clean up associated image
  if (project.image && project.image.startsWith('/uploads/')) {
    deleteFile(project.image);
  }

  await Project.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Project deleted successfully.',
  });
});

// ---------------------------------------------------------------------------
// @desc    Toggle publish status
// @route   PATCH /api/dashboard/projects/:id/publish
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const togglePublish = asyncHandler(async (req, res) => {
  const project = req.resource;

  project.isPublished = !project.isPublished;
  await project.save();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: project.isPublished
      ? 'Project published successfully.'
      : 'Project unpublished successfully.',
    data: project,
  });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
};
