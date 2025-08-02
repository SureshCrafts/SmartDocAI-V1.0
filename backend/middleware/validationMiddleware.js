// backend/middleware/validationMiddleware.js
const { AppError } = require('./errorMiddleware');

// Sanitize input strings
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }
  return password;
};

// Validate username
const validateUsername = (username) => {
  const sanitized = sanitizeString(username);
  if (!sanitized || sanitized.length < 3) {
    throw new AppError('Username must be at least 3 characters long', 400);
  }
  if (!/^[a-zA-Z0-9_]+$/.test(sanitized)) {
    throw new AppError('Username can only contain letters, numbers, and underscores', 400);
  }
  return sanitized;
};

// Validate file upload
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/tiff',
    'image/bmp'
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid file type. Only PDF, DOCX, DOC, TXT, and image files (JPEG, PNG, TIFF, BMP) are allowed.', 400));
  }

  const maxSize = 10 * 1024 * 1024; // 10MB for enhanced processing
  if (req.file.size > maxSize) {
    return next(new AppError('File too large. Maximum size is 10MB', 400));
  }

  next();
};

// Validate question input
const validateQuestion = (req, res, next) => {
  const { question } = req.body;
  
  if (!question || typeof question !== 'string') {
    return next(new AppError('Question is required', 400));
  }

  const sanitizedQuestion = sanitizeString(question);
  if (sanitizedQuestion.length < 3) {
    return next(new AppError('Question must be at least 3 characters long', 400));
  }

  if (sanitizedQuestion.length > 500) {
    return next(new AppError('Question too long. Maximum 500 characters', 400));
  }

  req.body.question = sanitizedQuestion;
  next();
};

// Validate user registration
const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  try {
    req.body.username = validateUsername(username);
    req.body.email = sanitizeString(email).toLowerCase();
    req.body.password = validatePassword(password);

    if (!validateEmail(req.body.email)) {
      return next(new AppError('Invalid email format', 400));
    }
  } catch (error) {
    return next(error);
  }

  next();
};

// Validate user login
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  req.body.email = sanitizeString(email).toLowerCase();
  
  if (!validateEmail(req.body.email)) {
    return next(new AppError('Invalid email format', 400));
  }

  next();
};

module.exports = {
  validateFileUpload,
  validateQuestion,
  validateRegistration,
  validateLogin,
  sanitizeString
}; 