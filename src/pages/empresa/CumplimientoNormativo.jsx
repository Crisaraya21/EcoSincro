import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SOLICITUDES_MOCK, iconoResiduo, nombreResiduo } from '../../services/empresaService';

// Configuración del período
const PERIODO_DIAS = 30;
const VOLUMEN_MINIMO_KG = 100; // umbral normativo mock

function calcularPeriodo() {
  const hoy = new Date();
  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
  const diasTotales = fin.getDate();
  const diaActual = hoy.getDate();
  const porcentajePeriodo = (diaActual / diasTotales) * 100;
  return { inicio, fin, diasTotales, diaActual, porcentajePeriodo };
}

export default function CumplimientoNormativo() {
  const { currentUser, addNotification } = useAuth();
  const [periodoActivo, setPeriodoActivo] = useState('actual');

  const { inicio, fin, diasTotales, diaActual, porcentajePeriodo } = calcularPeriodo();

  // Solicitudes confirmadas del período actual
  const solicitudesConfirmadas = useMemo(() => {
    return SOLICITUDES_MOCK.filter(
      (s) =>
        s.empresaEmail === currentUser?.email &&
        s.estado === 'confirmado' &&
        new Date(s.fechaRetiro) >= inicio
    );
  }, [currentUser, inicio]);

  // Calcular volumen total entregado
  const volumenEntregado = useMemo(() => {
    return solicitudesConfirmadas.reduce((acc, s) => {
      return acc + s.residuos.reduce((a, r) => a + r.cantidad, 0);
    }, 0);
  }, [solicitudesConfirmadas]);

  const porcentajeCumplimiento = Math.min(
    (volumenEntregado / VOLUMEN_MINIMO_KG) * 100,
    100
  );

  // Alerta: menos del 80% de cumplimiento y más del 80% del período transcurrido
  const mostrarAlerta =
    porcentajeCumplimiento < 80 && porcentajePeriodo > 80;

  // Historial de períodos mock
  const historialPeriodos = [
    { periodo: 'Marzo 2026', volumen: 145, cumple: true },
    { periodo: 'Febrero 2026', volumen: 88, cumple: false },
    { periodo: 'Enero 2026', volumen: 120, cumple: true },
    { periodo: 'Diciembre 2025', volumen: 200, cumple: true },
  ];

  const colorBarra =
    porcentajeCumplimiento >= 80
      ? 'var(--eco-500)'
      : porcentajeCumplimiento >= 50
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div style={{ padding: 'var(--sp-6)', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: 'var(--sp-2)' }}>Cumplimiento Normativo</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--sp-6)' }}>
        Monitoreo del período {inicio.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}
      </p>

      {/* Alerta automática */}
      {mostrarAlerta && (
        <div style={{
          padding: 'var(--sp-4)',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: 'var(--r-md)',
          marginBottom: 'var(--sp-5)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--sp-3)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: '700', color: '#92400e', marginBottom: 'var(--sp-1)' }}>
              Alerta de Cumplimiento
            </div>
            <div style={{ fontSize: '0.9rem', color: '#78350f' }}>
              Has completado el {porcentajeCumplimiento.toFixed(0)}% del volumen requerido pero el período está al {porcentajePeriodo.toFixed(0)}%. Registrá más retiros antes del {fin.toLocaleDateString('es-CR')}.
            </div>
          </div>
        </div>
      )}

      {/* Panel principal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>

        {/* Porcentaje de cumplimiento */}
        <div style={{
          padding: 'var(--sp-5)',
          background: 'var(--white)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--r-md)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-3)', fontWeight: '600' }}>
            AVANCE DE CUMPLIMIENTO
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: colorBarra, marginBottom: 'var(--sp-3)' }}>
            {porcentajeCumplimiento.toFixed(0)}%
          </div>
          <div style={{ background: 'var(--gray-200)', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              background: colorBarra,
              height: '100%',
              width: `${porcentajeCumplimiento}%`,
              transition: 'width 0.5s ease',
              borderRadius: '999px'
            }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 'var(--sp-2)' }}>
            {volumenEntregado} kg de {VOLUMEN_MINIMO_KG} kg requeridos
          </div>
        </div>

        {/* Avance del período */}
        <div style={{
          padding: 'var(--sp-5)',
          background: 'var(--white)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--r-md)'
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 'var(--sp-3)', fontWeight: '600' }}>
            AVANCE DEL PERÍODO
          </div>
          <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--gray-700)', marginBottom: 'var(--sp-3)' }}>
            {diaActual}/{diasTotales}
          </div>
          <div style={{ background: 'var(--gray-200)', height: '10px', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              background: 'var(--gray-400)',
              height: '100%',
              width: `${porcentajePeriodo}%`,
              borderRadius: '999px'
            }} />
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 'var(--sp-2)' }}>
            Día {diaActual} de {diasTotales} — {(diasTotales - diaActual)} días restantes
          </div>
        </div>
      </div>

      {/* Solicitudes del período */}
      <div style={{
        padding: 'var(--sp-4)',
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--r-md)',
        marginBottom: 'var(--sp-6)'
      }}>
        <h2 style={{ marginBottom: 'var(--sp-4)', fontSize: '1.1rem' }}>Retiros confirmados este período</h2>

        {solicitudesConfirmadas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--sp-6)', color: 'var(--gray-500)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-2)' }}>📋</div>
            <p>No hay entregas confirmadas en el período actual. Registrá una coordinación de retiro para iniciar el seguimiento.</p>
          </div>
        ) : (
          solicitudesConfirmadas.map((sol) => (
            <div
              key={sol.id}
              style={{
                padding: 'var(--sp-3)',
                borderBottom: '1px solid var(--gray-100)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', marginBottom: 'var(--sp-1)' }}>{sol.receptorNombre}</div>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                  {sol.residuos.map((r, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.8rem',
                      background: 'var(--gray-100)',
                      padding: '2px 8px',
                      borderRadius: 'var(--r-full)',
                      color: 'var(--gray-700)'
                    }}>
                      {iconoResiduo(r.tipo)} {r.cantidad} kg
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                {new Date(sol.fechaRetiro).toLocaleDateString('es-CR')}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Historial de períodos */}
      <div style={{
        padding: 'var(--sp-4)',
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--r-md)'
      }}>
        <h2 style={{ marginBottom: 'var(--sp-4)', fontSize: '1.1rem' }}>Historial de cumplimiento</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
              <th style={{ textAlign: 'left', padding: 'var(--sp-2) var(--sp-3)', color: 'var(--gray-600)' }}>Período</th>
              <th style={{ textAlign: 'right', padding: 'var(--sp-2) var(--sp-3)', color: 'var(--gray-600)' }}>Volumen (kg)</th>
              <th style={{ textAlign: 'center', padding: 'var(--sp-2) var(--sp-3)', color: 'var(--gray-600)' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {historialPeriodos.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                <td style={{ padding: 'var(--sp-3)', fontWeight: '500' }}>{p.periodo}</td>
                <td style={{ textAlign: 'right', padding: 'var(--sp-3)' }}>{p.volumen} kg</td>
                <td style={{ textAlign: 'center', padding: 'var(--sp-3)' }}>
                  <span style={{
                    padding: '2px 10px',
                    borderRadius: 'var(--r-full)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    background: p.cumple ? 'var(--eco-50)' : '#fef2f2',
                    color: p.cumple ? 'var(--eco-700)' : '#b91c1c'
                  }}>
                    {p.cumple ? '✅ Cumplido' : '❌ Incumplido'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}