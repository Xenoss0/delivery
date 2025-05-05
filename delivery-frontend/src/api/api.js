import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true // Important for cookies
});

// Function to get CSRF token
export const getCsrfToken = async () => {
  return api.get('/sanctum/csrf-cookie');
};

export default api;