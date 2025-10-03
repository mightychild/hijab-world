const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  verifyPayment, 
  getMyOrders, 
  getOrder,
  testEndpoint 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.get('/test', testEndpoint); // Test endpoint

module.exports = router;