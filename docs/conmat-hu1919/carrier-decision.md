# HU1919 · Portal transportadora · 24 noviembre2026

## Acceso único a notificaciones

Se elimina el botón de Notificaciones de la cabecera de bandeja por duplicar la campana global. En esta página, body declara sialNotificationScope=conmat-carrier; el adapter compartido no carga fixtures genéricos de Planeación y conecta la campana existente mediante eventos sial:notifications-open/state. La feature aporta contador real local y apertura/cierre; usa el detalle compacto existente con id vinculado por aria-controls. No se clona la campana ni se intercepta otro controlador. El resto de páginas conserva su bandeja anterior.

Build correcto. Navegador: cero botones duplicados en bandeja, Enter en campana abre notificaciones, lectura reduce3→2→0, al llegar a cero desaparece badge; recarga conserva0. Escape cierra y aria-expanded se sincroniza. Página panel conserva su tray genérico. Evidencia carrier-single-bell.png. Esta corrección sustituye la ubicación de Notificaciones como acción de la card descrita anteriormente.

## Composición SIAL contrastada con pantalla maestra

Ante la corrección del usuario se revisó DESIGN.md §5.3,6.1,7.6,12 y16 y web-composition-contracts.md; se contrastó Gestión de vehículos, bandeja maestra de Transporte, en1440×1000/DPR1. La adaptación previa sólo había incorporado el shell y aún conservaba una composición local sin ese contraste. Se retiran el banner técnico y los botones que simulaban pestañas; se aplica page-eyebrow → page-header/título/propósito → Card única → card-header con título/contexto/acción → FilterToolbar → Table → Pagination. Notificaciones pasa a la cabecera de la bandeja; Consulta usa SelectInput publicado para rutas/órdenes sin ruta. Los chips se contienen a su ancho propio en las celdas.

Geometría maestra/portal: main x72 ancho1368, page/card x116 ancho1280. Cabecera de card con padding18/20/14. Campos de búsqueda/consulta/estado en y325.625, altura44 y base369.625; filtro termina391.625, tabla comienza392.292: campos contenidos y separación22px bajo controles. En390, page/card x12 ancho366; filtros adicionales nativos tras Más filtros, campos contenidos y sin overflow global. No se cambió ancho/margen de page para compensar capturas.

Build correcto; capturas carrier-master-vehicles.png, carrier-composition-1440.png y carrier-composition-390.png. Se recorrieron Consulta rutas/órdenes, paginación con tamaño1, filtro de un resultado y sin resultados, notificaciones y cambio de consulta móvil por Enter en Más filtros. Se conserva el detalle compacto acordado, sin imponer Drawer por la maestra. Esta decisión sustituye el encabezado anterior y la barra de modos. Pendiente aprobación visual del usuario; no se considera aprobada sólo por importar componentes.

## Corrección vigente: integración en el entorno SIAL

El usuario señaló que una cabecera independiente no constituye integración en la propuesta funcional. Se elimina el shell externo y se monta ConmatCarrier dentro de main/page del shell compartido, con sidebar, búsqueda, perfil, tema y navegación de SIAL. Config activa gestion/transporte/conmatPortal. El acceso desde panel navega en la misma pestaña. Se retira el CSS de layout de app independiente y el selector de tema local. La separación funcional por empresa se conserva en el contenido, no implica un sitio separado.

Esta decisión sustituye las declaraciones anteriores de shell externo, ausencia de navegación interna y apertura en otra pestaña. Build correcto. Navegador1440: panel → portal en misma pestaña, menú portal activo, navegación lateral a agrupación y retorno, detalle abre/cierra; una sola cabecera. Móvil390: documento375 sin overflow, cabecera compartida y notificaciones operativas. Capturas carrier-integrated-desktop.png y carrier-integrated-mobile.png; escritorio inspeccionado. Sin cambios en reglas de datos o backend. Pendiente aprobación visual.

## Corrección de descubrimiento en el catálogo

Se detectó que las cuatro páginas CONMAT existían en la propuesta y el contrato de menú, pero faltaban en sial-catalogo.js. Se registran las cuatro en Transporte con etiquetas CONMAT/HU1919, y se versiona la carga del catálogo y contrato de navegación para evitar caché anterior. Comprobado en index.html#transporte: cuatro fichas visibles y acceso Abrir vista del portal conduce a Mis servicios. No cambia publicación ni despliegue.

