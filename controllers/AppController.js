const dbClient = require('../utils/db');

dbClient;
function getStatus(req, res) {
  res.status(200).json({ db: dbClient.status(), status: 'Ready to go!' });
}

module.exports = { getStatus };
