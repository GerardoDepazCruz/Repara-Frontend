import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import toast from 'react-hot-toast';
import { Send, ArrowLeft, MoreVertical } from 'lucide-react';

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
    } catch (error) { console.log(error); }
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
      await api.post('/chat/enviar', { idSolicitud: parseInt(id), mensaje: input, tipoMensaje: 'TEXTO' });
      setInput('');
      cargarMensajes();
    } catch (error) { toast.error('Error al enviar mensaje'); }
  };

  return (
    <div className="max-w-2xl mx-auto h-[85vh] flex flex-col bg-white md:rounded-3xl md:shadow-xl md:border md:border-gray-200 overflow-hidden mt-0 md:mt-6">
      {/* Cabecera del Chat */}
      <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(!esCliente ? `/tecnico/solicitud/${id}` : `/cliente/solicitud/${id}`)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                {esCliente ? 'T' : 'C'}
            </div>
            <div>
                <h2 className="font-bold text-gray-800 text-sm">Solicitud #{id}</h2>
                <p className="text-xs text-green-500 font-medium">En línea</p>
            </div>
          </div>
        </div>
        {!esCliente && (
          <button onClick={() => navigate(`/tecnico/solicitud/${id}`)} className="text-xs bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold hover:bg-blue-100 transition">
            Ingresar PIN
          </button>
        )}
      </div>

      {/* Área de Mensajes */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8fafc]">
        {mensajes.map((msg, index) => {
          let esMio = false;
          if (msg.emisor && msg.emisor.idUsuario) {
            esMio = Number(msg.emisor.idUsuario) === Number(usuario?.idUsuario);
          } else {
            const fueEnviadoPorCliente = index % 2 === 0; 
            esMio = (esCliente && fueEnviadoPorCliente) || (!esCliente && !fueEnviadoPorCliente);
          }
          
          return (
            <div key={msg.idMensaje} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3.5 px-4 rounded-2xl shadow-sm text-sm ${
                esMio 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.mensaje}
              </div>
            </div>
          );
        })}
        <div ref={finalRef} />
      </div>

      {/* Caja de Texto */}
      <form onSubmit={enviarMensaje} className="p-4 bg-white border-t border-gray-100 flex gap-3 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
        <button type="submit" disabled={!input.trim()} className={`p-3.5 rounded-full text-white shadow-md transition ${input.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'}`}>
          <Send size={20} className={input.trim() ? 'translate-x-0.5' : ''} />
        </button>
      </form>
    </div>
  );
};