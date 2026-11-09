import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { KeyRound, MessageCircle, FileText, CheckCircle, Clock, Wrench } from 'lucide-react';
import Swal from 'sweetalert2';

export const DetalleSolicitudTecnico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [paso, setPaso] = useState('inicio');

  useEffect(() => {
    const revisarEstado = async () => {
      try {
        const res = await api.get(`/solicitudes/${id}`);
        const sol = res.data.datos;
        
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

    revisarEstado();
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
    // 🔥 REEMPLAZAMOS EL WINDOW.CONFIRM POR SWEETALERT
    const result = await Swal.fire({
      title: '¿Finalizar Servicio?',
      text: '¿Estás seguro de que el servicio se culminó con éxito? Esta acción notificará al cliente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#16a34a', // Verde
      cancelButtonColor: '#9ca3af', // Gris
      confirmButtonText: 'Sí, terminado',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    // Si el usuario cancela, detenemos la función
    if (!result.isConfirmed) return;

    try {
      await api.post(`/solicitudes/${id}/estado`, { estado: 'COMPLETADO', comentario: 'Reparación finalizada por el técnico' });
      
      // Notificación de éxito bonita
      Swal.fire({
        icon: 'success',
        title: '¡Servicio Finalizado!',
        text: 'El cliente ha sido notificado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/tecnico'); 
    } catch (error) {
      Swal.fire('Error', 'No se pudo finalizar el servicio', 'error');
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* VISTA 1: TRAYECTO */}
        {paso === 'inicio' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <KeyRound size={40} className="text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Solicitud Aceptada</h1>
            <p className="text-gray-500 mb-8">Estás en camino. Puedes chatear con el cliente o avisar que llegaste poniendo el PIN.</p>
            
            <Boton tipo="secondary" className="w-full py-4 text-lg rounded-xl flex justify-center items-center gap-2 mb-6" onClick={() => navigate(`/chat/${id}`)}>
              <MessageCircle size={22} /> Chatear con el Cliente
            </Boton>
            
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-bold text-gray-700 mb-3">¿Ya llegaste al domicilio?</p>
              <form onSubmit={verificarPin} className="space-y-4">
                <input type="text" maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full text-center text-4xl tracking-[1em] font-mono px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="0000" />
                <Boton tipo="primary" className="w-full py-4 text-lg rounded-xl shadow-lg flex justify-center items-center gap-2" disabled={pin.length !== 4}>
                  <KeyRound size={22} /> Ingresar PIN
                </Boton>
              </form>
            </div>
          </div>
        )}

        {/* VISTA 2: DIAGNÓSTICO */}
        {paso === 'diagnostico' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Servicio Iniciado</h1>
            <p className="text-gray-500 mb-8">Revisa el electrodoméstico. Genera el informe con el costo para que el cliente realice el pago.</p>
            
            <Boton tipo="success" className="w-full py-4 text-lg rounded-xl shadow-lg shadow-green-500/30 flex justify-center items-center gap-2" onClick={() => navigate(`/tecnico/informe/${id}`)}>
              <FileText size={22} /> Generar Informe y Cobro
            </Boton>
          </div>
        )}

        {/* VISTA 3: ESPERANDO QUE EL CLIENTE PAGUE */}
        {paso === 'esperando_pago' && (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={40} className="text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Esperando Pago</h1>
            <p className="text-gray-500 mb-8">Has enviado el informe. El cliente está revisando el presupuesto. Espera a que realice el pago...</p>
            
            <div className="bg-gray-50 p-5 rounded-2xl text-sm font-medium text-gray-600 border border-gray-200">
               No cierres esta ventana. Se actualizará automáticamente cuando el cliente pague.
            </div>
          </div>
        )}

        {/* VISTA 4: REPARANDO */}
        {paso === 'reparando' && (
          <div className="text-center">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench size={40} className="text-blue-600 animate-bounce" />
             </div>
             <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Recibido!</h1>
             <p className="text-gray-500 mb-8">Realiza la reparación del electrodoméstico. Cuando termines, presiona el botón de abajo.</p>
             
             <div className="border-t border-gray-100 pt-6">
               <Boton tipo="success" className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-green-500/30" onClick={finalizarTrabajo}>
                  ¡Servicio Terminado!
               </Boton>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};