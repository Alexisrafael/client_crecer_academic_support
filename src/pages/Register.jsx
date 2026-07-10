import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, User, Mail, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import BrandName from '../components/BrandName';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('¡Las contraseñas no coinciden!');
      return;
    }

    try {
      setLoading(true);
      // Petición a Rails (los parámetros van bajo la llave "user")
      const response = await api.post('/register', { user: formData });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      // Muestra el primer error de validación que mande Rails
      const validationErrors = err.response?.data?.errors;
      setError(validationErrors ? validationErrors.join(', ') : 'No se pudo crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 font-sans">
      
      <Link to="/" className="absolute top-6 left-6 text-sm font-bold text-sky-600 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all">
        ← Volver al inicio
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-sky-100 p-8 relative overflow-hidden my-8">
        
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 via-purple-500 to-red-500"></div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800">Crea tu cuenta</h2>
          <p className="text-slate-500 text-sm mt-1">Únete hoy a <BrandName size="text-sm font-bold" /></p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Juan"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-red-400 outline-none text-slate-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Apellido</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Pérez"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-red-400 outline-none text-slate-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-red-400 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-red-400 outline-none text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-sm focus:border-red-400 outline-none text-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all text-sm mt-2"
          >
            {loading ? 'Creando Aventura...' : '¡Registrarme e Iniciar!'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-purple-600 hover:text-purple-700 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;