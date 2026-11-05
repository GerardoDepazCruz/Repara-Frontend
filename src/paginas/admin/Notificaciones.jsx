import { useState } from 'react';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export const Notificaciones = () => {
  const [formData, setFormData] = useState({ asunto: '', mensaje: '', tipo: 'TODOS' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post('/admin/notificar', formData);
      toast.success('Notificación enviada correctamente');
      setFormData({ asunto: '', mensaje: '', tipo: 'TODOS' });
    } catch (error) {
      toast.error('Error al enviar notificación');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Enviar Notificación</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destinatarios</label>
          <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none">
            <option value="TODOS">Todos</option>
            <option value="TODOS_CLIENTES">Solo Clientes</option>
            <option value="TODOS_TECNICOS">Solo Técnicos</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
          <input type="text" value={formData.asunto} onChange={(e) => setFormData({...formData, asunto: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
          <textarea value={formData.mensaje} onChange={(e) => setFormData({...formData, mensaje: e.target.value})} required rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none" />
        </div>
        <Boton tipo="primary" className="w-full py-3 flex justify-center items-center gap-2" disabled={cargando}>
          <Send size={18} /> {cargando ? 'Enviando...' : 'Enviar Notificación'}
        </Boton>
      </form>
    </div>
  );
};