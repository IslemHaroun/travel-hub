import React from 'react';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Test Tailwind CSS
        </h1>
        <p className="text-gray-600 mb-4">
          Si tu vois ce texte avec du style, Tailwind fonctionne !
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Bouton de test
        </button>
      </div>
    </div>
  );
}

export default App;
