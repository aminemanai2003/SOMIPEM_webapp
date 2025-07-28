'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserService, User, UpdateUserDto } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserDto>({
    email: '',
    name: '',
    password: '',
    role: 'WORKER',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
      setFetchLoading(true);
      const userData = await UserService.getUserById(id);
      setUser(userData);
      setFormData({
        email: userData.email,
        name: userData.name,
        password: '', // Don't pre-fill password
        role: userData.role,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      setError('Le nom et l\'email sont requis');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Don't send password if it's empty
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await UserService.updateUser(id, updateData);
      router.push('/admin/users');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isAdmin) {
    return null;
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link href="/admin/users" className="mt-4 inline-block">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Modifier l'utilisateur</h1>
          <div className="flex space-x-2">
            <Link href="/admin/users">
              <Button variant="outline">Retour à la liste</Button>
            </Link>
            <Link href={`/admin/users/${id}`}>
              <Button variant="outline">Voir les détails</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informations de l'utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nom complet de l'utilisateur"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="adresse@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />
                <div className="text-sm text-gray-500">
                  Laissez vide pour conserver le mot de passe actuel. Minimum 6 caractères si vous changez.
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                >
                  <option value="WORKER">Travailleur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/users">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Mise à jour...' : 'Mettre à jour'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
