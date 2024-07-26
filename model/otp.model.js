const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema = new Schema({
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration time is required'],
  },
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
