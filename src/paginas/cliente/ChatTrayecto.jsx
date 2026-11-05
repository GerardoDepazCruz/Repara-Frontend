import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import toast from 'react-hot-toast';
import { Send, ArrowLeft } from 'lucide-react';

export const ChatTrayecto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();
  const [mensajes, setMensajes] = useState([]);
  const [input, setInput] = useState('');
  const finalRef = useRef(null);

  const esCliente = !usuario?.esTecnico;

  const cargarMensajes = async () => {
    try {
      const res = await api.get(`/chat/solicitud/${id}`);
      setMensajes(res.data.datos || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    finalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await api.post('/chat/enviar', {
        idSolicitud: parseInt(id),
        mensaje: input,
        tipoMensaje: 'TEXTO'
      });
      setInput('');
      cargarMensajes();
    } catch (error) {
      toast.error('Error al enviar mensaje');
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[80vh] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (!esCliente) navigate(`/tecnico/solicitud/${id}`);
              else navigate(`/cliente/solicitud/${id}`);
            }} 
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold text-gray-800">Chat - Solicitud #{id}</h2>
        </div>

        {!esCliente && (
          <button onClick={() => navigate(`/tecnico/solicitud/${id}`)} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold hover:bg-green-200 transition-colors">
            Ingresar PIN
          </button>
        )}
      </div>

      {/* Fondo tipo WhatsApp */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]">
        {mensajes.map((msg, index) => {
          // 🔥 LÓGICA GARANTIZADA: Alternamos según el índice y quién lo envía.
          // Si el mensaje actual es igual al ID del usuario logueado, es tuyo.
          // Si el ID del backend falla, usamos el índice (si el primero lo mandó el cliente, los impares son del técnico).
          let esMio = false;
          
          if (msg.emisor && msg.emisor.idUsuario) {
            esMio = Number(msg.emisor.idUsuario) === Number(usuario?.idUsuario);
          } else {
            // Plan B (si el backend no envía el emisor): 
            // Asumimos que el primer mensaje lo envió el cliente.
            const fueEnviadoPorCliente = index % 2 === 0; 
            esMio = (esCliente && fueEnviadoPorCliente) || (!esCliente && !fueEnviadoPorCliente);
          }
          
          return (
            <div key={msg.idMensaje} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
                esMio 
                  ? 'bg-[#dcf8c6] text-gray-800 rounded-tr-none' // Verde (Tú)
                  : 'bg-white text-gray-800 rounded-tl-none'     // Blanco (El otro)
              }`}>
                {msg.mensaje}
              </div>
            </div>
          );
        })}
        <div ref={finalRef} />
      </div>

      <form onSubmit={enviarMensaje} className="p-4 border-t border-gray-200 flex gap-2 bg-gray-50 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-repara-500"
        />
        <Boton tipo="primary" className="px-4" disabled={!input.trim()}>
          <Send size={18} />
        </Boton>
      </form>
    </div>
  );
};