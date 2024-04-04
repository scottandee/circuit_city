const User = require('../models/userModel');

async function adminCheck(req, res, next) {
  const user = await User.findOne({ _id: req.userId });
  if (user.role !== 'admin') {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
}

module.exports = { adminCheck };
