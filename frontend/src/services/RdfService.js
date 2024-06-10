import api from '../api'

export const getRdfGraph = async (text) => {
  try {
    const response = await api.post('/compare-reports/', text, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error('Erreur lors de la comparaison des rapports:', error)
    throw error
  }
}
