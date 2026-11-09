import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, MapPin, FileText, Star, MessageCircle } from 'lucide-react';
import { generarCertificadoPdf } from '../../utilidades/generarPdf';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import Swal from 'sweetalert2';

export const DetalleSolicitud = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState(null);
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [pagoFinalProcesando, setPagoFinalProcesando] = useState(false);
    const [calificado, setCalificado] = useState(false);
    
    // Usamos solo una variable para el usuario
    const { usuario: usuarioLogueado } = useAutenticacion();

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get('/solicitudes/mis-solicitudes');
                const encontrada = res.data.datos.find(s => s.idSolicitud === parseInt(id));
                setSolicitud(encontrada);
            } catch (error) {
                toast.error('Error al cargar');
            }
        };
        cargar();
        const interval = setInterval(cargar, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (!solicitud) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );

    const handlePagar = async () => {
        const { value: metodo } = await Swal.fire({
            title: 'Selecciona un método de pago',
            html: `
                <div class="flex flex-col gap-3 mt-4">
                    <button id="btn-yape" class="flex items-center justify-center gap-3 p-3 border rounded-xl hover:bg-purple-50 hover:border-purple-300 transition">
                        <span class="text-2xl">📱</span> <span class="font-bold text-gray-700">Yape</span>
                    </button>
                    <button id="btn-plin" class="flex items-center justify-center gap-3 p-3 border rounded-xl hover:bg-cyan-50 hover:border-cyan-300 transition">
                        <span class="text-2xl">💳</span> <span class="font-bold text-gray-700">Plin</span>
                    </button>
                    <button id="btn-tarjeta" class="flex items-center justify-center gap-3 p-3 border rounded-xl hover:bg-blue-50 hover:border-blue-300 transition">
                        <span class="text-2xl">🏦</span> <span class="font-bold text-gray-700">Tarjeta</span>
                    </button>
                </div>
            `,
            showConfirmButton: false,
            didOpen: () => {
                const pagarCon = async (idMetodo, nombre) => {
                    Swal.close();
                    setProcesandoPago(true);
                    try {
                        await api.post(`/pagos/inicial/${id}`, {
                            idMetodoPago: idMetodo,
                            numeroOperacion: `SIMULADO-${nombre}-` + Date.now()
                        });
                        Swal.fire('¡Pago exitoso!', `Pagaste con ${nombre}`, 'success');
                        const res = await api.get('/solicitudes/mis-solicitudes');
                        setSolicitud(res.data.datos.find(s => s.idSolicitud === parseInt(id)));
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo procesar el pago', 'error');
                    } finally {
                        setProcesandoPago(false);
                    }
                };
                document.getElementById('btn-yape').addEventListener('click', () => pagarCon(1, 'Yape'));
                document.getElementById('btn-plin').addEventListener('click', () => pagarCon(2, 'Plin'));
                document.getElementById('btn-tarjeta').addEventListener('click', () => pagarCon(3, 'Tarjeta'));
            }
        });
    };

    const handlePagarFinal = async () => {
        setPagoFinalProcesando(true);
        try {
            await api.post(`/pagos/final/${id}`, {
                idMetodoPago: 1,
                numeroOperacion: "SIMULADO-FINAL-" + Date.now(),
                monto: solicitud.informe?.manoObraCosto || 100
            });
            toast.success('¡Pago final realizado! El técnico comenzará la reparación.');
            const res = await api.get('/solicitudes/mis-solicitudes');
            setSolicitud(res.data.datos.find(s => s.idSolicitud === parseInt(id)));
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al procesar el pago');
        } finally {
            setPagoFinalProcesando(false);
        }
    };

    const handleCancelar = async () => {
        try {
            await api.post(`/solicitudes/${id}/estado`, { 
                estado: 'CANCELADO', 
                comentario: 'Cliente rechazó el presupuesto' 
            });
            toast.success('Servicio cancelado');
            const res = await api.get('/solicitudes/mis-solicitudes');
            setSolicitud(res.data.datos.find(s => s.idSolicitud === parseInt(id)));
        } catch (error) {
            toast.error('Error al cancelar');
        }
    };

    const handleCalificar = async (puntuacion) => {
        try {
            await api.post(`/solicitudes/${id}/calificar`, {
                puntuacion,
                comentario: "Servicio excelente"
            });
            toast.success(`¡Gracias por calificar con ${puntuacion} estrellas!`);
            setCalificado(true);
        } catch (error) {
            toast.error('Error al calificar');
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6 px-4">
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
                
                <span className="inline-block bg-blue-50 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-100">
                    {ESTADOS_SOLICITUD[solicitud.estado] || solicitud.estado}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Solicitud #{solicitud.idSolicitud}</h1>

                {solicitud.estado === 'PENDIENTE_ASIGNACION' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Clock size={40} className="text-blue-500 animate-pulse" />
                        </div>
                        <p className="text-gray-700 font-medium text-lg">Buscando técnico...</p>
                        <p className="text-sm text-gray-400 mt-2 max-w-xs mx-auto">Por favor, mantén esta ventana abierta. Te avisaremos pronto.</p>
                    </div>
                )}

                {solicitud.estado === 'ACEPTADA' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">¡Técnico asignado!</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Para asegurar su visita, realiza el pago por adelantado del traslado (S/ 20.00).</p>
                        <Boton tipo="primary" className="w-full py-4 text-lg rounded-xl shadow-lg" onClick={handlePagar} disabled={procesandoPago}>
                            {procesandoPago ? 'Procesando...' : 'Pagar S/ 20.00'}
                        </Boton>
                    </div>
                )}

                {solicitud.estado === 'EN_CAMINO' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <MapPin size={40} className="text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">¡El técnico está en camino!</h2>
                        <p className="text-gray-500 mb-6">Puedes chatear con él mientras llega.</p>
                        
                        <div className="bg-gray-50 p-6 rounded-2xl w-full mb-6 border border-gray-200 shadow-inner">
                            <p className="text-sm font-medium text-gray-500 mb-2">Tu PIN de seguridad es:</p>
                            <p className="text-5xl font-mono font-bold tracking-widest text-blue-600">
                                <ObtenerPin idSolicitud={id} />
                            </p>
                        </div>
                        <Boton tipo="primary" className="w-full py-4 text-lg rounded-xl shadow-lg flex items-center justify-center gap-2" onClick={() => navigate(`/chat/${id}`)}>
                            <MessageCircle size={20}/> Abrir Chat
                        </Boton>
                    </div>
                )}

                {solicitud.estado === 'PAGO_FINAL_PENDIENTE' && (
                    <div className="flex flex-col items-center py-4 text-left">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <FileText size={40} className="text-yellow-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 text-center">Presupuesto Generado</h2>
                        <p className="text-gray-500 mb-6 text-center">Revisa el informe del técnico y realiza el pago para que inicie el trabajo.</p>
                        
                        <div className="bg-white p-5 rounded-2xl w-full border border-gray-200 mb-6 shadow-sm">
                            <ObtenerInforme idSolicitud={id} />
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-3 w-full">
                            <Boton tipo="success" className="flex-1 py-4 text-lg rounded-xl shadow-lg" onClick={handlePagarFinal} disabled={pagoFinalProcesando}>
                                {pagoFinalProcesando ? 'Procesando...' : 'Pagar Reparación'}
                            </Boton>
                            <Boton tipo="danger" className="flex-1 py-4 text-lg rounded-xl" onClick={handleCancelar}>
                                Cancelar
                            </Boton>
                        </div>
                    </div>
                )}

                {solicitud.estado === 'REPARACION_EN_PROCESO' && (
                    <div className="flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
                            <Clock size={40} className="text-yellow-500 animate-spin" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Reparación en Proceso</h2>
                        <p className="text-gray-500 mt-2">El técnico está trabajando en tu electrodoméstico.</p>
                    </div>
                )}

                {solicitud.estado === 'COMPLETADO' && (
                    <div className="flex flex-col items-center text-left py-4">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">¡Servicio Finalizado!</h2>
                        
                        <div className="bg-gray-50 p-5 rounded-2xl w-full border border-gray-200 mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3 text-lg"><FileText size={20} /> Informe Técnico</h3>
                            <ObtenerInforme idSolicitud={id} />
                        </div>
                        
                        <div className="w-full text-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                            <p className="text-sm font-bold text-gray-700 mb-3">¿Cómo calificarías el servicio?</p>
                            <div className="flex justify-center gap-3 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} onClick={() => handleCalificar(star)} disabled={calificado} className={`text-yellow-400 hover:scale-125 transition-transform ${calificado ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <Star size={36} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                            {calificado && <p className="text-green-600 font-bold text-sm bg-green-50 py-2 rounded-lg">¡Gracias por tu calificación!</p>}
                            <p className="text-xs text-gray-400 mt-3 mb-2">Al calificar, recibirás tu certificado de garantía digital.</p>
                            
                            <ObtenerCertificado idSolicitud={id} solicitud={solicitud} usuario={usuarioLogueado} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 🔥 SUBCOMPONENTES (Sin cambios en su lógica interna)
const ObtenerPin = ({ idSolicitud }) => {
    const [pin, setPin] = useState('...');
    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get(`/pin/solicitud/${idSolicitud}`);
                setPin(res.data.datos.codigoPin);
            } catch (e) {
                setPin('----');
            }
        };
        cargar();
    }, [idSolicitud]);
    return <span>{pin}</span>;
};

