// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { AppError } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (userExists) {
        throw new AppError('User already exists with this email or username', 400);
    }

    // Create user
    const user = await User.create({
        username,
        email,
        password,
    });

    if (user) {
        logger.info('User registered successfully:', {
            userId: user._id,
            username: user.username,
            email: user.email
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            }
        });
    } else {
        throw new AppError('Invalid user data', 400);
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        logger.info('User logged in successfully:', {
            userId: user._id,
            username: user.username,
            email: user.email
        });

        res.json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            }
        });
    } else {
        throw new AppError('Invalid email or password', 401);
    }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
        }
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Check if new email/username already exists
    if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            throw new AppError('Email already in use', 400);
        }
    }

    if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            throw new AppError('Username already in use', 400);
        }
    }

    user.username = username || user.username;
    user.email = email || user.email;

    const updatedUser = await user.save();

    logger.info('User profile updated:', {
        userId: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email
    });

    res.status(200).json({
        success: true,
        data: {
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            token: generateToken(updatedUser._id),
        }
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new AppError('Current password and new password are required', 400);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        throw new AppError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info('Password changed successfully:', {
        userId: user._id,
        username: user.username
    });

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateProfile,
    changePassword
};