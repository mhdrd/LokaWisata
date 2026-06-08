// Base URL untuk API gateway
export const API_BASE_URL = 'http://localhost:3002/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
