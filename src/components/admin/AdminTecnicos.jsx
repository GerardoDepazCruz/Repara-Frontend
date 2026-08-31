import React, { useState, useEffect } from 'react';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';
import { FaWrench, FaCheck, FaTimes, FaStar } from 'react-icons/fa';

const AdminTecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    try {
      const response = await api.get('/admin/tecnicos');
      setTecnicos(response.data);
    } catch (error) {
      console.error('Error al cargar técnicos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="app-container"><Navbar /><div className="main-content"><div className="loading">Cargando...</div></div></div>;

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="admin-section">
          <h2>🔧 Gestión de Técnicos</h2>
          <p className="subtitle">Total: {tecnicos.length} técnicos registrados</p>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Técnico</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Calificación</th>
                  <th>Servicios</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tecnicos.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.nombres} {user.apellidos}</strong>
                    </td>
                    <td>{user.correo}</td>
                    <td>{user.telefono}</td>
                    <td>
                      <div className="rating">
                        <FaStar className="star" />
                        <span>4.5</span>
                      </div>
                    </td>
                    <td>12 servicios</td>
                    <td>
                      <span className={`status-badge ${user.estado.toLowerCase()}`}>
                        {user.estado}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-view">Ver Detalle</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTecnicos;