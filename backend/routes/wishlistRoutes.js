// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlistNotifications
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// Apply protection to all routes
router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);
router.post('/:productId/move-to-cart', moveToCart);
router.get('/notifications/check', checkWishlistNotifications);

module.exports = router;