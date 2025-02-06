# Tester le projet

# Service mail

1. Modifier les infos de connexion à l'API Oauth2

- Modifier les fichiers credentials.example.json et token.example.json avec les infos de connexion à l'API Oauth2
- Puis renommer les fichiers en supprimant .example. ==> credentials.example.json -> credentials.json

2. Se rendre dans le dossier micro-mail

```sh
cd micro-mail/
```

2. Lancer le service 

```sh
go run main.go
```

# Service User

1. Se rendre dans le dossier micro-user/

```sh
cd micro-user/
```

2. Installer les dépendances

```sh
npm i
```

3. Lancer le serveur

```sh
npm run dev
```

Le serveur sera actif sur le port 4000

# Service Tasks

1. Se rendre dans le dossier micro-todolist/

```sh
cd micro-todolist/
```

2. Installer les dépendances

```sh
npm i
```

3. Lancer le serveur

```sh
npm run dev
```

Le serveur sera actif sur le port 5001

# Frontend

1. Se rendre dans le dossier frontend/

```sh
cd frontend/
```

2. Installer les dépendances

```sh
npm i
```

3. Lancer le front

```sh
npm run dev
```

Le front sera actif sur le port 3000

