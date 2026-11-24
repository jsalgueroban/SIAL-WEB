# HU1919 · Evaluación de la propuesta UI/UX

## Corte vigente: asignación operativa CA07

Quinta vista integrada con el portal, menú y catálogo SIAL. Asignación por ruta/subgrupo, recursos habilitados, cruce de horarios, revisión, reemplazo con motivo e historial. Placa/conductor se consultan en portal y panel interno. Evidencia y supuestos en assignment-decision.md. El siguiente bloque pendiente es seguimiento operativo CA08; no se afirma garantía de permisos ni concurrencia de servidor.

## Corte vigente: portal transportadora construido

Se incorpora la cuarta vista: CA06 con rutas propias, órdenes sin ruta, filtros/estados, detalle jerárquico/materiales y notificaciones consultables/leídas vinculadas a registros de la empresa. La sesión y recepción son demostrativas; no autenticación o envío reales. Evidencia en carrier-decision.md. CA07 continúa como siguiente vista de asignación operativa.

## Corrección del criterio de evaluación
El objeto entregado es una propuesta Web navegable. No corresponde exigir API, persistencia, autenticación productiva, notificaciones reales o integridad transaccional para considerarla completa como propuesta.
El conteo anterior de 9 puntos demostrables, 17 parciales y 76 sin representación describía el contraste literal de la HU completa con una sola pantalla; no mide el avance visual y queda retirado como conclusión de cobertura UI/UX. No debe utilizarse para afirmar incumplimiento de la propuesta.

## Tres dimensiones distintas
| Dimensión | Qué debe demostrar la propuesta | Qué no se exige |
| --- | --- | --- |
| Interacción y composición | Navegar, buscar, seleccionar, agrupar visualmente, abrir detalle, capturar, confirmar y volver al contexto, dentro del alcance de vistas acordado. | Conexión a servicios reales. |
| Estados y respuestas del sistema | Escenarios demostrativos: carga, vacío, error, validaciones, permisos por rol, conflicto horario, cambios de orden, soporte rechazado y éxito. Se pueden simular cuando se construya la vista correspondiente. | Que el prototipo aplique la regla real o persista el resultado. |
| Garantía funcional | Dejar documentado qué efecto requiere backend y cuál sería su respuesta visible. | Seguridad efectiva, concurrencia, saldos consistentes, auditoría persistida, entrega de notificaciones o transiciones productivas. |

## Evaluación de la primera vista acordada
El alcance autorizado inicialmente fue la primera vista: panel interno de operación CONMAT, no las ocho vistas de la referencia ni la HU completa.

### Ya representado y comprobado
- Resumen semanal de rutas, órdenes contadas, fincas y empresas con fixtures coherentes.
- Distribución por estado mediante ECharts; clic y alternativa con teclado filtran la consulta.
- Búsqueda, filtro por estado, cambio de semana, paginación y estado vacío.
- Consulta de ruta en Drawer con transportadora, fincas, estado y materiales por unidad.
- Componentes publicados para tarjetas, filtros, acciones, tabla, paginación y detalle; ECharts como composición local solicitada.
- Adaptación de escritorio/móvil y temas claro/oscuro.

### Ajustes UI/UX pendientes de la primera vista
- Precisar la promesa de los accesos Por atender: hoy filtran la tabla; no deben aparentar abrir procesos de seguimiento o cierre que no están diseñados.
- Alinear el conjunto mostrado con el pendiente contado: novedades y cierres documentales deben usar el mismo criterio visual/dataset en contador y filtro.
- Completar la información de seguimiento relevante en consulta interna: placa/conductor de sólo lectura y fecha programada estructurada cuando el escenario corresponda. Esto no infringe la prohibición de asignarlos en la agrupación interna.
- Cuando se diseñe el detalle completo, mostrar órdenes individuales y jerarquía de subgrupos. En esta primera entrega el Drawer es una consulta resumida.
- Evaluar escenarios de carga/error con datos simulados si son parte de la revisión del panel; no requieren desarrollar un backend.

### Dependencias backend que no son fallos de esta propuesta
- Obtener órdenes vigentes y sincronizar sus cambios.
- Validar cantidades disponibles, evitar doble programación y controlar concurrencia.
- Autenticar y autorizar realmente por empresa/rol.
- Validar habilitación y cruces horarios de vehículo/conductor.
- Persistir estados, documentos, versiones e historial de auditoría.
- Enviar notificaciones y aplicar condiciones de cierre o habilitación administrativa.
Sus efectos sí deben resultar comprensibles en las vistas que los utilicen, mediante escenarios de demostración.

## Alcance visual futuro de la HU
Las vistas de órdenes/preasignación, constructor de rutas, portal transportadora, asignación, seguimiento, cierre y soportes quedan pendientes de diseño/construcción como partes posteriores del módulo. Son alcance visual futuro, no prueba de que la primera vista haya fallado ni de que se necesite backend para prototiparlas.

## Conclusión vigente
La primera vista representa la consulta y el panorama operativo interno. Su cobertura debe medirse contra ese objetivo y sus escenarios UI/UX. La cobertura visual de la HU completa crecerá al construir las demás vistas; la validación funcional productiva se evaluará por separado cuando exista integración.

## Trazabilidad
Fuente funcional: HU1919 rev.16, leída el 23 de noviembre de 2026. Evidencia: conmat-panel.html, conmat-dashboard.jsx, conmat-state-chart.jsx, capturas y recorridos registrados en decision.md. La matriz JSON conserva los 102 puntos y añade clasificación de responsabilidad; no acredita implementación productiva.

## Evolución: segunda vista construida
La propuesta ya incorpora Órdenes y preasignación (CA-01/CA-02) integrada con el panel: consulta/filtros de órdenes, selección múltiple, detalle, revisión y confirmación por transportadora, cambio de preasignación y estado local compartido. La calificación anterior describe el corte inicial del panel y no debe usarse para negar esta cobertura nueva. Rige además orders-decision.md con matriz por punto, evidencia, escenarios y límites de integración. El constructor de rutas/subgrupos continúa como siguiente entrega.
# Actualización: tercera vista de agrupación

La evidencia vigente de CA-03 y reorganización de CA-04 está en [routes-decision.md](routes-decision.md). Se incorpora Ruta → Viaje → Subgrupo → Órdenes, jerarquía confirmada por el usuario, agrupación compatible por transportadora, movimientos y retiros, materiales por unidad e historial demostrativo. Confirmar programación integra órdenes y panel. Los diagnósticos anteriores son históricos; no representan el estado visual actual ni un porcentaje de cumplimiento funcional. Las garantías de servidor quedan fuera de esta propuesta Web.

## Evolución CA-05: cambios de programación

Agrupación incorpora cancelar órdenes, anular viajes y reprogramar ruta/subgrupo/órdenes, con motivo, revisión y confirmación. Se conserva la orden, se recalculan totales y se muestra historial; ejecución/finalización bloqueadas. El panel usa fechas efectivas para cambios entre semanas. Evidencia vigente: [programming-changes-decision.md](programming-changes-decision.md). No se afirma entrega real de notificaciones ni vigencia consultada en backend.
