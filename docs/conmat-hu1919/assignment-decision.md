# HU1919 CA07 · Asignación operativa · Web

## Contraste compartido del embebido

Se reemplaza la pintura local por la composición real inline-form-panel/inline-form-compact del core, con form-heading, form-body y form-actions. Se retiran fondo color-bg, borde/radio locales y padding duplicado. Se mantienen SelectInput/SearchSelectInput/DateInput/TextInput/Button publicados; no se imitan campos con clases.

Comparación ejecutada contra Nuevo tipo de empresa a1440: estilos computados idénticos para fondo/borde/radio/sombra/padding en ambos temas. Claro: panel248/250/252, campos255/255/255, radio12px, padding18px y sombra0/4/16. Oscuro: panel16/25/40, borde37/50/71, sombra0/4/18; campos conservan borde46/59/82 según librería. Controles44px. Capturas assignment-contrast-light.png y assignment-contrast-dark.png; claro inspeccionado. Móvil390 sin overflow; selección, revisión, Volver y Cancelar comprobados. Build correcto. Sin cambio de lógica ni librería.

## Composición vigente: formulario embebido en el portal

El usuario indicó que el formulario debe ser embebido. Se sustituye la página dedicada por EmbeddedConmatAssignment dentro de la Card del portal, inmediatamente después de FilterToolbar y antes de Table. Sin Card anidada ni cabecera/shell adicionales. Se mantienen alcance, validaciones, revisión, motivo e historial. El cierre de captura se centra según la familia de formulario integrado; Cancelar cierra sin escritura y restaura foco, conservando filtros/paginación. Confirmar una asignación completa cierra el panel y actualiza la bandeja; una parcial lo mantiene para continuar con otro subgrupo. El ToastProvider permanece en el portal para que el éxito sobreviva al cierre.

Entradas: acción Asignar de la fila, CTA de bandeja y Gestionar asignación desde detalle; todas abren el mismo panel sin navegar. Se retiran la opción independiente de menú/catálogo. conmat-asignacion.html se conserva como alias de compatibilidad que redirige a conmat-transportadora.html?asignar=R001 (o primera ruta disponible), no como pantalla distinta. La campana sigue siendo única. Esta decisión sustituye la elección de formulario dedicado y máximo1180 descritos abajo; ahora hereda el ancho de la bandeja del portal, sin override de page.

Build correcto y check-conmat-assignment.mjs. Navegador1440/390: panel dentro de card, después de filtros y antes de tabla, sin cards interiores, misma URL, filtro Norte conservado tras Cancelar, confirmar cierra y muestra Programada, sin overflow. Alias anterior redirige y abre panel; asignación parcial mantiene formulario; sin opción independiente de menú. Capturas assignment-embedded-1440.png y assignment-embedded-390.png, escritorio inspeccionado. Pendiente revisión visual.

24 noviembre2026. Fuente HU1919 rev16, ocho puntos de CA07 leídos antes de construir. Skills sial-design-proposals, sial-web-library (consumo de contratos, sin modificación del paquete), Dona y evaluación agent-delegation-router. SELF build-slice según assignment-brief.md: contexto de estado/navegación local acoplado, sin beneficio independiente. Propuesta funcional local, no frontend productivo ni certificación Eva.

## Composición y acceso

Formulario dedicado, vía reuse de registro-vehiculo.html para anatomía de secciones/campos/cierre, con campos específicos de CA07. Se descarta captura como filas de tabla: mezcla selección de alcance, habilitación y revisión y dificulta errores de horario. No hay decisión estética abierta: se conserva la composición SIAL requerida por el usuario y sus decisiones de ventanas compactas/componentes.

Shell compartido, menú conmatAsignacion dentro de Transporte y catálogo CONMAT. Portal → Asignación operativa o acción Asignar R001 → conmat-asignacion.html?empresa=caribe&ruta=R001, en la misma pestaña. Detalle de ruta → Gestionar asignación. Volver al portal conserva empresa. No se agregan controles de asignación a agrupación interna.

Page-eyebrow/título/propósito/retorno → Card única con empresa/estado → alcance → vehículo/conductor → horario → motivo si reemplazo → revisión compacta → confirmación. Tabla de asignaciones e historial dentro del mismo contenedor, sin cards anidadas, métricas ni banner técnico. Familia registro-extenso pública del core: page máximo1180px; no override local de ancho/márgenes. La pantalla maestra y la vista en1440×1000/DPR1 muestran page x158.333/ancho1180; móvil390 page x12/ancho366. Campos de recurso44px y misma línea base. Su disposición responde a dos recursos y tres datos de horario, no copia documentos ajenos del registro de vehículo.

## Vista × componente

