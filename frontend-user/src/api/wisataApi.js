import api from './axios';

export const getWisata = async (params = {}) => {
  const { search, kategoriId, page = 1, limit = 10 } = params;
  const queryParts = [];
  
  if (search) queryParts.push(`search=${encodeURIComponent(search)}`);
  if (kategoriId) queryParts.push(`kategoriId=${kategoriId}`);
  if (page) queryParts.push(`page=${page}`);
  if (limit) queryParts.push(`limit=${limit}`);
  
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const response = await api.get(`/wisata${queryString}`);
  return response.data; // Expected format: { data: [...], meta: { total, page, limit, totalPages } }
};

export const getWisataById = async (id) => {
  const response = await api.get(`/wisata/${id}`);
  return response.data; // Expected format: Wisata object
};

export const getKategori = async () => {
  const response = await api.get('/kategori');
  return response.data; // Expected format: array of categories
};

