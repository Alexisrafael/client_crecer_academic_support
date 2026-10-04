import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('user');

  // Si hay user, lo mandamos al dashboard porque ya tiene sesión
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si no hay user, permitimos el acceso a la ruta pública (Login/Register)
  return children;
};

export default PublicRoute;
