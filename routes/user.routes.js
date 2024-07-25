const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtAuth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/generateOtp', userController.generateOtp);
router.post('/verifyOtp', userController.verifyOtp); // New endpoint for OTP verification
router.get('/user/:userId', authenticateToken, userController.getUserDetail);
router.delete('/user/:userId', authenticateToken, userController.deleteUser);

module.exports = router;
