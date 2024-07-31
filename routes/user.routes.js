const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtAuth');
const userController = require('../controller/user.controller')

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/generateOtp', userController.generateOtp);
router.post('/verifyOtp', userController.verifyOtp); // New endpoint for OTP verification
router.get('/user/:userId', authenticateToken, userController.getUserDetail);
router.delete('/user/:userId', authenticateToken, userController.deleteUser);
router.get('/v2.0/user/:id', userController.getUserDetails);

module.exports = router;
