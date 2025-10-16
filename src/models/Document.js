const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', index: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: String,
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS
  fileType: String,
  size: { type: Number, min: 0 },
  category: {
    type: String,
    enum: ['certificate', 'blueprint', 'report', 'photo', 'video', 'contract', 'permit'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending',
    index: true
  },
  version: { type: Number, default: 1 },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvalDate: Date,
  expiryDate: Date,
  metadata: {
    description: String,
    tags: [String],
    location: String,
    relatedNorms: [String]
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);