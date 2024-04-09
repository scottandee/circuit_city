const express = require('express');
const categoryController = require('../controllers/categoryController');
const { adminCheck } = require('../middlewares/adminCheck');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// Retreive all categories from the DB
router.get('/categories', categoryController.getCategories);

// Retreieve category with specified id
router.get('/categories/:id', categoryController.getCategory);

// Create a new category
router.post('/categories', verifyToken, adminCheck, categoryController.createCategory);

// Update a category
router.put('/categories/:id', verifyToken, adminCheck, categoryController.updateCategory);

// Delete a category
router.delete('/categories/:id', verifyToken, adminCheck, categoryController.deleteCategory);

module.exports = router;
