FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY next.config.js ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY next-env.d.ts ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY app/ ./app/
COPY context/ ./context/
COPY public/ ./public/

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
