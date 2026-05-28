/*  ──────────────────────────────────────────────
    CIUDADANO SERVICE — Mock Data & Utilities
    ────────────────────────────────────────────── */

// ── Tipos de material ──
export const TIPOS_MATERIAL = [
  { id: 'plastico',         nombre: 'Plástico',                   icono: '🧴' },
  { id: 'vidrio',           nombre: 'Vidrio',                     icono: '🫙' },
  { id: 'carton',           nombre: 'Cartón',                     icono: '📦' },
  { id: 'no_convencional',  nombre: 'Residuos No Convencionales', icono: '⚠️' },
];

// ── Coordenadas fijas del usuario (San José, Costa Rica) ──
export const UBICACION_USUARIO = { lat: 9.9281, lng: -84.0907 };

// ── Centros de acopio mock ──
const CENTROS_DE_ACOPIO = [
  {
    id: 1,
    nombre: 'EcoPunto Central',
    direccion: 'Av. Central #45, San José Centro',
    lat: 9.9340,
    lng: -84.0870,
    materiales: ['plastico', 'vidrio', 'carton'],
    estado: 'abierto',
    horario: 'Lun–Vie 8:00–17:00',
    telefono: '2222-3344',
  },
  {
    id: 2,
    nombre: 'ReciVerde Norte',
    direccion: 'Calle 12, Barrio Tournón',
    lat: 9.9520,
    lng: -84.0750,
    materiales: ['plastico', 'carton'],
    estado: 'abierto',
    horario: 'Lun–Sáb 7:00–16:00',
    telefono: '2233-5566',
  },
  {
    id: 3,
    nombre: 'Centro Reciclaje del Sur',
    direccion: 'Av. 8, Hatillo',
    lat: 9.9100,
    lng: -84.0950,
    materiales: ['vidrio', 'no_convencional'],
    estado: 'abierto',
    horario: 'Lun–Vie 9:00–15:00',
    telefono: '2244-7788',
  },
  {
    id: 4,
    nombre: 'AmbienTico Reciclaje',
    direccion: 'Calle 3, Sabana Oeste',
    lat: 9.9450,
    lng: -84.1020,
    materiales: ['plastico', 'vidrio', 'carton', 'no_convencional'],
    estado: 'abierto',
    horario: 'Lun–Dom 6:00–18:00',
    telefono: '2255-1122',
  },
  {
    id: 5,
    nombre: 'Punto Verde Escazú',
    direccion: 'Ruta 27, Plaza Colonial',
    lat: 9.9200,
    lng: -84.1350,
    materiales: ['plastico', 'vidrio'],
    estado: 'cerrado',
    horario: 'Lun–Vie 8:00–12:00',
    telefono: '2266-3344',
  },
  {
    id: 6,
    nombre: 'EcoRecolecta Heredia',
    direccion: 'Av. 1, Centro Heredia',
    lat: 9.9980,
    lng: -84.1170,
    materiales: ['carton', 'no_convencional'],
    estado: 'abierto',
    horario: 'Mar–Sáb 7:30–15:30',
    telefono: '2277-5566',
  },
  {
    id: 7,
    nombre: 'Recicladora del Este',
    direccion: 'Calle 5, San Pedro',
    lat: 9.9350,
    lng: -84.0500,
    materiales: ['plastico', 'vidrio', 'carton'],
    estado: 'abierto',
    horario: 'Lun–Vie 8:00–17:00',
    telefono: '2288-9900',
  },
  {
    id: 8,
    nombre: 'Centro Ambiental Desamparados',
    direccion: 'Av. Principal, Desamparados Centro',
    lat: 9.8950,
    lng: -84.0600,
    materiales: ['plastico', 'no_convencional'],
    estado: 'abierto',
    horario: 'Lun–Vie 7:00–14:00',
    telefono: '2299-1100',
  },
  {
    id: 9,
    nombre: 'ReciPunto Tibás',
    direccion: 'Calle 8, San Juan de Tibás',
    lat: 9.9600,
    lng: -84.0820,
    materiales: ['vidrio', 'carton'],
    estado: 'cerrado',
    horario: 'Lun–Vie 9:00–13:00',
    telefono: '2211-2233',
  },
  {
    id: 10,
    nombre: 'Verde Limpio Moravia',
    direccion: 'Av. Central, San Vicente de Moravia',
    lat: 9.9650,
    lng: -84.0550,
    materiales: ['plastico', 'vidrio', 'carton', 'no_convencional'],
    estado: 'abierto',
    horario: 'Lun–Sáb 6:30–17:30',
    telefono: '2222-4455',
  },
];

// ── Haversine — distancia en km ──
function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Buscar centros con filtro de materiales y radio ──
export function buscarCentros(userLat, userLng, materialesFiltro = [], radioKm = 50) {
  let resultados = CENTROS_DE_ACOPIO.map((centro) => ({
    ...centro,
    distancia: calcularDistancia(userLat, userLng, centro.lat, centro.lng),
  }));

  // Filtrar por radio
  resultados = resultados.filter((c) => c.distancia <= radioKm);

  // Filtrar por materiales (si hay seleccionados)
  if (materialesFiltro.length > 0) {
    resultados = resultados.filter((c) =>
      materialesFiltro.some((mat) => c.materiales.includes(mat))
    );
  }

  // Ordenar por distancia ascendente
  resultados.sort((a, b) => a.distancia - b.distancia);

  return resultados;
}

// ── Obtener nombre legible de material ──
export function nombreMaterial(id) {
  const tipo = TIPOS_MATERIAL.find((t) => t.id === id);
  return tipo ? tipo.nombre : id;
}

// ── Obtener todos los centros mock ──
export function obtenerCentros() {
  return CENTROS_DE_ACOPIO;
}
