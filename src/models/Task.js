const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: String,
  category: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plannedDate: { type: Date, required: true },        // Fecha planificada (LPS)
  actualDate: Date,                                   // Fecha real de cumplimiento
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'review', 'completed', 'not_completed', 'delayed', 'cancelled'],
    default: 'pending',
    index: true
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  estimatedHours: Number,
  actualHours: Number,
  dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  ppcWeek: Number, // Semana LPS a la que pertenece (para cálculo PPC)
  evidence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  checklist: [{ item: String, completed: Boolean, completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, completedAt: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);