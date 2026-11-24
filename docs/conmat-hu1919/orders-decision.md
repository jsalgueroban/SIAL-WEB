# Órdenes y preasignación · entrega local

## Alcance e identidad
HU1919 CA-01 y CA-02, propuestas Web. Bandeja/gestión con selección múltiple y captura por lote en Drawer. Se conserva la identidad vigente y los contratos de la versión instalada, sin cambiar la librería. Vía reuse de la anatomía de aprobación de pedidos, con relaciones específicas de CONMAT. No es implementación productiva ni requiere backend para este recorrido visual.

## Recorrido integrado
Panel CONMAT → Órdenes y preasignación → seleccionar órdenes → elegir transportadora habilitada → revisar lote/materiales → confirmar. Al volver al panel, el pendiente de órdenes usa el mismo estado.
Ruta → órdenes individuales → detalle de orden → ruta asociada. Acceso desde navegación Transporte; clave conmatOrdenes activa comprobada.
El estado de negocio de demostración vive en localStorage bajo sial-conmat-demo-orders-v1. Los filtros/página/selección viven en sessionStorage bajo sial-conmat-order-view-v1. Ningún servicio es invocado. La consulta de ruta conserva los fixtures originales y sus órdenes/ítems están alineados; preasignar una orden no crea una ruta.

## Fuente funcional por criterio
| Criterio | Representación UI/UX | Frontera |
| --- | --- | --- |
| CA-01.1 | Bandeja de órdenes ya existentes, sin alta en CONMAT. | Fixtures; integración real fuera de alcance. |
| CA-01.2 | Consecutivo/fecha, finca, material, cantidad y unidad visibles. Una orden multilínea conserva alineación por material. | Datos demostrativos. |
| CA-01.3 | Búsqueda por orden/finca/material, selectores finca/material/estado, fecha publicada DateInput. | Filtros locales. |
| CA-01.4 | Pendiente, preasignada, programada y cancelada con Chip. | Estados de programación separados del ciclo operativo de ruta. |
| CA-01.5 | Programadas/canceladas no se seleccionan para preasignar; se preservan materiales. | Preasignación por orden completa, parciales y concurrencia no modelados como reglas definitivas. |
| CA-01.6 | Fixture de orden actualizada en origen con advertencia y cambio de cantidad en detalle. | Sin sincronización ni política inventada para rutas afectadas. |
| CA-02.1 | CheckboxInput por orden y selección de página; parcial accesible, persistente entre páginas/filtros. | Sólo pendientes y preasignadas en esta hipótesis. |
| CA-02.2 | Transportadoras de ejemplo con opción no habilitada desactivada; validación inline y revisión del lote. | Registro/habilitación reales fuera de alcance. |
| CA-02.3 | Misma acción cambia transportadora antes de programar, muestra empresa anterior y advertencia en revisión. | Restricciones finales y permisos reales pendientes de integración. |
| CA-02.4 | Registro local con usuario de demostración, fecha/hora Bogotá. | No es auditoría productiva. |
| CA-02.5 | Se conserva ID, finca e ítems originales; sólo cambia relación/estado, sin alterar cantidades. | Consistencia transaccional real pertenece al backend. |
| CA-02.6 | Tras confirmar aparece preasignada en la consulta, lista para el constructor de rutas futuro. | No se construye aún CA-03 ni se agrega un enlace inactivo a esa vista. |

## Componentes consumidos, no imitaciones
Card/default; Toolbar/cabeceras y selección; FilterToolbar/limpieza; TextInput/búsqueda; SelectInput/estado, finca, material, transportadora; DateInput/fecha; CheckboxInput/selección; Table/bandeja, lote y materiales; TableRowActions + IconButton/ViewIcon; Chip/estados de fila; Pagination/rango y tamaño; Drawer/consulta y preasignación; KeyValueGrid/resumen de revisión; Notice/demostración, cambio de origen, advertencia y error; ToastProvider/resultado transitorio.
Composición propia: layout, criterios de filtros, contexto de selección, estado compartido, resumen por material/unidad, secuencia revisar/confirmar y registro de cambio. No se declaran componentes nuevos de librería. La adaptación de CheckboxInput agrega sólo indeterminate/aria-checked al input nativo publicado para selección parcial; la label se oculta visualmente sin perder nombre accesible.
Sin tarjetas de KPIs extras, leyendas duplicadas, chips que repitan conteos o iconos decorativos.

