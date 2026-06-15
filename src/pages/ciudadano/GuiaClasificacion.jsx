import { useState, useMemo } from 'react';

// Datos mockeados de materiales
const MATERIALES_GUIA = [
  {
    id: 1,
    nombre: 'Botellas de Plástico PET',
    icono: '',
    categoria: 'Plástico',
    instruccionesLimpieza: 'Enjuague completamente con agua tibia las botellas de Coca-Cola, Sprite, agua purificada u otros refrescos. Vacíe todo el líquido residual. Para residuos pegajosos, use un poco de jabón suave. Deje secar completamente al aire antes de entregar. No es necesario remover la etiqueta, pero puede hacerlo para optimizar el reciclaje.',
    instruccionesSeparacion: 'Remova la tapa de plástico o metal cuidadosamente. Las tapas se reciclan por separado. Aplaste la botella para reducir el volumen ocupado hasta un 80%, lo que maximiza el espacio en los centros de acopio. Si la botella tiene etiqueta, puede dejarla pegada sin problema.',
    condicionesRechazo: 'Botellas sucias con residuos de alimentos o bebidas pegajosas. Botellas de cloro o químicos.',
    frecuentementeRechazado: true,
  },
  {
    id: 2,
    nombre: 'Frascos de Vidrio',
    icono: '',
    categoria: 'Vidrio',
    instruccionesLimpieza: 'Enjuague completamente los frascos de mermelada, sal, especias, café o conservas con agua caliente. Utilice un cepillo suave para limpiar el interior si hay residuos pegados. Remueva etiquetas adhesivas frotando con agua caliente o alcohol. Seque completamente para evitar moho o deterioro durante el almacenamiento.',
    instruccionesSeparacion: 'Separe cuidadosamente por color: frascos transparentes, verdes y marrón en contenedores distintos. Esta separación es crítica para la calidad del vidrio reciclado. Las tapas metálicas pueden permanecer en el frasco. Evite mezclar colores en el mismo contenedor.',
    condicionesRechazo: 'Vidrio roto o astillado. Espejos o vidrio templado. Vidrio con etiquetas adhesivas difíciles de remover.',
    frecuentementeRechazado: false,
  },
  {
    id: 3,
    nombre: 'Cajas de Cartón',
    icono: '',
    categoria: 'Cartón',
    instruccionesLimpieza: 'Despliegue completamente las cajas de pizza, empaques de electrodomésticos o paquetes de cartón corrugado. Limpie residuos de comida, grasa o líquidos con un trapo seco. Deje secar completamente al aire. No use agua, ya que el cartón mojado pierde su capacidad de ser reciclado y se vuelve pegajoso.',
    instruccionesSeparacion: 'Comprima todas las cajas, colapsándolas para que ocupen menos espacio. Agrupe cajas de tamaño similar. Separe el cartón ondulado grueso (cajas de electrodomésticos) del cartón delgado (cajas de cereales, zapatos). Amarre los paquetes con cordel o cinta para mantenerlos juntos durante el transporte.',
    condicionesRechazo: 'Cartón mojado, roto o con restos de comida. Cartón encerado o plastificado.',
    frecuentementeRechazado: false,
  },
  {
    id: 4,
    nombre: 'Latas de Aluminio',
    icono: '',
    categoria: 'Metal',
    instruccionesLimpieza: 'Enjuague completamente las latas de refrescos (Coca-Cola, Fanta, Pilsen), cerveza, conservas o alimentos enlatados. Remueva todo residuo de líquido o comida. Para residuos pegajosos, frote suavemente con un poco de jabón. Seque completamente antes de almacenar. El aluminio limpio se recicla más fácilmente.',
    instruccionesSeparacion: 'Aplaste cada lata de forma manual o use un compactador. Las latas aplastadas ocupan 75% menos espacio. Separe las latas de otros metales como acero. Guarde las latas en una bolsa o contenedor designado. Mantenga separadas de materiales frágiles como vidrio.',
    condicionesRechazo: 'Latas oxidadas o corroídas. Latas con pintura descascarada. Latas pegajosas o con residuos químicos.',
    frecuentementeRechazado: true,
  },
  {
    id: 5,
    nombre: 'Vidrio Para Bebidas',
    icono: '',
    categoria: 'Vidrio',
    instruccionesLimpieza: 'Enjuague completamente botellas de cerveza, vino, champagne o jugos en botellas de vidrio. Use agua caliente y un cepillo para limpiar el interior. Remueva completamente etiquetas y pegamento con agua caliente o alcohol. Seque completamente al aire. Las botellas secas evitan la proliferación de bacterias.',
    instruccionesSeparacion: 'Agrupe por color: botellas verdes transparentes, verdes oscuras y cafes en contenedores separados. Esta clasificación es esencial para producir vidrio de calidad. Las tapas pueden permanecer en la botella. Coloque cuidadosamente las botellas de pie para evitar roturas durante el transporte.',
    condicionesRechazo: 'Vidrio roto. Botellas con líquidos residuales pegajosos. Vidrio con etiquetas pegadas permanentemente.',
    frecuentementeRechazado: false,
  },
  {
    id: 6,
    nombre: 'Residuos Orgánicos',
    icono: '',
    categoria: 'Orgánicos',
    instruccionesLimpieza: 'No requiere limpieza especial. Utilice tal como viene del consumo diario: cáscaras de plátano, manzanas, zanahoria cruda, hojas de lechuga, tallos de brócoli o restos de frutas y verduras frescas. Estos se compostarán naturalmente en los centros de acopio autorizados.',
    instruccionesSeparacion: 'Separe cáscaras, semillas, tallos, hojas y restos de comida cruda en bolsas compostables o recipientes. Mantenga separado de alimentos cocidos u otros materiales. Los residuos orgánicos se transforman en abono o compost que enriquece el suelo, completando el ciclo sostenible.',
    condicionesRechazo: 'Comida cocida con aceite. Huesos grandes. Productos lácteos. Carne o pescado.',
    frecuentementeRechazado: false,
  },
  {
    id: 7,
    nombre: 'Pilas y Baterías',
    icono: '',
    categoria: 'Electrónicos',
    instruccionesLimpieza: 'Limpie con un paño seco las pilas AA, AAA, 9V o baterías recargables de computadoras, móviles antiguos o scooters eléctricos. NO use agua ni humedad. Si hay corrosión visible, frote suavemente con lápiz sobre papel para remover óxido. Guarde en lugar seco y frío.',
    instruccionesSeparacion: 'Mantenga en bolsa seca herméticamente cerrada. Separe por tipo: alcalinas (AA, AAA), recargables (Li-Po, Li-ion) y 9V, ya que cada una requiere proceso de reciclaje diferente. Coloque cinta adhesiva en los terminales de baterías de alto voltaje para evitar cortocircuitos. Las pilas contienen metal pesado y óxido de mercurio, contaminantes peligrosos que causan daño ambiental irreversible.',
    condicionesRechazo: 'Pilas fugas o con corrosión visible. Baterías hinchadas o dañadas.',
    frecuentementeRechazado: true,
  },
  {
    id: 8,
    nombre: 'Papel de Periódico',
    icono: '',
    categoria: 'Cartón',
    instruccionesLimpieza: 'Agrupe limpio y completamente seco. No debe estar mojado ni con manchas de grasa, café o comida pegada. Revistas de periódicos viejos, folletos informativos y páginas impresas se pueden reciclar juntas. Evite el papel satinado o de revistas de brillo alto.',
    instruccionesSeparacion: 'Comprima los periódicos enrollándolos o doblándolos en bloques compactos. Separe del cartón ondulado grueso. Amarre con cordel para mantener juntos. Clasificar por grosor: periódicos finos con papel de revistas frágiles de un lado, papel grueso del otro. El papel reciclado produce nuevo periódico o empaques.',
    condicionesRechazo: 'Periódico mojado o con comida pegada. Papel satinado o revistas brillantes.',
    frecuentementeRechazado: false,
  },
  {
    id: 9,
    nombre: 'Teléfono Móvil Antiguo',
    icono: '',
    categoria: 'Electrónicos',
    instruccionesLimpieza: 'Limpie con paño seco el teléfono móvil antiguo, smartphones viejos o tablets descontinuadas. Remueva la batería con cuidado si es posible hacerlo de forma segura. NO use agua ni disolventes. Evite tocar componentes internos para prevenir descarga eléctrica residual.',
    instruccionesSeparacion: 'Guarde en bolsa protectora individual para evitar cortocircuitos. Si es posible, extraiga y separe la batería en su propio contenedor de baterías peligrosas. Los dispositivos electrónicos contienen metales preciosos (oro, plata, cobre) y componentes tóxicos que requieren procesamiento especializado por profesionales certificados.',
    condicionesRechazo: 'Dispositivos con batería inflamada. Dispositivos mojados. Componentes dispersos.',
    frecuentementeRechazado: false,
  },
  {
    id: 10,
    nombre: 'Bolsas Plásticas Limpias',
    icono: '',
    categoria: 'Plástico',
    instruccionesLimpieza: 'Vacíe completamente las bolsas del supermercado o bolsas de compras plásticas. Enjuague si fue usada para alimentos, usando agua fría y jabón suave. Deje secar completamente al aire. Las bolsas mojadas se pegan entre sí y dificultan el procesamiento.',
    instruccionesSeparacion: 'Agrupe bolsas limpias y secas dentro de una bolsa más grande para que no se dispersen. Separe bolsas transparentes de bolsas de color. Si detecta alguna bolsa con restos de grasa o comida, extráigala del lote. Las bolsas plásticas son uno de los mayores contaminantes del mar; reciclarlas correctamente salva ecosistemas marinos.',
    condicionesRechazo: 'Bolsas sucias con comida o grasa. Bolsas de nylon metalizadas o laminadas.',
    frecuentementeRechazado: true,
  },
];

