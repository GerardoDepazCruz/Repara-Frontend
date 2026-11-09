import { Routes, Route, Navigate } from 'react-router-dom';
import { useAutenticacion } from './contextos/AutenticacionContexto';
import { Layout } from './componentes/comunes/Layout';
import { RutaProtegida } from './rutas/RutaProtegida';

// Autenticación
import { Login } from './paginas/autenticacion/Login';
import { Registro } from './paginas/autenticacion/Registro';
import { SeleccionarModo } from './paginas/autenticacion/SeleccionarModo';

// Cliente
import { InicioCliente } from './paginas/cliente/InicioCliente';
import { MisServicios } from './paginas/cliente/MisServicios';
import { PostularTecnico } from './paginas/cliente/PostularTecnico';
import { PerfilCliente } from './paginas/cliente/PerfilCliente';

// Técnico
import { InicioTecnico } from './paginas/tecnico/InicioTecnico';
import { PerfilTecnico } from './paginas/tecnico/PerfilTecnico';

// Admin
import { Dashboard } from './paginas/admin/Dashboard';
import { GestionUsuarios } from './paginas/admin/GestionUsuarios';
import { GestionPostulaciones } from './paginas/admin/GestionPostulaciones';
import { Notificaciones } from './paginas/admin/Notificaciones';

import { NuevaSolicitud } from './paginas/cliente/NuevaSolicitud';
import { DetalleSolicitud } from './paginas/cliente/DetalleSolicitud';

import { DetalleSolicitudTecnico } from './paginas/tecnico/DetalleSolicitudTecnico';

import { ChatTrayecto } from './paginas/cliente/ChatTrayecto';
import { CrearInforme } from './paginas/tecnico/CrearInforme';

import { GestionTecnicos } from './paginas/admin/GestionTecnicos';

function App() {
  const { cargando } = useAutenticacion();

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-repara-600"></div></div>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/seleccionar-modo" element={
        <RutaProtegida><SeleccionarModo /></RutaProtegida>
      } />

      {/* Rutas Cliente */}
      <Route path="/cliente" element={
        <RutaProtegida rolesPermitidos={['CLIENTE']}>
          <Layout><InicioCliente /></Layout>
        </RutaProtegida>
      } />
      
      <Route path="/cliente/servicios" element={
        <RutaProtegida rolesPermitidos={['CLIENTE']}>
          <Layout><MisServicios /></Layout>
        </RutaProtegida>
      } />
      <Route path="/cliente/postular" element={
        <RutaProtegida rolesPermitidos={['CLIENTE']}>
          <Layout><PostularTecnico /></Layout>
        </RutaProtegida>
      } />
      <Route path="/cliente/perfil" element={
        <RutaProtegida rolesPermitidos={['CLIENTE']}>
          <Layout><PerfilCliente /></Layout>
        </RutaProtegida>
      } />

      <Route path="/cliente/nueva-solicitud" element={
  <RutaProtegida rolesPermitidos={['CLIENTE']}>
    <Layout><NuevaSolicitud /></Layout>
  </RutaProtegida>
} />
<Route path="/cliente/solicitud/:id" element={
  <RutaProtegida rolesPermitidos={['CLIENTE', 'TECNICO']}>
    <Layout><DetalleSolicitud /></Layout>
  </RutaProtegida>
} />

<Route path="/admin/tecnicos" element={
  <RutaProtegida rolesPermitidos={['ADMIN']}>
    <Layout><GestionTecnicos /></Layout>
  </RutaProtegida>
} />

      {/* Rutas Técnico */}
      <Route path="/tecnico" element={
        <RutaProtegida rolesPermitidos={['CLIENTE', 'TECNICO']}>
          <Layout><InicioTecnico /></Layout>
        </RutaProtegida>
      } />
      <Route path="/tecnico/perfil" element={
        <RutaProtegida rolesPermitidos={['CLIENTE', 'TECNICO']}>
          <Layout><PerfilTecnico /></Layout>
        </RutaProtegida>
      } />

      {/* Rutas Admin */}
      <Route path="/admin" element={
        <RutaProtegida rolesPermitidos={['ADMIN']}>
          <Layout><Dashboard /></Layout>
        </RutaProtegida>
      } />
      <Route path="/admin/usuarios" element={
        <RutaProtegida rolesPermitidos={['ADMIN']}>
          <Layout><GestionUsuarios /></Layout>
        </RutaProtegida>
      } />
      <Route path="/admin/postulaciones" element={
        <RutaProtegida rolesPermitidos={['ADMIN']}>
          <Layout><GestionPostulaciones /></Layout>
        </RutaProtegida>
      } />
      <Route path="/admin/notificaciones" element={
        <RutaProtegida rolesPermitidos={['ADMIN']}>
          <Layout><Notificaciones /></Layout>
        </RutaProtegida>
      } />
      <Route path="/tecnico/solicitud/:id" element={
  <RutaProtegida rolesPermitidos={['CLIENTE', 'TECNICO']}>
    <Layout><DetalleSolicitudTecnico /></Layout>
  </RutaProtegida>
} />

      {/* Chat y Informe */}
      <Route path="/chat/:id" element={
        <RutaProtegida>
          <Layout><ChatTrayecto /></Layout>
        </RutaProtegida>
      } />
      <Route path="/tecnico/informe/:id" element={
        <RutaProtegida rolesPermitidos={['TECNICO', 'CLIENTE']}>
          <Layout><CrearInforme /></Layout>
        </RutaProtegida>
      } />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;