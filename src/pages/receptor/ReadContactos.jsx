import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { nombreMaterial, iconoMaterial, TIPOS_MATERIAL } from '../../services/receptorService';
import './receptor.css';

export default function RedContactos() {
  const { currentUser, deliveries, addNotification } = useAuth();

  // Construir directorio desde entregas aprobadas de este receptor
  const contactos = useMemo(() => {
    const entregasAprobadas = (deliveries || []).filter(
      (e) => e.receptorId === currentUser?.email && e.estado === 'aprobado'
    );

    const mapa = {};
    entregasAprobadas.forEach((e) => {
      if (!mapa[e.ciudadanoId || e.ciudadanoNombre]) {
        mapa[e.ciudadanoId || e.ciudadanoNombre] = {
          id: e.ciudadanoId || e.ciudadanoNombre,
          nombre: e.ciudadanoNombre,
          entregas: 0,
          materiales: {},
          frecuente: false,
        };
      }
      const c = mapa[e.ciudadanoId || e.ciudadanoNombre];
      c.entregas += 1;
      (e.materiales || []).forEach(({ tipo, cantidad }) => {
        c.materiales[tipo] = (c.materiales[tipo] || 0) + Number(cantidad);
      });
    });

    // Cargar etiquetas frecuentes desde localStorage
    const frecuentes = JSON.parse(
      localStorage.getItem('eco-frecuentes-' + currentUser?.email) || '[]'
    );
    return Object.values(mapa).map((c) => ({
      ...c,
      frecuente: frecuentes.includes(c.id),
    }));
  }, [deliveries, currentUser]);

  // Ordenar: frecuentes primero
  const contactosOrdenados = [...contactos].sort((a, b) =>
    b.frecuente - a.frecuente
  );

  const [busqueda, setBusqueda] = useState('');
  const [selectedContacto, setSelectedContacto] = useState(null);
  const [modalMensaje, setModalMensaje] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [frecuentesState, setFrecuentesState] = useState(() =>
    JSON.parse(localStorage.getItem('eco-frecuentes-' + currentUser?.email) || '[]')
  );

  const contactosFiltrados = contactosOrdenados.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const toggleFrecuente = (contactoId) => {
    const nuevos = frecuentesState.includes(contactoId)
      ? frecuentesState.filter((id) => id !== contactoId)
      : [...frecuentesState, contactoId];
    setFrecuentesState(nuevos);
    localStorage.setItem(
      'eco-frecuentes-' + currentUser?.email,
      JSON.stringify(nuevos)
    );
  };

  const handleEnviarMensaje = () => {
    if (!mensaje.trim() || !selectedContacto) return;
    addNotification({
      id: Date.now(),
      tipo: 'info',
      mensaje: `Mensaje enviado a ${selectedContacto.nombre}: "${mensaje}"`,
      leida: false,
      fecha: new Date(),
    });
    setMensaje('');
    setModalMensaje(false);
    setSelectedContacto(null);
  };

  return (
    <div className="red-contactos">
      <h1>Red de Contactos</h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--sp-6)' }}>
        Recicladores con al menos una entrega confirmada en tu centro.
      </p>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar reciclador por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="search-input"
        style={{ marginBottom: 'var(--sp-5)' }}
      />

      {/* Lista vacía */}
      {contactosFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--sp-8)',
          color: 'var(--gray-500)',
          background: 'var(--white)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--gray-200)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-3)' }}>👥</div>
          <p style={{ fontWeight: '600' }}>
            {busqueda
              ? 'No se encontraron contactos con ese nombre.'
              : 'Aún no tienes recicladores en tu red. Las entregas confirmadas irán apareciendo aquí.'}
          </p>
        </div>
      )}

      {/* Tarjetas de contactos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
        {contactosFiltrados.map((contacto) => {
          const esFrecuente = frecuentesState.includes(contacto.id);
          return (
            <div
              key={contacto.id}
              style={{
                padding: 'var(--sp-4)',
                border: `1px solid ${esFrecuente ? 'var(--eco-400)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--r-md)',
                background: esFrecuente ? 'var(--eco-50)' : 'var(--white)',
                transition: 'all var(--ease-fast)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '50%',
                    background: 'var(--eco-100)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', fontWeight: '700', color: 'var(--eco-700)'
                  }}>
                    {contacto.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{contacto.nombre}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                      {contacto.entregas} entrega{contacto.entregas !== 1 ? 's' : ''} confirmada{contacto.entregas !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  {/* Botón frecuente */}
                  <button
                    onClick={() => toggleFrecuente(contacto.id)}
                    title={esFrecuente ? 'Quitar de frecuentes' : 'Marcar como frecuente'}
                    style={{
                      padding: 'var(--sp-2) var(--sp-3)',
                      borderRadius: 'var(--r-md)',
                      border: `1px solid ${esFrecuente ? 'var(--eco-400)' : 'var(--gray-300)'}`,
                      background: esFrecuente ? 'var(--eco-100)' : 'var(--white)',
                      color: esFrecuente ? 'var(--eco-700)' : 'var(--gray-500)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all var(--ease-fast)'
                    }}
                  >
                    {esFrecuente ? '⭐ Frecuente' : '☆ Marcar'}
                  </button>

                  {/* Botón mensaje */}
                  <button
                    onClick={() => { setSelectedContacto(contacto); setModalMensaje(true); }}
                    style={{
                      padding: 'var(--sp-2) var(--sp-3)',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--eco-300)',
                      background: 'var(--white)',
                      color: 'var(--eco-700)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all var(--ease-fast)'
                    }}
                  >
                    ✉️ Mensaje
                  </button>
                </div>
              </div>

              {/* Materiales entregados */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                {Object.entries(contacto.materiales).map(([tipo, cantidad]) => (
                  <div
                    key={tipo}
                    style={{
                      padding: 'var(--sp-1) var(--sp-3)',
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--r-full)',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--gray-700)'
                    }}
                  >
                    {iconoMaterial(tipo)} {nombreMaterial(tipo)}: {cantidad} kg
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal mensaje */}
      {modalMensaje && selectedContacto && (
        <div className="modal-overlay" onClick={() => setModalMensaje(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Enviar mensaje a {selectedContacto.nombre}</h2>
            <p style={{ marginTop: 'var(--sp-2)', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Informá cambios en materiales, horarios o capacidad disponible.
            </p>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Ej: A partir del lunes ya no aceptamos vidrio por capacidad llena."
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
              <button onClick={() => setModalMensaje(false)} className="btn-secondary" style={{ flex: 1 }}>
                Cancelar
              </button>
              <button
                onClick={handleEnviarMensaje}
                disabled={!mensaje.trim()}
                className="btn-enter"
                style={{ flex: 1, opacity: !mensaje.trim() ? 0.5 : 1 }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}