import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { ChatIA } from '../../componentes/cliente/ChatIA';
import { Boton } from '../../componentes/comunes/Boton';
import Swal from 'sweetalert2';
import { MapPin, Wrench, FileText, Edit } from 'lucide-react';

export const NuevaSolicitud = () => {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [resumenIA, setResumenIA] = useState('');
  const [formData, setFormData] = useState({
    idCategoria: 1,
    descripcionProblema: '',
    direccionServicio: '',
    latitud: -12.0464,
    longitud: -77.0428
  });

  const handleResumenGenerado = (resumen) => {
    setResumenIA(resumen);
    setFormData({ ...formData, descripcionProblema: resumen });
    setMostrarFormulario(true);
  };

  const crearSolicitud = async (e) => {
    e.preventDefault();
    Swal.fire({ title: 'Buscando técnico...', text: 'Por favor espera', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const res = await api.post('/solicitudes/crear', formData);
      Swal.close();
      Swal.fire('¡Solicitud Creada!', 'Estamos buscando al mejor técnico para ti.', 'success');
      navigate(`/cliente/solicitud/${res.data.datos.idSolicitud}`);
    } catch (error) {
      Swal.fire('Error', 'No se pudo crear la solicitud', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cuéntanos qué pasó</h1>
      
      {!mostrarFormulario ? (
        <ChatIA onSolicitudCreada={handleResumenGenerado} />
      ) : (
        <form onSubmit={crearSolicitud} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg border-b border-gray-100 pb-4">
            <FileText size={22} /> Detalles del Problema
          </div>
          
          {/* 🔥 AHORA EL TEXTO ES EDITABLE Y SE VE COMO UN PROBLEMA REAL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Edit size={16} className="text-gray-400"/> Descripción del problema
            </label>
            <textarea 
                value={formData.descripcionProblema}
                onChange={(e) => setFormData({...formData, descripcionProblema: e.target.value})}
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none text-gray-700"
                placeholder="Ej: Mi refrigeradora no enfría y hace un ruido extraño..."
            />
            <p className="text-xs text-gray-400 mt-1">Puedes editar este texto para que el técnico entienda mejor el problema.</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Wrench size={18} className="text-gray-400"/> ¿Qué electrodoméstico es?
            </label>
            <select 
                value={formData.idCategoria}
                onChange={(e) => setFormData({...formData, idCategoria: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
                <option value="1">Refrigeración</option>
                <option value="2">Lavadoras</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <MapPin size={18} className="text-gray-400"/> Dirección exacta
            </label>
            <input 
                type="text" 
                required
                placeholder="Ej: Av. Los Alamos 123"
                value={formData.direccionServicio}
                onChange={(e) => setFormData({...formData, direccionServicio: e.target.value})} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
            />
          </div>

          <Boton tipo="primary" className="w-full py-4 text-lg rounded-xl shadow-lg shadow-blue-500/30">
            Confirmar y buscar técnico
          </Boton>
        </form>
      )}
    </div>
  );
};