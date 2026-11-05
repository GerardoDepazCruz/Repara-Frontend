import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Wrench, Mail, Phone, Star } from 'lucide-react';

export const PerfilTecnico = () => {
  const { usuario } = useAutenticacion();

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil de Técnico</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold">
            {usuario?.nombres?.[0]}{usuario?.apellidos?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{usuario?.nombres} {usuario?.apellidos}</h2>
            <p className="text-sm text-green-600 flex items-center gap-1 font-medium">
              <Wrench size={14} /> Técnico Verificado
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Correo</p>
              <p className="font-medium text-gray-800">{usuario?.correo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-gray-400" size={20} />
            <div>
              <p className="text-xs text-gray-500">Teléfono</p>
              <p className="font-medium text-gray-800">{usuario?.telefono || 'No registrado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};