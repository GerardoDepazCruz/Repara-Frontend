import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';
import { Wrench, FileText, ChevronRight, MapPin } from 'lucide-react';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { generarCertificadoPdf } from '../../utilidades/generarPdf';

export const MisServicios = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/solicitudes/mis-solicitudes');
        setSolicitudes(res.data.datos || []);
      } catch (error) {
        toast.error('Error al cargar historial');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const descargarCertificado = async (e, solicitud) => {
    e.stopPropagation();
    try {
        const res = await api.get(`/solicitudes/${solicitud.idSolicitud}/certificado`);
        let nombreTecnico = '';
        try {
            const resInforme = await api.get(`/informes/solicitud/${solicitud.idSolicitud}`);
            if (resInforme.data.datos?.tecnico?.usuario) {
                nombreTecnico = `${resInforme.data.datos.tecnico.usuario.nombres} ${resInforme.data.datos.tecnico.usuario.apellidos}`;
            }
        } catch(err) {}
        generarCertificadoPdf(solicitud, res.data.datos, usuario, nombreTecnico);
    } catch (error) {
        toast.error('No se pudo generar el certificado');
    }
  };

  if (cargando) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Servicios</h1>
      
      {solicitudes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <Wrench size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">Aún no has solicitado ningún servicio</p>
          <p className="text-sm text-gray-400 mt-2">Tus reparaciones aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <div 
              key={sol.idSolicitud} 
              onClick={() => navigate(`/cliente/solicitud/${sol.idSolicitud}`)}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 cursor-pointer transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{sol.categoria?.nombre || 'Servicio Técnico'}</h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin size={12}/> {sol.direccionServicio}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                  {ESTADOS_SOLICITUD[sol.estado] || sol.estado}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100">{sol.descripcionProblema}</p>

              {sol.estado === 'COMPLETADO' && (
                <button 
                    onClick={(e) => descargarCertificado(e, sol)}
                    className="w-full bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-xl text-sm font-bold hover:bg-green-100 transition flex items-center justify-center gap-2"
                >
                    <FileText size={18} /> Descargar Certificado de Garantía
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};