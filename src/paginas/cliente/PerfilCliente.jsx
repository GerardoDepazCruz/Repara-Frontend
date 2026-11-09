import { useState, useEffect } from 'react';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Mail, Phone, CreditCard, Edit, User } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../servicios/api';

const MySwal = withReactContent(Swal);

export const PerfilCliente = () => {
  const { usuario, setUsuario } = useAutenticacion();
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await api.get('/usuarios/perfil');
        setPerfil(res.data.datos);
      } catch (error) {}
    };
    cargarPerfil();
  }, []);

  const handleEditar = async () => {
    const { value: formValues } = await MySwal.fire({
      title: 'Editar Perfil',
      width: '600px',
      html: `
        <div class="flex flex-col gap-4 px-2 py-4 text-left w-full">
          <div class="flex flex-col w-full"><label class="text-sm font-bold text-gray-700 mb-1">Nombres</label><input id="swal-nombres" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800" value="${perfil?.nombres || ''}"></div>
          <div class="flex flex-col w-full"><label class="text-sm font-bold text-gray-700 mb-1">Apellidos</label><input id="swal-apellidos" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800" value="${perfil?.apellidos || ''}"></div>
          <div class="flex flex-col w-full"><label class="text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label><input id="swal-correo" type="email" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800" value="${perfil?.correo || ''}"></div>
          <div class="flex flex-col w-full"><label class="text-sm font-bold text-gray-700 mb-1">Teléfono</label><input id="swal-telefono" class="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-800" value="${perfil?.telefono || ''}"></div>
        </div>
      `,
      focusConfirm: false, showCancelButton: true, confirmButtonText: 'Guardar Cambios', cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors mx-2',
        cancelButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2.5 px-6 rounded-xl transition-colors mx-2',
        popup: 'rounded-3xl shadow-2xl'
      },
      preConfirm: () => ({
          nombres: document.getElementById('swal-nombres').value, apellidos: document.getElementById('swal-apellidos').value,
          correo: document.getElementById('swal-correo').value, telefono: document.getElementById('swal-telefono').value
      })
    });

    if (formValues) {
      try {
        const res = await api.put('/usuarios/perfil', formValues);
        const usuarioActualizado = res.data.datos;
        setPerfil(usuarioActualizado);
        const nuevoUsuario = { ...usuario, ...usuarioActualizado };
        setUsuario(nuevoUsuario);
        sessionStorage.setItem('repara_usuario', JSON.stringify(nuevoUsuario));
        MySwal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Tus datos se guardaron.', timer: 2000, showConfirmButton: false });
      } catch (error) {
        MySwal.fire('Error', error.response?.data?.mensaje || 'Error al actualizar', 'error');
      }
    }
  };

  if (!perfil) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
            {perfil.nombres?.[0]}{perfil.apellidos?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{perfil.nombres} {perfil.apellidos}</h2>
            <p className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mt-2">{perfil.esTecnico ? 'Técnico verificado' : 'Cliente'}</p>
          </div>
          <button onClick={handleEditar} className="ml-auto p-3 bg-gray-50 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition">
            <Edit size={22} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Mail size={20}/></div>
            <div><p className="text-xs text-gray-500 font-medium">Correo</p><p className="font-semibold text-gray-800">{perfil.correo}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><Phone size={20}/></div>
            <div><p className="text-xs text-gray-500 font-medium">Teléfono</p><p className="font-semibold text-gray-800">{perfil.telefono || 'No registrado'}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><CreditCard size={20}/></div>
            <div><p className="text-xs text-gray-500 font-medium">DNI</p><p className="font-semibold text-gray-800">{perfil.dni || 'No registrado'}</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><User size={20}/></div>
            <div><p className="text-xs text-gray-500 font-medium">Rol</p><p className="font-semibold text-gray-800">{perfil.rol}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};