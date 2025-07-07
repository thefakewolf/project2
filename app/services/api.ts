import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.8.160:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add Firebase token
api.interceptors.request.use(
  async (config) => {
    try {
      const firebaseToken = await AsyncStorage.getItem('firebaseToken');
      if (firebaseToken) {
        config.headers.Authorization = `Bearer ${firebaseToken}`;
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      await AsyncStorage.multiRemove(['firebaseToken', 'userData']);
      // You might want to navigate to login screen here
    }
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // User Profile
  getUserProfile: () => api.get('/api/profile/'),
  updateUserProfile: (data: any) => api.patch('/api/profile/', data),

  // Products
  getMyProducts: () => api.get('/api/my-products/'),
  createProduct: (data: any) => api.post('/api/my-products/', data),
  updateProduct: (id: number, data: any) => api.patch(`/api/my-products/${id}/`, data),
  deleteProduct: (id: number) => api.delete(`/api/my-products/${id}/`),
  getAllProducts: () => api.get('/api/products/'),
  toggleProductLike: (productId: number) => api.post(`/api/products/${productId}/like/`),

  // Chat
  getMyChats: () => api.get('/api/my-chats/'),
  getChatRoom: (chatId: number) => api.get(`/api/chats/${chatId}/`),
  getChatMessages: (chatId: number) => api.get(`/api/chats/${chatId}/messages/`),
  sendMessage: (chatId: number, content: string) => 
    api.post(`/api/chats/${chatId}/messages/`, { content }),
  createChatRoom: (productId: number) => 
    api.post('/api/chats/create/', { product_id: productId }),
  markMessagesRead: (chatId: number) => 
    api.post(`/api/chats/${chatId}/mark-read/`),
};

export default api;