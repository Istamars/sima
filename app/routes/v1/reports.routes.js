const router = require('express').Router();
const report = require('../../controllers/report.controller');

router.post('/', report.create)

module.exports = router;
