const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Certification title is required'], trim: true, maxlength: 200 },
    issuer: { type: String, required: [true, 'Issuer is required'], trim: true, maxlength: 200 },
    description: { type: String, maxlength: 5000, default: null },
    issueDate: { type: Date, required: [true, 'Issue date is required'] },
    expiryDate: { type: Date, default: null },
    credentialId: { type: String, trim: true, default: null },
    credentialUrl: { type: String, trim: true, default: null },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
