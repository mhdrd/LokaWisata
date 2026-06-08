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

export function saveToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}

export function saveUser(user: { id: number; name: string; email: string; role: string }) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}
