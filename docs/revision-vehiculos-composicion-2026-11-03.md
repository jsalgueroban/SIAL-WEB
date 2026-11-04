# Revisión integral de la propuesta de vehículos

Fuente: fe-sial-web 4dfeb23d, feature audit/operational-vehicles. Alcance: comparación estática y recorridos simulados; no QA de backend ni de despliegue. SELF: revisión y corrección acopladas a una sola vista; no se delega. Skills aplicadas: sial-design-proposals, sial-web-library modo consumo y Dona.

## Contraste por responsabilidad

| Elemento | Fuente real | Resultado en propuesta |
| --- | --- | --- |
| Consulta | OperationalVehicleAuditPage y service: GET transport-operations/vehicles con viewMode=extended | Fixtures exclusivas de vehículos; no consulta movimientos de inspecciones |
| Catálogos de filtros | VehicleScheduleService.getVehicleStages y LocationService.getLocations | Opciones simuladas separadas; año, semana, etapa y ubicación conservados |
| Identidad | VehicleOperationalAuditEvent | Radicado, OP, placa, tipo, transportadora y conductor conservados |
| Estado actual | mapper: currentProcess / stage, último movimiento para ubicación | Contexto separado del hito histórico; fixtures de puerto y tránsito coherentes |
| Recorrido | mapper ordena ascendente e incluye programación, entrada y salida | Se añade programación ausente y se ordenan fixtures; último seleccionado por fecha, no posición inicial |
| Evidencias | attachTruckEvidenceToFarmExit enlaza cargue al ID de salida; excluye contenedor | Solo pallets en salida de camión sin contenedor; sin fotos de inspección ni evidencias en ingreso |
| POMA | lookup radication + dispatchedAt | Bridge ahora exige ambos; visible solo en salida con cargue coincidente |
| Detalle | Drawer del workbench | Documento, carrier, capacidad, sincronización, responsable, fechas y recorrido accesibles |
| Vacío/error | Notice de page y workbench | Se distingue consulta sin coincidencias de ausencia de operaciones; error visible |

Hallazgo del producto local: mapper entrega recorrido ascendente, mientras getLatestTraceNode usa trace[0]; registeredAt también parte del primer nodo. La propuesta no presenta esa fecha como último movimiento: lo calcula por occurredAtValue y conserva registro de operación separado en Drawer. Mejora local explícita, no cambio productivo.

## Análisis de diseño SIAL

Forma de tarea: consulta/detalle operacional. La unidad de trabajo es vehículo → movimiento → detalle. La dirección y componentes se conservan. Se compararon continuidad con paneles enmarcados y composición plana con divisores: se adopta la segunda por petición del usuario y menor anidación.

Se eliminan cuatro envolturas visuales innecesarias: contexto, recorrido, detalle y evidencias ya no son tarjetas dentro del contenedor principal. Espaciado y divisores separan responsabilidades. Se conserva CaseCarousel para elegir entidad, FlowTimeline para hitos, KeyValueGrid para pares de datos, EvidenceViewer para evidencia y Drawer para detalle. Sus superficies internas pertenecen al componente publicado; no se alteran mediante CSS para fingir una variante inexistente. Una variante plana de KeyValueGrid sería candidato de librería, no se implementa implícitamente.

No se elimina información por coincidir su texto: destino y ubicación actual son conceptos distintos. No se rellena un dato histórico ausente con el actual. No se agregan métricas, inspecciones, sellos ni aprobación de evidencia de otros módulos.

## Validación

Build aprobado. Recorrido inicial selecciona ingreso a puerto; salida con cargue habilita POMA y programación no. Camión muestra evidencia de pallets y ubicación de tránsito; Drawer conserva campos complementarios. Vacío, filtro sin coincidencias y error recorridos. Sin overflow a 1280/768/390; captura de escritorio a 1440 en output/vehicle-review-flat.png. Datos y documentos siguen simulados.

Pendiente: aprobación visual de esta composición. No se declara cierre de Seguridad ni publicación de librería/producto.

## Corrección de alcance explícita del usuario
Se retiran de la composición vehicular: referencias a contenedor, capacidad de pallets, carga y visor de evidencias. Aunque algunos aparecen en la implementación real, el usuario fija una evolución centrada en movimientos del vehículo. Esta decisión sustituye la conservación anterior del panel de pallets. Se mantienen programación, ingresos/salidas, fechas, ubicación, etapa, responsable, observaciones y POMA condicionado a salida. El modelo conserva relaciones internas para simulación, sin presentarlas como contenido vehicular. Build aprobado; ambos vehículos y Drawer sin conceptos excluidos; POMA en salida comprobado.


## Rectificación vigente: conservar datos asociados, excluir bloques ajenos

La interpretación anterior de retirar referencias a contenedor y carga fue demasiado amplia y queda sustituida. El usuario aclara que contenedor asignado, capacidad, carrier y carga sí pertenecen al contexto vehicular y al hito. Se restauran visibles en KeyValueGrid y en Drawer donde corresponda. Contexto completo: placa, tipo, contenedor, capacidad, conductor, transportadora, carrier, sincronización, ubicación, destino, registro y responsable. Hito: etapa, contenedor asignado, carga, observación y responsable. Se mantienen fuera inspecciones y el visor de evidencias de pallets. Esta separación es semántica, no una prohibición por palabras. Fechas de registro y último movimiento se conservan diferenciadas.

## Textos de hitos
Se usa node.description en FlowTimeline. Fixtures siguen getScheduledNode/getMovementDescription del mapper real, incluyendo ubicación en título y novedad/observación en descripción. Se retira meta fecha de la lista; se conserva en detalle y Timeline del Drawer. Build y recorrido verificados. SELF: corrección local de copy y mapeo.

## Orden del recorrido
FlowTimeline muestra copia invertida del recorrido cronológico, con reverseIndex del paquete publicado. Programación conserva número 1 al final; reciente arriba. Selección por ID intacta. Build y navegador verifican 4/3/2/1 y detalle de salida/programación. SELF: ajuste local.
