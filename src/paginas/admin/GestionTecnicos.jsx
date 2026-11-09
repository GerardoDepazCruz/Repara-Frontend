import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import toast from 'react-hot-toast';
import { Award, Star, Wrench, Phone, Mail } from 'lucide-react';

export const GestionTecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/admin/tecnicos-ranking');
        setTecnicos(res.data.datos || []);
      } catch (error) {
        toast.error('Error al cargar ranking');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>;

  const getMedallaColor = (index) => {
    if (index === 0) return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    if (index === 1) return 'text-gray-400 bg-gray-50 border-gray-200';
    if (index === 2) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-gray-300 bg-white border-gray-100';
  };

  return (
    <div className="py-6 px-4 md:px-0 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center">
            <Award size={24} />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Ranking de Técnicos</h1>
            <p className="text-sm text-gray-500">Los técnicos con mejor rendimiento.</p>
        </div>
      </div>
      
      {tecnicos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <Wrench size={56} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 font-medium text-lg">Aún no hay técnicos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tecnicos.map((tec, index) => (
            <div key={tec.idTecnico} className={`flex flex-col md:flex-row items-center justify-between p-5 rounded-3xl border shadow-sm transition hover:shadow-md ${getMedallaColor(index)}`}>
              
              <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border-2 ${index < 3 ? 'bg-white shadow-sm' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                  {index + 1}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                    {/* 🔥 AHORA LEEMOS LOS DATOS PLANITOS */}
                    {tec.nombres?.[0]}{tec.apellidos?.[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{tec.nombres} {tec.apellidos}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><Mail size={12}/> {tec.correo}</span>
                      <span className="flex items-center gap-1"><Phone size={12}/> {tec.telefono || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-gray-200/50 pt-4 md:pt-0 md:pl-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Servicios</p>
                  <p className="font-bold text-gray-800 text-lg">{tec.totalServicios}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium mb-1">Calificación</p>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100">
                    <Star size={16} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold text-gray-800">{tec.calificacionPromedio?.toFixed(1) || '0.0'}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};