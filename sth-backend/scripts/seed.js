require('dotenv').config();
const mongoose = require('mongoose');
const Offer = require('../src/models/offer');

const sampleOffers = [
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-07-15"),
    returnDate: new Date("2025-07-25"),
    provider: "AirZen",
    price: 750.00,
    currency: "EUR",
    legs: [
      { flightNum: "AZ123", dep: "CDG", arr: "NRT", duration: 720 },
      { flightNum: "AZ456", dep: "NRT", arr: "CDG", duration: 740 }
    ],
    hotel: { name: "Tokyo Luxury Hotel", nights: 10, price: 1200 },
    activity: { title: "Visite du Mont Fuji", price: 150 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-07-15"),
    returnDate: new Date("2025-07-25"),
    provider: "SkyLine",
    price: 650.00,
    currency: "EUR",
    legs: [
      { flightNum: "SL789", dep: "CDG", arr: "HND", duration: 690 }
    ],
    hotel: { name: "Business Hotel Tokyo", nights: 10, price: 800 }
  },
  {
    from: "LON",
    to: "NYC",
    departDate: new Date("2025-08-01"),
    returnDate: new Date("2025-08-10"),
    provider: "Atlantic Airways",
    price: 450.00,
    currency: "EUR",
    legs: [
      { flightNum: "AA101", dep: "LHR", arr: "JFK", duration: 480 }
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/travel_hub?authSource=admin'
    );
    
    console.log('🔗 Connexion MongoDB établie');
    
    // Supprimer les anciennes données
    await Offer.deleteMany({});
    console.log('🧹 Anciennes données supprimées');
    
    // Insérer les nouvelles données
    await Offer.insertMany(sampleOffers);
    console.log('✅ Données de test insérées');
    
    console.log(`📊 ${sampleOffers.length} offres créées`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔚 Connexion fermée');
  }
}

seedDatabase();