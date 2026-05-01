import apiClient from './apiClient';

export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const verifyEmail = (token) => apiClient.get(`/auth/verify-email?token=${token}`);
export const forgotPassword = (data) => apiClient.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => apiClient.post(`/auth/reset-password/${token}`, data);
export const getProfile = () => apiClient.get('/auth/profile');
export const getProfileStats = () => apiClient.get('/auth/profile-stats');
export const updateProfile = (data) => apiClient.put('/auth/profile', data, {
    headers: { 'Content-Type': undefined }
});
export const googleLogin = () => {
    window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
};
