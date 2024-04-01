const express = require('express');
const productController = require('../controllers/productController');
const { adminCheck } = require('../middlewares/adminCheck');
const { verifyToken } = require('../middlewares/auth');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/'});

router.get('/products', verifyToken, productController.getProducts);
router.get('/products/:id', verifyToken, productController.getProduct);
router.post('/products', verifyToken, adminCheck, upload.array('images', 10), productController.createProduct);
// router.put('/products/:id', verifyToken, adminCheck, productController.updateProduct)
router.delete('/products/:id', verifyToken, adminCheck, productController.deleteProduct)

module.exports = router;