## Evidencia y resultados
- Build Vite correcto. No errores de consola en recorrido final.
- 22 órdenes únicas: 8 pendientes, 2 preasignadas, 1 cancelada y 11 vinculadas a 6 rutas. Prueba de consistencia de fixtures confirma conteos de órdenes y cantidades por material/unidad para cada ruta.
- Selección por teclado de OS-04801 y OS-04805; validar transportadora vacía muestra un solo error de campo. La transportadora deshabilitada no se selecciona. Confirmación preasigna 2; panel muestra 6 pendientes en lugar de 8.
- Reasignación a Logística del Norte conserva 2 eventos, con empresa anterior/nueva, usuario y hora. Elegir empresa ya asignada informa que no hay cambios.
- Programada OS-04812 y cancelada OS-04811: checkbox deshabilitado. Las validaciones de la operación también rechazan estos estados y empresa no habilitada.
- Ruta R-001 → OS-04812 y retorno recorridos. Actualización de origen OS-04806 visible.
- Búsqueda un resultado, cero resultados, material Estibas y fecha 23 noviembre aplicados. Selección parcial aria-checked=mixed y selección oculta por filtro informada; limpiar filtros y quitar selección funcionan.
- Escenario ?escenario=error muestra error y Reintentar recupera 10 filas; ?escenario=cargando muestra carga transitoria de la tabla. Son escenarios locales de revisión.
- Capturas: orders-desktop.png, orders-dark.png, orders-mobile.png, orders-mobile-assignment.png, orders-preassignment-review.png. Pruebas de escritura restauraron el snapshot de demostración, sin borrar otras claves.

## Identidad, geometría y densidad
Se comparó con aprobación de pedidos al mismo viewport CSS 1440 y sidebar colapsado: ambas páginas tienen max-width 1280 y padding superior 24; el centro difiere 7.7px por scrollbar global de 15px en la bandeja larga. No se compensó con márgenes locales. Campos primarios en la misma línea base y altura 44px; fondo/tabla/pie conservan anatomía.
Densidad retain: 10 filas comparables y filtros secundarios plegables, sin reducir tipografía base. Vista móvil verificada en contexto limpio CSS 390, DPR1; documento 375px por scrollbar, sin overflow global. Tabla 1120px mantiene scroll propio; formularios y Drawer ajustados al ancho. La primera medición del navegador de trabajo tenía zoom90%; se renovó la evidencia al 100%, sin mezclar métricas.

## Límites y siguiente entrega
Propuesta local pendiente de revisión visual. Sin API, publicación, cambios de librería, asignación de vehículo/conductor ni autenticación productiva. Constructor de rutas/subgrupos es la siguiente vista. Las reglas de distribución parcial de cantidades y casos especiales de modificaciones se mantienen como decisiones de negocio pendientes.
SELF: slice local coherente en el mismo repositorio, contexto ya disponible, sin beneficio independiente de delegación. Dona conserva registro operativo en SIAL Propuestas UI; no se crea Task Azure para una propuesta visual local.

## Corrección de consumo · botones de filtro
El disparador secundario anterior era Button/ghost con texto y contador, distinto al patrón de filtros aprobado en Librerias/filter-proposals-20261105/implementation.md. Ahora consume IconButton/ghost + SlidersIcon publicados, caja 44×44, borde sutil/radio8, tooltip y nombre Más/Menos filtros, aria-expanded/controls, sin texto/contador visible. Se conserva FilterToolbar nativo para composición y reset con BroomIcon. El panel secundario existe colapsado con hidden, por lo que aria-controls siempre apunta al DOM. No se modifica el paquete ni se dibujan iconos locales.

