import apiClient from './apiClient';

export const submitContact = (data) => apiClient.post('/contact', data);
export const submitIssue = (data) => apiClient.post('/issues', data);
export const getChatbotResponse = (data) => apiClient.post('/chatbot/lead', data);
export const verifyCertificate = (data) => apiClient.post('/certificates/verify', data);
export const generateCertificate = (data) => apiClient.post('/certificates/generate', data);
export const uploadResume = (formData) => apiClient.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const submitWorkshopForm = (data) => apiClient.post('/workshop', data);
