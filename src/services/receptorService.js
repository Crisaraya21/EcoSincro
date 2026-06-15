/*  ──────────────────────────────────────────────
    RECEPTOR SERVICE — Mock Data & Utilities
    ────────────────────────────────────────────── */

// ── Tipos de material (compartido con ciudadano) ──
export const TIPOS_MATERIAL = [
  { id: 'plastico',         nombre: 'Plástico',                   icono: '🥤' },
  { id: 'vidrio',           nombre: 'Vidrio',                     icono: '🫙' },
  { id: 'carton',           nombre: 'Cartón',                     icono: '📦' },
  { id: 'no_convencional',  nombre: 'Residuos No Convencionales', icono: '⚠️' },
];

//  Mock Entregas (lo que envían los ciudadanos)
// Estructura: 
// {
//   id: string,
//   ciudadanoId: string,
//   receptorId: string,
//   ciudadanoNombre: string,
//   materiales: [{ tipo: string, cantidad: number, unidad: string }],
//   estado: 'pendiente' | 'aprobado' | 'rechazado',
//   fechaHora: string,
//   motivoRechazo?: string
// }


export const ENTREGAS_MOCK = [
  {
    id: 'ENT-001',
    ciudadanoId: 'C001',
    receptorId: 'R001',
    ciudadanoNombre: 'Juan Pérez',
    materiales: [
      { tipo: 'plastico', cantidad: 5, unidad: 'kg' },
      { tipo: 'carton', cantidad: 3, unidad: 'kg' }
    ],
    estado: 'pendiente',
    fechaHora: new Date(Date.now() - 3600000).toISOString(),
    motivoRechazo: null
  },
  {
    id: 'ENT-002',
    ciudadanoId: 'C002',
    receptorId: 'R001',
    ciudadanoNombre: 'María González',
    materiales: [
      { tipo: 'vidrio', cantidad: 8, unidad: 'kg' }
    ],
    estado: 'pendiente',
    fechaHora: new Date(Date.now() - 7200000).toISOString(),
    motivoRechazo: null
  },
  {
    id: 'ENT-003',
    ciudadanoId: 'C003',
    receptorId: 'R001',
    ciudadanoNombre: 'Carlos López',
    materiales: [
      { tipo: 'plastico', cantidad: 2, unidad: 'kg' },
      { tipo: 'vidrio', cantidad: 4, unidad: 'kg' },
      { tipo: 'carton', cantidad: 6, unidad: 'kg' }
    ],
    estado: 'aprobado',
    fechaHora: new Date(Date.now() - 86400000).toISOString(),
    motivoRechazo: null
  }
];

// ── Mock Inventario por receptor ──
export const INVENTARIO_MOCK = {
  'R001': {
    plastico: 45,
    vidrio: 32,
    carton: 28,
    no_convencional: 5
  }
};

// ── Obtener entregas pendientes por receptor ──
export function obtenerEntregasPendientes(receptorId, entregas = ENTREGAS_MOCK) {
  return entregas
    .filter((e) => e.receptorId === receptorId && e.estado === 'pendiente')
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
}

// ── Obtener historial de entregas por receptor ──
export function obtenerHistorialEntregas(receptorId, entregas = ENTREGAS_MOCK) {
  return entregas
    .filter((e) => e.receptorId === receptorId)
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
}

// ── Aprobar entrega y actualizar inventario ──
export function aprobarEntrega(entregaId, entregas = ENTREGAS_MOCK, inventario = INVENTARIO_MOCK) {
  const entrega = entregas.find((e) => e.id === entregaId);
  if (!entrega) throw new Error('Entrega no encontrada');
  
  entrega.estado = 'aprobado';
  
  // Actualizar inventario
  entrega.materiales.forEach((mat) => {
    if (inventario[entrega.receptorId]) {
      inventario[entrega.receptorId][mat.tipo] = 
        (inventario[entrega.receptorId][mat.tipo] || 0) + mat.cantidad;
    }
  });

  return entrega;
}

// ── Rechazar entrega con motivo ──
export function rechazarEntrega(entregaId, motivo, entregas = ENTREGAS_MOCK) {
  const entrega = entregas.find((e) => e.id === entregaId);
  if (!entrega) throw new Error('Entrega no encontrada');
  
  entrega.estado = 'rechazado';
  entrega.motivoRechazo = motivo;
  
  return entrega;
}

// ── Obtener nombre legible de material ──
export function nombreMaterial(id) {
  const tipo = TIPOS_MATERIAL.find((t) => t.id === id);
  return tipo ? tipo.nombre : id;
}

// ── Obtener icono de material ──
export function iconoMaterial(id) {
  const tipo = TIPOS_MATERIAL.find((t) => t.id === id);
  return tipo ? tipo.icono : '📦';
}

// ── Obtener inventario de un receptor ──
export function obtenerInventario(receptorId, inventario = INVENTARIO_MOCK) {
  return inventario[receptorId] || {
    plastico: 0,
    vidrio: 0,
    carton: 0,
    no_convencional: 0
  };
}

// ── Calcular total de entregas por estado ──
export function obtenerEstadisticas(receptorId, entregas = ENTREGAS_MOCK) {
  const entregas_receptor = entregas.filter((e) => e.receptorId === receptorId);
  return {
    total: entregas_receptor.length,
    pendientes: entregas_receptor.filter((e) => e.estado === 'pendiente').length,
    aprobadas: entregas_receptor.filter((e) => e.estado === 'aprobado').length,
    rechazadas: entregas_receptor.filter((e) => e.estado === 'rechazado').length
  };
}

