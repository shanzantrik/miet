import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export const endpoints = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
    me: `${API_URL}/api/auth/me`,
    adminMe: `${API_URL}/api/admin/me`,
    changePassword: `${API_URL}/api/auth/change-password`,
    updateProfile: `${API_URL}/api/auth/profile`
  },
  admin: {
    dashboard: `${API_URL}/api/admin/dashboard`,
    consultants: {
      list: `${API_URL}/api/admin/consultants`,
      create: `${API_URL}/api/admin/consultants`,
      update: (id) => `${API_URL}/api/admin/consultants/${id}`,
      delete: (id) => `${API_URL}/api/admin/consultants/${id}`,
      approve: (id) => `${API_URL}/api/admin/consultants/${id}/approve`,
      pending: `${API_URL}/api/admin/consultants?approved=false`
    }
  },
  consultants: {
    list: `${API_URL}/api/consultants`,
    get: (id) => `${API_URL}/api/consultants/${id}`,
    update: (id) => `${API_URL}/api/consultants/${id}`,
    delete: (id) => `${API_URL}/api/consultants/${id}`
  },
  categories: {
    list: `${API_URL}/api/categories`,
    get: (id) => `${API_URL}/api/categories/${id}`,
    create: `${API_URL}/api/categories`,
    update: (id) => `${API_URL}/api/categories/${id}`,
    delete: (id) => `${API_URL}/api/categories/${id}`
  },
  ailments: {
    list: `${API_URL}/api/ailments`,
    get: (id) => `${API_URL}/api/ailments/${id}`,
    create: `${API_URL}/api/ailments`,
    update: (id) => `${API_URL}/api/ailments/${id}`,
    delete: (id) => `${API_URL}/api/ailments/${id}`
  },
  cart: {
    get: `${API_URL}/api/cart`,
    add: `${API_URL}/api/cart/add`,
    update: `${API_URL}/api/cart/update`,
    remove: `${API_URL}/api/cart/remove`,
    clear: `${API_URL}/api/cart/clear`
  }
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default api;
