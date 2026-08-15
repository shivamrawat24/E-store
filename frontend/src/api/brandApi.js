import axiosInstance from './axiosInstance';

const buildBrandFormData = (payload, logoFile) => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, value);
  });
  if (logoFile) formData.append('logo', logoFile);
  return formData;
};

export const brandApi = {
  getBrands: (all = false) => axiosInstance.get('/brands', { params: all ? { all: true } : {} }),
  getBrand: (idOrSlug) => axiosInstance.get(`/brands/${idOrSlug}`),

  createBrand: (payload, logoFile) =>
    axiosInstance.post('/brands', buildBrandFormData(payload, logoFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateBrand: (id, payload, logoFile) =>
    axiosInstance.patch(`/brands/${id}`, buildBrandFormData(payload, logoFile), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteBrand: (id) => axiosInstance.delete(`/brands/${id}`),
};

export default brandApi;
