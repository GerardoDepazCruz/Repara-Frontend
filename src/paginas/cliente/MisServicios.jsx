import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { ESTADOS_SOLICITUD } from '../../utilidades/constantes';
import toast from 'react-hot-toast';
import { Wrench, FileText } from 'lucide-react';
import { generarCertificadoPdf } from '../../utilidades/generarPdf'; // 🔥 IMPORTAMOS LA FUNCIÓN
import { useAutenticacion } from '../../contextos/AutenticacionContexto';

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

  // 🔥 FUNCIÓN PARA DESCARGAR EL PDF DESDE EL HISTORIAL
    const descargarCertificado = async (e, solicitud) => {
    e.stopPropagation();
    try {
        const res = await api.get(`/solicitudes/${solicitud.idSolicitud}/certificado`);
        
        // Buscamos el nombre del técnico en el informe
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

  if (cargando) return <p className="text-center py-10 text-gray-500">Cargando historial...</p>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Servicios</h1>
      
      {solicitudes.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center border border-gray-200">
          <Wrench size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">Aún no has solicitado ningún servicio</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <div 
              key={sol.idSolicitud} 
              onClick={() => navigate(`/cliente/solicitud/${sol.idSolicitud}`)}
              className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800">{sol.categoria?.nombre || 'Servicio'}</h3>
                    <span className="text-xs font-bold px-3 py-1 bg-repara-100 text-repara-700 rounded-full">
                    {ESTADOS_SOLICITUD[sol.estado] || sol.estado}
                    </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{sol.descripcionProblema}</p>
                <p className="text-xs text-gray-400 mt-2 mb-4">📍 {sol.direccionServicio}</p>
              </div>

              {/* 🔥 BOTÓN DE GARANTÍA PARA SERVICIOS COMPLETADOS */}
              {sol.estado === 'COMPLETADO' && (
                <button 
                    onClick={(e) => descargarCertificado(e, sol)}
                    className="w-full bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg text-sm font-bold hover:bg-green-100 transition flex items-center justify-center gap-2"
                >
                    <FileText size={16} /> Descargar Garantía
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};