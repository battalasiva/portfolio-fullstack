const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// protect — Verify JWT token and attach user to request
// ---------------------------------------------------------------------------
// Usage: router.get('/dashboard', protect, controller)
// ---------------------------------------------------------------------------
const protect = async (req, res, next) => {
  try {
    // 1. Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token has expired. Please login again.'
          : 'Invalid token. Please login again.';

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message,
      });
    }

    // 3. Check if user still exists (could have been deleted after token was issued)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    // 4. Attach user to request — available in all downstream handlers
    req.user = { id: user._id, username: user.username };
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Authentication failed.',
    });
  }
};

// ---------------------------------------------------------------------------
// authorizeOwnership — Factory: checks if logged-in user owns the resource
// ---------------------------------------------------------------------------
// Usage: router.put('/:id', protect, authorizeOwnership(Project, 'ownerId'), controller)
//
// Parameters:
//   Model       — Mongoose model to query
//   ownerField  — The field name on the document that stores the owner's userId
// ---------------------------------------------------------------------------
const authorizeOwnership = (Model, ownerField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);

      if (!resource) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Resource not found.',
        });
      }

      // Compare the owner field on the document with the logged-in user's id
      if (resource[ownerField].toString() !== req.user.id.toString()) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          success: false,
          message: 'You do not have permission to perform this action.',
        });
      }

      // Attach the found resource so the controller doesn't need to query again
      req.resource = resource;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Authorization check failed.',
      });
    }
  };
};

module.exports = { protect, authorizeOwnership };
