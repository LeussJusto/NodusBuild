const express = require('express');
const router = express.Router({ mergeParams: true });
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/auth');

// Todas requieren autenticación
router.use(auth);

// Listar reportes de un proyecto
router.get('/projects/:projectId/reports', reportController.getReportsByProject);

// Crear reporte en un proyecto
router.post('/projects/:projectId/reports', reportController.createReport);

// Obtener reporte por ID
router.get('/reports/:id', reportController.getReportById);

// Actualizar reporte
router.put('/reports/:id', reportController.updateReport);

// Eliminar reporte
router.delete('/reports/:id', reportController.deleteReport);

// ...existing requires
router.post('/reports/:id/approve', reportController.approveReport);    

module.exports = router;