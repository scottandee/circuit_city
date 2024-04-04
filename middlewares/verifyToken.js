require('dotenv').config();
const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'unauthorized' });

  // Extract email and password from auth header
  const [scheme, token] = authHeader.split(' ');

  // Extracted data validation
  if (scheme !== 'Bearer') return res.status(401).json({ error: 'unauthorized' });
  if (!token) return res.status(401).json({ error: 'unauthorized' });

  // Verify token
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ error: 'token is expired' });
    } else {
      res.status(401).json({ error: 'invalid token' });
    }
  }
}

module.exports = { verifyToken };
