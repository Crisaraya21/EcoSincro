import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TIPOS_MATERIAL, iconoMaterial, nombreMaterial } from '../../services/receptorService';
import './receptor.css';

export default function Inventario() {
  const { currentUser } = useAuth();
  const [inventario, setInventario] = useState(() => {
    const saved = localStorage.getItem('eco-inventario-' + currentUser?.email);
    if (saved) return JSON.parse(saved);
    
    // Mock por defecto
    return {
      plastico: 127.5,
      vidrio: 85.0,
      carton: 156.8,
      no_convencional: 12.3
    };
  });

  const totalMateriales = Object.values(inventario).reduce((a, b) => a + b, 0);

  // Calcular porcentaje máximo para la barra de progreso
  const maxValue = Math.max(...Object.values(inventario), 1);

  return (
    <div className="inventario-page">
      <h1>Inventario Acumulado</h1>

      {/* Total Summary */}
      <div style={{
        padding: 'var(--sp-4)',
        background: 'linear-gradient(135deg, var(--eco-600), var(--eco-800))',
        borderRadius: 'var(--r-md)',
        color: 'white',
        marginBottom: 'var(--sp-6)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: 'var(--sp-1)' }}>
          {totalMateriales.toFixed(1)}
        </div>
        <div style={{ fontSize: '1rem', opacity: 0.9 }}>
          kg totales de materiales
        </div>
      </div>

      {/* Materiales Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
        {TIPOS_MATERIAL.map((tipo) => {
          const cantidad = inventario[tipo.id] || 0;
          const porcentaje = (cantidad / maxValue) * 100;

          return (
            <div
              key={tipo.id}
              style={{
                padding: 'var(--sp-4)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-md)',
                background: 'var(--white)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                <div style={{ fontSize: '2rem' }}>{iconoMaterial(tipo.id)}</div>
                <div>
                  <div style={{ fontWeight: '700' }}>{tipo.nombre}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--eco-600)' }}>
                    {cantidad.toFixed(1)} kg
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{
                background: 'var(--gray-200)',
                height: '8px',
                borderRadius: '999px',
                overflow: 'hidden',
                marginTop: 'var(--sp-3)'
              }}>
                <div style={{
                  background: 'var(--eco-600)',
                  height: '100%',
                  width: `${porcentaje}%`,
                  transition: 'width var(--ease-fast)'
                }} />
              </div>

              {/* Percentage */}
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--gray-600)',
                marginTop: 'var(--sp-1)',
                textAlign: 'right'
              }}>
                {((cantidad / totalMateriales) * 100).toFixed(1)}% del total
              </div>
            </div>
          );
        })}
      </div>

      {/* Table View */}
      <div style={{
        padding: 'var(--sp-4)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--r-md)',
        background: 'var(--white)',
        overflowX: 'auto'
      }}>
        <h2 style={{ marginBottom: 'var(--sp-4)' }}>Detalles por Material</h2>
        
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.95rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--gray-300)' }}>
              <th style={{ textAlign: 'left', padding: 'var(--sp-3)', fontWeight: '700', color: 'var(--gray-700)' }}>
                Material
              </th>
              <th style={{ textAlign: 'right', padding: 'var(--sp-3)', fontWeight: '700', color: 'var(--gray-700)' }}>
                Cantidad (kg)
              </th>
              <th style={{ textAlign: 'right', padding: 'var(--sp-3)', fontWeight: '700', color: 'var(--gray-700)' }}>
                % del Total
              </th>
            </tr>
          </thead>
          <tbody>
            {TIPOS_MATERIAL.map((tipo) => {
              const cantidad = inventario[tipo.id] || 0;
              const porcentaje = totalMateriales > 0 ? (cantidad / totalMateriales) * 100 : 0;

              return (
                <tr key={tipo.id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: 'var(--sp-3)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{iconoMaterial(tipo.id)}</span>
                    {tipo.nombre}
                  </td>
                  <td style={{ textAlign: 'right', padding: 'var(--sp-3)', fontWeight: '600' }}>
                    {cantidad.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', padding: 'var(--sp-3)', color: 'var(--eco-600)', fontWeight: '600' }}>
                    {porcentaje.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
            <tr style={{ background: 'var(--gray-50)', fontWeight: '700', fontSize: '1rem' }}>
              <td style={{ padding: 'var(--sp-3)' }}>TOTAL</td>
              <td style={{ textAlign: 'right', padding: 'var(--sp-3)' }}>{totalMateriales.toFixed(2)} kg</td>
              <td style={{ textAlign: 'right', padding: 'var(--sp-3)', color: 'var(--eco-600)' }}>100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div style={{
        marginTop: 'var(--sp-6)',
        padding: 'var(--sp-4)',
        background: 'var(--eco-50)',
        border: '1px solid var(--eco-200)',
        borderRadius: 'var(--r-md)'
      }}>
        <h3 style={{ marginBottom: 'var(--sp-2)', color: 'var(--eco-700)' }}>ℹ️ Acerca de tu Inventario</h3>
        <ul style={{ color: 'var(--eco-700)', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: 'var(--sp-4)' }}>
          <li>El inventario se actualiza automáticamente cuando apruebas entregas</li>
          <li>Estos datos son acumulados desde que comenzaste a recibir materiales</li>
          <li>El total refleja todos los materiales actualmente en tu centro</li>
          <li>Usa esta información para monitorear tu capacidad de almacenamiento</li>
        </ul>
      </div>
    </div>
  );
}
