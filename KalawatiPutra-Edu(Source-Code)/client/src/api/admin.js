import apiClient from './apiClient';

export const getCounselingBookings = () => apiClient.get('/counseling-bookings');
export const updateCounselingBookingStatus = (id, status) => apiClient.put(`/counseling-bookings/${id}`, { status });

export const getMentorshipBookings = () => apiClient.get('/mentorship-bookings');
export const updateMentorshipBookingStatus = (id, status) => apiClient.put(`/mentorship-bookings/${id}`, { status });

export const getAdminArticles = () => apiClient.get('/admin/articles');
export const approveArticle = (id) => apiClient.post(`/admin/articles/${id}/approve`);
export const denyArticle = (id) => apiClient.post(`/admin/articles/${id}/deny`);

export const getAdminCourses = () => apiClient.get('/admin/courses');

export const getIssues = () => apiClient.get('/issues');
export const deleteIssue = (id) => apiClient.delete(`/issues/${id}`);

export const getContacts = () => apiClient.get('/contacts');
export const deleteContact = (id) => apiClient.delete(`/contacts/${id}`);

export const getWorkshopForms = () => apiClient.get('/workshop');
export const deleteWorkshopForm = (id) => apiClient.delete(`/workshop/${id}`);
