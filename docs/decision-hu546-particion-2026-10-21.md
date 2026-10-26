# HU546 · Partición de pedidos en órdenes de transporte

## Decisión vigente

- Plataforma: Web. Operación: build. Forma de tarea: gestión + relación/partición compleja.
- Fuente: HU546 y aclaración funcional del usuario del 21/10/2026.
- Dirección aprobada: mesa de partición dentro de la ruta de órdenes de transporte. La bandeja conserva la consulta; el registro usa una superficie dedicada de selección, asignación y datos por orden.
- Evolución aprobada después de la primera revisión: opción B «mesa operativa». Los ítems pendientes se leen como filas compactas con código y cantidad; cada orden se presenta como un manifiesto en construcción con su propia lista. El resumen de distribución indica cobertura sin añadir avisos decorativos. Esta variación es local de HU546.
- Alternativas evaluadas: asistente secuencial y matriz de asignación por fila. La mesa permite comparar ítems pendientes y órdenes resultantes sin hacer depender la operación de drag-and-drop.
- Alcance de la regla: específico de HU546. No se promueve como patrón global.

## Contrato funcional de la propuesta

1. Se selecciona un único pedido aprobado.
2. Cada ítem de material se asigna completo a exactamente una orden resultante; no se modifica ni se divide su cantidad.
3. Se exige asignar el 100 % de los ítems antes de crear. La partición produce al menos dos órdenes.
4. Cada orden registra origen, destino, ventana prevista, responsable y modalidad. Un tercero requiere identificar al transportador.
5. Cada orden creada conserva pedido padre, documento fuente, ordinal de partición, ítems, cantidades informativas y estado inicial «Creado». Vehículo y conductor quedan para la asignación operativa posterior.
6. La bandeja permite filtrar, paginar, exportar y consultar el detalle de las órdenes. Los registros previos se conservan como antecedente, sin reconstruir una relación padre inexistente.

## Componentes y frontera

- Librería publicada: Button, Chip, TextInput, SelectInput, Table, TableRowActions, IconButton, Pagination y Toast.
- Composición local justificada: tablero de asignación por ítems y detalle contextual; no existe equivalente semántico publicado. El campo fecha-hora usa un input nativo local porque TextInput 1.4.0 solo admite text/email/password.
- Persistencia: localStorage de la propuesta; no es un contrato de backend, inventario, despacho, elegibilidad de recursos, TXT, POD ni cierre operativo.
- Acceso: menú Materiales → Órdenes de transporte → Particionar pedido. La ruta y clave activa existentes se mantienen.

## Evidencia y gate

- Build `npm run build:ui`: correcto.
- Navegador local: bandeja y creación montadas; se probó seleccionar pedido, distribuir cuatro ítems entre dos órdenes, bloqueo con ítems pendientes, completar campos y crear dos registros vinculados. Se limpió el dato generado por la prueba.
- Vista a 390 px: sin desborde horizontal de documento; tabla conserva scroll interno.
- Evolución B: se revisaron en navegador el estado vacío y una orden con ítem asignado a 1280 px; a 390 px la mesa se apila sin desborde horizontal. `npm run build:ui` volvió a pasar.
- Revisión visual del usuario, publicación y persistencia real: pendientes. No declarar la propuesta publicada ni la HU cerrada.
