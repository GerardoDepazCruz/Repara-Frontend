import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import { Boton } from './Boton';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export const ModalNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const res = await api.get('/admin/mis-notificaciones');
        const noLeidas = res.data.datos.filter(n => !n.leida);
        if (noLeidas.length > 0) {
          setNotificaciones(noLeidas);
          setMostrar(true);
        }
      } catch (error) {
        console.log("Error al cargar notificaciones", error);
      }
    };

    const timer = setTimeout(cargarNotificaciones, 1500);
    return () => clearTimeout(timer);
  }, []);

  const cerrarModal = async () => {
    try {
      for (const noti of notificaciones) {
        await api.post(`/admin/notificaciones/${noti.idNotificacion}/leer`);
      }
      setMostrar(false);
      toast.success('Notificaciones marcadas como leídas');
    } catch (error) {
      console.log(error);
      setMostrar(false);
    }
  };

  if (!mostrar || notificaciones.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4 text-repara-600">
          <Bell size={28} />
          <h2 className="text-xl font-bold text-gray-800">¡Tienes nuevas notificaciones!</h2>
        </div>
        
        <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
          {notificaciones.map((noti, index) => (
            // 🔥 Arreglado el key para que no salga el error en consola
            <div key={noti.idNotificacion || index} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-1">
                {noti.asunto || "Notificación"}
              </h3>
              <p className="text-sm text-gray-600">
                {noti.mensaje || "Sin contenido"}
              </p>
            </div>
          ))}
        </div>

        <Boton tipo="primary" className="w-full py-3" onClick={cerrarModal}>
          Okey, entendido
        </Boton>
      </div>
    </div>
  );
};