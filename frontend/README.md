## Développement local frontend

### Sommaire
- [Prérequis](#prérequis)
- [Configuration de l'authentification](#configuration-de-lauthentification)
- [Lancement de l'application en Local](#lancement-de-lapplication-en-local)
- [Lancement avec Docker](#lancement-avec-docker)
- [Redémarrage d'un conteneur Docker existant](#redémarrage-dun-conteneur-docker-existant)


### Prérequis

Avoir une version de node 20+ d'installée sur vote poste.

### Configuration de l'authentification

Créer un fichier .env.local à la racine du projet (/frontend)
Remplir les variables avec les identifiants correspondants à la configuration local du backend
Exemple fichier env.local :

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_USERNAME=<username de l'api>
VITE_API_PASSWORD=<password de l'api>
```

Note : Si le front et le back sont deployé directement avec docker compose depuis la racine du projet, changer `http` par `https` pour le reverse proxy :

```
VITE_API_BASE_URL=https://localhost/api/v1
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

L'application est accesible à l'addresse suivante : `http://localhost:5173/`

### Lancement avec Docker

Si vous avez Docker installé, vous pouvez l'utiliser pour démarrer l'application à partir du Dockerfile.

Construire l'image :

```
sudo docker build -t <nom de l'image> .
```

Lancer le conteneur

```
sudo docker run -p 8080:80 --env-file .env <nom de l'image>
```

L'application est accesible à l'addresse suivante : `http://localhost:8080/`

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

L'application devrait être à nouveau accessible à l'adresse `http://localhost:80`.

`Note`: Lorsque vous apportez des modifications au code de l'application, vous devez reconstruire l'image Docker pour que ces modifications soient prises en compte dans le conteneur Docker. N'oubliez pas de supprimer l'ancienne.
