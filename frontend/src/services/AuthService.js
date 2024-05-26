import api from '../api';

export const login = async () => {
  const credentials = {
    username: import.meta.env.VITE_API_USERNAME,
    password: import.meta.env.VITE_API_PASSWORD,
  };
  try {
    const response = await api.post('/token', credentials);
    const token = response.data.access_token;
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion:', error);
    throw error;
  }
};
