const User = require('../models/User');

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findById(req.user.id);

    user.profile.avatar = avatarUrl;
    await user.save();

    res.json({ message: 'Avatar updated', avatar: avatarUrl });
  } catch (err) {
    next(err);
  }
};
