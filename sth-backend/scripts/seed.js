require('dotenv').config();
const mongoose = require('mongoose');
const Offer = require('../src/models/offer');

const sampleOffers = [
  // ========== Offres PAR -> TYO (10 offres) ==========
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
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-08-01"),
    returnDate: new Date("2025-08-15"),
    provider: "Air France",
    price: 820.00,
    currency: "EUR",
    legs: [
      { flightNum: "AF275", dep: "CDG", arr: "NRT", duration: 730 }
    ],
    hotel: { name: "Shibuya Grand Hotel", nights: 14, price: 1400 },
    activity: { title: "Tour de Tokyo + Kyoto", price: 280 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-09-10"),
    returnDate: new Date("2025-09-20"),
    provider: "Japan Airlines",
    price: 890.00,
    currency: "EUR",
    legs: [
      { flightNum: "JL415", dep: "CDG", arr: "HND", duration: 700 }
    ],
    hotel: { name: "Akasaka Palace Hotel", nights: 10, price: 1600 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-06-20"),
    returnDate: new Date("2025-06-30"),
    provider: "KLM",
    price: 695.00,
    currency: "EUR",
    legs: [
      { flightNum: "KL861", dep: "CDG", arr: "NRT", duration: 750 }
    ],
    hotel: { name: "Tokyo Budget Inn", nights: 10, price: 600 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-10-05"),
    returnDate: new Date("2025-10-15"),
    provider: "Lufthansa",
    price: 760.00,
    currency: "EUR",
    legs: [
      { flightNum: "LH711", dep: "CDG", arr: "HND", duration: 720 }
    ],
    hotel: { name: "Ginza Premium Hotel", nights: 10, price: 1300 },
    activity: { title: "Cérémonie du thé traditionnelle", price: 120 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-11-12"),
    returnDate: new Date("2025-11-22"),
    provider: "Emirates",
    price: 680.00,
    currency: "EUR",
    legs: [
      { flightNum: "EK315", dep: "CDG", arr: "NRT", duration: 780 }
    ],
    hotel: { name: "Harajuku Style Hotel", nights: 10, price: 950 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-12-20"),
    returnDate: new Date("2026-01-03"),
    provider: "Singapore Airlines",
    price: 1250.00,
    currency: "EUR",
    legs: [
      { flightNum: "SQ335", dep: "CDG", arr: "HND", duration: 740 }
    ],
    hotel: { name: "New Year Tokyo Resort", nights: 14, price: 2200 },
    activity: { title: "Réveillon japonais + Onsen", price: 450 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-05-15"),
    returnDate: new Date("2025-05-25"),
    provider: "Turkish Airlines",
    price: 715.00,
    currency: "EUR",
    legs: [
      { flightNum: "TK183", dep: "CDG", arr: "NRT", duration: 790 }
    ],
    hotel: { name: "Sakura Blossom Hotel", nights: 10, price: 1100 },
    activity: { title: "Festival des cerisiers", price: 180 }
  },
  {
    from: "PAR",
    to: "TYO",
    departDate: new Date("2025-03-08"),
    returnDate: new Date("2025-03-18"),
    provider: "Qatar Airways",
    price: 725.00,
    currency: "EUR",
    legs: [
      { flightNum: "QR39", dep: "CDG", arr: "HND", duration: 760 }
    ],
    hotel: { name: "Roppongi Business Center", nights: 10, price: 850 }
  },

  // ========== Offres LON -> TYO (5 offres) ==========
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-07-16"),
    returnDate: new Date("2025-07-26"),
    provider: "British Airways",
    price: 720.00,
    currency: "EUR",
    legs: [
      { flightNum: "BA001", dep: "LHR", arr: "NRT", duration: 710 }
    ],
    hotel: { name: "Tokyo Central Hotel", nights: 10, price: 900 }
  },
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-08-20"),
    returnDate: new Date("2025-08-30"),
    provider: "Virgin Atlantic",
    price: 785.00,
    currency: "EUR",
    legs: [
      { flightNum: "VS901", dep: "LHR", arr: "HND", duration: 695 }
    ],
    hotel: { name: "Shinjuku Sky Hotel", nights: 10, price: 1050 },
    activity: { title: "Robot Restaurant + Sushi Master Class", price: 220 }
  },
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-09-15"),
    returnDate: new Date("2025-09-25"),
    provider: "JAL",
    price: 690.00,
    currency: "EUR",
    legs: [
      { flightNum: "JL41", dep: "LHR", arr: "NRT", duration: 705 }
    ],
    hotel: { name: "Imperial Palace View", nights: 10, price: 1200 }
  },
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-06-05"),
    returnDate: new Date("2025-06-15"),
    provider: "ANA",
    price: 745.00,
    currency: "EUR",
    legs: [
      { flightNum: "NH211", dep: "LHR", arr: "HND", duration: 720 }
    ],
    hotel: { name: "Asakusa Traditional Inn", nights: 10, price: 780 },
    activity: { title: "Temple Tour + Calligraphie", price: 160 }
  },
  {
    from: "LON",
    to: "TYO",
    departDate: new Date("2025-10-10"),
    returnDate: new Date("2025-10-20"),
    provider: "Finnair",
    price: 665.00,
    currency: "EUR",
    legs: [
      { flightNum: "AY69", dep: "LHR", arr: "NRT", duration: 740 }
    ],
    hotel: { name: "Ueno Park Hotel", nights: 10, price: 920 }
  },

  // ========== Offres ROM -> TYO (3 offres) ==========
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
    from: "ROM",
    to: "TYO",
    departDate: new Date("2025-08-25"),
    returnDate: new Date("2025-09-05"),
    provider: "Emirates",
    price: 820.00,
    currency: "EUR",
    legs: [
      { flightNum: "EK91", dep: "FCO", arr: "HND", duration: 770 }
    ],
    hotel: { name: "Odaiba Seaside Resort", nights: 11, price: 1320 },
    activity: { title: "TeamLab Borderless + Tsukiji Market", price: 190 }
  },
  {
    from: "ROM",
    to: "TYO",
    departDate: new Date("2025-11-01"),
    returnDate: new Date("2025-11-11"),
    provider: "Lufthansa",
    price: 735.00,
    currency: "EUR",
    legs: [
      { flightNum: "LH123", dep: "FCO", arr: "NRT", duration: 780 }
    ],
    hotel: { name: "Autumn Leaves Ryokan", nights: 10, price: 1400 }
  },

  // ========== Offres MAD -> TYO (3 offres) ==========
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
  {
    from: "MAD",
    to: "TYO",
    departDate: new Date("2025-09-01"),
    returnDate: new Date("2025-09-12"),
    provider: "Turkish Airlines",
    price: 755.00,
    currency: "EUR",
    legs: [
      { flightNum: "TK1857", dep: "MAD", arr: "HND", duration: 745 }
    ],
    hotel: { name: "Modern Tokyo Suites", nights: 11, price: 1230 },
    activity: { title: "Manga & Anime Culture Tour", price: 200 }
  },
  {
    from: "MAD",
    to: "TYO",
    departDate: new Date("2025-04-20"),
    returnDate: new Date("2025-04-30"),
    provider: "Qatar Airways",
    price: 710.00,
    currency: "EUR",
    legs: [
      { flightNum: "QR147", dep: "MAD", arr: "NRT", duration: 760 }
    ],
    hotel: { name: "Cherry Blossom Boutique", nights: 10, price: 1050 }
  },

  // ========== Autres destinations variées (8 offres) ==========
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
  },
  {
    from: "PAR",
    to: "NYC",
    departDate: new Date("2025-09-15"),
    returnDate: new Date("2025-09-25"),
    provider: "Delta Airlines",
    price: 520.00,
    currency: "EUR",
    legs: [
      { flightNum: "DL127", dep: "CDG", arr: "JFK", duration: 510 }
    ],
    hotel: { name: "Times Square Hotel", nights: 10, price: 1500 },
    activity: { title: "Broadway Show + Statue of Liberty", price: 280 }
  },
  {
    from: "PAR",
    to: "LON",
    departDate: new Date("2025-06-10"),
    returnDate: new Date("2025-06-15"),
    provider: "Eurostar",
    price: 180.00,
    currency: "EUR",
    legs: [
      { flightNum: "ES9001", dep: "CDG", arr: "STN", duration: 150 }
    ],
    hotel: { name: "Covent Garden Boutique", nights: 5, price: 600 }
  },
  {
    from: "LON",
    to: "ROM",
    departDate: new Date("2025-07-05"),
    returnDate: new Date("2025-07-12"),
    provider: "EasyJet",
    price: 320.00,
    currency: "EUR",
    legs: [
      { flightNum: "U27845", dep: "LGW", arr: "FCO", duration: 165 }
    ],
    hotel: { name: "Roman Forum View", nights: 7, price: 840 },
    activity: { title: "Coliseum Private Tour", price: 150 }
  },
  {
    from: "MAD",
    to: "PAR",
    departDate: new Date("2025-05-20"),
    returnDate: new Date("2025-05-25"),
    provider: "Vueling",
    price: 140.00,
    currency: "EUR",
    legs: [
      { flightNum: "VY8501", dep: "MAD", arr: "ORY", duration: 120 }
    ],
    hotel: { name: "Montmartre Artist Loft", nights: 5, price: 500 }
  },
  {
    from: "ROM",
    to: "MAD",
    departDate: new Date("2025-08-15"),
    returnDate: new Date("2025-08-22"),
    provider: "Ryanair",
    price: 95.00,
    currency: "EUR",
    legs: [
      { flightNum: "FR9142", dep: "CIA", arr: "MAD", duration: 135 }
    ],
    hotel: { name: "Madrid Centro Plaza", nights: 7, price: 490 },
    activity: { title: "Flamenco Show + Prado Museum", price: 120 }
  },
  {
    from: "NYC",
    to: "TYO",
    departDate: new Date("2025-10-01"),
    returnDate: new Date("2025-10-15"),
    provider: "United Airlines",
    price: 950.00,
    currency: "EUR",
    legs: [
      { flightNum: "UA79", dep: "JFK", arr: "NRT", duration: 800 }
    ],
    hotel: { name: "Shibuya Crossing Hotel", nights: 14, price: 1680 },
    activity: { title: "Ultimate Tokyo Experience", price: 400 }
  },
  {
    from: "TYO",
    to: "PAR",
    departDate: new Date("2025-11-20"),
    returnDate: new Date("2025-11-30"),
    provider: "Air France",
    price: 780.00,
    currency: "EUR",
    legs: [
      { flightNum: "AF274", dep: "NRT", arr: "CDG", duration: 740 }
    ],
    hotel: { name: "Champs-Élysées Luxury", nights: 10, price: 1300 },
    activity: { title: "Louvre + Versailles Tour", price: 180 }
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
    
    // Statistiques par destination
    const stats = await Offer.aggregate([
      {
        $group: {
          _id: { from: "$from", to: "$to" },
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    console.log('\n📈 Statistiques par route:');
    stats.forEach(stat => {
      console.log(`  ${stat._id.from} → ${stat._id.to}: ${stat.count} offres (${Math.round(stat.avgPrice)}€ en moyenne)`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔚 Connexion fermée');
  }
}

seedDatabase();