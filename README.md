# Projet Pro M2 SIREL2

## Développement local backend

Pour démarrer l'API localement (en cours de dev) :

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
