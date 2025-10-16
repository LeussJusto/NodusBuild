const Project = require('../models/Project');

// Es dueño del proyecto (owner)
const isOwner = async (req, res, next) => {
  const projectId = req.params.id;
  if (!projectId) return res.status(400).json({ message: 'ID de proyecto requerido.' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

  if (project.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Solo el creador del proyecto puede realizar esta acción.' });
  }
  req.project = project;
  next();
};

// Es dueño o residente del proyecto
const isOwnerOrResident = async (req, res, next) => {
  const projectId = req.params.id;
  if (!projectId) return res.status(400).json({ message: 'ID de proyecto requerido.' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

  const isOwner = project.owner.toString() === req.user.id;
  const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
  if (!isOwner && !isResident) {
    return res.status(403).json({ message: 'Solo el owner o residente pueden realizar esta acción.' });
  }

  req.project = project;
  next();
};

// Es participante (owner o cualquier miembro del equipo)
const isParticipant = async (req, res, next) => {
  const projectId = req.params.id;
  if (!projectId) return res.status(400).json({ message: 'ID de proyecto requerido.' });

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Proyecto no encontrado.' });

  const isOwner = project.owner.toString() === req.user.id;
  const isTeam = project.team.some(tm => tm.user.toString() === req.user.id);
  if (!isOwner && !isTeam) {
    return res.status(403).json({ message: 'No tienes acceso a este proyecto.' });
  }

  req.project = project;
  next();
};

module.exports = {
  isOwner,
  isOwnerOrResident,
  isParticipant,
};