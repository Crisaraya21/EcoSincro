import { useState, useEffect, useRef } from 'react';
import {
  TIPOS_MATERIAL,
  buscarCentros,
  nombreMaterial,
} from '../../services/ciudadanoService';

const PROVINCIAS_CANTONES = [
  {
    provincia: 'San José',
    cantones: [
      { nombre: 'San José',        lat: 9.9281,  lng: -84.0907 },
      { nombre: 'Escazú',          lat: 9.9186,  lng: -84.1413 },
      { nombre: 'Desamparados',    lat: 9.8979,  lng: -84.0662 },
      { nombre: 'Puriscal',        lat: 9.8500,  lng: -84.3167 },
      { nombre: 'Tarrazú',         lat: 9.6667,  lng: -84.0167 },
      { nombre: 'Aserrí',          lat: 9.8500,  lng: -84.1000 },
      { nombre: 'Mora',            lat: 9.8833,  lng: -84.2500 },
      { nombre: 'Goicoechea',      lat: 9.9500,  lng: -84.0333 },
      { nombre: 'Santa Ana',       lat: 9.9333,  lng: -84.1833 },
      { nombre: 'Alajuelita',      lat: 9.9000,  lng: -84.1167 },
      { nombre: 'Vázquez de Coronado', lat: 9.9667, lng: -83.9833 },
      { nombre: 'Acosta',          lat: 9.7500,  lng: -84.1833 },
      { nombre: 'Tibás',           lat: 9.9600,  lng: -84.0820 },
      { nombre: 'Moravia',         lat: 9.9650,  lng: -84.0550 },
      { nombre: 'Montes de Oca',   lat: 9.9350,  lng: -84.0500 },
      { nombre: 'Turrubares',      lat: 9.8167,  lng: -84.4000 },
      { nombre: 'Dota',            lat: 9.6500,  lng: -83.9500 },
      { nombre: 'Curridabat',      lat: 9.9167,  lng: -84.0333 },
      { nombre: 'Pérez Zeledón',   lat: 9.3667,  lng: -83.7000 },
      { nombre: 'León Cortés',     lat: 9.7167,  lng: -84.0500 },
    ],
  },
  {
    provincia: 'Alajuela',
    cantones: [
      { nombre: 'Alajuela',        lat: 10.0167, lng: -84.2167 },
      { nombre: 'San Ramón',       lat: 10.0833, lng: -84.4667 },
      { nombre: 'Grecia',          lat: 10.0667, lng: -84.3167 },
      { nombre: 'San Mateo',       lat: 9.9833,  lng: -84.5167 },
      { nombre: 'Atenas',          lat: 9.9833,  lng: -84.3833 },
      { nombre: 'Naranjo',         lat: 10.1000, lng: -84.3833 },
      { nombre: 'Palmares',        lat: 10.0500, lng: -84.4333 },
      { nombre: 'Poás',            lat: 10.1167, lng: -84.2333 },
      { nombre: 'Orotina',         lat: 9.9000,  lng: -84.5167 },
      { nombre: 'San Carlos',      lat: 10.3333, lng: -84.5167 },
      { nombre: 'Zarcero',         lat: 10.1833, lng: -84.3833 },
      { nombre: 'Sarchí',          lat: 10.1000, lng: -84.3500 },
      { nombre: 'Upala',           lat: 10.8833, lng: -85.0167 },
      { nombre: 'Los Chiles',      lat: 11.0333, lng: -84.7167 },
      { nombre: 'Guatuso',         lat: 10.6667, lng: -84.8333 },
      { nombre: 'Río Cuarto',      lat: 10.5667, lng: -84.2167 },
    ],
  },
  {
    provincia: 'Cartago',
    cantones: [
      { nombre: 'Cartago',         lat: 9.8633,  lng: -83.9200 },
      { nombre: 'Paraíso',         lat: 9.8333,  lng: -83.8667 },
      { nombre: 'La Unión',        lat: 9.9000,  lng: -83.9833 },
      { nombre: 'Jiménez',         lat: 9.7833,  lng: -83.7333 },
      { nombre: 'Turrialba',       lat: 9.9000,  lng: -83.6833 },
      { nombre: 'Alvarado',        lat: 9.9833,  lng: -83.8333 },
      { nombre: 'Oreamuno',        lat: 9.9333,  lng: -83.8833 },
      { nombre: 'El Guarco',       lat: 9.8167,  lng: -83.9833 },
    ],
  },
  {
    provincia: 'Heredia',
    cantones: [
      { nombre: 'Heredia',         lat: 9.9980,  lng: -84.1170 },
      { nombre: 'Barva',           lat: 10.0167, lng: -84.1333 },
      { nombre: 'Santo Domingo',   lat: 9.9833,  lng: -84.0833 },
      { nombre: 'Santa Bárbara',   lat: 10.0333, lng: -84.1667 },
      { nombre: 'San Rafael',      lat: 10.0333, lng: -84.1000 },
      { nombre: 'San Isidro',      lat: 10.0500, lng: -84.0667 },
      { nombre: 'Belén',           lat: 9.9833,  lng: -84.1833 },
      { nombre: 'Flores',          lat: 10.0000, lng: -84.1667 },
      { nombre: 'San Pablo',       lat: 10.0000, lng: -84.1000 },
      { nombre: 'Sarapiquí',       lat: 10.4333, lng: -83.9167 },
    ],
  },
  {
    provincia: 'Guanacaste',
    cantones: [
      { nombre: 'Liberia',         lat: 10.6333, lng: -85.4333 },
      { nombre: 'Nicoya',          lat: 10.1500, lng: -85.4500 },
      { nombre: 'Santa Cruz',      lat: 10.2667, lng: -85.5833 },
      { nombre: 'Bagaces',         lat: 10.5333, lng: -85.2500 },
      { nombre: 'Carrillo',        lat: 10.4167, lng: -85.4833 },
      { nombre: 'Cañas',           lat: 10.4333, lng: -85.1000 },
      { nombre: 'Abangares',       lat: 10.2833, lng: -85.0167 },
      { nombre: 'Tilarán',         lat: 10.4667, lng: -84.9833 },
      { nombre: 'Nandayure',       lat: 9.9833,  lng: -85.2000 },
      { nombre: 'La Cruz',         lat: 11.0667, lng: -85.6333 },
      { nombre: 'Hojancha',        lat: 10.0833, lng: -85.3833 },
    ],
  },
  {
    provincia: 'Puntarenas',
    cantones: [
      { nombre: 'Puntarenas',      lat: 9.9767,  lng: -84.8317 },
      { nombre: 'Esparza',         lat: 9.9833,  lng: -84.6667 },
      { nombre: 'Buenos Aires',    lat: 9.1667,  lng: -83.3333 },
      { nombre: 'Montes de Oro',   lat: 10.0667, lng: -84.6500 },
      { nombre: 'Osa',             lat: 8.9167,  lng: -83.4667 },
      { nombre: 'Quepos',          lat: 9.4333,  lng: -84.1667 },
      { nombre: 'Golfito',         lat: 8.6500,  lng: -83.1833 },
      { nombre: 'Coto Brus',       lat: 8.9667,  lng: -82.9667 },
      { nombre: 'Parrita',         lat: 9.5167,  lng: -84.3333 },
      { nombre: 'Corredores',      lat: 8.5500,  lng: -83.0333 },
      { nombre: 'Garabito',        lat: 9.6000,  lng: -84.6167 },
    ],
  },
  {
    provincia: 'Limón',
    cantones: [
      { nombre: 'Limón',           lat: 9.9833,  lng: -83.0333 },
      { nombre: 'Pococí',          lat: 10.3333, lng: -83.5833 },
      { nombre: 'Siquirres',       lat: 10.1000, lng: -83.5000 },
      { nombre: 'Talamanca',       lat: 9.5667,  lng: -82.9667 },
      { nombre: 'Matina',          lat: 10.1000, lng: -83.3000 },
      { nombre: 'Guácimo',         lat: 10.2167, lng: -83.6833 },
    ],
  },
];

