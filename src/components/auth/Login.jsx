// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

const handleGoogleLogin = () => {
  // Redirigir al endpoint de OAuth2 de Spring Boot
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('🔄 Iniciando login...');
    
    const result = await login(correo, contrasena);
    setIsLoading(false);

    if (result.success) {
      const user = result.data;
      console.log('✅ Login exitoso, rol:', user.rol, 'esTecnico:', user.esTecnico);
      
      if (user.rol === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.esTecnico) {
        navigate('/tecnico/dashboard');
      } else {
        navigate('/usuario/dashboard');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-icon">🔧</span>
          <h1 className="logo-text">RePara</h1>
        </div>
        <p className="auth-subtitle">Tu hogar en manos expertas</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              placeholder="admin@repara.com"
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div className="forgot-password">
            <a href="#">¿Olvidé mi contraseña?</a>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="social-login">
          <div className="divider">
            <span>O continuar con</span>
          </div>
          <button className="btn-google" onClick={handleGoogleLogin}>
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
  Continuar con Google
</button>
        </div>

        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Crear cuenta</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;