const router = require('express').Router();
const management = require('../../controllers/management.controller');

router.get(
  '/date/:date/users/:userId/tools/:toolId/projects/:projectId',
  management.findAll
)
router.put('/fee', management.addFee)
router.post('/', management.create)
router.put('/', management.update)

module.exports = router;
