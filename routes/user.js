const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/users/signup', userController.signUp);

router.post('/user/login', userController.logIn);

module.exports = router;