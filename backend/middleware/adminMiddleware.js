const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and ensure user is an admin
const adminProtect = async (req, res, next) => {
  console.log('Admin protect middleware called');
  console.log('Headers:', req.headers);
  
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found:', token ? 'Yes' : 'No');
      
      if (!token) {
        console.log('Token is empty');
        return res.status(401).json({ message: 'Not authorized, no token' });
      }

      // Verify token
      console.log('Verifying token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);

      // Get user from the token (excluding the password)
      console.log('Looking up user:', decoded.id);
      const user = await User.findById(decoded.id).select('-password');
      console.log('User found:', user ? `Yes (${user.email}, admin: ${user.isAdmin})` : 'No');
      
      // Check if user was found AND is an admin
      if (!user) {
        console.log('User not found in database');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (!user.isAdmin) {
        console.log('User is not an admin');
        return res.status(403).json({ message: 'Not authorized, admin access required' });
      }

      console.log('User is admin, proceeding with request');
      // Attach user to request object and proceed
      req.user = user;
      next();
    } else {
      console.log('No authorization header or Bearer token found');
      console.log('Authorization header:', req.headers.authorization);
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Admin auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      console.log('JWT Error - Invalid token signature');
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('JWT Error - Token expired');
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { adminProtect };