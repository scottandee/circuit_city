const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
class DBClient {
  constructor() {
    mongoose.connect(`mongodb+srv://${username}:${password}@circuitcity.zbqar4u.mongodb.net/?retryWrites=true&w=majority&appName=CircuitCity`);
    this.client = mongoose.connection;
  }

  status() {
    return this.client.readyState;
  }

  client() {
    return this.client();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
