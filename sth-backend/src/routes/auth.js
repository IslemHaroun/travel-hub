const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'userId requis' 
      });
    }

    // Générer un token UUID v4
    const token = uuidv4();
    const expiresIn = 900; // 15 minutes

    // Stocker la session dans Redis
    await req.cacheService.createSession(token, userId, expiresIn);

    res.json({
      token,
      expires_in: expiresIn
    });

  } catch (error) {
    console.error('Erreur /login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware pour vérifier l'authentification (optionnel)
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const userId = await req.cacheService.getSession(token);
    if (!userId) {
      return res.status(401).json({ error: 'Session expirée' });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { router, requireAuth };