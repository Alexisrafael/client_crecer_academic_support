import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');

  // Si no hay user, lo mandamos al login de inmediato
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, permitimos el acceso a la pantalla protegida
  return children;
};

export default ProtectedRoute;