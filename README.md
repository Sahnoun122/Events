# 🎪 Events App

Application de gestion d'événements avec NestJS (backend) et Next.js (frontend).

## 🏗️ Structure du Projet

```
Events/
│
├── backend/                 # API NestJS
│   ├── src/                # Code source
│   ├── package.json
│   ├── Dockerfile         # Image Docker
│   ├── .dockerignore
│   ├── .env               # Variables environnement
│   └── .env.example       # Template variables
│
├── frontend/               # Interface Next.js
│   ├── app/               # Pages et composants
│   ├── public/            # Fichiers statiques
│   ├── package.json
│   ├── Dockerfile         # Image Docker
│   ├── .dockerignore
│   ├── .env.local         # Variables environnement
│   └── .env.example       # Template variables
│
├── docker-compose.yml      # Production
├── docker-compose.dev.yml  # Développement
├── docker-compose.prod.yml # Production explicite
│
├── .env.example           # Variables globales (optionnel)
├── .gitignore
└── README.md
```

## 🚀 Démarrage Rapide

### 1. Configuration

Copiez et configurez les variables d'environnement :

```bash
# Backend
cd backend
cp .env.example .env
# Éditez backend/.env

# Frontend  
cd ../frontend
cp .env.example .env.local
# Éditez frontend/.env.local
```

**⚠️ Important** : Changez les mots de passe par défaut dans les fichiers .env !

### 2. Développement

```bash
# Démarrer tous les services en mode développement
docker-compose -f docker-compose.dev.yml up -d --build

# Ou mode normal (équivalent)
docker-compose up -d --build
```

### 3. Production

```bash
# Démarrer en mode production
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🌐 Accès aux Services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:3001 | API REST |
| **MongoDB** | mongodb://localhost:27017 | Base de données |
| **Mongo Express** | http://localhost:8081 | Interface admin DB |

### Connexion Mongo Express
- **Utilisateur** : `admin`
- **Mot de passe** : `admin123` (dev) / Voir votre config (prod)

## 🔧 Variables d'Environnement

### Backend (.env)
```env
DB_HOST=mongodb
DB_PORT=27017
DB_NAME=events_db
DB_USERNAME=admin
DB_PASSWORD=your_secure_password_here

JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

PORT=3001
NODE_ENV=production
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3000
NODE_ENV=production
```

## 📋 Commandes Utiles

### Docker Compose

```bash
# Construire les images
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend

# Arrêter les services
docker-compose down

# Supprimer volumes et images
docker-compose down --volumes --rmi all

# Statut des conteneurs
docker-compose ps
```

### Développement

```bash
# Mode développement avec hot reload
docker-compose -f docker-compose.dev.yml up -d

# Arrêter le mode dev
docker-compose -f docker-compose.dev.yml down
```

### Production

```bash
# Mode production optimisé
docker-compose -f docker-compose.prod.yml up -d

# Arrêter la production
docker-compose -f docker-compose.prod.yml down
```

### Commandes dans les conteneurs

```bash
# Shell dans le backend
docker-compose exec backend sh

# Shell MongoDB
docker-compose exec mongodb mongosh

# Shell dans le frontend
docker-compose exec frontend sh
```

## 🔒 Sécurité

**Variables à changer absolument en production :**

- `DB_PASSWORD` - Mot de passe MongoDB
- `JWT_SECRET` - Secret pour les tokens JWT
- `MONGO_EXPRESS_PASSWORD` - Interface admin DB

**Fichiers à protéger :**
- `backend/.env`
- `frontend/.env.local`
- `.env` (si utilisé)

## 🐛 Dépannage

### Port déjà utilisé
```bash
# Vérifier les ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001

# Arrêter les services
docker-compose down
```

### Problèmes de build
```bash
# Nettoyer le cache Docker
docker system prune -a

# Rebuild sans cache
docker-compose build --no-cache
```

### Base de données inaccessible
```bash
# Redémarrer MongoDB
docker-compose restart mongodb

# Voir les logs
docker-compose logs mongodb
```

## 📦 Technologies

- **Backend** : NestJS, TypeScript, MongoDB, JWT
- **Frontend** : Next.js, React, TypeScript, Tailwind CSS
- **Database** : MongoDB 6
- **Containerization** : Docker & Docker Compose

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**Note** : Assurez-vous d'avoir Docker et Docker Compose installés avant de commencer.