// src/components/usuario/UsuarioDashboard.jsx - Eliminar 'loading'
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';

const UsuarioDashboard = () => {
  const { user } = useAuth();
  const [postulacion, setPostulacion] = useState(null);
  // ❌ ELIMINAR: const [loading, setLoading] = useState(false);

  const isTecnico = user?.esTecnico === true;

  useEffect(() => {
    const verificarPostulacion = async () => {
      try {
        const response = await api.get('/postulaciones/mis-postulaciones');
        if (response.data.length > 0) {
          setPostulacion(response.data[0]);
        }
      } catch (error) {
        console.error('Error al verificar postulación:', error);
      }
    };
    verificarPostulacion();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="dashboard-container">
          <h1>¡Bienvenido, {user?.nombres}!</h1>
          
          {isTecnico && (
            <div className="tecnico-banner">
              <p>🔧 Estás viendo la plataforma como <strong>Cliente</strong></p>
              <p className="tecnico-hint">Puedes cambiar a tu perfil de Técnico desde el menú</p>
            </div>
          )}
          
          <div className="dashboard-cards">
            <div className="card">
              <h3>Especialidades</h3>
              <p>Encuentra técnicos especializados</p>
            </div>
            
            {postulacion && (
              <div className="card postulacion-card">
                <h3>Estado de tu Postulación</h3>
                <p className={`estado ${postulacion.estado.toLowerCase()}`}>
                  {postulacion.estado === 'PENDIENTE' && '⏳ En Revisión'}
                  {postulacion.estado === 'ACEPTADO' && '✅ Aceptado'}
                  {postulacion.estado === 'RECHAZADO' && '❌ Rechazado'}
                </p>
                {postulacion.estado === 'RECHAZADO' && (
                  <p className="motivo">Motivo: {postulacion.motivoRechazo}</p>
                )}
              </div>
            )}
          </div>

          <div className="recent-solicitudes">
            <h3>Solicitudes Recientes</h3>
            <p className="empty-message">No tienes solicitudes recientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioDashboard;