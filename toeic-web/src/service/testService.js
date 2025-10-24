import api from '../config/axios.js';

// Get Test detail
export const getTestDetail = async (slug) => {
    const response = await api.get(`/test/${slug}`);
    return response.data;
}

// Get all Tests
export const getAllTest = async (page, limit) => {
    const response = await api.get(`/test`, {
      params: {
        page,
        limit
      },
    });
    return response.data.data;
}