import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, CheckSquare, User, LogOut, 
  PlayCircle, ArrowRight, Award, Clock, Menu, X 
} from 'lucide-react';
import BrandName from '../components/BrandName';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error cargando el aula virtual:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center font-sans">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold text-purple-600 animate-pulse">Abriendo tu Aula Virtual...</p>
      </div>
    );
  }

  const { user, activities, last_video, subjects_progress } = dashboardData;

  return (
    <div className="min-h-screen bg-sky-50 flex font-sans text-gray-800 overflow-hidden">

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 ml-0 transition-all duration-300">

        {/* Cuadrícula de Contenedores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Bloque Izquierdo y Central (Actividades + Videos) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Contenedor 1: Actividades Recientes */}
            <section className="bg-white rounded-3xl p-6 shadow-md border border-sky-100">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <CheckSquare className="text-purple-500 w-5 h-5" /> Actividades Recientes o Pendientes
              </h2>
              <div className="space-y-3">
                {activities.length > 0 ? (
                  activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm md:text-base">{act.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{act.subject}</p>
                      </div>
                      {act.status === 'completed' ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                          🎉 {act.score}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pendiente ({act.deadline})
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm py-4 text-center">No hay actividades asignadas todavía.</p>
                )}
              </div>
            </section>

            {/* Contenedor 2: Continuidad de Video */}
            {last_video ? (
              <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                  <PlayCircle className="w-48 h-48" />
                </div>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                  Último Video Visto ({last_video.subject})
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold mt-3 mb-2">{last_video.title}</h3>
                <p className="text-sm text-purple-100 mb-6">Duración del video: {last_video.duration}</p>
                
                {last_video.hasContinuity && (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-start gap-3">
                    <div className="p-2 bg-yellow-400 text-slate-900 rounded-xl font-bold text-xs shrink-0 mt-0.5">SIGUIENTE</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-white">{last_video.nextVideo}</h4>
                      <button className="flex items-center gap-1 text-xs font-bold text-yellow-300 mt-2 hover:text-yellow-200 transition-colors">
                        Ver siguiente clase <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section className="bg-slate-100 rounded-3xl p-6 text-center text-slate-400 border-2 border-dashed border-slate-200">
                Aún no has visto ningún video educativo. ¡Empieza explorando tus materias!
              </section>
            )}
          </div>

          {/* Bloque Derecho (Progreso de cada Materia) */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-6 shadow-md border border-sky-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Award className="text-emerald-500 w-5 h-5" /> Mi Progreso por Materia
              </h2>
              <div className="space-y-6">
                {subjects_progress.map((sub, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700 text-sm">{sub.name}</span>
                      <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${sub.classesTaken ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>
                        {sub.classesTaken ? `${sub.progress}%` : 'Sin clases tomadas'}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${sub.color} rounded-full transition-all duration-500`} 
                        style={{ width: `${sub.classesTaken ? sub.progress : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;