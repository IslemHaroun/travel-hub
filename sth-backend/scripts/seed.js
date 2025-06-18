require('dotenv').config();
const mongoose = require('mongoose');
const Offer = require('../src/models/offer');

const sampleOffers = [
  // Offres PAR -> TYO
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
  
  // Offres depuis villes proches de Paris (LON, ROM, MAD) vers TYO
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-07-16"),
    returnDate: new Date("2025-07-26"),
    provider: "British Air",
    price: 720.00,
    currency: "EUR",
    legs: [
      { flightNum: "BA001", dep: "LHR", arr: "NRT", duration: 710 }
    ],
    hotel: { name: "Tokyo Central Hotel", nights: 10, price: 900 }
  },
  {
    from: "ROM",
    to: "TYO",
    departDate: new Date("2025-07-17"),
    returnDate: new Date("2025-07-27"),
    provider: "Alitalia",
    price: 780.00,
    currency: "EUR",
    legs: [
      { flightNum: "AZ901", dep: "FCO", arr: "NRT", duration: 750 }
    ]
  },
  {
    from: "MAD",
    to: "TYO", 
    departDate: new Date("2025-07-18"),
    returnDate: new Date("2025-07-28"),
    provider: "Iberia",
    price: 690.00,
    currency: "EUR",
    legs: [
      { flightNum: "IB505", dep: "MAD", arr: "NRT", duration: 730 }
    ]
  },

  // Autres destinations
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
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/travel_hub?authSource=admin'
    );
    
    console.log('✅ MongoDB connecté');
    
    // Compter les offres actuelles
    const currentCount = await Offer.countDocuments();
    console.log(`📊 Offres actuelles: ${currentCount}`);
    
    // Supprimer les anciennes données
    const deleted = await Offer.deleteMany({});
    console.log(`🧹 ${deleted.deletedCount} offres supprimées`);
    
    // Insérer les nouvelles données
    const inserted = await Offer.insertMany(sampleOffers);
    console.log(`✅ ${inserted.length} nouvelles offres insérées`);
    
    // Vérifier
    const newCount = await Offer.countDocuments();
    console.log(`📊 Total final: ${newCount} offres`);
    
    // Afficher quelques exemples
    console.log('\n📋 Exemples d\'offres:');
    const examples = await Offer.find().limit(3).select('from to provider price');
    examples.forEach((offer, i) => {
      console.log(`  ${i+1}. ${offer.from} → ${offer.to} - ${offer.provider} (${offer.price}€)`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔚 Connexion fermée');
  }
}

seedDatabase();