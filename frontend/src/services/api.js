
import axios from 'axios';

// Use the correct base URL with /api
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// the request interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    
    // Handle different content types
    if (config.data instanceof FormData) {
      // For FormData, let browser set Content-Type automatically
      delete config.headers['Content-Type'];
    } else if (config.data && typeof config.data === 'object') {
      // For JSON data, ensure proper Content-Type
      config.headers['Content-Type'] = 'application/json';
      config.data = JSON.stringify(config.data);
    }
    
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response.data;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      fullUrl: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 404) {
      console.error('404 Error - Route not found. Check if the backend route exists.');
    }
    
    return Promise.reject(error);
  }
);

export default api;