// Lista plana para búsqueda
const TODOS_LOS_CANTONES = PROVINCIAS_CANTONES.flatMap((p) =>
  p.cantones.map((c) => ({ ...c, provincia: p.provincia }))
);

export default function BuscadorPuntos() {
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [radio, setRadio] = useState(50);
  const [expandiendo, setExpandiendo] = useState(false);

  // Ubicación
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
  const [cantonSeleccionado, setCantonSeleccionado] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 9.9281, lng: -84.0907 });

  // Buscador de cantón
  const [busquedaCanton, setBusquedaCanton] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  const cantonesFiltrados = busquedaCanton.length >= 1
    ? TODOS_LOS_CANTONES.filter((c) =>
        c.nombre.toLowerCase().includes(busquedaCanton.toLowerCase()) ||
        c.provincia.toLowerCase().includes(busquedaCanton.toLowerCase())
      ).slice(0, 8)
    : provinciaSeleccionada
    ? PROVINCIAS_CANTONES.find((p) => p.provincia === provinciaSeleccionada)?.cantones.map(
        (c) => ({ ...c, provincia: provinciaSeleccionada })
      ) || []
    : [];

  const seleccionarCanton = (canton) => {
    setCantonSeleccionado(canton);
    setUserLocation({ lat: canton.lat, lng: canton.lng });
    setBusquedaCanton(canton.nombre);
    setProvinciaSeleccionada(canton.provincia);
    setShowDropdown(false);
    setRadio(50);
  };

  // Buscar centros cuando cambian filtros, ubicación o radio
  useEffect(() => {
    if (!cantonSeleccionado) return;
    const { lat, lng } = userLocation;
    const res = buscarCentros(lat, lng, materialesSeleccionados, radio);
    setResultados(res);

    if (res.length === 0 && materialesSeleccionados.length > 0 && radio < 150) {
      setExpandiendo(true);
      const timer = setTimeout(() => {
        setRadio((r) => r + 50);
        setExpandiendo(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setExpandiendo(false);
    }
  }, [materialesSeleccionados, radio, userLocation, cantonSeleccionado]);

  const toggleMaterial = (materialId) => {
    setRadio(50);
    setMaterialesSeleccionados((prev) =>
      prev.includes(materialId)
        ? prev.filter((m) => m !== materialId)
        : [...prev, materialId]
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="buscador-header">
        <h1>Encuentra tu punto de reciclaje</h1>
        <p>Selecciona los materiales que tienes y te mostramos los centros más cercanos</p>
      </div>

      {/* Location selector */}
      <div className="location-bar" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          {/* Provincia */}
          <div style={{ flex: '1', minWidth: '160px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--sp-1)' }}>
              Provincia
            </label>
            <select
              value={provinciaSeleccionada}
              onChange={(e) => {
                setProvinciaSeleccionada(e.target.value);
                setCantonSeleccionado(null);
                setBusquedaCanton('');
                setResultados([]);
              }}
              style={{
                width: '100%',
                padding: 'var(--sp-2) var(--sp-3)',
                borderRadius: 'var(--r-lg)',
                border: '1.5px solid var(--gray-200)',
                fontSize: '0.875rem',
                color: 'var(--gray-700)',
                background: 'var(--white)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Seleccionar...</option>
              {PROVINCIAS_CANTONES.map((p) => (
                <option key={p.provincia} value={p.provincia}>{p.provincia}</option>
              ))}
            </select>
          </div>

          {/* Cantón con búsqueda */}
          <div style={{ flex: '2', minWidth: '200px', position: 'relative' }} ref={inputRef}>
            <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 'var(--sp-1)' }}>
              Cantón
            </label>
            <input
              type="text"
              placeholder={provinciaSeleccionada ? 'Buscar cantón...' : 'Primero selecciona provincia'}
              value={busquedaCanton}
              onChange={(e) => {
                setBusquedaCanton(e.target.value);
                setShowDropdown(true);
                if (e.target.value === '') {
                  setCantonSeleccionado(null);
                  setResultados([]);
                }
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              disabled={!provinciaSeleccionada && busquedaCanton === ''}
              style={{
                width: '100%',
                padding: 'var(--sp-2) var(--sp-3)',
                borderRadius: 'var(--r-lg)',
                border: cantonSeleccionado ? '1.5px solid var(--eco-400)' : '1.5px solid var(--gray-200)',
                fontSize: '0.875rem',
                color: 'var(--gray-700)',
                background: 'var(--white)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {/* Dropdown */}
            {showDropdown && cantonesFiltrados.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-lg)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 100,
                maxHeight: '220px',
                overflowY: 'auto',
              }}>
                {cantonesFiltrados.map((c) => (
                  <div
                    key={`${c.provincia}-${c.nombre}`}
                    onMouseDown={() => seleccionarCanton(c)}
                    style={{
                      padding: 'var(--sp-2) var(--sp-4)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--gray-700)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--eco-50)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{c.nombre}</span>
                    {busquedaCanton && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{c.provincia}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estado de ubicación */}
        {cantonSeleccionado && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
            <div className="location-dot" style={{ background: 'var(--eco-500)', boxShadow: '0 0 0 3px var(--eco-100)' }} />
            <span className="location-text">
              📍 {cantonSeleccionado.nombre}, {cantonSeleccionado.provincia}
              <span className="location-coords">
                ({cantonSeleccionado.lat.toFixed(4)}, {cantonSeleccionado.lng.toFixed(4)})
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Material filters */}
      <div className="filtros-section">
        <p className="filtros-label">Filtrar por material</p>
        <div className="filtros-chips">
          {TIPOS_MATERIAL.map((mat) => (
            <button
              key={mat.id}
              className={`chip ${materialesSeleccionados.includes(mat.id) ? 'active' : ''}`}
              onClick={() => toggleMaterial(mat.id)}
            >
              <span className="chip-icon">{mat.icono}</span>
              {mat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Results bar */}
      {cantonSeleccionado && (
        <div className="resultados-bar">
          <span className="resultados-count">
            <strong>{resultados.length}</strong> centro{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
          </span>
          {radio > 50 && <span className="radio-badge">Radio: {radio} km</span>}
        </div>
      )}

      {/* Expanding message */}
      {expandiendo && (
        <div className="empty-state">
          <h3>No se encontraron puntos cercanos para este material</h3>
          <p className="expanding-msg">Ampliando el radio de búsqueda...</p>
        </div>
      )}

      {/* Sin cantón seleccionado */}
      {!cantonSeleccionado && (
        <div className="empty-state">
          <div className="empty-icon">📍</div>
          <h3>¿Dónde estás?</h3>
          <p>Seleccioná tu provincia y cantón para encontrar los centros de reciclaje más cercanos.</p>
        </div>
      )}

      {/* Sin materiales seleccionados */}
      {cantonSeleccionado && !expandiendo && resultados.length === 0 && materialesSeleccionados.length === 0 && (
        <div className="empty-state">
          <h3>Selecciona un material</h3>
          <p>Elige los materiales que deseas reciclar para ver los centros disponibles.</p>
        </div>
      )}

      {/* Sin resultados */}
      {cantonSeleccionado && !expandiendo && resultados.length === 0 && materialesSeleccionados.length > 0 && (
        <div className="empty-state">
          <h3>No se encontraron centros</h3>
          <p>No hay centros de acopio para los materiales seleccionados en tu zona.</p>
        </div>
      )}

      {/* Results grid */}
      {!expandiendo && resultados.length > 0 && (
        <div className="centros-grid">
          {resultados.map((centro) => (
            <div key={centro.id} className="centro-card">
              <div className="centro-card-top">
                <span className="centro-nombre">{centro.nombre}</span>
                <span className="distancia-badge">{centro.distancia.toFixed(1)} km</span>
              </div>
              <p className="centro-direccion">
                <span>📍</span> {centro.direccion}
              </p>
              <div className="centro-materiales">
                {centro.materiales.map((m) => (
                  <span key={m} className={`material-tag ${m}`}>
                    {nombreMaterial(m)}
                  </span>
                ))}
              </div>
              <div className="centro-footer">
                <span className="centro-horario">Horario: {centro.horario}</span>
                <span className={`centro-estado ${centro.estado}`}>
                  <span className={`status-dot ${centro.estado}`} />
                  {centro.estado === 'abierto' ? 'Abierto' : 'Cerrado'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}