import api from './api';

export const autenticacionServicio = {
  login: async (correo, contrasena) => {
    const response = await api.post('/autenticacion/login', { correo, contrasena });
    return response.data;
  },
  registro: async (datos) => {
    const response = await api.post('/autenticacion/registro', datos);
    return response.data;
  },
  cerrarSesion: () => {
    sessionStorage.removeItem('repara_token');
    sessionStorage.removeItem('repara_usuario');
  },
};