import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/AuthContext';
import {Plane, User, LogOut, Search} from 'lucide-react';

const Layout = ({children}) => {
    const {user, isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = React.useState(false);

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
                            <Plane className="h-8 w-8 text-primary-600"/>
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
                                <Search className="h-4 w-4"/>
                                <span>Rechercher</span>
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <User className="h-4 w-4"/>
                                        <span className="text-sm">
                      Bonjour, {user?.firstName || user?.username}
                    </span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4"/>
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
                            <button onClick={() => setMenuOpen(true)} className="text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button onClick={() => setMenuOpen(false)}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <nav className="flex flex-col p-4 space-y-4">
                    <Link to="/search" onClick={() => setMenuOpen(false)}
                          className="text-gray-700 hover:text-primary-600">Rechercher</Link>
                    {isAuthenticated ? (
                        <>
                            <div className="text-gray-700 flex items-center space-x-2">
                                <User className="h-4 w-4"/>
                                <span>Bonjour, {user?.firstName || user?.username}</span>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                                className="text-red-600 hover:underline flex items-center space-x-1"
                            >
                                <LogOut className="h-4 w-4"/>
                                <span>Déconnexion</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)}
                                  className="text-gray-700 hover:text-primary-600">Connexion</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)}
                                  className="text-primary-600 font-bold">S’inscrire</Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setMenuOpen(false)}
                ></div>
            )}


            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Plane className="h-6 w-6 text-primary-600"/>
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