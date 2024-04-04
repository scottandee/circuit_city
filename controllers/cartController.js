const { ObjectId } = require('mongoose').Types;
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

async function getCart(req, res) {
  await Cart.findOne({ user: req.userId })
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
  const { productId } = req.body;

  await Product.findOne({ _id: productId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: 'not found' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });

  await Cart.findOne({ user: req.userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ error: 'not found' });
      }
      req.cart = cart;
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'internal server error' });
    });

  // Check if productId already exists in the cart
  const products = Array.from(req.cart.products);

  const newProdId = new ObjectId(productId);
  if (products.some((product) => product.equals(newProdId))) {
    return res.status(401).json({ error: 'product already exists in the cart' });
  }
  products.push(productId);

  // Update the db
  await Cart.updateOne({ user: req.userId }, { products, updatedAt: new Date() })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'not found' });
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'internal server error' });
    });

  // Retreive cart object
  const cart = await Cart.findOne({ user: req.userId });
  res.status(201).json(cart);
}

async function deleteFromCart(req, res) {
  const { productId } = req.params;

  await Cart.findOne({ user: req.userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ error: 'not found' });
      }
      req.cart = cart;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });

  let products = Array.from(req.cart.products);
  products = products.filter((id) => id.toString() !== productId);

  // Update the db
  await Cart.updateOne({ user: req.userId }, { products, updatedAt: new Date() })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'not found' });
      }
    }).catch((err) => {
      console.log(err);
      return res.status(500).json({ error: 'internal server error' });
    });

  // Retreive cart object
  const cart = await Cart.findOne({ user: req.userId });
  res.status(201).json(cart);
}

module.exports = { getCart, addToCart, deleteFromCart };
