// frontend/src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        localStorage.removeItem('userInfo');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token and redirect to login
      localStorage.removeItem('userInfo');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
      }
      
      return Promise.reject(error);
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
      return Promise.reject(error);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
      return Promise.reject(error);
    }

    // Handle 429 Rate Limit errors
    if (error.response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
      return Promise.reject(error);
    }

    // Handle 500 Server errors
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection and try again.');
      return Promise.reject(error);
    }

    // Handle other errors
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred.';
    
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

// Utility function to handle API errors consistently
export const handleApiError = (error, customMessage = null) => {
  const message = customMessage || 
                 error.response?.data?.error?.message || 
                 error.response?.data?.message || 
                 error.message || 
                 'An unexpected error occurred.';
  
  console.error('API Error:', {
    message,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method
  });
  
  return message;
};

// Utility function to validate API responses
export const validateApiResponse = (response) => {
  if (!response || !response.data) {
    throw new Error('Invalid API response');
  }
  
  if (response.data.success === false) {
    throw new Error(response.data.error?.message || 'API request failed');
  }
  
  return response.data;
};

export default api;