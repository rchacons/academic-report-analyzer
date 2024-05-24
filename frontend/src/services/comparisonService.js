import api from '../api';

export const compareReports = async (file1, file2) => {
  const formData = new FormData();
  formData.append('file1', file1);
  formData.append('file2', file2);

  try {
    const response = await api.post('/compare-reports/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers));
    console.log('Response data:', JSON.stringify(response.data));
    } catch (error) {
    console.error('Erreur lors de la comparaison des rapports:', error);
    throw error;
  }
};
