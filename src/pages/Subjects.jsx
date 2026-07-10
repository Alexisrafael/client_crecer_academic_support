import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el switch: true = Vista Administrador, false = Vista Estudiante
  const [isAdminMode, setIsAdminMode] = useState(true);

  // Obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'student' };
  const isUserAdmin = user.role === 'admin';

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error("Error al cargar las materias:", error);
      } {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center font-sans">
        <p className="text-xl font-bold text-purple-600 animate-pulse">Cargando tus materias...</p>
      </div>
    );
  }

  // Filtrado lógico: Si estamos en modo estudiante (o el usuario es estudiante), solo mostramos las activas
  const displayedSubjects = (isUserAdmin && isAdminMode) 
    ? subjects 
    : subjects.filter(sub => sub.is_active);

  return (
    <div className="min-h-screen bg-sky-50 p-6 md:p-10 font-sans text-gray-800">
      
      {/* --- ENCABEZADO DE LA PÁGINA --- */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
            
            {isUserAdmin && isAdminMode ? 'Gestión de Materias' : 'Mis Materias de Aprendizaje'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isUserAdmin && isAdminMode 
              ? 'Panel de control para crear, editar y estructurar las áreas de estudio.' 
              : 'Elige la materia que quieras explorar hoy para empezar tu aventura.'}
          </p>
        </div>

        {/* --- EL SWITCH CONTROLADOR (Solo visible para Administradores) --- */}
        {isUserAdmin && (
          <div className="bg-white border border-sky-100 p-2 rounded-2xl shadow-sm flex items-center gap-3 self-start md:self-center">
            <span className={`text-xs font-bold px-2 transition-colors ${!isAdminMode ? 'text-purple-600' : 'text-slate-400'}`}>
              Vista Niño
            </span>
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ${isAdminMode ? 'bg-purple-600 justify-end' : 'bg-slate-200 justify-start'}`}
            >
              <span className="bg-white w-6 h-6 rounded-full shadow-md block transition-transform"></span>
            </button>
            <span className={`text-xs font-bold px-2 transition-colors ${isAdminMode ? 'text-purple-600' : 'text-slate-400'}`}>
              Vista Admin
            </span>
          </div>
        )}
      </header>

      {/* --- RENDERIZADO 1: VISTA DE ADMINISTRADOR (Gestión y Tablas) --- */}
      {isUserAdmin && isAdminMode ? (
        <div className="space-y-6">
          {/* Botón rápido para agregar materia */}
          <button className="flex items-center gap-2 bg-purple-600 text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:bg-purple-700 transition-all text-sm">
            <Plus className="w-4 h-4" /> Nueva Materia
          </button>

          {/* Tabla / Lista de Gestión */}
          <div className="bg-white rounded-3xl shadow-md border border-sky-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5">Materia</th>
                    <th className="p-5">Descripción</th>
                    <th className="p-5">Color de Icono</th>
                    <th className="p-5">Estado</th>
                    <th className="p-5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayedSubjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 font-bold text-slate-700">{sub.name}</td>
                      <td className="p-5 text-slate-500 max-w-xs truncate">{sub.description || 'Sin descripción'}</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white ${sub.icon_color || 'bg-purple-500'}`}>
                          {sub.icon_color || 'bg-purple-500'}
                        </span>
                      </td>
                      <td className="p-5">
                        {sub.is_active ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                            <Eye className="w-3 h-3" /> Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600">
                            <EyeOff className="w-3 h-3" /> Oculta
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center flex items-center justify-center gap-2">
                        <button className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        
        /* --- RENDERIZADO 2: VISTA DE ESTUDIANTE (Tarjetas Divertidas y de Colores) --- */
        <div>
          {displayedSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedSubjects.map((sub) => (
                <div 
                  key={sub.id} 
                  className="bg-white rounded-3xl shadow-md border border-sky-100 p-6 flex flex-col justify-between hover:shadow-xl transform hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  {/* Detalle de color superior dinámico */}
                  <div className={`absolute top-0 left-0 right-0 h-2.5 ${sub.icon_color || 'bg-purple-500'}`}></div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${sub.icon_color || 'bg-purple-500'}`}>
                        {sub.name.charAt(0)}
                      </div>
                      <Sparkles className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">{sub.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {sub.description || '¡Prepárate para expandir tu mente con grandes retos hoy!'}
                    </p>
                  </div>

                  <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 hover:bg-purple-600 hover:text-white font-bold rounded-2xl transition-all shadow-inner group-hover:shadow-none text-sm">
                    Entrar a Clases
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 max-w-md mx-auto">
              <EyeOff className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-bold text-slate-600 mb-1">No hay materias disponibles</p>
              <p className="text-sm">Vuelve más tarde cuando el administrador active nuevas áreas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subjects;