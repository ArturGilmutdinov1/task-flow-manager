import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || "";

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    // Получаем пользователя из localStorage
    const userJSON = localStorage.getItem('tfm_current_user')
    
    if (userJSON) {
      try {
        const user = JSON.parse(userJSON)
        
        if (user.id) {
          config.params = config.params || {}
          config.params.userId = user.id
          config.params.role = user.role
        }
      } catch (error) {
        console.error('Ошибка парсинга пользователя:', error)
      }
    }
    
    return config
  },
  (error) => Promise.reject(error)
)