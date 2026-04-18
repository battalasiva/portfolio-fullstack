const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Factory: creates a togglePublish handler for any model.
 * Expects req.resource to be set by authorizeOwnership middleware.
 */
const createTogglePublish = () => {
  return asyncHandler(async (req, res) => {
    const resource = req.resource;
    resource.isPublished = !resource.isPublished;
    await resource.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: resource.isPublished ? 'Now visible on portfolio.' : 'Hidden from portfolio.',
      data: resource,
    });
  });
};

/**
 * Toggle for singleton resources (Contact) — no :id param, uses userId.
 */
const createSingletonTogglePublish = (Model) => {
  return asyncHandler(async (req, res) => {
    const resource = await Model.findOne({ userId: req.user.id });

    if (!resource) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Resource not found.',
      });
    }

    resource.isPublished = !resource.isPublished;
    await resource.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: resource.isPublished ? 'Now visible on portfolio.' : 'Hidden from portfolio.',
      data: resource,
    });
  });
};

module.exports = { createTogglePublish, createSingletonTogglePublish };