Vista conmat-transportadora.html, CA06 y presentación de notificaciones CA11. Referencia de familia: bandeja órdenes CONMAT, no dashboard. Una superficie con modos rutas/órdenes sin ruta, filtros y consulta compacta; shell externo sin menú ni enlaces operativos internos. Se conserva identidad, ancho máximo1280 y controles del paquete. No introduce métricas o cards anidadas. La asignación de vehículo/conductor CA07 sigue como siguiente vista; aquí se revisa la información previa.

Accesos: panel interno → Portal transportadora abre otra pestaña; navegación interna Transporte → CONMAT Portal transportadora. El portal recibe empresa de demostración conocida (defaultcaribe) y no ofrece selector operativo de empresas. No es autenticación ni aislamiento de servidor; la query permite revisar fixtures de norte/rutas como escenarios separados. Empresa desconocida/suspendida no muestra datos. Consulta directa de ruta ajena muestra Servicio no disponible. Borradores excluidos y órdenes sin ruta sólo si preasignadas a esa empresa.

## Componentes por vista

| Necesidad | Consumo |
|---|---|
| Bandeja | Card única, Toolbar, Table, TableRowActions, Pagination |
| Filtros | FilterToolbar, TextInput, SelectInput, DateInput; stylesheet fuente scoped extendido a conmat-carrier |
| Estados y acciones | Chip, Button, IconButton/ViewIcon, Notice; carga de Table publicada |
| Consulta y notificaciones | Table/Chip/Button en ConmatFloatingView feature-local existente |
| Shell externo | Composición local con identidad shared/sial-core y controles publicados; sin navegación interna |

Todos los controles nuevos desde banasan-ui-conmat snapshot vigente ya versionado. Sin cambios en fuente/paquete de librería. Contenedor modal sigue como excepción semántica documentada, no se disfraza ProfileDialog como modal genérico. El encabezado externo se compone localmente porque el shell interno expone funciones de Banasan. La tabla conserva scroll horizontal interno en móvil para presentar fechas y estados sin romper semántica.

## Comportamiento y supuestos

Datos derivados de rutas/órdenes locales existentes. El detalle reconsulta pertenencia, muestra viaje/subgrupo/órdenes, fechas efectivas y materiales con unidades separadas. Anulados se conservan como consulta histórica sin órdenes vigentes. Ruta sin órdenes se distingue como Sin programación activa. Novedades no sustituyen estado operativo: aparecen como observación y filtro adicional; En ejecución también incluye rutas con novedad.

Notificaciones derivadas de rutas recibidas, eventos de modificación y preasignaciones de órdenes sin ruta; eventos fuente contienen motivo si existe. Semillas de recepción del23nov son ilustrativas, no entrega real. Lectura en localStorage por empresa, idempotente; filtros todas/sin leer y consulta del registro. Recarga conserva leídas. Si falla guardado no se declara lectura exitosa. No backend, envío, permisos productivos ni auditoría certificada.

## Evidencia ejecutada

- Build Vite y check-conmat-demo.mjs correctos; añadidos escenarios de empresa propia/ajena, materiales, IDs de notificación únicos, borrador excluido y confirmación incorporada al portal.
- Navegador1440: paginación con tamaño1/siguiente, filtro de un resultado y vacío, En ejecución incluye R003 con novedad; finales por empresa rutas. Error/reintento/carga y empresa desconocida. Notificaciones marcan lectura, filtran pendientes, abren ruta/orden y persisten tras recarga.
- Ruta ajena R002 desde caribe devuelve Servicio no disponible. No hay enlaces internos de agrupación/órdenes en el portal.
- Integración: desde panel se abre portal en otra pestaña; cancelar OS04812 en agrupación reduce composición visible y genera notificación del cambio con motivo en portal. Se conserva la orden sin ruta y sus materiales.
- Capturas carrier-1440.png y carrier-390.png inspeccionadas; modo oscuro carrier-dark.png. Ancho documento1440/390 sin overflow global; ventana580px en escritorio y366px en móvil con tablas internas desplazables. Sin errores JS/console en contextos aislados. Escape cierra detalle y notificaciones; controles nativos de teclado conservados.

Estado: validado localmente como propuesta del alcance CA06, pendiente aprobación visual. No declara completado el portal funcional ni toda la HU. SELF según carrier-brief.md; tarea Ares0a4de87c-9b6d-483f-9f38-19d8a78f6fc7.
