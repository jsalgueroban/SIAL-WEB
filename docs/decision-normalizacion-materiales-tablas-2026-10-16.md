# Normalización parcial de bandejas de Materiales

Fecha: 2026-10-16. Decisión: `SELF`; las diez bandejas comparten `sial-materiales.js`, filtros y datos locales. No se delega un slice separado porque el costo de coordinar cambios sobre el mismo renderizador supera el beneficio.

## Alcance aplicado

El `tableShell` compartido monta ahora `Button` para acciones de cabecera, `TextInput` de búsqueda y `Table` de la librería. Los `SelectInput`, `Chip` de conteo y `Pagination` ya se montaban; el marcador de tabla completa el consumo de librería en la bandeja. Se incrementó la versión de carga del script en las once rutas que lo usan para evitar que el navegador conserve el renderizador anterior.

Diez rutas con tabla quedaron clasificadas **Parcial (runtime)**: `gestion-materiales`, `gestion-proveedores`, `inventario-materiales-finca`, `inventario-pallets`, `movimientos-inventario`, `ordenes-transporte-insumos`, `recetas-materiales`, `resumen-proveedores`, `reglas-documentales` y `seguimiento-entregas`. `index.html` recibe la misma versión de script, pero su dashboard no utiliza `tableShell` y permanece por auditar. Los flujos de pedidos y aprobación tienen renderizadores distintos y no se incluyen en esta decisión.

## Evidencia y límites

Se abrió cada una de las diez rutas en el navegador local: las diez mostraron tabla, búsqueda y paginado de librería con filas de ejemplo. En `gestion-materiales` se comprobó que una búsqueda sin coincidencias actualiza el contador a cero y muestra el vacío; las tres acciones de la primera fila conservaron sus etiquetas. A 390 px no hubo desbordamiento horizontal del documento y la tabla quedó dentro de su región desplazable.

Esto **no cierra** las vistas. Falta validar en cada una combinaciones de filtros, exportación, detalle, acciones de estado, formulario embebido y captura inválida/válida; revisar el dashboard, las vistas especializadas de pedidos y sus reglas de negocio; y hacer revisión visual del usuario antes de publicación. El conteo estático del inventario no refleja controles generados en runtime: la columna de estado sí incorpora esta verificación, mientras los números de etiquetas HTML permanecen como evidencia estática.
