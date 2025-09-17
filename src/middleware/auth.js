const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../services/authService');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    // Check blacklist (logout)
    if (await isTokenBlacklisted(token))
      return res.status(401).json({ message: 'Session expired. Please log in again.' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};