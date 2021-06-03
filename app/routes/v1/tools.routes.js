const router = require('express').Router();
const tool = require('../../controllers/tool.controller')

router.get('/', tool.findAll);
router.post('/', tool.create);

module.exports = router;
