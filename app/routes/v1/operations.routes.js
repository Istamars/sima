const router = require('express').Router();
const operation = require('../../controllers/operation.controller');

router.get(
  '/date/:date/users/:userId/tools/:toolId/projects/:projectId',
  operation.findAll
);

router.post('/', operation.create);
router.put('/', operation.update);

module.exports = router;