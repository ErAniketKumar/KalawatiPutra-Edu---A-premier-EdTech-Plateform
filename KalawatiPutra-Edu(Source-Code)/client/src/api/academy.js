import apiClient from './apiClient';

// Articles
export const getArticles = (params) => apiClient.get('/articles', { params });
export const getArticleById = (id) => apiClient.get(`/articles/${id}`);
export const getUserArticles = () => apiClient.get('/articles/user/articles');
export const createArticle = (data) => apiClient.post('/articles', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateArticle = (id, data) => apiClient.put(`/articles/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteArticle = (id) => apiClient.delete(`/articles/${id}`);

// Courses
export const getCourses = (params) => apiClient.get('/courses', { params });
export const getCourseById = (id) => apiClient.get(`/courses/${id}`);
export const getCourseContent = (id) => apiClient.get(`/courses/${id}/content`);
export const getCourseStats = () => apiClient.get('/courses/stats');
export const createCourse = (data) => apiClient.post('/courses', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCourse = (id, data) => apiClient.put(`/courses/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateCourseStatus = (id, status) => apiClient.patch(`/courses/${id}/status`, { status });
export const deleteCourse = (id) => apiClient.delete(`/courses/${id}`);
export const enrollCourse = (courseId) => apiClient.post(`/courses/${courseId}/enroll`);
export const markTopicComplete = (courseId, topicId) => apiClient.post(`/courses/${courseId}/complete`, { topicId });
export const getDownloadUrl = (filename) => {
    const baseURL = apiClient.defaults.baseURL;
    return `${baseURL}/courses/download/${filename}`;
};
