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

Cette commande arrête tous les services lancés par `docker-compose up`. Elle arrête également et supprime les conteneurs, réseaux, volumes et images définis dans le fichier `docker-compose.yml`.

Si vous voulez juste arrêter les services sans les supprimer, vous pouvez utiliser la commande `docker-compose stop` :

Avoir python3 d'installé sur votre poste

Installez Poetry, un outil de gestion de dépendances et de packaging pour Python.

Sur Linux et macOS :
```
curl -sSL https://install.python-poetry.org | python3 -
```

Sur Windows (Powershell) :
```
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -

Si vous n'avez pas resussi avec ce commande, essayez de remplacer py par python dans cette commande.
Après il faut ajouter la chemin de poetry dans PATH.
```

Vérifiez l'installation avec:
```
poetry --version
```

### Installation des dépendances
1. Naviguez vers le répertoire backend du projet et installez les dépendances :

```
cd backend
poetry install
```

Cette commande crée un environnement virtuel et installe toutes les dépendances listées dans `pyproject.toml.`

2. Activez l'environnement virtuel :
```
poetry shell
```

3. Lancez l'API :
```
uvicorn app.main:app --reload
```

L'API sera lancé et accessible depuis l'adresse `http://127.0.0.1:8000`

Adresse de la doc de l'API (et pour faire les tests) `http://127.0.0.1:8000/docs#/`

4. Pour quitter l'environnement virtuel, utilisez la commande :
```
exit
```

## Utilisation quotidienne

Pour relancer le projet, naviguez vers le répertoire `backend` et exécutez :

```
poetry shell
uvicorn app.main:app --reload
```

Pour ajouter une nouvelle dépendance au projet
```
poetry add <package>
```

Par exemple, pour ajouter nltk :
```
poetry add nltk
```

Cette commande installera le package, et mettra à jour les fichiers poetry.lock et pyproject.toml automatiquement.


## Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification. Lorsqu'un utilisateur se connecte avec succès, l'API génère un JWT et le renvoie à l'utilisateur. Ce JWT doit ensuite être inclus dans l'en-tête `Authorization` des requêtes suivantes pour authentifier l'utilisateur.

### Configuration de l'authentification

Pour utiliser l'authentification en local, vous devez définir certaines variables d'environnement dans un fichier `.env`. Vous pouvez vous baser sur le fichier `.env.example` pour savoir quelles variables définir.

Voici les variables d'environnement liées à l'authentification :

- `SECRET_KEY` : La clé secrète utilisée pour signer les JWT.
- `ALGORITHM` : L'algorithme utilisé pour signer les JWT.
- `ACCESS_TOKEN_EXPIRE_MINUTES` : La durée de validité des JWT, en minutes.

### Désactivation de l'authentification

Si vous souhaitez désactiver l'authentification pour des raisons de test ou de développement, vous pouvez le faire en définissant la variable d'environnement `ENABLE_AUTH` à `False` dans votre fichier `.env`.


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

```bash
docker-compose stop
```

