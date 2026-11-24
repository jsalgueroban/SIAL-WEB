# HU1919 · Agrupación de rutas · Propuesta Web

## Restitución acotada solicitada por el usuario

Se restauran las dos regiones marcadas: TreeList jerárquico transportadora/ruta/viaje/subgrupo y presentación publicada de GroupMove con grupos delimitados, radio y sombra originales. Se eliminan los overrides de regiones abiertas. El encabezado, consultas y acciones del detalle vigente se conservan. En móvil continúa el selector compacto de ruta. Seleccionar un viaje/subgrupo en el árbol sincroniza el viaje del detalle y el subgrupo inicial de edición; creación abre ancestros del nuevo elemento.

Build correcto; navegador aislado1440: expansión del primer viaje, selección Subgrupo2 y apertura de edición con Subgrupo2 comprobadas; grupos publicados presentes con radio12px y sombra fuente. Captura routes-restored-sections.png. Esta restitución sustituye únicamente la lista plana y el estilo abierto descritos en la composición anterior.

## Composición vigente: lista de rutas y viaje enfocado

El usuario rechazó los ajustes anteriores y autorizó proceder con la primera opción recomendada: lista + detalle de un viaje. Rige routes-focused-brief.md. Se sustituye el árbol completo por TreeList/navigation plano sin hijos; ruta/empresa/fincas siguen visibles. SelectInput elige viaje y en móvil también ruta. Primer viaje activo por defecto. GroupMove muestra disponibles y sólo subgrupos del viaje; Mover entre viajes activa temporalmente la composición completa. La selección de ruta/viaje vuelve al modo enfocado. La jerarquía funcional permanece, pero ya no es un árbol expandible.

Se eliminan cards de contexto/metadatos y la barra de pie. Fecha y composición son texto semántico local; no imitan un componente interactivo. Materiales/historial se consultan junto al contexto de ruta. El área de grupos adapta el componente publicado con estilos locales sin cajas/sombras, preservando selección, foco, hover y destino de movimiento. Editar subgrupo incorpora SelectInput en la ventana compacta para elegir cuál se edita. Las órdenes individuales conservan sus controles nativos. Confirmación de programación sólo al final de borradores; no hay pie permanente en rutas confirmadas. Se sustituyó el CSS acumulado por una hoja de la composición vigente.

Evidencia: build correcto y check-conmat-demo.mjs. Navegador: crear segundo viaje/subgrupo, incorporar OS04809, ocultarla al cambiar al viaje1, moverla mediante modo entre viajes y editar segundo subgrupo; pertenencia final R001-V01 comprobada. Móvil390: cambiar ruta, bloquear ejecución R003, consultar materiales R002 (Cartón85 bultos), historial/Escape y filtro sin resultados. Sin errores JS en capturas1440/390; sin overflow; grupos sin sombras. Capturas routes-focused-1440.png y routes-focused-390.png inspeccionadas. Esta composición sustituye todas las anteriores; queda pendiente aceptación visual, no modifica paquete ni backend.

## Corrección posterior: reducir recuadros y simplificar el pie

El usuario rechazó el exceso de cards. Se elimina la superficie/borde del contexto de ruta y se adapta sólo KeyValueGrid de esa cabecera con className local para datos sin cajas. Conserva componente publicado, labels y valores; no afecta las ventanas. Cambiar programación pasa al encabezado de ruta; el pie deja de ser franja blanca y contiene sólo materiales/historial y, en borradores, confirmación. Se eliminan los botones inferiores de viaje duplicados por TreeList. Esta corrección sustituye el tratamiento de contexto/pie descrito en el ajuste anterior.

Build correcto; navegador1440/390 sin overflow, campos sin bordes/fondo, apertura de materiales y cambio de programación comprobadas. Capturas routes-flat-1440.png y routes-flat-390.png. Revisión visual escritorio realizada; pendiente aceptación del usuario. No se modifican contratos ni paquete de librería.

## Ajuste visual solicitado · 24 noviembre

Cabecera y filtros usan color-surface; área de trabajo color-bg y contexto de ruta color-surface. Transportadora pasa de azul de acción a texto secundario; azul queda para selección y controles. Pie blanco con separación superior: materiales/historial a la izquierda y cambiar/confirmar programación a la derecha. En móvil consultas en dos columnas y operaciones a ancho completo. Sólo composición local, conserva componentes publicados y flujos.

Build correcto; capturas routes-layout-1440.png y routes-layout-390.png. Inspección visual escritorio realizada; medidas sin overflow global en390, apertura Cambiar programación comprobada en ambos tamaños. Tema oscuro verifica superficies21/30/45 sobre área15/23/36; sin colores nuevos fuera de tokens. Aprobación visual pendiente.

Entrega local del 23 de noviembre de 2026. Fuente funcional: HU1919 revisión 16, CA-03 y reorganización de CA-04. El usuario confirmó Ruta → Viaje → Subgrupo → Órdenes como niveles separados. Esta decisión corresponde a la propuesta, no define un contrato API.

