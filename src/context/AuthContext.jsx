// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('🔑 Token en localStorage:', token);
    console.log('👤 UserData en localStorage:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Configurar el token en axios para todas las peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('✅ Token configurado en axios');
      } catch (e) {
        console.error('Error al parsear userData:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // src/context/AuthContext.jsx - Actualizar el login para guardar el rol

const login = async (correo, contrasena) => {
    try {
        setError(null);
        console.log('📤 Intentando login con:', correo);
        
        const response = await api.post('/auth/login', { correo, contrasena });
        const data = response.data;
        console.log('📥 Respuesta login:', data);
        
        // Guardar token y usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        // Configurar axios
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Guardar en el estado
        setUser(data);
        console.log('✅ Login exitoso, usuario:', data);
        console.log('📌 Rol:', data.rol);
        console.log('📌 esTecnico:', data.esTecnico);
        
        return { success: true, data };
    } catch (err) {
        console.error('❌ Error en login:', err);
        const mensaje = err.response?.data?.message || 'Error al iniciar sesión';
        setError(mensaje);
        return { success: false, error: mensaje };
    }
};

  const register = async (userData) => {
    try {
      setError(null);
      console.log('📤 Intentando registro con:', userData.correo);
      
      const response = await api.post('/auth/register', userData);
      const data = response.data;
      console.log('📥 Respuesta registro:', data);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data);
      
      return { success: true, data };
    } catch (err) {
      console.error('❌ Error en registro:', err);
      const mensaje = err.response?.data?.message || 'Error al registrarse';
      setError(mensaje);
      return { success: false, error: mensaje };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    console.log('👋 Sesión cerrada');
  };

  // src/context/AuthContext.jsx
const value = {
  user,
  setUser,  // ← DEBE ESTAR PRESENTE
  loading,
  error,
  login,
  register,
  logout,
  isAuthenticated: !!user,
  isAdmin: user?.rol === 'ADMIN',
  isTecnico: user?.esTecnico === true,
  isCliente: user?.rol === 'CLIENTE' && !user?.esTecnico,
};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};