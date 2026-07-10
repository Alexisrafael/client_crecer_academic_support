import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, User, LogOut } from 'lucide-react';
import BrandName from './BrandName';

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Nos dice en qué página estamos para iluminar el botón correcto

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Función para saber si la ruta está activa
  const isActive = (path) => location.pathname === path;

  // Clases base para los botones del menú
  const linkClass = (path) => `
    w-full flex items-center gap-4 px-4 py-3 font-bold rounded-2xl transition-all duration-200
    ${isActive(path) 
      ? 'bg-purple-50 text-purple-700 shadow-sm' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}
  `;

  return (
    <aside className={`bg-white h-screen border-r border-sky-100 p-6 flex flex-col justify-between fixed md:relative z-40 transition-all duration-300 ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'}`}>
      <div>
        {/* Logo de la Marca */}
        <div className="flex items-center gap-2 mb-10 overflow-hidden whitespace-nowrap h-10">
          {isOpen && <BrandName size="text-xl" />}
        </div>

        {/* Enlaces de Navegación Real */}
        <nav className="space-y-3">
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            {isOpen && <span>Inicio</span>}
          </Link>
          <Link to="/subjects" className={linkClass('/subjects')}>
            <BookOpen className="w-5 h-5 shrink-0" />
            {isOpen && <span>Materias</span>}
          </Link>
          <button className={linkClass('/activities')}>
            <CheckSquare className="w-5 h-5 shrink-0" />
            {isOpen && <span>Actividades</span>}
          </button>
          <button className={linkClass('/profile')}>
            <User className="w-5 h-5 shrink-0" />
            {isOpen && <span>Mi Perfil</span>}
          </button>
        </nav>
      </div>

      {/* Botón de Cerrar Sesión */}
      <button 
        onClick={handleLogout} 
        className="w-full flex items-center gap-4 px-4 py-3 text-red-500 hover:bg-red-50 font-bold rounded-2xl transition-all mt-auto"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        {isOpen && <span>Salir del Aula</span>}
      </button>
    </aside>
  );
};

export default Sidebar;