import api from '../api';

export const exportSubjects = async (data) => {
  console.log('exportSubjects:', data);

  try {
    const response = await api.post('/export-to-excel/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Erreur lors de la comparaison des rapports:', error);
    throw error;
  }
};
