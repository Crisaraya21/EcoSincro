import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TIPOS_MATERIAL, iconoMaterial } from '../../services/receptorService';
import './receptor.css';

export default function GestionMateriales() {
  const { currentUser } = useAuth();
  const [materiales, setMateriales] = useState(currentUser?.materiales || []);
  const [horario, setHorario] = useState(currentUser?.horario || 'Lun–Vie 8:00–17:00');
  const [saved, setSaved] = useState(false);

  const toggleMaterial = (materialId) => {
    setMateriales((prev) => {
      if (prev.includes(materialId)) {
        return prev.filter((m) => m !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
    setSaved(false);
  };

  const handleSave = () => {
    // En una aplicación real, esto guardaría en el servidor
    localStorage.setItem('eco-materiales-' + currentUser?.email, JSON.stringify(materiales));
    localStorage.setItem('eco-horario-' + currentUser?.email, horario);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="gestion-materiales">
      <h1>Gestión de Materiales y Horarios</h1>

      {saved && (
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)',
          background: 'var(--green-50)',
          border: '1px solid var(--green-200)',
          borderRadius: 'var(--r-md)',
          color: 'var(--green-700)',
          fontWeight: '600',
          marginBottom: 'var(--sp-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-2)'
        }}>
          ✅ Cambios guardados exitosamente
        </div>
      )}

      {/* Materiales Aceptados */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--sp-4)' }}>Materiales que Aceptas</h2>
        
        {materiales.length === 0 && (
          <div style={{
            padding: 'var(--sp-4)',
            background: 'var(--yellow-50)',
            border: '1px solid var(--yellow-200)',
            borderRadius: 'var(--r-md)',
            color: 'var(--yellow-800)',
            marginBottom: 'var(--sp-4)'
          }}>
            ⚠️ Debes seleccionar al menos un material para que los ciudadanos te encuentren
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--sp-3)' }}>
          {TIPOS_MATERIAL.map((tipo) => (
            <div
              key={tipo.id}
              onClick={() => toggleMaterial(tipo.id)}
              style={{
                padding: 'var(--sp-4)',
                border: materiales.includes(tipo.id) ? '2px solid var(--eco-600)' : '1px solid var(--gray-300)',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer',
                transition: 'all var(--ease-fast)',
                background: materiales.includes(tipo.id) ? 'var(--eco-50)' : 'var(--white)',
                textAlign: 'center',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--eco-600)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = materiales.includes(tipo.id) ? 'var(--eco-600)' : 'var(--gray-300)'}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--sp-2)' }}>
                {iconoMaterial(tipo.id)}
              </div>
              <div style={{ fontWeight: '700', marginBottom: 'var(--sp-1)' }}>
                {tipo.nombre}
              </div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: materiales.includes(tipo.id) ? 'var(--eco-600)' : 'var(--gray-500)',
                marginTop: 'var(--sp-1)'
              }}>
                {materiales.includes(tipo.id) ? '✓ Seleccionado' : 'Click para seleccionar'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horarios */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: 'var(--sp-4)' }}>Horario de Atención</h2>
        
        <div style={{
          padding: 'var(--sp-4)',
          border: '1px solid var(--gray-300)',
          borderRadius: 'var(--r-md)',
          background: 'var(--white)'
        }}>
          <label style={{
            display: 'block',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--gray-600)',
            marginBottom: 'var(--sp-2)'
          }}>
            Horario (Ej: Lun–Vie 8:00–17:00, Sáb 9:00–13:00)
          </label>
          <input
            type="text"
            value={horario}
            onChange={(e) => {
              setHorario(e.target.value);
              setSaved(false);
            }}
            className="search-input"
            style={{ margin: 0 }}
          />
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--gray-500)',
            marginTop: 'var(--sp-2)'
          }}>
            💡 Usa un formato claro y conciso. Este horario aparecerá en las búsquedas de los ciudadanos.
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{
        padding: 'var(--sp-4)',
        background: 'var(--eco-50)',
        border: '1px solid var(--eco-200)',
        borderRadius: 'var(--r-md)',
        marginBottom: 'var(--sp-4)'
      }}>
        <h3 style={{ marginBottom: 'var(--sp-2)', color: 'var(--eco-700)' }}>ℹ️ Información</h3>
        <ul style={{ color: 'var(--eco-700)', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: 'var(--sp-4)' }}>
          <li>Los ciudadanos verán tu centro cuando busquen los materiales que aceptas</li>
          <li>Cualquier cambio se refleja inmediatamente en las búsquedas</li>
          <li>Debes tener al menos un material seleccionado para recibir entregas</li>
          <li>Actualiza tu horario según tus cambios operativos</li>
        </ul>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="btn-enter"
        style={{ width: '100%' }}
      >
        💾 Guardar Cambios
      </button>
    </div>
  );
}
