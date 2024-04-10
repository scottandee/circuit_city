const Carts = require('../models/cartModel');

async function isOwner(req, res, next) {
  const { cartId } = req.params;
  const cart = await Carts.findOne({ _id: cartId });
  if (cart.userId.toString() !== req.userId) {
    return res.status(401).json({ error: 'this cart is not yours'});
  }
  next();
}

module.exports = { isOwner };