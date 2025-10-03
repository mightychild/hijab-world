// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminProtect } = require('../middleware/adminMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Import admin controller functions
const {
  getAdminProducts,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getOrders,
  updateOrderStatus,
  getDashboardStats
} = require('../controllers/adminController');

// Import product controller for create/update/delete
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Apply admin protection to all routes
router.use(adminProtect);

// Dashboard routes
router.get('/stats', getDashboardStats);

// User management routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Order management routes
router.get('/orders', getOrders);
router.put('/orders/:id', updateOrderStatus);

// Product management routes
router.get('/products', getAdminProducts);
router.post('/products', uploadProductImages, createProduct);
router.put('/products/:id', uploadProductImages, updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;