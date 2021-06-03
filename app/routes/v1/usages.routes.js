const router = require('express').Router();
const usage = require('../../controllers/usage.controller');

router.get('/tools/:toolId/projects/:projectId', usage.findByProjectAndTool);
router.post('/', usage.create);

module.exports = router;
