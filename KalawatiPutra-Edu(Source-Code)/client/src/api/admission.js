import apiClient from './apiClient';

// Colleges
export const getColleges = () => apiClient.get('/admin/colleges');
export const createCollege = (data) => apiClient.post('/admin/colleges', data);
export const updateCollege = (id, data) => apiClient.put(`/admin/colleges/${id}`, data);
export const deleteCollege = (id) => apiClient.delete(`/admin/colleges/${id}`);

// Admission Help Inquiries
export const getAdmissionInquiries = () => apiClient.get('/admin/admissions');
export const submitAdmissionInquiry = (data) => apiClient.post('/applications', data);
export const deleteAdmissionInquiry = (id) => apiClient.delete(`/admin/admissions/${id}`);
