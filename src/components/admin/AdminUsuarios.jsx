// src/components/admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';
import { FaUser, FaUserCheck, FaUserSlash, FaSearch, FaFilter, FaUserCog } from 'react-icons/fa';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const filtered = usuarios.filter(u => 
        u.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.telefono && u.telefono.includes(searchTerm))
      );
      setFilteredUsuarios(filtered);
    }
  }, [searchTerm, usuarios]);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/usuarios');
      setUsuarios(response.data);
      setFilteredUsuarios(response.data);
      setError(null);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspender = async (id) => {
    if (!window.confirm('¿Estás seguro de suspender este usuario?')) return;
    try {
      await api.put(`/admin/usuarios/${id}/suspender`);
      alert('✅ Usuario suspendido');
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al suspender usuario');
    }
  };

  const handleActivar = async (id) => {
    if (!window.confirm('¿Estás seguro de activar este usuario?')) return;
    try {
      await api.put(`/admin/usuarios/${id}/activar`);
      alert('✅ Usuario activado');
      cargarUsuarios();
    } catch (error) {
      alert('❌ Error al activar usuario');
    }
  };

  // Contar estadísticas
  const totalUsuarios = usuarios.length;
  const totalTecnicos = usuarios.filter(u => u.esTecnico).length;
  const totalActivos = usuarios.filter(u => u.estado === 'ACTIVO').length;
  const totalSospechosos = usuarios.filter(u => u.estado === 'SUSPENDIDO').length;

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando usuarios...</p>
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
          <div className="admin-header">
            <div className="header-title">
              <h2>👥 Gestión de Usuarios</h2>
              <span className="badge-count">{totalUsuarios}</span>
            </div>
            <p className="subtitle">Total: {totalUsuarios} usuarios registrados</p>
          </div>

          {/* Estadísticas rápidas */}
          <div className="admin-stats-row">
            <div className="stat-mini">
              <span className="stat-mini-number">{totalUsuarios}</span>
              <span className="stat-mini-label">Total</span>
            </div>
            <div className="stat-mini green">
              <span className="stat-mini-number">{totalActivos}</span>
              <span className="stat-mini-label">Activos</span>
            </div>
            <div className="stat-mini red">
              <span className="stat-mini-number">{totalSospechosos}</span>
              <span className="stat-mini-label">Suspendidos</span>
            </div>
            <div className="stat-mini blue">
              <span className="stat-mini-number">{totalTecnicos}</span>
              <span className="stat-mini-label">Técnicos</span>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button onClick={cargarUsuarios} className="btn-retry">Reintentar</button>
            </div>
          )}

          {/* Tabla */}
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Técnico</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      {searchTerm ? 'No se encontraron usuarios con ese criterio' : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredUsuarios.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.nombres.charAt(0)}{user.apellidos?.charAt(0) || ''}
                          </div>
                          <div>
                            <strong>{user.nombres} {user.apellidos}</strong>
                          </div>
                        </div>
                      </td>
                      <td className="email-cell">{user.correo}</td>
                      <td>{user.telefono || '—'}</td>
                      <td>
                        <span className={`rol-badge ${user.rol.toLowerCase()}`}>
                          {user.rol}
                        </span>
                      </td>
                      <td>
                        {user.esTecnico ? (
                          <span className="tecnico-badge yes">✅ Técnico</span>
                        ) : (
                          <span className="tecnico-badge no">❌ Cliente</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${user.estado.toLowerCase()}`}>
                          {user.estado === 'ACTIVO' && '🟢 Activo'}
                          {user.estado === 'SUSPENDIDO' && '🔴 Suspendido'}
                          {user.estado === 'INACTIVO' && '⚪ Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.estado === 'ACTIVO' ? (
                            <button 
                              className="btn-suspender" 
                              onClick={() => handleSuspender(user.id)}
                            >
                              <FaUserSlash /> Suspender
                            </button>
                          ) : (
                            <button 
                              className="btn-activar" 
                              onClick={() => handleActivar(user.id)}
                            >
                              <FaUserCheck /> Activar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          {filteredUsuarios.length > 0 && (
            <div className="table-footer">
              <span>Mostrando {filteredUsuarios.length} de {usuarios.length} usuarios</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;