const mongoose = require('mongoose');
const Document = require('../models/Document');
const Project = require('../models/Project');
const { GridFSBucket } = require('mongodb');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se adjuntó ningún archivo' });
    }

    const { project, category } = req.body;

    // Crear bucket de GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    // Generar nombre único
    const filename = Date.now() + '-' + req.file.originalname;

    // Subir archivo desde buffer
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: {
        project,
        category,
        uploadedBy: req.user?.id || null
      }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async (file) => {
      return res.status(201).json({
        message: 'Archivo subido correctamente',
        fileId: file._id,
        filename: file.filename,
      });
    });

    uploadStream.on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Error al subir archivo a GridFS' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Listar documentos de un proyecto
exports.getDocuments = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    let filter = {};
    if (projectId) filter.project = projectId;

    // Solo documentos de proyectos donde participa
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
      const isParticipant = project.owner.toString() === req.user.id ||
        project.team.some(tm => tm.user.toString() === req.user.id);
      if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });
    } else {
      filter.uploadedBy = req.user.id;
    }

    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

// Descargar documento (GridFS)
exports.downloadDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Documento no encontrado' });

    // Validar acceso
    const project = await Project.findById(document.project);
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    res.set('Content-Type', document.fileType || 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename="${document.originalName || document.filename}"`);
    bucket.openDownloadStream(document.fileId).pipe(res);
  } catch (err) {
    next(err);
  }
};

// Aprobar documento (solo residente)
exports.approveDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Documento no encontrado' });

    const project = await Project.findById(document.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Solo residente
    const isResident = project.team.some(tm =>
      tm.user.toString() === req.user.id && tm.role === 'resident_engineer');
    if (!isResident) return res.status(403).json({ message: 'Solo el residente puede aprobar.' });

    document.status = 'approved';
    document.approvedBy = req.user.id;
    document.approvalDate = new Date();
    await document.save();

    res.json({ message: 'Documento aprobado', document });
  } catch (err) {
    next(err);
  }
};

// Eliminar documento (solo quien lo subió o owner)
exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'Documento no encontrado' });

    const project = await Project.findById(document.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const isOwner = project.owner.toString() === req.user.id;
    const isUploader = document.uploadedBy.toString() === req.user.id;
    if (!isOwner && !isUploader)
      return res.status(403).json({ message: 'No autorizado' });

    // Borrar de Document y GridFS
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    await bucket.delete(document.fileId);
    await document.remove();

    res.json({ message: 'Documento y archivo eliminados' });
  } catch (err) {
    next(err);
  }
};