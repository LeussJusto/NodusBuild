const express = require('express');
const router = express.Router();
const { upload, handleUploadErrors } = require('../middlewares/upload');
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth'); // tu middleware JWT

// subir avatar
router.post('/avatar', auth, upload.single('avatar'), handleUploadErrors, userController.uploadAvatar);

module.exports = router;
