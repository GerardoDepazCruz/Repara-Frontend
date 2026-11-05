import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

export const CrearInforme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resumenTrabajo: '',
    diagnosticoDetallado: '',
    accionesRealizadas: '',
    manoObraCosto: 0,
    recomendacionesCliente: '',
    estadoFinal: 'REPARADO',
    repuestos: []
  });

  const agregarRepuesto = () => {
    setFormData({
      ...formData,
      repuestos: [...formData.repuestos, { nombreRepuesto: '', cantidad: 1, costoUnitario: 0 }]
    });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/informes/crear', {
        ...formData,
        idSolicitud: parseInt(id),
        repuestos: formData.repuestos.map(r => ({ ...r, costoTotal: r.cantidad * r.costoUnitario }))
      });
      
      await api.post(`/solicitudes/${id}/estado`, { estado: 'PAGO_FINAL_PENDIENTE', comentario: 'Esperando pago final del cliente' });
      
      toast.success('Informe enviado. Esperando pago del cliente.');
      // 🔥 AQUÍ ESTÁ EL CAMBIO: Lo devolvemos a la misma pantalla
      navigate(`/tecnico/solicitud/${id}?estado=PAGO_FINAL_PENDIENTE`); 
    } catch (error) {
      toast.error('Error al guardar el informe');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FileText /> Informe Técnico Final
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resumen del trabajo</label>
          <input type="text" required onChange={(e) => setFormData({...formData, resumenTrabajo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Ej: Cambio de compresor" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico y acciones</label>
          <textarea required rows="3" onChange={(e) => setFormData({...formData, accionesRealizadas: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="Detalla lo que hiciste..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo de Mano de Obra (S/)</label>
          <input type="number" required onChange={(e) => setFormData({...formData, manoObraCosto: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        
        {/* Repuestos */}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-700">Repuestos Utilizados</h3>
            <button type="button" onClick={agregarRepuesto} className="text-sm text-repara-600 font-medium hover:underline">+ Agregar Repuesto</button>
          </div>
          {formData.repuestos.map((rep, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input type="text" placeholder="Nombre repuesto" required onChange={(e) => {
                const newRep = [...formData.repuestos];
                newRep[index].nombreRepuesto = e.target.value;
                setFormData({...formData, repuestos: newRep});
              }} className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Costo S/" required onChange={(e) => {
                const newRep = [...formData.repuestos];
                newRep[index].costoUnitario = parseFloat(e.target.value);
                setFormData({...formData, repuestos: newRep});
              }} className="px-2 py-1 border rounded" />
              <input type="number" placeholder="Cant." value={rep.cantidad} required onChange={(e) => {
                const newRep = [...formData.repuestos];
                newRep[index].cantidad = parseInt(e.target.value);
                setFormData({...formData, repuestos: newRep});
              }} className="px-2 py-1 border rounded" />
            </div>
          ))}
        </div>

        <Boton tipo="success" className="w-full py-3 mt-4">Enviar Informe y Finalizar</Boton>
      </form>
    </div>
  );
};