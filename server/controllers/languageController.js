const Language = require('../models/Language');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const getLanguages = asyncHandler(async (req, res) => {
  const items = await Language.find({ userId: req.user.id }).sort({ order: 1, name: 1 });
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});

const createLanguage = asyncHandler(async (req, res) => {
  const item = await Language.create({ ...req.body, userId: req.user.id });
  res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Language added.', data: item });
});

const updateLanguage = asyncHandler(async (req, res) => {
  delete req.body.userId;
  const item = await Language.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Language updated.', data: item });
});

const deleteLanguage = asyncHandler(async (req, res) => {
  await Language.findByIdAndDelete(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Language deleted.' });
});

module.exports = { getLanguages, createLanguage, updateLanguage, deleteLanguage };
