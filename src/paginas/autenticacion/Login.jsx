import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAutenticacion } from '../../contextos/AutenticacionContexto';
import { Boton } from '../../componentes/comunes/Boton';
import toast from 'react-hot-toast';
import { Wrench } from 'lucide-react';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const { login } = useAutenticacion();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const usuario = await login(correo, contrasena);
      toast.success(`¡Bienvenido ${usuario.nombres}!`);
      
      // Redirección según rol y si es técnico
      if (usuario.rol === 'ADMIN') {
        navigate('/admin');
      } else if (usuario.esTecnico) {
        navigate('/seleccionar-modo');
      } else {
        navigate('/cliente');
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-repara-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-repara-100 text-repara-600 rounded-full mb-4">
            <Wrench size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">RePara</h1>
          <p className="text-gray-500 mt-2">Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 focus:border-transparent outline-none"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-repara-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
          <Boton tipo="primary" className="w-full py-3" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </Boton>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-repara-600 font-medium hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};