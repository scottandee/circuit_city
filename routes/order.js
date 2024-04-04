const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// // Retreive all orders
// router.get('/orders/', verifyToken, orderController.getCart);

// // Retreive an order with a specific id
// router.get('/orders/:orderId', verifyToken, orderController.getCart);

// // Create a new order
// router.post('/orders/', verifyToken, orderController.addToCart);

module.exports = router;
