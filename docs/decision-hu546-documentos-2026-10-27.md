# HU546 · Documentos asociados en la bandeja Web

Fecha: 2026-10-27. Estado: última revisión implementada, verificada y aprobada visualmente por John el 27/10/2026, incluidos los botones y la separación documental. Fuente: HU546, revisión 28 en Azure DevOps, y solicitud explícita de John en esta sesión. Plataforma: Web. Forma de tarea: bandeja de órdenes con consulta progresiva y mesa de partición existente. Vía: `explore` local sobre la bandeja aprobada; no se cambia la estructura de la mesa HU546.

## Reconciliación de criterios

| Fuente | Criterio | Decisión para esta mejora |
| --- | --- | --- |
| HU546 CA1 y alcance | Conservar pedido/documento de origen, materiales, cantidades, origen, destino, ventana, responsable y estado | Se conservan en los registros, en la creación y en el detalle. La tabla principal muestra los identificadores y el estado; Carga y Trayecto salen solo de sus columnas por la densidad indicada por John. |
| HU546 CA2 | Bloquear registro con datos obligatorios faltantes | Se conserva el gate de partición y captura existente. La expansión es de consulta y no crea ni cambia órdenes. |
| HU546, criterios añadidos | Visualizar por documento de retiro y las órdenes derivadas; permitir partición y creación | La bandeja mantiene cada orden resultante, su pedido padre y documento de origen. La expansión del registro reúne los documentos del proceso y mantiene la acción de particionar. No se fabrican relaciones para registros históricos sin pedido padre. |
| HU546 CA3–CA9 | Asignación, bloqueos, estados, TXT, POD, idempotencia e integración | La mejora no implementa esos procesos productivos ni declara que estén completos. Muestra navegación solo hacia vistas existentes de la propuesta y deja sus reglas fuera del alcance. |
| John, 27/10 | Seleccionar un registro expande sus documentos; seleccionar un documento lleva a su proceso o vista de gestión | Dirección elegida. Se incluyen pedido aprobado, documento de origen y entrega/POD cuando existe relación verificable en los datos del prototipo. No se agregan documentos de muestra. |
| John, 27/10 | Carga y Trayecto no aplican visualmente por su contenido | Se omiten como columnas de la bandeja. Permanecen en detalle y exportación, para conservar el contexto exigido por HU546. |

## Datos y destinos comprobados

- Los pedidos generados por la mesa conservan `parentOrderId` y el documento `AC`. El pedido abre la gestión de Aprobación; `PED-2026-10482` dispone de detalle directo. El aviso `AC-2026-032` dispone de consulta directa en Planeación. Las semillas `PED-2026-10493` y `AC-2026-034` no están en sus respectivos catálogos; sus enlaces llevan a las bandejas de gestión, sin simular un detalle inexistente.
- Las tres órdenes históricas contienen `RPT`, `REM` o `RES` y tienen una entrega con la misma orden y documento en Seguimiento de entregas y POD. Sus documentos abren ese proceso en la entrega vinculada. Solo `OTI-546-001` tiene un POD identificado (`POD-682-001`); los valores «Pendiente» no se presentan como documentos.
- La relación de documentos se calcula por IDs existentes en el prototipo. No acredita un DTO, permisos, PDF original adjunto ni persistencia backend. La opción «Ver PDF» genera una muestra local a partir de los datos visibles y la identifica expresamente como muestra.

## Composición y componentes

La pantalla maestra sigue siendo la bandeja de Materiales. La tabla publicada `Table` 1.4.0 acepta `rowProps`, pero no una fila de detalle ni `colSpan`; por eso la expansión se implementa como tabla semántica local de esta feature. `TextInput`, `SelectInput`, `Chip`, `Button`, `IconButton`, `Pagination`, `Toast` y `Drawer` conservan el paquete publicado. La excepción es por semántica de expansión, no un candidato de librería con API pública. El botón de cada orden comunica `aria-expanded` y `aria-controls`; se conserva el detalle en `Drawer` para Carga, Trayecto y datos operativos.

