import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import MainLayout from './components/MainLayout';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta Protegida (Si no hay token, el guardián los saca de aquí) */}
        <Route 
          element={
            <ProtectedRoute>
              <MainLayout /> {/* El menú se renderiza aquí fijamente */}
            </ProtectedRoute>
          }
        >

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            } 
          />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;