const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  week: { type: Number, required: true }, // Semana ISO del año
  year: { type: Number, required: true },
  entries: [{
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    planned: Boolean,
    completed: Boolean,
    completedAt: Date,
    notes: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

module.exports = mongoose.model('ActivityLog', activityLogSchema);