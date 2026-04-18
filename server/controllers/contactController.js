const { Contact, ContactMessage } = require('../models/Contact');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS, PAGINATION_DEFAULTS } = require('../utils/constants');

// ===========================================================================
// CONTACT INFO (one per user)
// ===========================================================================

// ---------------------------------------------------------------------------
// @desc    Get logged-in user's contact info
// @route   GET /api/dashboard/contact
// @access  Private
// ---------------------------------------------------------------------------
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({ userId: req.user.id });

  if (!contact) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Contact info not found. Please create one.',
    });
  }

  res.status(HTTP_STATUS.OK).json({ success: true, data: contact });
});

// ---------------------------------------------------------------------------
// @desc    Create contact info (one per user)
// @route   POST /api/dashboard/contact
// @access  Private
// ---------------------------------------------------------------------------
const createContact = asyncHandler(async (req, res) => {
  const existing = await Contact.findOne({ userId: req.user.id });

  if (existing) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Contact info already exists. Use PUT to update.',
    });
  }

  const contact = await Contact.create({ ...req.body, userId: req.user.id });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Contact info created successfully.',
    data: contact,
  });
});

// ---------------------------------------------------------------------------
// @desc    Update contact info
// @route   PUT /api/dashboard/contact
// @access  Private
// ---------------------------------------------------------------------------
const updateContact = asyncHandler(async (req, res) => {
  delete req.body.userId;

  const contact = await Contact.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!contact) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'Contact info not found. Create one first.',
    });
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Contact info updated successfully.',
    data: contact,
  });
});

// ===========================================================================
// CONTACT MESSAGES (received by the user)
// ===========================================================================

// ---------------------------------------------------------------------------
// @desc    Get all messages for logged-in user
// @route   GET /api/dashboard/messages
// @access  Private
// ---------------------------------------------------------------------------
const getMessages = asyncHandler(async (req, res) => {
  const { status, isRead, limit, page } = req.query;

  const filter = { recipientId: req.user.id };
  if (status) filter.status = status;
  if (isRead !== undefined) filter.isRead = isRead === 'true';

  const pageNum = parseInt(page) || PAGINATION_DEFAULTS.PAGE;
  const limitNum = Math.min(
    parseInt(limit) || PAGINATION_DEFAULTS.LIMIT,
    PAGINATION_DEFAULTS.MAX_LIMIT
  );
  const skip = (pageNum - 1) * limitNum;

  const [messages, total] = await Promise.all([
    ContactMessage.find(filter).sort({ createdAt: -1 }).limit(limitNum).skip(skip),
    ContactMessage.countDocuments(filter),
  ]);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: messages,
    pagination: {
      current: pageNum,
      total: Math.ceil(total / limitNum),
      count: messages.length,
      totalRecords: total,
    },
  });
});

// ---------------------------------------------------------------------------
// @desc    Get single message
// @route   GET /api/dashboard/messages/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const getMessage = asyncHandler(async (req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, data: req.resource });
});

// ---------------------------------------------------------------------------
// @desc    Update message (mark read, change status)
// @route   PUT /api/dashboard/messages/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const updateMessage = asyncHandler(async (req, res) => {
  // Only allow updating status-related fields
  const allowedUpdates = { status: req.body.status, isRead: req.body.isRead };

  // Remove undefined keys
  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    allowedUpdates,
    { new: true, runValidators: true }
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Message updated successfully.',
    data: message,
  });
});

// ---------------------------------------------------------------------------
// @desc    Delete a message
// @route   DELETE /api/dashboard/messages/:id
// @access  Private (ownership verified by middleware)
// ---------------------------------------------------------------------------
const deleteMessage = asyncHandler(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Message deleted successfully.',
  });
});

module.exports = {
  getContact,
  createContact,
  updateContact,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
