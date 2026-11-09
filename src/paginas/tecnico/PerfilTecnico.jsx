import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Wrench, Mail, Phone, User, CheckCircle } from 'lucide-react';

export const PerfilTecnico = () => {
  const { usuario } = useAutenticacion();

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 text-green-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            {usuario?.nombres?.[0]}{usuario?.apellidos?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{usuario?.nombres} {usuario?.apellidos}</h2>
            <p className="text-sm font-bold text-green-600 flex items-center gap-1 mt-1 bg-green-50 px-3 py-1 rounded-full w-fit">
              <CheckCircle size={16} /> Técnico Verificado
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Mail size={20}/></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Correo</p>
              <p className="font-semibold text-gray-800">{usuario?.correo}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Wrench size={20}/></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Rol</p>
              <p className="font-semibold text-gray-800">Técnico Especialista</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};