import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import api from '../../api/axiosConfig';

const UsuarioPostular = () => {
  const [formData, setFormData] = useState({
    especialidadDeclarada: '',
    aniosExperiencia: '',
    cvUrl: '',
    certificadosUrl: '',
    dniDocumentoUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [postulacionExistente, setPostulacionExistente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPostulacion = async () => {
      try {
        const response = await api.get('/postulaciones/mis-postulaciones');
        if (response.data.length > 0) {
          setPostulacionExistente(response.data[0]);
        }
      } catch (error) {
        console.error('Error al verificar postulación:', error);
      }
    };
    verificarPostulacion();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const response = await api.post('/postulaciones', {
        especialidadDeclarada: formData.especialidadDeclarada,
        aniosExperiencia: parseInt(formData.aniosExperiencia),
        cvUrl: formData.cvUrl || 'https://ejemplo.com/cv.pdf',
        certificadosUrl: formData.certificadosUrl || 'https://ejemplo.com/certificados.pdf',
        dniDocumentoUrl: formData.dniDocumentoUrl || 'https://ejemplo.com/dni.pdf',
      });

      setMensaje('✅ Tu postulación ha sido enviada exitosamente. Está en revisión.');
      setPostulacionExistente(response.data);
      setFormData({
        especialidadDeclarada: '',
        aniosExperiencia: '',
        cvUrl: '',
        certificadosUrl: '',
        dniDocumentoUrl: '',
      });
    } catch (error) {
      setMensaje(`❌ Error: ${error.response?.data?.message || 'Error al enviar la postulación'}`);
    } finally {
      setLoading(false);
    }
  };

  if (postulacionExistente) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <div className="postulacion-container">
            <h2>Estado de tu Postulación</h2>
            <div className="postulacion-status">
              <p className={`estado ${postulacionExistente.estado.toLowerCase()}`}>
                {postulacionExistente.estado === 'PENDIENTE' && '⏳ En Revisión'}
                {postulacionExistente.estado === 'ACEPTADO' && '✅ Aceptado - ¡Felicidades!'}
                {postulacionExistente.estado === 'RECHAZADO' && '❌ Rechazado'}
              </p>
              {postulacionExistente.estado === 'RECHAZADO' && (
                <>
                  <p className="motivo">Motivo: {postulacionExistente.motivoRechazo}</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setPostulacionExistente(null)}
                  >
                    Volver a postular
                  </button>
                </>
              )}
              {postulacionExistente.estado === 'ACEPTADO' && (
                <p>Ya eres un técnico registrado. ¡Bienvenido al equipo!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <div className="postulacion-container">
          <h2>Postular como Técnico</h2>
          <p className="subtitle">Completa el formulario para unirte a nuestro equipo</p>

          <form onSubmit={handleSubmit} className="postulacion-form">
            <div className="form-group">
              <label>Especialidad</label>
              <select
                name="especialidadDeclarada"
                value={formData.especialidadDeclarada}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una especialidad</option>
                <option value="Lavadoras">Lavadoras</option>
                <option value="Refrigeradores">Refrigeradores</option>
                <option value="Microondas">Microondas</option>
                <option value="Aires Acondicionados">Aires Acondicionados</option>
                <option value="Computadoras">Computadoras</option>
                <option value="Electrónica en General">Electrónica en General</option>
              </select>
            </div>

            <div className="form-group">
              <label>Años de Experiencia</label>
              <input
                type="number"
                name="aniosExperiencia"
                value={formData.aniosExperiencia}
                onChange={handleChange}
                required
                min="0"
                max="50"
                placeholder="Ej: 5"
              />
            </div>

            <div className="form-group">
              <label>URL de tu CV</label>
              <input
                type="url"
                name="cvUrl"
                value={formData.cvUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/tu-cv.pdf"
              />
              <small>Sube tu CV a Google Drive o Dropbox y pega el enlace</small>
            </div>

            <div className="form-group">
              <label>URL de Certificados</label>
              <input
                type="url"
                name="certificadosUrl"
                value={formData.certificadosUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/tus-certificados.pdf"
              />
              <small>Sube tus certificados a Google Drive o Dropbox y pega el enlace</small>
            </div>

            <div className="form-group">
              <label>URL de Documento de Identidad</label>
              <input
                type="url"
                name="dniDocumentoUrl"
                value={formData.dniDocumentoUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/tu-dni.pdf"
              />
              <small>Sube tu DNI a Google Drive o Dropbox y pega el enlace</small>
            </div>

            {mensaje && (
              <div className={`mensaje ${mensaje.includes('✅') ? 'success' : 'error'}`}>
                {mensaje}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Postulación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UsuarioPostular;