export default function GuiaClasificacion() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const CATEGORIAS = ['Plástico', 'Vidrio', 'Cartón', 'Metal', 'Electrónicos', 'Orgánicos'];

  // Filtrar materiales por búsqueda y categoría
  const materialesFiltrados = useMemo(() => {
    return MATERIALES_GUIA.filter((material) => {
      const coincideBusqueda = material.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = !categoriaSeleccionada || material.categoria === categoriaSeleccionada;
      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, categoriaSeleccionada]);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="buscador-header" style={{ marginBottom: 'var(--sp-6)' }}>
        <h1>Guía de Clasificación</h1>
        <p>Encuentra instrucciones detalladas para clasificar correctamente tus residuos</p>
      </div>

      {/* Input de Búsqueda */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <input
          type="text"
          placeholder="Buscar un material..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            flex: 1,
            padding: 'var(--sp-3) var(--sp-4)',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--gray-200)',
            background: 'var(--white)',
            fontSize: '0.95rem',
            color: 'var(--gray-800)',
            boxShadow: 'var(--shadow-xs)',
            outline: 'none',
            transition: 'all var(--ease-fast)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--eco-500)';
            e.target.style.boxShadow = 'var(--shadow-sm), 0 0 0 3px var(--eco-100)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--gray-200)';
            e.target.style.boxShadow = 'var(--shadow-xs)';
          }}
        />
      </div>

      {/* Chips de Categorías */}
      <div
        className="filtros-chips"
        style={{
          marginBottom: 'var(--sp-6)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-2)',
        }}
      >
        <button
          className={`chip ${!categoriaSeleccionada ? 'active' : ''}`}
          onClick={() => setCategoriaSeleccionada(null)}
        >
          Todos
        </button>

        {CATEGORIAS.map((categoria) => (
          <button
            key={categoria}
            className={`chip ${categoriaSeleccionada === categoria ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {/* Resultado de búsqueda - Sin coincidencias */}
      {materialesFiltrados.length === 0 ? (
        <div
          style={{
            background: 'var(--white)',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--r-xl)',
            padding: 'var(--sp-8)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--gray-600)',
              fontWeight: '500',
            }}
          >
            Este material no está en el catálogo aún. Consulta con tu centro de acopio local.
          </p>
        </div>
      ) : (
        /* Grid de Fichas */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--sp-6)',
          }}
        >
          {materialesFiltrados.map((material) => (
            <div
              key={material.id}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--r-xl)',
                padding: 'var(--sp-5)',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all var(--ease-base)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Ícono y nombre */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {material.icono}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: 'var(--gray-800)',
                      margin: 0,
                      marginBottom: 'var(--sp-1)',
                    }}
                  >
                    {material.nombre}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      color: 'var(--eco-600)',
                      background: 'var(--eco-50)',
                      padding: 'var(--sp-1) var(--sp-2)',
                      borderRadius: 'var(--r-full)',
                      display: 'inline-block',
                    }}
                  >
                    {material.categoria}
                  </span>
                </div>
              </div>

              {/* Instrucciones de Limpieza */}
              <div>
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--gray-700)',
                    margin: 0,
                    marginBottom: 'var(--sp-1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  ✓ Limpieza
                </h4>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--gray-600)',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {material.instruccionesLimpieza}
                </p>
              </div>

              {/* Instrucciones de Separación */}
              <div>
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--gray-700)',
                    margin: 0,
                    marginBottom: 'var(--sp-1)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  📋 Separación
                </h4>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--gray-600)',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {material.instruccionesSeparacion}
                </p>
              </div>

              {/* Condiciones de Rechazo — bloque neutro */}
              <div
                style={{
                  background: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-3)',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--gray-600)',
                    margin: 0,
                    marginBottom: 'var(--sp-1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  ⚠️ Causas de Rechazo
                </h4>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--gray-500)',
                    margin: 0,
                    lineHeight: '1.5',
                  }}
                >
                  {material.condicionesRechazo}
                </p>
              </div>

              {/* Badge Frecuentemente Rechazado */}
              {material.frecuentementeRechazado && (
                <div
                  style={{
                    background: 'var(--eco-50)',
                    border: '1px solid var(--eco-300)',
                    borderRadius: 'var(--r-lg)',
                    padding: 'var(--sp-3)',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--eco-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--sp-1)',
                    }}
                  >
                    ⚡ Frecuentemente Rechazado
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
