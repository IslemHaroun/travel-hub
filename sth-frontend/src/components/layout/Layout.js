import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Plane, User, LogOut, Search } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                SupDeVinci Travel Hub
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/search"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Rechercher</span>
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm">
                      Bonjour, {user?.firstName || user?.username}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </nav>

            {/* Menu mobile */}
            <div className="md:hidden">
              {/* TODO: Implémenter le menu burger pour mobile */}
              <button className="text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Plane className="h-6 w-6 text-primary-600" />
              <span className="text-gray-600">
                © 2025 SupDeVinci Travel Hub. Tous droits réservés.
              </span>
            </div>
            
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-primary-600 transition-colors">
                À propos
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;