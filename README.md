# SupDeVinci Travel Hub

**Plateforme B2C d'agrégation de voyages avec architecture polyglotte NoSQL**

Une application complète utilisant MongoDB, Redis et Neo4j pour offrir des recherches de voyages ultra-rapides avec recommandations personnalisées.

## 🏗️ Architecture

- **Backend** : Node.js + Express.js + API REST
- **Frontend** : React.js + Tailwind CSS + React Router
- **Bases de données** :
  - **MongoDB** : Stockage des offres de voyage
  - **Redis** : Cache + sessions utilisateur + pub/sub
  - **Neo4j** : Graphe des recommandations de villes

## 📋 Prérequis

- **Node.js** v16+ 
- **Docker** et **Docker Compose**
- **Git**

## 🚀 Installation et lancement

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd travel-hub
```

### 2. Structure du projet

```
travel-hub/
├── sth-backend/          # Backend Express.js
│   ├── src/
│   │   ├── config/       # Connexions aux bases
│   │   ├── models/       # Modèles MongoDB
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Services Redis/Neo4j
│   │   └── middleware/   # Middlewares Express
│   ├── scripts/          # Scripts de seed
│   └── docker-compose.yml
└── sth-frontend/         # Frontend React
    ├── src/
    │   ├── components/   # Composants React
    │   ├── pages/        # Pages de l'app
    │   ├── services/     # Services API
    │   └── context/      # Context React
    └── public/
```

## 🔧 Configuration Backend

### 1. Aller dans le dossier backend

```bash
cd sth-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Créer le fichier `.env` :

```bash
# Serveur
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://admin:password@localhost:27017/travel_hub?authSource=admin

# Redis
REDIS_URI=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_PASSWORD=password
```

### 4. Lancer les services Docker

```bash
# Démarrer MongoDB, Redis et Neo4j
docker-compose up -d

# Vérifier que les services sont démarrés
docker-compose ps
```

**Services disponibles :**
- **MongoDB** : `localhost:27017` (admin/password)
- **Redis** : `localhost:6379`
- **Neo4j** : `localhost:7474` (neo4j/password) - Interface web

### 5. Configurer Neo4j (graphe des villes)

Ouvrir http://localhost:7474 dans le navigateur :
- **Login** : neo4j
- **Password** : password

Exécuter cette requête Cypher pour créer le graphe des villes :

```cypher
// Créer des villes
CREATE (paris:City {code:"PAR", name:"Paris", country:"FR", weight:0.9})
CREATE (tokyo:City {code:"TYO", name:"Tokyo", country:"JP", weight:0.8})
CREATE (london:City {code:"LON", name:"London", country:"UK", weight:0.85})
CREATE (nyc:City {code:"NYC", name:"New York", country:"US", weight:0.95})
CREATE (rome:City {code:"ROM", name:"Rome", country:"IT", weight:0.7})
CREATE (madrid:City {code:"MAD", name:"Madrid", country:"ES", weight:0.75})

// Créer des relations NEAR
CREATE (paris)-[:NEAR {weight:0.8}]->(london)
CREATE (paris)-[:NEAR {weight:0.6}]->(rome)
CREATE (paris)-[:NEAR {weight:0.7}]->(madrid)
CREATE (london)-[:NEAR {weight:0.9}]->(nyc)
CREATE (tokyo)-[:NEAR {weight:0.5}]->(nyc)
CREATE (rome)-[:NEAR {weight:0.6}]->(madrid)

RETURN "Données créées avec succès"
```

### 6. Peupler MongoDB avec des données de test

```bash
# Lancer le script de seed (32 offres de voyage)
npm run seed
```

**Résultat attendu :**
```
✅ 32 nouvelles offres insérées
📊 Total final: 32 offres
📈 Statistiques par route:
  PAR → TYO: 10 offres (760€ en moyenne)
  LON → TYO: 5 offres (721€ en moyenne)
  ...
```

### 7. Démarrer le serveur backend

```bash
# Mode développement avec rechargement automatique
npm run dev

# Ou mode production
npm start
```

**Le serveur sera disponible sur :** http://localhost:3000

### 8. Test des endpoints API

```bash
# Health check
curl http://localhost:3000/health

# Création de compte
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Recherche d'offres (utilise le cache Redis)
curl "http://localhost:3000/offers?from=PAR&to=TYO&limit=5"

# Recommandations (utilise Neo4j)
curl "http://localhost:3000/reco?city=PAR&k=3"
```

## 🎨 Configuration Frontend

### 1. Ouvrir un nouveau terminal et aller dans le dossier frontend

