import { useAuth } from '../../context/AuthContext';
import { nombreMaterial } from '../../services/ciudadanoService';

export default function HistorialEntregas() {
  const { deliveries } = useAuth();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="buscador-header" style={{ marginBottom: 'var(--sp-6)' }}>
        <h1>Historial de Entregas</h1>
        <p>Consulta el comprobante de tus entregas de residuos confirmadas por los centros de acopio</p>
      </div>

      {deliveries.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)' }}>
          <h3>Aún no tienes entregas registradas</h3>
          <p>Tus comprobantes de recolección aparecerán listados aquí una vez completados.</p>
        </div>
      ) : (
        <div className="historial-timeline" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)'
        }}>
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="ticket-card"
              style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--sp-6)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                animation: 'fadeUp 0.4s var(--ease-base) both'
              }}
            >
              {/* Card top */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--sp-2)',
                borderBottom: '1px solid var(--gray-100)',
                paddingBottom: 'var(--sp-2)'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: 'var(--gray-800)'
                  }}>
                    {delivery.centroNombre}
                  </h3>
                  <span style={{
                    fontSize: '0.78rem',
                    color: 'var(--gray-400)'
                  }}>
                    {new Date(delivery.fecha).toLocaleString()}
                  </span>
                </div>

                <span
                  className="status-badge"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--success)',
                    background: 'var(--eco-50)',
                    padding: 'var(--sp-1) var(--sp-3)',
                    borderRadius: 'var(--r-full)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--sp-1)'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--success)'
                    }}
                  />
                  Aprobado
                </span>
              </div>

              {/* Card body — materials */}
              <div>
                <span style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: 'var(--gray-400)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: 'var(--sp-2)'
                }}>
                  Materiales Acreditados
                </span>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--sp-3)'
                }}>
                  {delivery.materiales.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--sp-2)',
                        padding: 'var(--sp-2) var(--sp-3)',
                        borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--gray-200)',
                        background: 'var(--gray-50)'
                      }}
                    >
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--gray-700)'
                      }}>
                        {nombreMaterial(m.id)}
                      </span>
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        color: 'var(--eco-600)',
                        background: 'var(--white)',
                        padding: '2px 6px',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--r-sm)'
                      }}>
                        {m.cantidad.toFixed(1)} {m.unidad}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
