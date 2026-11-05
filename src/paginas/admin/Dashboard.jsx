import { useState, useEffect } from 'react';
import api from '../../servicios/api';
import { Users, Wrench, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export const Dashboard = () => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setDatos(res.data.datos);
      } catch (error) {
        toast.error('Error al cargar dashboard');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando || !datos) return <p className="text-center py-10">Cargando métricas...</p>;

  const tarjetas = [
    { titulo: 'Total Usuarios', valor: datos.totalUsuarios, icon: Users, color: 'bg-blue-500' },
    { titulo: 'Técnicos Activos', valor: datos.totalTecnicos, icon: Wrench, color: 'bg-green-500' },
    { titulo: 'Balance Total', valor: `S/ ${datos.balanceTotal?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'bg-yellow-500' },
    { titulo: 'Solicitudes Pendientes', valor: datos.solicitudesPendientes, icon: Activity, color: 'bg-purple-500' },
  ];

  // Datos para Gráfico de Barras (Estado de Solicitudes)
  const dataOperativa = [
    { name: 'Clientes', cantidad: datos.totalClientes || 0 },
    { name: 'Técnicos', cantidad: datos.totalTecnicos || 0 },
    { name: 'Pendientes', cantidad: datos.solicitudesPendientes || 0 },
    { name: 'Completadas', cantidad: datos.solicitudesCompletadas || 0 },
  ];

  // Datos para Gráfico de Pastel (Distribución de Usuarios)
  const dataUsuarios = [
    { name: 'Clientes', value: datos.totalClientes || 0 },
    { name: 'Técnicos', value: datos.totalTecnicos || 0 },
  ];
  const COLORS = ['#3b82f6', '#22c55e']; // Azul y Verde

  // Datos para Gráfico Financiero (Ingresos vs Ganancias)
  const dataFinanzas = [
    { name: 'Ingresos Brutos', monto: datos.balanceTotal || 0 },
    { name: 'Ganancia Neta', monto: datos.gananciasNetas || 0 },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Control</h1>
      
      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tarjetas.map((t, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className={`w-12 h-12 ${t.color} text-white rounded-lg flex items-center justify-center`}>
              <t.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{t.titulo}</p>
              <p className="text-xl font-bold text-gray-800">{t.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTENEDOR DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Resumen Operativo (Barras) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Resumen de Operaciones</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataOperativa} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="cantidad" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Distribución de Usuarios (Pastel) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Distribución de Usuarios</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataUsuarios} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {dataUsuarios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 3: Finanzas (Barras Horizontales) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Ingresos vs Ganancias (S/)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={dataFinanzas} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="monto" fill="#eab308" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};