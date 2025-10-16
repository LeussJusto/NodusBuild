const Project = require('../models/Project');
const User = require('../models/User');

// Crear un nuevo proyecto (el usuario autenticado será owner y residente)
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, scope, timeline, budget, location, metadata } = req.body;
    const project = await Project.create({
      name,
      description,
      scope,
      owner: req.user.id,
      team: [{
        user: req.user.id,
        role: 'resident_engineer',
        permissions: [
          'dashboard_access', 'project_crud', 'assign_tasks', 'view_reports', 'approve_documents'
        ]
      }],
      timeline,
      budget,
      location,
      metadata
    });
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// Listar proyectos en los que participa el usuario (owner o en team)
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user.id },
        { 'team.user': req.user.id }
      ]
    });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// Obtener un proyecto por ID (solo si el usuario es owner o miembro del equipo)
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'email profile')
      .populate('team.user', 'email profile');
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Verificar acceso
    if (
      project.owner._id.toString() !== req.user.id &&
      !project.team.some(tm => tm.user._id.toString() === req.user.id)
    ) return res.status(403).json({ message: 'No autorizado' });

    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Actualizar proyecto (solo owner o residente)
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo owner o residente
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    if (!isOwner && !isResident)
      return res.status(403).json({ message: 'No autorizado' });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Eliminar proyecto (solo owner)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    if (project.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Solo el owner puede eliminar el proyecto' });

    await project.deleteOne();
    res.json({ message: 'Proyecto eliminado' });
  } catch (err) {
    next(err);
  }
};

// Añadir miembro al equipo
exports.addTeamMember = async (req, res, next) => {
  try {
    const { userId, role, permissions } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo owner o residente pueden agregar
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    if (!isOwner && !isResident)
      return res.status(403).json({ message: 'No autorizado' });

    if (project.team.some(tm => tm.user.toString() === userId))
      return res.status(400).json({ message: 'Usuario ya está en el equipo' });

    project.team.push({ user: userId, role, permissions });
    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// Quitar miembro del equipo
exports.removeTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo owner o residente pueden quitar
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    if (!isOwner && !isResident)
      return res.status(403).json({ message: 'No autorizado' });

    // No puede quitar owner
    if (userId === project.owner.toString())
      return res.status(400).json({ message: 'No puedes quitar al owner' });

    project.team = project.team.filter(tm => tm.user.toString() !== userId);
    await project.save();
    res.json(project);
  } catch (err) {
    next(err);
  }
};