const Report = require('../models/Report');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Crear un reporte
exports.createReport = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const {
      type,
      relatedTasks,
      content,
      checklist,
      status,
      reviewers,
      attachments
    } = req.body;

    // Validar que el usuario participa en el proyecto
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    // Validar tareas relacionadas (opcional)
    if (relatedTasks && relatedTasks.length) {
      const validTasks = await Task.find({
        _id: { $in: relatedTasks },
        project: projectId
      });
      if (validTasks.length !== relatedTasks.length)
        return res.status(400).json({ message: 'Una o más tareas no existen en el proyecto' });
    }

    const report = await Report.create({
      project: projectId,
      createdBy: req.user.id,
      type,
      relatedTasks,
      content,
      checklist,
      status: status || 'draft',
      reviewers,
      attachments
    });

    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
};

// Listar reportes de un proyecto
exports.getReportsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const reports = await Report.find({ project: projectId })
      .populate('createdBy', 'email profile')
      .populate('attachments')
      .populate('reviewers.user', 'email profile');
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// Obtener un reporte por id
exports.getReportById = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('createdBy', 'email profile')
      .populate('attachments')
      .populate('reviewers.user', 'email profile');
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });

    // Validar acceso al proyecto
    const project = await Project.findById(report.project);
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    res.json(report);
  } catch (err) {
    next(err);
  }
};

// Actualizar un reporte
exports.updateReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });

    const project = await Project.findById(report.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo owner, residente, creador del reporte o algún revisor pueden actualizar
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    const isCreator = report.createdBy.toString() === req.user.id;
    const isReviewer = report.reviewers.some(r => r.user?.toString() === req.user.id);
    if (!isOwner && !isResident && !isCreator && !isReviewer)
      return res.status(403).json({ message: 'No autorizado' });

    Object.assign(report, req.body);
    await report.save();
    res.json(report);
  } catch (err) {
    next(err);
  }
};


// Aprobar un reporte (solo el residente)
exports.approveReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });

    const project = await Project.findById(report.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Validar que el usuario es residente
    const isResident = project.team.some(tm => 
      tm.user.toString() === req.user.id && tm.role === 'resident_engineer'
    );
    if (!isResident)
      return res.status(403).json({ message: 'Solo el residente puede aprobar el reporte.' });

    report.status = 'approved';
    // Opcional: agrega un registro de quién aprobó y cuándo
    if (!report.reviewers) report.reviewers = [];
    report.reviewers.push({
      user: req.user.id,
      approved: true,
      reviewedAt: new Date()
    });

    await report.save();
    res.json({ message: 'Reporte aprobado', report });
  } catch (err) {
    next(err);
  }
};

// Eliminar un reporte
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Reporte no encontrado' });

    const project = await Project.findById(report.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo owner, residente o creador del reporte pueden eliminar
    const isOwner = project.owner.toString() === req.user.id;
    const isResident = project.team.some(tm => tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    const isCreator = report.createdBy.toString() === req.user.id;
    if (!isOwner && !isResident && !isCreator)
      return res.status(403).json({ message: 'No autorizado' });

    await report.deleteOne()  ;
    res.json({ message: 'Reporte eliminado' });
  } catch (err) {
    next(err);
  }
  
};

