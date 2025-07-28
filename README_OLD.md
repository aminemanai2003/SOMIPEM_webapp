# SOMIPEM - Application de Gestion des Réclamations

Une application full-stack pour la gestion des réclamations des employés de SOMIPEM.

## Structure du Projet

Le projet est divisé en deux parties :

- `somipem-backend` - API REST NestJS avec authentification JWT et base de données MySQL via Prisma
- `somipem-frontend` - Interface utilisateur Next.js 14+ (App Router) avec TypeScript, Tailwind CSS et shadcn/ui

## Prérequis

- Node.js (v16+)
- XAMPP ou un serveur MySQL
- Git

## Configuration de la Base de Données

1. Démarrez XAMPP et assurez-vous que le service MySQL est en cours d'exécution
2. Créez une base de données nommée `somipem` :
   ```sql
   CREATE DATABASE somipem;
   ```

## Configuration du Backend

1. Accédez au répertoire du backend :
   ```bash
   cd somipem-backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement dans le fichier `.env` :
   ```
   DATABASE_URL="mysql://root@localhost:3306/somipem"
   JWT_SECRET="votre_secret_jwt_secure"
   BETTER_AUTH_JWKS_URI="https://www.better-auth.com/.well-known/jwks.json"
   BETTER_AUTH_AUDIENCE="your-audience"
   BETTER_AUTH_ISSUER="https://www.better-auth.com/"
   PORT=3001
   ```

4. Générez le client Prisma et appliquez les migrations :
   ```bash
   npx prisma migrate dev --name init
   ```

5. Lancez le serveur backend :
   ```bash
   npm run start:dev
   ```

## Configuration du Frontend

1. Accédez au répertoire du frontend :
   ```bash
   cd somipem-frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env.local` pour configurer les variables d'environnement :
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Fonctionnalités

### Authentification
- Connexion via BetterAuth (JWT)
- Protection des routes par rôles (ADMIN/WORKER)

### Réclamations
- Soumission de nouvelles réclamations avec pièces jointes
- Consultation des réclamations soumises
- Tableau de bord d'administration pour gérer toutes les réclamations
- Statistiques sur les réclamations

## Note pour les développeurs

Pour modifier et tester l'application en environnement de développement, il est recommandé de :

1. Lancer le backend en mode développement :
   ```bash
   cd somipem-backend
   npm run start:dev
   ```

2. Lancer le frontend en mode développement :
   ```bash
   cd somipem-frontend
   npm run dev
   ```

## Test End-to-End

Pour tester l'application de bout en bout :

1. Assurez-vous que le backend est en cours d'exécution
2. Exécutez le script de test :
   ```bash
   cd somipem-backend
   npm run test:integration
   ```

## Population de la Base de Données

Un script de seed est disponible pour peupler la base de données avec des données de test :

```bash
cd somipem-backend
npm run seed
```

## Déploiement en Production

### Backend

1. Construire l'application :
   ```bash
   cd somipem-backend
   npm run build
   ```

2. Configurer la base de données en production :
   ```bash
   npx prisma migrate deploy
   ```

3. Démarrer l'application :
   ```bash
   npm run start:prod
   ```

### Frontend

1. Construire l'application :
   ```bash
   cd somipem-frontend
   npm run build
   ```

2. Démarrer l'application :
   ```bash
   npm start
   ```

Pour un déploiement plus robuste, nous recommandons :
- Utiliser Docker pour conteneuriser l'application
- Mettre en place un serveur Nginx comme proxy inverse
- Configurer PM2 pour la gestion des processus Node.js
- Utiliser un service comme AWS S3 pour le stockage des fichiers en production

2. Lancer le frontend en mode développement (dans un autre terminal) :
   ```bash
   cd somipem-frontend
   npm run dev
   ```

3. Pour créer un utilisateur admin, utilisez directement Prisma Studio :
   ```bash
   cd somipem-backend
   npx prisma studio
   ```
   
   Ensuite, créez un utilisateur avec le rôle "ADMIN".

## Déploiement en Production

Pour déployer l'application en production, suivez ces étapes :

1. Backend :
   ```bash
   cd somipem-backend
   npm run build
   npm run start:prod
   ```

2. Frontend :
   ```bash
   cd somipem-frontend
   npm run build
   npm start
   ```

## Technologies Utilisées

### Backend
- NestJS
- Prisma ORM
- MySQL
- JWT Authentication
- Multer pour le téléchargement de fichiers

### Frontend
- Next.js 14+ avec App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Tanstack Query (React Query)
- JWT pour l'authentification côté client
