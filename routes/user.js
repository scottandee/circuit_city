const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.post('/users/signup', userController.signUp);
router.get('/users/login', userController.logIn);
router.get('/users/me', verifyToken, userController.profile);

module.exports = router;
