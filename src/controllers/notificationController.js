const Notification = require('../models/Notification');

// Crear una notificación (se usa internamente, pero también puedes exponer para pruebas/admin)
exports.createNotification = async (req, res, next) => {
  try {
    const { user, project, type, title, message, data } = req.body;
    const notification = await Notification.create({
      user,
      project,
      type,
      title,
      message,
      data
    });
    res.status(201).json(notification);
  } catch (err) {
    next(err);
  }
};

// Listar notificaciones del usuario autenticado
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// Marcar notificación como leída
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });
    if (notification.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'No autorizado' });

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

// Marcar todas como leídas
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } });
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (err) {
    next(err);
  }
};

// Eliminar notificación (solo dueño)
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });
    if (notification.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'No autorizado' });

    await notification.remove();
    res.json({ message: 'Notificación eliminada' });
  } catch (err) {
    next(err);
  }
};