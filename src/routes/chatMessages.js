const express = require('express');
const router = express.Router({ mergeParams: true });
const chatMessageController = require('../controllers/chatMessageController');
const auth = require('../middleware/auth');

// Todas requieren autenticación
router.use(auth);

// Enviar mensaje
router.post('/projects/:projectId/chat', chatMessageController.sendMessage);

// Listar mensajes (por canal y paginado)
router.get('/projects/:projectId/chat', chatMessageController.getMessages);

// Eliminar mensaje
router.delete('/chat/:id', chatMessageController.deleteMessage);

module.exports = router;