// services/productService.js
import api from './api';

// Get all products with filtering
export const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all filter parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        if (Array.isArray(filters[key])) {
          filters[key].forEach(value => queryParams.append(key, value));
        } else {
          queryParams.append(key, filters[key]);
        }
      }
    });

    const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching products from:', url);
    
    const response = await api.get(url);
    
    // Handle different response structures
    if (response.success && response.data) {
      return response.data;
    } else if (response.products) {
      return {
        products: response.products,
        pagination: response.pagination || {},
        filters: response.filters || {}
      };
    } else if (Array.isArray(response)) {
      return {
        products: response,
        pagination: {},
        filters: {}
      };
    }
    
    // Fallback
    return { products: [], pagination: {}, filters: {} };
    
  } catch (error) {
    console.error('Get products error:', error);
    return { products: [], pagination: {}, filters: {} };
  }
};

// Get single product
export const getProduct = async (productId) => {
  try {
    console.log('Fetching product with ID:', productId);
    
    if (!productId) {
      throw new Error('Product ID is required');
    }

    const response = await api.get(`/api/products/${productId}`);
    
    // Handle different response structures
    if (response.success && response.data) {
      return response.data.product || response.data;
    } else if (response.product) {
      return response.product;
    } else {
      return response;
    }
  } catch (error) {
    console.error('Error in getProduct service:', error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
};

export const getProductCategories = async () => {
  try {
    const response = await api.get('/api/products/categories');
    return response.data || response || [];
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/api/products/featured');
    return response.data || response || [];
  } catch (error) {
    console.error('Get featured products error:', error);
    return [];
  }
};