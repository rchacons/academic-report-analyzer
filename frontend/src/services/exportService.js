import api from '../api'

export const exportData = async (data, fileName) => {
  try {
    const response = await api.post('/export-to-excel/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    })

    if (response.status === 200) {
      console.log('response', response);
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${fileName}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  } catch (error) {
    console.error('Erreur lors de la comparaison des rapports:', error)
    throw error
  }
}
