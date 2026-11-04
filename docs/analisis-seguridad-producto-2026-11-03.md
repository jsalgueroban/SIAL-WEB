> Corrección posterior: la ruta activa POMA consume PomaWorkspace, no PomaTable. Ver adaptación y mapeo en [base adaptada](adaptacion-seguridad-producto-2026-11-03.md).

# Seguridad — contraste con el proyecto real

## Fuente y alcance

Análisis solicitado antes de evolucionar la propuesta. Perfil audit, Web; skills sial-design-proposals, sial-fe (lectura de arquitectura/consumos), Dona y agent-delegation-router. SELF: lectura encadenada de rutas → componentes → servicios → contratos y comparación con el estado local, sin cambios productivos ni beneficio independiente de delegación.

Fuente principal: `D:/SIAL/Repos/sial/fe-sial-web`, rama `qa/eva-pilot-20261029`, HEAD `4dfeb23d` del 29/10/2026. Estado observado: solo `output/` sin seguimiento. Se revisó el checkout principal disponible, no `fe-sial-web-menu` ni un despliegue remoto. No se ejecutaron servicios ni peticiones de negocio. Las conclusiones describen el código local inspeccionado, no certifican lo desplegado hoy.

Rutas confirmadas en `src/app/(main)/admin/audit`: `operational`, `operational-vehicles` y `poma`. La propuesta solo expone auditoría genérica y generación POMA; falta la vista específica de vehículos.

## Estructura de contenedores

`OperationalAuditPage` solicita movimientos desde una server action, los transforma con `mapContainerMovementAuditResponse` y monta PageLayout → PageContent → Toolbar + acciones + Workbench. Título real: **Seguimiento de operaciones de contenedores**.

1. Filtros: búsqueda OP/contenedor/vehículo con debounce de 500 ms, año, semana buscable y paginada por año, etapa de contenedor, rango de fechas avanzado. Año y semana actual se inicializan desde fecha y servicio de semanas. Los filtros se expresan en URL.
2. Selector horizontal por operación/contenedor: código, contenedor, ubicación, semana y cantidad de nodos. No representa una cola genérica de eventos web/móviles.
3. Resumen de operación: radicado, identificador de programación, contenedor, tipo, capacidad y contexto.
4. Árbol de movimientos/inspecciones con FlowTimeline; el mapper ordena los nodos y la selección gobierna las evidencias. Diferenciar operación, movimiento, inspección y evidencia en los datos simulados.
5. Panel contextual: responsable, sellos, vehículo, conductor, transportadora y carrier del movimiento seleccionado.
6. EvidenceViewer: imágenes, fecha, tipo, estado, observación y selección; evidencia vigente separada de histórica. El historial puede mostrarse/ocultarse, con vacío específico cuando solo existe historial.
7. Etiquetas de seguridad con código y estado; detalles de inspección y puntos de control en Drawer; comentarios con CommentList.
8. Informe de inspecciones: acción visible en el último nodo de inspección en puerto cuando existen inspecciones INTERNAL y EXTERNAL. La selección del último compara fecha y, en empate, identificador. Generación con espera, descarga y Toast de éxito/error.

No se encontró una acción de aprobar evidencias ni servicio de aprobación en esta feature. La aprobación conjunta añadida a la propuesta no tiene respaldo en esta implementación: no debe tratarse como comportamiento actual ni imponerse en la evolución.

## Consumos comprobados

| Uso | Fuente de frontend / contrato |
| --- | --- |
| Operaciones y movimientos de contenedores | `operational/services/operational-audit.service.ts`: GET `/transport-operations/container-movements`, `viewMode=extended`, sin caché. Filtros incluyen página/tamaño, búsqueda, contenedor, etapa, operación, año/semana y fechas. |
| Semanas | `week/services/week.service.ts`: GET `/weeks` y `/weeks/current`. Toolbar usa búsqueda, año y paginación. |
| Informe de inspecciones | Servicio operational: POST `/inspections/container-report/{inspectionId}/generate`, respuesta PDF. Ruta corroborada en inspection.controller del gateway. |
| Seguimiento vehicular | `operational-vehicles/services/operational-vehicle-audit.service.ts`: GET `/transport-operations/vehicles?viewMode=extended`; página consulta también etapas vehiculares y ubicaciones. |
| Cargues POMA | `poma/services/poma.service.ts`: GET `/poma/loadings`, GET `/poma/loadings/{loadingType}/{loadingId}`. Rutas corroboradas en poma.controller del gateway. |
| Generación POMA | POST `/container-loadings/{loadingId}/poma/generate` o `/truck-loadings/{loadingId}/poma/generate`; respuesta PDF. Ambos controladores del gateway contienen las rutas. |

