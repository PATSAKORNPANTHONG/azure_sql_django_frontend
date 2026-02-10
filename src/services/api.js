import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://bearlab-backend-d9awbhgfe4c6abdq.southeastasia-01.azurewebsites.net/api',
  // baseURL: 'http://127.0.0.1:8000/api', // Local API
  headers: {
    'Content-Type': 'application/json',
  },
});

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

const functionApi = axios.create({
  baseURL: import.meta.env.VITE_FUNCTION_API_URL || 'https://<YOUR_FUNCTION_APP_NAME>.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contentFilterService = {
  filterComment: (comment) => functionApi.post('/filter_comment', { comment }).then(res => res.data),
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
