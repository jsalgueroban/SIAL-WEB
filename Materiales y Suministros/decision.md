# Decisiones de propuesta — Materiales y Suministros

## HU546 — Registro de orden de transporte de insumos

- **Decisión:** HU546 conserva su vista propia `ordenes-transporte-insumos.html`. `Gestion de Transporte/plan-operacional.html` pertenece a HU2367 y no cuenta como cobertura ni como origen del flujo.
- **Evidencia histórica:** las revisiones 1–12 de HU546 exigían registrar uno o varios pedidos de insumos, asociar vehículo y asociar finca destino. La propuesta inicial se publicó antes de que Azure ampliara la historia con trazabilidad integral, POD, bloqueos, idempotencia y TXT ERP.
- **Forma de tarea:** bandeja/gestión con formulario breve embebido.
- **Pantalla maestra:** composición estándar de gestión del módulo Materiales: encabezado de card, CTA, toolbar, panel embebido, tabla y paginación.
- **Implementación vigente:** la acción primaria `Registrar orden` permite seleccionar varios pedidos, finca destino, vehículo/conductor y documento logístico. La notificación permanece como acción secundaria.
- **Estados verificados:** formulario cerrado/abierto, selección múltiple, validación incompleta, registro exitoso y retorno a la bandeja con persistencia demostrativa local.
- **Frontera:** los criterios agregados posteriormente en Azure requieren evolución separada y contratos de backend. Esta propuesta no afirma disponibilidad real, permisos, idempotencia distribuida, POD ni intercambio TXT.
- **Alcance:** decisión local de HU/vista; no promueve un patrón global nuevo.
