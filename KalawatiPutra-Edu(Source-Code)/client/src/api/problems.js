import apiClient from './apiClient';

// Problem CRUD
export const getProblems = (filters) => apiClient.get('/problems', { params: filters });
export const getProblem = (slug) => apiClient.get(`/problems/${slug}`);
export const createProblem = (data) => apiClient.post('/problems', data);
export const updateProblem = (id, data) => apiClient.put(`/problems/${id}`, data);
export const deleteProblem = (id) => apiClient.delete(`/problems/${id}`);

// Code Execution
export const runCode = (data) => apiClient.post('/problems/run', data);
export const runWithSamples = (data) => apiClient.post('/problems/run-samples', data);
export const submitSolution = (data) => apiClient.post('/problems/submit', data);

// Stats & Progress
export const getProblemStats = () => apiClient.get('/problems/stats');
export const getUserProgress = () => apiClient.get('/problems/progress');

// Submissions
export const getUserSubmissions = (problemId) => apiClient.get(`/problems/submissions/${problemId}`);
export const getAllUserSubmissions = () => apiClient.get('/problems/submissions/all');
