import api from '../config/axios.js';

// Get Test detail
export const getTestDetail = async (slug) => {
  try{
    const response = await api.get(`/test/${slug}`);
    return response.data;
  }
  catch (error){
    throw error;
  }
}