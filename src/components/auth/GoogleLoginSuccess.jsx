// src/components/auth/GoogleLoginSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';  // ← IMPORTAR useAuth
import api from '../../api/axiosConfig';

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();  // ← OBTENER setUser del contexto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleLogin = async () => {
      try {
        console.log('🔐 ===== GOOGLE LOGIN SUCCESS PAGE =====');
        console.log('🔐 URL completa:', window.location.href);
        console.log('🔐 Search params:', location.search);
        
        // Obtener token de la URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        console.log('🔑 Token recibido:', token);
        
        if (token) {
          // Guardar token
          localStorage.setItem('token', token);
          
          // Configurar axios con el token
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obtener usuario del token
          try {
            const response = await api.get('/usuario/perfil');
            const userData = response.data;
            
            console.log('👤 Usuario obtenido:', userData);
            
            // ✅ GUARDAR EL USUARIO EN LOCALSTORAGE Y EN EL CONTEXTO
            localStorage.setItem('user', JSON.stringify(userData));
            
            // ✅ ACTUALIZAR EL CONTEXTO
            setUser({
              ...userData,
              token: token,
              rol: userData.rol,
              esTecnico: userData.esTecnico || false
            });
            
            // Redirigir según el rol
            if (userData.rol === 'ADMIN') {
              navigate('/admin/dashboard');
            } else if (userData.esTecnico) {
              navigate('/tecnico/dashboard');
            } else {
              navigate('/usuario/dashboard');
            }
          } catch (err) {
            console.error('❌ Error al obtener perfil:', err);
            setError('Error al obtener datos del usuario');
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          console.error('❌ No se recibió token en la URL');
          setError('No se recibió token de autenticación');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('❌ Error en login con Google:', err);
        setError('Error al iniciar sesión con Google');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleGoogleLogin();
  }, [location, navigate, setUser]);  // ← AGREGAR setUser

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-logo">
            <span className="logo-icon">🔧</span>
            <h1 className="logo-text">RePara</h1>
          </div>
          <p style={{ marginTop: 20, color: '#64748b' }}>Iniciando sesión con Google...</p>
          <div style={{ 
            marginTop: 20,
            width: 40, 
            height: 40, 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #1a56db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '20px auto'
          }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="auth-logo">
            <span className="logo-icon">🔧</span>
            <h1 className="logo-text">RePara</h1>
          </div>
          <p style={{ marginTop: 20, color: '#dc2626' }}>{error}</p>
          <p style={{ color: '#64748b' }}>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleLoginSuccess;