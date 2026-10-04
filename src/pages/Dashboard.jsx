import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, PlayCircle, ArrowRight, Award, Clock, Trophy, BookOpen } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error cargando el aula virtual:", error);
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] font-sans">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-bold text-purple-600 animate-pulse">Abriendo tu Aula Virtual...</p>
      </div>
    );
  }

  const { activities, last_video, subjects_progress, total_trophies } = dashboardData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-8 font-sans">
      
      {/* Bloque Izquierdo y Central (Actividades + Videos) */}
      <div className="lg:col-span-2 space-y-6 md:space-y-8">
        
        {/* GAMIFICACIÓN: TROFEOS GANADOS */}
        <section className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-md border border-orange-300 flex items-center justify-between overflow-hidden relative">
          <div className="absolute right-0 top-0 opacity-20 -translate-y-4 translate-x-4 pointer-events-none">
            <Trophy className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm md:text-base font-bold text-orange-100 uppercase tracking-wider mb-1">Tus Logros</h2>
            <div className="text-3xl md:text-5xl font-black drop-shadow-md">
              {total_trophies || 0} <span className="text-xl md:text-3xl font-bold text-amber-200">Trofeos 🏆</span>
            </div>
            <p className="text-xs md:text-sm text-orange-50 mt-2 mb-3 font-medium">
              ¡Sigue completando juegos y prácticas para ganar más!
            </p>
            <Link to="/activities" className="inline-block bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl text-white font-bold transition-colors shadow-sm border border-orange-500 text-sm">
              Ver todo mi progreso
            </Link>
          </div>
        </section>

        {/* Contenedor 1: Actividades Recientes */}
        <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-sky-100">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckSquare className="text-purple-500 w-5 h-5" /> Juegos y Prácticas Pendientes
          </h2>
          <div className="space-y-3">
            {activities && activities.length > 0 ? (
              activities.map((act) => (
                <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-3 sm:gap-0">
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm md:text-base">{act.title}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{act.subject}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link 
                      to={`/courses/${act.course_id}`}
                      className="inline-flex px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 font-bold text-xs rounded-xl items-center gap-1 transition-colors"
                    >
                      <Clock className="w-3 h-3" /> Ir a Jugar
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm py-4 text-center">¡Estás al día! No tienes actividades pendientes.</p>
            )}
          </div>
        </section>

        {/* Contenedor 2: Continuidad de Video */}
        {last_video ? (
          <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 pointer-events-none">
              <PlayCircle className="w-32 h-32 md:w-48 md:h-48" />
            </div>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-0">
              Última Clase Vista ({last_video.subject})
            </span>
            <h3 className="text-lg md:text-2xl font-extrabold mt-2 md:mt-3 mb-1 md:mb-2 leading-tight">{last_video.title}</h3>
            <p className="text-xs md:text-sm text-purple-100 mb-4 md:mb-6">{last_video.duration}</p>
            
            {last_video.hasContinuity && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10">
                <div className="px-2 py-1 bg-yellow-400 text-slate-900 rounded-lg font-bold text-[10px] md:text-xs shrink-0 uppercase">Siguiente</div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white line-clamp-1">{last_video.nextVideo}</h4>
                  <Link 
                    to={`/courses/${last_video.course_id}`}
                    className="inline-flex items-center gap-1 text-[10px] md:text-xs font-bold text-yellow-300 mt-1 hover:text-yellow-200 transition-colors"
                  >
                    Ir a esta clase <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </section>
        ) : (
          <section className="bg-slate-100 rounded-2xl md:rounded-3xl p-5 md:p-6 text-center text-slate-400 border-2 border-dashed border-slate-200 text-sm md:text-base">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            Aún no has visto ninguna lección. ¡Inscríbete en un curso y comienza a aprender!
          </section>
        )}
      </div>

      {/* Bloque Derecho (Progreso de cada Materia/Curso) */}
      <div className="space-y-6 md:space-y-8">
        <section className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-sky-100">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
            <Award className="text-emerald-500 w-5 h-5" /> Progreso de Cursos
          </h2>
          <div className="space-y-4 md:space-y-6">
            {subjects_progress && subjects_progress.length > 0 ? (
              subjects_progress.slice(0, 6).map((sub, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-700 text-xs md:text-sm block">{sub.course_name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{sub.name}</span>
                    </div>
                    <span className={`text-[10px] md:text-xs font-extrabold px-2 py-0.5 rounded-md ${sub.classesTaken ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>
                      {sub.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sub.color} rounded-full transition-all duration-500`} 
                      style={{ width: `${sub.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs md:text-sm text-center">No estás inscrito en ningún curso.</p>
            )}
          </div>
        </section>
      </div>

    </div>
  );
};

export default Dashboard;