## Corrección definitiva de dependencia
La captura general instalada era anterior al FilterToolbar vigente: no exponía primaryCount/adaptación por ancho y SlidersIcon aún representaba una insignia. Se consume ahora FilterToolbar completo desde el artefacto de librería ya construido en ribbon-purple-variant (HEAD base 03c2e6d, dist 20 noviembre), copiado en vendor/conmat-ui-20261123 con provenance.json y hashes, dependencia local banasan-ui-conmat. No se altera ni construye el repositorio de librería.
Los cinco controles se entregan como hijos del componente con primaryCount=3. Apertura/cierre, capacidad por contenedor, campos adicionales, IconButton/SlidersIcon y BroomIcon los genera la librería; se retiran estado more, toggle y panel locales. Su CSS de toolbar se consume como snapshot bajo @scope(.conmat-orders), evitando cambiar la toolbar del panel o las demás vistas.
Comprobaciones: cinco fields publicados, glyph de tres círculos; Enter abre y Space cierra, Estibas conserva valor al reabrir, reset devuelve foco a búsqueda. Controles 44 CSS px; en reduced-motion ambos rectángulos 44×44 y misma línea base. En móvil CSS390 queda un campo primario, despliega los otros cuatro sin overflow global. Build correcto. La adaptación de consumo es específica a CONMAT, no un release de librería.

## Contadores y selección contextual
El total filtrado se representa con Chip/info al lado del título de la bandeja. La selección usa otro Chip/info con cantidad y significado, IconButton/CloseIcon para quitar selección y la única acción de preasignar al extremo de la misma barra contextual. Se elimina la repetición del conteo dentro de la acción y el texto suelto bajo el título. En móvil, la acción ocupa su fila y el resumen conserva el grupo compacto. Scope: sólo esta bandeja, no patrón global.

## Vista flotante compacta
Por petición del usuario, consulta de orden y preasignación se trasladan del Drawer a una superficie centrada de 580px máximo y altura por contenido. El lote se despliega a demanda; materiales consolidados sólo durante revisión. Se preservan selección, empresa elegida, revisión y confirmación. Controles, tablas, mensajes y resúmenes consumen la librería.
El paquete consultado no ofrece un diálogo de contenido genérico: ProfileDialog exige usuario/fincas y no admite children. El contenedor es feature-local, con portal, fondo modal, app-shell inert, bloqueo de scroll, foco contenido y restaurado, Escape y cierre exterior; no se presenta como componente publicado. Los selectores portaleados de la librería siguen interactivos sobre la ventana.
Comprobado: lote de 10 órdenes, apertura del selector, revisión, expansión de las 10 filas y salida sin perder selección; detalle de orden. Altura inicial ~327 CSSpx, revisión limitada por viewport. Tab desde última acción regresa al cierre; primer Escape pliega selector y conserva ventana, segundo cierra. Móvil CSS390 comprobado. Evidencia orders-floating-review.png / orders-floating-mobile.png. No se modifica la ventana lateral del panel de rutas, fuera de esta petición.

## Jerarquía final de selección y acción
Se sustituye la barra contextual por cabecera única según ajuste del usuario: el chip de total pasa a selección al marcar órdenes y regresa al total al limpiar; quitar selección queda junto al chip. La acción permanece arriba y usa Button/filled de banasan-ui-conmat, deshabilitada sin selección y habilitada con órdenes elegibles. Se conserva el aviso de selección fuera de filtros. No se repite cantidad en el botón.

## Ajuste final del chip
Se elimina el chip del total y la X para quitar selección. En la cabecera sólo aparece Chip/info cuando hay órdenes seleccionadas; desmarcar se realiza desde los checkboxes. Sin selección no hay chip y preasignar permanece deshabilitado.
