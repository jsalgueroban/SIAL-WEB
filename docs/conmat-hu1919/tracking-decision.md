# Seguimiento operativo · CA08

Propuesta local del 24 de noviembre de 2026. Fuente: HU1919 revisión 16. SELF: continuidad sobre estado local compartido; no existe un slice independiente que justifique delegación.

## Composición

Vista integrada en menú Transporte, catálogo, portal y panel interno. Una superficie de gestión contiene indicadores sin tarjetas adicionales, FilterToolbar, detalle embebido, tabla y paginación. El detalle utiliza el contrato compartido inline-form-panel inline-form-compact; conserva contraste, bordes y tokens de claro/oscuro. Campana global única.

Se consumen componentes publicados del alias banasan-ui-conmat: Card, Toolbar, FilterToolbar, TextInput, SelectInput, DateInput, Table, TableRowActions, Pagination, Button, IconButton, Chip, Notice, ToastProvider y FlowTimeline connected. Confirmación de hitos mediante la vista compacta compartida existente.

## Necesidad representada

| Necesidad CA08 | Representación |
|---|---|
| Vehículos por estado | Conteos de vehículos distintos programados, pendientes de salida, en operación, con novedades y finalizados; novedades puede superponerse al estado operativo |
| Consulta operativa | Filtros por ruta/finca, placa, conductor, fecha y estado; incluye atraso según horario programado de Bogotá |
| Hitos | Secuencia programación, preparación, salida, llegada, entrega y retorno; el cierre queda pendiente para CA09 |
| Novedades | Registro y atención con observación, fecha y responsable; conserva reporte original y resolución |
| Actores | Transportadora registra sobre su empresa; consulta interna reúne servicios y es de solo lectura |
| Integración | Estado local compartido con portal, asignación, agrupación y panel; iniciar operación bloquea modificación de agrupación |

Cada fila corresponde a una asignación vigente por ruta o subgrupo. La salida requiere cobertura completa de la ruta. Las horas históricas iniciales son ilustrativas; los nuevos registros conservan la hora real de la interacción. No se representa GPS ni se garantiza autorización, auditoría, notificación o persistencia de servidor. El rol se simula mediante contexto de navegación. El cierre operativo y los soportes continúan pendientes.

## Verificación

Build Vite y scripts check-conmat-demo, check-conmat-assignment y check-conmat-tracking correctos. El último comprueba aislamiento de empresa, secuencia, duplicados, cobertura, cambios de asignación, novedades y conservación de actor/fecha, atraso y sincronización.

Recorrido navegador en contexto limpio: atender espera en finca, conservar texto original, confirmar llegada, habilitar siguiente hito y consultar resolución desde modo interno sin acciones de escritura. Filtro por placa y resultado vacío comprobados; empresa desconocida no expone la ruta. Sin errores de consola. Móvil de 390 px sin desbordamiento global; tabla conserva desplazamiento horizontal propio. Revisión visual de escritorio, móvil y oscuro en tracking-inspection.png, tracking-1440.png, tracking-390.png y tracking-dark.png. Esto valida la propuesta local, no constituye aprobación visual ni validación de un backend.

## Ajuste de indicadores solicitado

Se sustituyen los conteos planos por cinco Card variant stats publicadas, fuera de la superficie de gestión. Dirección específica aprobada por el usuario; no modifica el patrón global ni agrega tarjetas al formulario. Cinco columnas en escritorio, tres en ancho intermedio y dos en móvil. Build correcto; montaje de cinco bui-card y ausencia de desbordamiento global a 390 px comprobados. Evidencias: tracking-cards-1440.png y tracking-cards-390.png.

La columna operativa distingue estado principal (Chip En operación), novedad abierta (texto de advertencia) y atraso calculado (texto rojo Fin estimado vencido). Son dimensiones coexistentes, no tres estados excluyentes. El atraso compara fecha/hora final programada contra reloj actual de Bogotá cuando ya hubo salida y el servicio no está finalizado; no es evidencia de GPS. La card Con novedades cuenta vehículos con reportes abiertos y puede incluir los de En operación.

## Separación de avance y atención

