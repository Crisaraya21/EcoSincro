import { Link } from 'react-router-dom';

export default function RoleSelector() {
  return (
    <div className="login-page" style={{ background: 'linear-gradient(135deg, var(--eco-50), var(--eco-100))' }}>
      <div style={{ maxWidth: '600px', width: '90%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-2)' }}>🌍 EcoSincro</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-6)' }}>
          Plataforma de Reciclaje Inteligente
        </p>

        <p style={{ color: 'var(--gray-600)', marginBottom: 'var(--sp-6)' }}>
          ¿Qué tipo de cuenta quieres abrir?
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
          {/* Ciudadano */}
          <Link
            to="/"
            onClick={() => window.location.href = '/'}
            style={{
              padding: 'var(--sp-6)',
              border: '2px solid var(--eco-600)',
              borderRadius: 'var(--r-md)',
              background: 'var(--white)',
              textDecoration: 'none',
              color: 'var(--eco-600)',
              transition: 'all var(--ease-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--eco-600)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--white)';
              e.currentTarget.style.color = 'var(--eco-600)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-2)' }}>👤</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: 'var(--sp-1)' }}>
              Ciudadano
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Recicla y contribuye
            </div>
          </Link>

          {/* Receptor */}
          <Link
            to="/receptor/login"
            style={{
              padding: 'var(--sp-6)',
              border: '2px solid var(--eco-600)',
              borderRadius: 'var(--r-md)',
              background: 'var(--white)',
              textDecoration: 'none',
              color: 'var(--eco-600)',
              transition: 'all var(--ease-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--eco-600)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--white)';
              e.currentTarget.style.color = 'var(--eco-600)';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-2)' }}>🏭</div>
            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: 'var(--sp-1)' }}>
              Centro de Acopio
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Gestiona tu centro
            </div>
          </Link>
        </div>

        <div style={{
          marginTop: 'var(--sp-6)',
          padding: 'var(--sp-4)',
          background: 'var(--white)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--gray-200)'
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', margin: 0 }}>
            💡 <strong>Selecciona tu rol</strong> para acceder a la plataforma con todas las funcionalidades disponibles para tu tipo de cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}
