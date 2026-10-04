import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Award } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || { first_name: 'Estudiante' };

  return (
    <div className="min-h-screen bg-sky-50 flex font-sans text-gray-800 overflow-hidden">
      
      {/* Sidebar para Escritorio (Oculto en Móvil) */}
      <div className="hidden md:block">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Área del contenido cambiante */}
      <main className="flex-1 h-screen overflow-y-auto pb-20 md:pb-0 p-4 md:p-10 transition-all duration-300 w-full">
        
        {/* Encabezado Común para todas las pantallas del Aula */}
        <header className="flex flex-wrap items-center justify-between mb-6 md:mb-8 gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="hidden md:block p-2 bg-white border border-sky-100 rounded-xl shadow-sm hover:bg-slate-50 text-slate-600 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">¡Hola, {user.first_name}! 👋</h1>
              <p className="text-slate-500 text-xs md:text-sm">¿Qué emocionante misterio resolveremos hoy?</p>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-700 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-sm whitespace-nowrap">
            <Award className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            Nivel Explorador
          </div>
        </header>

        {/* Aquí es donde React Router inyectará Dashboard, Subjects, etc. */}
        <Outlet />
        
      </main>

      {/* Menú de Navegación Inferior para Móvil (Oculto en Escritorio) */}
      <MobileBottomNav />
    </div>
  );
};

export default MainLayout;