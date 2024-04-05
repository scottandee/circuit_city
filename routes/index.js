const express = require('express');
const appController = require('../controllers/appController');

const router = express.Router();

router.get('/status', appController.getStatus);
router.get('/', appController.welcome);

module.exports = router;