Acceso: menú Materiales → Órdenes de transporte de insumos → registro → documento → vista de gestión. La ruta activa de origen sigue siendo `ordenes`. Se comprobaron 1280 × 800 y 390 × 844, claro/oscuro, filtros con uno/cero resultados, cambio de página, apertura/cierre con teclado y destinos de documentos. Aprobación visual y publicación son gates separados.

## Verificación local de la revisión

- `npm run build:ui` aprobó y se regeneró el runtime. El gate runtime aprobó 43/43 casos, incluidos los dos tamaños de esta vista. El inventario y contexto Web validaron 102 HTML, 265 relaciones vista × componente y cero enlaces locales rotos; permanece la advertencia previa sobre vistas sin referencia al núcleo esperado.
- A 1280 × 800 y 390 × 844 se comprobó la fila expandida. La tabla móvil conserva desplazamiento horizontal interno y el panel documental se adapta al ancho visible sin desbordar la página. La variante oscura conserva contraste y jerarquía.
- Espacio y Enter abren o cierran la fila desde el botón con foco; la expansión se cierra al filtrar o cambiar de página. Se comprobaron uno y cero resultados, filtros combinados, limpieza y página 2 con datos temporales retirados después.
- `RPT-2026-0881` y `POD-682-001` abren la entrega `ENT-681-001`. `PED-2026-10482` abre su detalle en Aprobación y `AC-2026-032` su consulta en Planeación. El `Drawer` de la orden conserva el trayecto y los ítems; cierra con Escape.
- John pidió corregir espaciado, colores e iconos. Se amplió el ritmo de las filas, se distinguió la orden abierta con borde y fondo suave y se evitó partir su identificador en móvil. El azul de texto activo y enlaces se aclaró en modo oscuro.
- John señaló después el exceso de tarjetas anidadas y el control junto al título. El área expandida quedó como lista plana con separadores, sin tarjeta contenedora ni tarjetas por documento. Un `IconButton` publicado ocupa una columna propia y muestra `ChevronRightIcon` cerrado y `ChevronDownIcon` abierto; el título queda como texto independiente. Cada documento usa `DocumentFileIcon` y el enlace usa `ArrowRightIcon` publicados.
- Después de la composición plana, `npm run build:ui` y el gate runtime volvieron a aprobar; 43/43 casos y dos tamaños de esta vista. Espacio y Enter siguen alternando la expansión, y también funciona la selección con el puntero sobre la fila.
- John pidió colocar documentos lado a lado, añadir vista PDF junto a «Abrir proceso» y retirar la línea azul a la izquierda del desplegable. La lista plana usa dos columnas en escritorio y una en móvil, sin tarjetas anidadas. Se retiró el borde azul. Cada documento ofrece ambas acciones; «Ver PDF» abre en `Drawer` un PDF de muestra generado desde sus datos existentes, y «Abrir proceso» conserva la ruta de gestión. Se comprobó el render del PDF en escritorio y móvil, el cierre con Escape, y que el enlace de proceso sigue abriendo la entrega correspondiente. Build UI y gate runtime 43/43 aprobaron.
- John aprobó visualmente esta versión con dos columnas, PDF de muestra, enlace al proceso y sin la raya azul el 27/10/2026. La aprobación no acredita PDF originales ni procesos backend.
- En una revisión posterior John pidió mejorar los botones internos y separar con mayor claridad la orden seleccionada de «Documentos del proceso». «Ver PDF» quedó como acción secundaria con icono de vista, «Abrir proceso» como enlace principal con apariencia de botón; ambos comparten altura y foco visible. El bloque documental tiene fondo de superficie, un divisor neutro y más aire tras la fila seleccionada. Se comprobó el ajuste a 1280 × 800 y 390 × 844, claro y oscuro; el gate runtime aprobó 43/43 casos. John aprobó visualmente también esta última revisión el 27/10/2026.

ROUTER: **SELF**. El slice se limita a la propuesta Web y comparte datos, navegación, runtime y estado local con las vistas destino; transferir ese contexto sería comparable al trabajo directo. No hay cambios de contrato, backend ni librería productiva.
