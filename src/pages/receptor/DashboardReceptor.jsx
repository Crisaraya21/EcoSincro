import { useAuth } from '../../context/AuthContext';
import { obtenerEstadisticas } from '../../services/receptorService';
import './receptor.css';

export default function DashboardReceptor() {
  const { currentUser } = useAuth();
  
  // Mock estadísticas
  const stats = obtenerEstadisticas('R001');

  return (
    <div className="dashboard-receptor">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard - Centro de Acopio</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: 'var(--sp-1)' }}>
            {currentUser?.nombre}
          </p>
        </div>
        <div style={{ 
          background: 'var(--eco-50)',
          padding: 'var(--sp-3) var(--sp-4)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--eco-200)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>Estado</div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            color: currentUser?.certificado ? 'var(--eco-600)' : 'var(--gray-500)',
            marginTop: 'var(--sp-1)'
          }}>
            {currentUser?.certificado ? '✓ Certificado' : '⏳ Pendiente Certificación'}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Entregas Pendientes</div>
            <div className="stat-value">{stats.pendientes}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">Entregas Aprobadas</div>
            <div className="stat-value">{stats.aprobadas}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-label">Entregas Rechazadas</div>
            <div className="stat-value">{stats.rechazadas}</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Entregas</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--sp-4)' }}>Acciones Rápidas</h2>
        <div className="quick-actions">
          <a href="/receptor/bandeja" className="action-card">
            <div className="action-icon">📥</div>
            <div className="action-content">
              <h3>Bandeja de Entregas</h3>
              <p>Revisa las entregas entrantes</p>
            </div>
          </a>
          
          <a href="/receptor/materiales" className="action-card">
            <div className="action-icon">🧴</div>
            <div className="action-content">
              <h3>Gestionar Materiales</h3>
              <p>Configura qué materiales aceptas</p>
            </div>
          </a>
          
          <a href="/receptor/inventario" className="action-card">
            <div className="action-icon">📈</div>
            <div className="action-content">
              <h3>Inventario Acumulado</h3>
              <p>Consulta tu inventario actual</p>
            </div>
          </a>
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ marginTop: 'var(--sp-6)', padding: 'var(--sp-4)', background: 'var(--gray-50)', borderRadius: 'var(--r-md)', border: '1px solid var(--gray-200)' }}>
        <h3 style={{ marginBottom: 'var(--sp-3)' }}>Información del Centro</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>📍 Dirección</div>
            <div style={{ fontWeight: '600' }}>{currentUser?.direccion}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>📞 Teléfono</div>
            <div style={{ fontWeight: '600' }}>{currentUser?.telefono || 'No registrado'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>⏰ Horario</div>
            <div style={{ fontWeight: '600' }}>{currentUser?.horario}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>📧 Email</div>
            <div style={{ fontWeight: '600' }}>{currentUser?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
