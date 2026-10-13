# Reparto controlado de patrones Web — 2026-10-13

Estado: formularios breves y controles de bandeja repartidos parcialmente. Inventario global: 97 HTML; **todas** las vistas vigentes deben auditarse por componente aplicable. La diferencia de estructura entre flujos no exime de consumir inputs, botones, chips, tablas y otros componentes publicados cuando corresponda. Este reparto no equivale a normalización completa de ninguna vista por sí solo.

## Familia aplicable

Los 12 formularios HTML embebidos de maestras y relaciones comparten `inline-form-panel inline-form-compact`. Se mantiene el panel de bajo contraste, la separación entre filtros/formulario/tabla y las acciones centradas, con acción primaria a la derecha. En siete formularios se retiró «Estado inicial: Activo», pues el alta ya lo asigna y el bloque no es un dato editable; los campos útiles aprovechan el ancho liberado. El estado sigue visible en las filas y detalles donde importa. `gestion-cintas` se sumó como formulario corto: su panel ahora queda entre la toolbar y la tabla; su feedback no adopta el tratamiento de notice. El feedback visible dentro de otros formularios embebidos también se presenta como texto inline, sin caja coloreada.

| Grupo | Vistas | Estado del patrón |
| --- | --- | --- |
| Empresas | `gestion-dependencias`, `relacion-empresa-tipo` | Composición compacta; HTML estático |
| Fincas | `gestion-clases-referencia`, `gestion-grupos`, `gestion-productos`, `gestion-sectores` | Formularios compactos con campos, búsqueda y botones de librería; bandejas con `Table` y datos/eventos originales. Vistas parciales. |
| Transporte | `gestion-tipos-empresa`, `relacion-conductor-licencia` | Composición compacta; HTML estático |
| Puerto | `gestion-contenedores`, `gestion-etapas-contenedor`, `gestion-puertos`, `gestion-tipos-contenedor` | Composición compacta; HTML estático |
| Piloto con librería | `categorias-pedido`, `gestion-categorias-licencia`, `gestion-tipos-vehiculo` | Composición y componentes publicados calibrados |

En las tres vistas piloto, el encabezado de tabla usa contador `Chip`, acción primaria al extremo superior derecho, `Table` con acciones `IconButton` sin marco y `Pagination` en el pie. El filtro de estado usa `SelectInput` real; se verificó la colisión del portal con `.grid` local.

## Reparto transversal de controles de bandeja

El adaptador `src/web/legacy-table-controls.jsx` monta componentes publicados de `@banasandev/banasan-ui` sobre controles de las vistas HTML existentes sin sustituir sus datos ni los manejadores de negocio. `shared/sial-core.js` carga el runtime cuando encuentra filtros, acciones, contador o paginación, también si la vista los dibuja después del inicio de página. La vista original mantiene un control nativo oculto como proxy de eventos. El barrido final halló componentes de librería en 51 de los 97 HTML; los otros 46 no se consideran fallidos por ese número, pues incluyen flujos sin bandeja, el catálogo técnico y páginas sin controles aplicables. El criterio es por **componente aplicable**, no por página completa:

La revisión de `gestion-clases-referencia.html` en la URL local usada por el usuario detectó un fallo de presentación real: durante la carga aparecían el contador, los selectores y las acciones nativas antes de montar los componentes publicados. El núcleo ahora marca la carga de controles; el CSS reserva su espacio sin mostrar los controles antiguos; el adaptador confirma `ready` después del montaje sincrónico. Hay una recuperación a los cinco segundos si el runtime no termina de cargar. Se verificó en la pestaña afectada: `Chip` ×1, `SelectInput` ×2, `IconButton` ×6 y `Pagination` ×1; el filtro de Estado cambia de dos a un registro y vuelve a dos sin perder la sincronización. El segundo filtro recibió la etiqueta específica «Tamaño de fruta».

