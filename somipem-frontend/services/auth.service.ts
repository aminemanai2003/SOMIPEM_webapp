import api from './api';
import { User } from '../types';
import { jwtDecode } from 'jwt-decode';

export const AuthService = {
  /**
   * Authentifie un utilisateur avec son email et mot de passe
   */
  login: async (email: string, password: string): Promise<void> => {
    try {
      console.log('Attempting login for:', email);
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      console.log('Login successful, token received:', !!token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
        document.cookie = `jwt_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 jours
        console.log('Token stored in localStorage and cookies');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur d\'authentification');
    }
  },

  /**
   * Inscrit un nouvel utilisateur
   */
  signup: async (email: string, password: string, name: string): Promise<void> => {
    try {
      console.log('Attempting signup for:', email, name);
      const response = await api.post('/auth/register', { email, password, name });
      console.log('Signup response:', response.data);
      const { token } = response.data;
      console.log('Signup successful, token received:', !!token);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwt_token', token);
        document.cookie = `jwt_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 jours
        console.log('Token stored in localStorage and cookies');
      }
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  },

  /**
   * Déconnecte l'utilisateur en supprimant le token
   */
  logout: (): void => {
    if (typeof window !== 'undefined') {
      // Supprimer du localStorage
      localStorage.removeItem('jwt_token');
      
      // Supprimer du cookie
      document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      // Rediriger vers la page de connexion
      window.location.href = '/login';
    }
  },

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn: (): boolean => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      return !!token;
    }
    return false;
  },

  /**
   * Récupère les informations de l'utilisateur à partir du token JWT
   */
  getUserFromToken: (): User | null => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('jwt_token');
        if (!token) return null;
        
        // Décoder le token JWT pour obtenir les informations utilisateur
        const decoded: any = jwtDecode(token);
        
        return {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          role: decoded.role || 'WORKER', // Par défaut, on suppose que l'utilisateur est un travailleur
        };
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
      return null;
    }
  },
};
