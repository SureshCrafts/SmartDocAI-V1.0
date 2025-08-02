// frontend/src/services/authService.js
import api from './api';
import { validateApiResponse, handleApiError } from './api';

// Register a new user
const register = async (userData) => {
  try {
    const response = await api.post('auth/register', userData);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Registration failed'));
  }
};

// Login user
const login = async (credentials) => {
  try {
    const response = await api.post('auth/login', credentials);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Login failed'));
  }
};

// Get current user profile
const getProfile = async () => {
  try {
    const response = await api.get('auth/me');
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to fetch profile'));
  }
};

// Update user profile
const updateProfile = async (profileData) => {
  try {
    const response = await api.put('auth/profile', profileData);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to update profile'));
  }
};

// Change password
const changePassword = async (passwordData) => {
  try {
    const response = await api.put('auth/change-password', passwordData);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to change password'));
  }
};

// Logout user (client-side only)
const logout = () => {
  localStorage.removeItem('userInfo');
  // You could also call an API endpoint to invalidate the token server-side
};

// Check if user is authenticated
const isAuthenticated = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return false;
    
    const user = JSON.parse(userInfo);
    return !!(user && user.token);
  } catch (error) {
    console.error('Error checking authentication:', error);
    localStorage.removeItem('userInfo');
    return false;
  }
};

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem('userInfo');
    return null;
  }
};

// Validate token (optional - you could call an API endpoint)
const validateToken = async () => {
  try {
    await getProfile();
    return true;
  } catch (error) {
    logout();
    return false;
  }
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  isAuthenticated,
  getCurrentUser,
  validateToken,
};

export default authService;