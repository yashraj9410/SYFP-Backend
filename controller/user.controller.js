const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const axios = require('axios');
const fast2smsConfig = require('../config/fast2sms.config');

// User Signup
exports.signup = async (req, res) => {
    const { name, email, password, mobile, address } = req.body;
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
      const newUser = new User({ name, email, password: hashedPassword, mobile, status: 'Active', address });
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

// Send OTP
exports.generateOtp = async (req, res) => {
    const { mobile } = req.body;
  
    try {
      // Generate OTP
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });
  
      // Calculate expiration time (e.g., 10 minutes from now)
      const expiresAt = moment().add(10, 'minutes').toDate();
  
      // Save OTP to database
      await Otp.findOneAndUpdate(
        { mobile },
        { otp, expiresAt },
        { upsert: true, new: true } // Create if not exists, and return the updated document
      );
  
      // Send OTP via Fast2SMS
      const message = `Your OTP code is ${otp}. Please do not share it with anyone.`;
  
      await axios.get('https://www.fast2sms.com/dev/bulkV2', {
        sender_id: 'FSTSMS',
        message: message,
        language: 'english',
        route: 'q',
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
exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;
  
    try {
      // Find OTP from database
      const otpRecord = await Otp.findOne({ mobile });
  
      // Check if OTP exists and has not expired
      if (!otpRecord) {
        return res.status(400).json({ message: 'OTP not found' });
      }
  
      if (otpRecord.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      if (moment().isAfter(otpRecord.expiresAt)) {
        await Otp.deleteOne({ mobile }); // Remove expired OTP
        return res.status(400).json({ message: 'OTP has expired' });
      }
  
      // OTP is valid
      await Otp.deleteOne({ mobile }); // Remove OTP after verification
      res.status(200).json({ message: 'OTP verified successfully' });
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
