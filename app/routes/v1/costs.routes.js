const router = require('express').Router();
const cost = require('../../controllers/cost.controller');

router.get(
  '/projects/:projectId/tools/:toolId/month/:month/year/:year',
  cost.findAllByMonth
);
router.get(
  '/total/projects/:projectId/tools/:toolId/month/:month/year/:year',
  cost.findTotalCostByOperational
);
router.get(
  '/projects/:projectId/tools/:toolId',
  cost.findAllByProject
);
router.post('/', cost.create);

module.exports = router;
