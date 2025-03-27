
import axios from 'axios';

const API_URL = 'https://nasiya.takedaservice.uz';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const auth = {
  login: async (username: string, password: string) => {
    const response = await api.post('/api/auth/login', { username, password });
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },
  profile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
};

// Debtor APIs
export const debtors = {
  getAll: async () => {
    const response = await api.get('/api/debtor');
    return response.data;
  },
  search: async (query: string) => {
    const response = await api.get(`/api/debtor/search?query=${query}`);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/debtor/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/debtor', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/debtor/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/debtor/${id}`);
    return response.data;
  },
};

// Debt APIs
export const debts = {
  getAll: async () => {
    const response = await api.get('/api/debts');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/debts/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/debts', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/debts/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/debts/${id}`);
    return response.data;
  },
};

// Store APIs
export const stores = {
  getAll: async () => {
    const response = await api.get('/api/store');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/store/${id}`);
    return response.data;
  },
  getStoreDebts: async () => {
    const response = await api.get('/api/store/get-store-debts');
    return response.data;
  },
  getOneDayDebts: async () => {
    const response = await api.get('/api/store/one-day-debts');
    return response.data;
  },
  getStatistics: async () => {
    const response = await api.get('/api/store/statistics');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/store', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/store/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/store/${id}`);
    return response.data;
  },
};

export default api;
