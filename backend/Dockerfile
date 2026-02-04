FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY src/ ./src/

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3001

# Commande de démarrage
CMD ["node", "dist/main.js"]
