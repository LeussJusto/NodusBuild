const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  relatedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  content: String, // Texto libre o JSON estructurado
  checklist: [{ item: String, completed: Boolean, evidence: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' } }],
  status: { type: String, enum: ['draft', 'in_review', 'approved', 'rejected'], default: 'draft' },
  reviewers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, approved: Boolean, reviewedAt: Date }],
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);