| Situación | Patrón aplicado | Límite |
| --- | --- | --- |
| Toolbar de tabla o filtros de bandeja | `SelectInput` de la librería, opciones propias de cada vista | Selects dentro del formulario y selectores de decisión operativa conservan su composición funcional |
| Búsqueda de las cuatro bandejas simples de Fincas | `TextInput` de la librería con rol `searchbox` y valor sincronizado | No extender a búsquedas especializadas sin revisar eventos y semántica |
| Alta, exportación y acciones de formularios breves de esas cuatro bandejas | `Button` de la librería, primaria al extremo derecho de encabezado y al final centrado del formulario | Mantener la acción y validación nativas como proxy oculto; no convertir botones de detalle o decisiones transaccionales sin revisión |
| Contador de registros en encabezado | `Chip` de la librería | Estados del proceso no se convierten en contadores |
| Acciones de fila equivalentes a ver, abrir, editar, corregir, continuar, notificar, activar o inactivar | `IconButton` ghost con icono semántico de la librería y mismo evento original | «Copiar referencia» y «Generar y compartir resumen» conservan su icono local: la librería publicada no ofrece una equivalencia inequívoca; se les retira el marco para mantener la composición |
| Pie de tabla con estado de página | `Pagination` de la librería; sincronizado con paginadores del núcleo y los de Puerto/Materiales | Un pie estático de un solo resultado no se presenta como navegación funcional adicional |

La columna de acciones conserva la cantidad de operaciones que exige cada fila; el patrón normaliza iconos y bordes, **no** obliga a dos acciones. Las acciones de formularios quedan centradas al final. El botón primario de la bandeja sigue en `card-actions`, arriba a la derecha, sin trasladarlo al pie de la tabla.

Las cuatro bandejas simples de Fincas montan además `Table` y `TableRowActions` reales de la librería mediante el mismo adaptador. Su HTML original permanece como fuente oculta de filas y manejadores; un observador sincroniza filtros y cambios de filas con el componente visible. Hay siete vistas que consumen `Table`: estas cuatro bandejas adaptadas y las tres piloto con datos React. Las otras tablas HTML heredadas no se marcan falsamente como `Table`. Migrar cada tabla transaccional completa exige revisar celdas, estado y eventos de esa HU, no basta una sustitución visual global.

La cifra de 51 vistas con componentes no significa cobertura total de la propuesta ni paridad visual de las otras 46. Una revisión dirigida de las páginas sin marcadores encontró casos de otro tipo: matrices de permisos, vistas previas de formularios, tableros, detalle de consulta y galerías de pedidos. Esos casos no se convierten en bandejas por tener una tabla HTML o un selector; quedan para revisión por flujo y HU. En particular, `gestion-permisos-rol.html` es una matriz editable y `gestion-pedidos-materiales.html` una galería operativa, no una tabla estándar. Las cuatro maestras simples de Fincas sí pertenecen a una familia de bandejas y se migraron juntas.

## Correspondencia con Web real

Se verificaron en `src/app` del proyecto Web y se añadieron 12 relaciones ruta-vista explícitas en `shared/sial-route-map.json`: dependencias, tipos y relaciones de empresa; grupos, sectores y clases de referencia; contenedores, tipos de contenedor y puertos; tipos de vehículo, categorías de licencia y categorías de materiales. Este vínculo confirma que la propuesta representa la misma pantalla de producto; **no** declara paridad completa de campos, interacciones ni permisos.

El mapa generado pasó de 11 a 23 relaciones explícitas entre 63 rutas; quedan 8 candidatas y 36 sin relación. Las 36 no se convierten automáticamente en tareas de nueva vista: primero hay que separar rutas técnicas, vistas existentes aún no relacionadas y vacíos reales, y asociar HU confirmada.

## Límites del reparto

Para banners, la regla reutilizable no es «toda vista lleva uno»: primero se justifica el mensaje por una decisión, bloqueo, error o resultado concreto. Si aplica, se usa `Notice` publicado y se evita la duplicidad visual/accesible con el HTML previo. Las reglas permanentes de un catálogo breve se sitúan en la descripción de la bandeja o la ayuda del campo; el éxito del formulario embebido es feedback inline. La matriz documental es un ejemplo de advertencia operativa que sí mantiene banner; no se replica su presencia en otros catálogos por semejanza de estructura.

