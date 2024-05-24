import api from '../api';

export const login = async (credentials) => {
    console.log("creditentials", credentials);
  try {
    const response = await api.post('/token', credentials);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion:', error);
    throw error;
  }
};
