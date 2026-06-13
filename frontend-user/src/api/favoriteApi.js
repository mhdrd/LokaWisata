import api from './axios';

export const toggleFavorite = async (wisataId) => {
  const response = await api.post('/favorite/toggle', { wisataId });
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/favorite');
  return response.data; // Expected format: array of Favorite objects
};

