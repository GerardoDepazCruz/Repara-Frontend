import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';

export const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', correo: '', contrasena: '', telefono: '', dni: ''
  });
  const [cargando, setCargando] = useState(false);
  const { registro } = useAutenticacion();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      await registro(formData);
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Error al registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-repara-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombres</label>
              <input type="text" name="nombres" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Apellidos</label>
              <input type="text" name="apellidos" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" name="correo" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="text" name="telefono" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">DNI</label>
              <input type="text" name="dni" onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Contraseña</label>
            <input type="password" name="contrasena" onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-repara-500 outline-none" />
          </div>
          <Boton tipo="primary" className="w-full py-3 mt-4" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </Boton>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta? <Link to="/login" className="text-repara-600 font-medium hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};