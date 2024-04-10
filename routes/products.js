const express = require('express');
const multer = require('multer');

const productController = require('../controllers/productController');
const { adminCheck } = require('../middlewares/adminCheck');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// Specify directory to store image uploaded
const upload = multer({ dest: 'uploads/' });

// Retreive all products from DB
router.get('/products', productController.getProducts);

// Retreive a product with specified id
router.get('/products/:id', productController.getProduct);

// Retreive all products associated with a category
router.get('/categories/:categoryId/products', productController.getProductsInCategory);

// Create a new product
router.post('/products', verifyToken, adminCheck, upload.array('images', 10), productController.createProduct);

// router.put('/products/:id', verifyToken, adminCheck, productController.updateProduct)

// Delete a product
router.delete('/products/:id', verifyToken, adminCheck, productController.deleteProduct);

module.exports = router;
