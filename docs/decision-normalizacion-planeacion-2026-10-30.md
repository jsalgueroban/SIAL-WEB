# Normalización visual · Gestión de Planeación · 30/10/2026

Alcance de propuesta web: cinco vistas de menú, detalle de aviso e índice. Perfil local, reutilización del paquete instalado y patrones existentes. Evaluación SELF: estado y runtime locales compartidos, sin slice independiente útil. El paquete de librería no se modificó ni publicó.

- Avisos: TextInput y SelectInput de librería, filtros con escoba compartida; sincronización del buscador al limpiar y contención de tabla móvil. Botones de librería en creación y consulta; Toast para guardar borrador y publicación simulada. Verificados búsqueda vacía, limpieza, guardado de borrador, recuperación en diálogo, validación, confirmación, Escape y publicación simulada; apertura/cancelación de fuente Loading Plan.
- Semanas y cintas: buscadores y filtros de librería con escoba animada; textos corregidos. En Semanas el badge de estado se distingue del de validación, también tras recarga; diálogo y Toast de cambio de estado comprobados. Cintas abre los datos de la fila seleccionada y valida el formulario; no modifica el catálogo, que sigue siendo de demostración.
- Generación: NumberInput, DateInput, SelectInput y botones de librería; una fecha que no sea lunes no muestra éxito; se comprobaron fecha inválida, previa válida de 52 semanas y Toast. Es una vista previa, no genera registros reales.
- Las siete rutas cargaron a 390 y 1280 px sin desborde documental ni errores JavaScript capturados. Se comprobaron escobas de las tres bandejas, con animación en escritorio y apertura móvil con movimiento reducido. La matriz editable y controles particulares mantienen composición local; no se afirma que cada control sea un componente publicado ni que se hayan probado todas las combinaciones.

Pendiente revisión visual de John. Los cambios son locales y no publicados; los avisos, generación y catálogos usan recorridos de demostración.

Gate transversal posterior a los ajustes: 45/45 aprobado; evidencia en output/planeacion-gate-20261030.json.

## Cobertura de componentes · 31/10/2026

John identificó que chips y avisos aún tenían estilos locales. Se conectaron los estados y contadores al Chip publicado y los avisos informativos, de resultado y de diálogos a Notice; el puente mantiene texto y variante sincronizados. En Semanas y Cintas se usa además Drawer y el campo Orden usa NumberInput. La matriz de asignaciones conserva sus controles locales. La librería publicada no se cambió; el puente de la propuesta se amplió para los casos marcados. Delegación: SELF; el cambio comparte adaptador y estado local.

Verificación: siete rutas a 390/1280 sin desborde ni error JS capturado. Se comprobó el conteo al filtrar, borrar filtros, cambios de borrador y publicación simulada, Notice en diálogo, estados de semana tras cambio y recarga, dos drawers y movimiento reducido. Build aprobado y gate transversal 45/45; no representa cobertura de todos los estados ni validación visual del usuario. Pendiente revisión de John; sin publicar.

## Corrección de bandeja y borradores · 31/10/2026

John señaló filtros seleccionados sin escoba ni filtrado, ausencia de paginación y componentes pendientes en Borradores y Fuentes. Causa: la bandeja escuchaba input, mientras los selectores de librería emiten change; la revisión anterior había probado búsqueda y no la selección real de los tres selectores. Se corrigió el evento, se mantuvo el patrón compartido con entrada y salida animada, y se incorporó Pagination de librería con estado de página y tamaño. El adaptador de Chip también alcanza diálogos; Retomar usa Button y Mejoras aprobadas usa Chip.

Comprobados filtros combinados 6→2→1 y limpieza 1→6; animación de 480 ms, salida y movimiento de cuatro campos; teclado y móvil con movimiento reducido. Con escenario de datos de demostración ?escenario=volumen se verificaron 24 resultados, siguiente página, tamaño de página y reinicio al filtrar. Comprobados tres chips en Borradores y Retomar táctil. La tabla conserva su composición local para preservar sus celdas y acciones; no se declara adopción de Table de librería. Pendiente revisión visual de John; cambios locales sin publicar.

Gate transversal después del ajuste: 45/45 aprobado.

## Tabla de librería para Avisos · 31/10/2026

John solicitó sustituir la composición local de la tabla. Se montó Table publicado con renderizadores para aviso enlazado, semana, tipo y versión, alcance, Chip de estado, actualización y acciones con IconButton/TableRowActions. Un puente local conserva los datos y el filtrado existentes para alimentar Table; Pagination y el patrón compartido de movimiento permanecen activos. No se cambió el paquete publicado. Evaluación de delegación: SELF por estado local y puente estrechamente acoplado.

Comprobados en navegador: seis filas con su contenido, enlace de aviso, acciones Consultar y Continuar, cero resultados, filtros, limpieza, entrada y salida animadas, desplazamiento de controles, páginas 1 y 2 con 24 registros de demostración y retorno a página 1 al filtrar. Móvil 390 px: tabla desplazable dentro del contenedor, sin desborde documental; filtros táctiles y movimiento reducido. Build aprobado; pendiente revisión visual de John y publicación.

Gate transversal final: 45/45 aprobado al repetirlo. El primer intento registró un tiempo de espera en Clases de referencia; esa vista pasó también su comprobación aislada.

## Tipografía y tablas restantes · 31/10/2026

Se ajustó la jerarquía de consulta a la guía: título de página 28 px, secciones 18 px, cuerpo y subtítulos 14 px, ayudas y etiquetas desde 12 px. Semanas, Cintas, las tablas de asignaciones y diferencias de la consulta y la vista previa de generación consumen Table de librería; las tablas de consulta incorporan Pagination. La vista previa muestra deliberadamente ocho ejemplos de un total proyectado y no simula paginación. El aviso dinámico usa Notice.

Se comprobaron filtros, entrada y salida de la escoba, desplazamiento, paginación con 13 filas temporales, acciones y drawers, cambios de versión, estado vacío, siete rutas a 390 y 1280 px, tema oscuro y movimiento reducido. Build aprobado y gate transversal 45/45; el ajuste posterior de ancho de botones móviles se verificó por separado. La matriz de creación conserva implementación local: sus encabezados agrupados y celdas editables no son compatibles con la API plana actual de Table. Pendiente resolver esa excepción y la revisión visual de John. Cambios locales, sin publicar. Delegación: SELF por adaptador y estado local compartidos.

## Feedback y generación anual · 31/10/2026

Se retiró Estado/Activo de los parámetros y se distribuyeron los tres campos restantes. La generación presenta el éxito mediante Toast de librería, sin Notice duplicado; el Notice de alcance de vista previa permanece porque describe información persistente. Se retiraron duplicados de éxito en Cintas y al guardar o publicar avisos, conservando Toast y resúmenes de validación accionables. Comprobados Toast y distribución a 1280/390, fecha inválida, guardado simulado de borrador y validación de cinta, sin errores JS; comprobación sintáctica y diff --check aprobados. Revisión visual pendiente; matriz editable agrupada permanece local.
