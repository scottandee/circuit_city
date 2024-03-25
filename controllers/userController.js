require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

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
  const user = await User.findOne({ email });
  if (user) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }
  // Encrypt Password with bcrypt
  const salt = process.env.SALT;
  const hashedPwd = await bcrypt.hash(password, salt);
  // Create new user
  const newUser = new User({
    email, firstName, lastName, role, password: hashedPwd,
  });
  newUser.save().then((savedDoc) => {
    const savedDocObj = savedDoc.toObject();
    savedDocObj.id = savedDocObj._id;
    delete savedDocObj._id;
    delete savedDocObj.password;
    delete savedDocObj.__v;

    res.status(201).json(savedDocObj);
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ error: 'internal server error' });
  });
}

async function logIn(req, res) {
  const authHeader = req.get('Authorization');

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
  const user = await User.findOne({ email });
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
  let user = await User.findOne({ _id: req.userId });
  user = user.toObject();
  user.id = user._id;
  delete user._id;
  delete user.password;
  delete user.__v;
  res.status(200).json(user);
}

module.exports = { signUp, logIn, profile };
