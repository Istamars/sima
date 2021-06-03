const router = require('express').Router();
const project = require('../../controllers/project.controller')

router.get('/', project.findAll);
router.get('/:id', project.findById);
router.post('/', project.create);

module.exports = router;