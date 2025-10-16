const express = require('express');
const router = express.Router({ mergeParams: true });
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

// Todas requieren usuario autenticado
router.use(auth);

// Listar tareas de un proyecto
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);

// Crear tarea en un proyecto
router.post('/projects/:projectId/tasks', taskController.createTask);

// Obtener tarea por ID
router.get('/tasks/:id', taskController.getTaskById);

// Actualizar tarea
router.put('/tasks/:id', taskController.updateTask);

// Eliminar tarea
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;