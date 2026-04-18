const { validationResult } = require('express-validator');

// ---------------------------------------------------------------------------
// Shared validation error handler
// Used as the last item in every validation chain array.
// Checks if express-validator found any errors and returns 400 if so.
// ---------------------------------------------------------------------------
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};

module.exports = { handleValidationErrors };
