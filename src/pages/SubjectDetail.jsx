import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Plus, Edit2, Trash2, ArrowLeft, ArrowRight, PlayCircle, Star, Video, CheckCircle, Save, XCircle } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';

const SubjectDetail = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [subjectInfo, setSubjectInfo] = useState({ name: 'Cargando...', description: '', icon_color: 'bg-purple-500' });
  
  const user = JSON.parse(localStorage.getItem('user')) || { user_type: 'student', role: 'user', first_name: 'Estudiante' };
  const isTeacherOrAdmin = user.role === 'admin' || user.user_type === 'super_user' || user.user_type === 'tutor';

  // --- Estados compartidos ---
  const [teachers, setTeachers] = useState([]);
  const [myClasses, setMyClasses] = useState([]); 
  
  // --- Estados Vista Estudiante ---
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // --- Estados Vista Profesor (Modales) ---
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false);

  const [currentClass, setCurrentClass] = useState({ name: '', description: '' });
  const [selectedClassId, setSelectedClassId] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      try {
        const subRes = await api.get(`/subjects/${subjectId}`);
        setSubjectInfo(subRes.data);
      } catch (e) {
        setSubjectInfo({ name: 'Detalle de Materia', description: 'Explora el contenido', icon_color: 'bg-purple-500' });
      }

      if (isTeacherOrAdmin) {
        const res = await api.get(`/subjects/${subjectId}/my_classes`);
        setMyClasses(res.data || []);
      } else {
        const res = await api.get(`/subjects/${subjectId}/teachers`);
        setTeachers(res.data || []);
      }
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    } finally {
      setLoading(false);
    }
  }, [subjectId, isTeacherOrAdmin]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- Estudiantes: ---
  const handleSelectTeacher = async (teacher) => {
    setSelectedTeacher(teacher);
    try {
      const res = await api.get(`/subjects/${subjectId}/teachers/${teacher.id}/classes`);
      setTeacherClasses(res.data || []);
    } catch (error) {
      console.error("Error al cargar clases del profesor:", error);
    }
  };

  const handleEnroll = async () => {
    if (!selectedTeacher) return;
    setIsEnrolling(true);
    try {
      await api.post(`/subjects/${subjectId}/teachers/${selectedTeacher.id}/enroll`);
      const res = await api.get(`/subjects/${subjectId}/teachers/${selectedTeacher.id}/classes`);
      setTeacherClasses(res.data || []);
    } catch (error) {
      console.error("Error al inscribirse:", error);
    } finally {
      setIsEnrolling(false);
    }
  };

  const isEnrolledInCurrentGroup = teacherClasses.some(cls => cls.is_enrolled);

  // --- Profesores: CRUD ---
  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/subjects/${subjectId}/classes`, currentClass);
      setIsCreateClassOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al crear la clase:", error);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/classes/${selectedClassId}`, currentClass);
      setIsEditClassOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al actualizar la clase:", error);
    }
  };

  const handleDeleteClass = async () => {
    try {
      await api.delete(`/classes/${selectedClassId}`);
      setIsDeleteClassOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al eliminar la clase:", error);
    }
  };

  // --- Handlers Interfaz Profesores ---
  const openCreateModal = () => {
    setCurrentClass({ name: '', description: '' });
    setIsCreateClassOpen(true);
  };

  const openEditModal = (cls) => {
    setSelectedClassId(cls.id);
    setCurrentClass({ name: cls.name || cls.title, description: cls.description || '' });
    setIsEditClassOpen(true);
  };

  const openDeleteModal = (cls) => {
    setSelectedClassId(cls.id);
    setCurrentClass(cls);
    setIsDeleteClassOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] font-sans">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-bold text-purple-600 animate-pulse">Cargando detalles...</p>
      </div>
    );
  }

  return (
    <div className="pb-8 font-sans text-gray-800">
      
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/subjects')}
        className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Volver a Materias
      </button>

      {/* Encabezado Principal */}
      <header className="mb-10 flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-md ${subjectInfo.icon_color || 'bg-purple-500'}`}>
          {subjectInfo.name ? subjectInfo.name.charAt(0) : 'M'}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">{subjectInfo.name}</h1>
          <p className="text-slate-500">{subjectInfo.description}</p>
        </div>
      </header>

      {/* =========================================
          VISTA PARA PROFESORES / ADMIN
          ========================================= */}
      {isTeacherOrAdmin ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-500 w-6 h-6" /> Mis Clases (Vista Docente)
            </h2>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-md hover:bg-blue-700 transition-all text-sm"
            >
              <Plus className="w-4 h-4" /> Crear Clase
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myClasses.length > 0 ? myClasses.map(cls => (
              <div key={cls.id} className="bg-white rounded-3xl p-6 shadow-md border border-sky-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">{cls.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">{cls.description}</p>
                </div>
                
                <div className="space-y-2">
                  <button onClick={() => navigate(`/courses/${cls.id}`, { state: { course: cls } })} className="w-full py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <BookOpen className="w-4 h-4" /> Gestionar Lecciones
                  </button>
                  <button onClick={() => openEditModal(cls)} className="w-full py-2 bg-slate-50 text-slate-700 hover:bg-sky-100 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <Edit2 className="w-4 h-4" /> Editar Curso
                  </button>
                  <button onClick={() => openDeleteModal(cls)} className="w-full py-2 text-red-500 hover:bg-red-50 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                    <Trash2 className="w-4 h-4" /> Eliminar Curso
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-slate-400">Aún no tienes clases para esta materia.</p>
            )}
          </div>
        </section>
      ) : (

      /* =========================================
         VISTA PARA ESTUDIANTES
         ========================================= */
        <section>
          {!selectedTeacher ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                <Users className="text-purple-500 w-6 h-6" /> Elige tu Profesor
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {teachers.length > 0 ? teachers.map(teacher => (
                  <div 
                    key={teacher.id} 
                    className="bg-white rounded-3xl p-6 shadow-sm border-2 border-transparent hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group text-center"
                    onClick={() => handleSelectTeacher(teacher)}
                  >
                    <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
                      {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">{teacher.first_name} {teacher.last_name}</h3>
                    <p className="text-sm text-slate-500 mt-2">{teacher.description}</p>
                    <div className="mt-6 inline-flex items-center gap-1 text-purple-600 font-bold text-sm">
                      Ver Grupo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-400 col-span-full">Aún no hay profesores asignados a esta materia.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white rounded-3xl p-8 shadow-md border border-purple-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-blue-500"></div>
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute left-6 top-6 text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Cambiar Profesor
                </button>
                
                <h2 className="text-2xl font-extrabold text-slate-800 mt-8">
                  Grupo de {selectedTeacher.first_name} {selectedTeacher.last_name}
                </h2>
                
                {!isEnrolledInCurrentGroup ? (
                  <>
                    <p className="text-slate-500 mt-2 max-w-lg mx-auto">
                      Aquí podrás ver todo el contenido, videos y dinámicas que este profesor ha preparado especialmente para ti.
                    </p>
                    <button 
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="mt-6 bg-purple-600 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-purple-500/30 hover:bg-purple-700 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {isEnrolling ? 'Inscribiendo...' : <><Star className="w-5 h-5 fill-current" /> ¡Inscribirme a este Grupo!</>}
                    </button>
                  </>
                ) : (
                  <div className="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-2 rounded-full font-bold">
                    <CheckCircle className="w-5 h-5" /> Ya estás inscrito en este grupo
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Video className="text-blue-500 w-5 h-5" /> Contenido del Grupo
                </h3>
                <div className="space-y-3">
                  {teacherClasses.length > 0 ? teacherClasses.map(cls => (
                    <div 
                      key={cls.id} 
                      className={`bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100 shadow-sm transition-all
                        ${cls.is_enrolled ? 'hover:shadow-md cursor-pointer' : 'opacity-75 grayscale hover:grayscale-0 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className={`w-8 h-8 ${cls.is_enrolled ? 'text-purple-500' : 'text-slate-400'}`} />
                        <div>
                          <h4 className="font-bold text-slate-700">{cls.name || cls.title}</h4>
                          <p className="text-xs text-slate-400">{cls.description || 'Clase grabada'}</p>
                        </div>
                      </div>
                      
                      {!cls.is_enrolled ? (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                          Requiere Inscripción
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/courses/${cls.id}`, { state: { course: cls } }); }}
                          className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                        >
                          <PlayCircle className="w-3 h-3" /> Ver Lecciones
                        </button>
                      )}
                    </div>
                  )) : (
                    <p className="text-slate-400">Este profesor aún no ha subido clases.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ======================= MODALES DE CLASE ======================= */}
      <Modal 
        isOpen={isCreateClassOpen || isEditClassOpen} 
        onClose={() => { setIsCreateClassOpen(false); setIsEditClassOpen(false); }}
        title={isEditClassOpen ? "Editar Clase" : "Nueva Clase"}
      >
        <form onSubmit={isEditClassOpen ? handleEditClass : handleCreateClass} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Título de la Clase</label>
            <input 
              type="text" required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Ej. Introducción a la Botánica"
              value={currentClass.name}
              onChange={(e) => setCurrentClass({...currentClass, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Lo que aprenderemos hoy..."
              value={currentClass.description}
              onChange={(e) => setCurrentClass({...currentClass, description: e.target.value})}
              rows="3"
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={() => { setIsCreateClassOpen(false); setIsEditClassOpen(false); }} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all flex justify-center items-center gap-2">
              <Save className="w-4 h-4" /> {isEditClassOpen ? 'Guardar Cambios' : 'Crear Clase'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteClassOpen} 
        onClose={() => setIsDeleteClassOpen(false)}
        title="Eliminar Clase"
      >
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">¿Confirmas la eliminación?</h3>
          <p className="text-slate-500 mb-8">
            Estás a punto de eliminar la clase <span className="font-bold text-slate-700">"{currentClass.name || currentClass.title}"</span>. Se borrarán también las actividades y recursos asociados.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteClassOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button onClick={handleDeleteClass} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-md shadow-red-500/30 transition-all flex justify-center items-center gap-2">
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default SubjectDetail;
