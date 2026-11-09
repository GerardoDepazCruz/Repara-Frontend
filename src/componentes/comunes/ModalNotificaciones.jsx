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

  // 🔥 FORMATEAR FECHA
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '';
    const fecha = new Date(fechaString);
    return fecha.toLocaleString('es-PE', { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!mostrar || notificaciones.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-6 text-repara-600">
          <div className="p-2 bg-blue-50 rounded-full">
            <Bell size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Tienes nuevas notificaciones</h2>
        </div>
        
        <div className="space-y-4 max-h-72 overflow-y-auto mb-6 pr-2">
          {notificaciones.map((noti, index) => (
            <div key={noti.idNotificacion || index} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 relative">
              
              {/* 🔥 FECHA EN LA ESQUINA */}
              <span className="absolute top-3 right-3 text-[10px] font-semibold text-blue-400 bg-blue-100/50 px-2 py-0.5 rounded-full">
                {formatearFecha(noti.fechaEnvio)}
              </span>

              <h3 className="font-bold text-gray-800 mb-2 pr-16 text-sm">
                {noti.asunto || "Notificación"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {noti.mensaje || "Sin contenido"}
              </p>
            </div>
          ))}
        </div>

        <Boton tipo="primary" className="w-full py-3 rounded-xl shadow-lg shadow-blue-500/30" onClick={cerrarModal}>
          Okey, entendido
        </Boton>
      </div>
    </div>
  );
};