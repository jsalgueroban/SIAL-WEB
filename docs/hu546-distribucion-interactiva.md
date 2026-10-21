# HU546 · Distribución interactiva de ítems

Estado: propuesta local para revisión visual. No publicada.

## Decisión de composición

La dirección explícita del usuario reemplaza el selector «Asignar a orden» por una interacción espacial: arrastrar cada ítem completo desde pendientes hacia una orden, entre órdenes o de vuelta a pendientes. El fantasma de arrastre es un pictograma genérico de ítem; al soltar, la ficha completa aparece en el destino mediante una expansión breve. La cantidad y unidad del ítem son inmutables, y la creación sigue exigiendo que todos los ítems estén asignados.

## Implementación y accesibilidad

- Estado y eventos React en `src/web/materials-transport-orders.jsx`; sin árbol oculto ni proxy.
- Arrastre nativo de HTML, sin dependencia adicional. Las zonas receptoras muestran borde y fondo activos. El movimiento de entrada dura 260 ms y respeta `prefers-reduced-motion`.
- Cada ítem es un botón con estado `aria-pressed`. Clic, toque, Enter o Espacio seleccionan; «Colocar aquí» o «Devolver a pendientes» realizan la misma operación sin arrastre. Escape cancela la selección.
- La tarjeta completa es la superficie de arrastre; no se muestra un asa de puntos ni una acción «Retirar» por fila. La devolución se hace soltando en pendientes o, sin arrastre, seleccionando el ítem y usando «Devolver a pendientes».
- Las tarjetas, botones, inputs, chips y feedback publicados por `@banasandev/banasan-ui@1.4.0` siguen en sus posiciones existentes. El gesto de reparto es composición local de HU546, candidata a patrón tras aprobación y reutilización demostrada; no modifica la API de la librería.

## Gate pendiente

Build y recorrido funcional local; revisión visual del usuario, publicación y eventual promoción a patrón compartido son pasos separados.
