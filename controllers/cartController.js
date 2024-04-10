const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

async function getCart(req, res) {
  const { cartId } = req.params;
  await Cart.findOne({ _id: cartId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(200).json(cart);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });
}

async function addToCart(req, res) {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  // Check if product exists
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    return res.status(404).json({ error: 'product not found' });
  }

  // Check if the product already exists in the cart
  const cart = await Cart.findOne({ _id: cartId });
  if (cart && cart.products.some((item) => item.productId.equals(productId))) {
    return res.status(400).json({ error: 'Product already exists in cart' });
  }

  // Update the db
  await Cart.findOneAndUpdate(
    { _id: cartId },
    {
      $addToSet: {
        products: { productId, quantity },
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, new: true },
  )
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ error: 'not found' });
      }
      return res.status(201).json(cart);
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'internal server error' });
    });
}

async function deleteFromCart(req, res) {
  const { itemId, cartId } = req.params;
  const productId = itemId;

  await Cart.findOneAndUpdate(
    { _id: cartId },
    { $pull: { products: { productId } }, $set: { updatedAt: new Date() } },
    { new: true },
  )
    .then((updatedCart) => {
      if (!updatedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.status(200).json(updatedCart);
    })
    .catch((error) => {
      console.error('Error deleting product from cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
}

async function updateQuantity(req, res) {

}

module.exports = { getCart, addToCart, deleteFromCart };
