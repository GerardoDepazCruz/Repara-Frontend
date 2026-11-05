import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, MapPin, FileText, Star } from 'lucide-react';
import { generarCertificadoPdf } from '../../utilidades/generarPdf'; // 🔥 IMPORTAMOS LA FUNCIÓN
import { useAutenticacion } from '../../contextos/AutenticacionContexto';

export const DetalleSolicitud = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [solicitud, setSolicitud] = useState(null);
    const [procesandoPago, setProcesandoPago] = useState(false);
    const [pagoFinalProcesando, setPagoFinalProcesando] = useState(false);
    const [calificado, setCalificado] = useState(false);
    const { usuario } = useAutenticacion();
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

    if (!solicitud) return <p className="text-center py-10">Cargando solicitud...</p>;

    const handlePagar = async () => {
        setProcesandoPago(true);
        try {
            await api.post(`/pagos/inicial/${id}`, {
                idMetodoPago: 1,
                numeroOperacion: "SIMULADO-" + Date.now()
            });
            toast.success('¡Pago registrado con éxito!');
            const res = await api.get('/solicitudes/mis-solicitudes');
            setSolicitud(res.data.datos.find(s => s.idSolicitud === parseInt(id)));
        } catch (error) {
            toast.error(error.response?.data?.mensaje || 'Error al procesar el pago');
        } finally {
            setProcesandoPago(false);
        }
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
        <div className="max-w-2xl mx-auto py-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Solicitud #{solicitud.idSolicitud}</h1>
                <span className="inline-block bg-repara-100 text-repara-700 text-sm font-bold px-3 py-1 rounded-full mb-6">
                    {ESTADOS_SOLICITUD[solicitud.estado] || solicitud.estado}
                </span>

                {solicitud.estado === 'PENDIENTE_ASIGNACION' && (
                    <div className="flex flex-col items-center">
                        <Clock size={48} className="text-repara-500 animate-pulse mb-4" />
                        <p className="text-gray-600">Estamos buscando al mejor técnico para ti...</p>
                        <p className="text-sm text-gray-400 mt-2">Por favor, mantén esta ventana abierta.</p>
                    </div>
                )}

                {solicitud.estado === 'ACEPTADA' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle size={48} className="text-green-500 mb-4" />
                        <h2 className="text-lg font-bold text-gray-800">¡Un técnico aceptó tu solicitud!</h2>
                        <p className="text-gray-600 mb-6">Para asegurar su visita, realiza el pago por adelantado (S/ 20.00).</p>
                        <Boton tipo="primary" className="w-full py-3" onClick={handlePagar} disabled={procesandoPago}>
                            {procesandoPago ? 'Procesando pago...' : 'Pagar S/ 20.00 (Yape/Plin)'}
                        </Boton>
                    </div>
                )}

                {solicitud.estado === 'EN_CAMINO' && (
                    <div className="flex flex-col items-center">
                        <MapPin size={48} className="text-blue-500 mb-4" />
                        <h2 className="text-lg font-bold text-gray-800">¡El técnico está en camino!</h2>
                        <p className="text-gray-600 mb-6">Puedes chatear con él o ver su ubicación.</p>
                        <div className="bg-gray-100 p-4 rounded-lg w-full mb-6 text-center">
                            <p className="text-sm text-gray-500 mb-2">Tu PIN de seguridad es:</p>
                            <p className="text-4xl font-mono font-bold tracking-widest text-repara-600">
                                <ObtenerPin idSolicitud={id} />
                            </p>
                        </div>
                        <Boton tipo="primary" className="w-full py-3" onClick={() => navigate(`/chat/${id}`)}>
                            Abrir Chat con el Técnico
                        </Boton>
                    </div>
                )}

                {solicitud.estado === 'PAGO_FINAL_PENDIENTE' && (
                    <div className="flex flex-col items-center">
                        <FileText size={48} className="text-blue-500 mb-4" />
                        <h2 className="text-lg font-bold text-gray-800">Presupuesto Generado</h2>
                        <p className="text-gray-600 mb-4 text-center">El técnico ha enviado el informe con el costo de la reparación. Revisa los detalles y realiza el pago para que inicie el trabajo.</p>
                        <div className="bg-gray-50 p-4 rounded-xl w-full border border-gray-200 mb-6 text-left">
                            <ObtenerInforme idSolicitud={id} />
                        </div>
                        <div className="flex gap-2 w-full">
                            <Boton tipo="success" className="flex-1 py-3" onClick={handlePagarFinal} disabled={pagoFinalProcesando}>
                                {pagoFinalProcesando ? 'Procesando...' : 'Pagar Reparación Ahora'}
                            </Boton>
                            <Boton tipo="danger" className="flex-1 py-3" onClick={handleCancelar}>
                                Cancelar
                            </Boton>
                        </div>
                    </div>
                )}

                {solicitud.estado === 'REPARACION_EN_PROCESO' && (
                    <div className="flex flex-col items-center">
                        <Clock size={48} className="text-yellow-500 mb-4 animate-spin" />
                        <h2 className="text-lg font-bold text-gray-800">Reparación en Proceso</h2>
                        <p className="text-gray-600 mb-6">El técnico está arreglando tu electrodoméstico. Te notificaremos cuando termine.</p>
                    </div>
                )}

                {solicitud.estado === 'COMPLETADO' && (
                    <div className="flex flex-col items-center text-left">
                        <CheckCircle size={48} className="text-green-500 mb-4 self-center" />
                        <h2 className="text-lg font-bold text-gray-800 mb-4 self-center">¡Servicio Finalizado!</h2>
                        <div className="bg-gray-50 p-4 rounded-xl w-full border border-gray-200 mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2"><FileText size={18} /> Informe del Técnico</h3>
                            <ObtenerInforme idSolicitud={id} />
                        </div>
                        <div className="w-full text-center">
                            <p className="text-sm text-gray-600 mb-2">¿Cómo calificarías el servicio?</p>
                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button 
                                        key={star} 
                                        onClick={() => handleCalificar(star)} 
                                        disabled={calificado}
                                        className={`text-yellow-400 hover:scale-110 transition ${calificado ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Star size={32} fill="currentColor" />
                                    </button>
                                ))}
                            </div>
                            {calificado && <p className="text-green-600 font-bold text-sm">¡Gracias por tu calificación!</p>}
                            <p className="text-xs text-gray-400 mt-2">Al calificar, recibirás tu certificado de garantía digital.</p>
                            
                            {/* 🔥 Le pasamos la solicitud completa al certificado */}
                            <ObtenerCertificado idSolicitud={id} solicitud={solicitud} usuario={usuarioLogueado} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

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
            <p><strong>Resumen:</strong> {informe.resumenTrabajo}</p>
            <p><strong>Mano de obra:</strong> S/ {informe.manoObraCosto}</p>
            {informe.repuestos?.length > 0 && (
                <div>
                    <strong>Repuestos:</strong>
                    <ul className="list-disc pl-5 mt-1">
                        {informe.repuestos.map((r, i) => (
                            <li key={i}>{r.cantidad}x {r.nombreRepuesto} S/ {r.costoTotal}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// 🔥 COMPONENTE ACTUALIZADO PARA USAR EL PDF
const ObtenerCertificado = ({ idSolicitud, solicitud, usuario }) => {
    const [certificado, setCertificado] = useState(null);
    const [nombreTecnico, setNombreTecnico] = useState('');

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await api.get(`/solicitudes/${idSolicitud}/certificado`);
                setCertificado(res.data.datos);

                // 🔥 Buscamos el nombre del técnico en el informe
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
        <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200 text-center">
            <p className="text-green-800 font-bold mb-1 flex justify-center items-center gap-2">
                <CheckCircle size={18} /> ¡Garantía Digital Emitida!
            </p>
            <p className="text-sm text-gray-600">Código: <span className="font-mono font-bold text-gray-800">{certificado.codigoCertificado}</span></p>
            <p className="text-sm text-gray-600">Válido hasta: {certificado.fechaExpiracion}</p>
            <button 
                onClick={() => generarCertificadoPdf(solicitud, certificado, usuario, nombreTecnico)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 mx-auto"
            >
                <FileText size={16} /> Descargar Certificado PDF
            </button>
        </div>
    );
};