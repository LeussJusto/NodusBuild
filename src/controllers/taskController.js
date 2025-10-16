const Task = require('../models/Task');
const Project = require('../models/Project');

// Crear una tarea
exports.createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      category,
      assignedTo,
      plannedDate,
      priority,
      estimatedHours,
      dependencies,
      ppcWeek,
      checklist
    } = req.body;

    // Validar que el usuario que crea la tarea es miembro del proyecto:
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant =
      project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    // Validar que el asignado también es miembro del proyecto:
    const isAssignedValid =
      project.owner.toString() === assignedTo ||
      project.team.some(tm => tm.user.toString() === assignedTo);
    if (!isAssignedValid) return res.status(400).json({ message: 'El usuario asignado no está en el proyecto' });

    const task = await Task.create({
      project: projectId,
      title,
      description,
      category,
      createdBy: req.user.id,
      assignedTo,
      plannedDate,
      priority,
      estimatedHours,
      dependencies,
      ppcWeek,
      checklist
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Listar tareas de un proyecto
exports.getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant =
      project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Obtener una tarea por id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'email profile')
      .populate('createdBy', 'email profile');
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    // Validar acceso al proyecto de la tarea
    const project = await Project.findById(task.project);
    const isParticipant =
      project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo puede actualizar el owner, residente, creador de la tarea o asignado
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    const isCreator = task.createdBy?.toString() === req.user.id;
    const isAssigned = task.assignedTo?.toString() === req.user.id;
    if (!isOwner && !isResident && !isCreator && !isAssigned)
      return res.status(403).json({ message: 'No autorizado' });

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// Eliminar una tarea
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo puede borrar el owner, residente o creador de la tarea
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    const isCreator = task.createdBy?.toString() === req.user.id;
    if (!isOwner && !isResident && !isCreator)
      return res.status(403).json({ message: 'No autorizado' });

    await task.deleteOne();
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    next(err);
  }
};