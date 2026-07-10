import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (!email || !password) {
      setError('¡Por favor, llena todos los campos!');
      return;
    }

    try {
      setLoading(true);
      // Petición a Rails (enviamos las credenciales directamente en la raíz)
      const response = await api.post('/login', { email, password });
      
      // Guardamos el token y los datos del usuario en el navegador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redireccionamos al Dashboard (lo crearemos más adelante)
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Hubo un problema al iniciar sesión. ¡Inténtalo de nuevo!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Botón flotante para volver atrás */}
      <Link to="/" className="absolute top-6 left-6 text-sm font-bold text-sky-600 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8 relative overflow-hidden">
        
        {/* Detalle decorativo superior */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-purple-500 to-red-500"></div>

        {/* Encabezado */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">¡Hola otra vez!</h2>
          <p className="text-slate-500 text-sm mt-1">Qué alegría verte listo para aprender hoy</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-purple-400 focus:bg-white outline-none transition-all text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-purple-400 focus:bg-white outline-none transition-all text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-purple-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Entrar a mi Aula'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Cambio de pantalla */}
        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-bold text-red-500 hover:text-red-600 transition-colors">
              ¡Regístrate aquí!
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;