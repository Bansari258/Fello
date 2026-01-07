import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = () => {
  refreshSubscribers.forEach(callback => callback());
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const url = originalRequest.url || '';
      
      if (url.includes('/auth/refresh') || 
          url.includes('/auth/login') || 
          url.includes('/auth/register')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await api.post('/auth/refresh');
          isRefreshing = false;
          onRefreshed();
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;