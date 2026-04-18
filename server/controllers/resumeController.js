const { resolveUser, fetchFullPortfolio } = require('../services/portfolioService');
const { generateResumePDF } = require('../services/pdfService');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// ---------------------------------------------------------------------------
// Helper — Generate and stream PDF to response
// ---------------------------------------------------------------------------
const streamResumePDF = (res, data) => {
  const filename = `${data.profile.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const pdfDoc = generateResumePDF(data);
  pdfDoc.pipe(res);
};

// ---------------------------------------------------------------------------
// @desc    Download resume PDF for logged-in user
// @route   GET /api/dashboard/resume/download
// @access  Private
// ---------------------------------------------------------------------------
const downloadResume = asyncHandler(async (req, res) => {
  const data = await fetchFullPortfolio(req.user.id);

  if (!data.profile) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please create your profile before generating a resume.',
    });
  }

  streamResumePDF(res, data);
});

// ---------------------------------------------------------------------------
// @desc    Preview resume data (returns JSON for frontend preview)
// @route   GET /api/dashboard/resume/preview
// @access  Private
// ---------------------------------------------------------------------------
const previewResume = asyncHandler(async (req, res) => {
  const data = await fetchFullPortfolio(req.user.id);

  if (!data.profile) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please create your profile before previewing resume.',
    });
  }

  res.status(HTTP_STATUS.OK).json({ success: true, data });
});

// ---------------------------------------------------------------------------
// @desc    Download resume PDF for a public portfolio (by username)
// @route   GET /api/u/:username/resume
// @access  Public
// ---------------------------------------------------------------------------
const downloadPublicResume = asyncHandler(async (req, res) => {
  // req.portfolioUser is set by resolveUsername middleware in public.js
  const userId = req.portfolioUser?._id;

  if (!userId) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found.',
    });
  }

  const data = await fetchFullPortfolio(userId);

  if (!data.profile) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'This user has not set up their portfolio yet.',
    });
  }

  streamResumePDF(res, data);
});

module.exports = { downloadResume, previewResume, downloadPublicResume };
