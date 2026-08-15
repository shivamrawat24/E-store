import axiosInstance from './axiosInstance';

export const orderApi = {
  createOrder: (payload) => axiosInstance.post('/orders', payload),
  verifyPayment: (payload) => axiosInstance.post('/orders/verify', payload),

  getMyOrders: (params) => axiosInstance.get('/orders/my', { params }),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  cancelOrder: (id) => axiosInstance.patch(`/orders/${id}/cancel`),

  // Admin
  getAllOrders: (params) => axiosInstance.get('/orders', { params }),
  updateOrderStatus: (id, orderStatus) => axiosInstance.patch(`/orders/${id}/status`, { orderStatus }),
};

export default orderApi;
