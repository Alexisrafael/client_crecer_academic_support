import React from 'react';

// Recibe "size" como propiedad para adaptar el tamaño de la letra.
// Si no le pasas ningún tamaño, por defecto usará el de la navegación (text-2xl md:text-3xl).
const BrandName = ({ size = "text-2xl md:text-3xl" }) => {
  return (
    <span className={`${size} font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-purple-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default inline-block`}>
      Apoyo Escolar Crecer
    </span>
  );
};

export default BrandName;