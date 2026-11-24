# Portal transportadora · HU1919 CA06 · Web

Corrección vigente del usuario: integrar dentro del shell compartido de SIAL, con su menú y cabecera. Se descarta la interpretación previa de shell externo y la apertura en otra pestaña; ver carrier-decision.md. Separar rol/empresa no significa sacar la vista de la propuesta funcional.

24 noviembre2026. Bandeja/consulta de empresa activa. Reuse de órdenes CONMAT como referencia de tabla/filtros/consulta compacta; shell externo específico sin navegación interna. La HU establece espacio propio, rutas/órdenes asignadas, estados, materiales y notificaciones antes de la asignación operativa. No se construye CA07 en este slice.

Composición: encabezado de empresa, acceso a notificaciones, una superficie de consulta con filtros publicados, modos rutas/órdenes sin ruta y tabla/paginación. Detalle compacto con viaje/subgrupo y materiales de cada orden. Sin métricas/cards anidadas. Comparada con dashboard, se elige bandeja porque la tarea es consultar servicios propios, no analizar distribución. Identidad y densidad de la bandeja existente; separación de rol sin enlaces operativos internos en el portal. Entrada desde panel interno es acceso de laboratorio, no salto de permisos productivo.

Sesión demo por empresa conocida en query (defaultcaribe), sin selector de empresas dentro de la operación; empresa desconocida/ajena y ruta no autorizada muestran mensaje sin contenido. No constituye autenticación. Borradores no se exponen. Estados y notificaciones derivan del estado local compartido, lectura local por empresa; no simula entrega real. Notificaciones de ruta vinculan su registro; órdenes preasignadas sin ruta tienen detalle propio.

Controles desde banasan-ui-conmat: Button, Card única, FilterToolbar, TextInput, SelectInput, DateInput, Table, Pagination, TableRowActions, IconButton/ViewIcon, Chip, Notice, Skeleton/Spinner si carga. ConmatFloatingView es contenedor feature-local ya documentado. SELF build-slice: contexto compartido estrecho, sin beneficio independiente por exportación; router evaluado. Dona: tarea0a4de87c-9b6d-483f-9f38-19d8a78f6fc7. Sin paquete, backend, Azure o publicación.
