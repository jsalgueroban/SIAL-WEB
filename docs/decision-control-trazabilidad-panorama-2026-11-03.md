# Control de trazabilidad — Panorama A

Selección del usuario: etapas y destinos simultáneos. Integrada en la propuesta local, sin publicación ni conexión al backend.

## Capacidades aplicadas
- Orquestación: sial-design-proposals corregida en staging-r12 y contrato sial-web-library.
- Composición analítica, jerarquía y densidad: Frontend Design e Impeccable Operate.
- Controles reales: SelectInput y Button de @banasandev/banasan-ui 1.4.0.
- Gráficas: Recharts ya instalado; dona SVG local. Adaptación local por limitaciones verificadas de los gráficos publicados de la librería; no modifica el paquete.
- Movimiento: transición breve al filtrar, respetando prefers-reduced-motion (criterios Emil).
- Validación visual e interactiva: Playwright, escritorio y móvil.

## Contrato
La unidad es el documento en una sola etapa actual. Filtros compartidos de tipo y finca; cuatro etapas, tres tipos, ocho fincas, incluida una sin documentos. Barras, dona y líneas categóricas; tarjetas debajo. El desglose expandible solo contiene conteos agregados por finca, sin duplicar la tabla operativa. Carga, error con reintento y consulta vacía disponibles mediante estado=loading|error|empty.

Los 400 documentos son fixtures ilustrativos; no representan datos de producción. No se ha validado el mapeo backend de otros estados ni un contrato de navegación contextual. La fecha es parte del fixture.

## Organización y reproducción
SELF: cambio local acotado con contexto compartido; sin beneficio de delegación independiente.
Fuente: src/web/materials-delivery-control.jsx y materials-document-dashboard-data.mjs.
Entrada exclusiva: materials-delivery-control-entry.jsx. Compilar con node scripts/build-delivery-control.mjs. Salida: shared/vendor/sial-delivery-control.js. Se conserva el shell existente y no se reconstruye el runtime compartido.

Evidencia y copias anteriores: D:/Skills/Auditorias/sial-trazabilidad-pilot-2026-11-03/integration-before. El piloto conserva las variantes exploradas y el registro de capacidades.

## Recalibración de identidad solicitada por el usuario
Perfil local: conservar Panorama A y corregir identidad completa. Se contrastó DESIGN.md, shared/sial-core.css y Seguimiento de pedidos al mismo viewport 1440 × 1000: main padding 24px, page 1280px, título 28px y card-header 18px 20px 14px.

Aplicado: clases compartidas page-header/page-title/page-subtitle/card/card-header/card-title/card-subtitle; superficies, radios, sombra y paleta desde tokens SIAL; SelectInput publicado también para tipo de gráfica. Eliminados franja de etapas, fecha fija, contador duplicado, iconos decorativos y CSS de variantes/laboratorio no utilizadas. Ayudas y leyendas recuperan 12–13px. Movimiento breve y reducción de movimiento conservados. Los colores de etapa son una decisión local, no promoción de un estándar global. Gráficas y desglose agregado siguen siendo composición local; no se declara adopción completa de Table.

Validación: build exclusivo, filtros RTP/Santa Isabel = 7/6/5/8, tres gráficas, modo oscuro, geometría de escritorio y móvil. No modifica shell, runtime compartido, librería ni backend; sin publicación. El usuario conserva revisión visual. Capturas sial-identidad-desktop-final.png, sial-identidad-mobile-final.png y sial-identidad-dark.png en workspace.

## Movimiento analítico contextual

Conceptos ECharts recreados en Recharts/SVG existentes: barras y línea 480ms, dona 650ms entrada y 380ms actualización, hover de valores. Preferencia reducida y teclado desactivan movimiento. Categorías sin eje temporal ni datos aleatorios. Se retira fade del panel completo. Detalle, fuentes y muestras intermedias: D:/Skills/Auditorias/sial-trazabilidad-pilot-2026-11-03/identity-motion-review.md. Sin instalar motor, publicar ni modificar librería.

## Interacción y panel por finca — feedback posterior
Identidad contrastada con core y Button/Table consumidos. Composición local: selector visual con Button ghost, iconos lineales y aria-pressed; el usuario pidió selección atractiva/interactiva. Se sustituye SelectInput sólo para representación de gráfica; filtros de negocio siguen usando SelectInput. Tooltip de valores local, énfasis sin borde negro y foco visible sólo con teclado. Dona con consulta al hover/foco de su leyenda y centro contextual.

Panel derecho: Distribución / Detalle por finca alternan la misma superficie. La tabla agregada adopta Table publicado; ya no se apila bajo gráfica en details. Ceros, filtros y total permanecen sincronizados; no es una tabla de programaciones. Las gráficas memoizadas evitan reiniciar la animación al cambiar una vista independiente.

Validado: build, selección Barras/Dona/Líneas, activación por teclado, tooltip Entregado156, leyenda de dona156, ocho filas incluida El Porvenir0, filtro RTP/Santa Isabel26 y etapas7/6/5/8. Móvil360 sin overflow de página; wrapper de tabla319px con scroll510px. Capturas sial-interactive-chart/table/mobile.png. Sin publicación. Evidencias históricas de motion quedan previas al delta, no se sobrescriben sus hashes.

## Composición elegida: dos bloques completos
El usuario seleccionó explícitamente etapas arriba y distribución por finca con detalle debajo. Esta decisión sustituye las dos columnas de Panorama y el selector Distribución/Detalle; no cambia la identidad ni el contrato funcional.

Aplicado: ambos paneles ocupan el ancho del contenedor SIAL (1280px en viewport1440), separados24px. La gráfica por finca y Table publicado permanecen visibles en el segundo bloque; las tarjetas de etapas siguen bajo su gráfica. Controles, tooltips, animaciones y filtros compartidos preservados. Dona centrada con ancho de lectura acotado.

Validación: build correcto; geometría vertical sin solapamiento;8 filas con ceros; filtro RTP/Santa Isabel26 y etapas7/6/5/8; selector Dona; móvil360 sin overflow. Captura sial-two-blocks.png. Cambio local sin publicar. Los registros anteriores describen alternativas descartadas, no la composición vigente.

## Densidad compacta de los dos bloques
Ajuste local solicitado: conservar ambas gráficas y detalle visible. Selector de gráfica integrado en encabezado; gráfico de etapas210px (230px móvil), destinos30px por finca+eje, filas de detalle40px; menos padding vertical y tarjetas de etapas con unidad inline en escritorio. Sin reducción de fuentes de etiquetas/tabla ni ocultamiento de filas. En móvil el encabezado distribuye título/total y selector en segunda fila.

Medición a1440×1000: página2180→1667px (-23,5%); bloque etapas642→444px, bloque fincas1149→875px. Build y diff-check correctos. Dona/líneas, filtro RTP/Santa Isabel26 y etapas7/6/5/8 verificados. Móvil360 sin overflow. Capturas sial-compact-desktop/mobile.png; ajuste final del encabezado móvil verificado en DOM. Sin publicación.
