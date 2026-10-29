# HU546 · Distribución interactiva de ítems

Estado de esta corrección: local para revisión visual; no publicada.

## Decisión de composición

La dirección explícita del usuario reemplaza el selector «Asignar a orden» por una interacción espacial: arrastrar cada ítem completo desde pendientes hacia una orden, entre órdenes o de vuelta a pendientes. El fantasma de arrastre es un pictograma genérico de ítem; al soltar, la ficha completa aparece en el destino mediante una expansión breve. La cantidad y unidad del ítem son inmutables, y la creación sigue exigiendo que todos los ítems estén asignados.

## Implementación y accesibilidad

- Estado y eventos React en `src/web/materials-transport-orders.jsx`; sin árbol oculto ni proxy.
- Arrastre nativo de HTML, sin dependencia adicional. Las zonas receptoras muestran borde y fondo activos. El movimiento de entrada dura 260 ms y respeta `prefers-reduced-motion`.
- Cada ítem es un botón con estado `aria-pressed`. Clic, toque, Enter o Espacio seleccionan; «Colocar aquí» o «Devolver a pendientes» realizan la misma operación sin arrastre. Escape cancela la selección.
- La tarjeta completa es la superficie de arrastre; no se muestra un asa de puntos ni una acción «Retirar» por fila. La devolución se hace soltando en pendientes o, sin arrastre, seleccionando el ítem y usando «Devolver a pendientes».
- Las tarjetas, botones, inputs, chips y feedback publicados por `@banasandev/banasan-ui@1.4.0` siguen en sus posiciones existentes. El gesto de reparto es composición local de HU546, candidata a patrón tras aprobación y reutilización demostrada; no modifica la API de la librería.

## Relectura de criterios HU546

- Decisión reemplazada: las tarjetas para `RPT`, `REM` y `RES` trataban registros heredados no vinculados como documentos de retiro HU546 y duplicaban el seleccionado en otro bloque. Se retiran de esta vista.
- Decisión vigente: la bandeja conserva la tabla de órdenes y muestra en cada fila el pedido aprobado y su documento de retiro de materiales. Un único filtro por pedido/documento permite consultar sus particiones sin otra tarjeta de selección.
- Los datos de ejemplo iniciales son dos particiones de un mismo pedido aprobado; el segundo pedido queda disponible para crear otras. `AC-...` se conserva como aviso de corte de origen y no se presenta como documento de retiro. Los códigos `RET-2026-...` son fixtures explícitos de la propuesta, no identificadores operativos validados. No se presentan órdenes heredadas sin `parentOrderId` como resultado de esta HU.
- Cada orden mantiene su detalle individual. Las órdenes generadas desde un mismo pedido aprobado se conservan vinculadas por `parentOrderId` y `document`.
- «Editar órdenes consolidadas» reabre el conjunto completo de particiones y permite redistribuir ítems completos y ajustar sus datos antes del inicio operativo, sin recrear identificadores ni dejar órdenes vacías o ítems sin asignar.
- El prototipo solo permite editar cuando `operationStarted === false` está explícito en todas las particiones del conjunto. Los registros anteriores carecen de este dato y no se consideran editables por inferencia de su estado visual. La fuente real de esta condición y su concurrencia requieren contrato de producto/backend antes de implementación productiva.
- La agrupación por documento y la edición del conjunto son propias de este flujo; no se aplica una tabla genérica a la operación de distribución.
- En «Pedido de origen» el selector ya identifica finca y cantidad de ítems; el contexto inferior solo añade documento de retiro de ejemplo, aviso de corte y aprobación. Se retiró «Destino de referencia» por repetir la finca. Decisión local HU546: cada dato visible debe orientar el siguiente paso operativo o aportar una relación nueva, sin duplicar el contexto ya seleccionado.

## Gate pendiente

Verificado localmente: build de la UI, contexto de diseño Web sin errores, consulta con dos particiones del mismo origen, edición de un ítem completo entre ambas órdenes y guardado conservando IDs, composición a 1280 y 390 px. `Table`, `Chip`, `Pagination`, `TextInput`, `SelectInput`, `Button` y acciones se consumen del paquete Web instalado; el tablero de arrastre permanece local a HU546. Pendiente: aprobación visual del usuario, contrato real del documento de retiro y del inicio de operación, publicación y eventual promoción del gesto a patrón compartido. No se modifica la librería productiva ni el seguimiento de Azure en este bloque.
