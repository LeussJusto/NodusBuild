const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    enum: [
      'resident_engineer', 'production_engineer', 'quality_engineer',
      'specialties_engineer', 'finishes_engineer', 'construction_admin',
      'warehouse_manager'
    ],
    required: true,
  },
  permissions: [{ type: String }]
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed', 'cancelled'],
    default: 'planning'
  },
  scope: {
    objectives: [String],
    deliverables: [String], // Ej: ['Informe semanal', 'Certificado de avance']
    notes: String
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [teamMemberSchema],
  timeline: {
    startDate: Date,
    endDate: Date,
    estimatedDuration: Number // en días
  },
  budget: {
    total: { type: Number, min: 0 },
    spent: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'PEN' }
  },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  metadata: {
    projectType: String,
    constructionType: String,
    area: Number,
    floors: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);