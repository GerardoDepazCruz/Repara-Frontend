import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import toast from 'react-hot-toast';

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

  if (cargando) return <p className="text-center py-10">Cargando...</p>;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h1>
      
      {/* VISTA PC (Tabla) */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Correo</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((u) => (
              <tr key={u.idUsuario} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{u.nombres} {u.apellidos}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{u.correo}</td>
                <td className="px-4 py-3 text-sm">{u.esTecnico ? 'Técnico' : u.rol}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${u.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
          <div key={u.idUsuario} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-gray-800">{u.nombres} {u.apellidos}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded ${u.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {u.estado}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Correo:</span> {u.correo}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">Rol:</span> {u.esTecnico ? 'Técnico' : u.rol}</p>
          </div>
        ))}
      </div>
    </div>
  );
};