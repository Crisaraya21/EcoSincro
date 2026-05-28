import { useState, useEffect, useCallback } from 'react';
import {
  TIPOS_MATERIAL,
  UBICACION_USUARIO,
  buscarCentros,
  nombreMaterial,
} from '../../services/ciudadanoService';

export default function BuscadorPuntos() {
  const [materialesSeleccionados, setMaterialesSeleccionados] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [radio, setRadio] = useState(10);
  const [expandiendo, setExpandiendo] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 9.9281, lng: -84.0907 });
  const [isRealLocation, setIsRealLocation] = useState(false);

  // ── Solicitar ubicación real del ciudadano al cargar ──
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsRealLocation(true);
        },
        (error) => {
          console.warn('Acceso a ubicación denegado. Usando aproximación.', error);
          setIsRealLocation(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  const { lat, lng } = userLocation;

  // ── Buscar centros cuando cambian filtros, ubicación o radio ──
  const ejecutarBusqueda = useCallback(
    (radioActual) => {
      const res = buscarCentros(lat, lng, materialesSeleccionados, radioActual);
      return res;
    },
    [lat, lng, materialesSeleccionados]
  );

  useEffect(() => {
    const res = ejecutarBusqueda(radio);
    setResultados(res);

    // Si no hay resultados y el radio es pequeño, expandir
    if (res.length === 0 && materialesSeleccionados.length > 0 && radio < 50) {
      setExpandiendo(true);
      const timer = setTimeout(() => {
        const nuevoRadio = 50;
        setRadio(nuevoRadio);
        const resExpandido = ejecutarBusqueda(nuevoRadio);
        setResultados(resExpandido);
        setExpandiendo(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setExpandiendo(false);
    }
  }, [materialesSeleccionados, radio, ejecutarBusqueda]);

  // ── Toggle material filter ──
  const toggleMaterial = (materialId) => {
    setRadio(10); // Reset radio al cambiar filtro
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

      {/* Location bar */}
      <div className="location-bar">
        <div 
          className="location-dot" 
          style={{
            background: isRealLocation ? 'var(--eco-500)' : 'var(--warning)',
            boxShadow: isRealLocation ? '0 0 0 3px var(--eco-100)' : '0 0 0 3px #fef3c7'
          }} 
        />
        <span className="location-text">
          {isRealLocation ? '📍 Mi ubicación actual (GPS)' : '📍 Ubicación aproximada (Costa Rica)'}
          <span className="location-coords">
            ({lat.toFixed(4)}, {lng.toFixed(4)})
          </span>
        </span>
      </div>

      {/* Material filters */}
      <div className="filtros-section">
        <p className="filtros-label">Filtrar por material</p>
        <div className="filtros-chips">
          {TIPOS_MATERIAL.map((mat) => (
            <button
              key={mat.id}
              id={`chip-${mat.id}`}
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
      <div className="resultados-bar">
        <span className="resultados-count">
          <strong>{resultados.length}</strong> centro{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
        </span>
        {radio > 10 && <span className="radio-badge">Radio: {radio} km</span>}
      </div>

      {/* Expanding message */}
      {expandiendo && (
        <div className="empty-state">
          <h3>No se encontraron puntos cercanos para este material</h3>
          <p className="expanding-msg">Ampliando el radio de búsqueda...</p>
        </div>
      )}

      {/* No results (after expanding) */}
      {!expandiendo && resultados.length === 0 && materialesSeleccionados.length > 0 && (
        <div className="empty-state">
          <h3>No se encontraron centros</h3>
          <p>No hay centros de acopio para los materiales seleccionados en tu zona.</p>
        </div>
      )}

      {/* No filters selected */}
      {!expandiendo && resultados.length === 0 && materialesSeleccionados.length === 0 && (
        <div className="empty-state">
          <h3>Selecciona un material</h3>
          <p>Elige los materiales que deseas reciclar para ver los centros disponibles.</p>
        </div>
      )}

      {/* Results grid */}
      {!expandiendo && resultados.length > 0 && (
        <div className="centros-grid">
          {resultados.map((centro) => (
            <div key={centro.id} className="centro-card" id={`centro-${centro.id}`}>
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
