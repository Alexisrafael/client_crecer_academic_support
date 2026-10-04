import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, CheckSquare } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { path: '/subjects', label: 'Materias', icon: BookOpen },
    { path: '/activities', label: 'Actividades', icon: CheckSquare },
    { path: '/profile', label: 'Perfil', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)] md:hidden flex justify-around items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
            isActive(item.path)
              ? 'text-purple-600'
              : 'text-slate-400 hover:text-slate-600'
          } active:scale-95`}
          style={{ touchAction: 'manipulation' }}
        >
          <item.icon className={`w-6 h-6 mb-1 ${isActive(item.path) ? 'fill-purple-50' : ''}`} />
          <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
