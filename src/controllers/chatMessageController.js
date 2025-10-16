const ChatMessage = require('../models/ChatMessage');
const Project = require('../models/Project');

// Enviar un mensaje al chat de un proyecto
exports.sendMessage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { message, channel, attachments } = req.body;

    // Validar que el usuario participa en el proyecto
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const chatMessage = await ChatMessage.create({
      project: projectId,
      sender: req.user.id,
      message,
      channel: channel || 'general',
      attachments
    });

    res.status(201).json(chatMessage);
  } catch (err) {
    next(err);
  }
};

// Listar mensajes de un canal en un proyecto (paginado)
exports.getMessages = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { channel = 'general', page = 1, limit = 20 } = req.query;

    // Validar que el usuario participa en el proyecto
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const isParticipant = project.owner.toString() === req.user.id ||
      project.team.some(tm => tm.user.toString() === req.user.id);
    if (!isParticipant) return res.status(403).json({ message: 'No autorizado' });

    const messages = await ChatMessage.find({ project: projectId, channel })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'email profile')
      .populate('attachments');

    res.json(messages.reverse()); // Para mostrar de más antiguo a más nuevo
  } catch (err) {
    next(err);
  }
};

// Eliminar un mensaje (solo el remitente o admin del proyecto)
exports.deleteMessage = async (req, res, next) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Mensaje no encontrado' });

    const project = await Project.findById(message.project);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    const isOwner = project.owner.toString() === req.user.id;
    const isSender = message.sender.toString() === req.user.id;
    if (!isOwner && !isSender)
      return res.status(403).json({ message: 'No autorizado' });

    await message.remove();
    res.json({ message: 'Mensaje eliminado' });
  } catch (err) {
    next(err);
  }
};