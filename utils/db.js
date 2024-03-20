const mongoose = require("mongoose");

const port = process.env.PORT || 27017;
const db_name = process.env.DB || 'circuit_city';
const host = process.env.HOST || 'localhost';

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