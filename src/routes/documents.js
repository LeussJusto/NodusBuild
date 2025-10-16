const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middlewares/auth');
const multer = require('multer');

// ⚙️ Configuración moderna: Multer en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Todas requieren usuario autenticado
router.use(auth);

// Subir documento (form-data: file, project, category, ...)
router.post('/documents/upload', upload.single('file'), documentController.uploadDocument);

// Listar documentos (opcional: ?projectId=...)
router.get('/documents', documentController.getDocuments);

// Descargar documento
router.get('/documents/download/:id', documentController.downloadDocument);

// Aprobar documento (solo residente)
router.post('/documents/:id/approve', documentController.approveDocument);

// Eliminar documento (quien subió o owner)
router.delete('/documents/:id', documentController.deleteDocument);

module.exports = router;