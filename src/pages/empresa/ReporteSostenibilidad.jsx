import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    SOLICITUDES_MOCK, calcularTotalResiduos, validarCumplimiento,
    nombreResiduo, iconoResiduo,
} from '../../services/empresaService';

export default function ReporteSostenibilidad() {
    const { currentUser } = useAuth();

    const solicitudes = SOLICITUDES_MOCK;
    const confirmadas = solicitudes.filter((s) => s.estado === 'confirmado');
    const totales     = calcularTotalResiduos(solicitudes);
    const { cumple, razon } = validarCumplimiento(solicitudes);

    const [publicado, setPublicado]   = useState(false);
    const [descargado, setDescargado] = useState(false);

    const fechaGeneracion = new Date().toLocaleDateString('es-CR', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    const handlePublicar = () => {
        setPublicado(true);
        setTimeout(() => setPublicado(false), 4000);
    };

    // Genera un CSV simple con los datos del reporte
    const handleDescargarCSV = () => {
        const filas = [
            ['Empresa', 'Fecha', 'Total entregas confirmadas', 'Cumple normativa'],
            [currentUser?.nombre, fechaGeneracion, confirmadas.length, cumple ? 'Sí' : 'No'],
            [],
            ['Material', 'Cantidad (kg/unidades)'],
            ...Object.entries(totales).map(([tipo, cant]) => [nombreResiduo(tipo), cant]),
        ];
        const csv = filas.map((f) => f.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = 'reporte_sostenibilidad.csv'; a.click();
        URL.revokeObjectURL(url);
        setDescargado(true);
        setTimeout(() => setDescargado(false), 3000);
    };

    const totalKgGeneral = Object.values(totales).reduce((a, b) => a + b, 0);

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: 'var(--sp-8) var(--sp-4)' }}>

            {/* Header */}
            <div style={{ marginBottom: 'var(--sp-6)' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--eco-700)', marginBottom: 'var(--sp-1)' }}>
                    Reporte de Sostenibilidad
                </h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                    Generado el {fechaGeneracion} · {currentUser?.nombre}
                </p>
            </div>

            {/* Mensajes de estado */}
            {publicado && (
                <div style={{
                    background: 'var(--eco-50)', border: '1px solid var(--eco-300)', color: 'var(--eco-700)',
                    padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)',
                    fontSize: '0.88rem', fontWeight: '600', marginBottom: 'var(--sp-5)',
                }}>
                    ✅ Reporte de impacto publicado correctamente.
                </div>
            )}
            {descargado && (
                <div style={{
                    background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
                    padding: 'var(--sp-3) var(--sp-4)', borderRadius: 'var(--r-md)',
                    fontSize: '0.88rem', fontWeight: '600', marginBottom: 'var(--sp-5)',
                }}>
                    📥 Archivo CSV descargado correctamente.
                </div>
            )}

            {/* Validación de cumplimiento */}
            <div style={{
                background: cumple ? 'var(--eco-50)' : '#fef2f2',
                border: `1px solid ${cumple ? 'var(--eco-200)' : '#fca5a5'}`,
                borderRadius: 'var(--r-xl)',
                padding: 'var(--sp-5)',
                marginBottom: 'var(--sp-6)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
            }}>
                <div style={{ fontSize: '2.5rem' }}>{cumple ? '✅' : '⚠️'}</div>
                <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: cumple ? 'var(--eco-700)' : '#b91c1c', marginBottom: 'var(--sp-1)' }}>
                        {cumple ? 'Cumple con la normativa ambiental' : 'No cumple con la normativa'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{razon}</div>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-7)' }}>
                {[
                    { label: 'Entregas confirmadas', valor: confirmadas.length, icono: '✅' },
                    { label: 'Total residuos gestionados', valor: `${totalKgGeneral} kg`, icono: '♻️' },
                    { label: 'Tipos de material', valor: Object.keys(totales).length, icono: '📊' },
                    { label: 'Solicitudes totales', valor: solicitudes.length, icono: '📋' },
                ].map((kpi) => (
                    <div key={kpi.label} style={{
                        background: 'var(--white)', border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
                        boxShadow: 'var(--shadow-xs)', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: 'var(--sp-2)' }}>{kpi.icono}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--eco-700)' }}>{kpi.valor}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 'var(--sp-1)' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Detalle por material */}
            <div style={{ marginBottom: 'var(--sp-7)' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--gray-700)', marginBottom: 'var(--sp-4)' }}>
                    Volumen entregado por tipo de material
                </h2>

                {Object.keys(totales).length === 0 ? (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                        No hay entregas confirmadas registradas.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {Object.entries(totales).map(([tipo, cant]) => {
                            const pct = totalKgGeneral > 0 ? Math.round((cant / totalKgGeneral) * 100) : 0;
                            return (
                                <div key={tipo} style={{
                                    background: 'var(--white)', border: '1px solid var(--gray-200)',
                                    borderRadius: 'var(--r-md)', padding: 'var(--sp-3) var(--sp-4)',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                    <span style={{ fontWeight: '600', color: 'var(--gray-800)', fontSize: '0.9rem' }}>
                      {iconoResiduo(tipo)} {nombreResiduo(tipo)}
                    </span>
                                        <span style={{ fontWeight: '700', color: 'var(--eco-700)', fontSize: '0.9rem' }}>
                      {cant} kg
                    </span>
                                    </div>
                                    {/* Barra de progreso */}
                                    <div style={{ height: '6px', background: 'var(--gray-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${pct}%`, height: '100%',
                                            background: 'linear-gradient(90deg, var(--eco-400), var(--eco-600))',
                                            borderRadius: '3px', transition: 'width 0.5s ease',
                                        }} />
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '4px', textAlign: 'right' }}>
                                        {pct}% del total
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Entregas confirmadas */}
            <div style={{ marginBottom: 'var(--sp-7)' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--gray-700)', marginBottom: 'var(--sp-4)' }}>
                    Entregas incluidas en este reporte
                </h2>
                {confirmadas.length === 0 ? (
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                        Aún no hay entregas confirmadas para incluir.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {confirmadas.map((s) => (
                            <div key={s.id} style={{
                                background: 'var(--white)', border: '1px solid var(--eco-100)',
                                borderRadius: 'var(--r-md)', padding: 'var(--sp-3) var(--sp-4)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)',
                            }}>
                                <div>
                                    <span style={{ fontWeight: '700', color: 'var(--gray-700)', fontSize: '0.88rem', marginRight: 'var(--sp-2)' }}>{s.id}</span>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    📍 {s.receptorNombre} · {new Date(s.fechaRetiro).toLocaleDateString('es-CR')}
                  </span>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
                                    {s.residuos.map((r) => (
                                        <span key={r.tipo} style={{
                                            background: 'var(--eco-50)', color: 'var(--eco-700)',
                                            padding: '1px 7px', borderRadius: '99px', fontSize: '0.72rem', fontWeight: '600',
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

            {/* Acciones */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                {/* Publicar: solo si cumple */}
                <button
                    onClick={handlePublicar}
                    disabled={!cumple}
                    className="btn-enter"
                    style={{
                        flex: 1, minWidth: '180px',
                        opacity: cumple ? 1 : 0.45,
                        cursor: cumple ? 'pointer' : 'not-allowed',
                    }}
                >
                    🌍 Publicar reporte de impacto
                </button>

                {/* Descargar CSV */}
                <button
                    onClick={handleDescargarCSV}
                    style={{
                        flex: 1, minWidth: '180px',
                        padding: 'var(--sp-3)', borderRadius: 'var(--r-lg)',
                        border: '1px solid var(--eco-400)', background: 'var(--white)',
                        color: 'var(--eco-700)', fontWeight: '600', fontSize: '0.95rem',
                        cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--eco-50)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; }}
                >
                    📥 Descargar CSV
                </button>
            </div>

            {!cumple && (
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 'var(--sp-3)' }}>
                    ⚠️ El botón de publicación se habilitará cuando el reporte cumpla los criterios normativos.
                </p>
            )}
        </div>
    );
}