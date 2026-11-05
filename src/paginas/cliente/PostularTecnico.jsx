import { useState } from 'react';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

export const PostularTecnico = () => {
  const { usuario } = useAutenticacion();
  const [formData, setFormData] = useState({
    especialidadDeclarada: '', aniosExperiencia: '', cvUrl: '', certificadosUrl: '', dniDocumentoUrl: ''
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post('/postulaciones/crear', formData);
      toast.success('¡Postulación enviada! Espera la aprobación del administrador.');
      setFormData({ especialidadDeclarada: '', aniosExperiencia: '', cvUrl: '', certificadosUrl: '', dniDocumentoUrl: '' });
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al postular');
    } finally {
      setCargando(false);
    }
  };

  if (usuario?.esTecnico) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <div className="bg-green-50 border border-green-200 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-green-800 mb-2">¡Ya eres técnico!</h2>
          <p className="text-green-600">Tu postulación ya fue aprobada. Puedes cambiar al modo técnico desde el inicio de sesión.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-repara-100 text-repara-600 rounded-full mb-4">
          <Briefcase size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Postula para ser Técnico</h1>
        <p className="text-gray-500 mt-2">Completa el formulario y espera la aprobación</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
          <input type="text" name="especialidadDeclarada" value={formData.especialidadDeclarada} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 outline-none" placeholder="Ej: Refrigeración, Lavadoras, etc." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia</label>
          <input type="number" name="aniosExperiencia" value={formData.aniosExperiencia} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del CV (PDF)</label>
          <input type="url" name="cvUrl" value={formData.cvUrl} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL de Certificados</label>
          <input type="url" name="certificadosUrl" value={formData.certificadosUrl} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL del DNI</label>
          <input type="url" name="dniDocumentoUrl" value={formData.dniDocumentoUrl} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 outline-none" placeholder="https://..." />
        </div>
        <Boton tipo="primary" className="w-full py-3" disabled={cargando}>
          {cargando ? 'Enviando...' : 'Enviar Postulación'}
        </Boton>
      </form>
    </div>
  );
};