// src/components/admin/AdminPostulaciones.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';
import { FaCheck, FaTimes, FaEye, FaFileAlt } from 'react-icons/fa';

const AdminPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPostulacion, setSelectedPostulacion] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/postulaciones/pendientes');
      console.log('Postulaciones pendientes:', response.data);
      setPostulaciones(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar postulaciones:', error);
      setError('Error al cargar las postulaciones');
    } finally {
      setLoading(false);
    }
  };


const handleAprobar = async (id) => {
  if (!window.confirm('¿Estás seguro de aprobar esta postulación?')) return;
  try {
    console.log('📤 Aprobando postulación ID:', id);
    console.log('🔑 Token:', localStorage.getItem('token'));
    
    const response = await api.put(`/postulaciones/${id}/aprobar`);
    console.log('✅ Respuesta:', response.data);
    
    alert('✅ Postulación aprobada exitosamente');
    cargarPostulaciones();
    setSelectedPostulacion(null);
  } catch (error) {
    console.error('❌ Error al aprobar:', error);
    console.error('🔍 Detalles:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    
    if (error.response?.status === 403) {
      alert('❌ Error 403: No tienes permisos para aprobar postulaciones.\nVerifica que estás logueado como ADMIN.');
    } else {
      alert(`❌ Error al aprobar la postulación: ${error.response?.data?.message || error.message}`);
    }
  }
};

  const handleRechazar = async (id) => {
    if (!motivoRechazo.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }
    if (!window.confirm('¿Estás seguro de rechazar esta postulación?')) return;
    try {
      await api.put(`/postulaciones/${id}/rechazar?motivo=${encodeURIComponent(motivoRechazo)}`);
      alert('✅ Postulación rechazada');
      setMotivoRechazo('');
      cargarPostulaciones();
      setSelectedPostulacion(null);
    } catch (error) {
      alert('❌ Error al rechazar la postulación');
    }
  };

  const verDetalle = (postulacion) => {
    setSelectedPostulacion(postulacion);
    setMotivoRechazo('');
  };

  const cerrarDetalle = () => {
    setSelectedPostulacion(null);
    setMotivoRechazo('');
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando postulaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="admin-section">
          <div className="section-header">
            <h2>📋 Postulaciones Pendientes</h2>
            <span className="badge-count">{postulaciones.length}</span>
          </div>
          <p className="subtitle">Revisa y gestiona las solicitudes de nuevos técnicos</p>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={cargarPostulaciones} className="btn-retry">Reintentar</button>
            </div>
          )}

          {postulaciones.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p>No hay postulaciones pendientes de revisión</p>
              <p className="empty-subtitle">Todas las postulaciones han sido revisadas</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Postulante</th>
                    <th>Especialidad</th>
                    <th>Experiencia</th>
                    <th>Documentos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {postulaciones.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.nombres} {post.apellidos}</strong>
                        <br />
                        <small className="email-text">{post.correo}</small>
                      </td>
                      <td>
                        <span className="especialidad-badge">
                          {post.especialidadDeclarada}
                        </span>
                      </td>
                      <td>{post.aniosExperiencia} años</td>
                      <td>
                        <div className="document-links">
                          {post.cvUrl && (
                            <a href={post.cvUrl} target="_blank" rel="noopener noreferrer" className="doc-link">
                              <FaFileAlt /> CV
                            </a>
                          )}
                          {post.certificadosUrl && (
                            <a href={post.certificadosUrl} target="_blank" rel="noopener noreferrer" className="doc-link">
                              <FaFileAlt /> Cert
                            </a>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view" 
                            onClick={() => verDetalle(post)}
                          >
                            <FaEye /> Ver Detalle
                          </button>
                          <button 
                            className="btn-aprobar" 
                            onClick={() => handleAprobar(post.id)}
                          >
                            <FaCheck /> Aprobar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal de Detalle */}
          {selectedPostulacion && (
            <div className="modal-overlay" onClick={cerrarDetalle}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={cerrarDetalle}>✕</button>
                <h3>📄 Detalle de Postulación</h3>
                
                <div className="detalle-info">
                  <div className="detalle-row">
                    <span className="detalle-label">Nombre completo:</span>
                    <span className="detalle-value">{selectedPostulacion.nombres} {selectedPostulacion.apellidos}</span>
                  </div>
                  <div className="detalle-row">
                    <span className="detalle-label">Correo:</span>
                    <span className="detalle-value">{selectedPostulacion.correo}</span>
                  </div>
                  <div className="detalle-row">
                    <span className="detalle-label">Especialidad:</span>
                    <span className="detalle-value highlight">{selectedPostulacion.especialidadDeclarada}</span>
                  </div>
                  <div className="detalle-row">
                    <span className="detalle-label">Años de experiencia:</span>
                    <span className="detalle-value">{selectedPostulacion.aniosExperiencia} años</span>
                  </div>
                  <div className="detalle-row">
                    <span className="detalle-label">Fecha de postulación:</span>
                    <span className="detalle-value">
                      {new Date(selectedPostulacion.fechaPostulacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="detalle-documents">
                  <h4>📎 Documentos adjuntos</h4>
                  <div className="documents-grid">
                    {selectedPostulacion.cvUrl && (
                      <a href={selectedPostulacion.cvUrl} target="_blank" rel="noopener noreferrer" className="doc-card">
                        <FaFileAlt size={24} />
                        <span>Ver CV</span>
                      </a>
                    )}
                    {selectedPostulacion.certificadosUrl && (
                      <a href={selectedPostulacion.certificadosUrl} target="_blank" rel="noopener noreferrer" className="doc-card">
                        <FaFileAlt size={24} />
                        <span>Ver Certificados</span>
                      </a>
                    )}
                    {selectedPostulacion.dniDocumentoUrl && (
                      <a href={selectedPostulacion.dniDocumentoUrl} target="_blank" rel="noopener noreferrer" className="doc-card">
                        <FaFileAlt size={24} />
                        <span>Ver DNI</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="rechazo-area">
                  <label>Motivo de Rechazo (si aplica)</label>
                  <textarea
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    placeholder="Ingresa el motivo si vas a rechazar la postulación..."
                    rows="3"
                  />
                  <div className="modal-actions">
                    <button 
                      className="btn-aprobar btn-large" 
                      onClick={() => handleAprobar(selectedPostulacion.id)}
                    >
                      <FaCheck /> Aprobar Postulación
                    </button>
                    <button 
                      className="btn-rechazar btn-large" 
                      onClick={() => handleRechazar(selectedPostulacion.id)}
                    >
                      <FaTimes /> Rechazar Postulación
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPostulaciones;