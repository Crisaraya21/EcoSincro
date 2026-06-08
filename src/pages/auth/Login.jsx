import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── States ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    try {
      login(email, password, 'ciudadano');
      navigate('/ciudadano/buscar');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '400px', width: '90%' }}>
        <h1>EcoSincro</h1>
        <p className="subtitle">Plataforma de reciclaje inteligente</p>

        {error && (
          <div className="error-alert" style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: 'var(--sp-3) var(--sp-4)',
            borderRadius: 'var(--r-md)',
            fontSize: '0.82rem',
            fontWeight: '500',
            textAlign: 'left',
            marginBottom: 'var(--sp-4)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Email */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="nombre@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 'var(--sp-2)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          <button type="submit" className="btn-enter">
            Iniciar Sesión
          </button>
        </form>

        {/* Link to Register */}
        <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          ¿No tienes una cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--eco-600)', fontWeight: '600', textDecoration: 'underline' }}>
            Regístrate aquí
          </Link>
        </p>

        {/* Developer testing account info */}
        <div style={{
          marginTop: 'var(--sp-6)',
          padding: 'var(--sp-3)',
          background: 'var(--gray-50)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--gray-200)',
          fontSize: '0.78rem',
          color: 'var(--gray-500)',
          lineHeight: '1.4'
        }}>
          💡 <strong>Prueba rápido:</strong><br />
          Email: <code style={{ background: 'var(--white)', padding: '1px 4px', borderRadius: '3px' }}>ciudadano@eco.com</code><br />
          Clave: <code style={{ background: 'var(--white)', padding: '1px 4px', borderRadius: '3px' }}>123</code>
        </div>


      </div>
    </div>
  );
}