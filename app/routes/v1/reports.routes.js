const router = require('express').Router();
const report = require('../../controllers/report.controller');

router.post('/', report.create);
router.put('/', report.approveReport);
router.get('/draft', report.findDraft);
router.get('/approve', report.findApprove);
router.get(
  '/daily/:dateOrMonthOrYear/users/:userId/createdAt/:createdAt/projects/:projectId/tools/:toolId',
  report.findDailyReport
);
router.get(
  '/monthly/:dateOrMonthOrYear/users/:userId/createdAt/:createdAt/projects/:projectId/tools/:toolId',
  report.findMonthlyReport
);

module.exports = router;
