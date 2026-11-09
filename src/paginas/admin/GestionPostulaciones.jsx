import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, FileText, User, Mail, Phone, CreditCard, Briefcase, ExternalLink } from 'lucide-react';
import Swal from 'sweetalert2';

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
    const confirm = await Swal.fire({
        title: '¿Aprobar Postulación?',
        text: 'El usuario se convertirá en técnico verificado.',
        icon: 'question', showCancelButton: true, confirmButtonColor: '#16a34a', cancelButtonColor: '#9ca3af', confirmButtonText: 'Sí, aprobar', cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.post(`/postulaciones/${id}/aprobar`);
      toast.success('Postulación aprobada');
      cargarPostulaciones();
    } catch (error) {
      toast.error('Error al aprobar');
    }
  };

  const rechazar = async (id) => {
    const { value: motivo } = await Swal.fire({
        title: 'Rechazar Postulación',
        input: 'textarea',
        inputLabel: 'Motivo del rechazo',
        inputPlaceholder: 'Escribe el motivo aquí...',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar'
    });
    if (!motivo) return;
    try {
      await api.post(`/postulaciones/${id}/rechazar`, { motivo });
      toast.success('Postulación rechazada');
      cargarPostulaciones();
    } catch (error) {
      toast.error('Error al rechazar');
    }
  };

  if (cargando) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="py-6 px-4 md:px-0">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Postulaciones Pendientes</h1>
      
      {postulaciones.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <FileText size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">No hay postulaciones pendientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {postulaciones.map((post) => (
            <div key={post.idPostulacion} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              
              <div className="bg-gray-50 p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl flex items-center gap-2">
                      <User size={20} className="text-blue-600"/> 
                      {post.nombres} {post.apellidos}
                    </h3>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600 mt-3">
                      <span className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {post.correo}</span>
                      <span className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {post.telefono}</span>
                      <span className="flex items-center gap-2"><CreditCard size={14} className="text-gray-400"/> DNI: {post.dni}</span>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-200">Pendiente</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-2 gap-4 mb-6 bg-blue-50/50 p-4 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Especialidad</p>
                    <p className="text-sm text-gray-800 font-bold flex items-center gap-1"><Briefcase size={14}/> {post.especialidadDeclarada}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Experiencia</p>
                    <p className="text-sm text-gray-800 font-bold">{post.aniosExperiencia} años</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-500 font-bold mb-2">Documentos:</p>
                  <div className="flex flex-wrap gap-2">
                    {post.cvUrl && (
                      <a href={post.cvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                        <ExternalLink size={14} /> Ver CV
                      </a>
                    )}
                    {post.certificadosUrl && (
                      <a href={post.certificadosUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                        <ExternalLink size={14} /> Certificados
                      </a>
                    )}
                    {post.dniDocumentoUrl && (
                      <a href={post.dniDocumentoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition">
                        <ExternalLink size={14} /> DNI
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Boton tipo="success" onClick={() => aprobar(post.idPostulacion)} className="flex-1 py-3 rounded-xl shadow-md shadow-green-500/20 flex justify-center items-center gap-2">
                    <CheckCircle size={18} /> Aprobar
                  </Boton>
                  <Boton tipo="danger" onClick={() => rechazar(post.idPostulacion)} className="flex-1 py-3 rounded-xl flex justify-center items-center gap-2">
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