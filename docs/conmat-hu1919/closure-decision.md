# Cierre operativo · CA09

Propuesta Web local, 24 de noviembre de 2026. Fuente HU1919 revisión 16, criterios CA09.1–6. Reuse: composición SIAL de gestión y revisión embebida con contraste compartido. SELF: slice ligado al estado local de seguimiento y asignación; delegación no aporta independencia suficiente. No se modifica la librería.

## Flujo y componentes

Menú Transporte y catálogo → Cierre operativo; seguimiento → Revisar cierre operativo → ruta seleccionada. La bandeja filtra ruta/finca y Todos/Pendientes/Listas para cierre/Finalizadas. Una sola Card de gestión aloja FilterToolbar, revisión inline-form-panel inline-form-compact, Table y Pagination. La revisión muestra condiciones, servicios con placa/conductor, órdenes con fincas/material/cantidad/unidad, observación opcional y acciones. Confirmación mediante vista compacta existente. Button, IconButton, Chip, Notice, ToastProvider y controles consumidos de banasan-ui-conmat. Campana global única, consulta interna de solo lectura.

## Cobertura

| Criterio | Propuesta |
|---|---|
| CA09.1 | Finalizar ruta se habilita tras condiciones y confirma antes de escribir; revalidación de snapshot evita confirmar datos cambiados |
| CA09.2 | Revisión de órdenes, finca, material, cantidad y unidad en tabla publicada |
| CA09.3 | Fecha/hora actual y actor ilustrativo Operador de transporte en cierre e hitos |
| CA09.4 | Sólo programación vigente; excluye cancelación/anulación y órdenes no vigentes; cierre duplicado bloqueado |
| CA09.5 | Cierre no cambia estado documental; texto explica separación de soportes, revisión, facturación y pagos |
| CA09.6 | Ruta permanece en bandeja, filtro Finalizadas, detalle y seguimiento de solo lectura; estado local persiste al recargar |

Supuesto de propuesta declarado: cobertura completa, retorno registrado de todos los servicios y novedades atendidas son requisitos de cierre. La HU no enumera esas condiciones. Los servicios históricos iniciales no inventan un cierre nuevo; se presentan como Registro histórico y conservan consulta de hitos. No se cambian las órdenes fuente SIAL a un estado inventado: finaliza ruta/servicios. El rol, actor y persistencia son demostrativos; autenticación y auditoría de servidor siguen fuera del alcance.

## Evidencia

Build correcto; check-conmat-demo, check-conmat-assignment y check-conmat-closure (incluye seguimiento) correctos. Se comprueban cierre completo, fecha/actor, estado compartido, documentación intacta, registro obsoleto, cancelación, anulación, duplicados y escritura posterior bloqueada.

Recorrido navegador limpio: cierre inicialmente deshabilitado → atender novedad → llegada/entrega/retorno → volver a revisión → cancelar confirmación sin escritura → confirmar cierre → registro de fecha y responsable → persistencia al recargar. Consulta interna sin botón Finalizar. Sin errores de consola; 390 px sin desbordamiento global, con scroll propio de tabla. Evidencias closure-1440.png y closure-390.png. Pendiente aprobación visual del usuario; no implica entrega funcional productiva.
Ajuste aprobado: revisión de cierre convertida a ConmatFloatingView compacta, fuera de la Card de gestión. La confirmación reemplaza el contenido en la misma ventana; no anida modales. Conserva validaciones, observaciones y consulta histórica. Build correcto. Comprobado un único dialog, Escape, restauración de foco a la fila y móvil sin desbordamiento global. Evidencia closure-floating.png.
