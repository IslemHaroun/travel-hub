const express = require('express');
const router = express.Router();

// GET /reco?city=PAR&k=3
router.get('/', async (req, res) => {
  try {
    const { city, k = 3 } = req.query;
    
    if (!city) {
      return res.status(400).json({ 
        error: 'Paramètre city requis' 
      });
    }

    // Requête Neo4j pour les recommandations
    const recommendations = await req.neoService.getRecommendations(
      city, 
      parseInt(k) // ← S'assurer que c'est un entier
    );

    res.json({
      city,
      recommendations
    });

  } catch (error) {
    console.error('Erreur /reco:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;