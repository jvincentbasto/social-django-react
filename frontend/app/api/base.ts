import axios from 'axios'
import envs from '../constants/envs'

const apiUrl = envs.apiUrl

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true
})


const refreshToken = async () => {
  const response = await api.post('/token/refresh/');
  return response.data
}
api.interceptors.response.use(
  (response) => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const baseApi = {
  api,
  refreshToken
}