const ObtenerInforme = ({ idSolicitud }) => {
    const [informe, setInforme] = useState(null);
    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get(`/informes/solicitud/${idSolicitud}`);
                setInforme(res.data.datos);
            } catch (e) { }
        };
        cargar();
    }, [idSolicitud]);

    if (!informe) return <p className="text-sm text-gray-500">Cargando informe...</p>;

    return (
        <div className="text-sm text-gray-700 space-y-2">
            <p><strong className="text-gray-900">Resumen:</strong> {informe.resumenTrabajo}</p>
            <p><strong className="text-gray-900">Mano de obra:</strong> S/ {informe.manoObraCosto}</p>
            {informe.repuestos?.length > 0 && (
                <div>
                    <strong className="text-gray-900">Repuestos:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        {informe.repuestos.map((r, i) => (
                            <li key={i}>{r.cantidad}x {r.nombreRepuesto} - S/ {r.costoTotal}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const ObtenerCertificado = ({ idSolicitud, solicitud, usuario }) => {
    const [certificado, setCertificado] = useState(null);
    const [nombreTecnico, setNombreTecnico] = useState('');

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get(`/solicitudes/${idSolicitud}/certificado`);
                setCertificado(res.data.datos);

                const resInforme = await api.get(`/informes/solicitud/${idSolicitud}`);
                if (resInforme.data.datos?.tecnico?.usuario) {
                    setNombreTecnico(`${resInforme.data.datos.tecnico.usuario.nombres} ${resInforme.data.datos.tecnico.usuario.apellidos}`);
                }
            } catch (e) {}
        };
        cargar();
    }, [idSolicitud]);

    if (!certificado) return null;

    return (
        <div className="mt-6 bg-green-50 p-5 rounded-2xl border border-green-200 text-center">
            <p className="text-green-800 font-bold mb-2 flex justify-center items-center gap-2 text-lg">
                <CheckCircle size={22} /> ¡Garantía Emitida!
            </p>
            <p className="text-sm text-gray-600 mb-1">Código: <span className="font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">{certificado.codigoCertificado}</span></p>
            <p className="text-sm text-gray-600 mb-4">Válido hasta: {certificado.fechaExpiracion}</p>
            <button 
                onClick={() => generarCertificadoPdf(solicitud, certificado, usuario, nombreTecnico)}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
            >
                <FileText size={18} /> Descargar Certificado PDF
            </button>
        </div>
    );
};