## Composición y acceso

Mesa de organización: árbol por transportadora a la izquierda y agrupación de órdenes de la ruta a la derecha. Se conserva la identidad de órdenes y panel; la consulta plana del panel no resuelve la edición de una jerarquía. La composición es una hipótesis local, pendiente de aprobación visual, no un patrón global de SIAL.

Acceso: shell Transporte/conmatRutas → conmat-rutas.html; cabecera de órdenes → Agrupar rutas; confirmación de preasignación → Agrupar rutas con filtro de empresa; panel → Agrupación y detalle → Consultar agrupación. Retorno a órdenes preasignadas y panel en la cabecera. Comparación en viewport 1440×1000, DPR1: se mantiene shell, contenedor y ancho máximo compartidos; no se compensa el zoom mediante márgenes locales. En 390×1000 se apilan árbol y mesa, sin desbordamiento horizontal (documento 390px).

## Consumo verificable

Todos los controles nuevos importan banasan-ui-conmat, alias local del snapshot vigente documentado en vendor/conmat-ui-20261123/provenance.json. No se modificó la librería fuente ni se publicó un paquete.

| Necesidad | Componentes consumidos | Evidencia |
|---|---|---|
| Estructura y selección jerárquica | TreeList/navigation | DOM nativo, expansión, selección y contexto de ruta/viaje/subgrupo |
| Incorporar y reorganizar órdenes | GroupMove, onMove y onMoveMany | Movimiento por teclado entre viajes, retiro y confirmación; controles de lote nativos |
| Buscar y filtrar | FilterToolbar, TextInput, SelectInput, DateInput | Búsqueda vacía, limpiar, filtros adicionales por Enter/Space; adaptación móvil |
| Crear y editar niveles | Button, IconButton/EditIcon, campos publicados | Ruta nueva, viaje y subgrupo guardados; edición bloqueada en ejecución |
| Contexto, estado y cantidades | Card, Toolbar, Chip, KeyValueGrid, Table | Estado único, fecha, composición y totales por material/unidad |
| Confirmación e historial | Notice, ToastProvider/useToast, DrawerAuditList | Confirmación de programación y eventos antes/después con fecha y actor demo |

El contenedor ConmatFloatingView es feature-local: el paquete no expone modal genérico y ProfileDialog no admite contenido arbitrario. Se reutiliza la ventana compacta ya acordada, con foco contenido/restaurado, Escape, fondo modal y controles publicados. No se presenta como componente de librería. CSS local organiza la página y el apilado; FilterToolbar conserva su stylesheet fuente bajo scope, TreeList y GroupMove utilizan el CSS compilado del snapshot.

## Integración y límites de la simulación

Un único estado local versionado conserva órdenes y composición. Migración v1→v2 preserva preasignaciones anteriores. La orden guarda una sola pertenencia ruta/viaje/subgrupo; los totales se derivan de sus materiales y unidades. Sólo se incorporan órdenes preasignadas de la misma empresa. Retirar devuelve la orden a disponibles sin perder cantidades o transportadora. Una orden agrupada no puede preasignarse aisladamente desde la bandeja. Confirmar programación actualiza órdenes y panel; las rutas en construcción permanecen en agrupación hasta confirmarse.

Supuestos de propuesta: cada viaje debe tener al menos un subgrupo y cada subgrupo al menos una orden para confirmar; ruta con fecha y transportadora activa; edición permitida antes de ejecución, ejecución/finalización de sólo consulta. Estas validaciones demuestran una experiencia y deben contrastarse al definir reglas definitivas. No hay asignación interna de vehículo/conductor, notificación real, autorización por rol, concurrencia de servidor ni persistencia API. Esto delimita la propuesta visual, no constituye un fallo de backend.

## Validación ejecutada

- Build Vite y scripts/check-conmat-demo.mjs: fixtures, migración, no duplicación, compatibilidad, bloqueo, movimientos, programación, totales y auditoría.
- Navegador aislado: crear ruta/viaje/subgrupo, incorporar OS-04809, confirmar y comprobar orden Programada y nueva ruta en panel. No se alteran los datos del navegador del usuario.
- Crear segundo viaje/subgrupo en R-001, mover OS-04812 mediante Enter, confirmar, retirar a disponibles y revisar historial: pertenencia única y estado final Preasignada sin ruta.
- Filtros, ausencia de resultados y ruta en ejecución bloqueada. Escritorio 1440 y móvil390 sin errores JS ni overflow global. Capturas routes-desktop.png y routes-mobile.png inspeccionadas.

Gates: semántico e interacción del recorrido descrito comprobados; visual local inspeccionado en escritorio/móvil, aprobación del usuario pendiente. No se declara certificación funcional productiva ni cobertura de todos los escenarios de la HU. SELF: slice estrechamente integrado con el estado y las tres vistas locales; sin beneficio independiente de delegación.
