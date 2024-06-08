import api from '../api';

export const compareReports = async (file1, file2, file3) => {
  const formData = new FormData();
  formData.append('file1', file1);
  formData.append('file2', file2);

  if (file3 !== null && file3 !== undefined) {
    formData.append('file3', file3);
  }

  try {
    const response = await api.post('/compare-reports/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error('Erreur lors de la comparaison des rapports:', error);
    throw error;
  }
};

export const compareBiblio = async (file1, file2) => {
  const formData = new FormData();
  formData.append('file1', file1);
  formData.append('file2', file2);

  try {
    const response = await api.post('/compare-book-list/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error('Erreur lors de la comparaison des bibliographies:', error);
    throw error;
  }
};
