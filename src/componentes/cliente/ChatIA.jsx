import { useState } from 'react';
import api from '../../servicios/api';
import { Boton } from '../comunes/Boton';
import { Send } from 'lucide-react';

export const ChatIA = ({ onSolicitudCreada }) => {
  const [mensajes, setMensajes] = useState([
    { emisor: 'IA', texto: '¡Hola! Soy tu asistente de RePara. Cuéntame, ¿qué electrodoméstico tienes y qué le pasa?' }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const nuevoMensaje = { emisor: 'CLIENTE', texto: input };
    setMensajes([...mensajes, nuevoMensaje]);
    setInput('');
    setCargando(true);

    try {
      const res = await api.post('/ia/chat', { mensaje: input });
      const respuestaIA = res.data.datos.respuesta;
      setMensajes((prev) => [...prev, { emisor: 'IA', texto: respuestaIA }]);
    } catch (error) {
      setMensajes((prev) => [...prev, { emisor: 'IA', texto: 'Lo siento, tuve un problema al procesar tu mensaje. Intenta de nuevo.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {mensajes.map((msg, i) => (
          <div key={i} className={`flex ${msg.emisor === 'CLIENTE' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${
              msg.emisor === 'CLIENTE' 
                ? 'bg-repara-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
            }`}>
              {msg.texto}
            </div>
          </div>
        ))}
        {cargando && <div className="text-sm text-gray-500 animate-pulse">La IA está escribiendo...</div>}
      </div>

      <form onSubmit={enviarMensaje} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe el problema..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-repara-500"
        />
        <Boton tipo="primary" className="px-4" disabled={cargando || !input.trim()}>
          <Send size={18} />
        </Boton>
      </form>
      
      {/* Botón temporal para simular que la IA ya terminó de recolectar datos */}
      <div className="p-2 bg-blue-50 text-center border-t border-blue-100">
        <button onClick={onSolicitudCreada} className="text-xs text-blue-600 hover:underline">
          (Simular que la IA terminó y crear la solicitud)
        </button>
      </div>
    </div>
  );
};