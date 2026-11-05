import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { ChatIA } from '../../componentes/cliente/ChatIA';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';

export const NuevaSolicitud = () => {
  const navigate = useNavigate();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    idCategoria: 1,
    descripcionProblema: 'Reparación solicitada vía chat IA',
    direccionServicio: 'Av. Los Alamos 123',
    latitud: -12.0464,
    longitud: -77.0428
  });
  const [cargando, setCargando] = useState(false);

  const crearSolicitud = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await api.post('/solicitudes/crear', formData);
      toast.success('¡Solicitud creada! Buscando técnico...');
      navigate(`/cliente/solicitud/${res.data.datos.idSolicitud}`);
    } catch (error) {
      toast.error('Error al crear la solicitud');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Cuéntanos qué pasó</h1>
      
      {!mostrarFormulario ? (
        <ChatIA onSolicitudCreada={() => setMostrarFormulario(true)} />
      ) : (
        <form onSubmit={crearSolicitud} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <p className="text-sm text-gray-600 mb-4">La IA generó este resumen. Confirma los datos para buscar un técnico:</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección exacta</label>
            <input type="text" value={formData.direccionServicio} onChange={(e) => setFormData({...formData, direccionServicio: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <Boton tipo="primary" className="w-full py-3" disabled={cargando}>
            {cargando ? 'Creando...' : 'Confirmar y buscar técnico'}
          </Boton>
        </form>
      )}
    </div>
  );
};