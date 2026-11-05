import { Navigate } from 'react-router-dom';
import { useAutenticacion } from '../contextos/AutenticacionContexto';

export const RutaProtegida = ({ children, rolesPermitidos }) => {
  const { usuario, estaAutenticado, cargando } = useAutenticacion();

  if (cargando) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!estaAutenticado) return <Navigate to="/login" replace />;
  
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }
  return children;
};