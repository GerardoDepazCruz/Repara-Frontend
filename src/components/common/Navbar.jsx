// src/components/common/Navbar.jsx - Modificar para técnicos
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaClipboardList, 
  FaSignOutAlt,
  FaChartBar,
  FaUsers,
  FaWrench,
  FaBell,
  FaUserPlus,
  FaExchangeAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🧭 Navbar - user:', user);
  console.log('🧭 Navbar - rol:', user?.rol);
  console.log('🧭 Navbar - esTecnico:', user?.esTecnico);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Obtener los items del menú según el rol
  const getMenuItems = () => {
    if (user?.rol === 'ADMIN') {
      return [
        { icon: <FaChartBar />, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: <FaUsers />, label: 'Usuarios', path: '/admin/usuarios' },
        { icon: <FaWrench />, label: 'Técnicos', path: '/admin/tecnicos' },
        { icon: <FaUserPlus />, label: 'Postulaciones', path: '/admin/postulaciones' },
        { icon: <FaBell />, label: 'Notificaciones', path: '/admin/notificaciones' },
      ];
    }

    // Si es técnico y está viendo como técnico
    if (user?.esTecnico && (location.pathname.startsWith('/tecnico') || location.pathname === '/tecnico/atender')) {
  return [
    { icon: <FaHome />, label: 'Atender', path: '/tecnico/atender' },
    { icon: <FaClipboardList />, label: 'Servicios', path: '/tecnico/servicios' },
    { icon: <FaUser />, label: 'Perfil', path: '/usuario/perfil' },
    { icon: <FaExchangeAlt />, label: 'Cliente', path: '/usuario/dashboard' },
  ];
}

    // Usuario cliente (o técnico viendo como cliente)
    return [
      { icon: <FaHome />, label: 'Inicio', path: '/usuario/dashboard' },
      { icon: <FaClipboardList />, label: 'Postular', path: '/usuario/postular' },
      { icon: <FaUser />, label: 'Perfil', path: '/usuario/perfil' },
      // Si es técnico, mostrar opción para cambiar
      ...(user?.esTecnico ? [
        { icon: <FaExchangeAlt />, label: 'Técnico', path: '/tecnico/dashboard' }
      ] : []),
    ];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Navbar superior */}
      <nav className="top-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">🔧</span>
            <span className="brand-text">RePara</span>
          </div>
          <div className="navbar-user">
            <span className="user-name">{user?.nombres} {user?.apellidos}</span>
            <span className="user-role">{user?.rol}</span>
            <button onClick={handleLogout} className="btn-logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </nav>

      {/* Navbar inferior (menú de navegación) */}
      <nav className="bottom-navbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navbar;