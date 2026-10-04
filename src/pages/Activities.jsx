import React, { useState, useEffect } from 'react';
import { Trophy, BookOpen, ChevronDown, ChevronUp, CheckCircle2, XCircle, Gamepad2 } from 'lucide-react';
import api from '../services/api';

const Activities = () => {
  const [data, setData] = useState({ total_trophies: 0, history_by_subject: [] });
  const [loading, setLoading] = useState(true);
  const [openSubject, setOpenSubject] = useState(null); // Para el acordeón

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/dashboard/history');
        setData(response.data);
      } catch (error) {
        console.error("Error al cargar historial de actividades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleSubject = (subjectName) => {
    setOpenSubject(openSubject === subjectName ? null : subjectName);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] font-sans">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg md:text-xl font-bold text-orange-600 animate-pulse">Cargando tus logros...</p>
      </div>
    );
  }

  return (
    <div className="pb-8 font-sans">
      
      {/* SECCIÓN 1: TUS LOGROS */}
      <section className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-md border border-orange-300 flex items-center justify-between overflow-hidden relative mb-8">
        <div className="absolute right-0 top-0 opacity-20 -translate-y-4 translate-x-4 pointer-events-none">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm md:text-lg font-bold text-orange-100 uppercase tracking-wider mb-2">Historial de Tus Logros</h2>
          <div className="text-4xl md:text-6xl font-black drop-shadow-md flex items-end gap-3">
            {data.total_trophies || 0} 
            <span className="text-2xl md:text-4xl font-bold text-amber-200 mb-1">Trofeos 🏆</span>
          </div>
          <p className="text-sm md:text-base text-orange-50 mt-3 font-medium max-w-md">
            ¡Aquí está el resumen completo de todas las prácticas y juegos que has intentado en la academia!
          </p>
        </div>
      </section>

      {/* SECCIÓN 2: ACORDEÓN POR MATERIAS */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-500" /> Detalle por Materia
        </h3>
        
        {data.history_by_subject && data.history_by_subject.length > 0 ? data.history_by_subject.map((subject) => (
          <div key={subject.name} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all">
            
            {/* Header del Acordeón */}
            <button 
              onClick={() => toggleSubject(subject.name)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${subject.color || 'bg-sky-500'} text-white rounded-xl flex items-center justify-center font-bold shadow-sm`}>
                  {subject.name.charAt(0)}
                </div>
                <h4 className="text-lg font-bold text-slate-700">{subject.name}</h4>
                <span className={`text-xs font-bold ${subject.color || 'bg-sky-500'} text-white px-2 py-1 rounded-full bg-opacity-90`}>
                  {subject.activities.length} Actividades
                </span>
              </div>
              {openSubject === subject.name ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Contenido del Acordeón (Tabla de actividades) */}
            {openSubject === subject.name && (
              <div className="p-0 animate-fade-in border-t border-slate-100">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                      <tr>
                        <th className="px-5 py-3 rounded-tl-xl">Actividad</th>
                        <th className="px-5 py-3">Curso / Lección</th>
                        <th className="px-5 py-3">Fecha</th>
                        <th className="px-5 py-3">Puntuación</th>
                        <th className="px-5 py-3 rounded-tr-xl text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {subject.activities.map((act, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                              <Gamepad2 className="w-4 h-4 text-purple-500" /> {act.title}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-xs font-bold text-slate-500">{act.course_name}</div>
                            <div className="text-slate-700">{act.lesson_title}</div>
                          </td>
                          <td className="px-5 py-4 font-medium">{act.completed_at}</td>
                          <td className="px-5 py-4 font-bold text-slate-700">
                            {act.score !== null ? `${act.score}%` : 'N/A'}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-center">
                              {act.status === 'Lograda' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                  <CheckCircle2 className="w-4 h-4" /> Lograda
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                  <XCircle className="w-4 h-4" /> Fallida
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border-2 border-dashed border-slate-200">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-slate-600 mb-1 text-lg">Aún no tienes logros registrados</p>
            <p className="text-sm">Inscríbete en un curso y completa sus juegos para que aparezcan aquí.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Activities;
