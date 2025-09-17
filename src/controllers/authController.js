const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(201).json({ message: 'User registered.', user: userWithoutPassword });
  } catch (err) {
    if (err.code === 11000) // duplicate email
      return res.status(400).json({ message: 'Email already in use.' });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ 
      token, 
      user: { id: user._id, email: user.email, profile: user.profile } 
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(400).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    await authService.logout(token);
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};