const express = require('express');
const categoryController = require('../controllers/categoryController');
const { adminCheck } = require('../middlewares/adminCheck');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/categories', verifyToken, categoryController.getCategories);
router.get('/categories/:id', verifyToken, categoryController.getCategory);
router.post('/categories', verifyToken, adminCheck, categoryController.createCategory);
// router.put('/categories/:id', verifyToken, adminCheck, categoryController.)
// router.delete('/categories/:id', verifyToken, adminCheck, categoryController.)

module.exports = router;