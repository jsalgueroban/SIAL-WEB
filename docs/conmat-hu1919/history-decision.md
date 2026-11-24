# Historial de rutas · CA11.3–4

24 noviembre de 2026. HU1919 revisión 16. Consulta transversal de eventos existentes; no una nueva etapa operativa. SELF: estado y composición local compartidos; no existe beneficio independiente de delegar este slice. Skills propuestas SIAL, librería Web en modo consulta y Dona.

## Composición y navegación

Reuse del patrón de pallets explícitamente elegido: Card de bandeja con filtros, tabla y paginación; Card blanca inferior con cabecera/cierre, contexto, recorrido inverso seleccionable y detalle a la derecha. Apertura suave, selección de fila, transición de evento, cierre con retorno de foco y reduced motion. En móvil se apilan las columnas.

Entradas desde menú/catálogo, agrupación → Historial y seguimiento → Historial de la ruta. La campana conserva un único acceso global y puede abrir el historial de ruta. Cada evento ofrece acceso al registro relacionado: agrupación/portal, seguimiento, cierre o documentación/revisión interna según contexto.

Consumo publicado Card, Toolbar, FilterToolbar, TextInput, SelectInput, Table, TableRowActions, Pagination, Button, IconButton, Chip, FlowTimeline y Notice. Datos simples y workspace reutilizan la composición del patrón de pallets. Sin controles de modificación en el historial.

## Fuente de datos

Sólo route.events del store compartido: programación, agrupación, asignación, hitos/novedades, cierre y documentos. No se generan eventos para completar fixtures; rutas sin registros lo indican. Se conserva operación, fecha/hora de Bogotá, actor, antes, después, motivo, alcance y registro de comunicación cuando la fuente lo contiene. Una comunicación histórica no se presenta como comprobante de entrega de servidor.

Filtros de ruta, tipo de operación y transportadora interna. La tabla muestra la última operación coincidente; el detalle filtra el recorrido sin cambiar el registro original. Índice de origen y fecha resuelven orden estable, incluso para eventos con igual timestamp. Contexto externo sólo ofrece rutas programadas de su empresa, sin selector de otras empresas. Roles y límites son demostrativos de cliente, no autenticación ni auditoría productiva.

## Validación

Build y check-conmat-history correctos: orden estable inverso, filtro de operación, rutas vacías, empresa, alcance y destinos relacionados. Navegador limpio: registrar novedad y llegada, abrir desde seguimiento, elegir evento anterior y consultar registro relacionado. Se corrigió que la observación de una novedad pudiera trasladarse al siguiente hito; el recorrido confirma que no se reutiliza. Sin errores de consola.

Paginación a R-006, ruta externa ajena no expuesta, vacío real, móvil 390 px sin desbordamiento, selección por Enter, foco en detalle y retorno a la fila, transición pallet-detail-enter comprobados. Evidencias history-1440.png, history-390.png y history-dark.png. Pendientes: revisión transversal de todos los escenarios CA11/12/13 y aprobación visual del usuario; esta vista no afirma cobertura completa de esos criterios.
Corrección de notificaciones: se retira ConmatFloatingView de la campana y se restaura la bandeja anclada profile-panel-wide de SIAL. Filtros Todas/Sin leer/Pendientes; acciones mediante TableContextMenu del mismo snapshot banasan-ui-pr2243 usado por el shell. Datos, lectura y pendientes permanecen locales por contexto. Se reutiliza el CSS compartido y se excluyen ambos grupos de filtros del override de botones de la bandeja. Build correcto; menú, pendientes, lectura, Escape, móvil y ausencia de backdrop comprobados. Evidencia notifications-restored.png.
