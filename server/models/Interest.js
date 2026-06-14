const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: [true, 'Interest name is required'], trim: true, maxlength: 100 },
    icon: { type: String, trim: true, default: null, maxlength: 10 },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

interestSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
