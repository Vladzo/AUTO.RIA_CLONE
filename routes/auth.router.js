const router = require('express').Router();

const { authController } = require('../controllers');
const { authMiddleware } = require('../middlewares');
const { constants: { REFRESH, ACCESS } } = require('../constants');

router.post('/login', authMiddleware.getUserByEmail, authController.login);
router.post('/logout', authMiddleware.checkToken(ACCESS), authController.logout);
router.post('/refresh', authMiddleware.checkToken(REFRESH), authController.refresh);

module.exports = router;
