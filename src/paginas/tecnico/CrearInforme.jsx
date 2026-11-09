import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../servicios/api';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { FileText, Plus, Trash2 } from 'lucide-react';

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

  const eliminarRepuesto = (index) => {
    const nuevosRepuestos = [...formData.repuestos];
    nuevosRepuestos.splice(index, 1);
    setFormData({ ...formData, repuestos: nuevosRepuestos });
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
      navigate(`/tecnico/solicitud/${id}?estado=PAGO_FINAL_PENDIENTE`); 
    } catch (error) {
      toast.error('Error al guardar el informe');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <FileText size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Informe Técnico</h1>
            <p className="text-sm text-gray-500">Detalla el trabajo y el costo para el cliente.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Resumen del trabajo</label>
          <input type="text" required onChange={(e) => setFormData({...formData, resumenTrabajo: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Cambio de compresor" />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Diagnóstico y acciones</label>
          <textarea required rows="4" onChange={(e) => setFormData({...formData, accionesRealizadas: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" placeholder="Detalla lo que hiciste..." />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Costo de Mano de Obra (S/)</label>
          <input type="number" required onChange={(e) => setFormData({...formData, manoObraCosto: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-lg" placeholder="0.00" />
        </div>
        
        {/* Repuestos */}
        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Repuestos Utilizados</h3>
            <button type="button" onClick={agregarRepuesto} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-lg transition">
              <Plus size={16}/> Agregar
            </button>
          </div>
          
          {formData.repuestos.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No has agregado repuestos aún.</p>
          )}

          {formData.repuestos.map((rep, index) => (
            <div key={index} className="flex gap-2 mb-3 items-center">
              <input type="text" placeholder="Nombre repuesto" required onChange={(e) => {
                const newRep = [...formData.repuestos]; newRep[index].nombreRepuesto = e.target.value; setFormData({...formData, repuestos: newRep});
              }} className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none" />
              
              <input type="number" placeholder="S/" required onChange={(e) => {
                const newRep = [...formData.repuestos]; newRep[index].costoUnitario = parseFloat(e.target.value); setFormData({...formData, repuestos: newRep});
              }} className="w-20 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none" />
              
              <input type="number" placeholder="Cant" value={rep.cantidad} required onChange={(e) => {
                const newRep = [...formData.repuestos]; newRep[index].cantidad = parseInt(e.target.value); setFormData({...formData, repuestos: newRep});
              }} className="w-16 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none" />

              <button type="button" onClick={() => eliminarRepuesto(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 size={18}/>
              </button>
            </div>
          ))}
        </div>

        <Boton tipo="success" className="w-full py-4 text-lg rounded-xl shadow-lg shadow-green-500/30 mt-4">
            Enviar Informe y Cobrar
        </Boton>
      </form>
    </div>
  );
};