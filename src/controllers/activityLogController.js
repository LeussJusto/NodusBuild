const ActivityLog = require('../models/ActivityLog');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Crear un ActivityLog semanal
exports.createActivityLog = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { week, year, entries } = req.body;

    // Verifica que el usuario participa en el proyecto
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    // Opcional: Evita duplicados por semana/año/proyecto
    const exists = await ActivityLog.findOne({ project: projectId, week, year });
    if (exists) return res.status(409).json({ message: 'Ya existe un registro para esta semana.' });

    // Opcional: valida que las tareas sean del proyecto
    for (const entry of entries) {
      const task = await Task.findById(entry.task);
      if (!task || task.project.toString() !== projectId)
        return res.status(400).json({ message: 'Tarea inválida en entries.' });
    }

    const log = await ActivityLog.create({
      project: projectId,
      week,
      year,
      entries,
      createdBy: req.user.id,
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// Listar logs por proyecto y/o semana
exports.getActivityLogs = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { week, year } = req.query;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    let filter = { project: projectId };
    if (week) filter.week = parseInt(week);
    if (year) filter.year = parseInt(year);

    const logs = await ActivityLog.find(filter).populate('entries.task', 'title status');
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// Obtener un log por id
exports.getActivityLogById = async (req, res, next) => {
  try {
    const log = await ActivityLog.findById(req.params.id)
      .populate('entries.task', 'title status');
    if (!log) return res.status(404).json({ message: 'Log no encontrado' });

    // Valida acceso
    const project = await Project.findById(log.project);
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Calcular PPC (Porcentaje Plan Completado) para una semana
exports.getPPC = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { week, year } = req.query;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const logs = await ActivityLog.find({
      project: projectId,
      week: parseInt(week),
      year: parseInt(year)
    });

    if (!logs.length) return res.json({ ppc: 0, total: 0, completed: 0 });

    // Suma todas las actividades planificadas y completadas
    let total = 0, completed = 0;
    logs.forEach(log => {
      log.entries.forEach(e => {
        if (e.planned) {
          total++;
          if (e.completed) completed++;
        }
      });
    });
    const ppc = total ? Math.round((completed / total) * 100) : 0;
    res.json({ ppc, total, completed });
  } catch (err) {
    next(err);
  }
};