| Necesidad | Consumo publicado / excepción |
|---|---|
| Superficie y secciones | Card única, Toolbar; encabezados/secciones semánticas locales |
| Ruta/alcance/subgrupo | SelectInput; opciones incompatibles deshabilitadas |
| Vehículo/conductor | SearchSelectInput con búsqueda, descripción y opciones no habilitadas deshabilitadas |
| Fecha/horas/motivo | DateInput readonly, TextInput con ayuda HH:mm y validación inline; sin TimeInput público, no se crea un control imitado |
| Revisión/feedback | KeyValueGrid, Notice, ToastProvider/useToast, Button |
| Resultados/historial | Table, TableRowActions, IconButton/EditIcon, Chip, DrawerAuditList |
| Ventana compacta | ConmatFloatingView feature-local existente, foco/Escape/retorno; no modal nuevo de librería |
| Notificaciones | Campana compartida única; ConmatCarrierNotifications extraído y reutilizado por portal/asignación |

Todos los nuevos controles desde banasan-ui-conmat, snapshot versionado ya consumido. Sin rebuild/release de librería. Tablas de asignaciones por ruta no se paginan: conjunto finito del servicio, no bandeja global.

## CA07 y frontera

| Punto | Representación |
|---|---|
| Placa por ruta o subgrupo | Alcance explícito; no mezcla asignación total y parcial |
| Conductor asociado | Selector de conductor de la misma empresa |
| Responsabilidad de transportadora | Acciones en portal/asignación; panel interno sólo consulta |
| Habilitación | Fixtures de vehículos/conductores habilitados y no habilitados, validación en revisión/confirmación |
| Reemplazo previo a ejecución | Precarga de asignación, motivo obligatorio, no-op rechazado, historial antes/después |
| Incompatibilidad de horario | Intervalos por fecha; rechaza vehículo y conductor ya ocupados, permite ventanas consecutivas |
| Consulta Banasan | Placa/conductor/horario en detalle del panel y del portal |
| Responsable/fecha | Operador de transporte y timestamp de confirmación en eventos/historial |

Supuestos: horarios dentro del mismo día; fin estimado después de salida; fecha viene de programación y un alcance debe tener fecha efectiva única. Cobertura parcial deja ruta pendiente; al cubrir todos los subgrupos pasa a programada. La fecha/órdenes del alcance se revalidan al confirmar. Un cambio de programación deja asignación no vigente y ruta pendiente; debe revisarse. Cambiar transportadora retira asignaciones activas y conserva historia. No se borran órdenes ni cantidades.

Datos en snapshot local version2 compatible, campo opcional assignments. Rutas antiguas programadas/en ejecución/finalizadas tienen asignaciones ilustrativas derivadas de los fixtures; no se inventan datos reales. Se materializan antes de reprogramar para conservar fecha previa. No hay permisos efectivos, validación documental remota, disponibilidad concurrente ni envío de notificaciones. Los eventos están disponibles para consulta local. Estas garantías de servidor no se presentan como ejecutadas.

## Evidencia ejecutada

- Build Vite y check-conmat-demo.mjs correctos, regresión de fixtures/migración/agrupación/programación. check-conmat-assignment.mjs verifica alcance, actor/fecha, habilitación, empresa ajena, horarios inválidos, cruces de vehículo/conductor, revisión sin escritura, reemplazo con motivo, no-op, cobertura parcial/completa, selección obsoleta, reprogramación e invalidación por cambio de empresa.
- Navegador1440: portal Asignar R001 → página integrada; opción TUV789 no habilitada deshabilitada; KLM456/AnaHerrera confirmados. Revisión no escribe. Ruta pasa a estado1; placa/conductor visibles en detalle del portal y panel interno.
- Móvil390: asignación por subgrupo, cruce WFX123 con R003 mostrado inline, primer subgrupo deja parcial, segundo en ventana consecutiva completa ruta. Reemplazo a WFX123/CarlosPérez con motivo, historial muestra motivo y actor; sin overflow global.
- Revisión: Tab desde confirmar vuelve a cerrar, Escape conserva datos sin guardar. Campana única abre las notificaciones de empresa en asignación; no botón duplicado. R003 en ejecución sólo consulta y sin formulario; R002 ajena se rechaza.
- Capturas assignment-1440.png y assignment-390.png inspeccionadas; assignment-dark.png y assignment-review-mobile.png registran tema/revisión. Una cabecera y una campana; sin errores JS en contextos aislados.

Gates: semántico e interacción del alcance ejecutados; contraste visual escritorio/móvil realizado, aprobación visual del usuario pendiente. Entrega local, sin commit/push ni publicación. Ares0bad5348-99cd-453e-9da6-315fcbf43998 en revisión al entregar. Próximo bloque CA08 seguimiento operativo.
