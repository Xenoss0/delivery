// src/services/authService.js
import api from './api';

export const authService = {
  login: async (email, password) => {
    // Get CSRF cookie first (nécessaire pour Sanctum)
    await api.get('/sanctum/csrf-cookie');
    
    // Envoi des identifiants pour connexion
    return api.post('/login', { email, password });
  },
  
  register: async (userData) => {
    await api.get('/sanctum/csrf-cookie');
    return api.post('/register', userData);
  },
  
  logout: () => {
    return api.post('/logout');
  },
  
  getUser: () => {
    return api.get('/user');
  }
};