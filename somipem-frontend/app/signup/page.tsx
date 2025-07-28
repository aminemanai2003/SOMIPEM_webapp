'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
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
          <CardTitle className="text-2xl">Inscription à SOMIPEM</CardTitle>
          <CardDescription>
            Créez votre compte pour accéder à la plateforme de réclamations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Déjà inscrit ?{' '}
          <Link href="/login" className="ml-1 text-primary hover:underline">
            Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
