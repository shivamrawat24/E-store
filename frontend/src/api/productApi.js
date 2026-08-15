import axiosInstance from './axiosInstance';

/**
 * Builds a multipart FormData payload for product create/update, since
 * these endpoints accept both text fields and image files together.
 */
const buildProductFormData = (payload, imageFiles = []) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });
  imageFiles.forEach((file) => formData.append('images', file));
  return formData;
};

export const productApi = {
  getProducts: (params) => axiosInstance.get('/products', { params }),
  getFeatured: (limit) => axiosInstance.get('/products/featured', { params: { limit } }),
  getBestSellers: (limit) => axiosInstance.get('/products/best-sellers', { params: { limit } }),
  getProduct: (idOrSlug) => axiosInstance.get(`/products/${idOrSlug}`),

  createProduct: (payload, imageFiles) =>
    axiosInstance.post('/products', buildProductFormData(payload, imageFiles), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id, payload, imageFiles, removedImageIds = []) => {
    const merged = { ...payload };
    if (removedImageIds.length > 0) merged.removedImageIds = removedImageIds.join(',');
    return axiosInstance.patch(`/products/${id}`, buildProductFormData(merged, imageFiles), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateStock: (id, stock) => axiosInstance.patch(`/products/${id}/stock`, { stock }),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
};

export default productApi;
