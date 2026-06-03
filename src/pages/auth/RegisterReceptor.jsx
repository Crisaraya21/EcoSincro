import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterReceptor() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // ── States ──
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');

  // ── Submit ──
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !email || !password || !direccion) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    try {
      // Mock coordinates (San José, Costa Rica)
      const mockCoords = { lat: 9.9281, lng: -84.0907 };
      
      register(nombre, email, password, 'receptor', {
        direccion,
        telefono,
        ...mockCoords
      });
      navigate('/receptor/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '450px', width: '90%' }}>
        <h1>Crear Cuenta - Receptor</h1>
        <p className="subtitle">Registra tu centro de acopio</p>

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
          
          {/* Nombre del Centro */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Nombre del Centro de Acopio *
            </label>
            <input
              type="text"
              placeholder="EcoPunto Central"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Correo Institucional *
            </label>
            <input
              type="email"
              placeholder="centro@acopio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Contraseña *
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

          {/* Dirección */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Dirección Física *
            </label>
            <input
              type="text"
              placeholder="Av. Central #45, San José Centro"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              placeholder="2222-3344"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="search-input"
              style={{ margin: 0 }}
            />
          </div>

          {/* Auto-assigned Role Badge */}
          <div className="form-group" style={{ marginBottom: 'var(--sp-2)' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
              Rol Asignado
            </label>
            <div style={{
              background: 'var(--eco-50)',
              color: 'var(--eco-700)',
              padding: 'var(--sp-3)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--eco-200)',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>🏭 Centro de Acopio</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '600', background: 'var(--white)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--eco-300)' }}>Automático</span>
            </div>
          </div>

          <button type="submit" className="btn-enter">
            Registrarse y Entrar
          </button>
        </form>

        {/* Link to Login */}
        <p style={{ marginTop: 'var(--sp-5)', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/receptor/login" style={{ color: 'var(--eco-600)', fontWeight: '600', textDecoration: 'underline' }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
