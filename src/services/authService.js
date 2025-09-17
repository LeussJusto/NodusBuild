const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({ 
  url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` 
});
redisClient.connect().catch(console.error);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Helper to blacklist JWT on logout
const blacklistToken = async (token, exp) => {
  // exp is expiration timestamp (in seconds)
  await redisClient.set(`bl:${token}`, '1', { EX: exp - Math.floor(Date.now() / 1000) });
};

const isTokenBlacklisted = async (token) => {
  const res = await redisClient.get(`bl:${token}`);
  return !!res;
};

exports.register = async (userData) => {
  if (!userData.email || !userData.password) {
    throw new Error("Email and password are required");
  }
  
  const user = await User.create(userData);
  return user;
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email, isActive: true });
  if (!user) throw new Error('Invalid email or password');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  // JWT payload
  const payload = { id: user._id};
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user, token };
};

exports.logout = async (token) => {
  // Decode token to get expiration
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const exp = payload.exp; // in seconds
    await blacklistToken(token, exp);
  } catch (err) {
    // Invalid token, nothing to do
  }
};

exports.isTokenBlacklisted = isTokenBlacklisted;