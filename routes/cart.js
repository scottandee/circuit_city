const express = require('express');
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

// Retreive a user's cart
router.get('/cart/', verifyToken, cartController.getCart);

// Add to a user's cart
router.post('/cart/products/', verifyToken, cartController.addToCart);

// Delete a product from a user's cart
router.delete('/cart/products/:productId', verifyToken, cartController.deleteFromCart);

module.exports = router;