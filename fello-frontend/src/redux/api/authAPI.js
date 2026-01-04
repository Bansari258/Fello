import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

// Response interceptor: try to refresh access token on 401 and retry original request
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResp = await api.post('/auth/refresh');

                // if server returned a new access token in response body, update default header
                const newAccessToken = refreshResp?.data?.accessToken || refreshResp?.data?.token;
                if (newAccessToken) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data.data.user;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
};

export const refreshToken = async () => {
    const response = await api.post('/auth/refresh');
    const newAccessToken = response?.data?.accessToken || response?.data?.token;
    if (newAccessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    }
    return response.data;

}



export default api;