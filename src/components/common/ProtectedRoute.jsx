// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('🛡️ ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('🛡️ ProtectedRoute - user:', user);
  console.log('🛡️ ProtectedRoute - allowedRoles:', allowedRoles);
  
  if (!isAuthenticated) {
    console.log('❌ No autenticado, redirigiendo a /login');
    return <Navigate to="/login" />;
  }
  
  // Verificar si el usuario tiene el rol permitido
  if (allowedRoles.length > 0) {
    const userRole = user?.rol;
    
    // ✅ IMPORTANTE: Si el usuario es técnico, permitir acceso a rutas de TECNICO
    const userIsTecnico = user?.esTecnico === true;
    
    // Verificar permisos: coincide el rol O es técnico y el rol permitido incluye TECNICO
    const hasPermission = allowedRoles.includes(userRole) || 
                          (userIsTecnico && allowedRoles.includes('TECNICO'));
    
    console.log('🛡️ userRole:', userRole);
    console.log('🛡️ userIsTecnico:', userIsTecnico);
    console.log('🛡️ hasPermission:', hasPermission);
    
    if (!hasPermission) {
      console.log('❌ Sin permiso, redirigiendo a la raíz');
      // Si no tiene permiso, redirigir según su rol
      if (userRole === 'ADMIN') {
        return <Navigate to="/admin/dashboard" />;
      } else if (userIsTecnico || userRole === 'TECNICO') {
        return <Navigate to="/tecnico/dashboard" />;
      }
      return <Navigate to="/usuario/dashboard" />;
    }
  }
  
  console.log('✅ Renderizando children');
  return children;
};

export default ProtectedRoute;