El DTO de movimientos incorpora programación/semana, vehículo y conductor, ubicación, ingresos/salidas, inspecciones, checklist, sello verificado, etiquetas, cargue, pallets/SSCC, referencias, evidencias, retiro de pallets y sellado final. El mapper transforma estos datos en nodos, contexto, evidencia vigente/histórica y comentarios. La propuesta actual usa arreglos de eventos y cadenas separadas por `|`; no representa esa jerarquía completa.

## Brechas de la propuesta

| Dimensión | Propuesta actual | Evolución necesaria |
| --- | --- | --- |
| Unidad principal | Eventos mezclados de transporte web y móvil | Operaciones de contenedores con sus movimientos; vehículos en vista separada. |
| Filtros | Tipo de evento, estado/sincronización y semanas derivadas de ejemplos | Etapa operativa y selector de semanas por año; representar selección inicial y estados de búsqueda. |
| Resumen | Vehículo, contenedor, responsable, sincronización | Radicado, tipo/capacidad/contexto de contenedor y datos de transporte propios de cada movimiento. Evitar duplicar datos técnicos en primer plano. |
| Evidencias | Galería local, varios ejemplos sin imagen | EvidenceViewer publicado; historial, reemplazos/retiros, observaciones, estados y contexto del nodo. |
| Seguridad | Aprobación conjunta simulada | Etiquetas, sellos y resultados de inspección; revisión de la hipótesis de aprobación antes de conservarla. |
| Documentos | POMA de una única salida de finca | Informe de inspecciones contextual y POMA por cargue/tramo. |
| Estados | Vacío/filtro y algunos Toast | Cargando, fallo de consulta, reintento, sin datos, solo históricos, generación en curso/error y descarga. |
| Cobertura | Auditoría + Generar POMA | Añadir Seguimiento operacional de vehículos a la propuesta y navegación. |

## POMA: diferencia de composición

El producto consulta por radicación y presenta una bandeja de cargues, con salidas desde **finca o puerto**. Columnas: radicación/semana, tipo de cargue, vehículo, contenedor, tramo/origen/destino, salida, carga y estado POMA. Usa Table, Pagination, acciones de detalle/descarga y Drawer con consulta del detalle. Distingue CONTAINER y TRUCK para consulta/generación.

La propuesta muestra directamente los datos de una salida de finca y pagina pallets, pero omite la selección entre cargues/tramos y sus estados POMA. El PDF de muestra sirve para validar interacción, no sustituye esa estructura ni la plantilla oficial.

## Librería y corrección del diagnóstico anterior

El frontend declara `@banasandev/banasan-ui ^1.4.1` con override local a `D:/SIAL/Librerias/.worktrees/web/ribbon-purple-variant`. La propuesta consume 1.4.0. No se ha afirmado equivalencia entre esas resoluciones.

**La versión 1.4.0 instalada en la propuesta ya exporta** CaseCarousel, AuditStatusDot, FlowTimeline, EvidenceViewer, KeyValueGrid, CommentList y ControlPointList (`dist/index.d.ts`, líneas 43–44), además de Drawer. La composición real usa varios de ellos directamente.

La limitación del adaptador HTML genérico no implica una limitación de Drawer: el proyecto real lo compone con contenido de dominio. Debe evaluarse montaje React directo y composición de estos componentes en lugar de conservar el panel local por esa justificación. La decisión anterior no verificó esta alternativa y queda corregida.

## Criterio de mejora

Primero alinear modelo y cobertura con producto; después evolucionar composición. Mantener filtros/escoba compartidos, chips semánticos, tipografía, accesibilidad y feedback ya normalizados. Dos líneas para la siguiente exploración:

- Continuidad: operaciones en selector horizontal, árbol a la izquierda y evidencia contextual a la derecha; sustituir piezas locales por componentes publicados y completar datos/acciones.
- Evolución: selector compacto de operaciones, resumen persistente y espacio principal para movimiento/evidencia; información ampliada en Drawer, documentos solo en el contexto aplicable. Comparar con ejemplos densos antes de elegir.

No copiar defectos observados del producto: hay repetición de responsable/sellos en el panel de evidencia, flechas del selector sin onClick en el JSX revisado, y el contador aplica un filtro local mientras el workbench recibe el arreglo de eventos completo. Son candidatos a revisar al diseñar, no bugs certificados mediante ejecución.

El análisis no modifica UI ni producto. Seguridad pasa de «lista para revisión visual» a **alineación/evolución pendiente**. Puerto mantiene su aprobación. La tarea transversal sigue abierta; esta comparación precede a la nueva estructura visual.
