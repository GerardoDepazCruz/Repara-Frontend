import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import api from '../../servicios/api';
import { Wrench, Plus, Clock } from 'lucide-react';
import { Boton } from '../../componentes/comunes/Boton';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';

export const InicioCliente = () => {
  const { usuario } = useAutenticacion();
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSolicitudes();
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Saludo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">¡Hola, {usuario?.nombres}! 👋</h1>
        <p className="text-gray-500">¿Qué vamos a arreglar hoy?</p>
      </div>

      {/* Botón principal */}
      <button
        onClick={() => navigate('/cliente/nueva-solicitud')}
        className="w-full bg-gradient-to-r from-repara-600 to-blue-500 hover:from-repara-700 hover:to-blue-600 text-white p-6 rounded-2xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Plus size={28} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Arregla tu electrodoméstico</h2>
            <p className="text-blue-100 text-sm">Habla con nuestra IA y solicita un técnico</p>
          </div>
        </div>
        <Wrench size={32} className="opacity-50" />
      </button>

      {/* Historial reciente */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Solicitudes recientes</h2>
        {cargando ? (
          <p className="text-gray-500">Cargando...</p>
        ) : solicitudes.length === 0 ? (
          <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
            <Clock size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No tienes solicitudes aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitudes.slice(0, 3).map((sol) => (
              <div
                key={sol.idSolicitud}
                onClick={() => navigate(`/cliente/solicitud/${sol.idSolicitud}`)}
                className="bg-white p-4 rounded-xl border border-gray-200 hover:border-repara-300 cursor-pointer transition flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{sol.descripcionProblema}</h3>
                  <p className="text-sm text-gray-500">{sol.direccionServicio}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  {ESTADOS_SOLICITUD[sol.estado] || sol.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};