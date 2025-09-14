import api from '../config/axios.js';

export const getExam = async (sortBy, page, limit) => {
  try{
    const response = await api.get(`/exams`, {
      params: { sortBy, page, limit },
    });
    return response.data;
  }
  catch (error){
    throw error;
  }
}