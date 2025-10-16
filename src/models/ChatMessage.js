const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  channel: { type: String, default: 'general' },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);