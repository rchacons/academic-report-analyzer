# Projet Pro M2 SIREL2

## Développement local

### Prérequis
Pour démarrer l'application localement, il y a deux possibilités : 
1. Démarrer le backend et le frontend séparemment (cf README des /backend et /frontend) 
2. Utiliser le `docker-compose.yml`, qui lancera les trois conteneurs : backend, frontend et le reverse proxy. Afin de faire fonctionner le reverse proxy, il faut utiliser des certificats auto-signés. De cette façon, chaque développeur peut générer son propre certificat pour les tests locaux sans avoir besoin de partager des certificats de production sensibles.

### Certificats auto-signés

Voici comment vous pouvez générer un certificat auto-signé :

```bash
cd nginx 
mkdir certs && cd certs
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

Cela générera des fichiers `key.pem` (clé privée) et `cert.pem` (certificat). Vous pouvez ensuite vérifier que le fichier `docker-compose.yml` contient les informations : 

```
  server:
    image: nginx:1.21-slim
    container_name: sirel2-nginx
    environment:
      - SERVER_NAME=localhost
      - SSL_CERTIFICATE=/etc/ssl/certs/cert.pem
      - SSL_CERTIFICATE_KEY=/etc/ssl/certs/key.pem
    volumes:
      - ./nginx/nginx.conf.template:/etc/nginx/nginx.conf.template
      - ./nginx/start-nginx.sh:/start-nginx.sh
      - ./nginx/certs:/etc/ssl/certs
```


## Développement local frontend

### Prérequis

Avoir une version de node 20+ d'installée sur vote poste

### Configuration de l'authentification

Créer un fichier .env.local à la racine du projet (/frontend)
Remplir les variables avec les identifiants correspondants à la configuration local du backend
Exemple fichier env.local :
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_USERNAME=username
VITE_API_PASSWORD=password
```

### Lancement de l'application en Local

Installation des dépendances :

```
cd frontend
npm install
```

Lancement :

```
npm run dev
```


