import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Euro, Plane, Building, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { offersService, recommendationsService } from '../services/api';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchForm, setSearchForm] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    limit: parseInt(searchParams.get('limit')) || 10
  });
  
  const [offers, setOffers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Effectuer une recherche automatique si les paramètres URL sont présents
  useEffect(() => {
    if (searchForm.from && searchForm.to) {
      handleSearch();
    }
  }, []); // Seulement au montage du composant

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!searchForm.from || !searchForm.to) {
      setError('Veuillez renseigner la ville de départ et de destination');
      return;
    }

    setLoading(true);
    setError('');
    setSearchPerformed(true);

    try {
      // Recherche d'offres
      const offersData = await offersService.searchOffers(
        searchForm.from, 
        searchForm.to, 
        searchForm.limit
      );
      setOffers(offersData.offers || []);

      // Récupérer des recommandations pour la ville de départ
      try {
        const recoData = await recommendationsService.getRecommendations(searchForm.from, 3);
        setRecommendations(recoData.recommendations || []);
      } catch (recoError) {
        console.log('Pas de recommandations disponibles');
        setRecommendations([]);
      }

      // Mettre à jour l'URL
      navigate(`/search?from=${searchForm.from}&to=${searchForm.to}&limit=${searchForm.limit}`, { replace: true });

    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la recherche');
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOfferClick = (offerId) => {
    // TODO: Naviguer vers la page de détails de l'offre
    console.log('Voir détails offre:', offerId);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins.toString().padStart(2, '0') : ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de recherche */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Départ
                </label>
                <input
                  type="text"
                  placeholder="PAR, LON, NYC..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchForm.to}
                  onChange={(e) => setSearchForm({...searchForm, to: e.target.value.toUpperCase()})}
                  maxLength={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Résultats
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchForm.limit}
                  onChange={(e) => setSearchForm({...searchForm, limit: parseInt(e.target.value)})}
                >
                  <option value={5}>5 offres</option>
                  <option value={10}>10 offres</option>
                  <option value={20}>20 offres</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  <span>{loading ? 'Recherche...' : 'Rechercher'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Colonne principale - Résultats */}
          <div className="lg:col-span-3">
            {searchPerformed && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Offres de voyage
                </h2>
                <p className="text-gray-600">
                  {offers.length > 0 
                    ? `${offers.length} offre(s) trouvée(s) pour ${searchForm.from} → ${searchForm.to}`
                    : `Aucune offre trouvée pour ${searchForm.from} → ${searchForm.to}`
                  }
                </p>
              </div>
            )}

            {offers.length > 0 ? (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div
                    key={offer._id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer"
                    onClick={() => handleOfferClick(offer._id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      {/* Informations principales */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Plane className="h-5 w-5 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-900">
                              {offer.from} → {offer.to}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {offer.provider}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          {/* Dates */}
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <div>
                              <p>Départ: {formatDate(offer.departDate)}</p>
                              {offer.returnDate && (
                                <p>Retour: {formatDate(offer.returnDate)}</p>
                              )}
                            </div>
                          </div>

                          {/* Vols */}
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Vols:</p>
                            {offer.legs.map((leg, index) => (
                              <p key={index} className="text-xs">
                                {leg.flightNum} ({leg.dep} → {leg.arr}) - {formatDuration(leg.duration)}
                              </p>
                            ))}
                          </div>

                          {/* Services inclus */}
                          <div>
                            <p className="font-medium text-gray-700 mb-1">Inclus:</p>
                            {offer.hotel && (
                              <div className="flex items-center space-x-1 text-xs">
                                <Building className="h-3 w-3" />
                                <span>{offer.hotel.name} ({offer.hotel.nights} nuits)</span>
                              </div>
                            )}
                            {offer.activity && (
                              <div className="flex items-center space-x-1 text-xs">
                                <Activity className="h-3 w-3" />
                                <span>{offer.activity.title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="mt-4 md:mt-0 md:ml-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Euro className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">
                            {offer.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {offer.currency}
                          </span>
                        </div>
                        <button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors duration-200">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchPerformed && !loading && (
              <div className="text-center py-12">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune offre trouvée</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Essayez avec d'autres villes ou dates.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Recommandations */}
          <div className="lg:col-span-1">
            {recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Destinations similaires à {searchForm.from}
                </h3>
                <div className="space-y-3">
                  {recommendations.map((reco, index) => (
                    <div
                      key={reco.city}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                      onClick={() => {
                        setSearchForm({...searchForm, from: reco.city});
                      }}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{reco.name}</p>
                        <p className="text-sm text-gray-500">{reco.city}</p>
                      </div>
                      <div className="text-right">
                        <div className="w-8 h-1 bg-blue-200 rounded">
                          <div 
                            className="h-1 bg-blue-600 rounded"
                            style={{ width: `${reco.score * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Score: {Math.round(reco.score * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;