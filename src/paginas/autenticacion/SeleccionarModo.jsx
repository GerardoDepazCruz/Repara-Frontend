import { useNavigate } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Wrench, User } from 'lucide-react';

export const SeleccionarModo = () => {
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();

  return (
    <div className="min-h-screen flex items-center justify-center bg-repara-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Hola, {usuario?.nombres}!</h1>
        <p className="text-gray-500 mb-8">¿Cómo deseas ingresar hoy?</p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate('/cliente')}
            className="p-6 bg-blue-50 border-2 border-blue-200 rounded-xl hover:border-repara-500 hover:bg-repara-50 transition flex flex-col items-center gap-3 group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-repara-100 group-hover:text-repara-600 transition">
              <User size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Modo Cliente</h3>
              <p className="text-sm text-gray-500">Solicitar un servicio técnico</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/tecnico')}
            className="p-6 bg-green-50 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-100 transition flex flex-col items-center gap-3 group"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
              <Wrench size={32} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Modo Técnico</h3>
              <p className="text-sm text-gray-500">Atender solicitudes pendientes</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};