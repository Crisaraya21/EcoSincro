import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TIPOS_MATERIAL, obtenerCentros, nombreMaterial } from '../../services/ciudadanoService';

export default function RegistroEntrega() {
  const { addDelivery } = useAuth();
  const centros = obtenerCentros();

  // ── States ──
  const [step, setStep] = useState('form'); // 'form' | 'tracking' | 'success'
  const [centroId, setCentroId] = useState('');
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState(
    TIPOS_MATERIAL.reduce((acc, mat) => {
      acc[mat.id] = { selected: false, cantidad: '' };
      return acc;
    }, {})
  );
  
  const [trackingStatus, setTrackingStatus] = useState('enviada'); // 'enviada' | 'revision' | 'confirmada'
  const [error, setError] = useState('');
  const [ultimaEntrega, setUltimaEntrega] = useState(null);
  const [filtroTexto, setFiltroTexto] = useState('');

  // ── Filtrado inteligente de centros ──
  const centrosFiltrados = centros.filter((c) => {
    const matchTexto =
      c.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
      c.direccion.toLowerCase().includes(filtroTexto.toLowerCase());

    const idsSeleccionados = Object.entries(materialesSeleccionados)
      .filter(([_, data]) => data.selected)
      .map(([id]) => id);

    if (idsSeleccionados.length === 0) return matchTexto;

    // Solo mostrar centros que acepten AL MENOS UNO de los materiales seleccionados
    const aceptaAlguno = idsSeleccionados.some((matId) => c.materiales.includes(matId));
    return matchTexto && aceptaAlguno;
  });

  // ── Handlers ──
  const handleToggleMaterial = (id) => {
    setMaterialesSeleccionados((prev) => ({
      ...prev,
      [id]: { ...prev[id], selected: !prev[id].selected },
    }));
  };

  const handleCantidadChange = (id, val) => {
    setMaterialesSeleccionados((prev) => ({
      ...prev,
      [id]: { ...prev[id], cantidad: val },
    }));
  };

  const validarFormulario = () => {
    if (!centroId) {
      setError('Por favor selecciona un centro de acopio.');
      return false;
    }
    const algunoSeleccionado = Object.entries(materialesSeleccionados).some(
      ([_, data]) => data.selected && parseFloat(data.cantidad) > 0
    );
    if (!algunoSeleccionado) {
      setError('Por favor selecciona al menos un material con una cantidad válida.');
      return false;
    }
    setError('');
    return true;
  };

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setStep('tracking');
    setTrackingStatus('enviada');
  };

  // ── Tracking Simulator ──
  useEffect(() => {
    if (step !== 'tracking') return;

    // Phase 1 -> 2: Revision (after 3s)
    const toRevision = setTimeout(() => {
      setTrackingStatus('revision');
    }, 3000);

    // Phase 2 -> 3: Confirmada (after 6s total)
    const toConfirmada = setTimeout(() => {
      setTrackingStatus('confirmada');

      // Build delivery object
      const centroSel = centros.find((c) => c.id === parseInt(centroId));
      const matList = Object.entries(materialesSeleccionados)
        .filter(([_, data]) => data.selected)
        .map(([id, data]) => ({
          id,
          cantidad: parseFloat(data.cantidad),
          unidad: 'kg',
        }));

      const nuevaEntrega = {
        id: `del-${Date.now()}`,
        centroNombre: centroSel ? centroSel.nombre : 'Centro de Acopio',
        fecha: new Date().toISOString(),
        materiales: matList,
        estado: 'confirmada',
      };

      // Add to global shared history
      addDelivery(nuevaEntrega);
      setUltimaEntrega(nuevaEntrega);

      // Go to success screen after showing confirmation state briefly
      setTimeout(() => {
        setStep('success');
      }, 1500);

    }, 6000);

    return () => {
      clearTimeout(toRevision);
      clearTimeout(toConfirmada);
    };
  }, [step, centroId, materialesSeleccionados, addDelivery]);

  // ── Reset Flow ──
  const reiniciarFlujo = () => {
    setCentroId('');
    setMaterialesSeleccionados(
      TIPOS_MATERIAL.reduce((acc, mat) => {
        acc[mat.id] = { selected: false, cantidad: '' };
        return acc;
      }, {})
    );
    setStep('form');
    setTrackingStatus('enviada');
    setUltimaEntrega(null);
  };

  return (
    <div className="page-container">
      {/* ────────────────── STEP 1: FORM ────────────────── */}
      {step === 'form' && (
        <div className="registro-flow" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="buscador-header" style={{ textAlign: 'center', marginBottom: 'var(--sp-6)' }}>
            <h1>Registrar Entrega de Residuos</h1>
            <p>Selecciona el centro de acopio y los materiales a entregar para esperar la confirmación</p>
          </div>

          <form onSubmit={handleEnviar} className="eco-form" style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--r-xl)',
            padding: 'var(--sp-8)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {error && (
              <div className="error-alert" style={{
                background: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                padding: 'var(--sp-3) var(--sp-4)',
                borderRadius: 'var(--r-md)',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: 'var(--sp-5)'
              }}>
                {error}
              </div>
            )}

            {/* Select Centro */}
            <div className="form-group" style={{ marginBottom: 'var(--sp-6)' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: 'var(--sp-2)'
              }}>
                1. Centro de Acopio Receptor
              </label>

              {/* Text Search Bar */}
              <input
                type="text"
                placeholder="Escribe para buscar centro por nombre o dirección..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="search-input"
              />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.72rem', 
                color: 'var(--gray-400)',
                fontWeight: '500',
                marginBottom: 'var(--sp-2)'
              }}>
                <span>Filtro inteligente por materiales y texto</span>
                <span>{centrosFiltrados.length} centro(s) de {centros.length}</span>
              </div>

              <select
                value={centroId}
                onChange={(e) => setCentroId(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--sp-3) var(--sp-4)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--gray-200)',
                  background: 'var(--white)',
                  color: 'var(--gray-800)',
                  outline: 'none',
                  transition: 'border-color var(--ease-fast)'
                }}
              >
                <option value="">Selecciona un centro...</option>
                {centrosFiltrados.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} — {c.direccion}
                  </option>
                ))}
              </select>
            </div>

            {/* Selection of materials & quantities */}
            <div className="form-group" style={{ marginBottom: 'var(--sp-8)' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: 'var(--sp-3)'
              }}>
                2. Materiales y Cantidades (kg)
              </label>

              <div className="materials-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {TIPOS_MATERIAL.map((mat) => {
                  const state = materialesSeleccionados[mat.id];
                  return (
                    <div
                      key={mat.id}
                      className={`material-select-row ${state.selected ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--sp-4)',
                        padding: 'var(--sp-3) var(--sp-4)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--r-lg)',
                        background: state.selected ? 'var(--eco-50)' : 'var(--white)',
                        transition: 'all var(--ease-base)'
                      }}
                    >
                      <div
                        onClick={() => handleToggleMaterial(mat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--sp-3)',
                          cursor: 'pointer',
                          flexGrow: 1,
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={state.selected}
                          readOnly
                          style={{
                            width: '18px',
                            height: '18px',
                            accentColor: 'var(--eco-600)',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{ fontSize: '1.1rem' }}>{mat.icono}</span>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: 'var(--gray-800)'
                        }}>
                          {mat.nombre}
                        </span>
                      </div>

                      {state.selected && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                          <input
                            type="number"
                            min="0.1"
                            step="0.1"
                            placeholder="0.0"
                            value={state.cantidad}
                            onChange={(e) => handleCantidadChange(mat.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '80px',
                              padding: 'var(--sp-2) var(--sp-3)',
                              borderRadius: 'var(--r-md)',
                              border: '1px solid var(--gray-300)',
                              background: 'var(--white)',
                              color: 'var(--gray-800)',
                              textAlign: 'right',
                              outline: 'none'
                            }}
                            required
                          />
                          <span style={{
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            color: 'var(--gray-500)'
                          }}>
                            kg
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-enter" style={{ display: 'block', width: '100%', margin: '0 auto' }}>
              Emitir Entrega
            </button>
          </form>
        </div>
      )}

      {/* ────────────────── STEP 2: TRACKING ────────────────── */}
      {step === 'tracking' && (
        <div className="tracking-flow" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: 'var(--sp-8)' }}>
          <div className="tracker-card" style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--r-2xl)',
            padding: 'var(--sp-10) var(--sp-8)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: 'var(--gray-900)',
              marginBottom: 'var(--sp-2)'
            }}>
              Esperando confirmación del receptor
            </h2>
            <p style={{
              color: 'var(--gray-500)',
              fontSize: '0.9rem',
              marginBottom: 'var(--sp-8)'
            }}>
              Tu solicitud de entrega física ha sido emitida al centro de acopio
            </p>

            {/* Stepper indicator */}
            <div className="stepper" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-6)',
              position: 'relative',
              textAlign: 'left',
              paddingLeft: 'var(--sp-6)'
            }}>
              {/* Vertical timeline line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '12px',
                bottom: '12px',
                width: '2px',
                background: 'var(--gray-200)'
              }} />

              {/* Step 1: Enviada */}
              <div className="step-item" style={{
                display: 'flex',
                gap: 'var(--sp-4)',
                position: 'relative',
                opacity: 1
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--eco-500)',
                  boxShadow: '0 0 0 4px var(--eco-100)',
                  position: 'absolute',
                  left: '-25px',
                  top: '4px'
                }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--gray-800)' }}>
                    Entrega enviada
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                    Recibido en el sistema de EcoSincro
                  </p>
                </div>
              </div>

              {/* Step 2: Revision */}
              <div className="step-item" style={{
                display: 'flex',
                gap: 'var(--sp-4)',
                position: 'relative',
                opacity: trackingStatus === 'enviada' ? 0.4 : 1,
                transition: 'opacity var(--ease-base)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: trackingStatus === 'enviada' ? 'var(--gray-300)' : 'var(--eco-500)',
                  boxShadow: trackingStatus === 'revision' ? '0 0 0 4px var(--eco-100)' : 'none',
                  position: 'absolute',
                  left: '-25px',
                  top: '4px',
                  transition: 'background var(--ease-base)'
                }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--gray-800)' }}>
                    En revisión interna
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                    El operador verifica la calidad de los materiales
                  </p>
                </div>
              </div>

              {/* Step 3: Confirmada */}
              <div className="step-item" style={{
                display: 'flex',
                gap: 'var(--sp-4)',
                position: 'relative',
                opacity: trackingStatus === 'confirmada' ? 1 : 0.4,
                transition: 'opacity var(--ease-base)'
              }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: trackingStatus === 'confirmada' ? 'var(--eco-500)' : 'var(--gray-300)',
                  position: 'absolute',
                  left: '-25px',
                  top: '4px',
                  transition: 'background var(--ease-base)'
                }} />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--gray-800)' }}>
                    Confirmado por el receptor
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                    ¡La transacción se ha cerrado con éxito!
                  </p>
                </div>
              </div>
            </div>

            {/* Spinner animation simulation */}
            <div style={{ marginTop: 'var(--sp-10)' }}>
              <div className="spinner" style={{
                display: 'inline-block',
                width: '32px',
                height: '32px',
                border: '3px solid var(--eco-100)',
                borderTopColor: 'var(--eco-600)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── STEP 3: SUCCESS ────────────────── */}
      {step === 'success' && (
        <div className="success-flow" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: 'var(--sp-8)' }}>
          <div className="success-card" style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--r-2xl)',
            padding: 'var(--sp-10) var(--sp-8)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Success icon banner */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--eco-50)',
              color: 'var(--eco-600)',
              fontSize: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--sp-5) auto',
              fontWeight: 'bold',
              boxShadow: '0 0 0 6px var(--eco-100)'
            }}>
              ✓
            </div>

            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: '800',
              color: 'var(--eco-600)',
              marginBottom: 'var(--sp-2)'
            }}>
              ¡Entrega Confirmada Exitosamente!
            </h2>
            <p style={{
              color: 'var(--gray-500)',
              fontSize: '0.875rem',
              marginBottom: 'var(--sp-6)'
            }}>
              Tu transacción ha sido aprobada por el centro de acopio.
            </p>

            {/* Delivery Ticket Detail */}
            {ultimaEntrega && (
              <div className="ticket-detail" style={{
                background: 'var(--gray-50)',
                border: '1px dashed var(--gray-300)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-5)',
                textAlign: 'left',
                marginBottom: 'var(--sp-8)'
              }}>
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: 'var(--gray-700)',
                  borderBottom: '1px solid var(--gray-200)',
                  paddingBottom: 'var(--sp-2)',
                  marginBottom: 'var(--sp-3)'
                }}>
                  Detalles del Comprobante
                </h4>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>Receptor:</span>
                  <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{ultimaEntrega.centroNombre}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-3)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--gray-400)' }}>Fecha:</span>
                  <span style={{ color: 'var(--gray-600)' }}>{new Date(ultimaEntrega.fecha).toLocaleString()}</span>
                </div>

                <div style={{ color: 'var(--gray-400)', fontSize: '0.82rem', marginBottom: 'var(--sp-1)' }}>Materiales entregados:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
                  {ultimaEntrega.materiales.map((m) => (
                    <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '500' }}>
                      <span style={{ color: 'var(--gray-700)' }}>• {nombreMaterial(m.id)}</span>
                      <span style={{ fontWeight: '700', color: 'var(--gray-800)' }}>{m.cantidad.toFixed(1)} {m.unidad}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button
                onClick={reiniciarFlujo}
                className="btn-enter"
                style={{ flex: 1, padding: 'var(--sp-3)' }}
              >
                Nueva Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
