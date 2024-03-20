const express = require('express');

const router = express.Router();

router.post('/user/signup', signUp);

router.post('/user/login', logIn)