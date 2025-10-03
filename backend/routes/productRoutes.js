const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getCategories,
  searchProducts,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminProtect } = require('../middleware/adminMiddleware');
const { uploadProductImages } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/search/:query', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
//router.get('/:id', getProduct);

// Admin routes
router.post('/', adminProtect, uploadProductImages, createProduct);
router.put('/:id', adminProtect, uploadProductImages, updateProduct);
router.delete('/:id', adminProtect, deleteProduct);

module.exports = router;