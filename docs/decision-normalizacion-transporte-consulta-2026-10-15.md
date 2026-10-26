# Normalización Web — consulta operativa de Transporte

Fecha: 2026-10-15. Estado: bloque local y parcial, sin aprobación visual ni publicación.

## Decisión de composición

`disponibilidad-operativa` es matriz de elegibilidad; `matriz-documental-vehiculos` es control de vigencias; `gestion-operaciones` combina una bandeja de consulta y un editor masivo. Se reutilizó la anatomía de bandeja y los controles publicados de `@banasandev/banasan-ui` 1.4.0 solo en las tablas de consulta: búsqueda, filtros, contador `Chip`, `Table`, estados, acciones, `Pagination` y `Drawer`. El editor masivo conserva sus filas dinámicas y reglas propias; no debe confundirse con la tabla de consulta ni marcarse como normalizado por ella.

Se retiraron tres KPI fijos en Disponibilidad, cuatro en Control documental y tres en Programación: no procedían de las filas del prototipo. El aviso explicativo de Disponibilidad se eliminó por redundante; el aviso de regla documental se conserva como `Notice` de librería encima de la tabla. No se alteraron las reglas de elegibilidad, filtros, destino ni semana.

## Evidencia y deuda

En `127.0.0.1:4175`, Disponibilidad montó cuatro filas, Control documental tres y Programación seis, cada una con `Table`, filtros y `Pagination`. El filtro de semana futura en Programación redujo tabla, contador y total a un registro sin modificar las dos filas del editor masivo. A 390 px, los filtros de Control documental no desbordaron la página. Faltan pruebas de exportación, acciones, detalle, editor masivo completo, teclado, contraste y validación visual. La data de ejemplo fechada en abril/junio de 2026 debe revisarse antes de tratar los semáforos como estados actuales.

Decisión de delegación: `SELF`; la adaptación de tres bandejas depende del mismo adaptador y filtros en el checkout compartido. La tarea global continúa En Progreso.
