const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.use(auth);

// Listar notificaciones propias
router.get('/notifications', notificationController.getMyNotifications);

// Crear (interno o pruebas)
router.post('/notifications', notificationController.createNotification);

// Marcar una como leída
router.post('/notifications/:id/read', notificationController.markAsRead);

// Marcar todas como leídas
router.post('/notifications/read-all', notificationController.markAllAsRead);

// Eliminar notificación
router.delete('/notifications/:id', notificationController.deleteNotification);

module.exports = router;