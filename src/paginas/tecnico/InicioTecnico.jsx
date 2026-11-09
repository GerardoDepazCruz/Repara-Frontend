import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Wrench, MapPin, Clock, CheckCircle } from 'lucide-react';

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
      navigate(`/chat/${id}`); 
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'Error al aceptar');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Estado de disponibilidad */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${disponible ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <div>
            <span className="font-bold text-gray-800 block">
              {disponible ? 'Estás Disponible' : 'No disponible'}
            </span>
            <span className="text-xs text-gray-500">
              {disponible ? 'Recibiendo solicitudes cercanas' : 'No recibirás solicitudes'}
            </span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={disponible} onChange={() => setDisponible(!disponible)} className="sr-only peer" />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-5">Solicitudes Cercanas</h1>
      
      {cargando ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <Clock size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">No hay solicitudes pendientes</p>
          <p className="text-sm text-gray-400 mt-1">Mantente disponible para recibir nuevas.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <div key={sol.idSolicitud} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">{sol.categoria?.nombre}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={16} className="text-blue-500"/> {sol.direccionServicio}
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full">
                  Prioridad
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl mb-5 border border-gray-100">
                <p className="text-sm font-medium text-gray-700">{sol.descripcionProblema}</p>
              </div>

              <Boton tipo="success" onClick={() => aceptarSolicitud(sol.idSolicitud)} className="w-full py-3.5 text-lg rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center gap-2">
                <CheckCircle size={20}/> Aceptar Solicitud
              </Boton>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};