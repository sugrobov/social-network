import axios from 'axios';
import storage from './storage'; 

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use(async (config) => {
  const token = await storage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обрабатываем ответы
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Если ошибка 401 и это не запрос к /auth (логин/регистрация)
    if (error.response?.status === 401 && !originalRequest.url.includes('/auth/')) {
      // Очищаем хранилище
      await storage.removeItem('token');
      await storage.removeItem('user');
      // await storage.removeItem('posts');  // ключи не были установлены, убираем
      // await storage.removeItem('stories');
      // Перенаправляем на страницу входа
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;