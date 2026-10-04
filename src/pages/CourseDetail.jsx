import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Plus, Edit2, Trash2, ArrowLeft, PlayCircle, Save, XCircle, Video, CheckCircle2, Gamepad2, Puzzle } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import InteractiveGameArea from '../components/games/InteractiveGameArea';
import ActivityFormModal from '../components/games/ActivityFormModal';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  
  // Use passed state if available, otherwise fallback
  const passedCourse = location.state?.course;
  const [courseInfo, setCourseInfo] = useState(
    passedCourse ? passedCourse : { name: 'Cargando Curso...', description: '' }
  );
  const [lessons, setLessons] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user')) || { user_type: 'student', role: 'user', first_name: 'Estudiante' };
  const isTeacherOrAdmin = user.role === 'admin' || user.user_type === 'super_user' || user.user_type === 'tutor';

  // Modal States
  const [isCreateLessonOpen, setIsCreateLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);

  const [currentLesson, setCurrentLesson] = useState({ title: '', description: '', video_url: '' });
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  const [isCreateActivityOpen, setIsCreateActivityOpen] = useState(false);
  const [targetLessonId, setTargetLessonId] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      if (!passedCourse) {
        try {
          const courseRes = await api.get(`/classes/${courseId}`);
          setCourseInfo(courseRes.data);
        } catch (e) {
          setCourseInfo({ name: 'Detalle del Curso', description: 'Explora las lecciones de este curso' });
        }
      }

      // Fetch lessons (ahora incluye las activities y los progresos)
      const lessonsRes = await api.get(`/classes/${courseId}/lessons`);
      if (lessonsRes.data && lessonsRes.data.lessons) {
        setLessons(lessonsRes.data.lessons);
        setCompletedLessons(new Set(lessonsRes.data.completed_lesson_ids || []));
        setCompletedActivities(new Set(lessonsRes.data.completed_activity_ids || []));
      } else {
        // Fallback por si acaso
        setLessons(lessonsRes.data || []);
      }
      
    } catch (error) {
      console.error("Error al cargar datos del curso:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId, passedCourse]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- Profesores: CRUD ---
  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/classes/${courseId}/lessons`, currentLesson);
      setIsCreateLessonOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al crear la lección:", error);
    }
  };

  const handleEditLesson = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/lessons/${selectedLessonId}`, currentLesson);
      setIsEditLessonOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al actualizar la lección:", error);
    }
  };

  const handleDeleteLesson = async () => {
    try {
      await api.delete(`/lessons/${selectedLessonId}`);
      setIsDeleteLessonOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Error al eliminar la lección:", error);
    }
  };

  const openCreateModal = () => {
    setCurrentLesson({ title: '', description: '', video_url: '' });
    setIsCreateLessonOpen(true);
  };

  const openEditModal = (lesson) => {
    setSelectedLessonId(lesson.id);
    setCurrentLesson({ title: lesson.title, description: lesson.description || '', video_url: lesson.video_url || '' });
    setIsEditLessonOpen(true);
  };

  const openDeleteModal = (lesson) => {
    setSelectedLessonId(lesson.id);
    setCurrentLesson(lesson);
    setIsDeleteLessonOpen(true);
  };

  // --- Manejo de Video de YouTube y Progreso ---
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeLesson, setActiveLesson] = useState(null);
  
  // --- Manejo de Juegos y Prácticas ---
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [activeActivity, setActiveActivity] = useState(null);

  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set()); // UI UI UI inmediata
  const [completedActivities, setCompletedActivities] = useState(new Set()); 

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}?enablejsapi=1` 
      : null;
  };

  const openVideoModal = (lesson) => {
    if (!lesson.video_url) {
      alert("Esta lección no tiene un video asignado.");
      return;
    }
    const embedUrl = getYouTubeEmbedUrl(lesson.video_url);
    if (embedUrl) {
      setActiveVideoUrl(embedUrl);
      setActiveLesson(lesson);
      setIsVideoModalOpen(true);
    } else {
      alert("El enlace del video no es un enlace válido de YouTube.");
    }
  };

  const openGameModal = (activity) => {
    setActiveActivity(activity);
    setIsGameModalOpen(true);
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    setIsSavingProgress(true);
    try {
      await api.post('/progress', {
        lesson_id: activeLesson.id,
        is_completed: true,
        progress_percent: 100
      });
      
      setCompletedLessons(prev => new Set(prev).add(activeLesson.id));
      setIsVideoModalOpen(false);
      setActiveVideoUrl('');
      setActiveLesson(null);
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
      alert("Hubo un error guardando tu progreso, pero puedes continuar.");
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handleCompleteActivity = async (scorePercent) => {
    if (!activeActivity) return;

    const finalPercent = typeof scorePercent === 'number' ? scorePercent : 100;
    const isCompleted = finalPercent >= 60; // El umbral de aprobación es 60%

    setIsSavingProgress(true);
    try {
      await api.post('/progress', {
        activity_id: activeActivity.id,
        is_completed: isCompleted,
        progress_percent: finalPercent
      });
      
      setCompletedActivities(prev => new Set(prev).add(activeActivity.id));
      setIsGameModalOpen(false);
      setActiveActivity(null);
    } catch (error) {
      console.error("Error al guardar progreso de la actividad:", error);
    } finally {
      setIsSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] font-sans">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-bold text-blue-600 animate-pulse">Cargando lecciones...</p>
      </div>
    );
  }

  return (
    <div className="pb-8 font-sans text-gray-800">
      
      {/* Botón Volver */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-800 transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" /> Volver
      </button>

      {/* Encabezado Principal */}
      <header className="mb-8 flex items-center gap-4 bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-sky-100">
        <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-md bg-blue-500">
          <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 leading-tight">{courseInfo.name || courseInfo.title}</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">{courseInfo.description}</p>
        </div>
      </header>

      {/* =========================================
          VISTA PARA PROFESORES / ADMIN
          ========================================= */}
      {isTeacherOrAdmin && (
        <div className="mb-6 flex justify-end">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:bg-blue-700 transition-all text-sm"
          >
            <Plus className="w-4 h-4" /> Nueva Lección
          </button>
        </div>
      )}

      {/* =========================================
          LISTADO DE LECCIONES Y JUEGOS
          ========================================= */}
      <div className="space-y-6">
        {lessons.length > 0 ? lessons.map((lesson, idx) => {
          const isCompleted = completedLessons.has(lesson.id);
          const hasActivities = lesson.activities && lesson.activities.length > 0;

          return (
            <div key={lesson.id} className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-sky-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              
              {/* Encabezado de la lección */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-500'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base md:text-lg text-slate-800">{lesson.title}</h3>
                    <p className="text-xs md:text-sm text-slate-500 line-clamp-2 md:line-clamp-none">{lesson.description || 'Lección del curso'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  {!isTeacherOrAdmin ? (
                    <button 
                      onClick={() => openVideoModal(lesson)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-50 text-purple-600 font-bold px-5 py-2.5 rounded-xl hover:bg-purple-100 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" /> Ver Clase
                    </button>
                  ) : (
                    <div className="flex w-full md:w-auto gap-2">
                      <button 
                        onClick={() => { setTargetLessonId(lesson.id); setIsCreateActivityOpen(true); }} 
                        className="flex-1 md:flex-none p-2.5 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex justify-center items-center gap-1 font-bold text-xs" 
                        title="Agregar Práctica"
                      >
                        <Puzzle className="w-4 h-4" /> + Juego
                      </button>
                      <button onClick={() => openEditModal(lesson)} className="flex-1 md:flex-none p-2.5 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors flex justify-center" title="Editar">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => openDeleteModal(lesson)} className="flex-1 md:flex-none p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex justify-center" title="Eliminar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección de Juegos/Actividades (Solo si existen) */}
              {hasActivities && !isTeacherOrAdmin && (
                <div className="mt-2 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                    <Puzzle className="w-4 h-4 text-orange-500" /> Prácticas y Juegos de esta clase:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {lesson.activities.map(act => {
                      const isActCompleted = completedActivities.has(act.id);
                      return (
                        <button 
                          key={act.id}
                          onClick={() => openGameModal(act)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-transform hover:-translate-y-1 ${isActCompleted ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'}`}
                        >
                          {isActCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Gamepad2 className="w-4 h-4" />}
                          {act.title || 'Juego interactivo'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          );
        }) : (
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center text-slate-400 border-2 border-dashed border-slate-200">
            <Video className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-slate-600 mb-1">Aún no hay lecciones</p>
            <p className="text-sm">Vuelve más tarde o crea una nueva lección si eres profesor.</p>
          </div>
        )}
      </div>

      {/* ======================= MODALES DE LECCIÓN ======================= */}
      <Modal 
        isOpen={isCreateLessonOpen || isEditLessonOpen} 
        onClose={() => { setIsCreateLessonOpen(false); setIsEditLessonOpen(false); }}
        title={isEditLessonOpen ? "Editar Lección" : "Nueva Lección"}
      >
        <form onSubmit={isEditLessonOpen ? handleEditLesson : handleCreateLesson} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Título de la Lección</label>
            <input 
              type="text" required
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Ej. Sumas y Restas"
              value={currentLesson.title}
              onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Contenido de la lección..."
              value={currentLesson.description}
              onChange={(e) => setCurrentLesson({...currentLesson, description: e.target.value})}
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Enlace del Video (Opcional)</label>
            <input 
              type="url"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="https://..."
              value={currentLesson.video_url || ''}
              onChange={(e) => setCurrentLesson({...currentLesson, video_url: e.target.value})}
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button type="button" onClick={() => { setIsCreateLessonOpen(false); setIsEditLessonOpen(false); }} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all flex justify-center items-center gap-2">
              <Save className="w-4 h-4" /> {isEditLessonOpen ? 'Guardar Cambios' : 'Crear Lección'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDeleteLessonOpen} 
        onClose={() => setIsDeleteLessonOpen(false)}
        title="Eliminar Lección"
      >
        <div className="text-center">
          <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">¿Confirmas la eliminación?</h3>
          <p className="text-sm md:text-base text-slate-500 mb-8">
            Estás a punto de eliminar la lección <span className="font-bold text-slate-700">"{currentLesson.title}"</span>.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setIsDeleteLessonOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
            <button onClick={handleDeleteLesson} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-md shadow-red-500/30 transition-all flex justify-center items-center gap-2">
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL DE VIDEO DE LA CLASE */}
      <Modal 
        isOpen={isVideoModalOpen} 
        onClose={() => {
          setIsVideoModalOpen(false);
          setActiveVideoUrl('');
          setActiveLesson(null);
        }}
        title={`Viendo: ${activeLesson?.title || 'Clase'}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-inner">
            {activeVideoUrl ? (
              <iframe 
                width="100%" 
                height="100%" 
                src={activeVideoUrl} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Cargando video...
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <button 
              onClick={handleCompleteLesson}
              disabled={isSavingProgress}
              className="w-full py-3.5 bg-emerald-500 text-white font-bold text-sm md:text-base rounded-2xl hover:bg-emerald-600 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
            >
              {isSavingProgress ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" /> 
                  ¡He terminado esta clase!
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">Al presionar el botón se guardará tu progreso y aparecerá en tu Aula Virtual.</p>
          </div>
        </div>
      </Modal>

      {/* MODAL DE PRÁCTICA / JUEGO */}
      <Modal 
        isOpen={isGameModalOpen} 
        onClose={() => {
          setIsGameModalOpen(false);
          setActiveActivity(null);
        }}
        title={`Práctica: ${activeActivity?.title || 'Juego'}`}
        maxWidth="max-w-4xl"
      >
        <div className="w-full aspect-[4/3] md:aspect-[16/10] bg-white rounded-2xl overflow-hidden shadow-inner flex flex-col relative">
          {activeActivity && (
            <InteractiveGameArea 
              activity={activeActivity} 
              onComplete={handleCompleteActivity} 
            />
          )}
        </div>
      </Modal>

      {/* MODAL DE CREACIÓN DE JUEGOS PARA EL PROFESOR */}
      {isTeacherOrAdmin && (
        <ActivityFormModal 
          isOpen={isCreateActivityOpen}
          onClose={() => setIsCreateActivityOpen(false)}
          courseId={courseId}
          lessonId={targetLessonId}
          onSuccess={fetchInitialData}
        />
      )}

    </div>
  );
};

export default CourseDetail;
