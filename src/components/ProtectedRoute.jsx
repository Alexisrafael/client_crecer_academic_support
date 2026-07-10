import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Si no hay token, lo mandamos al login de inmediato
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, permitimos el acceso a la pantalla protegida
  return children;
};

export default ProtectedRoute;