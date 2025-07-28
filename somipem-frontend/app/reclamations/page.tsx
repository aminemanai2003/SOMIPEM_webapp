'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import ReclamationForm from '@/components/reclamation/ReclamationForm';
import ReclamationCard from '@/components/reclamation/ReclamationCard';
import { ReclamationService } from '@/services/reclamation.service';
import { ReclamationFormData } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ReclamationsPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Récupération des réclamations de l'utilisateur
  const { data: reclamations, isLoading, refetch } = useQuery({
    queryKey: ['userReclamations'],
    queryFn: ReclamationService.getUserReclamations,
  });
  
  // Mutation pour créer une nouvelle réclamation
  const createMutation = useMutation({
    mutationFn: (data: ReclamationFormData) => ReclamationService.createReclamation(data),
    onSuccess: () => {
      refetch();
      setIsFormVisible(false);
      setSuccessDialogOpen(true);
      setErrorMessage(null);
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.message || 
        "Une erreur s'est produite lors de l'envoi de votre réclamation. Veuillez réessayer."
      );
    }
  });
  
  // Auto-close success dialog after 3 seconds
  useEffect(() => {
    if (successDialogOpen) {
      const timer = setTimeout(() => {
        setSuccessDialogOpen(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [successDialogOpen]);
  
  const handleSubmit = (data: ReclamationFormData) => {
    setErrorMessage(null);
    createMutation.mutate(data);
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Mes Réclamations</h1>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          {isFormVisible ? 'Masquer le formulaire' : 'Nouvelle réclamation'}
        </button>
      </div>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur! </strong>
          <span className="block sm:inline">{errorMessage}</span>
          <span 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setErrorMessage(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Fermer</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      
      {isFormVisible && (
        <ReclamationForm 
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending} 
        />
      )}
      
      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Réclamation soumise avec succès</DialogTitle>
            <DialogDescription>
              Votre réclamation a été enregistrée. Vous pouvez suivre son statut dans la liste ci-dessous.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      {isLoading ? (
        <p>Chargement des réclamations...</p>
      ) : reclamations && reclamations.length > 0 ? (
        <div className="space-y-6">
          {reclamations.map((reclamation) => (
            <ReclamationCard 
              key={reclamation.id} 
              reclamation={reclamation} 
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Aucune réclamation trouvée</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Vous n&apos;avez pas encore soumis de réclamations. Utilisez le bouton ci-dessus pour en créer une.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
