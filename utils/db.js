const mongoose = require("mongoose");
require('dotenv').config();

const port = process.env.DBPORT;
const db_name = process.env.DB;
const host = process.env.HOST;

class DBClient {
  constructor () {
    mongoose.connect(`mongodb://${host}:${port}/${db_name}`);
    this.client = mongoose.connection;
  }

  status () {
    return this.client.readyState;
  }

  client () {
    return this.client()
  }
}

const dbClient = new DBClient();
module.exports = dbClient;