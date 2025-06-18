const express = require('express');
const Offer = require('../models/offer');
const router = express.Router();

// GET /offers?from=PAR&to=TYO&limit=10
router.get('/', async (req, res) => {
  try {
    const { from, to, limit = 10, q } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ 
        error: 'Paramètres from et to requis' 
      });
    }

    // 1. Vérifier le cache Redis
    const cached = await req.cacheService.getOffers(from, to);
    if (cached) {
      return res.json({ 
        offers: cached.slice(0, parseInt(limit)),
        cached: true 
      });
    }

    // 2. Requête MongoDB
    let query = { from, to };
    if (q) {
      query.$text = { $search: q };
    }

    const offers = await Offer.find(query)
      .sort({ price: 1 })
      .limit(parseInt(limit))
      .lean();

    // 3. Mettre en cache
    await req.cacheService.setOffers(from, to, offers);

    res.json({ offers, cached: false });
  } catch (error) {
    console.error('Erreur /offers:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /offers/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier cache
    const cached = await req.cacheService.getOfferDetails(id);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Récupérer depuis MongoDB
    const offer = await Offer.findById(id).lean();
    if (!offer) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }

    // Récupérer offres liées via Neo4j
    const relatedCities = await req.neoService.getRelatedOffers(offer.from);
    const relatedOffers = await Offer.find({
      from: { $in: relatedCities },
      to: offer.to,
      _id: { $ne: offer._id }
    }).limit(3).select('_id').lean();

    const result = {
      ...offer,
      relatedOffers: relatedOffers.map(o => o._id.toString())
    };

    // Mettre en cache
    await req.cacheService.setOfferDetails(id, result);

    res.json({ ...result, cached: false });
  } catch (error) {
    console.error('Erreur /offers/:id:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;