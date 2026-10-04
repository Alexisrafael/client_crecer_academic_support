import React, { useState } from 'react';
import { User, Mail, Shield, BookOpen, LogOut, Award, Star, Edit2, Save, X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const initialUser = JSON.parse(localStorage.getItem('user')) || {
    first_name: 'Estudiante',
    last_name: 'Registrado',
    email: 'estudiante@crecer.edu',
    role: 'user',
    user_type: 'student',
    avatar_url: ''
  };

  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const isTeacherOrAdmin = user.role === 'admin' || user.user_type === 'super_user' || user.user_type === 'tutor';

  // Get user role display string
  const getRoleBadge = () => {
    if (user.role === 'admin') return { label: 'Administrador Principal', color: 'bg-red-500', icon: <Shield className="w-4 h-4" /> };
    if (user.user_type === 'tutor' || user.user_type === 'super_user') return { label: 'Profesor(a)', color: 'bg-blue-500', icon: <BookOpen className="w-4 h-4" /> };
    return { label: 'Estudiante Estrella', color: 'bg-amber-500', icon: <Star className="w-4 h-4" /> };
  };

  const roleInfo = getRoleBadge();
  const initials = `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase() || 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }

      const res = await api.put('/auth/update_profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const updatedUser = res.data.user;
      
      // Merge with existing user data
      const mergedUser = { ...user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(mergedUser));
      setUser(mergedUser);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Hubo un error al actualizar el perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:')) return path;
    if (path.startsWith('/')) return `http://localhost:3000${path}`;
    return path;
  };

  const displayImage = getFullImageUrl(avatarPreview || user.avatar_url);

  return (
    <div className="pb-10 font-sans max-w-4xl mx-auto animate-fade-in">
      
      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden mb-8 border border-white/20">
        
        {/* Decoración de fondo */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar (Foto o Iniciales) */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white shrink-0 relative overflow-hidden group">
            {displayImage ? (
              <img src={displayImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600">
                {initials}
              </span>
            )}
            
            {/* Si está en modo edición, poner overlay sutil para indicar que se puede cambiar desde abajo */}
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white opacity-80" />
              </div>
            )}
            
            <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full ${roleInfo.color} flex items-center justify-center border-2 border-white shadow-md text-white z-20`}>
              {roleInfo.icon}
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              {roleInfo.icon} {roleInfo.label}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 drop-shadow-md">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-purple-100 font-medium text-lg md:text-xl flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-5 h-5 opacity-80" /> {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: DETALLES DE CUENTA */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <User className="w-6 h-6 text-sky-500" /> Datos Personales
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Editar Perfil
                </button>
              )}
            </div>
            
            {!isEditing ? (
              // VISTA DE LECTURA
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Nombres</p>
                  <p className="text-lg font-bold text-slate-700">{user.first_name}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Apellidos</p>
                  <p className="text-lg font-bold text-slate-700">{user.last_name}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 sm:col-span-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correo Electrónico (No editable)</p>
                  <p className="text-lg font-bold text-slate-700 opacity-60">{user.email}</p>
                </div>
              </div>
            ) : (
              // VISTA DE EDICIÓN
              <form onSubmit={handleSave} className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombres</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellidos</label>
                    <input 
                      type="text" required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-bold"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Foto de Perfil</label>
                  <div className="relative">
                    <input 
                      type="file"
                      accept="image/*"
                      id="avatar-upload"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="avatar-upload" className="w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 hover:border-sky-500 text-slate-600 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                      <UploadCloud className="w-8 h-8 text-sky-500" />
                      <span className="font-bold text-sm">
                        {avatarFile ? avatarFile.name : 'Haz clic para seleccionar una foto de tu computadora'}
                      </span>
                      <span className="text-xs text-slate-400">Archivos recomendados: JPG o PNG (Max 5MB)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ first_name: user.first_name, last_name: user.last_name });
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }} 
                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <><Save className="w-4 h-4" /> Guardar Cambios</>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 p-4 bg-sky-50 rounded-2xl border border-sky-100 text-sky-800 text-sm">
              <span className="font-bold">Nota:</span> Si deseas modificar tu contraseña o cambiar tu correo electrónico, por favor contacta al administrador de la academia.
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ACCIONES Y RESUMEN */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 shadow-md text-white border border-orange-300 relative overflow-hidden">
            <Award className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20" />
            <h3 className="font-bold text-lg mb-2 relative z-10">Tu estatus en la Academia</h3>
            <p className="text-sm text-orange-50 mb-4 relative z-10">
              {isTeacherOrAdmin 
                ? "Como docente, tienes acceso a crear lecciones y monitorear el progreso de tus alumnos." 
                : "Eres un estudiante activo. Sigue participando en los juegos interactivos para subir de nivel."}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-800">Sesión</h3>
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Cerrar Sesión
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
