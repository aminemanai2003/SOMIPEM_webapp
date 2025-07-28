import axios from 'axios';

// Création d'une instance axios avec l'URL de base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Ajout d'un intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  // Récupérer le token JWT du localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;
  
  // Si un token existe, l'ajouter à l'en-tête Authorization
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
