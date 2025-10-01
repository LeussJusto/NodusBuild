const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Email no válido']  },
  password: { type: String, required: true, minlength: 5},
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: { type: String, default: '/uploads/avatars/default.png' }
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);