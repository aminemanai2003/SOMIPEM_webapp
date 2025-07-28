import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Define enums to avoid import issues
enum Role {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER'
}

enum ReclamationStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}

// Initialisation du client Prisma
const prisma = new PrismaClient();

/**
 * Script de seeding pour la base de données SOMIPEM
 * Ce script crée des utilisateurs et des réclamations initiales pour le développement.
 */
async function main() {
  console.log('🌱 Démarrage du seeding...');

  // Suppression des données existantes pour un démarrage propre
  await prisma.reclamation.deleteMany();
  await prisma.user.deleteMany();

  console.log('Création des utilisateurs...');
  
  // Hash password for admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  // Création d'un utilisateur administrateur
  const admin = await prisma.user.create({
    data: {
      email: 'admin@somipem.com',
      name: 'Administrateur SOMIPEM',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`Utilisateur admin créé: ${admin.name} (${admin.email})`);

  // Hash password for workers
  const workerPassword = await bcrypt.hash('worker123', 10);

  // Création de quelques utilisateurs travailleurs
  const workers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'worker1@somipem.com',
        name: 'Ahmed Benali',
        password: workerPassword,
        role: Role.WORKER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'worker2@somipem.com',
        name: 'Fatima Zahra',
        password: workerPassword,
        role: Role.WORKER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'worker3@somipem.com',
        name: 'Mohammed Tazi',
        password: workerPassword,
        role: Role.WORKER,
      },
    }),
  ]);
  console.log(`${workers.length} utilisateurs travailleurs créés`);

  console.log('Création des réclamations...');
  
  // Création de quelques réclamations pour les travailleurs
  const reclamations = await Promise.all([
    // Réclamations de l'utilisateur 1
    prisma.reclamation.create({
      data: {
        title: 'Problème avec l\'équipement de sécurité',
        description: 'Le casque de protection que j\'ai reçu est fissuré et n\'est pas conforme aux normes de sécurité.',
        status: 'PENDING',
        userId: workers[0].id,
      },
    }),
    prisma.reclamation.create({
      data: {
        title: 'Demande de remplacement d\'outil',
        description: 'La perceuse électrique que j\'utilise ne fonctionne plus correctement. Elle surchauffe après quelques minutes d\'utilisation.',
        status: 'RESOLVED',
        userId: workers[0].id,
      },
    }),
    
    // Réclamations de l'utilisateur 2
    prisma.reclamation.create({
      data: {
        title: 'Conditions de travail difficiles',
        description: 'La ventilation dans l\'atelier est insuffisante, surtout pendant les journées chaudes. Cela affecte notre productivité et notre santé.',
        status: 'PENDING',
        userId: workers[1].id,
      },
    }),
    
    // Réclamations de l'utilisateur 3
    prisma.reclamation.create({
      data: {
        title: 'Problème de paiement',
        description: 'Je n\'ai pas reçu ma prime de rendement du mois dernier malgré avoir dépassé les objectifs fixés.',
        status: 'REJECTED',
        userId: workers[2].id,
      },
    }),
    prisma.reclamation.create({
      data: {
        title: 'Demande de formation',
        description: 'Je souhaite suivre une formation sur les nouvelles machines acquises par l\'entreprise afin de pouvoir les utiliser efficacement.',
        status: 'PENDING',
        userId: workers[2].id,
      },
    }),
  ]);

  console.log(`${reclamations.length} réclamations créées`);
  console.log('✅ Seeding terminé avec succès!');
}

// Exécution du script
main()
  .catch((e) => {
    console.error('Erreur pendant le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fermeture de la connexion Prisma
    await prisma.$disconnect();
  });
