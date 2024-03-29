const express = require('express');
const qs = require('qs');
const index = require('./routes/index');
const user = require('./routes/user');
const categories = require('./routes/categories');
require('dotenv').config();


const app = express();
const port = process.env.PORT;

app.use(express.json());
app.set('query parser', function (str) {
  return qs.parse(str)
});
app.use('/', index);
app.use('/api/v1/', user);
app.use('/api/v1/', categories);

app.listen(port, () => {
  console.log('App is listening on port', port);
});
