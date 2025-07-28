import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'WORKER';
  createdAt: string;
  updatedAt: string;
  _count?: {
    reclamations: number;
  };
  reclamations?: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'WORKER';
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
  password?: string;
  role?: 'ADMIN' | 'WORKER';
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  workerUsers: number;
  recentUsers: User[];
}

export const UserService = {
  /**
   * Récupère tous les utilisateurs
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs');
    }
  },

  /**
   * Récupère un utilisateur par son ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur');
    }
  },

  /**
   * Crée un nouvel utilisateur
   */
  createUser: async (userData: CreateUserDto): Promise<User> => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    }
  },

  /**
   * Met à jour un utilisateur
   */
  updateUser: async (id: string, userData: UpdateUserDto): Promise<User> => {
    try {
      const response = await api.put(`/admin/users/${id}`, userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/users/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
    }
  },

  /**
   * Récupère les statistiques des utilisateurs
   */
  getUserStats: async (): Promise<UserStats> => {
    try {
      const response = await api.get('/admin/users/stats/overview');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  },
};
