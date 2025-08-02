// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getMe, 
    updateProfile, 
    changePassword 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { 
    validateRegistration, 
    validateLogin 
} = require('../middleware/validationMiddleware');

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;