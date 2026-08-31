// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import UsuarioDashboard from './components/usuario/UsuarioDashboard';
import UsuarioPerfil from './components/usuario/UsuarioPerfil';
import UsuarioPostular from './components/usuario/UsuarioPostular';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsuarios from './components/admin/AdminUsuarios';
import AdminTecnicos from './components/admin/AdminTecnicos';
import AdminPostulaciones from './components/admin/AdminPostulaciones';
import TecnicoDashboard from './components/tecnico/TecnicoDashboard';
import './styles/App.css';
import GoogleLoginSuccess from './components/auth/GoogleLoginSuccess';
// Componente para redirigir según el rol
const RoleRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  console.log('🔄 RoleRedirect - Usuario:', user);
  
  if (user.rol === 'ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Si es técnico, mostrar selector de rol
  if (user.esTecnico) {
    return <Navigate to="/tecnico/dashboard" />;
  }
  
  return <Navigate to="/usuario/dashboard" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta raíz - redirige según rol */}
          <Route path="/" element={<RoleRedirect />} />
          
          {/* Rutas protegidas para USUARIO - permitir CLIENTE, TECNICO y ADMIN */}
          <Route path="/usuario/dashboard" element={
            <ProtectedRoute allowedRoles={['CLIENTE', 'TECNICO', 'ADMIN']}>
              <UsuarioDashboard />
            </ProtectedRoute>
          } />
          <Route path="/usuario/perfil" element={
            <ProtectedRoute allowedRoles={['CLIENTE', 'TECNICO', 'ADMIN']}>
              <UsuarioPerfil />
            </ProtectedRoute>
          } />
          <Route path="/usuario/postular" element={
            <ProtectedRoute allowedRoles={['CLIENTE']}>
              <UsuarioPostular />
            </ProtectedRoute>
          } />
          
          {/* Rutas protegidas para TÉCNICO */}
          <Route path="/tecnico/dashboard" element={
            <ProtectedRoute allowedRoles={['TECNICO', 'ADMIN']}>
              <TecnicoDashboard />
            </ProtectedRoute>
          } />

          <Route path="/tecnico/atender" element={
  <ProtectedRoute allowedRoles={['TECNICO', 'ADMIN']}>
    <TecnicoDashboard />
  </ProtectedRoute>
} />

<Route path="/login/success" element={<GoogleLoginSuccess />} />
          
          {/* Rutas protegidas para ADMIN */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/usuarios" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsuarios />
            </ProtectedRoute>
          } />
          <Route path="/admin/tecnicos" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminTecnicos />
            </ProtectedRoute>
          } />
          <Route path="/admin/postulaciones" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminPostulaciones />
            </ProtectedRoute>
          } />
          
          {/* Fallback - redirige a la raíz */}
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </AuthProvider>
    </Router>

    
  );
}

export default App;