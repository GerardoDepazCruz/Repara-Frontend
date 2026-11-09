import { useState } from 'react';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Send, BellRing } from 'lucide-react';
import Swal from 'sweetalert2';

export const Notificaciones = () => {
  const [formData, setFormData] = useState({ asunto: '', mensaje: '', tipo: 'TODOS' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post('/admin/notificar', formData);
      
      Swal.fire({
        icon: 'success',
        title: '¡Enviado!',
        text: 'La notificación masiva ha sido enviada.',
        timer: 2000,
        showConfirmButton: false
      });
      
      setFormData({ asunto: '', mensaje: '', tipo: 'TODOS' });
    } catch (error) {
      toast.error('Error al enviar notificación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <BellRing size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Notificaciones Masivas</h1>
            <p className="text-sm text-gray-500">Envía alertas a los usuarios de la plataforma.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Destinatarios</label>
          <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none">
            <option value="TODOS">Todos los usuarios</option>
            <option value="TODOS_CLIENTES">Solo Clientes</option>
            <option value="TODOS_TECNICOS">Solo Técnicos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Asunto</label>
          <input type="text" value={formData.asunto} onChange={(e) => setFormData({...formData, asunto: e.target.value})} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Nueva actualización de la app" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
          <textarea value={formData.mensaje} onChange={(e) => setFormData({...formData, mensaje: e.target.value})} required rows="5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" placeholder="Escribe el contenido de la notificación aquí..." />
        </div>
        <Boton tipo="primary" className="w-full py-4 text-lg rounded-xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2" disabled={cargando}>
          <Send size={20} /> {cargando ? 'Enviando...' : 'Enviar Notificación'}
        </Boton>
      </form>
    </div>
  );
};