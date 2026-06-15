import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  nombreMaterial,
  iconoMaterial
} from '../../services/receptorService';
import './receptor.css';

export default function BandejaEntregas() {
  const { currentUser, deliveries, addNotification } = useAuth();
  
  // Filtrar entregas que son para este receptor
  const entregas = (deliveries || []).filter(e => e.receptorId === currentUser?.email);
  
  // Estado local para actualizaciones UI
  const [entregasLocal, setEntregasLocal] = useState(entregas);

  const [filtro, setFiltro] = useState('pendientes'); // 'pendientes' | 'todas'
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [modal, setModal] = useState(null); // null | 'aprobar' | 'rechazar'
  const [motivoRechazo, setMotivoRechazo] = useState('');

  // Get filtered entregas
  const entregasFiltradas = filtro === 'pendientes' 
    ? entregasLocal.filter(e => e.estado === 'pendiente')
    : entregasLocal;

  // Handle approval
  const handleAprobar = () => {
    if (!selectedEntrega) return;
    
    const updated = entregasLocal.map(e =>
      e.id === selectedEntrega.id
        ? { ...e, estado: 'aprobado' }
        : e
    );
    
    setEntregasLocal(updated);
    
    // Notificación: Entrega aprobada
    addNotification({
      id: Date.now(),
      tipo: 'success',
      mensaje: `Aprobaste la entrega de ${selectedEntrega.ciudadanoNombre}`,
      leida: false,
      fecha: new Date()
    });
    
    setModal(null);
    setSelectedEntrega(null);
  };

  // Handle rejection
  const handleRechazar = () => {
    if (!selectedEntrega || !motivoRechazo.trim()) return;
    
    const updated = entregasLocal.map(e =>
      e.id === selectedEntrega.id
        ? { ...e, estado: 'rechazado', motivoRechazo }
        : e
    );
    
    setEntregasLocal(updated);
    
    // Notificación: Entrega rechazada
    addNotification({
      id: Date.now(),
      tipo: 'warning',
      mensaje: `Rechazaste la entrega de ${selectedEntrega.ciudadanoNombre}: ${motivoRechazo}`,
      leida: false,
      fecha: new Date()
    });
    
    setModal(null);
    setSelectedEntrega(null);
    setMotivoRechazo('');
  };

  return (
    <div className="bandeja-entregas">
      <h1>Bandeja de Entregas</h1>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--gray-300)' }}>
        <button
          onClick={() => setFiltro('pendientes')}
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: filtro === 'pendientes' ? '700' : '600',
            color: filtro === 'pendientes' ? 'var(--eco-600)' : 'var(--gray-500)',
            borderBottom: filtro === 'pendientes' ? '2px solid var(--eco-600)' : 'none'
          }}
        >
          📦 Pendientes ({entregasLocal.filter(e => e.estado === 'pendiente').length})
        </button>
        <button
          onClick={() => setFiltro('todas')}
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: filtro === 'todas' ? '700' : '600',
            color: filtro === 'todas' ? 'var(--eco-600)' : 'var(--gray-500)',
            borderBottom: filtro === 'todas' ? '2px solid var(--eco-600)' : 'none'
          }}
        >
          📋 Todas ({entregasLocal.length})
        </button>
      </div>

      {/* Entregas List */}
      <div>
        {entregasFiltradas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--sp-8)',
            color: 'var(--gray-500)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-2)' }}>📭</div>
            <p>No hay entregas {filtro === 'pendientes' ? 'pendientes' : 'registradas'}</p>
          </div>
        ) : (
          entregasFiltradas.map((entrega) => (
            <div
              key={entrega.id}
              onClick={() => setSelectedEntrega(entrega)}
              style={{
                padding: 'var(--sp-4)',
                marginBottom: 'var(--sp-3)',
                border: `1px solid ${selectedEntrega?.id === entrega.id ? 'var(--eco-600)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--r-md)',
                background: selectedEntrega?.id === entrega.id ? 'var(--eco-50)' : 'var(--white)',
                cursor: 'pointer',
                transition: 'all var(--ease-fast)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--sp-2)' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{entrega.ciudadanoNombre}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 'var(--sp-1)' }}>
                    {new Date(entrega.fechaHora).toLocaleString('es-CR')}
                  </div>
                </div>
                <span style={{
                  padding: '0.25rem var(--sp-2)',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background: entrega.estado === 'pendiente' ? 'var(--gray-200)' : entrega.estado === 'aprobado' ? 'var(--green-100)' : 'var(--red-100)',
                  color: entrega.estado === 'pendiente' ? 'var(--gray-700)' : entrega.estado === 'aprobado' ? 'var(--green-700)' : 'var(--red-700)'
                }}>
                  {entrega.estado === 'pendiente' ? '⏳ Pendiente' : entrega.estado === 'aprobado' ? '✅ Aprobada' : '❌ Rechazada'}
                </span>
              </div>

              {/* Materiales */}
              <div style={{ marginTop: 'var(--sp-3)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: 'var(--sp-2)', color: 'var(--gray-600)' }}>
                  Materiales:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                  {entrega.materiales.map((mat, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: 'var(--sp-2) var(--sp-3)',
                        background: 'var(--gray-100)',
                        borderRadius: 'var(--r-sm)',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}
                    >
                      {iconoMaterial(mat.tipo)} {nombreMaterial(mat.tipo)} - {mat.cantidad} {mat.unidad}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedEntrega?.id === entrega.id && entrega.estado === 'pendiente' && (
                <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal('aprobar');
                    }}
                    className="btn-enter"
                    style={{ flex: 1 }}
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModal('rechazar');
                    }}
                    style={{
                      flex: 1,
                      padding: 'var(--sp-3)',
                      border: '1px solid var(--red-300)',
                      background: 'var(--red-50)',
                      color: 'var(--red-700)',
                      borderRadius: 'var(--r-md)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all var(--ease-fast)'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'var(--red-100)'}
                    onMouseLeave={(e) => e.target.style.background = 'var(--red-50)'}
                  >
                    ❌ Rechazar
                  </button>
                </div>
              )}

              {selectedEntrega?.id === entrega.id && entrega.estado === 'rechazado' && entrega.motivoRechazo && (
                <div style={{ marginTop: 'var(--sp-3)', padding: 'var(--sp-3)', background: 'var(--red-50)', borderRadius: 'var(--r-md)', border: '1px solid var(--red-200)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--red-700)', marginBottom: 'var(--sp-1)' }}>
                    Motivo del rechazo:
                  </div>
                  <div style={{ color: 'var(--red-700)' }}>{entrega.motivoRechazo}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {modal === 'aprobar' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Aprobar Entrega</h2>
            <p style={{ marginTop: 'var(--sp-3)', color: 'var(--gray-700)' }}>
              ¿Confirmas que apruebas la entrega de <strong>{selectedEntrega?.ciudadanoNombre}</strong>?
            </p>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
              <button onClick={() => setModal(null)} className="btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button onClick={handleAprobar} className="btn-enter" style={{ flex: 1 }}>
                Sí, Aprobar
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === 'rechazar' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rechazar Entrega</h2>
            <p style={{ marginTop: 'var(--sp-3)', color: 'var(--gray-700)' }}>
              ¿Cuál es el motivo del rechazo?
            </p>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ej: Materiales en mal estado, contaminación..."
              style={{
                marginTop: 'var(--sp-3)',
                width: '100%',
                padding: 'var(--sp-3)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--r-md)',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                minHeight: '120px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)' }}>
              <button onClick={() => setModal(null)} className="btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                disabled={!motivoRechazo.trim()}
                style={{
                  flex: 1,
                  padding: 'var(--sp-3)',
                  background: !motivoRechazo.trim() ? 'var(--gray-300)' : 'var(--red-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--r-md)',
                  fontWeight: '700',
                  cursor: !motivoRechazo.trim() ? 'not-allowed' : 'pointer',
                  opacity: !motivoRechazo.trim() ? 0.5 : 1
                }}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
