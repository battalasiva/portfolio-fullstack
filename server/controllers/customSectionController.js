const CustomSection = require('../models/CustomSection');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

// --- Section-level CRUD ---

const getSections = asyncHandler(async (req, res) => {
  const sections = await CustomSection.find({ userId: req.user.id }).sort({ order: 1 });
  res.status(HTTP_STATUS.OK).json({ success: true, data: sections });
});

const createSection = asyncHandler(async (req, res) => {
  const section = await CustomSection.create({ ...req.body, userId: req.user.id, items: [] });
  res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Section created.', data: section });
});

const updateSection = asyncHandler(async (req, res) => {
  delete req.body.userId;
  // Only update section-level fields, not items
  const { title, isPublished, order } = req.body;
  const section = await CustomSection.findByIdAndUpdate(
    req.params.id,
    { title, isPublished, order },
    { new: true, runValidators: true }
  );
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Section updated.', data: section });
});

const deleteSection = asyncHandler(async (req, res) => {
  await CustomSection.findByIdAndDelete(req.params.id);
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Section deleted.' });
});

// --- Item-level CRUD (items within a section) ---

const addItem = asyncHandler(async (req, res) => {
  const section = req.resource;
  section.items.push(req.body);
  await section.save();
  res.status(HTTP_STATUS.CREATED).json({ success: true, message: 'Item added.', data: section });
});

const updateItem = asyncHandler(async (req, res) => {
  const section = req.resource;
  const item = section.items.id(req.params.itemId);
  if (!item) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Item not found.' });
  }
  Object.assign(item, req.body);
  await section.save();
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Item updated.', data: section });
});

const deleteItem = asyncHandler(async (req, res) => {
  const section = req.resource;
  const item = section.items.id(req.params.itemId);
  if (!item) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Item not found.' });
  }
  item.deleteOne();
  await section.save();
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Item deleted.', data: section });
});

// --- Reorder items within a section ---
const reorderItems = asyncHandler(async (req, res) => {
  const section = req.resource;
  const { itemIds } = req.body; // Array of item _id strings in new order

  if (!Array.isArray(itemIds)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: 'itemIds must be an array.' });
  }

  // Reorder by setting order field based on array position
  itemIds.forEach((id, index) => {
    const item = section.items.id(id);
    if (item) item.order = index;
  });

  await section.save();
  res.status(HTTP_STATUS.OK).json({ success: true, message: 'Items reordered.', data: section });
});

module.exports = {
  getSections, createSection, updateSection, deleteSection,
  addItem, updateItem, deleteItem, reorderItems,
};
