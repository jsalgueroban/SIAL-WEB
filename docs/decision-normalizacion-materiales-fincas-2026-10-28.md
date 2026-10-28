# Materiales y continuación en Gestión de Fincas · 28/10/2026

## Alcance y decisión

Propuesta Web, vía `reuse`, continuación de la dirección de normalización acordada. Materiales conserva sus composiciones aprobadas. Clases de referencia inicia el siguiente bloque de Fincas mediante el patrón `web-short-embedded-form` y la bandeja de Proveedores como referencia de componentes. No se modificaron aplicación ni librería productiva. Paquete instalado: `@banasandev/banasan-ui@1.4.0`.

**SELF:** cierre de Aprobación e inicio de un catálogo breve dentro del mismo runtime y checkout. No hay beneficio independiente que compense exportar este contexto. Base limpia: `origin/main`, commit `7267224`; rama local `feature/web-normalizacion-materiales-fincas-20261028`.

## Materiales

Las 19 vistas del bloque anterior conservan su aprobación histórica. La revisión documental HU546 (`606fcf8`) está contenida en `origin/main`, confirmado con `git merge-base --is-ancestor`. El inventario actual contiene además Control de entregas HU1920, incorporado por otra entrega; no se atribuye su validación funcional a este cierre.

En Aprobación se cerraron los recorridos pendientes del prototipo: cantidad vacía y sobre stock, justificación obligatoria, entrega parcial, no disponible, stock futuro, guardar, enviar y recuperar consulta tras recarga, cambio de estado con motivo y cancelación persistida. TXT: generación, rechazo de estructura inválida, carga válida y bloqueo del mismo contenido duplicado. Esto valida intercambio local de archivos, no integración ERP.

Los recorridos revelaron y corrigieron:

- Toast fuera del viewport: ahora usa un portal al documento, posición fija y cierre automático a los cinco segundos. Se comprobó a 1280×800 y 390×844.
- Vacío de búsqueda oculto por la clase compartida: ahora es visible y se anuncia como estado.
- Acciones de cerrar, cargar TXT y abrir seguimiento: consumen `IconButton`/`Button` publicados. El input file permanece nativo por su función de selección de archivo.
- Limpieza conjunta de filtros con el componente compartido y devolución de foco a búsqueda.
- Apertura y cierre de detalle con foco; al cambiar de pedido se limpia la captura del cambio de estado.

La galería, las recetas, las justificaciones y el historial siguen siendo composiciones locales. No se exige tabla o paginación a esta galería. Las solicitudes sin disponibilidad mantienen su frontera de consulta, ya documentada en el corte del 26/10. Los datos creados durante la prueba fueron retirados.

## Inicio de Fincas: Clases de referencia

Se sustituyeron los proxies y el formulario que únicamente mostraba éxito por una raíz React con controles publicados. La anatomía conserva cabecera, filtros, formulario breve opcional, tabla, paginación y detalle. El estado de consulta que antes aparecía simultáneamente con acciones administrativas se muestra solo en el escenario `?acceso=consulta`; es una simulación local, no autorización real.

Datos semilla conservados: 301 EXPORTACION/LARGA activo y 302 INDUSTRIAL/CORTA inactivo. Se implementó alta y edición local, unicidad compuesta por nombre y tamaño, cambio de estado y auditoría acumulada. El código correlativo y el alta activa son convenciones del prototipo, pendientes de contrato productivo; no se presentan como DTO ni regla nueva de backend.

| Elemento | Componente publicado 1.4.0 | Evidencia |
| --- | --- | --- |
| Búsqueda y nombre | TextInput | Valor, mayúsculas, vacío, duplicado y foco |
| Estado y tamaño | SelectInput | Filtros combinados y selección de captura |
| Contador y estado | Chip | Semántica activo/inactivo y total filtrado |
| Alta, cancelar y guardar | Button | Alta persistida, edición precargada, cancelación y retorno de foco |
| Acciones de fila y limpiar | IconButton, TableRowActions | Detalle, editar, activar/inactivar y limpieza conjunta |
| Registros | Table | Filas, vacío y scroll interno a 390 px |
| Pie | Pagination | Tres registros de prueba, tamaño dos, segunda página, uno y cero resultados |
| Detalle | Drawer | Auditoría acumulada, Escape y retorno al botón de origen |
| Confirmación | Toast | Portal, viewport móvil, duración y cierre |
| Consulta sin edición | Notice | Escenario local sin crear, editar ni cambiar estado |

Las props se contrastaron con tipos instalados y consumidores existentes. La persistencia vive exclusivamente en `localStorage` (`sial-farm-reference-classes`). Las demás ocho rutas de Fincas no quedan cerradas por este piloto.

## Verificación y entrega

