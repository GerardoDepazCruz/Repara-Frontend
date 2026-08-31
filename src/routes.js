import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts y componentes
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UsuarioDashboard from './components/usuario/UsuarioDashboard';
import UsuarioPerfil from './components/usuario/UsuarioPerfil';
import UsuarioPostular from './components/usuario/UsuarioPostular';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsuarios from './components/admin/AdminUsuarios';
import AdminTecnicos from './components/admin/AdminTecnicos';
import AdminPostulaciones from './components/admin/AdminPostulaciones';
import TecnicoDashboard from './components/tecnico/TecnicoDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

export const routes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      // Rutas de Usuario
      {
        path: '/usuario/dashboard',
        element: <UsuarioDashboard />,
        roles: ['CLIENTE', 'TECNICO'],
      },
      {
        path: '/usuario/perfil',
        element: <UsuarioPerfil />,
        roles: ['CLIENTE', 'TECNICO'],
      },
      {
        path: '/usuario/postular',
        element: <UsuarioPostular />,
        roles: ['CLIENTE'],
      },
      // Rutas de Técnico
      {
        path: '/tecnico/dashboard',
        element: <TecnicoDashboard />,
        roles: ['TECNICO'],
      },
      // Rutas de Admin
      {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
        roles: ['ADMIN'],
      },
      {
        path: '/admin/usuarios',
        element: <AdminUsuarios />,
        roles: ['ADMIN'],
      },
      {
        path: '/admin/tecnicos',
        element: <AdminTecnicos />,
        roles: ['ADMIN'],
      },
      {
        path: '/admin/postulaciones',
        element: <AdminPostulaciones />,
        roles: ['ADMIN'],
      },
      // Redirección por defecto según rol
      {
        path: '',
        element: <Navigate to="/usuario/dashboard" />,
      },
    ],
  },
];