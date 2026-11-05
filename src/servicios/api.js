import axios from 'axios';
import { API_URL, TOKEN_KEY } from '../utilidades/constantes';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  // 🔥 Leemos de sessionStorage
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem('repara_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;