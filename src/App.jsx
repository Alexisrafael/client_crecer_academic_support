import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import Activities from './pages/Activities.jsx';
import Profile from './pages/Profile.jsx';
import MainLayout from './components/MainLayout';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

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

          <Route 
            path="/activities" 
            element={
              <ProtectedRoute>
                <Activities />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/subjects/:subjectId" 
            element={
              <ProtectedRoute>
                <SubjectDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/courses/:courseId" 
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } 
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;