'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoggedIn) {
      router.push('/reclamations');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion à SOMIPEM</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder à la plateforme de réclamations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Pas encore inscrit ?{' '}
          <Link href="/signup" className="ml-1 text-primary hover:underline">
            Créer un compte
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
