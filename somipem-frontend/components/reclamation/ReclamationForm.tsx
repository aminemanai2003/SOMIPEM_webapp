"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ReclamationFormData } from '@/types';

interface ReclamationFormProps {
  onSubmit: (data: ReclamationFormData) => void;
  isLoading: boolean;
  onSuccess?: () => void; // Optional success callback for backward compatibility
}

// Validation schema
const reclamationSchema = z.object({
  title: z.string().min(5, { message: "Le titre doit contenir au moins 5 caractères" }).max(100, { message: "Le titre ne peut pas dépasser 100 caractères" }),
  description: z.string().min(20, { message: "La description doit contenir au moins 20 caractères" }).max(1000, { message: "La description ne peut pas dépasser 1000 caractères" }),
});

const ReclamationForm = ({ onSubmit, isLoading, onSuccess }: ReclamationFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const form = useForm<ReclamationFormData>({
    resolver: zodResolver(reclamationSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    
    // Reset error
    setFileError(null);
    
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("Le fichier est trop volumineux. Taille maximale: 5MB");
        return;
      }
      
      // Check file type (accept only common document types)
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setFileError("Format de fichier non supporté. Formats acceptés: JPEG, PNG, PDF, DOC, DOCX");
        return;
      }
      
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };
  
  const handleSubmit = (data: ReclamationFormData) => {
    // Check if there's a file error
    if (fileError) {
      return;
    }
    
    // Add the file to the form data
    if (file) {
      data.file = file;
    }
    
    onSubmit(data);
    
    // Call onSuccess callback if provided (for tests and backward compatibility)
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Soumettre une nouvelle réclamation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la réclamation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre réclamation en détail" 
                      {...field} 
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <div className="space-y-2">
              <FormLabel>Pièce jointe (optionnel)</FormLabel>
              <Input 
                type="file" 
                onChange={handleFileChange}
                accept=".jpeg,.jpg,.png,.pdf,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              {fileError && (
                <div className="text-sm font-medium text-destructive mt-1">
                  {fileError}
                </div>
              )}
              {file && !fileError && (
                <div className="text-sm text-green-600 mt-1">
                  Fichier sélectionné: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                Formats acceptés: JPEG, PNG, PDF, DOC, DOCX. Taille max: 5MB
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Envoi en cours...' : 'Soumettre la réclamation'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReclamationForm;
