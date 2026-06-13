import api from './axios';

export const getReviews = async (wisataId) => {
  const response = await api.get(`/review/wisata/${wisataId}`);
  return response.data; // Expected format: array of Review objects
};

export const getAverageRating = async (wisataId) => {
  const response = await api.get(`/review/wisata/${wisataId}/average`);
  return response.data; // Expected format: { averageRating, totalReviews }
};

export const createReview = async (reviewData) => {
  const response = await api.post('/review', reviewData);
  return response.data;
};

