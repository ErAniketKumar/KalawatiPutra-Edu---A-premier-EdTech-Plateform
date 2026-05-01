import apiClient from './apiClient';

// Roadmaps
export const getRoadmaps = () => apiClient.get('/admin/roadmaps');
export const createRoadmap = (data) => apiClient.post('/admin/roadmaps', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateRoadmap = (id, data) => apiClient.put(`/admin/roadmaps/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteRoadmap = (id) => apiClient.delete(`/admin/roadmaps/${id}`);

// DSA Practice
export const getDsaQuestions = () => apiClient.get('/admin/dsapractice');
export const createDsaQuestion = (data) => apiClient.post('/admin/dsapractice', data);
export const updateDsaQuestion = (id, data) => apiClient.put(`/admin/dsapractice/${id}`, data);
export const deleteDsaQuestion = (id) => apiClient.delete(`/admin/dsapractice/${id}`);

// Internships
export const getInternships = () => apiClient.get('/admin/internships');
export const createInternship = (data) => apiClient.post('/admin/internships', data);
export const updateInternship = (id, data) => apiClient.put(`/admin/internships/${id}`, data);
export const deleteInternship = (id) => apiClient.delete(`/admin/internships/${id}`);

// Mentorships
export const getMentorships = () => apiClient.get('/admin/mentorships');
export const createMentorship = (data) => apiClient.post('/admin/mentorships', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateMentorship = (id, data) => apiClient.put(`/admin/mentorships/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteMentorship = (id) => apiClient.delete(`/admin/mentorships/${id}`);
export const submitMentorshipBooking = (data) => apiClient.post('/mentorship-bookings', data);

// Counseling
export const getCounselingPosts = () => apiClient.get('/admin/counseling');
export const createCounselingPost = (data) => apiClient.post('/admin/counseling', data);
export const updateCounselingPost = (id, data) => apiClient.put(`/admin/counseling/${id}`, data);
export const deleteCounselingPost = (id) => apiClient.delete(`/admin/counseling/${id}`);
export const submitCounselingBooking = (data) => apiClient.post('/counseling-bookings', data);
