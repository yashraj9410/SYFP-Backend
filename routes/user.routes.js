const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/generateOtp', userController.generateOtp);
router.get('/user/:userId', userController.getUserDetail);
router.delete('/user/:userId', userController.deleteUser);

module.exports = router;
