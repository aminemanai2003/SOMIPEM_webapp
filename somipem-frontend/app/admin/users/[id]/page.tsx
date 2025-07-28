'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserService, User } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Unwrap the params promise using React.use()
  const { id } = use(params);

  useEffect(() => {
    // Wait for auth to load before checking admin status
    if (isLoading) return;
    
    if (!isAdmin) {
      router.push('/reclamations');
      return;
    }

    fetchUser();
  }, [isAdmin, isLoading, router, id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await UserService.getUserById(id);
      setUser(userData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'ADMIN' ? (
      <Badge className="bg-purple-500 hover:bg-purple-600">Administrateur</Badge>
    ) : (
      <Badge className="bg-blue-500 hover:bg-blue-600">Travailleur</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: 'bg-yellow-500 hover:bg-yellow-600',
      RESOLVED: 'bg-green-500 hover:bg-green-600',
      REJECTED: 'bg-red-500 hover:bg-red-600',
    };

    const statusLabels = {
      PENDING: 'En attente',
      RESOLVED: 'Résolu',
      REJECTED: 'Rejeté',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {statusLabels[status as keyof typeof statusLabels]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Utilisateur non trouvé'}
        </div>
        <Link href="/admin/users" className="mt-4 inline-block">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Détails de l'utilisateur</h1>
        <div className="flex space-x-2">
          <Link href="/admin/users">
            <Button variant="outline">Retour à la liste</Button>
          </Link>
          <Link href={`/admin/users/${user.id}/edit`}>
            <Button>Modifier</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nom complet</label>
                <div className="text-lg font-semibold">{user.name}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <div className="text-lg">{user.email}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Rôle</label>
                <div className="mt-1">{getRoleBadge(user.role)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Membre depuis</label>
                <div className="text-sm text-gray-800">{formatDate(user.createdAt)}</div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Dernière mise à jour</label>
                <div className="text-sm text-gray-800">{formatDate(user.updatedAt)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Reclamations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Réclamations ({user.reclamations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.reclamations && user.reclamations.length > 0 ? (
                <div className="space-y-4">
                  {user.reclamations.map((reclamation) => (
                    <div key={reclamation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{reclamation.title}</h3>
                        {getStatusBadge(reclamation.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Créée le {formatDate(reclamation.createdAt)}
                      </div>
                      <div className="mt-2">
                        <Link href={`/admin/reclamations?user=${user.id}`}>
                          <Button variant="outline" size="sm">
                            Voir la réclamation
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Cet utilisateur n'a encore créé aucune réclamation
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
