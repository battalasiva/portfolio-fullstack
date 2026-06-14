const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Factory: creates a reorder handler for any model with an `order` field.
 * Expects body: { items: [{ id: "mongoId", order: 0 }, { id: "mongoId", order: 1 }, ...] }
 * Only updates items owned by the logged-in user.
 */
const createReorderHandler = (Model) => {
  return asyncHandler(async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'items must be an array of { id, order } objects.',
      });
    }

    // Bulk update — only update items that belong to this user
    const bulkOps = items.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id, userId: req.user.id },
        update: { $set: { order } },
      },
    }));

    if (bulkOps.length > 0) {
      await Model.bulkWrite(bulkOps);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order updated.',
    });
  });
};

module.exports = { createReorderHandler };
