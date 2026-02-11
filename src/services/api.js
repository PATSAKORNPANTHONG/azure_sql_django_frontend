import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ice-backend-efh2chcmg4d9ekf6.malaysiawest-01.azurewebsites.net/api',
  // baseURL: 'http://127.0.0.1:8000/api', // Local API
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 API Configuration:');
console.log('  Main API URL:', api.defaults.baseURL);
console.log('  VITE_API_URL:', import.meta.env.VITE_API_URL);

// Add a response interceptor to handle errors globally if needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);


export const storeService = {
  getAll: () => api.get('/stores/').then(res => res.data),
  create: (data) => api.post('/stores/', data).then(res => res.data),
  update: (id, data) => api.put(`/stores/${id}/`, data).then(res => res.data),
  delete: (id) => api.delete(`/stores/${id}/`).then(res => res.data),
  deleteAll: () => api.delete('/stores/deleteAll/').then(res => res.data),
};

export const productService = {
  getAll: () => api.get('/products/').then(res => res.data),
  create: (data) => api.post('/products/', data).then(res => res.data),
  update: (id, data) => api.put(`/products/${id}/`, data).then(res => res.data),
  delete: (id) => api.delete(`/products/${id}/`).then(res => res.data),
  deleteAll: () => api.delete('/products/deleteAll/').then(res => res.data),
};


export const userService = {
  getAll: () => api.get('/users/').then(res => res.data),
  getById: (id) => api.get(`/users/${id}/`).then(res => res.data),
  create: (data) => api.post('/users/', data).then(res => res.data),
};

export const orderService = {
  getAll: () => api.get('/orders/').then(res => res.data),
  getById: (id) => api.get(`/orders/${id}/`).then(res => res.data),
  create: (data) => api.post('/orders/', data).then(res => res.data),
  update: (id, data) => api.patch(`/orders/${id}/`, data).then(res => res.data),
  delete: (id) => api.delete(`/orders/${id}/`).then(res => res.data),
};

export const reviewService = {
  getAll: (productId) => api.get(`/reviews/?product_id=${productId || ''}`).then(res => res.data),
  create: (data) => api.post('/reviews/', data).then(res => res.data),
  update: (id, data) => api.put(`/reviews/${id}/`, data).then(res => res.data),
  delete: (id) => api.delete(`/reviews/${id}/`).then(res => res.data),
};

// Function App URL - Replace with your actual Azure Function App URL
const FUNCTION_API_URL = 'https://bearlab-function-app-baebfye2fnb7bmcj.southeastasia-01.azurewebsites.net/api';

const functionApi = axios.create({
  baseURL: FUNCTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 Function API Configuration:');
console.log('  Function API URL:', functionApi.defaults.baseURL);

export const contentFilterService = {
  filterComment: (comment) => {
    if (functionApi.defaults.baseURL.includes('<YOUR_FUNCTION_APP_NAME>')) {
      console.error('❌ Please replace <YOUR_FUNCTION_APP_NAME> with your actual Function App name in api.js');
      return Promise.reject(new Error('Function API URL not configured'));
    }
    return functionApi.post('/filter_comment', { comment }).then(res => res.data);
  },
};

export default api;


export const getApiConfig = () => {
  const baseURL = api.defaults.baseURL || '';
  const isLocal = baseURL.includes('127.0.0.1') || baseURL.includes('localhost');
  return {
    isLocal,
    name: isLocal ? 'Local API' : 'Azure API',
    baseURL
  };
};
