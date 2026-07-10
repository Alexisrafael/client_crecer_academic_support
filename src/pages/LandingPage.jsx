import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, PlayCircle, Award, Heart } from 'lucide-react';
import BrandName from '../components/BrandName';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-sky-50 font-sans text-gray-800">
      
      {/* --- NAVEGACIÓN --- */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400 w-8 h-8 fill-current" />
          {/*<span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-purple-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
            Apoyo Escolar Crecer
          </span>*/}
          <BrandName />
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 font-bold text-sky-700 bg-sky-100 rounded-full hover:bg-sky-200 transition-colors shadow-sm">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="px-5 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            ¡Registrarme!
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION (Principal) --- */}
      <header className="relative flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        {/* Elementos decorativos de fondo (Opcional) */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-24 h-24 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-6 leading-tight">
            Descubre, Aprende y <span className="text-emerald-500">Diviértete</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            El impulso que tus hijos necesitan para brillar en el colegio. Acompañamos a niños y jóvenes de primaria y secundaria a potenciar sus conocimientos en Lengua y literatura, Matemáticas e Inglés, respetando siempre el ritmo de aprendizaje único de cada estudiante. <br />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1">
              <Star className="w-5 h-5" />
              Comenzar Aventura
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-purple-700 bg-white border-2 border-purple-100 rounded-full hover:bg-purple-50 transition-all shadow-sm">
              Ya tengo una cuenta
            </Link>
          </div>
        </div>
      </header>

      {/* --- SECCIÓN DE CARACTERÍSTICAS --- */}
      <section className="py-20 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-16">
            ¿Qué encontrarás en <span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-purple-500 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-default">
            Apoyo Escolar Crecer
          </span>?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Tarjeta 1 */}
            <div className="flex flex-col items-center text-center p-8 bg-sky-50 rounded-3xl shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-sky-200 text-sky-700 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <PlayCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Clases en Video</h3>
              <p className="text-slate-600">Explicaciones claras y dinámicas para entender cada tema paso a paso sin aburrirse.</p>
            </div>

            {/* Tarjeta 2 */}
            <div className="flex flex-col items-center text-center p-8 bg-emerald-50 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 -rotate-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Actividades Prácticas</h3>
              <p className="text-slate-600">Formularios interactivos y material descargable para poner a prueba lo aprendido.</p>
            </div>

            {/* Tarjeta 3 */}
            <div className="flex flex-col items-center text-center p-8 bg-yellow-50 rounded-3xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-200 text-yellow-700 rounded-2xl flex items-center justify-center mb-6 rotate-3">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Tu Progreso</h3>
              <p className="text-slate-600">Gana experiencia, completa temas y observa cómo tu barra de aprendizaje crece todos los días.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN SOBRE LA DOCENTE --- */}
      <section className="py-20 bg-sky-50 px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-red-400 p-10 flex flex-col items-center justify-center text-white relative">
             <Heart className="w-12 h-12 mb-4 opacity-80" />
             <h2 className="text-2xl font-extrabold text-center">Dirigido por:</h2>
             <p className="text-xl font-medium mt-2 text-red-100">Docente Paola García</p>
          </div>
          <div className="md:w-3/5 p-10 md:p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">La educación hecha con amor</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Soy Paola García, docente apasionada por la enseñanza y convencida de que todos los niños tienen un potencial gigante. 
              Creé esta plataforma para ofrecer un espacio seguro, colorido y estructurado donde aprender no sea una obligación, sino una aventura emocionante.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              ¡Acompáñanos a construir el futuro, una clase a la vez!
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-800 text-slate-400 py-8 text-center flex flex-col items-center gap-2">
        <p>© {new Date().getFullYear()} <BrandName size="text-sm md:text-base" />. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};

export default LandingPage;