- Scanners de tipos y code craft sobre el delta fuente `src/web`: cero hallazgos. La ejecución inicial sobre el bundle minificado señaló sintaxis generada como `return!` y catches de dependencias; se conservan los reportes y se delimita el gate al código fuente, conforme a la exclusión de artefactos generados de la suite.
- Build UI aprobado. Gate runtime: **45/45**, con escritorio 1280×800 y móvil 390×844.
- Contexto Web válido, con la advertencia previa de rutas sin referencia al núcleo esperado. Sin drift material de paquete en la alineación generada.
- Inventario: **103 rutas**, **570 enlaces locales resueltos, cero rotos**. El aumento respecto a 102 corresponde a HU1920, anterior a esta intervención. Matriz regenerada: 277 relaciones.
- Clases: envío vacío, duplicado compuesto, alta, edición, activar/inactivar, recarga, filtros combinados, cero/un resultado, limpieza, página/tamaño, Drawer, Escape, foco y acceso de consulta recorridos. Datos de prueba retirados al terminar.
- Revisión visual técnica: claro/oscuro y móvil; geometría comparada con Proveedores a 1280 px y sidebar expandido: página/card 968 px, padding lateral de 24 px y toolbar 918,67 px con campos de 71,5 px incluyendo label. La separación final del formulario se corrigió tras inspección de captura. Sin override de ancho local.
- Capturas en `../output/playwright/*20261028*.png`. La evidencia runtime está en `output/normalization-runtime-20261028.json`.
- **Aprobación visual de los ajustes del 28/10 y publicación: pendientes.** La aprobación histórica de Materiales no se convierte en aprobación automática del delta. No se ejecutó QA formal de producto ni se mutó Azure.

Siguiente recorrido: revisar Clases con John y continuar Grupos, Productos y Sectores. Los registros grandes y el mapa de Fincas conservan su revisión individual antes de cambiar composición. La tarea global de normalización permanece En Progreso.

## Corrección visual solicitada por John

El panel breve de Clases omitía inline-form-compact. Se conectó la clase canónica para heredar sombra elevada, radio de superficie y borde sutil; se retiraron overrides locales de margen y acciones. Aplica a creación y edición. Build aprobado y estilos computados comprobados a 1280/390 px.


## Barrido de paneles breves solicitado por John

Se revisaron los paneles HTML, React y emitidos por JavaScript. Se confirmó sombra ausente en cinco vistas: Gestión de proveedores, Reglas documentales, Parametrización de roles, Gestión de clientes y Alertas de contactos. Se añadió inline-form-compact en sus cuatro fuentes (el catálogo React sirve dos rutas). Cintas ya aplica la clase en runtime. Los otros catálogos breves declaran la clase; Clases fue corregida en la iteración anterior.

Recetas (editor de líneas), Configuración por referencia (captura por secciones), Pedidos recurrentes (captura/decisión operacional) y Changelog (editor de publicación) no se reclasifican como formularios breves. El renderer antiguo de Categorías no está enlazado por la ruta React vigente.

Verificación del delta: build aprobado y 20 combinaciones de cinco rutas × dos tamaños (1280/390) × claro/oscuro. Todos los paneles visibles heredan sombra del token, radio 12 px y no producen desbordamiento documental. Se recorrió además apertura en edición en las cuatro rutas con alta/edición; Alertas abre su editor de asignación. No se alteró lógica, persistencia ni librería productiva. SELF por corrección mecánica en un patrón compartido sin beneficio de delegación independiente. Cambios locales.

## Continuación: formularios de Grupos, Productos y Sectores
Se corrigió la edición para precargar el nombre de la fila y permitir conservarlo sin considerarlo duplicado; al crear se inicia vacío. Se usa TextInput publicado mediante el adaptador existente. Verificados los tres registros iniciales y envío con nombre original; sintaxis JS válida. Estos formularios siguen siendo prototipos sin guardar datos: no se declara normalización completa ni persistencia. Pendiente migrar interacciones de catálogo, estados, auditoría y validar todos los recorridos.


## Grupos, Productos y Sectores: normalización local
Las tres vistas usan directamente TextInput, SelectInput, Button, Chip, Table, TableRowActions, IconButton, Pagination, Drawer y Toast publicados. Alta, edición, activación/inactivación y auditoría acumulativa persisten en localStorage por catálogo. Filtros, limpieza, vacío y exportación CSV para Grupos/Sectores. Código secuencial local y estado inicial activo son supuestos de prototipo; productor sin asignar y uso de fincas son datos demo, sin integración. Verificados alta, edición, cambio de estado, recarga, auditoría, duplicados, vacío y móvil; build aprobado. No se ha verificado backend ni permisos reales, ni se ha publicado.


## Avance en vistas restantes
Gestión de fincas y gestión de referencias montan Table y Drawer publicados mediante adaptadores existentes; se verificó la apertura y contenido de ambos detalles. Registro de referencia monta NumberInput en sus siete campos numéricos; envío vacío no muestra éxito. Sin desborde documental en las cuatro rutas a viewport verificado. Las páginas continúan parciales: alta, edición, versionado/copia, estados, persistencia, mapa y flujos completos requieren implementación y pruebas; el adaptador no acredita normalización completa ni integración. No se modificaron contratos productivos.