```bash
cd ../sth-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Créer le fichier `.env` :

```bash
REACT_APP_API_URL=http://localhost:3000
```

### 4. Démarrer le serveur frontend

```bash
npm start
```

**L'application sera disponible sur :** http://localhost:3001

## 📱 Utilisation de l'application

### 1. Page d'accueil
- Formulaire de recherche de voyages
- Destinations populaires
- Navigation vers inscription/connexion

### 2. Inscription/Connexion
- **Inscription** : http://localhost:3001/register
- **Connexion** : http://localhost:3001/login
- Gestion des sessions avec Redis

### 3. Recherche d'offres
- **URL** : http://localhost:3001/search?from=PAR&to=TYO&limit=10
- Affichage des résultats avec détails complets
- Recommandations de villes similaires dans la sidebar

### 4. Fonctionnalités testables

**Recherches populaires :**
- `PAR → TYO` : 10 offres (650€ à 1250€)
- `LON → TYO` : 5 offres 
- `PAR → NYC` : 2 offres
- `LON → NYC` : 1 offre

**Recommandations :**
- Depuis **PAR** : recommande LON, ROM, MAD
- Depuis **LON** : recommande NYC
- Testez en cliquant sur les villes recommandées

## 🔧 Scripts disponibles

### Backend (`sth-backend/`)

```bash
npm run dev          # Serveur développement avec nodemon
npm start            # Serveur production
npm run seed         # Peupler la base avec des données de test
npm run docker:up    # Démarrer les services Docker
npm run docker:down  # Arrêter les services Docker
npm run docker:logs  # Voir les logs Docker
```

### Frontend (`sth-frontend/`)

```bash
npm start            # Serveur développement
npm run build        # Build de production
npm test             # Tests unitaires
```

## 🏗️ API Endpoints

### Authentification
- `POST /auth/register` - Création de compte
- `POST /auth/login` - Connexion
- `GET /auth/profile` - Profil utilisateur
- `POST /auth/logout` - Déconnexion

### Offres de voyage
- `GET /offers?from=PAR&to=TYO&limit=10` - Recherche d'offres
- `GET /offers/:id` - Détails d'une offre avec offres liées

### Recommandations
- `GET /reco?city=PAR&k=3` - Recommandations de villes

### Système
- `GET /health` - État des services

## 🚀 Performance

### Contraintes respectées

- **Latence moyenne** : < 200ms (cache hit)
- **Latence maximale** : < 700ms (cache miss + MongoDB)
- **Cache Redis** : TTL 60s pour les recherches, 300s pour les détails
- **Sessions** : TTL 900s (15 minutes)

### Monitoring

```bash
# Logs du backend avec durées des requêtes
npm run dev

# Exemple de log :
✅ GET /offers?from=PAR&to=TYO - 200 - 45ms
⚠️ Requête lente détectée: 750ms
```

## 🛠️ Dépannage

### Services Docker ne démarrent pas

```bash
# Nettoyer et relancer
docker-compose down
docker system prune -f
docker-compose up -d
```

### Erreurs de connexion à MongoDB

```bash
# Vérifier que MongoDB est démarré
docker-compose logs mongodb

# Tester la connexion
mongosh "mongodb://admin:password@localhost:27017/travel_hub?authSource=admin"
```

### Erreurs de connexion à Redis

```bash
# Vérifier Redis
docker-compose logs redis

# Tester la connexion
redis-cli -h localhost -p 6379 ping
```

### Erreurs de connexion à Neo4j

```bash
# Vérifier Neo4j
docker-compose logs neo4j

# Interface web disponible sur http://localhost:7474
```

### Frontend ne charge pas les styles Tailwind

```bash
# Vérifier que le CDN est dans public/index.html
grep "tailwindcss" public/index.html

# Redémarrer le serveur
npm start
```

## 🔄 Réinitialisation complète

```bash
# Backend : arrêter les services et nettoyer
cd sth-backend
docker-compose down -v
docker system prune -f

# Relancer tout
docker-compose up -d
npm run seed
npm run dev

# Frontend : nettoyer le cache
cd ../sth-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📊 Données de test

Le seed contient **32 offres** réparties sur :

- **Routes principales** : PAR→TYO (10), LON→TYO (5), ROM→TYO (3), MAD→TYO (3)
- **Routes européennes** : PAR↔LON, ROM↔MAD, etc.
- **Routes transatlantiques** : LON→NYC, PAR→NYC
- **Prix variés** : de 95€ à 1250€
- **Dates étalées** : sur 2025-2026
- **Compagnies diverses** : Air France, British Airways, Ryanair, Emirates...

## 🎯 Fonctionnalités implémentées

### ✅ Architecture polyglotte
- MongoDB pour les offres
- Redis pour le cache et sessions  
- Neo4j pour les recommandations

### ✅ API REST complète
- Authentification JWT avec bcrypt
- Recherche d'offres avec cache
- Recommandations basées sur graphe
- Gestion d'erreurs et logging

### ✅ Frontend React moderne
- Interface responsive avec Tailwind
- Gestion d'état avec Context API
- Navigation avec React Router
- Formulaires avec validation

### ✅ Performance optimisée
- Cache Redis avec compression
- Index MongoDB optimisés
- Pagination et limitation des résultats
- Monitoring des temps de réponse

---

**Développé dans le cadre du mini-projet SupDeVinci - Intégration de bases NoSQL** 🚀