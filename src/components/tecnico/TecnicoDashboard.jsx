// src/components/tecnico/TecnicoDashboard.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // ← IMPORTAR useLocation
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaWrench, FaSignOutAlt, FaArrowRight } from 'react-icons/fa';

const TecnicoDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🟢 TecnicoDashboard renderizado');
  console.log('🟢 user:', user);
  console.log('🟢 pathname:', location.pathname);

  // Si estamos en la raíz de técnico (sin subruta), mostrar el selector
  const isRoot = location.pathname === '/tecnico/dashboard';
  
  // Si ya seleccionó "cliente", redirigir
  if (location.pathname === '/tecnico/cliente') {
    console.log('🟢 Redirigiendo a usuario dashboard');
    navigate('/usuario/dashboard');
    return null;
  }

  // Si estamos en la raíz, mostrar el selector de rol
  if (isRoot) {
    console.log('🟢 Mostrando selector de rol');
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="role-selector-container">
            <h2>👋 ¡Hola, {user?.nombres}!</h2>
            <p className="role-subtitle">Eres un Técnico registrado. ¿Cómo deseas ingresar hoy?</p>
            
            <div className="role-cards">
              {/* Botón Cliente */}
              <div 
                className="role-card client-role"
                onClick={() => {
                  console.log('🟢 Seleccionó: Cliente - navegando a /usuario/dashboard');
                  navigate('/usuario/dashboard');
                }}
              >
                <div className="role-icon">
                  <FaUser size={48} />
                </div>
                <h3>Como Cliente</h3>
                <p>Solicitar servicios, ver historial y más</p>
                <div className="role-arrow">
                  <FaArrowRight />
                </div>
              </div>

              {/* Botón Técnico */}
              <div 
                className="role-card tecnico-role"
                onClick={() => {
                  console.log('🟢 Seleccionó: Técnico - navegando a /tecnico/atender');
                  navigate('/tecnico/atender');
                }}
              >
                <div className="role-icon">
                  <FaWrench size={48} />
                </div>
                <h3>Como Técnico</h3>
                <p>Atender solicitudes, gestionar servicios</p>
                <div className="role-arrow">
                  <FaArrowRight />
                </div>
              </div>
            </div>

            <button 
              className="btn-logout-role"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <FaSignOutAlt /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si estamos en /tecnico/atender, mostrar el contenido del técnico
  if (location.pathname === '/tecnico/atender') {
    return <TecnicoContent />;
  }

  // Por defecto, mostrar selector
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="role-selector-container">
          <h2>👋 ¡Hola, {user?.nombres}!</h2>
          <p className="role-subtitle">Eres un Técnico registrado. ¿Cómo deseas ingresar hoy?</p>
          
          <div className="role-cards">
            <div 
              className="role-card client-role"
              onClick={() => navigate('/usuario/dashboard')}
            >
              <div className="role-icon">
                <FaUser size={48} />
              </div>
              <h3>Como Cliente</h3>
              <p>Solicitar servicios, ver historial y más</p>
              <div className="role-arrow">
                <FaArrowRight />
              </div>
            </div>

            <div 
              className="role-card tecnico-role"
              onClick={() => navigate('/tecnico/atender')}
            >
              <div className="role-icon">
                <FaWrench size={48} />
              </div>
              <h3>Como Técnico</h3>
              <p>Atender solicitudes, gestionar servicios</p>
              <div className="role-arrow">
                <FaArrowRight />
              </div>
            </div>
          </div>

          <button 
            className="btn-logout-role"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente con el contenido del técnico
const TecnicoContent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [disponible, setDisponible] = useState(true);
  const [solicitudes, setSolicitudes] = useState([
    {
      id: 1,
      cliente: 'María González',
      problema: 'Lavadora no enciende',
      direccion: 'Av. Principal 123, Lima',
      estado: 'PENDIENTE',
    },
    {
      id: 2,
      cliente: 'Carlos Ruiz',
      problema: 'Refrigerador no enfría',
      direccion: 'Calle 456, Miraflores',
      estado: 'PENDIENTE',
    },
  ]);

  const toggleDisponibilidad = () => {
    setDisponible(!disponible);
  };

  const handleAceptar = (id) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'ACEPTADO' } : s
    ));
    alert('✅ Solicitud aceptada. El cliente será notificado.');
  };

  const handleRechazar = (id) => {
    setSolicitudes(solicitudes.map(s => 
      s.id === id ? { ...s, estado: 'RECHAZADO' } : s
    ));
  };

  // Cambiar al modo cliente
  const switchToCliente = () => {
    console.log('🟢 Cambiando a modo cliente');
    navigate('/usuario/dashboard');
  };

  return (
    <div className="app-container">
      {/* Navbar superior */}
      <nav className="top-navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-icon">🔧</span>
            <span className="brand-text">RePara</span>
          </div>
          <div className="navbar-user">
            <span className="user-name">{user?.nombres} {user?.apellidos}</span>
            <button onClick={switchToCliente} className="btn-switch-role">
              <FaUser /> Cliente
            </button>
            <button onClick={() => {
              logout();
              navigate('/login');
            }} className="btn-logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="tecnico-dashboard">
          <div className="tecnico-header">
            <h1>👋 Hola, {user?.nombres}</h1>
            <div className="disponibilidad-toggle">
              <span>Estado: {disponible ? '🟢 Activo' : '🔴 Inactivo'}</span>
              <button onClick={toggleDisponibilidad} className="toggle-btn">
                {disponible ? '✅ Activo' : '⏸️ Inactivo'}
              </button>
            </div>
          </div>

          <div className="solicitudes-section">
            <h2>📋 Solicitudes Pendientes</h2>
            {solicitudes.filter(s => s.estado === 'PENDIENTE').length === 0 ? (
              <div className="empty-state">
                <p>No tienes solicitudes pendientes</p>
              </div>
            ) : (
              <div className="solicitudes-list">
                {solicitudes.filter(s => s.estado === 'PENDIENTE').map((solicitud) => (
                  <div key={solicitud.id} className="solicitud-card">
                    <div className="solicitud-header">
                      <h3>{solicitud.cliente}</h3>
                      <span className="badge-pendiente">Pendiente</span>
                    </div>
                    <p><strong>Problema:</strong> {solicitud.problema}</p>
                    <p><strong>Dirección:</strong> {solicitud.direccion}</p>
                    <div className="solicitud-actions">
                      <button 
                        className="btn-accept" 
                        onClick={() => handleAceptar(solicitud.id)}
                      >
                        ✅ Aceptar
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleRechazar(solicitud.id)}
                      >
                        ❌ Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="servicios-section">
            <h2>📊 Servicios Realizados</h2>
            <div className="servicios-stats">
              <div className="stat-card">
                <span className="stat-number">12</span>
                <span className="stat-label">Completados</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">3</span>
                <span className="stat-label">En Proceso</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">4.5 ⭐</span>
                <span className="stat-label">Calificación</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Agregar useState para TecnicoContent
import { useState } from 'react';

export default TecnicoDashboard;