require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Services et connexions
const DatabaseConnections = require('./config/database');
const CacheService = require('./services/cacheService');
const Neo4jService = require('./services/neoService');

// Middleware et routes
const logger = require('./middleware/logger');
const offersRoutes = require('./routes/offers');
const { router: authRoutes } = require('./routes/auth');
const recoRoutes = require('./routes/reco');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware global
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(logger);

// Initialisation des services
let cacheService, neoService;

// Middleware pour injecter les services dans req
app.use((req, res, next) => {
  req.cacheService = cacheService;
  req.neoService = neoService;
  next();
});

// Routes
app.use('/offers', offersRoutes);
app.use('/login', authRoutes);
app.use('/reco', recoRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'connected',
      redis: 'connected', 
      neo4j: 'connected'
    }
  });
});

// Gestion d'erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Gestion d'erreurs globale
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  res.status(500).json({ 
    error: 'Erreur interne du serveur' 
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    // Connexion aux bases de données
    await DatabaseConnections.connectMongoDB();
    const redisClient = await DatabaseConnections.connectRedis();
    const neo4jDriver = DatabaseConnections.connectNeo4j();

    // Initialisation des services
    cacheService = new CacheService(redisClient);
    neoService = new Neo4jService(neo4jDriver);

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await DatabaseConnections.closeAll();
  process.exit(0);
});

// Démarrer l'application
startServer();

module.exports = app;