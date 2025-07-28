import { Reclamation, ReclamationFormData, ReclamationStatus } from '../types';
import api from './api';

export const ReclamationService = {
  /**
   * Récupère les réclamations de l'utilisateur connecté
   */
  getUserReclamations: async (): Promise<Reclamation[]> => {
    const response = await api.get('/reclamations/me');
    return response.data;
  },

  /**
   * Crée une nouvelle réclamation
   */
  createReclamation: async (data: ReclamationFormData): Promise<Reclamation> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.file) {
      formData.append('file', data.file);
    }
    
    const response = await api.post('/reclamations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Récupère toutes les réclamations (admin seulement)
   */
  getAllReclamations: async (): Promise<Reclamation[]> => {
    const response = await api.get('/admin/reclamations');
    return response.data;
  },

  /**
   * Met à jour le statut d'une réclamation (admin seulement)
   */
  updateReclamationStatus: async (id: string, status: ReclamationStatus): Promise<Reclamation> => {
    const response = await api.patch(`/admin/reclamations/${id}/status`, { status });
    return response.data;
  },

  /**
   * Récupère les statistiques des réclamations (admin seulement)
   */
  getReclamationStats: async (): Promise<{ status: ReclamationStatus; count: number }[]> => {
    const response = await api.get('/admin/reclamations/stats');
    return response.data;
  },
};