Dirección aprobada: cuatro cards de avance. Con novedades deja de ser card y pasa a Button publicado como filtro rápido con contador de servicios coincidentes, aria-pressed y alternancia; se combina con los filtros de ruta, placa, conductor, fecha y estado. Limpiar filtros también desactiva este filtro. Las cards mantienen el contexto de los demás filtros para evitar que activar novedades altere el panorama de avance. El selector Estado contiene únicamente etapas operativas.

La tabla separa Estado operativo (un Chip) de Seguimiento (Novedad pendiente y Fuera de horario en texto secundario, separados por punto). Sin alertas sustituye el vacío. El aviso horario conserva como título su explicación específica, Salida atrasada o Fin estimado vencido. El detalle completo permanece embebido.

Build correcto. Navegador limpio interno: cuatro cards, cinco filas iniciales, una al activar novedades, cinco al desactivar; aria-pressed correcto, sin errores de consola. Móvil 390 px sin desbordamiento global. Evidencias tracking-state-followup-1440.png y tracking-state-followup-390.png. Ajuste local, SELF; no cambia librería ni reglas de negocio.
Ajuste posterior: se retira el botón aislado Con novedades. Seguimiento es ahora un SelectInput publicado dentro de FilterToolbar, con Todos, Con novedades (contador) y Fuera de horario. Dirección local de integración; build correcto y selección/restablecimiento recorridos en navegador.

## Composición de trazabilidad de pallets aplicada

Referencia explícita del usuario: Gestion Operaciones Puerto/trazabilidad-pallets.html, src/web/pallet-trace-detail.jsx y su CSS. Reuse local de consulta/detalle: Card independiente después de tabla y paginación, cabecera, recorrido seleccionable a la izquierda y detalle del hito a la derecha. Se reutiliza la composición pallet-workspace y se consumen FlowTimeline connected, KeyValueGrid, Card, Chip y Button del paquete publicado CONMAT; no se importa el runtime antiguo de pallets.

Cada selección muestra título, fecha y responsable del hito; los hitos futuros indican Pendiente sin inventar fecha ni actor. Las novedades se identifican como novedades del servicio, no como datos del hito seleccionado. Conserva registro y atención, acciones operativas y navegación al cierre. Seleccionar una fila lleva al detalle inferior; cerrar restaura foco. En móvil el workspace pasa a una columna. Build correcto, selección de primer hito comprobada, detalle 24 px después de la bandeja, móvil sin desbordamiento global. Evidencia tracking-pallet-composition.png. Ajuste específico de vista, SELF; no constituye cambio global de patrón ni modificación de librería.

## Auditoría runtime de la URL de pallets

Se abrió la URL indicada y se recorrió la trazabilidad 353970050177452895. Referencia visual pallet-reference-audit.png. Se corrigió la aproximación anterior: superficie blanca, cierre textual en cabecera, banda del último hito con estado actual, cuatro datos simples de contexto y dos columnas .85fr/1.5fr. El recorrido contiene sólo eventos registrados, invertido del más reciente al más antiguo, con contador y selección inicial del último; no mezcla hitos futuros con historial. El detalle de evento usa datos planos con la misma composición Facts del patrón, sin recuadros KeyValueGrid. Esto es composición feature-local de datos, no un nuevo componente de librería. FlowTimeline, Card, Chip y controles siguen siendo publicados.

CONMAT conserva su semántica: Novedades del servicio permanece identificada como información del servicio y las acciones operativas quedan al final del panel derecho. Cierre operativo conserva su acceso. Validado historial de tres eventos en orden 3/2/1, cambio del evento seleccionado, superficie blanca y móvil sin desbordamiento. Evidencia tracking-pallet-audited.png. No se alteró la vista de pallets.
Interacciones del patrón completadas: desplazamiento suave al detalle y al retorno a fila, selección visible de fila mediante rowClassName/rowProps publicados, transición de fondo, apertura de detalle y remount con animación pallet-detail-enter de 200 ms al cambiar hito. Filtros/paginación cierran el detalle como en pallets. Novedades y formularios no se remontan al cambiar el hito. prefers-reduced-motion elimina animaciones y scroll suave. Build correcto; selección, cambio, cierre, foco y cierre al filtrar comprobados.
