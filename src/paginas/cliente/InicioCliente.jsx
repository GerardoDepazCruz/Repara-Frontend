import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import api from '../../servicios/api';
import { Wrench, Plus, Clock, ChevronRight } from 'lucide-react';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';

export const InicioCliente = () => {
  const { usuario } = useAutenticacion();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const res = await api.get('/solicitudes/mis-solicitudes');
        setSolicitudes(res.data.datos || []);
      } catch (error) {
        toast.error('Error al cargar solicitudes');
      } finally {
        setCargando(false);
      }
    };
    cargarSolicitudes();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">¡Hola, {usuario?.nombres}! 👋</h1>
        <p className="text-gray-500">¿Qué vamos a arreglar hoy?</p>
      </div>

      {/* Botón principal */}
      <button
        onClick={() => navigate('/cliente/nueva-solicitud')}
        className="w-full bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-3xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Plus size={32} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Arregla tu electrodoméstico</h2>
            <p className="text-blue-100 text-sm mt-1">Habla con nuestra IA y solicita un técnico</p>
          </div>
        </div>
        <Wrench size={36} className="opacity-20" />
      </button>

      {/* Historial reciente */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Solicitudes recientes</h2>
          <button onClick={() => navigate('/cliente/servicios')} className="text-sm text-blue-600 font-medium hover:underline flex items-center">
            Ver todas <ChevronRight size={16} />
          </button>
        </div>

        {cargando ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center border border-gray-100 shadow-sm">
            <Clock size={48} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">No tienes solicitudes aún</p>
            <p className="text-sm text-gray-400 mt-1">¡Anímate a pedir tu primer servicio!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitudes.slice(0, 3).map((sol) => (
              <div
                key={sol.idSolicitud}
                onClick={() => navigate(`/cliente/solicitud/${sol.idSolicitud}`)}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 cursor-pointer transition flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition">
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{sol.descripcionProblema}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{sol.direccionServicio}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs font-bold px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-full">
                    {ESTADOS_SOLICITUD[sol.estado] || sol.estado}
                  </span>
                  <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};