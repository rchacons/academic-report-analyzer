# Projet Pro M2 SIREL2

## Développement local

### Prérequis
Pour démarrer l'application localement, il y a deux possibilités (*dans les deux cas il faut créer les fichiers .env du backend et frontend pour simuler les variables d'environnement*) :

1. Démarrer le backend et le frontend séparemment (cf README des /backend et /frontend) 
2. Utiliser le `docker-compose.yml`, qui lancera les trois conteneurs : `backend`, `frontend` et le `reverse proxy`. Afin de faire fonctionner le reverse proxy, il faut utiliser des certificats auto-signés (en production ce sont des vraies certificats). De cette façon, chaque développeur peut générer son propre certificat pour les tests locaux sans avoir besoin de partager des certificats de production sensibles. 

**Attention** : Lors de l'utilisation d'un certificat auto-signé, cela générera un avertissement dans votre navigateur indiquant que le certificat n'est pas fiable. Vous pouvez contourner cet avertissement à des fins de test.


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

### Fonctionnement du reverse proxy

Le reverse proxy est un serveur intermédiaire qui agit comme un intermédiaire entre les clients et les serveurs. Il reçoit les requêtes des clients et les transmet aux serveurs appropriés, puis renvoie les réponses des serveurs aux clients. Dans le contexte de cette application, le reverse proxy est utilisé pour forcer l'utilisation du protocole HTTPS, assurant ainsi la sécurité de l'application.

Lorsque le reverse proxy est utilisé en environnement local, il est configuré pour écouter sur le port 443 (HTTPS). Cela signifie que toutes les connexions doivent être établies via HTTPS, même en développement local. Cela garantit que les données échangées entre le client et le serveur sont chiffrées et sécurisées.

La configuration se trouve dans le fichier `nginx.conf.template`. Il contient deux blocs principaux :

1. **Bloc server (HTTP)** : Ce bloc définit un serveur qui écoute sur le port 80 (HTTP) et redirige toutes les requêtes vers HTTPS. Cela garantit que toutes les connexions sont redirigées vers le protocole sécurisé.

2. **Bloc server (HTTPS)** : Ce bloc définit un serveur qui écoute sur le port 443 (HTTPS). Il spécifie l'emplacement du certificat SSL et de la clé privée nécessaires pour établir une connexion sécurisée. Les requêtes sont ensuite traitées en fonction de leur route :
    - Les requêtes vers `/api/v1/` sont transmises au `backend`, avec des en-têtes CORS spécifiques ajoutés à la réponse.
    - Toutes les autres requêtes sont transmises au `frontend`.


### Lancement avec Docker Compose

Si vous avez Docker et Docker Compose installés, vous pouvez les utiliser pour lancer l'application. Docker Compose permet de gérer plusieurs conteneurs comme un ensemble de services définis dans le fichier `docker-compose.yml`.

Avant de lancer l'application, assurez-vous que les fichiers `.env` du backend et du frontend sont correctement configurés pour simuler les variables d'environnement.

Pour lancer l'application :

```bash
docker compose up
```

Cette commande va démarrer tous les services définis dans le fichier docker-compose.yml. Cela inclut le backend, le frontend et le reverse proxy. Les conteneurs seront lancés en arrière-plan et leurs logs seront affichés dans le terminal.

Pour arrêter l'application :
```bash
docker compose down
```

Cette commande arrête tous les services lancés par `docker compose up`. Elle arrête également et supprime les conteneurs, réseaux, volumes et images définis dans le fichier `docker-compose.yml`.

Si vous voulez juste arrêter les services sans les supprimer, vous pouvez utiliser la commande :
```bash
docker compose stop
```

