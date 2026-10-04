import React, { useState } from 'react';
import { Gamepad2, Save, XCircle, Settings2, Trash2 } from 'lucide-react';
import Modal from '../Modal';
import api from '../../services/api';

const ActivityFormModal = ({ isOpen, onClose, courseId, lessonId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    activity_type: 'quiz',
    content: { url: '', questions: [] }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Preparar el payload correcto según el tipo
    const payload = {
      title: formData.title,
      activity_type: formData.activity_type,
      lesson_id: lessonId,
      status: 1,
      content: formData.activity_type === 'iframe' 
        ? { url: formData.content.url }
        : { questions: formData.content.questions }
    };

    try {
      await api.post(`/classes/${courseId}/activities`, payload);
      onSuccess(); // Recarga la info de la clase
      onClose();   // Cierra modal
    } catch (error) {
      console.error("Error creando juego:", error);
      alert("Hubo un error al crear la práctica.");
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    const newQ = { type: 'multiple', question: '', options: ['', '', '', ''], correct_index: 0, correct_text: '' };
    setFormData({
      ...formData,
      content: { ...formData.content, questions: [...formData.content.questions, newQ] }
    });
  };

  const updateQuestion = (idx, field, value) => {
    const newQ = [...formData.content.questions];
    newQ[idx][field] = value;
    
    // Auto configuraciones si cambia el tipo
    if (field === 'type' && value === 'true_false') {
      newQ[idx].options = ['Verdadero', 'Falso'];
      newQ[idx].correct_index = 0;
    }
    
    setFormData({...formData, content: {...formData.content, questions: newQ}});
  };

  const removeQuestion = (idx) => {
    const newQ = formData.content.questions.filter((_, i) => i !== idx);
    setFormData({...formData, content: {...formData.content, questions: newQ}});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Práctica / Juego" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* TITULO */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Práctica</label>
          <input 
            type="text" required
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Ej. Diagnóstico o Sopa de letras de animales"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>

        {/* TIPO DE JUEGO */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Actividad</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-purple-700"
            value={formData.activity_type}
            onChange={(e) => setFormData({...formData, activity_type: e.target.value})}
          >
            <option value="quiz">📝 Cuestionario Dinámico (Preguntas)</option>
            <option value="iframe">🌍 Juego Externo (Wordwall, Educaplay, Scratch)</option>
          </select>
        </div>

        {/* CONTENIDO SEGÚN TIPO */}
        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
          {formData.activity_type === 'iframe' ? (
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-purple-800 mb-1">Enlace para Incrustar (URL)</label>
              <input 
                type="url" required
                className="w-full bg-white border border-purple-200 text-slate-800 rounded-xl px-4 py-3"
                placeholder="https://scratch.mit.edu/projects/10128407/embed"
                value={formData.content.url}
                onChange={(e) => setFormData({...formData, content: { ...formData.content, url: e.target.value }})}
              />
              <p className="text-xs text-purple-600 mt-2 flex items-center gap-1">
                <Settings2 className="w-3 h-3" /> Pega aquí el enlace de "Insertar / Embed" proporcionado por la plataforma externa.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 animate-fade-in">
              <div className="flex justify-between items-center sticky top-0 bg-purple-50 py-2 z-10 border-b border-purple-100">
                <h4 className="font-bold text-purple-800">Preguntas del Formulario</h4>
                <button type="button" onClick={addQuestion} className="text-xs bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-purple-700 hover:scale-105 transition-all">
                  + Agregar Pregunta
                </button>
              </div>
              
              {formData.content.questions.length === 0 && (
                <p className="text-sm text-purple-400 italic text-center py-6">Haz clic en Agregar Pregunta para empezar.</p>
              )}

              {formData.content.questions.map((q, qIdx) => (
                <div key={qIdx} className="bg-white p-4 rounded-2xl border border-purple-100 space-y-3 relative group shadow-sm">
                  <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-3 right-3 text-red-300 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 pr-6">
                    <span className="bg-purple-100 text-purple-800 text-xs font-black px-2 py-1 rounded-md shrink-0">#{qIdx + 1}</span>
                    <input 
                      type="text" placeholder="Escribe tu pregunta aquí..." required
                      className="w-full bg-transparent border-b border-slate-200 px-1 py-1 text-sm font-bold focus:outline-none focus:border-purple-500"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                    />
                  </div>

                  {/* Selector de TIPO de respuesta */}
                  <div>
                     <label className="text-xs font-bold text-slate-500">Tipo de Respuesta:</label>
                     <select 
                       className="ml-2 text-xs bg-slate-50 border border-slate-200 rounded p-1 font-bold text-purple-700 focus:outline-none"
                       value={q.type}
                       onChange={(e) => updateQuestion(qIdx, 'type', e.target.value)}
                     >
                       <option value="multiple">Selección Múltiple (Opciones)</option>
                       <option value="true_false">Verdadero o Falso</option>
                       <option value="fill">Completación (Escribir palabra)</option>
                     </select>
                  </div>

                  {/* Renderizar según Tipo de Respuesta */}
                  {q.type === 'multiple' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 bg-slate-50 p-2 rounded-xl">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input 
                            type="radio" name={`correct-${qIdx}`} required
                            checked={q.correct_index === oIdx}
                            onChange={() => updateQuestion(qIdx, 'correct_index', oIdx)}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <input 
                            type="text" placeholder={`Opción ${oIdx + 1}`} required
                            className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-500 bg-white"
                            value={opt}
                            onChange={(e) => {
                              const newQ = [...formData.content.questions];
                              newQ[qIdx].options[oIdx] = e.target.value;
                              setFormData({...formData, content: {...formData.content, questions: newQ}});
                            }}
                          />
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-400 col-span-full mt-1">Selecciona el círculo de la opción que es correcta.</p>
                    </div>
                  )}

                  {q.type === 'true_false' && (
                    <div className="flex gap-4 mt-2 bg-slate-50 p-3 rounded-xl">
                      {q.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" name={`tf-${qIdx}`} required
                            checked={q.correct_index === oIdx}
                            onChange={() => updateQuestion(qIdx, 'correct_index', oIdx)}
                            className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-bold text-slate-700">{opt}</span>
                        </label>
                      ))}
                      <p className="text-[10px] text-slate-400 ml-auto flex items-center">Selecciona la respuesta correcta.</p>
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <div className="mt-2 bg-slate-50 p-3 rounded-xl">
                      <label className="text-xs font-bold text-slate-500 block mb-1">Palabra o frase correcta esperada:</label>
                      <input 
                        type="text" required
                        placeholder="Ej. Saturno"
                        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 border-emerald-200 bg-white font-bold text-emerald-700"
                        value={q.correct_text}
                        onChange={(e) => updateQuestion(qIdx, 'correct_text', e.target.value)}
                      />
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTONES */}
        <div className="pt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all">
            <Save className="w-5 h-5" /> {loading ? 'Guardando...' : 'Crear Juego'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityFormModal;
