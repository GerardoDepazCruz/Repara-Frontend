import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';

const UsuarioPerfil = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="perfil-container">
          <h2>Mi Perfil</h2>
          
          <div className="perfil-card">
            <div className="perfil-avatar">
              <div className="avatar-circle">
                <FaUser size={60} />
              </div>
              <h3>{user?.nombres} {user?.apellidos}</h3>
              <p className="perfil-rol">{user?.rol}</p>
            </div>

            <div className="perfil-info">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <label>Correo Electrónico</label>
                  <p>{user?.correo}</p>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <label>Teléfono</label>
                  <p>{user?.telefono || 'No registrado'}</p>
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <label>Dirección</label>
                  <p>{user?.direccion || 'No registrada'}</p>
                </div>
              </div>

              <div className="info-item">
                <FaCalendar className="info-icon" />
                <div>
                  <label>Fecha de Registro</label>
                  <p>{user?.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'No disponible'}</p>
                </div>
              </div>
            </div>

            {user?.esTecnico && (
              <div className="perfil-tecnico-badge">
                <span className="badge-tecnico">✅ Técnico Registrado</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPerfil;