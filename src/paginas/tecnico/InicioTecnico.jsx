import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Wrench, MapPin, Clock } from 'lucide-react';

export const InicioTecnico = () => {
  const { usuario } = useAutenticacion();
  const [solicitudes, setSolicitudes] = useState([]);
  const [disponible, setDisponible] = useState(true);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await api.get('/solicitudes/pendientes');
      setSolicitudes(res.data.datos || []);
    } catch (error) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setCargando(false);
    }
  };

    const aceptarSolicitud = async (id) => {
    try {
      await api.post(`/solicitudes/${id}/aceptar`);
      toast.success('¡Solicitud aceptada!');
      // Lo mandamos al chat de trayecto (que también tiene el botón de pedir PIN)
      navigate(`/chat/${id}`); 
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al aceptar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Estado de disponibilidad */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${disponible ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="font-medium text-gray-700">
            {disponible ? 'Disponible para trabajar' : 'No disponible'}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={disponible} onChange={() => setDisponible(!disponible)} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-4">Solicitudes cercanas</h1>
      
      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
          <Clock size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No hay solicitudes pendientes ahora</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <div key={sol.idSolicitud} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{sol.categoria?.nombre}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {sol.direccionServicio}
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                  Prioridad
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{sol.descripcionProblema}</p>
              <Boton tipo="success" onClick={() => aceptarSolicitud(sol.idSolicitud)} className="w-full">
                Aceptar Solicitud
              </Boton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};