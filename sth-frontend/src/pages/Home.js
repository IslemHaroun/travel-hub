import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    limit: 10
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchForm.from && searchForm.to) {
      navigate(`/search?from=${searchForm.from}&to=${searchForm.to}&limit=${searchForm.limit}`);
    }
  };

  const popularDestinations = [
    { code: 'PAR', name: 'Paris', country: 'France', image: '🇫🇷' },
    { code: 'TYO', name: 'Tokyo', country: 'Japon', image: '🇯🇵' },
    { code: 'LON', name: 'Londres', country: 'Royaume-Uni', image: '🇬🇧' },
    { code: 'NYC', name: 'New York', country: 'États-Unis', image: '🇺🇸' },
    { code: 'ROM', name: 'Rome', country: 'Italie', image: '🇮🇹' },
    { code: 'MAD', name: 'Madrid', country: 'Espagne', image: '🇪🇸' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Voyagez en toute simplicité
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Découvrez des offres personnalisées pour vos voyages
            </p>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Départ
                    </label>
                    <input
                      type="text"
                      placeholder="PAR, LON, NYC..."
                      className="input-field text-gray-900"
                      value={searchForm.from}
                      onChange={(e) => setSearchForm({...searchForm, from: e.target.value.toUpperCase()})}
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="TYO, ROM, MAD..."
                      className="input-field text-gray-900"
                      value={searchForm.to}
                      onChange={(e) => setSearchForm({...searchForm, to: e.target.value.toUpperCase()})}
                      maxLength={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de résultats
                    </label>
                    <select
                      className="input-field text-gray-900"
                      value={searchForm.limit}
                      onChange={(e) => setSearchForm({...searchForm, limit: parseInt(e.target.value)})}
                    >
                      <option value={5}>5 offres</option>
                      <option value={10}>10 offres</option>
                      <option value={20}>20 offres</option>
                    </select>
                  </div>
                </div>
                
<button
  type="submit"
  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
>
  <Search className="h-5 w-5" />
  <span>Rechercher des offres</span>
</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Travel Hub ?
          </h2>
          <p className="text-lg text-gray-600">
            Une plateforme innovante pour tous vos besoins de voyage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Recherche intelligente
            </h3>
            <p className="text-gray-600">
              Trouvez les meilleures offres en temps réel grâce à notre algorithme avancé
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Recommandations personnalisées
            </h3>
            <p className="text-gray-600">
              Découvrez des destinations similaires basées sur vos préférences
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Réponse ultra-rapide
            </h3>
            <p className="text-gray-600">
              Résultats en moins de 200ms grâce à notre architecture optimisée
            </p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Destinations populaires
            </h2>
            <p className="text-lg text-gray-600">
              Explorez nos destinations les plus recherchées
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularDestinations.map((destination) => (
              <div
                key={destination.code}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-center cursor-pointer"
                onClick={() => setSearchForm({...searchForm, to: destination.code})}
              >
                <div className="text-4xl mb-3">{destination.image}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {destination.country}
                </p>
                <p className="text-xs text-primary-600 font-medium">
                  {destination.code}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt pour votre prochaine aventure ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Créez votre compte et accédez à des offres exclusives
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Commencer maintenant
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;