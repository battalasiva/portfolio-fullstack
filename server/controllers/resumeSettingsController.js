const ResumeSettings = require('../models/ResumeSettings');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const getSettings = asyncHandler(async (req, res) => {
  const settings = await ResumeSettings.getOrCreate(req.user.id);
  res.status(HTTP_STATUS.OK).json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  delete req.body.userId;
  let settings = await ResumeSettings.findOne({ userId: req.user.id });

  if (!settings) {
    settings = await ResumeSettings.create({ ...req.body, userId: req.user.id });
  } else {
    // Deep merge theme and preferences
    if (req.body.theme) {
      settings.theme = { ...settings.theme.toObject(), ...req.body.theme };
    }
    if (req.body.preferences) {
      settings.preferences = { ...settings.preferences.toObject(), ...req.body.preferences };
    }
    if (req.body.sectionOrder) settings.sectionOrder = req.body.sectionOrder;
    if (req.body.hiddenSections) settings.hiddenSections = req.body.hiddenSections;
    await settings.save();
  }

  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Settings updated.', data: settings });
});

// Dedicated endpoint for section reorder (drag-and-drop)
const reorderSections = asyncHandler(async (req, res) => {
  const { sectionOrder } = req.body;

  if (!Array.isArray(sectionOrder)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'sectionOrder must be an array.',
    });
  }

  const settings = await ResumeSettings.getOrCreate(req.user.id);
  settings.sectionOrder = sectionOrder;
  await settings.save();

  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Section order updated.', data: settings });
});

module.exports = { getSettings, updateSettings, reorderSections };
