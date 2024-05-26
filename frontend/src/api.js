import axios from 'axios';
import { login } from './services/AuthService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Remplace par l'URL de ton API
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
