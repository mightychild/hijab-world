// services/orderService.js
import { apiRequest } from './authService';

// Get user's orders
export const getMyOrders = async () => {
  const response = await apiRequest('/api/orders/my-orders');
  return response.data || response;
};

// Get recent orders (for dashboard)
export const getRecentOrders = async () => {
  const response = await apiRequest('/api/orders/recent');
  return response.data || [];
};

// Get single order
export const getOrder = async (orderId) => {
  const response = await apiRequest(`/api/orders/${orderId}`);
  return response.data || response;
};

// Create new order
export const createOrder = async (orderData) => {
  const response = await apiRequest('/api/orders', {
    method: 'POST',
    body: orderData,
  });
  return response.data || response;
};

// Verify payment
export const verifyPayment = async (paymentData) => {
  const response = await apiRequest('/api/orders/verify-payment', {
    method: 'POST',
    body: paymentData,
  });
  return response.data || response;
};