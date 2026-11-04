# Inventario de componentes de Transporte · 30/10/2026

Controles visibles en el estado inicial de cada vista. Esta captura no acredita por sí sola interacciones, estados posteriores ni aprobación visual. Los enlaces son navegación; `datetime-local`, archivos, áreas de texto, campos de solo lectura y controles propios requieren evaluación semántica antes de clasificarse como excepciones.

Actualización posterior: los dos campos de trazabilidad de `inicio-operacion` también se adaptaron a `TextInput` de solo lectura; la tabla refleja el barrido anterior a ese ajuste puntual.

El paquete instalado `@banasandev/banasan-ui@1.4.0` ofrece `DateInput` para fechas, pero no un control de fecha y hora; `datetime-local` se conserva como excepción de captura local. Tampoco exporta un selector de archivos, un área de texto o un diálogo de confirmación genérico en su API. Los enlaces conservan semántica de navegación. El selector de tipo del visor es una composición local con `aria-pressed`; sus acciones de cámara usan `Button`. Los campos de solo lectura y las pantallas de captura, carga, error y confirmación no se declaran cubiertos solo por el inventario inicial.

| Vista | Componentes detectados | Controles visibles fuera del adaptador (muestra inicial) |
| --- | --- | --- |
| dashboard-transporte | Notice, Table | Ninguno detectado |
| detalle-mantenimiento | Chip, Button, Toast | A Volver a mantenimientos; A Explorar modelo 3D genérico; INPUT releaseEvidence; TEXTAREA releaseNotes |
| detalle-preoperacional | Chip | A PREOPERACIONAL; A Volver a inspecciones |
| detalle-vehiculo | Chip | A TRANSPORTE / VEHÍCULOS; A Volver a vehículos; A Ir a vehículos |
| disponibilidad-operativa | Chip, Button, TextInput, SelectInput, Table, Pagination | Ninguno detectado |
| gestion-categorias-licencia | Chip, Button, TextInput, SelectInput, Table, Pagination | Ninguno detectado |
| gestion-conductores | Notice, Chip, Button, TextInput, SelectInput, Table, Pagination, Toast | A Registrar conductor |
| gestion-mantenimientos | Chip, TextInput, SelectInput, Table, Pagination, Toast | A Registrar mantenimiento |
| gestion-operaciones | Button, SelectInput, IconButton, Chip, TextInput, Table, Pagination, Toast | INPUT bulkBaseDate; INPUT Fecha fila 1; INPUT Fecha fila 2; A Programar traslado; A Programar vehículo |
| gestion-preoperacionales | Chip, TextInput, SelectInput, Table, Pagination | Ninguno detectado |
| gestion-tipos-vehiculo | Chip, Button, TextInput, SelectInput, Table, Pagination | Ninguno detectado |
| gestion-vehiculos | Chip, Button, TextInput, SelectInput, Table, Pagination, Toast | A Ver mantenimientos; A Registrar vehiculo |
| index | Sin marca en estado inicial | A Abrir gestion; A Gestion de conductores; A Gestion de licencias; A Relacion conductor + licencia; A Gestion de vehiculos; A Tipos de vehiculos; A Dashboard transporte; A Matriz documental; A Disponibilidad operativa; A Mantenimientos de vehiculos; A Preoperacional; A Traslado de materiales; A Programacion de vehiculos; A Programar vehiculo |
| inicio-operacion | SelectInput, TextInput, Button, Toast | A Volver a programacion; INPUT dateOperative; TEXTAREA operationObservations; INPUT text; INPUT text; A Cancelar |
| matriz-documental-vehiculos | Notice, Chip, Button, TextInput, SelectInput, Table, Pagination | Ninguno detectado |
| modelo-vehiculo-3d | Button | A Volver al expediente; BUTTON Camión rígido; BUTTON Tractomula |
| plan-operacional | Chip, Button, TextInput, SelectInput, Table, Toast, Drawer | Ninguno detectado |
| registrar-mantenimiento | SelectInput, TextInput, NumberInput, Button, Toast | A Volver a mantenimientos; INPUT maintenanceStart; INPUT maintenanceExpected; TEXTAREA maintenanceDiagnosis; TEXTAREA maintenanceNotes; INPUT maintenanceEvidence; A Cancelar |
| registro-conductor | SelectInput, TextInput, DateInput, CheckboxInput, Button, Toast | A Volver a gestion; A Cancelar |
| registro-vehiculo | TextInput, SelectInput, NumberInput, Button, Toast | A Volver a gestion; INPUT soatIssuedAt; INPUT soatStartAt; INPUT soatEndAt; INPUT techIssuedAt; INPUT techEndAt; A Cancelar |
| relacion-conductor-licencia | Notice, Chip, Button, TextInput, SelectInput, DateInput, Table, Pagination, Toast | Ninguno detectado |

