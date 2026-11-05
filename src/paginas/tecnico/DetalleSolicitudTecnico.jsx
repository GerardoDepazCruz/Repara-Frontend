import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { KeyRound, MessageCircle, FileText, CheckCircle, Clock, Wrench } from 'lucide-react';

export const DetalleSolicitudTecnico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [paso, setPaso] = useState('inicio');

  // 🔥 EFECTO DE POLLING: Revisa el estado cada 3 segundos
  useEffect(() => {
    const revisarEstado = async () => {
      try {
        // Usamos el endpoint GET /solicitudes/{id}
        const res = await api.get(`/solicitudes/${id}`);
        const sol = res.data.datos;
        
        // Dependiendo del estado en la base de datos, actualizamos la vista
        if (sol.estado === 'ACEPTADA' || sol.estado === 'EN_CAMINO') {
          setPaso('inicio');
        } else if (sol.estado === 'EN_DIAGNOSTICO') {
          setPaso('diagnostico');
        } else if (sol.estado === 'PAGO_FINAL_PENDIENTE') {
          setPaso('esperando_pago');
        } else if (sol.estado === 'REPARACION_EN_PROCESO') {
          setPaso('reparando');
        }
      } catch (error) {
        console.log("Error al consultar estado", error);
      }
    };

    // Ejecutamos al entrar
    revisarEstado();

    // Y luego cada 3 segundos hasta que se desmonte el componente
    const interval = setInterval(revisarEstado, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const verificarPin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/pin/verificar', { idSolicitud: parseInt(id), pin });
      toast.success('¡PIN verificado! Iniciando diagnóstico.');
      setPaso('diagnostico');
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'PIN incorrecto');
    }
  };

  const finalizarTrabajo = async () => {
    // 🔥 REPREGUNTA DE SEGURIDAD
    const confirmar = window.confirm("¿Estás seguro de que el servicio se culminó con éxito? Esta acción notificará al cliente.");
    if (!confirmar) return;

    try {
      await api.post(`/solicitudes/${id}/estado`, { estado: 'COMPLETADO', comentario: 'Reparación finalizada por el técnico' });
      toast.success('¡Servicio finalizado con éxito!');
      navigate('/tecnico'); // Volvemos al inicio para esperar nuevas solicitudes
    } catch (error) {
      toast.error('Error al finalizar');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        
        {/* VISTA 1: TRAYECTO */}
        {paso === 'inicio' && (
          <div className="text-center space-y-4">
            <h1 className="text-xl font-bold text-gray-800 mb-2">Solicitud Aceptada</h1>
            <p className="text-gray-500 mb-6">Estás en camino. Puedes comunicarte con el cliente o avisar que llegaste poniendo el PIN.</p>
            <Boton tipo="secondary" className="w-full py-3 flex justify-center items-center gap-2" onClick={() => navigate(`/chat/${id}`)}>
              <MessageCircle size={20} /> Chatear con el Cliente
            </Boton>
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">¿Ya llegaste al domicilio?</p>
              <form onSubmit={verificarPin} className="space-y-3">
                <input type="text" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full text-center text-3xl tracking-[1em] font-mono px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-repara-500" placeholder="0000" />
                <Boton tipo="primary" className="w-full py-3 flex justify-center items-center gap-2" disabled={pin.length !== 4}>
                  <KeyRound size={20} /> Ingresar PIN
                </Boton>
              </form>
            </div>
          </div>
        )}

        {/* VISTA 2: DIAGNÓSTICO */}
        {paso === 'diagnostico' && (
          <div className="text-center space-y-4">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Servicio Iniciado</h1>
            <p className="text-gray-500 mb-6">Revisa el electrodoméstico. Genera el informe para que el cliente realice el pago.</p>
            <Boton tipo="success" className="w-full py-3 flex justify-center items-center gap-2" onClick={() => navigate(`/tecnico/informe/${id}`)}>
              <FileText size={20} /> Generar Informe y Cobro
            </Boton>
          </div>
        )}

        {/* VISTA 3: ESPERANDO QUE EL CLIENTE PAGUE */}
        {paso === 'esperando_pago' && (
          <div className="text-center space-y-4">
            <Clock size={48} className="text-yellow-500 mx-auto animate-spin mb-2" />
            <h1 className="text-xl font-bold text-gray-800">Esperando Pago del Cliente</h1>
            <p className="text-gray-500 mb-6">Has enviado el informe. El cliente está revisando el presupuesto. Espera a que realice el pago...</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
               No cierres esta ventana. Se actualizará automáticamente cuando el cliente pague.
            </div>
          </div>
        )}

        {/* VISTA 4: REPARANDO (El cliente YA PAGÓ) */}
        {paso === 'reparando' && (
          <div className="text-center space-y-4">
             <Wrench size={48} className="text-repara-600 mx-auto mb-2 animate-bounce" />
             <h1 className="text-xl font-bold text-gray-800">¡Pago Recibido!</h1>
             <p className="text-gray-500 mb-6">Realiza la reparación del electrodoméstico. Cuando termines, presiona el botón de abajo.</p>
             
             <div className="border-t pt-6">
               <Boton tipo="success" className="w-full py-4 text-lg font-bold" onClick={finalizarTrabajo}>
                  ¡Servicio Terminado!
               </Boton>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};