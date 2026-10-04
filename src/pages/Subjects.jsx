import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, ArrowRight, Save, XCircle } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';

const TAILWIND_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500',
  'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
  'bg-pink-500', 'bg-rose-500'
];

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el switch: true = Vista Administrador, false = Vista Estudiante
  const [isAdminMode, setIsAdminMode] = useState(true);

  // Estados para Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Estado para el formulario de Materias
  const [currentSubject, setCurrentSubject] = useState({ name: '', description: '', icon_color: 'bg-purple-500', is_active: true });
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Obtener datos del usuario
  const user = JSON.parse(localStorage.getItem('user')) || { user_type: 'student', role: 'user' };
  const isUserAdmin = user.role === 'admin' || user.user_type === 'super_user';

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error("Error al cargar las materias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // --- Manejadores de API (CRUD) ---
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects', currentSubject);
      setIsCreateModalOpen(false);
      fetchSubjects();
    } catch (error) {
      console.error("Error al crear la materia:", error);
    }
  };

  const handleEditSubject = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/subjects/${selectedSubjectId}`, currentSubject);
      setIsEditModalOpen(false);
      fetchSubjects();
    } catch (error) {
      console.error("Error al actualizar la materia:", error);
    }
  };

  const handleDeleteSubject = async () => {
    try {
      await api.delete(`/subjects/${selectedSubjectId}`);
      setIsDeleteModalOpen(false);
      fetchSubjects();
    } catch (error) {
      console.error("Error al eliminar la materia:", error);
    }
  };

  // --- Handlers de Interfaz ---
  const openCreateModal = () => {
    setCurrentSubject({ name: '', description: '', icon_color: 'bg-purple-500', is_active: true });
    setIsCreateModalOpen(true);
  };

  const openEditModal = (sub) => {
    setSelectedSubjectId(sub.id);
    setCurrentSubject({ name: sub.name, description: sub.description, icon_color: sub.icon_color, is_active: sub.is_active });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sub) => {
    setSelectedSubjectId(sub.id);
    setCurrentSubject(sub); // Guardamos para mostrar el nombre en la alerta
    setIsDeleteModalOpen(true);
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] font-sans">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-bold text-purple-600 animate-pulse">Cargando tus materias...</p>
      </div>
    );
  }

  // Filtrado lógico
  const displayedSubjects = (isUserAdmin && isAdminMode) 
    ? subjects 
    : subjects.filter(sub => sub.is_active);

  return (
    <div className="pb-8 font-sans text-gray-800">
      
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

        {/* --- EL SWITCH CONTROLADOR --- */}
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

      {/* --- RENDERIZADO 1: VISTA DE ADMINISTRADOR --- */}
      {isUserAdmin && isAdminMode ? (
        <div className="space-y-6">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-purple-600 text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:bg-purple-700 transition-all text-sm"
          >
            <Plus className="w-4 h-4" /> Nueva Materia
          </button>

          <div className="bg-white rounded-3xl shadow-md border border-sky-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-5">Materia</th>
                    <th className="p-5">Descripción</th>
                    <th className="p-5">Color</th>
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
                        <span className={`inline-block w-6 h-6 rounded-full shadow-inner ${sub.icon_color || 'bg-purple-500'}`} title={sub.icon_color}></span>
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
                        <button onClick={() => openEditModal(sub)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => openDeleteModal(sub)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {displayedSubjects.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400">No hay materias creadas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        
        /* --- RENDERIZADO 2: VISTA DE ESTUDIANTE --- */
        <div>
          {displayedSubjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedSubjects.map((sub) => (
                <div 
                  key={sub.id} 
                  className="bg-white rounded-3xl shadow-md border border-sky-100 p-6 flex flex-col justify-between hover:shadow-xl transform hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 right-0 h-2.5 ${sub.icon_color || 'bg-purple-500'}`}></div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm ${sub.icon_color || 'bg-purple-500'}`}>
                        {sub.name.charAt(0)}
                      </div>
                      <Sparkles className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-2">{sub.name}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">{sub.description || '¡Explora esta materia!'}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/subjects/${sub.id}`)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-700 hover:bg-purple-600 hover:text-white font-bold rounded-2xl transition-all shadow-inner group-hover:shadow-none text-sm"
                  >
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
            </div>
          )}
        </div>
      )}

      {/* ======================= MODALES ======================= */}

      {/* Modal: CREAR / EDITAR Materia (Reutilizamos formulario) */}
      <Modal 
        isOpen={isCreateModalOpen || isEditModalOpen} 
        onClose={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
        title={isEditModalOpen ? "Editar Materia" : "Nueva Materia"}
      >
        <form onSubmit={isEditModalOpen ? handleEditSubject : handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Materia</label>
            <input 
              type="text" required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Ej. Matemáticas"
              value={currentSubject.name}
              onChange={(e) => setCurrentSubject({...currentSubject, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Breve descripción del área..."
              value={currentSubject.description}
              onChange={(e) => setCurrentSubject({...currentSubject, description: e.target.value})}
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Color Temático</label>
            <div className="flex flex-wrap gap-3">
              {TAILWIND_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCurrentSubject({...currentSubject, icon_color: color})}
                  className={`w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${color} ${currentSubject.icon_color === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''}`}
                  title={color}
                >
                  {currentSubject.icon_color === color && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              className="w-5 h-5 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              checked={currentSubject.is_active}
              onChange={(e) => setCurrentSubject({...currentSubject, is_active: e.target.checked})}
            />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">
              Materia Activa (Visible para estudiantes)
            </label>
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 shadow-md shadow-purple-500/30 transition-all flex justify-center items-center gap-2">
              <Save className="w-4 h-4" /> {isEditModalOpen ? 'Guardar Cambios' : 'Crear Materia'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: ELIMINAR Materia */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">¿Estás completamente seguro?</h3>
          <p className="text-slate-500 mb-8">
            Estás a punto de eliminar la materia <span className="font-bold text-slate-700">"{currentSubject.name}"</span>. Esta acción no se puede deshacer y eliminará todos los cursos vinculados.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button onClick={handleDeleteSubject} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-md shadow-red-500/30 transition-all flex justify-center items-center gap-2">
              <Trash2 className="w-4 h-4" /> Sí, Eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Subjects;