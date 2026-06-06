import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TIPOS_RESIDUO, nombreResiduo, iconoResiduo } from '../../services/empresaService';

export default function RegistroResiduos() {
    const { currentUser, updateEmpresaResiduos } = useAuth();

    // Perfil de residuos del usuario actual (inicializado desde la cuenta)
    const [perfil, setPerfil] = useState(() => currentUser?.perfilResiduos || []);
    const [editando, setEditando]   = useState(false);
    const [seleccion, setSeleccion] = useState(() =>
        (currentUser?.perfilResiduos || []).reduce((acc, r) => {
            acc[r.tipo] = { activo: true, cantidad: r.cantidad, frecuencia: r.frecuencia };
            return acc;
        }, {})
    );
    const [guardado, setGuardado]   = useState(false);

    const toggleTipo = (id) => {
        setSeleccion((prev) => ({
            ...prev,
            [id]: prev[id]?.activo
                ? { ...prev[id], activo: false }
                : { activo: true, cantidad: prev[id]?.cantidad || '', frecuencia: prev[id]?.frecuencia || 'semanal' },
        }));
    };

    const updateCampo = (id, campo, valor) => {
        setSeleccion((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
    };

    const handleGuardar = () => {
        const nuevoPerfil = TIPOS_RESIDUO
            .filter((t) => seleccion[t.id]?.activo)
            .map((t) => ({
                tipo: t.id,
                cantidad: Number(seleccion[t.id]?.cantidad) || 0,
                unidad: t.unidad,
                frecuencia: seleccion[t.id]?.frecuencia || 'semanal',
            }));

        setPerfil(nuevoPerfil);
        if (updateEmpresaResiduos) updateEmpresaResiduos(nuevoPerfil);
        setEditando(false);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 3000);
    };

    const frecuencias = ['diario', 'semanal', 'quincenal', 'mensual'];

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'var(--sp-8) var(--sp-4)' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-6)' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--eco-700)', marginBottom: 'var(--sp-1)' }}>
                        Registro de Residuos
                    </h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                        Declara los tipos y volúmenes de residuos que genera tu empresa
                    </p>
                </div>
                {!editando && (
                    <button
                        onClick={() => setEditando(true)}
                        className="btn-enter"
                        style={{ width: 'auto', padding: 'var(--sp-2) var(--sp-5)', fontSize: '0.9rem' }}
                    >
                        {perfil.length === 0 ? '+ Configurar perfil' : '✏️ Editar perfil'}
                    </button>
                )}
            </div>

            {/* Éxito */}
            {guardado && (
                <div style={{
                    background: 'var(--eco-50)', border: '1px solid var(--eco-300)', color: 'var(--eco-700)',
                    padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)',
                    fontSize: '0.88rem', fontWeight: '600', marginBottom: 'var(--sp-5)',
                }}>
                    ✅ Perfil de residuos guardado correctamente.
                </div>
            )}

            {/* Vista de perfil guardado */}
            {!editando && perfil.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--gray-700)', marginBottom: 'var(--sp-4)' }}>
                        Perfil actual de residuos
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--sp-3)' }}>
                        {perfil.map((r) => (
                            <div key={r.tipo} style={{
                                background: 'var(--white)', border: '1px solid var(--eco-200)',
                                borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
                                boxShadow: 'var(--shadow-xs)',
                            }}>
                                <div style={{ fontSize: '1.6rem', marginBottom: 'var(--sp-2)' }}>{iconoResiduo(r.tipo)}</div>
                                <div style={{ fontWeight: '700', color: 'var(--gray-800)', marginBottom: 'var(--sp-1)' }}>
                                    {nombreResiduo(r.tipo)}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                                    {r.cantidad} {r.unidad} · {r.frecuencia}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estado vacío */}
            {!editando && perfil.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: 'var(--sp-12)',
                    background: 'var(--gray-50)', borderRadius: 'var(--r-xl)',
                    border: '2px dashed var(--gray-200)',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-3)' }}>♻️</div>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem', marginBottom: 'var(--sp-4)' }}>
                        Aún no has configurado tu perfil de residuos.
                    </p>
                    <button onClick={() => setEditando(true)} className="btn-enter" style={{ width: 'auto', padding: 'var(--sp-3) var(--sp-6)' }}>
                        Configurar ahora
                    </button>
                </div>
            )}

            {/* Formulario de edición */}
            {editando && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-2)' }}>
                        Selecciona los materiales que genera tu empresa e indica el volumen estimado y la frecuencia de generación.
                    </p>

                    {TIPOS_RESIDUO.map((tipo) => {
                        const activo = seleccion[tipo.id]?.activo;
                        return (
                            <div key={tipo.id} style={{
                                background: 'var(--white)',
                                border: `2px solid ${activo ? 'var(--eco-400)' : 'var(--gray-200)'}`,
                                borderRadius: 'var(--r-lg)',
                                padding: 'var(--sp-4)',
                                transition: 'border-color 0.15s',
                            }}>
                                {/* Tipo header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', cursor: 'pointer' }}
                                     onClick={() => toggleTipo(tipo.id)}>
                                    <div style={{
                                        width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                                        background: activo ? 'var(--eco-600)' : 'var(--gray-200)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', fontSize: '0.75rem', fontWeight: '700', transition: 'background 0.15s',
                                    }}>
                                        {activo ? '✓' : ''}
                                    </div>
                                    <span style={{ fontSize: '1.3rem' }}>{tipo.icono}</span>
                                    <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{tipo.nombre}</span>
                                </div>

                                {/* Campos expandidos */}
                                {activo && (
                                    <div style={{ display: 'flex', gap: 'var(--sp-4)', marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '140px' }}>
                                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: 'var(--sp-1)' }}>
                                                Volumen estimado ({tipo.unidad})
                                            </label>
                                            <input
                                                type="number" min="0" placeholder="0"
                                                value={seleccion[tipo.id]?.cantidad || ''}
                                                onChange={(e) => updateCampo(tipo.id, 'cantidad', e.target.value)}
                                                className="search-input" style={{ margin: 0 }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: '140px' }}>
                                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: 'var(--sp-1)' }}>
                                                Frecuencia de generación
                                            </label>
                                            <select
                                                value={seleccion[tipo.id]?.frecuencia || 'semanal'}
                                                onChange={(e) => updateCampo(tipo.id, 'frecuencia', e.target.value)}
                                                className="search-input"
                                                style={{ margin: 0, cursor: 'pointer', background: 'var(--white)' }}
                                            >
                                                {frecuencias.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
                        <button onClick={handleGuardar} className="btn-enter" style={{ flex: 1 }}>
                            Guardar perfil de residuos
                        </button>
                        <button onClick={() => setEditando(false)}
                                style={{ flex: 1, padding: 'var(--sp-3)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-300)', background: 'var(--white)', color: 'var(--gray-600)', fontWeight: '600', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}