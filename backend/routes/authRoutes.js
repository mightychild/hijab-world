const express = require('express');
const router = express.Router();

// Import middleware first (they don't depend on controllers)
const { protect } = require('../middleware/authMiddleware');
let adminProtect;

try {
  const adminMiddleware = require('../middleware/adminMiddleware');
  adminProtect = adminMiddleware.adminProtect;
} catch (error) {
  console.error('Admin middleware error, using fallback:', error);
  adminProtect = async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        protect(req, res, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
      
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
      }
      
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  };
}

// Import controllers AFTER middleware
let registerAdmin;
try {
  const authController = require('../controllers/authController');
  registerAdmin = authController.registerAdmin;
} catch (error) {
  console.error('Error importing registerAdmin:', error);
  registerAdmin = (req, res) => {
    res.status(500).json({ message: 'Admin registration not configured' });
  };
}

// Public routes (import these separately to avoid circular deps)
router.post('/signup', (req, res, next) => {
  const { registerUser } = require('../controllers/authController');
  registerUser(req, res, next);
});

router.post('/login', (req, res, next) => {
  const { loginUser } = require('../controllers/authController');
  loginUser(req, res, next);
});

// Protected admin route for creating admin users
router.post('/admin/signup', adminProtect, (req, res, next) => {
  const { registerAdmin } = require('../controllers/authController');
  registerAdmin(req, res, next);
});

// Protected route
router.get('/me', protect, (req, res, next) => {
  const { getMe } = require('../controllers/authController');
  getMe(req, res, next);
});

router.get('/test-token', protect, (req, res) => {
  res.json({
    message: 'Token is valid!',
    user: {
      id: req.user._id,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    }
  });
});

module.exports = router;