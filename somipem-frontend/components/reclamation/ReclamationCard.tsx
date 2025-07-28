"use client";

import { Reclamation, ReclamationStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface ReclamationCardProps {
  reclamation: Reclamation;
  isAdmin?: boolean;
  onStatusChange?: (id: string, status: ReclamationStatus) => void;
}

const statusColors: Record<ReclamationStatus, string> = {
  PENDING: 'bg-yellow-400 hover:bg-yellow-600',
  RESOLVED: 'bg-green-500 hover:bg-green-700',
  REJECTED: 'bg-red-500 hover:bg-red-700',
};

const statusLabels: Record<ReclamationStatus, string> = {
  PENDING: 'En attente',
  RESOLVED: 'Résolu',
  REJECTED: 'Rejeté',
};

const ReclamationCard = ({ reclamation, isAdmin = false, onStatusChange }: ReclamationCardProps) => {
  const handleStatusChange = (status: ReclamationStatus) => {
    if (onStatusChange) {
      onStatusChange(reclamation.id, status);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{reclamation.title}</CardTitle>
          <Badge className={`${statusColors[reclamation.status]}`}>
            {statusLabels[reclamation.status]}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Créée le {formatDate(reclamation.createdAt)}
        </div>
        {isAdmin && reclamation.user && (
          <div className="text-sm text-muted-foreground">
            Par: {reclamation.user.name} ({reclamation.user.email})
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="whitespace-pre-wrap">{reclamation.description}</div>
        
        {reclamation.fileUrl && (
          <div className="mt-4">
            <a 
              href={reclamation.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Voir la pièce jointe
            </a>
          </div>
        )}
      </CardContent>
      
      {isAdmin && reclamation.status === ReclamationStatus.PENDING && (
        <CardFooter className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={() => handleStatusChange(ReclamationStatus.RESOLVED)}
          >
            Résoudre
          </Button>
          <Button 
            variant="outline" 
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => handleStatusChange(ReclamationStatus.REJECTED)}
          >
            Rejeter
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ReclamationCard;
