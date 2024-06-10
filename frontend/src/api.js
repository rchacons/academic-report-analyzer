import axios from 'axios'
import { login } from './services/AuthService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Remplace par l'URL de ton API
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requête pour ajouter le token aux headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de réponse pour gérer les erreurs 401 ou 403(Unauthorized ou Forbidden)
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si une erreur 401 ou 403 est renvoyée
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        console.log('Regénération du token...')
        await login()

        // Mettre à jour l'en-tête Authorization de la requête originale
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`

        // Relancer la requête originale avec le nouveau token
        return api(originalRequest)
      } catch (err) {
        console.error('Erreur lors du renouvellement du token:', err)
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