Las bandejas maestras de Fincas y Referencias se incorporan como variante de consulta: tabla de librería con búsqueda/filtros, acción de exportar, enlaces semánticos a formularios dedicados y cajón `Drawer`/`DrawerAuditList`. La vista de Referencias conserva cuatro acciones por fila, incluida copia; la cantidad de acciones no se reduce para imitar una captura. Su adaptación sigue parcial hasta revisar confirmaciones de estado y los formularios dedicados. No se reparte el cajón a vistas que carezcan de detalle lateral real.

- Formularios mayores: `gestion-clientes`, `gestion-notificaciones-contactos`, `parametrizacion-roles` y `administracion-changelog` requieren composición y pruebas por flujo; no reciben automáticamente la retícula breve.
- `gestion-cintas` conserva sus cuatro campos y validación de secuencia; sólo recibió la anatomía compartida del formulario breve y controles de bandeja.
- Solicitudes de materiales, aprobaciones, mantenimiento y programación vehicular son transaccionales; conservar sus agrupaciones, decisiones y validaciones particulares.
- `shared/componentes.html` es catálogo técnico, no una pantalla de gestión.
- Los filtros de estados específicos (por ejemplo Vigente/Por vencer o Revisión) deben retener sus opciones al migrar a `SelectInput`.

## Próximo bloque de mapeo

1. Revisar las tablas heredadas de mayor complejidad por HU para pasar también sus filas al `Table` publicado sin romper eventos, accesibilidad o estados locales. El adaptador actual ya consume `SelectInput`, `Chip`, `IconButton` y `Pagination` donde corresponden.
2. Clasificar los formularios medianos/grandes y las vistas transaccionales con sus propios patrones. No inferir equivalencia por tener una tabla o un select.
3. Mantener en backlog las rutas del producto sin propuesta, asociadas a HU confirmada después de la normalización; no fabricar HUs ni rutas por similitud léxica.

Delegación: `SELF`. El slice transversal involucra el núcleo, runtime de librería, vistas heredadas y verificación visual en un worktree local con cambios previos acoplados; separarlo no ofrece una revisión independiente útil. Validación visual de prototipo, no cierre de QA funcional de HU.

## Verificación de este bloque

- `pnpm build:ui`: correcto.
- `run-tests.ps1` de la skill de propuestas: correcto; 97 vistas Web y 49 móviles, 0 enlaces rotos.
- Tras corregir la carga transitoria de controles, se repitieron ambas pruebas con resultado correcto y se recargó la URL reportada en Chrome para comprobar los componentes y su filtro de estado.
- En las cuatro maestras de Fincas se comprobó en Chrome que aparece una única tabla visible de la librería con dos filas iniciales y el contador correspondiente. Se probaron filtros con actualización de filas y contador en Clases, Grupos y Sectores; búsqueda sin resultados, visualización y edición desde la nueva tabla en Clases; visualización desde Sectores. Los filtros contextuales se nombraron «Tamaño de fruta», «Productor» y «Uso del sector».
- Navegador a 1280 px: barrido de las 97 páginas sin errores de ejecución; verificación interactiva de filtro/contador/acción en Dependencias y de filtros/paginación en Operaciones. Se revisaron además Planeación, Materiales, Puerto y Empresas con render dinámico.
- Navegador a 390 px: barrido de las 97 páginas sin desbordamiento horizontal. Sólo quedan dos grupos de acciones con icono local por falta de equivalencia semántica publicada: copiar referencias y generar/compartir resúmenes. El formulario de Cintas abre después de la toolbar. En Changelog, la navegación horizontal permanece dentro de la cabecera en lugar de ensanchar la página.
- Débora: entorno configurado; no se inició una campaña de QA de HU porque este bloque es una normalización de prototipo transversal.
