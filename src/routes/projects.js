const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth');
const projectAuth = require('../middlewares/projectAuth');

router.use(auth);

router.get('/', projectController.getMyProjects);

router.post('/', projectController.createProject);

router.get('/:id', projectAuth.isParticipant, projectController.getProjectById);

router.put('/:id', projectAuth.isOwnerOrResident, projectController.updateProject);

router.delete('/:id', projectAuth.isOwner, projectController.deleteProject);

router.post('/:id/members', projectAuth.isOwnerOrResident, projectController.addTeamMember);

router.delete('/:id/members/:userId', projectAuth.isOwnerOrResident, projectController.removeTeamMember);

module.exports = router;