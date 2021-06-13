const router = require('express').Router();
const maintenance = require('../../controllers/maintenance.controller');

router.get('/projects/:projectId/tools/:toolId/start/:startDate/end/:endDate', maintenance.getByDateRange)
router.get('/projects/:projectId/tools/:toolId', maintenance.getMaintenanceByProjectAndTool)
router.post('/', maintenance.create);

module.exports = router;
