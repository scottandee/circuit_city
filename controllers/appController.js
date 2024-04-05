const dbClient = require('../utils/db');

function getStatus(req, res) {
  res.status(200).json({ db: dbClient.status(), status: 'Ready to go!' });
}

function welcome(req, res) {
  res.status(200).json({ message: "Welcome to Circuit City website API" });
}

module.exports = { getStatus, welcome };
