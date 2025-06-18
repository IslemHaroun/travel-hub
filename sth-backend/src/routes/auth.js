const express = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    // Validation basique
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email et password sont requis' 
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        error: existingUser.email === email.toLowerCase() 
          ? 'Cet email est déjà utilisé'
          : 'Ce nom d\'utilisateur est déjà pris'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      username,
      email: email.toLowerCase(),
      password,
      firstName,
      lastName
    });

    await user.save();

    // Créer une session automatiquement
    const token = uuidv4();
    const expiresIn = 900; // 15 minutes
    
    await req.cacheService.createSession(token, user._id.toString(), expiresIn);

    res.status(201).json({
      message: 'Compte créé avec succès',
      user: user.toPublicJSON(),
      token,
      expires_in: expiresIn
    });

  } catch (error) {
    console.error('Erreur /register:', error);
    
    // Gestion des erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Données invalides',
        details: errors 
      });
    }
    
    // Erreur de duplication (index unique)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        error: `Ce ${field} est déjà utilisé`
      });
    }
    
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body; // login peut être email ou username
    
    if (!login || !password) {
      return res.status(400).json({ 
        error: 'Login et mot de passe requis' 
      });
    }

    // Chercher l'utilisateur par email ou username
    const user = await User.findOne({
      $or: [
        { email: login.toLowerCase() },
        { username: login }
      ],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Identifiants incorrects' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Identifiants incorrects' 
      });
    }

    // Créer une session
    const token = uuidv4();
    const expiresIn = 900;
    
    await req.cacheService.createSession(token, user._id.toString(), expiresIn);

    res.json({
      message: 'Connexion réussie',
      user: user.toPublicJSON(),
      token,
      expires_in: expiresIn
    });

  } catch (error) {
    console.error('Erreur /login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /auth/profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // Vérifier la session
    const userId = await req.cacheService.getSession(token);
    if (!userId) {
      return res.status(401).json({ error: 'Session expirée' });
    }

    // Récupérer l'utilisateur depuis MongoDB
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erreur /profile:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // Supprimer la session de Redis
      const sessionKey = `session:${token}`;
      await req.cacheService.redis.del(sessionKey);
    }

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur /logout:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Middleware d'authentification
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

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Utilisateur invalide' });
    }

    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { router, requireAuth };