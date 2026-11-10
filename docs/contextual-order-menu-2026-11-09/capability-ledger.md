# Capacidades evaluadas

| Capacidad | Estado | Aporte y evidencia |
| --- | --- | --- |
| Composición Web SIAL | activated | Se conservan shell, card, tabla, toolbar, tokens y estados visuales de Materiales; la pantalla estrecha presenta tarjetas para mantener visible «Más acciones». |
| Patrón de acciones por fila de la librería Web | consulted | `TableRowActions` demuestra el acceso visible existente. El menú se mantiene aislado como candidato de propuesta; no se declara API publicada. |
| Menú contextual | activated | Un motor abre acciones parametrizadas para pedidos, materiales e inventario desde fila o tarjeta; foco, Escape, flechas, Inicio/Fin y posición dentro del viewport están en la vista navegable. |
| Motion | activated | Apertura del menú de 105 ms con origen en el gesto de puntero, panel de 170 ms y toast de 160 ms; por teclado y con movimiento reducido la apertura es inmediata. La amplitud es corta por la frecuencia operativa. |
| Materiales avanzados o assets nuevos | discarded | No aportan a la localización de acciones en una herramienta operativa densa. |
| Playwright | activated | Se recorren apertura por clic derecho en fila y tarjeta, navegación a aprobación y movimientos filtrados, cambio entre contextos, filtro por estado, teclado, movimiento reducido y presentación a 390 px. |
