import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SOLICITUDES_MOCK, nombreResiduo, iconoResiduo, TIPOS_RESIDUO } from '../../services/empresaService';

export default function BuscarReceptorEmpresa() {
    const { getReceptores, currentUser } = useAuth();

    // Solo receptores certificados
    const receptoresCertificados = getReceptores().filter((r) => r.certificado);

    const [receptorSeleccionado, setReceptorSeleccionado] = useState(null);
    const [mostrarFormulario, setMostrarFormulario]       = useState(false);
    const [solicitudes, setSolicitudes]                   = useState(SOLICITUDES_MOCK);
    const [confirmado, setConfirmado]                     = useState(false);

    // Form state
    const [residuosForm, setResiduosForm] = useState({});
    const [fechaRetiro, setFechaRetiro]   = useState('');
    const [errorForm, setErrorForm]       = useState('');

    const handleSeleccionar = (receptor) => {
        setReceptorSeleccionado(receptor);
        setMostrarFormulario(true);
        setConfirmado(false);
        setErrorForm('');
        setResiduosForm({});
        setFechaRetiro('');
    };

    const updateResiduo = (id, campo, valor) => {
        setResiduosForm((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
    };

    const handleSolicitar = () => {
        const residuosSeleccionados = TIPOS_RESIDUO.filter((t) => residuosForm[t.id]?.activo);
        if (residuosSeleccionados.length === 0) {
            setErrorForm('Debes seleccionar al menos un tipo de residuo.');
            return;
        }
        if (!fechaRetiro) {
            setErrorForm('Debes indicar una fecha propuesta para el retiro.');
            return;
        }

        const nuevaSolicitud = {
            id: `SOL-${String(solicitudes.length + 1).padStart(3, '0')}`,
            empresaEmail: currentUser?.email,
            receptorEmail: receptorSeleccionado.email,
            receptorNombre: receptorSeleccionado.nombre,
            residuos: residuosSeleccionados.map((t) => ({
                tipo: t.id,
                cantidad: Number(residuosForm[t.id]?.cantidad) || 0,
                unidad: t.unidad,
            })),
            estado: 'programado',
            fechaSolicitud: new Date().toISOString(),
            fechaRetiro: new Date(fechaRetiro).toISOString(),
        };

        setSolicitudes((prev) => [nuevaSolicitud, ...prev]);
        setMostrarFormulario(false);
        setConfirmado(true);
        setTimeout(() => setConfirmado(false), 4000);
    };

    const estadoBadge = (estado) => {
        const estilos = {
            confirmado: { background: 'var(--eco-50)', color: 'var(--eco-700)', border: '1px solid var(--eco-200)' },
            programado:  { background: '#fef9c3', color: '#92400e', border: '1px solid #fde68a' },
            pendiente:   { background: 'var(--gray-100)', color: 'var(--gray-600)', border: '1px solid var(--gray-200)' },
        };
        const labels = { confirmado: '✅ Confirmado', programado: '📅 Programado', pendiente: '⏳ Pendiente' };
        return (
            <span style={{ ...estilos[estado], padding: '2px 10px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: '600' }}>
        {labels[estado] ?? estado}
      </span>
        );
    };

    // Fecha mínima = mañana
    const manana = new Date(); manana.setDate(manana.getDate() + 1);
    const fechaMin = manana.toISOString().split('T')[0];

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: 'var(--sp-8) var(--sp-4)' }}>

            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--eco-700)', marginBottom: 'var(--sp-1)' }}>
                    Buscar Receptor Certificado
                </h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                    Solo se muestran centros con certificación ambiental vigente
                </p>
            </div>

            {/* Confirmación */}
            {confirmado && (
                <div style={{
                    background: 'var(--eco-50)', border: '1px solid var(--eco-300)', color: 'var(--eco-700)',
                    padding: 'var(--sp-4)', borderRadius: 'var(--r-md)', fontSize: '0.9rem',
                    fontWeight: '600', marginBottom: 'var(--sp-5)',
                }}>
                    ✅ Solicitud enviada. El estado del retiro fue cambiado a <strong>Retiro Programado</strong>. El receptor recibirá la solicitud.
                </div>
            )}

            {/* Lista de receptores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)' }}>
                {receptoresCertificados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 'var(--sp-10)', color: 'var(--gray-400)' }}>
                        No hay receptores certificados disponibles en este momento.
                    </div>
                ) : (
                    receptoresCertificados.map((r) => (
                        <div key={r.email} style={{
                            background: 'var(--white)', border: '1px solid var(--gray-200)',
                            borderRadius: 'var(--r-lg)', padding: 'var(--sp-5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexWrap: 'wrap', gap: 'var(--sp-3)', boxShadow: 'var(--shadow-xs)',
                        }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--gray-800)', fontSize: '1rem' }}>{r.nombre}</span>
                                    <span style={{
                                        background: 'var(--eco-50)', color: 'var(--eco-700)',
                                        padding: '1px 8px', borderRadius: '99px',
                                        fontSize: '0.72rem', fontWeight: '700', border: '1px solid var(--eco-200)',
                                    }}>✓ Certificado</span>
                                </div>
                                <div style={{ fontSize: '0.83rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-1)' }}>
                                    📍 {r.direccion}
                                </div>
                                <div style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>
                                    🕐 {r.horario} &nbsp;·&nbsp; 📞 {r.telefono}
                                </div>
                                {r.materiales?.length > 0 && (
                                    <div style={{ marginTop: 'var(--sp-2)', display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
                                        {r.materiales.map((m) => (
                                            <span key={m} style={{
                                                background: 'var(--gray-100)', color: 'var(--gray-600)',
                                                padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem',
                                            }}>
                        {iconoResiduo(m)} {nombreResiduo(m)}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => handleSeleccionar(r)} className="btn-enter"
                                    style={{ width: 'auto', padding: 'var(--sp-2) var(--sp-5)', fontSize: '0.88rem' }}>
                                Solicitar Retiro
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Formulario de solicitud */}
            {mostrarFormulario && receptorSeleccionado && (
                <div style={{
                    background: 'var(--white)', border: '2px solid var(--eco-300)',
                    borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)', marginBottom: 'var(--sp-8)',
                }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--eco-700)', marginBottom: 'var(--sp-4)' }}>
                        Coordinar retiro con {receptorSeleccionado.nombre}
                    </h2>

                    {errorForm && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c',
                            padding: 'var(--sp-3)', borderRadius: 'var(--r-md)', fontSize: '0.82rem',
                            fontWeight: '600', marginBottom: 'var(--sp-4)',
                        }}>{errorForm}</div>
                    )}

                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-4)' }}>
                        Selecciona los residuos a retirar e indica el volumen aproximado.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
                        {TIPOS_RESIDUO.filter((t) => receptorSeleccionado.materiales?.includes(t.id)).map((tipo) => {
                            const activo = residuosForm[tipo.id]?.activo;
                            return (
                                <div key={tipo.id} style={{
                                    border: `1px solid ${activo ? 'var(--eco-300)' : 'var(--gray-200)'}`,
                                    borderRadius: 'var(--r-md)', padding: 'var(--sp-3)',
                                    background: activo ? 'var(--eco-50)' : 'var(--white)',
                                    transition: 'all 0.15s',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', cursor: 'pointer' }}
                                         onClick={() => updateResiduo(tipo.id, 'activo', !activo)}>
                                        <div style={{
                                            width: '20px', height: '20px', borderRadius: '5px', flexShrink: 0,
                                            background: activo ? 'var(--eco-600)' : 'var(--gray-200)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontSize: '0.7rem', fontWeight: '700', transition: 'background 0.15s',
                                        }}>
                                            {activo ? '✓' : ''}
                                        </div>
                                        <span style={{ fontSize: '1.1rem' }}>{tipo.icono}</span>
                                        <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{tipo.nombre}</span>
                                    </div>
                                    {activo && (
                                        <div style={{ marginTop: 'var(--sp-3)', paddingLeft: 'var(--sp-8)' }}>
                                            <label style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gray-500)' }}>
                                                Volumen estimado ({tipo.unidad})
                                            </label>
                                            <input type="number" min="0" placeholder="0"
                                                   value={residuosForm[tipo.id]?.cantidad || ''}
                                                   onChange={(e) => updateResiduo(tipo.id, 'cantidad', e.target.value)}
                                                   className="search-input" style={{ margin: 'var(--sp-1) 0 0', maxWidth: '180px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginBottom: 'var(--sp-5)' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: 'var(--gray-600)', marginBottom: 'var(--sp-1)' }}>
                            Fecha propuesta para el retiro *
                        </label>
                        <input type="date" value={fechaRetiro} min={fechaMin}
                               onChange={(e) => setFechaRetiro(e.target.value)}
                               className="search-input" style={{ margin: 0, maxWidth: '220px' }} />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
                        <button onClick={handleSolicitar} className="btn-enter" style={{ flex: 1 }}>
                            Enviar Solicitud de Retiro
                        </button>
                        <button onClick={() => setMostrarFormulario(false)}
                                style={{ flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-300)', background: 'var(--white)', color: 'var(--gray-600)', fontWeight: '600', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Historial de solicitudes */}
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--gray-700)', marginBottom: 'var(--sp-4)' }}>
                    Historial de solicitudes
                </h2>
                {solicitudes.filter((s) => s.empresaEmail === currentUser?.email || true).length === 0 ? (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                        Aún no hay solicitudes registradas.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                        {solicitudes.map((s) => (
                            <div key={s.id} style={{
                                background: 'var(--white)', border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
                                boxShadow: 'var(--shadow-xs)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-2)', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                                        <span style={{ fontWeight: '700', color: 'var(--gray-800)', fontSize: '0.95rem' }}>{s.id}</span>
                                        {estadoBadge(s.estado)}
                                    </div>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
                    📅 Retiro: {new Date(s.fechaRetiro).toLocaleDateString('es-CR')}
                  </span>
                                </div>
                                <div style={{ fontSize: '0.83rem', color: 'var(--gray-600)', marginBottom: 'var(--sp-2)' }}>
                                    📍 {s.receptorNombre}
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                                    {s.residuos.map((r) => (
                                        <span key={r.tipo} style={{
                                            background: 'var(--gray-100)', color: 'var(--gray-600)',
                                            padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem',
                                        }}>
                      {iconoResiduo(r.tipo)} {r.cantidad} {r.unidad}
                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}