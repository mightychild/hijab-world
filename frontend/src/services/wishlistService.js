// services/wishlistService.js
import { apiRequest } from './authService';

export const getWishlist = async () => {
  try {
    const response = await apiRequest('/api/wishlist');
    return response.data || response;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return { items: [] };
  }
};

export const addToWishlist = async (productId, size = '', color = '') => {
  try {
    console.log('🔄 Adding to wishlist - Product ID:', productId, 'Size:', size, 'Color:', color);
    
    const response = await apiRequest('/api/wishlist', {
      method: 'POST',
      data: {  // Use 'data' instead of 'body' for axios
        productId, 
        size, 
        color 
      }
    });
    return response.data || response;
  } catch (error) {
    console.error('❌ Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await apiRequest(`/api/wishlist/${productId}`, {
      method: 'DELETE'
    });
    return response.data || response;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

export const clearWishlist = async () => {
  try {
    const response = await apiRequest('/api/wishlist', {
      method: 'DELETE'
    });
    return response.data || response;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};