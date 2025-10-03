// services/adminService.js
import api from './api';

// User Management
export const getUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data || response;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`/api/admin/users/${userId}`, userData);
    return response.data || response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data || response;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Order Management
export const getOrders = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `/api/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching orders from:', url);
    
    const response = await api.get(url);
    
    console.log('Orders response:', response);
    
    // Handle different response structures - ALWAYS return an array
    if (response.success && response.data) {
      return Array.isArray(response.data.orders) ? response.data.orders : 
             Array.isArray(response.data) ? response.data : 
             Array.isArray(response) ? response : [];
    } else if (Array.isArray(response)) {
      return response;
    } else if (response.orders && Array.isArray(response.orders)) {
      return response.orders;
    } else if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.warn('Unexpected orders response format, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return []; // Always return empty array on error
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/api/admin/orders/${orderId}`, { status });
    return response.data || response;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/api/admin/stats');
    return response.data || response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Product Management
export const getAdminProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `/api/admin/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log('Fetching admin products from:', url);
    
    const response = await api.get(url);
    
    // Handle response structure
    if (response.success && response.data) {
      return {
        products: response.data.products || response.data || [],
        pagination: response.data.pagination || {},
        total: response.data.pagination?.totalProducts || (response.data.products || response.data || []).length
      };
    } else if (Array.isArray(response)) {
      return {
        products: response,
        pagination: {},
        total: response.length
      };
    } else {
      return {
        products: response.products || response.data || [],
        pagination: {},
        total: (response.products || response.data || []).length
      };
    }
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return {
      products: [],
      pagination: {},
      total: 0
    };
  }
};

// Create Product with proper route and FormData handling
export const createProduct = async (formData) => {
  try {
    console.log('Creating product with FormData...');
    console.log('Target URL: /api/admin/products');
    
    // Log FormData contents for debugging
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
    }
    
    // Use axios with proper route - NO Content-Type header for FormData
    const response = await api.post('/api/admin/products', formData);
    
    console.log('Product creation response:', response);
    return response;
    
  } catch (error) {
    console.error('Product creation error:', error);
    
    // Provide more specific error messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.status === 413) {
      throw new Error('File too large. Please upload images smaller than 5MB.');
    } else if (error.response?.status === 415) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    } else if (error.response?.status === 404) {
      throw new Error('API endpoint not found. Check the route configuration.');
    } else {
      throw new Error(error.message || 'Failed to create product. Please try again.');
    }
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    console.log('Updating product:', productId);
    
    const response = await api.put(`/api/admin/products/${productId}`, formData);
    
    return response;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/api/admin/products/${productId}`);
    return response.data || response;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Alias for backward compatibility
export const getProducts = getAdminProducts;