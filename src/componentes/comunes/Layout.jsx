import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Home, Wrench, User, LogOut, Bell, FileText, Briefcase } from 'lucide-react';
import { ModalNotificaciones } from './ModalNotificaciones';
import { Award } from 'lucide-react';

export const Layout = ({ children }) => {
  const { usuario, cerrarSesion, esAdmin, esTecnico } = useAutenticacion();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  // 🔥 LÓGICA CORREGIDA: Si está en /tecnico o en /chat y es técnico, se queda en modo técnico
  const esModoTecnico = esTecnico && (location.pathname.startsWith('/tecnico') || location.pathname.startsWith('/chat'));

  // Opciones de menú según el rol
  const menuCliente = [
    { path: '/cliente', icon: Home, label: 'Inicio' },
    { path: '/cliente/servicios', icon: Wrench, label: 'Mis Servicios' },
    { path: '/cliente/postular', icon: Briefcase, label: 'Postular' },
    { path: '/cliente/perfil', icon: User, label: 'Perfil' },
  ];

  const menuTecnico = [
    { path: '/tecnico', icon: Home, label: 'Inicio' },
    { path: '/tecnico/perfil', icon: User, label: 'Perfil' },
  ];

  const menuAdmin = [
    { path: '/admin', icon: Home, label: 'Dashboard' },
    { path: '/admin/usuarios', icon: User, label: 'Usuarios' },
    { path: '/admin/tecnicos', icon: Award, label: 'Técnicos' }, // 🔥 NUEVO
    { path: '/admin/postulaciones', icon: FileText, label: 'Postulaciones' },
    { path: '/admin/notificaciones', icon: Bell, label: 'Notificar' },
  ];

  let menu = menuCliente;
  let nombreModo = 'Cliente';

  if (esAdmin) {
    menu = menuAdmin;
    nombreModo = 'Admin';
  } else if (esModoTecnico) {
    menu = menuTecnico;
    nombreModo = 'Técnico';
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* MODAL DE NOTIFICACIONES FLOTANTE */}
      {usuario && !esAdmin && <ModalNotificaciones />}

      {/* Header */}
      <header className="bg-repara-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wrench size={24} />
            <h1 className="text-xl font-bold">RePara</h1>
            {usuario && (
              <span className="ml-4 text-sm bg-repara-800 px-2 py-1 rounded">
                Modo: {nombreModo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {usuario && (
              <>
                <span className="text-sm hidden md:block">{usuario.nombres} {usuario.apellidos}</span>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-repara-800 hover:bg-repara-900 px-3 py-1 rounded transition">
                  <LogOut size={16} /> Salir
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 mb-20 md:mb-4">
        {children}
      </main>

      {/* Bottom Nav (Mobile) / Sidebar (Desktop) */}
      {usuario && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] md:static md:border-t-0 md:bg-transparent md:border-none">
          <div className="flex justify-around md:flex-col md:gap-2 md:fixed md:left-0 md:top-16 md:w-64 md:h-[calc(100vh-4rem)] md:p-4 md:bg-white md:border-r md:border-gray-200">
            {menu.map((item) => {
              const activo = location.pathname === item.path;
              return (
                <Link
  key={item.path}
  to={item.path}
  className={`flex flex-col items-center gap-1 py-2 px-4 md:flex-row md:gap-3 md:px-4 md:py-3 md:rounded-xl transition-all ${
    activo ? 'text-repara-600 font-bold' : 'text-gray-400 font-medium hover:text-repara-500'
  }`}
>
  <div className={`p-1.5 rounded-full md:hidden ${activo ? 'bg-repara-100' : ''}`}>
      <item.icon size={22} />
  </div>
  <item.icon size={20} className="hidden md:block" />
  <span className="text-[10px] md:text-sm">{item.label}</span>
</Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};