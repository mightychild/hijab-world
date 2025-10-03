
import api from './api';

// Export apiRequest for other services to use
export { api as apiRequest };

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data || response;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/signup', userData);
  if (response.data?.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data || response;
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data || response;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    return !!(userInfo && userInfo.token);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get stored user info
export const getStoredUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') || 'null');
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('hijabWorldCart');
  window.location.href = '/login';
};