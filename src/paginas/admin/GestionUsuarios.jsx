import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';

export const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/admin/usuarios');
        setUsuarios(res.data.datos || []);
      } catch (error) {
        toast.error('Error al cargar usuarios');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="py-6 px-4 md:px-0">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
      
      {/* VISTA PC (Tabla) */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usuarios.map((u) => (
              <tr key={u.idUsuario} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                            {u.nombres?.[0]}{u.apellidos?.[0]}
                        </div>
                        <span className="font-semibold text-gray-800">{u.nombres} {u.apellidos}</span>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.correo}</td>
                <td className="px-6 py-4">
                    <span className="text-sm font-medium px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                        {u.esTecnico ? 'Técnico' : u.rol}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${u.estado === 'ACTIVO' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {u.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL (Tarjetas) */}
      <div className="md:hidden space-y-4">
        {usuarios.map((u) => (
          <div key={u.idUsuario} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {u.nombres?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{u.nombres} {u.apellidos}</h3>
                    <p className="text-xs text-gray-500">{u.correo}</p>
                  </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
                    {u.esTecnico ? 'Técnico' : u.rol}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${u.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.estado}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};