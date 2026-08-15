import axiosInstance from './axiosInstance';

const buildCategoryFormData = (payload, imageFile) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });
  if (imageFile) formData.append('image', imageFile);
  return formData;
};

export const categoryApi = {
  getCategories: (all = false) => axiosInstance.get('/categories', { params: all ? { all: true } : {} }),
  getCategory: (idOrSlug) => axiosInstance.get(`/categories/${idOrSlug}`),

  createCategory: (payload, imageFile) =>
    axiosInstance.post('/categories', buildCategoryFormData(payload, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateCategory: (id, payload, imageFile) =>
    axiosInstance.patch(`/categories/${id}`, buildCategoryFormData(payload, imageFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
};

export default categoryApi;
