import { createContext, useContext, useState, useEffect } from 'react';
import { autenticacionServicio } from '../servicios/autenticacionServicio';
import { TOKEN_KEY, USUARIO_KEY } from '../utilidades/constantes';

const AutenticacionContexto = createContext();

export const useAutenticacion = () => useContext(AutenticacionContexto);

export const AutenticacionProveedor = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // 🔥 Cambiado a sessionStorage para que sea independiente por pestaña
    const token = sessionStorage.getItem(TOKEN_KEY);
    const usuarioGuardado = sessionStorage.getItem(USUARIO_KEY);
    if (token && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (e) {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USUARIO_KEY);
      }
    }
    setCargando(false);
  }, []);

  const login = async (correo, contrasena) => {
    const respuesta = await autenticacionServicio.login(correo, contrasena);
    if (respuesta.exito) {
      const { token, ...datos } = respuesta.datos;
      // 🔥 Guardamos en sessionStorage
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USUARIO_KEY, JSON.stringify(datos));
      setUsuario(datos);
      return datos;
    }
    throw new Error(respuesta.mensaje);
  };

  const registro = async (datos) => {
    const respuesta = await autenticacionServicio.registro(datos);
    if (!respuesta.exito) throw new Error(respuesta.mensaje);
    return respuesta.datos;
  };

  const cerrarSesion = () => {
    // 🔥 Limpiamos solo el sessionStorage de esta pestaña
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USUARIO_KEY);
    setUsuario(null);
  };

  return (
    <AutenticacionContexto.Provider value={{
      usuario, cargando, login, registro, cerrarSesion,
      estaAutenticado: !!usuario,
      esTecnico: usuario?.esTecnico || false,
      esAdmin: usuario?.rol === 'ADMIN',
    }}>
      {children}
    </AutenticacionContexto.Provider>
  );
};