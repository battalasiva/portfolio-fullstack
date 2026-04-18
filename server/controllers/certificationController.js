const Certification = require('../models/Certification');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// @desc    Get all certifications for logged-in user
// @route   GET /api/dashboard/certifications
// @access  Private
// ---------------------------------------------------------------------------
const getCertifications = asyncHandler(async (req, res) => {
  const certifications = await Certification.find({ userId: req.user.id }).sort({
    issueDate: -1,
  });

  res.status(HTTP_STATUS.OK).json({ success: true, data: certifications });
});

// ---------------------------------------------------------------------------
// @desc    Create a certification
// @route   POST /api/dashboard/certifications
// @access  Private
// ---------------------------------------------------------------------------
const createCertification = asyncHandler(async (req, res) => {
  const certification = await Certification.create({
    ...req.body,
    userId: req.user.id,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Certification added successfully.',
    data: certification,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update a certification
// @route   PUT /api/dashboard/certifications/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const updateCertification = asyncHandler(async (req, res) => {
  delete req.body.userId;

  const certification = await Certification.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Certification updated successfully.',
    data: certification,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete a certification
// @route   DELETE /api/dashboard/certifications/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteCertification = asyncHandler(async (req, res) => {
  await Certification.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Certification deleted successfully.',
  });
});

module.exports = {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
};
