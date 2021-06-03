const router = require('express').Router();
const operational = require('../../controllers/operational.controller')

router.get('/', operational.findAll);
router.post('/', operational.create);

module.exports = router