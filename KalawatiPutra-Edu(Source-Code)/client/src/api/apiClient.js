import axios from 'axios';

// Ensure we have a clean base URL without trailing slashes
const VITE_API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, '');

const apiClient = axios.create({
    baseURL: VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token automatically
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle global errors here, like logging out on 401
        if (error.response?.status === 401) {
            // Optional: localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
