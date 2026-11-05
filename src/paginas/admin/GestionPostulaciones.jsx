import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, FileText, User, Mail, Phone, CreditCard, Briefcase, ExternalLink } from 'lucide-react';

export const GestionPostulaciones = () => {
  const [postulaciones, setPostulaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      const res = await api.get('/postulaciones/pendientes');
      setPostulaciones(res.data.datos || []);
    } catch (error) {
      toast.error('Error al cargar postulaciones');
    } finally {
      setCargando(false);
    }
  };

  const aprobar = async (id) => {
    try {
      await api.post(`/postulaciones/${id}/aprobar`);
      toast.success('Postulación aprobada');
      cargarPostulaciones();
    } catch (error) {
      toast.error('Error al aprobar');
    }
  };

  const rechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo:');
    if (!motivo) return;
    try {
      await api.post(`/postulaciones/${id}/rechazar`, { motivo });
      toast.success('Postulación rechazada');
      cargarPostulaciones();
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  if (cargando) return <p className="text-center py-10">Cargando...</p>;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Postulaciones Pendientes</h1>
      
      {postulaciones.length === 0 ? (
        <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
          <FileText size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No hay postulaciones pendientes</p>
        </div>
      ) : (
        <div className="space-y-6">
          {postulaciones.map((post) => (
            <div key={post.idPostulacion} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              
              {/* Cabecera de la Tarjeta con Datos del Postulante */}
              <div className="bg-gray-50 p-5 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                      <User size={20} className="text-repara-600"/> 
                      {post.nombres} {post.apellidos}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1"><Mail size={14}/> {post.correo}</span>
                      <span className="flex items-center gap-1"><Phone size={14}/> {post.telefono}</span>
                      <span className="flex items-center gap-1"><CreditCard size={14}/> DNI: {post.dni}</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">Pendiente</span>
                </div>
              </div>

              {/* Cuerpo de la Tarjeta con Datos Profesionales */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
                  <div className="flex items-start gap-2">
                    <Briefcase size={16} className="text-gray-400 mt-0.5"/>
                    <div>
                      <p className="text-gray-500 font-medium">Especialidad Declarada</p>
                      <p className="text-gray-800 font-bold">{post.especialidadDeclarada}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Años de Experiencia</p>
                    <p className="text-gray-800 font-bold">{post.aniosExperiencia} años</p>
                  </div>
                </div>

                {/* Enlaces a Documentos */}
                <div className="bg-blue-50 p-4 rounded-lg mb-5 border border-blue-100">
                  <p className="text-sm text-blue-800 font-bold mb-2">Documentos Adjuntos:</p>
                  <div className="flex flex-wrap gap-3">
                    {post.cvUrl && (
                      <a href={post.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 bg-white px-3 py-1.5 rounded-md shadow-sm border border-blue-200 hover:bg-blue-600 hover:text-white transition">
                        <ExternalLink size={14} /> Ver CV
                      </a>
                    )}
                    {post.certificadosUrl && (
                      <a href={post.certificadosUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 bg-white px-3 py-1.5 rounded-md shadow-sm border border-blue-200 hover:bg-blue-600 hover:text-white transition">
                        <ExternalLink size={14} /> Ver Certificados
                      </a>
                    )}
                    {post.dniDocumentoUrl && (
                      <a href={post.dniDocumentoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-blue-600 bg-white px-3 py-1.5 rounded-md shadow-sm border border-blue-200 hover:bg-blue-600 hover:text-white transition">
                        <ExternalLink size={14} /> Ver DNI
                      </a>
                    )}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-3">
                  <Boton tipo="success" onClick={() => aprobar(post.idPostulacion)} className="flex-1 py-2.5 flex justify-center items-center gap-2">
                    <CheckCircle size={18} /> Aprobar Postulación
                  </Boton>
                  <Boton tipo="danger" onClick={() => rechazar(post.idPostulacion)} className="flex-1 py-2.5 flex justify-center items-center gap-2">
                    <XCircle size={18} /> Rechazar
                  </Boton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};