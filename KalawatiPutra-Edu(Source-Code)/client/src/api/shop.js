import apiClient from './apiClient';

export const getOrders = (page = 1) => apiClient.get(`/orders?page=${page}`);
export const getOrderById = (id) => apiClient.get(`/orders/${id}`);
export const checkout = (data) => apiClient.post('/orders/checkout', data);
export const verifyPayment = (data) => apiClient.post('/orders/verify-payment', data);

export const getCart = () => apiClient.get('/cart');
export const addToCart = (data) => apiClient.post('/cart/add', data);
export const removeFromCart = (goodieId) => apiClient.delete(`/cart/remove/${goodieId}`);
export const updateCartItem = (goodieId, data) => apiClient.put(`/cart/update/${goodieId}`, data);

export const getGoodies = () => apiClient.get('/goodies');
export const createGoody = (data) => apiClient.post('/admin/goodies', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateGoody = (id, data) => apiClient.put(`/admin/goodies/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteGoody = (id) => apiClient.delete(`/admin/goodies/${id}`);
