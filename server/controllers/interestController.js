const Interest = require('../models/Interest');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

const getInterests = asyncHandler(async (req, res) => {
  const items = await Interest.find({ userId: req.user.id }).sort({ order: 1, name: 1 });
  res.status(HTTP_STATUS.OK).json({ success: true, data: items });
});

const createInterest = asyncHandler(async (req, res) => {
  const item = await Interest.create({ ...req.body, userId: req.user.id });
  res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Interest added.', data: item });
});

const updateInterest = asyncHandler(async (req, res) => {
  delete req.body.userId;
  const item = await Interest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Interest updated.', data: item });
});

const deleteInterest = asyncHandler(async (req, res) => {
  await Interest.findByIdAndDelete(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Interest deleted.' });
});

module.exports = { getInterests, createInterest, updateInterest, deleteInterest };
