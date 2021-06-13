const router = require('express').Router();
const report = require('../../controllers/report.controller');

router.post('/', report.create);
router.get(
  '/daily/:dateOrMonthOrYear/users/:userId/createdAt/:createdAt/projects/:projectId/tools/:toolId',
  report.findDailyReport
)

module.exports = router;
