const express = require('express');
const index = require('./routes/index');
const user = require('./routes/user');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/', index);
app.use('/api/v1/', user);

app.listen(port, () => {
  console.log('App is listening on port', port);
});
