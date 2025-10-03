const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.',
      field: !firstName ? 'firstName' : !lastName ? 'lastName' : !email ? 'email' : 'password'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
      field: 'confirmPassword'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.',
      field: 'password'
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email address.',
      field: 'email'
    });
  }

  // Create user
  const user = await User.create({ firstName, lastName, email, password });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data. Please try again.',
    });
  }
});

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
      field: !email ? 'email' : 'password'
    });
  }

  // Check for user email
  const user = await User.findOne({ email });

  // Check password
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please try again.',
      field: 'credentials'
    });
  }
});

// @desc    Get user data (protected route)
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
});

// @desc    Register an admin user (protected)
// @route   POST /api/auth/admin/signup
// @access  Private/Admin
const registerAdmin = asyncHandler(async (req, res) => {
  // Check if the current user is an admin
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to create admin users. Admin privileges required.'
    });
  }

  const { firstName, lastName, email, password, confirmPassword } = req.body;

  // Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields.',
      field: !firstName ? 'firstName' : !lastName ? 'lastName' : !email ? 'email' : 'password'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Passwords do not match.',
      field: 'confirmPassword'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters.',
      field: 'password'
    });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email address.',
      field: 'email'
    });
  }

  // Create user with admin privileges
  const user = await User.create({ 
    firstName, 
    lastName, 
    email, 
    password,
    isAdmin: true 
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully!',
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid user data. Please try again.',
    });
  }
});

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  getMe,
};