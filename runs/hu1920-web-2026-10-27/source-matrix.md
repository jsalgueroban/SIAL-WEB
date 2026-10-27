# Conciliación funcional HU1920

## Fuente y granularidad

La [HU1920](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/1920) pide comparar cantidad consolidada aprobada, programada en vehículos y entregada con POD. Su título añade «despachado». Para no usar «programado» como sinónimo de «despachado», la vista separa cuatro magnitudes. El Aviso de Corte queda como contexto y filtro, sin sumar sus cantidades a las de materiales.

| Magnitud | Productor o fuente esperada | Condición para contabilizar | Brecha actual |
| --- | --- | --- | --- |
| Aprobado | [HU2370](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/2370), pedido/documento RPT, remisión o reserva | Línea aprobada, con material, unidad, finca, pedido y versión | La propuesta tiene aprobación por receta; falta contrato agregado productivo |
| Programado | [HU1919](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/1919) y [HU546](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/546) | Suma de asignaciones vigentes por viaje, sin duplicar versiones o particiones | La mesa HU546 es propuesta local y sus registros anteriores no tienen líneas homogéneas |
| Despachado | Evento confirmado de salida en la trazabilidad de transporte; [HU2359](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/2359) lo consulta | Hito efectivo con cantidades y versión; una notificación de [HU669](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/669) no basta | Falta identificar productor y contrato de cantidad de salida de insumos |
| Entregado con POD | [HU547](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/547), [HU681](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/681) y [HU682](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/682) | Cantidad recibida por línea y POD válido; parcial/rechazo conserva saldo y motivo | La vista actual lista estado/POD, pero no cantidad recibida validada por material |

El [Aviso de Corte HU290](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/290) y su publicación versionada [HU2374](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/2374) son contexto de demanda y filtros. Una versión nueva requiere evaluar deltas según [HU2375](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/2375); no se sobrescribe silenciosamente el plan anterior. Pedidos recurrentes [HU1917](https://dev.azure.com/banasanti/Proyecto%20SIAL/_workitems/edit/1917) carecen de Aviso de Corte y deben poder consultarse con «Sin aviso».

## Regla de lectura propuesta

- Grano mínimo: compañía + finca + pedido + versión + documento de origen + material + unidad. Viaje/orden y entrega/POD son relaciones de detalle, no claves para sumar una misma línea varias veces.
- La tabla compara solo cantidades de la **misma unidad**. Nunca suma UN, M, PAQ, cajas o pallets en un total único. El selector de material fija la unidad del gráfico superior.
- `0` es un dato confirmado; «Sin dato» significa que no llegó evidencia o falta el contrato. No se transforma en cero ni en «pendiente» genérico.
- Alerta de sobreprogramación: programado mayor que aprobado. Alerta de sobre-despacho: despachado mayor que programado. Diferencia de entrega: despachado frente a recibido con POD válido. Mostrar origen y condición, sin afirmar automáticamente fraude, pérdida o incumplimiento.
- No calcular porcentaje si el denominador es cero o desconocido. Las cantidades simuladas se etiquetan como datos de ejemplo.
- La curva de avance y las barras de brecha se derivan de las mismas líneas filtradas que la tabla. La cobertura POD es `entregado / despachado` solo cuando ambas magnitudes existen, el despacho es mayor que cero y la entrega no supera el despacho.
- La consulta es de solo lectura. Cada detalle enlaza al proceso que produce la etapa; el dashboard no edita pedidos, viajes ni POD.

## Evidencia existente y límite

- Propuesta Web: Aprobación de pedidos, Órdenes de transporte de insumos, Seguimiento de entregas y POD, Trazabilidad del pedido y Avisos de Corte ya cubren tramos parciales.
- Producto Web: existen gestión de pedidos sugeridos y operaciones de transporte, pero no un dashboard HU1920 ni un agregado de cuatro cantidades en las rutas revisadas.
- `ms-supplies` revisado contiene materiales, recetas, inventario y pedido sugerido; la entrega/POD de insumos no apareció como contrato agregado disponible. `ms-track` tiene trazabilidad y despachos de otros flujos; no debe mezclarse con entrega de materiales por semejanza de nombre.
- Por ello la propuesta usa un fixture separado y rotulado; la implementación del agregado productivo y el tiempo real quedan fuera de esta entrega.