## Validación en registro de referencia
Se agregan mensajes de error a cuatro campos numéricos obligatorios que no tenían nota y se enfoca el primer campo inválido del formulario. Probado envío vacío con NumberInput adaptado. La conexión de altas, edición, versionado, estados, persistencia y geolocalización entre vistas continúa pendiente; no se considera completada.


## Prueba navideña posterior
John pide probar el isotipo y animación del worktree D:\SIAL\Librerias\.worktrees\web\christmas-isotype después de completar Fincas. Inspección: SialIsotype variant christmas, motion welcome, animación de 3.6 s y reducción de movimiento; worktree sucio y paquete manifiesto 1.5.0, propuesta consume 1.4.0. Aún no integrado ni probado; respetar secuencia y preservar cambios del worktree.


## Precarga de finca en edición
El enlace de edición precarga los datos conocidos de las dos filas demo y las coordenadas existentes en el formulario; el código original no se marca duplicado. Verificado FIN-AC01 en controles visibles. Es una mejora parcial: guardar todavía no persiste y no acredita alta, cambios de estado ni versionado. La prueba navideña permanece pendiente de terminar Fincas, conforme a la secuencia solicitada.


## Recorridos locales y prueba navideña
Fincas: alta y edición guardan localmente, muestran la tabla y registran estado e historial; coordenadas válidas se guardan y errores bloquean el envío. Referencias: alta, copia y nueva versión con historial y estado local; una versión no reemplaza sus anteriores y debe superar la última existente. Listados conservan adaptadores de tabla, filtros y Drawer. Persistencia en localStorage: sial-farms-prototype-v1 y sial-farm-references-v1. Datos originales incompletos no se inventan: se solicitan al versionar. Códigos, reglas y estados son supuestos del prototipo, no integración de producto. Verificados alta/edición de finca, inactivación, coordenada inválida, versión 5 junto a versión 4, rechazo de versión repetida, copia precargada, auditoría, recarga y ausencia de desborde a 390 px. Faltan recorridos adicionales de accesibilidad y QA formal antes de declarar certificación completa.
Isotipo navideño: snapshot de código del worktree christmas-isotype en src/web/christmas-isotype, uso SialIsotype christmas/welcome en shell; fuente en desarrollo 1.5.0, paquete instalado restante 1.4.0, sin publicar ni modificar worktree. Animación 3.6s verificada; corrección local de especificidad para prefers-reduced-motion verificada. La fuente original requiere corregir su regla de reduced motion antes de promoción.


## Alineación del isotipo
El texto residual S dentro de brand-badge creaba una fila implícita adicional en el grid y desplazaba el SVG. Se limpia al montar el shell antes del portal. Verificados centros coincidentes entre SVG y badge con menú expandido y contraído; build aprobado.


## Sincronización local de asignaciones
Registro de finca obtiene grupos y sectores de los catálogos locales: para altas muestra activos; al editar conserva asignaciones inactivas o anteriores para evitar perder datos. Es una hipótesis de la propuesta, pendiente de validación funcional. Verificado alta con catálogos demo y edición de FIN-BP07; no corresponde a permisos ni backend.


## Cierre técnico coordinado de Fincas — 28/10/2026

Trabajo paralelo solicitado por John: tres agentes coordinados por alcance (Fincas/geolocalización, Referencias/versiones y catálogos). Evaluación de agent-delegation-router: SELF para exportación a proveedor externo por contexto local compartido; delegación interna explícita, con propiedad de archivos por slice. Las pruebas se realizaron en contextos de navegador aislados.

- Fincas: alta, edición, duplicados, estado, auditoría, filtros, limpieza, CSV, paginación (14 filas), coordenadas válidas/inválidas y borradas, marcador y foco de detalle. Geolocalización usa TextInput y Button publicados; mapa esquemático.
- Referencias: alta/copia, trazabilidad de origen, versiones sin sobrescritura, validación de versión/pesos, estado y auditoría, filtros y foco. Con 35 registros se verificaron paginación 10/30/50 y exportación filtrada completa de 12 filas. Productos y clases locales activos alimentan el formulario; conservar la asignación histórica inactiva al versionar es hipótesis pendiente de validación con producto.
- Grupos, Productos, Sectores y Clases: errores accesibles, validación, altas, estados, auditoría, filtros y paginación con 31 registros; CSV filtrado de Grupos y Sectores. Sectores refleja uso de fincas locales cuando existen.
- Integración: 54 enlaces y recursos locales resueltos. Build y gate runtime transversal 45/45 aprobados; sintaxis JS y diff --check sin errores. Adaptador compartido Pagination corregido para conservar tamaños al cambiar página. Inicio de módulo conserva enlaces a clases y referencias.

Límites: persistencia solo local y sin permisos ni backend; las relaciones de finca con grupo/sector usan nombres, por lo que un renombre no se propaga automáticamente. Los registros históricos se preservan. Falta validación de reglas funcionales, revisión visual humana e integración y QA de producto. Este cierre técnico local no equivale a aprobación ni publicación.
