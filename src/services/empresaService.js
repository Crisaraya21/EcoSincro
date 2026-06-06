export const SECTORES_PRODUCTIVOS = [
    'Manufactura',
    'Construcción',
    'Comercio al por mayor',
    'Comercio al por menor',
    'Alimentación y bebidas',
    'Tecnología',
    'Salud y farmacéutica',
    'Educación',
    'Hotelería y turismo',
    'Transporte y logística',
    'Agroindustria',
    'Otro',
];

export const TIPOS_RESIDUO = [
    { id: 'plastico',        nombre: 'Plástico',                   icono: '🧴', unidad: 'kg' },
    { id: 'vidrio',          nombre: 'Vidrio',                     icono: '🫙', unidad: 'kg' },
    { id: 'carton',          nombre: 'Cartón / Papel',             icono: '📦', unidad: 'kg' },
    { id: 'metal',           nombre: 'Metal / Chatarra',           icono: '🔩', unidad: 'kg' },
    { id: 'electronico',     nombre: 'Residuos Electrónicos',      icono: '💻', unidad: 'unidades' },
    { id: 'no_convencional', nombre: 'Residuos No Convencionales', icono: '⚠️', unidad: 'kg' },
];

// Mock solicitudes de retiro
export const SOLICITUDES_MOCK = [
    {
        id: 'SOL-001',
        empresaEmail: 'empresa@eco.com',
        receptorEmail: 'receptor@eco.com',
        receptorNombre: 'EcoPunto Central',
        residuos: [
            { tipo: 'plastico', cantidad: 120, unidad: 'kg' },
            { tipo: 'carton',   cantidad: 80,  unidad: 'kg' },
        ],
        estado: 'confirmado',
        fechaSolicitud: new Date(Date.now() - 7 * 86400000).toISOString(),
        fechaRetiro: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
        id: 'SOL-002',
        empresaEmail: 'empresa@eco.com',
        receptorEmail: 'receptor@eco.com',
        receptorNombre: 'EcoPunto Central',
        residuos: [
            { tipo: 'vidrio',   cantidad: 60,  unidad: 'kg' },
            { tipo: 'metal',    cantidad: 45,  unidad: 'kg' },
        ],
        estado: 'programado',
        fechaSolicitud: new Date(Date.now() - 86400000).toISOString(),
        fechaRetiro: new Date(Date.now() + 2 * 86400000).toISOString(),
    },
];

// Calcular el total de residuos entregados (solo solicitudes confirmadas)
export function calcularTotalResiduos(solicitudes) {
    const totales = {};
    solicitudes
        .filter((s) => s.estado === 'confirmado')
        .forEach((s) => {
            s.residuos.forEach((r) => {
                totales[r.tipo] = (totales[r.tipo] || 0) + r.cantidad;
            });
        });
    return totales;
}

// Validación simple de cumplimiento normativo
// (mock: cumple si hay al menos 1 solicitud confirmada con receptor certificado)
export function validarCumplimiento(solicitudes) {
    const confirmadas = solicitudes.filter((s) => s.estado === 'confirmado');
    if (confirmadas.length === 0) return { cumple: false, razon: 'No hay entregas confirmadas registradas.' };
    const totalKg = confirmadas.reduce((acc, s) =>
        acc + s.residuos.reduce((a, r) => a + r.cantidad, 0), 0);
    if (totalKg < 10) return { cumple: false, razon: 'El volumen total entregado es inferior al mínimo requerido (10 kg).' };
    return { cumple: true, razon: 'Cumple con los criterios mínimos de disposición responsable.' };
}

export function nombreResiduo(id) {
    return TIPOS_RESIDUO.find((t) => t.id === id)?.nombre ?? id;
}

export function iconoResiduo(id) {
    return TIPOS_RESIDUO.find((t) => t.id === id)?.icono ?? '♻️';
}