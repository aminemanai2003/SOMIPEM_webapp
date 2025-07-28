# SOMIPEM Web Application 🏭

Une application web complète pour la gestion des réclamations de l'entreprise SOMIPEM, développée avec Next.js, NestJS, et Prisma.

![SOMIPEM Logo](Logo_somipem.png)

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Gestion des réclamations** (création, visualisation, mise à jour)
- **Interface d'administration** pour les administrateurs
- **Gestion des utilisateurs** avec rôles (Admin/Worker)
- **API RESTful** complète
- **Interface utilisateur moderne** avec Tailwind CSS

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15.3.4** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **React Query** - Gestion d'état et cache
- **Shadcn/ui** - Composants UI

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM pour base de données
- **JWT** - Authentification
- **bcrypt** - Hash des mots de passe
- **MySQL/MariaDB** - Base de données

## 📦 Installation

### Prérequis
- Node.js (v18 ou plus récent)
- npm ou yarn
- MySQL/MariaDB

### 1. Cloner le repository
```bash
git clone https://github.com/aminemanai2003/SOMIPEM_webapp.git
cd SOMIPEM_webapp
```

### 2. Configuration de la base de données

Créer une base de données MySQL/MariaDB et un utilisateur:

```sql
CREATE DATABASE somipem;
CREATE USER 'somipem'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON somipem.* TO 'somipem'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuration du Backend

```bash
cd somipem-backend
npm install

# Copier et configurer le fichier d'environnement
cp .env.example .env
# Éditer .env avec vos informations de base de données

# Déployer le schéma de base de données
npx prisma db push

# Peupler la base de données avec des données de test
npm run seed
```

### 4. Configuration du Frontend

```bash
cd ../somipem-frontend
npm install --legacy-peer-deps

# Copier et configurer le fichier d'environnement
cp .env.example .env.local
# Éditer .env.local si nécessaire
```

### 5. Lancement des serveurs

**Backend (Terminal 1):**
```bash
cd somipem-backend
npm run start:dev
```

**Frontend (Terminal 2):**
```bash
cd somipem-frontend
npm run dev
```

## 🌐 Accès à l'application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 👥 Comptes de test

### Administrateur
- **Email**: admin@somipem.com
- **Mot de passe**: admin123

### Travailleurs
- **Email**: worker1@somipem.com | **Mot de passe**: worker123
- **Email**: worker2@somipem.com | **Mot de passe**: worker123
- **Email**: worker3@somipem.com | **Mot de passe**: worker123

## 📚 Structure du projet

```
SOMIPEM_webapp/
├── somipem-backend/          # API NestJS
│   ├── src/
│   │   ├── auth/            # Module d'authentification
│   │   ├── user/            # Module utilisateur
│   │   ├── reclamation/     # Module réclamation
│   │   └── prisma/          # Service Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma de base de données
│   │   └── seed.ts          # Données de test
│   └── uploads/             # Fichiers téléchargés
├── somipem-frontend/         # Application Next.js
│   ├── app/                 # Pages et routes
│   ├── components/          # Composants React
│   ├── services/            # Services API
│   ├── hooks/               # Hooks React personnalisés
│   └── types/               # Types TypeScript
└── README.md
```

## 🔧 Scripts disponibles

### Backend
```bash
npm run start:dev     # Démarrage en mode développement
npm run build        # Build de production
npm run start:prod   # Démarrage en production
npm run seed         # Peupler la base de données
```

### Frontend
```bash
npm run dev          # Démarrage en mode développement
npm run build        # Build de production
npm run start        # Démarrage du build de production
npm run test         # Lancement des tests
```

## 🎯 Fonctionnalités par rôle

### Pour les employés
- ✅ Créer des réclamations avec description détaillée
- ✅ Visualiser l'historique de leurs réclamations
- ✅ Suivre le statut des réclamations (En attente, Résolue, Rejetée)
- ✅ Interface utilisateur intuitive et responsive

### Pour les administrateurs
- ✅ Dashboard avec vue d'ensemble des réclamations
- ✅ Gestion complète des réclamations
- ✅ Gestion des utilisateurs et des rôles
- ✅ Interface d'administration dédiée

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés avec expiration
- **Hachage des mots de passe** : bcrypt avec salt
- **Validation des données** : Validation côté client et serveur
- **Protection des routes** : Middleware de sécurité
- **CORS configuré** : Protection contre les requêtes malveillantes

## 🧪 Tests

Pour lancer les tests :

```bash
# Tests frontend
cd somipem-frontend
npm run test

# Tests backend (si disponibles)
cd somipem-backend
npm run test
```

## 🚀 Déploiement

L'application peut être déployée sur :
- **Vercel** (Frontend)
- **Railway/Heroku** (Backend)
- **PlanetScale/AWS RDS** (Base de données)

## 🤝 Contribution

Les contributions sont les bienvenues! Pour contribuer:

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📋 TODO / Améliorations futures

- [ ] Notifications en temps réel
- [ ] Application mobile
- [ ] Support de fichiers joints
- [ ] Système de commentaires
- [ ] Export de rapports
- [ ] API de notifications par email
- [ ] Dashboard avec graphiques
- [ ] Support multilingue

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Amine Manai** - aminemanai2003@gmail.com

Lien du projet: [https://github.com/aminemanai2003/SOMIPEM_webapp](https://github.com/aminemanai2003/SOMIPEM_webapp)

---

⭐ **N'hésitez pas à donner une étoile au projet si vous le trouvez utile!**
