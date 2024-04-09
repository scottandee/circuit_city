require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/userModel');
const Carts = require('../models/cartModel');
const { selfUrlGenerator, urlGenerator } = require('../utils/urlGenerator');


async function signUp(req, res) {
  // Retreive all data in body of request
  const {
    email, password, firstName, lastName, role,
  } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: 'email, password, first and last names, required' });
    return;
  }
  // Check if email already exists
  const user = await Users.findOne({ email });
  if (user) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }
  // Encrypt Password with bcrypt
  const salt = process.env.SALT;
  const hashedPwd = await bcrypt.hash(password, salt);

  const cartId = null;
  

  // Create new user
  await Users.create({
    email, firstName, lastName, role, password: hashedPwd,
  })
    .then((user) => {
      req.user = user;
      res.status(201).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    });

  // Create new cart for user
  await Carts.create({ userId: req.user._id })
    .catch((err) => {
      console.log(err);
    });
}

async function logIn(req, res) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  // Extract email and password from auth header
  const [scheme, base64] = authHeader.split(' ');
  if (scheme !== 'Basic') {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  const buff = Buffer.from(base64, 'base64');
  const string = buff.toString('ascii');
  const [email, hashedPwd] = string.split(':');

  // Check if user exists in db
  const user = await Users.findOne({ email });
  if (!user) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  // Check if password provided is valid
  const match = await bcrypt.compare(hashedPwd, user.password);
  if (!match) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  // Generate token for user
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: '2h' }, (err, token) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'internal server error' });
    }
    // Send response to user containing token
    res.status(200).json({ token });
  });
}

async function profile(req, res) {
  let user = await Users.findOne({ _id: req.userId });
  const cart = await Carts.findOne({ userId: req.userId })

  user = user.toObject();
  delete user.password;
  user.cart = urlGenerator(req, "/api/cart/", cart._id);
  user.url = selfUrlGenerator(req);

  res.status(200).json(user);
}

module.exports = { signUp, logIn, profile };
