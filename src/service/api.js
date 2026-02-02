import axios from 'axios';

// Базовий URL твого backend'у
const API_URL = 'http://localhost:3001/api';

// Функція для створення користувача
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/persons`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create user';
  }
};
