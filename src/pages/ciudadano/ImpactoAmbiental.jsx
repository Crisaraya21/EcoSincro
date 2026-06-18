import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TIPOS_MATERIAL } from '../../services/ciudadanoService';

/* ─────────────────────────────────────────────
   Factores de conversión CO₂ evitado por kg
   Fuente: estimaciones estándar de reciclaje
───────────────────────────────────────────── */
const CO2_POR_KG = {
    plastico:        1.5,
    vidrio:          0.3,
    carton:          0.9,
    no_convencional: 0.5,
};

const MENSAJES = [
    { min: 0,   max: 5,   emoji: '🌱', texto: '¡Cada gramo cuenta! Estás empezando un hábito que cambia el mundo.' },
    { min: 5,   max: 20,  emoji: '♻️', texto: '¡Buen arranque! Tu esfuerzo ya está marcando la diferencia.' },
    { min: 20,  max: 50,  emoji: '🌿', texto: 'Vas muy bien. Estás evitando emisiones equivalentes a varios viajes en auto.' },
    { min: 50,  max: 100, emoji: '🌳', texto: '¡Impresionante! Has salvado el equivalente a un árbol adulto en emisiones.' },
    { min: 100, max: Infinity, emoji: '🏆', texto: '¡Eres un héroe del reciclaje! Tu impacto ya es visible a nivel comunidad.' },
];

function getMensaje(kgTotal) {
    return MENSAJES.find((m) => kgTotal >= m.min && kgTotal < m.max) ?? MENSAJES[0];
}

/* Separa entregas del mes actual vs mes anterior */
function agruparPorMes(deliveries) {
    const ahora = new Date();
    const mesActual  = ahora.getMonth();
    const anioActual = ahora.getFullYear();
    const mesAnterior  = mesActual === 0 ? 11 : mesActual - 1;
    const anioAnterior = mesActual === 0 ? anioActual - 1 : anioActual;

    const actual   = [];
    const anterior = [];

    deliveries.forEach((d) => {
        const f = new Date(d.fecha);
        if (f.getMonth() === mesActual && f.getFullYear() === anioActual) actual.push(d);
        else if (f.getMonth() === mesAnterior && f.getFullYear() === anioAnterior) anterior.push(d);
    });

    return { actual, anterior };
}

/* Suma kg por tipo de material en un array de entregas */
function sumarKgPorTipo(deliveries) {
    const totales = {};
    deliveries.forEach((d) => {
        (d.materiales || []).forEach((m) => {
            totales[m.id] = (totales[m.id] || 0) + (m.cantidad || 0);
        });
    });
    return totales;
}

function sumarCO2(kgPorTipo) {
    return Object.entries(kgPorTipo).reduce((acc, [tipo, kg]) => {
        return acc + kg * (CO2_POR_KG[tipo] ?? 0.5);
    }, 0);
}

