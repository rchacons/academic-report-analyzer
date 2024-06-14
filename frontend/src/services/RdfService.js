import api from '../api'

export const getRdfGraph = async (text) => {
  try {
    console.log('text', text);
    const response = await api.post('/main-get-graph-from-sentence/', text, {
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
