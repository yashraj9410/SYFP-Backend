const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10}$/, 'Please enter a valid mobile number']
  },
  status: {
    type: String,
    required: [false, 'Status is required'],
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
