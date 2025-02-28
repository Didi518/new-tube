NewTube - Clone de YouTube avec Next.js

NewTube est un clone moderne de YouTube, construit avec Next.js et intégrant diverses technologies avancées pour la gestion des vidéos, l'authentification et la base de données.

🚀 Technologies utilisées

Next.js - Framework React pour le frontend et backend

Drizzle ORM - ORM TypeScript pour une gestion efficace de la base de données

Mux - Service de streaming vidéo performant

Clerk - Gestion de l'authentification des utilisateurs

Upstash (Redis) - Stockage temporaire pour améliorer la performance

QStash - Orchestration des tâches asynchrones

📌 Fonctionnalités

  ```md
  ✅ Authentification sécurisée (Clerk)
  ✅ Téléchargement et gestion des vidéos (Mux)
  ✅ Système d'abonnement aux chaînes
  ✅ Système de like/dislike et réactions
  ✅ Commentaires et réponses
  ✅ Gestion des profils utilisateurs
  ✅ Recherche et filtres avancés
  ✅ Optimisation des performances avec Redis
  ✅ Tâches asynchrones via QStash
  ```

📂 Structure du projet

```md
📦 newtube
┣ 📂 src
┃ ┣ 📂 components # Composants UI réutilisables
┃ ┣ 📂 pages # Pages Next.js
┃ ┣ 📂 hooks # Hooks personnalisés
┃ ┣ 📂 lib # Fonctions utilitaires
┃ ┣ 📂 server # API et backend logic
┃ ┣ 📂 styles # Fichiers CSS / Tailwind
┃ ┣ 📂 db # Modèles et requêtes Drizzle
┣ 📜 .env # Variables d'environnement
┣ 📜 package.json # Dépendances
┣ 📜 README.md # Documentation
```


🚀 Installation et lancement

Clone le projet :

git clone https://github.com/Didi518/new-tube/tree/main
cd newtube

Installe les dépendances :

npm install

Configure tes variables d'environnement dans .env.local :

NEXT_PUBLIC_CLERK_FRONTEND_API=...
DATABASE_URL=...
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
UPSTASH_REDIS_URL=...
QSTASH_TOKEN=...

Lancer le projet en local :

bun dev:all

📜 Licence

Ce projet est open-source sous licence MIT.

Tu peux bien sûr personnaliser certaines parties selon tes besoins ! 😊

