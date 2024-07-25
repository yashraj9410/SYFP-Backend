const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const axios = require('axios');
const fast2smsConfig = require('../config/fast2sms.config');

// User Signup
exports.signup = async (req, res) => {
    const { name, email, password, mobile } = req.body;
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        if (existingUser.status === 'Inactive') {
          existingUser.status = 'Active';
          await existingUser.save();
          return res.status(200).json({ message: 'User created successfully' });
        } else {
          return res.status(400).json({ message: 'User already exists' });
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, mobile, status: 'Active' });
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const otpStore = {}; // In-memory storage for OTPs. In a real application, use a database.

// Send OTP
exports.generateOtp = async (req, res) => {
  const { mobile } = req.body;

  try {
    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

    // Save OTP to in-memory store (for simplicity; use a database in production)
    otpStore[mobile] = otp;

    // Send OTP via Fast2SMS
    const message = `Your OTP code is ${otp}. Please do not share it with anyone.`;

    await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      sender_id: 'FSTSMS',
      message: message,
      language: 'english',
      route: 'p',
      numbers: mobile,
    }, {
      headers: {
        'authorization': fast2smsConfig.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { mobile, otp } = req.body;

  try {
    if (otpStore[mobile] === otp) {
      delete otpStore[mobile]; // Remove OTP after verification
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get User Detail
exports.getUserDetail = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User (set status to Inactive)
exports.deleteUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findByIdAndUpdate(userId, { status: 'Inactive' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
