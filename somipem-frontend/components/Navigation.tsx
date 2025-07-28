"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();
  const [shouldNavigateToLogin, setShouldNavigateToLogin] = useState(false);

  useEffect(() => {
    if (shouldNavigateToLogin) {
      router.push('/login');
      setShouldNavigateToLogin(false);
    }
  }, [shouldNavigateToLogin, router]);

  const handleLogout = () => {
    logout();
    setShouldNavigateToLogin(true);
  };

  return (
    <header className="bg-white shadow-sm py-4 border-b">
      <div className="container mx-auto px-4 flex justify-between items-center">        <Link href="/" className="flex items-center">
          <img src="/Logo_somipem.png" alt="SOMIPEM Logo" className="h-10 w-auto" />
        </Link>

        {user ? (
          <nav className="flex items-center gap-4">
            <Link href="/reclamations" className="text-gray-600 hover:text-blue-600">
              Mes Réclamations
            </Link>
            
            {isAdmin && (
              <>
                <Link href="/admin/reclamations" className="text-gray-600 hover:text-blue-600">
                  Réclamations
                </Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-blue-600">
                  Utilisateurs
                </Link>
              </>
            )}
            
            <div className="flex items-center ml-4 space-x-2">
              <div className="text-sm">
                <span className="block text-gray-900">{user.name}</span>
                <span className="block text-gray-500 text-xs">{user.email}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </nav>
        ) : (
          <Link href="/login" passHref>
            <Button>Connexion</Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navigation;
