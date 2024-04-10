const express = require('express');
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isOwner } = require('../middlewares/isOwner')

const router = express.Router();

// Retreive a cart
router.get('/carts/:cartId', verifyToken, isOwner, cartController.getCart);

// Add to a cart
router.post('/carts/:cartId/items/', verifyToken, isOwner, cartController.addToCart);

// Delete a product from a cart
router.delete('/carts/:cartId/items/:itemId', verifyToken, isOwner, cartController.deleteFromCart);

// Update the quantity of a product
router.put('/carts/:cartId/items/:itemId', verifyToken, isOwner, cartController.deleteFromCart);

module.exports = router;
