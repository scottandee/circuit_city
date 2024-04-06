const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'first name required'],
  },
  lastName: {
    type: String,
    required: [true, 'last name required'],
  },
  email: {
    type: String,
    required: [true, 'email required'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

const Users = mongoose.model('Users', userSchema);
module.exports = Users;
