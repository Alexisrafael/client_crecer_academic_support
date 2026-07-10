import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Award } from 'lucide-react';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || { first_name: 'Estudiante' };

  return (
    <div className="min-h-screen bg-sky-50 flex font-sans text-gray-800 overflow-hidden">
      
      {/* Nuestro nuevo Sidebar Global */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Área del contenido cambiante */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 ml-0 transition-all duration-300">
        
        {/* Encabezado Común para todas las pantallas del Aula */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 bg-white border border-sky-100 rounded-xl shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">¡Hola, {user.first_name}! 👋</h1>
              <p className="text-slate-500 text-sm">¿Qué emocionante misterio resolveremos hoy?</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-2xl font-bold text-sm hidden sm:flex items-center gap-2 shadow-sm">
            <Award className="w-5 h-5 fill-current" />
            Nivel Explorador
          </div>
        </header>

        {/* Aquí es donde React Router inyectará Dashboard, Subjects, etc. */}
        <Outlet />
        
      </main>
    </div>
  );
};

export default MainLayout;