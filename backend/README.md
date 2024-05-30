# Développement local backend

Ce guide vous aidera à démarrer l'API localement.

Vous avez 2 options pour le démarrage locale de l'API : 
1. Lancement avec Docker.
2. Lancement avec le serveur local Uvicorn.

## Prérequis

Avant de démarrer l'API localement, il faut définir certaines variables d'environnement dans un fichier `.env` afin de gérer l'authentication du backend, et la configuration de gunicorn.

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

## Gunicorn 

Gunicorn est un serveur HTTP WSGI pour Python. Il est utilisé pour servir des applications web Python en production. Gunicorn crée un processus pour chaque travailleur et chaque travailleur peut gérer une seule requête à la fois. Vous en avez pas besoin pour le lancement local.

### Configuration de Gunicorn

Pour configurer Gunicorn en local, vous devez définir les variables d'environnement suivantes dans votre fichier `.env`. Vous pouvez vous référer au fichier `.env.example` pour savoir quelles variables définir.

Voici les variables d'environnement liées à Gunicorn :

- `WORKERS_PER_CORE` : Le nombre de travailleurs Gunicorn par cœur de processeur.
- `MAX_WORKERS` : Le nombre maximum de travailleurs que Gunicorn peut utiliser. Cela permet de limiter le nombre de travailleurs, indépendamment du nombre de cœurs de votre machine.
- `HOST` : L'adresse à laquelle Gunicorn doit se lier. Cela est généralement défini à `0.0.0.0` pour une application locale.
- `PORT` : Le port auquel Gunicorn doit se lier.
- `LOG_LEVEL` : Les valeurs possibles sont "debug", "info", "warning", "error" et "critical".
- `GRACEFUL_TIMEOUT` : Le délai en secondes que Gunicorn attendra pour que les travailleurs terminent leurs requêtes en cours lors de l'arrêt ou du redémarrage de Gunicorn.
- `TIMEOUT` : Le délai en secondes après lequel Gunicorn "tue" un travailleur s'il n'a pas terminé sa requête.
- `KEEP_ALIVE` : Le nombre de secondes que Gunicorn attendra pour une nouvelle requête avant de fermer une connexion.

----------------------------------

## Lancement via Docker

### Prérequis

- Avoir Docker installé sur votre machine.

### Instructions
1. Construisez l'image Docker à partir du Dockerfile :
```bash
    docker build -t sirel2-back:1.0.0 .
```

Cette commande construit une image Docker à partir de votre Dockerfile et la taggue avec le nom `sirel2-back:1.0.0`.

2. Exécutez un conteneur à partir de l'image Docker :

```bash
docker run -p 8000:8000 --env-file .env sirel2-back:1.0.0
```

L'application devrait maintenant être accessible à l'adresse `http://localhost:8000`.
Adresse de la doc de l'API (et pour faire les tests) `http://127.0.0.1:8000/docs#/`

`Note`: Maintenant que vous avez créé le conteneur, vous n'avez qu'à le relancer à chaque utilisation.

## Redémarrage d'un conteneur Docker existant

Si vous avez déjà créé un conteneur à partir de l'image Docker, vous n'avez pas besoin de recréer le conteneur chaque fois que vous voulez lancer l'application. Au lieu de cela, vous pouvez simplement redémarrer le conteneur existant.

1. Pour trouver l'ID du conteneur, utilisez la commande suivante :

    ```bash
    docker ps -a
    ```

    Cette commande liste tous les conteneurs, en cours d'exécution ou non. Le conteneur doit être sous le nom : `sirel2-back`

2. Pour redémarrer le conteneur, utilisez la commande suivante, en remplaçant `CONTAINER_ID` par l'ID du conteneur :

    ```bash
    docker restart CONTAINER_ID
    ```

L'application devrait être à nouveau accessible à l'adresse `http://localhost:8000`.

`Note`: Lorsque vous apportez des modifications au code de l'application, vous devez reconstruire l'image Docker pour que ces modifications soient prises en compte dans le conteneur Docker. N'oubliez pas de supprimer l'ancienne. 

## Lancement sans Docker

Cette méthode utilise Uvicorn, un serveur ASGI léger et rapide, qui permet de lancer des applications Python facilement en local.

### Prérequis

Avoir python3 d'installé sur votre poste

Installez Poetry, un outil de gestion de dépendances et de packaging pour Python.

Sur Linux et macOS :
```
curl -sSL https://install.python-poetry.org | python3 -
```

Sur Windows (Powershell) :
```
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
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

