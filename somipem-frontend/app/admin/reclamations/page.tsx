'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ReclamationService } from '@/services/reclamation.service';
import ReclamationCard from '@/components/reclamation/ReclamationCard';
import { ReclamationStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AdminReclamationsPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<ReclamationStatus | 'ALL'>('ALL');

  // All hooks must be called before any conditional returns
  // Récupération de toutes les réclamations
  const { data: reclamations, isLoading: queryLoading, refetch } = useQuery({
    queryKey: ['adminReclamations'],
    queryFn: ReclamationService.getAllReclamations,
    enabled: isAdmin && !isLoading, // Only run query if user is admin and auth is loaded
  });

  // Récupération des statistiques
  const { data: stats } = useQuery({
    queryKey: ['reclamationStats'],
    queryFn: ReclamationService.getReclamationStats,
    enabled: isAdmin && !isLoading, // Only run query if user is admin and auth is loaded
  });

  // Mutation pour mettre à jour le statut d'une réclamation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReclamationStatus }) => 
      ReclamationService.updateReclamationStatus(id, status),
    onSuccess: () => {
      refetch();
    },
  });

  // Vérification des droits d'accès avec useEffect pour éviter les erreurs de setState pendant le render
  useEffect(() => {
    // Wait for auth to load before checking admin status
    if (isLoading) return;
    
    if (user && !isAdmin) {
      router.push('/reclamations');
    }
  }, [user, isAdmin, isLoading, router]);

  // Si l'utilisateur n'est pas admin, ne pas afficher le contenu
  if (isLoading) {
    return <p>Chargement...</p>;
  }
  
  if (!user || !isAdmin) {
    return <p>Accès non autorisé. Redirection...</p>;
  }

  const handleStatusChange = (id: string, status: ReclamationStatus) => {
    statusMutation.mutate({ id, status });
  };

  const filteredReclamations = reclamations 
    ? filter === 'ALL' 
      ? reclamations 
      : reclamations.filter(r => r.status === filter)
    : [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Gestion des Réclamations</h1>
      
      {/* Tableau de bord */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilter('ALL')}>
          <CardHeader className="p-4">
            <CardTitle className="text-xl">Total</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-3xl font-bold">{reclamations?.length || 0}</p>
          </CardContent>
        </Card>
        
        {Object.values(ReclamationStatus).map((status) => {
          const count = stats?.find(s => s.status === status)?.count || 0;
          const colorClass = status === 'PENDING' 
            ? 'bg-yellow-100 border-yellow-500' 
            : status === 'RESOLVED' 
              ? 'bg-green-100 border-green-500' 
              : 'bg-red-100 border-red-500';
          
          return (
            <Card 
              key={status} 
              className={`cursor-pointer border-l-4 ${colorClass}`} 
              onClick={() => setFilter(status)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-xl">
                  {status === 'PENDING' ? 'En attente' : status === 'RESOLVED' ? 'Résolu' : 'Rejeté'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-3xl font-bold">{count}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Filtres */}
      <div className="flex gap-2 mb-4">
        <Badge 
          className={`cursor-pointer ${filter === 'ALL' ? 'bg-blue-600' : 'bg-gray-400'}`}
          onClick={() => setFilter('ALL')}
        >
          Tous
        </Badge>        <Badge 
          className={`cursor-pointer ${filter === ReclamationStatus.PENDING ? 'bg-yellow-500' : 'bg-gray-400'}`}
          onClick={() => setFilter(ReclamationStatus.PENDING)}
        >
          En attente
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === ReclamationStatus.RESOLVED ? 'bg-green-500' : 'bg-gray-400'}`}
          onClick={() => setFilter(ReclamationStatus.RESOLVED)}
        >
          Résolu
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === ReclamationStatus.REJECTED ? 'bg-red-500' : 'bg-gray-400'}`}
          onClick={() => setFilter(ReclamationStatus.REJECTED)}
        >
          Rejeté
        </Badge>
      </div>
      
      {/* Liste des réclamations */}
      {queryLoading ? (
        <p>Chargement des réclamations...</p>
      ) : filteredReclamations.length > 0 ? (
        <div className="space-y-6">
          {filteredReclamations.map((reclamation) => (
            <ReclamationCard 
              key={reclamation.id} 
              reclamation={reclamation} 
              isAdmin={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p>Aucune réclamation ne correspond aux critères sélectionnés.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
