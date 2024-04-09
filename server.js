const express = require('express');
const qs = require('qs');
require('dotenv').config();

const index = require('./routes/index');
const user = require('./routes/user');
const categories = require('./routes/categories');
const products = require('./routes/products');
const cart = require('./routes/cart');

const app = express();

// GET PORT
const port = process.env.PORT;

// Configure data Parsers
app.use(express.json());
app.set('query parser', (str) => qs.parse(str));

// Routes
app.use('/api/', index, user, categories, products, cart);

// Not Found Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
  console.log('App is listening on port', port);
});
