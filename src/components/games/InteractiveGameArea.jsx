import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, HelpCircle, Gamepad2, AlertTriangle, Send } from 'lucide-react';

const InteractiveGameArea = ({ activity, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Para las respuestas escritas
  const [textAnswer, setTextAnswer] = useState('');

  // If there's no configuration, fallback to dummy screen
  if (!activity.content || !activity.activity_type) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <AlertTriangle className="w-12 h-12 text-orange-400 mb-4" />
        <p>Este juego aún no ha sido configurado por el profesor.</p>
        <button 
          onClick={onComplete}
          className="mt-6 px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300"
        >
          Cerrar Práctica
        </button>
      </div>
    );
  }

  const { activity_type, content } = activity;

  // ======================================
  // 1. MOTOR DE JUEGOS EXTERNOS (IFRAME)
  // ======================================
  if (activity_type === 'iframe') {
    // Auto-corregir enlaces comunes si el profe pegó el link normal
    const getEmbedUrl = (url) => {
      if (!url) return '';
      // YouTube
      const ytMatch = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      if (ytMatch && ytMatch[2].length === 11) return `https://www.youtube.com/embed/${ytMatch[2]}`;
      // Wordwall (play/resource a embed)
      if (url.includes('wordwall.net/play/') || url.includes('wordwall.net/resource/')) {
        const parts = url.split('/');
        const id = parts[4]; // usualmente el ID está en la posición 4
        if (id) return `https://wordwall.net/es/embed/${id}?themeId=1&templateId=10`;
      }
      return url;
    };

    const finalUrl = getEmbedUrl(content.url);

    return (
      <div className="w-full h-full flex flex-col">
        <iframe 
          src={finalUrl} 
          className="w-full flex-1 rounded-xl bg-white"
          frameBorder="0" 
          allowFullScreen
          title={activity.title}
        ></iframe>
        <div className="mt-4 shrink-0 flex justify-end">
           <button 
            onClick={onComplete}
            className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Terminé el Juego
          </button>
        </div>
      </div>
    );
  }

  // ======================================
  // 2. MOTOR DE CUESTIONARIOS (QUIZ)
  // ======================================
  if (activity_type === 'quiz') {
    const questions = content.questions || [];
    
    if (questions.length === 0) return <p>No hay preguntas configuradas.</p>;

    if (isFinished) {
      const percentage = (score / questions.length) * 100;
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl">
          <Trophy className="w-24 h-24 text-yellow-300 mb-4 animate-bounce" />
          <h2 className="text-3xl font-black mb-2">¡Completado!</h2>
          <p className="text-xl mb-6">Tu puntuación: <span className="font-bold text-yellow-300">{score}</span> de {questions.length} ({percentage.toFixed(0)}%)</p>
          <button 
            onClick={() => onComplete(percentage)}
            className="px-8 py-4 bg-white text-purple-700 font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            Guardar mi progreso
          </button>
        </div>
      );
    }

    const currentQ = questions[currentQuestionIndex];

    const handleAnswer = (selectedOptionIndex) => {
      const isCorrect = selectedOptionIndex === currentQ.correct_index;
      processFeedback(isCorrect);
    };

    const handleTextAnswer = (e) => {
      e.preventDefault();
      // Elimina espacios y compara sin importar mayúsculas
      const isCorrect = textAnswer.trim().toLowerCase() === (currentQ.correct_text || "").trim().toLowerCase();
      processFeedback(isCorrect);
    };

    const processFeedback = (isCorrect) => {
      if (isCorrect) setScore(s => s + 1);
      
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      
      setTimeout(() => {
        setFeedback(null);
        setTextAnswer(''); // Limpiar caja de texto
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(i => i + 1);
        } else {
          setIsFinished(true);
        }
      }, 1500);
    };

    return (
      <div className="w-full h-full flex flex-col p-2 md:p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
            <Trophy className="w-4 h-4 text-yellow-500" /> {score} puntos
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-black text-slate-800 text-center mb-8 drop-shadow-sm">
            {currentQ.question}
          </h3>

          {/* RENDER MÚLTIPLE O VERDADERO/FALSO */}
          {(currentQ.type === 'multiple' || currentQ.type === 'true_false' || !currentQ.type) && (
            <div className={`grid grid-cols-1 ${currentQ.options?.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-4 max-w-2xl mx-auto w-full`}>
              {currentQ.options?.map((opt, idx) => {
                if (!opt) return null; // Saltar opciones vacías
                let btnClass = "w-full py-4 px-6 text-left rounded-2xl font-bold text-slate-700 border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all shadow-sm";
                
                if (feedback && idx === currentQ.correct_index) {
                  btnClass = "w-full py-4 px-6 text-left rounded-2xl font-bold text-emerald-700 bg-emerald-100 border-2 border-emerald-400 shadow-md";
                } else if (feedback === 'incorrect' && feedback !== null) {
                  btnClass = "w-full py-4 px-6 text-left rounded-2xl font-bold text-slate-400 bg-slate-50 border-2 border-slate-100 opacity-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !feedback && handleAnswer(idx)}
                    disabled={feedback !== null}
                    className={btnClass}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-white text-center leading-8 shadow-sm mr-3 text-purple-600 border border-purple-100">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* RENDER TEXTO (COMPLETACIÓN) */}
          {currentQ.type === 'fill' && (
            <form onSubmit={handleTextAnswer} className="max-w-xl mx-auto w-full flex flex-col items-center">
              <input 
                type="text"
                autoFocus
                disabled={feedback !== null}
                className="w-full text-center text-2xl font-bold text-purple-800 border-4 border-purple-200 bg-purple-50 focus:bg-white focus:border-purple-500 rounded-3xl py-4 px-6 focus:outline-none shadow-inner"
                placeholder="Escribe tu respuesta aquí..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={feedback !== null || !textAnswer.trim()}
                className="mt-6 px-10 py-4 bg-purple-600 text-white font-black text-xl rounded-full hover:scale-105 hover:bg-purple-700 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
              >
                Comprobar <Send className="w-6 h-6" />
              </button>

              {/* Si se equivoca, mostrar la respuesta correcta */}
              {feedback === 'incorrect' && (
                <div className="mt-6 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-xl">
                  La respuesta correcta era: <span className="text-red-700">{currentQ.correct_text}</span>
                </div>
              )}
            </form>
          )}

          {/* FEEDBACK VISUAL GLOBAL */}
          {feedback && (
            <div className={`mt-8 text-center animate-bounce font-black text-3xl ${feedback === 'correct' ? 'text-emerald-500 drop-shadow-md' : 'text-red-500'}`}>
              {feedback === 'correct' ? '¡Excelente!' : '¡Oops! Sigue intentando'}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======================================
  // 3. JUEGOS FUTUROS (Sopa Letras, etc)
  // ======================================
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
       <Gamepad2 className="w-16 h-16 text-indigo-400 mb-4 animate-pulse" />
       <h3 className="text-xl font-bold text-slate-700 mb-2">Juego en Desarrollo</h3>
       <p>El motor para juegos de tipo <span className="font-bold text-indigo-500">"{activity_type}"</span> está siendo programado.</p>
       <button 
          onClick={onComplete}
          className="mt-6 px-6 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200"
        >
          Cerrar
        </button>
    </div>
  );
};

export default InteractiveGameArea;
