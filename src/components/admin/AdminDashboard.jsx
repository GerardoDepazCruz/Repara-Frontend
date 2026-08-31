// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';
import { 
  FaUsers, 
  FaWrench, 
  FaClipboardList, 
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus
} from 'react-icons/fa';

const AdminDashboard = () => {
    console.log('🟣 RENDERIZANDO ADMIN DASHBOARD');
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token para admin:', token ? token.substring(0, 50) + '...' : '❌ No hay token');
        
        console.log('📤 Solicitando estadísticas...');
        const response = await api.get('/admin/estadisticas');
        console.log('📥 Estadísticas recibidas:', response.data);
        setEstadisticas(response.data);
        setError(null);
      } catch (error) {
        console.error('❌ Error al cargar estadísticas:', error);
        console.error('🔍 Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        setError(error.response?.data?.message || error.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    cargarEstadisticas();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="error-container">
            <h2>⚠️ Error al cargar el dashboard</h2>
            <p className="error-detail">{error}</p>
            <div className="error-actions">
              <button onClick={() => window.location.reload()} className="btn-primary">
                Reintentar
              </button>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }} className="btn-secondary">
                Volver al login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ... resto del componente (igual que antes)
  const cards = [
    { icon: <FaUsers />, label: 'Usuarios', value: estadisticas?.totalUsuarios || 0, color: 'blue' },
    { icon: <FaWrench />, label: 'Técnicos', value: estadisticas?.totalTecnicos || 0, color: 'green' },
    { icon: <FaClipboardList />, label: 'Solicitudes', value: estadisticas?.totalSolicitudes || 0, color: 'purple' },
    { icon: <FaMoneyBillWave />, label: 'Ganancias', value: `S/. ${estadisticas?.totalGanancias || '0.00'}`, color: 'gold' },
  ];

  const statusCards = [
    { icon: <FaClock />, label: 'Pendientes', value: estadisticas?.solicitudesPendientes || 0, color: 'orange' },
    { icon: <FaCheckCircle />, label: 'Completadas', value: estadisticas?.solicitudesCompletadas || 0, color: 'green' },
    { icon: <FaTimesCircle />, label: 'Canceladas', value: estadisticas?.solicitudesCanceladas || 0, color: 'red' },
  ];

  const postulacionesPendientes = estadisticas?.totalPostulacionesPendientes || 0;

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
            <h1>📊 Panel de Administración</h1>
            <p className="subtitle">Bienvenido, aquí tienes el resumen de tu plataforma</p>
          </div>

          <div className="stats-grid">
            {cards.map((card, index) => (
              <div key={index} className={`stat-card ${card.color}`}>
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{card.value}</span>
                  <span className="stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="stats-grid status-grid">
            {statusCards.map((card, index) => (
              <div key={index} className={`stat-card status-card ${card.color}`}>
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-info">
                  <span className="stat-value">{card.value}</span>
                  <span className="stat-label">{card.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="postulaciones-pendientes-card">
            <div className="pendientes-content">
              <div className="pendientes-icon">
                <FaUserPlus size={32} />
              </div>
              <div className="pendientes-info">
                <span className="pendientes-number">{postulacionesPendientes}</span>
                <span className="pendientes-label">Postulaciones pendientes de revisión</span>
              </div>
              <button 
                className="btn-primary-small"
                onClick={() => window.location.href = '/admin/postulaciones'}
              >
                Revisar
              </button>
            </div>
          </div>

          <div className="quick-actions">
            <h3>⚡ Accesos Rápidos</h3>
            <div className="quick-actions-grid">
              <div className="quick-action" onClick={() => window.location.href = '/admin/usuarios'}>
                <FaUsers size={24} />
                <span>Gestionar Usuarios</span>
              </div>
              <div className="quick-action" onClick={() => window.location.href = '/admin/tecnicos'}>
                <FaWrench size={24} />
                <span>Gestionar Técnicos</span>
              </div>
              <div className="quick-action" onClick={() => window.location.href = '/admin/postulaciones'}>
                <FaUserPlus size={24} />
                <span>Revisar Postulaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;