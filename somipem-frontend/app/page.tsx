import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur le Portail des Réclamations SOMIPEM</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Une plateforme pour soumettre et gérer vos réclamations en toute simplicité
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/login">
            <Button size="lg">Accéder à votre compte</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Soumission Simplifiée</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Soumettez vos réclamations en quelques clics. Joignez des documents pour appuyer votre demande.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suivi en Temps Réel</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Suivez l'état de vos réclamations en temps réel et recevez des mises à jour sur leur traitement.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gestion Efficace</CardTitle>
          </CardHeader>
          <CardContent>
            <p>L'administration peut traiter les réclamations rapidement pour une résolution optimale des problèmes.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
