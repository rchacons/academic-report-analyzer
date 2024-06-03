# Utiliser une image de base officielle de Node.js
FROM node:20.13.1-alpine as build-stage

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Utiliser une image Nginx pour servir les fichiers statiques
FROM nginx:1.21.0-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port sur lequel l'application va tourner
EXPOSE 80