/* ─── Componente principal ─── */
export default function ImpactoAmbiental() {
    const { deliveries } = useAuth();

    // Solo entregas confirmadas
    const confirmadas = useMemo(
        () => deliveries.filter((d) => ['confirmada', 'aprobado'].includes((d.estado || '').toLowerCase())),
        [deliveries]
    );

    const { actual, anterior } = useMemo(() => agruparPorMes(confirmadas), [confirmadas]);

    const kgTotalGlobal  = useMemo(() => sumarKgPorTipo(confirmadas), [confirmadas]);
    const kgMesActual    = useMemo(() => sumarKgPorTipo(actual), [actual]);
    const kgMesAnterior  = useMemo(() => sumarKgPorTipo(anterior), [anterior]);

    const totalKgGlobal  = Object.values(kgTotalGlobal).reduce((a, b) => a + b, 0);
    const totalKgActual  = Object.values(kgMesActual).reduce((a, b) => a + b, 0);
    const totalKgAnterior = Object.values(kgMesAnterior).reduce((a, b) => a + b, 0);

    const co2Global  = sumarCO2(kgTotalGlobal);
    const co2Actual  = sumarCO2(kgMesActual);
    const co2Anterior = sumarCO2(kgMesAnterior);

    const diferenciaCO2 = co2Actual - co2Anterior;
    const diferenciaPct = co2Anterior > 0
        ? Math.round((diferenciaCO2 / co2Anterior) * 100)
        : co2Actual > 0 ? 100 : 0;

    const mensaje = getMensaje(totalKgGlobal);

    const mesActualNombre = new Date().toLocaleString('es-CR', { month: 'long', year: 'numeric' });
    const mesAnteriorNombre = (() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toLocaleString('es-CR', { month: 'long', year: 'numeric' });
    })();

    // Bar chart: kg por tipo, mes actual vs anterior
    const maxKg = Math.max(
        ...TIPOS_MATERIAL.map((t) => Math.max(kgMesActual[t.id] ?? 0, kgMesAnterior[t.id] ?? 0)),
        1
    );

    if (confirmadas.length === 0) {
        return (
            <div className="page-container">
                <div className="buscador-header" style={{ marginBottom: 'var(--sp-6)' }}>
                    <h1>Mi Impacto Ambiental</h1>
                    <p>Visualiza tu contribución al reciclaje y el CO₂ que has evitado</p>
                </div>
                <div style={{
                    textAlign: 'center', padding: 'var(--sp-12)',
                    background: 'var(--white)', borderRadius: 'var(--r-xl)',
                    border: '2px dashed var(--gray-200)',
                }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: 'var(--sp-3)' }}>🌱</div>
                    <h3 style={{ color: 'var(--gray-700)', marginBottom: 'var(--sp-2)' }}>
                        Aún no hay entregas confirmadas
                    </h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                        Realiza tu primera entrega de reciclaje para ver tu impacto ambiental aquí.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">

            {/* Header */}
            <div className="buscador-header" style={{ marginBottom: 'var(--sp-6)' }}>
                <h1>Mi Impacto Ambiental</h1>
                <p>Tu contribución acumulada al reciclaje y el CO₂ que has evitado</p>
            </div>

            {/* Mensaje motivacional */}
            <div style={{
                background: 'linear-gradient(135deg, var(--eco-600), var(--eco-500))',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--sp-6)',
                marginBottom: 'var(--sp-6)',
                display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
                boxShadow: 'var(--shadow-green)',
            }}>
                <span style={{ fontSize: '2.8rem', flexShrink: 0 }}>{mensaje.emoji}</span>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
                    {mensaje.texto}
                </p>
            </div>

            {/* KPIs globales */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 'var(--sp-4)',
                marginBottom: 'var(--sp-7)',
            }}>
                {[
                    { icono: '♻️', valor: `${totalKgGlobal.toFixed(1)} kg`, label: 'Total reciclado' },
                    { icono: '🌿', valor: `${co2Global.toFixed(2)} kg`, label: 'CO₂ evitado total' },
                    { icono: '📦', valor: confirmadas.length, label: 'Entregas confirmadas' },
                    { icono: '🗂️', valor: Object.keys(kgTotalGlobal).length, label: 'Tipos de material' },
                ].map((kpi) => (
                    <div key={kpi.label} style={{
                        background: 'var(--white)', border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
                        boxShadow: 'var(--shadow-xs)', textAlign: 'center',
                        animation: 'fadeUp 0.4s var(--ease-base) both',
                    }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: 'var(--sp-2)' }}>{kpi.icono}</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--eco-700)' }}>{kpi.valor}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: 'var(--sp-1)' }}>{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Comparativa mes actual vs anterior */}
            <div style={{
                background: 'var(--white)', border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)',
                marginBottom: 'var(--sp-6)', boxShadow: 'var(--shadow-xs)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-5)', flexWrap: 'wrap', gap: 'var(--sp-3)' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--gray-800)', margin: 0 }}>
                        Comparativa mensual
                    </h2>
                    {/* Badge de variación */}
                    <div style={{
                        padding: '4px 12px', borderRadius: 'var(--r-full)',
                        background: diferenciaCO2 >= 0 ? 'var(--eco-50)' : '#fef2f2',
                        border: `1px solid ${diferenciaCO2 >= 0 ? 'var(--eco-200)' : '#fca5a5'}`,
                        color: diferenciaCO2 >= 0 ? 'var(--eco-700)' : '#b91c1c',
                        fontSize: '0.82rem', fontWeight: '700',
                    }}>
                        {diferenciaCO2 >= 0 ? '▲' : '▼'} {Math.abs(diferenciaPct)}% vs mes anterior
                    </div>
                </div>

                {/* Dos columnas: mes actual vs anterior */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
                    {[
                        { label: mesActualNombre, kg: totalKgActual, co2: co2Actual, actual: true },
                        { label: mesAnteriorNombre, kg: totalKgAnterior, co2: co2Anterior, actual: false },
                    ].map((mes) => (
                        <div key={mes.label} style={{
                            background: mes.actual ? 'var(--eco-50)' : 'var(--gray-50)',
                            border: `1px solid ${mes.actual ? 'var(--eco-200)' : 'var(--gray-200)'}`,
                            borderRadius: 'var(--r-lg)', padding: 'var(--sp-4)',
                        }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--gray-500)', marginBottom: 'var(--sp-2)', textTransform: 'capitalize' }}>
                                {mes.actual ? '📅 ' : '📆 '}{mes.label}
                            </div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: mes.actual ? 'var(--eco-700)' : 'var(--gray-600)' }}>
                                {mes.kg.toFixed(1)} kg
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', marginTop: 'var(--sp-1)' }}>
                                🌿 {mes.co2.toFixed(2)} kg CO₂ evitado
                            </div>
                        </div>
                    ))}
                </div>

                {/* Barras por tipo de material */}
                <h3 style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--gray-600)', marginBottom: 'var(--sp-3)' }}>
                    Desglose por material
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {TIPOS_MATERIAL.map((tipo) => {
                        const actual   = kgMesActual[tipo.id] ?? 0;
                        const anterior = kgMesAnterior[tipo.id] ?? 0;
                        if (actual === 0 && anterior === 0) return null;
                        return (
                            <div key={tipo.id}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                    {tipo.icono} {tipo.nombre}
                  </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    {actual.toFixed(1)} kg / {anterior.toFixed(1)} kg
                  </span>
                                </div>
                                {/* Barra mes actual */}
                                <div style={{ height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden', marginBottom: '3px' }}>
                                    <div style={{
                                        width: `${(actual / maxKg) * 100}%`, height: '100%',
                                        background: 'linear-gradient(90deg, var(--eco-400), var(--eco-600))',
                                        borderRadius: '4px', transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                {/* Barra mes anterior */}
                                <div style={{ height: '5px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(anterior / maxKg) * 100}%`, height: '100%',
                                        background: 'var(--gray-300)',
                                        borderRadius: '4px', transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: '3px' }}>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--eco-600)', fontWeight: '600' }}>■ Este mes</span>
                                    <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>■ Mes anterior</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CO₂ por tipo — acumulado global */}
            <div style={{
                background: 'var(--white)', border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-xl)', padding: 'var(--sp-6)',
                boxShadow: 'var(--shadow-xs)',
            }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: 'var(--sp-5)' }}>
                    CO₂ evitado por tipo de material (total acumulado)
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {TIPOS_MATERIAL.map((tipo) => {
                        const kg  = kgTotalGlobal[tipo.id] ?? 0;
                        const co2 = kg * (CO2_POR_KG[tipo.id] ?? 0.5);
                        if (kg === 0) return null;
                        const pct = co2Global > 0 ? Math.round((co2 / co2Global) * 100) : 0;
                        return (
                            <div key={tipo.id} style={{
                                background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--r-md)', padding: 'var(--sp-3) var(--sp-4)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                  <span style={{ fontWeight: '600', color: 'var(--gray-800)', fontSize: '0.9rem' }}>
                    {tipo.icono} {tipo.nombre}
                  </span>
                                    <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700', color: 'var(--eco-700)', fontSize: '0.9rem' }}>
                      {co2.toFixed(2)} kg CO₂
                    </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginLeft: 'var(--sp-2)' }}>
                      ({kg.toFixed(1)} kg reciclados)
                    </span>
                                    </div>
                                </div>
                                <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${pct}%`, height: '100%',
                                        background: 'linear-gradient(90deg, var(--eco-400), var(--eco-600))',
                                        borderRadius: '3px', transition: 'width 0.6s ease',
                                    }} />
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '3px', textAlign: 'right' }}>
                                    {pct}% del total CO₂ evitado
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}