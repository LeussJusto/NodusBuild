const express = require('express');
const router = express.Router({ mergeParams: true });
const activityLogController = require('../controllers/activityLogController');
const auth = require('../middlewares/auth');

// Todas requieren autenticación
router.use(auth);

// Crear log semanal
router.post('/projects/:projectId/activity-logs', activityLogController.createActivityLog);

// Listar logs por proyecto (y/o semana, año)
router.get('/projects/:projectId/activity-logs', activityLogController.getActivityLogs);

// Obtener un log por id
router.get('/activity-logs/:id', activityLogController.getActivityLogById);

// Calcular PPC por proyecto, semana y año
router.get('/projects/:projectId/ppc', activityLogController.getPPC);

module.exports = router;