const router = require('express').Router();
const user = require('../../controllers/user.controller')

router.post('/login', user.login);
router.post('/register', user.register);
router.put('/change-password', user.changePassword);

module.exports = router;