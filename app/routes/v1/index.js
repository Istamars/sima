const router = require('express').Router();

router.use('/auth', require('./authentication.routes'));
router.use('/tools', require('./tools.routes'));
router.use('/projects', require('./projects.routes'));
router.use('/operationals', require('./opeartionals.routes'));
router.use('/reports', require('./reports.routes'));
router.use('/operations', require('./operations.routes'));
router.use('/managements', require('./managements.routes'));
router.use('/costs', require('./costs.routes'));
router.use('/usages', require('./usages.routes'));
router.use('/maintenances', require('./maintenance.routes'));

module.exports = router;