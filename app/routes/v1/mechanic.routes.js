const router = require('express').Router();
const mechanic = require('../../controllers/mechanic.controller');

router.get('/', mechanic.findAll);
router.post('/', mechanic.create);

module.exports = router;
