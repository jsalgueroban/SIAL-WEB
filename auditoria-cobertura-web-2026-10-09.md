# Cobertura Web — bloque 1, 2026-10-09

El inventario por vista está en [la matriz completa](auditoria/cobertura-vistas-2026-10-09.md). También se entrega [CSV para filtrar](auditoria/cobertura-vistas-2026-10-09.csv), [rutas sin equivalente](auditoria/producto-sin-equivalente-2026-10-09.csv) y [evidencia estructurada](auditoria/cobertura-vistas-2026-10-09.json).

Se revisaron 97 HTML de propuesta, 63 páginas del producto Web en `origin/dev` y las 358 HUs de Azure DevOps. El corte remoto es `22c5e7d0`; el checkout local conserva su estado anterior y sus cambios. Sesenta rutas tienen una correspondencia de tarea o subflujo con la propuesta. Esto acredita presencia y relación en código, no equivalencia visual ni QA.

## Pantallas reales sin propuesta equivalente

| Pantalla real | Ruta | Relación funcional |
| --- | --- | --- |
| Asignar roles a un usuario en una finca | /admin/farms/roles/assignment | HU529/HU851 como contexto; no equivale a roles por empresa |
| Mis dispositivos conocidos: consultar y revocar | /admin/known-devices | HU1916 como contexto offline |
| Seguimiento operacional de vehículos | /admin/audit/operational-vehicles | HU302/HU2359 como contexto; requiere su propia consulta de propuesta |

## Propuestas y diferencias que requieren tratamiento

- Las categorías de pedido ya existen en el producto bajo `/admin/supplies/material-categories`, HU1918. El inventario inicial basado en el checkout local había omitido esta ruta.
- HU660 tiene propuesta de ajuste de pedido. El botón productivo dirige a `/admin/supplies/suggested-orders/review`, pero `origin/dev` no contiene la página de destino. Existe la entrada; falta su implementación.
- Mantenimiento (HU297), traslado de materiales/plan operacional (HU1919/HU2367), adicionales (HU666), recurrentes (HU1917), aprobación y aceptación (HU2370) tienen fuente funcional. La falta de ruta propia no los convierte en propuestas sobrantes.
- Inventario de pallets referencia HU559 (`Removed`) y HU560 (sin descripción ni criterios). Es un candidato a retirar o sustituir cuando se confirme una necesidad vigente.
- Movimientos de inventario requiere replantear su alcance: HU2369 vigente prohíbe kardex y saldos maestros dentro de SIAL. Una consulta o intercambio con ERP tiene un propósito distinto.
- Dashboard de transporte, parametrización de notificaciones, maestra de proveedores y reglas documentales tienen relaciones candidatas con HUs. La matriz declara el límite; no se presentan como historias específicas ya confirmadas.
- Las pantallas de registro que la bandeja abre para editar o versionar se mapearon como subflujos, con revisión pendiente de su variante. No se requiere un HTML distinto para cada ruta de edición.
- Errores alternativos, catálogo de componentes e índices de módulo conservan clasificación de sistema, referencia o navegación.

## Estado de la entrega

Cada HTML tiene clasificación, rutas relacionadas, HUs y estado actual, referencia de entrada, observación y hash de evidencia. Cada página del producto queda relacionada o enumerada en la tabla de brechas. El generador comprueba cobertura completa, existencia de archivos/rutas y validez de IDs de HU.

Las entradas se revisaron en código, incluidos los enlaces del menú compartido y JavaScript. El menú efectivo por rol requiere un snapshot runtime para confirmar permisos y exposición. Las HUs candidatas permanecen señaladas como decisiones funcionales, sin inventar reglas ni retirar vistas.

## Planificación posterior a la normalización Web

Las tres brechas de negocio tienen tareas en el proyecto de propuestas SIAL, en `Backlog`, dependientes de [normalizar la propuesta Web](https://app.notion.com/p/3e270c9c1cbc816fb1efc8b33d55ea80):

| Ruta | Tarea | Relación HU |
| --- | --- | --- |
| `/admin/farms/roles/assignment` | [Asignación de roles por finca](https://app.notion.com/p/3f870c9c1cbc81d0b212dfac00ec2fda) | HU529/HU851 candidatas; elegir la fuente específica |
| `/admin/known-devices` | [Dispositivos conocidos](https://app.notion.com/p/3f870c9c1cbc8119b56df4d45edb33cb) | HU1916; concretar criterios de revocación |
| `/admin/audit/operational-vehicles` | [Seguimiento operacional de vehículos](https://app.notion.com/p/3f870c9c1cbc817caf8ff4b3f15ccaf7) | HU302/HU2359 candidatas; decidir el alcance |

Las relaciones candidatas no equivalen todavía a tareas hijas en Azure. La fecha 2026-10-13 registrada en Notion es de captura administrativa, sin compromiso de ejecución antes de completar la normalización.
