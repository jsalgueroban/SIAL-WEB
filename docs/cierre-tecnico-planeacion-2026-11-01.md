# Planeación · cierre visual aprobado

## Cierre · 01/11/2026

John aprobó visualmente el módulo completo: Avisos, creación/importación/corrección, consulta, Semanas, generación y Cintas. Esta aprobación supera los pendientes de revisión visual del registro técnico inferior. Se conservan las excepciones de componentes y el alcance simulado documentados.

Build UI y gate 45/45 aprobados, junto a los recorridos específicos registrados abajo. Cierre documental sin cambios de código; no se repiten pruebas. Publicación remota no realizada en este cierre.

Siguiente bloque: Gestión de Operaciones Puerto, recuperando los avances previos del catálogo. La tarea general de normalización Web continúa En Progreso; el cierre de Planeación no cierra los módulos restantes.

Perfil local, propuesta Web. SELF: flujos y adaptadores comparten estado local; sin beneficio de delegación independiente. Continúa la tarea existente de Dona. No se modificaron servicios, permisos, paquete de librería ni reglas productivas.

## Delta de importación y corrección

- Vistas previas de Loading Plan y archivo de aviso: Table y Pagination publicados mediante adaptador, con celdas y Chip de estado conservados. Probada página 2 de 12 filas y posterior importación de todas las filas, no solo la página visible.
- Metadatos del ejemplo Excel: SelectInput deshabilitado y NumberInput de solo lectura; no aparentan configurar un parser. CSV/TSV omiten ese bloque porque se leen por encabezados del archivo. Excel usa muestras y lo declara en el resultado de análisis.
- Acciones de remoción de archivo usan Button; cierre de los tres diálogos usa IconButton. Confirmación de publicación/corrección usa Notice dinámico para validación contextual, Button y Toast para resultado final.
- Éxito de importar, pegar o aplicar Loading Plan usa un Toast con descripción y no aviso persistente duplicado. Archivo vacío no continúa. Pegado vacío comunica error y admite recuperación.
- Diálogos mantienen recorrido de Tab/Shift+Tab y restauran foco al disparador después de Escape; se corrigió la interferencia del shell en esa restauración.

## Cobertura ejecutada

| Recorrido | Evidencia |
| --- | --- |
| CSV de 12 filas | Table/Pagination, siguiente página 11–12, importar incrementa matriz 3→15, Toast. Ejecutado a 1280/390. |
| Pegado | Vacío marca aria-invalid; tabulado válido incrementa 15→16 sin desborde a 1280/390. |
| Loading Plan y Excel demo | Rechazo de PDF, recuperación con archivo permitido, aviso explícito de datos de ejemplo, preview y aplicación, Toast con descripción; móvil oscuro y movimiento reducido. |
| Corrección preoperativa | Motivo/cambios vacíos bloquean; cambio 18→20 con motivo valida; confirmación conserva identidad/versiones y muestra diferencias; publicación simulada emite Toast y deshabilita edición. |
| Corrección de versión bloqueada | Campos no editables; se conserva recorrido de consulta ya existente, sin agregar nuevas reglas de acceso. |
| Teclado | Foco inicial en Cerrar, Shift+Tab lleva a última acción, Escape cierra y devuelve foco a Pegar filas. |
| Confirmación | Notice de validación publicado y sin duplicado visible; captura móvil inspeccionada en output/planeacion-confirmacion-20261101.png. |
| Todas las vistas | Avisos, Crear, Consultar, Semanas, Generación y Cintas: 1280 claro / 390 oscuro sin errores JS ni desborde documental. |

Build UI aprobado. Gate transversal 45/45, archivo output/planeacion-gate-20261101.json. Sintaxis JS y diff de cambios comprobados. El ajuste posterior de Escape tiene su comprobación dirigida; no requiere atribuirlo al gate previo.

## Componentes y excepciones declaradas

Versión consumida @banasandev/banasan-ui 1.4.0. Controles de matriz: TextInput, NumberInput, DateInput, SelectInput, Chip, IconButton; importación: Table, Pagination, Button, Notice; feedback: Toast. Se comprobó API desde exports/tipos instalados y montaje en estados alcanzados.

La librería no exporta textarea, upload genérico ni diálogo de confirmación genérico. Esas composiciones permanecen locales con tokens, etiquetas, validación, foco y acciones publicadas. Table no soporta encabezados agrupados: matriz semántica local documentada en decision-matriz-planeacion-2026-11-01.md. No se declara esas piezas como componentes publicados ni se cambia el paquete por inferencia.

## Estado de entrega

Normalización de este bloque terminada para revisión visual. Gestión de semanas conserva aprobación del usuario; la integración de importación/corrección espera su revisión. No se declara aprobación completa del módulo ni publicación remota. CSV/TSV se procesan localmente con el formato sencillo mostrado; archivos Excel, publicación, generación y persistencia del prototipo no equivalen a integraciones productivas. No se promete compatibilidad con todas las variantes de archivos Excel/CSV.
