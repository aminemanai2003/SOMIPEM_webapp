"use client";

import { useEffect, useState } from 'react';
import { User } from '../types';
import { AuthService } from '../services/auth.service';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (AuthService.isLoggedIn()) {
      const userData = AuthService.getUserFromToken();
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    try {
      console.log('useAuth: Starting login process');
      await AuthService.login(email, password);
      const userData = AuthService.getUserFromToken();
      console.log('useAuth: User data retrieved:', userData);
      setUser(userData);
      console.log('useAuth: Login completed successfully');
      // Navigation will be handled by useEffect in consuming components
    } catch (error) {
      console.error('useAuth: Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log('useAuth: Starting signup process');
      await AuthService.signup(email, password, name);
      const userData = AuthService.getUserFromToken();
      console.log('useAuth: User data retrieved after signup:', userData);
      setUser(userData);
      console.log('useAuth: Signup completed successfully');
      // Navigation will be handled by useEffect in consuming components
    } catch (error) {
      console.error('useAuth: Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    // Navigation will be handled by useEffect in consuming components
  };
  return {
    user,
    isLoading,
    login,
    signup,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'ADMIN',
  };
};
