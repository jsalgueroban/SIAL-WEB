# HU533 · Consulta y gestión preoperacional (web)

La vista web se compone como maestro de inspecciones + detalle de solo lectura. Conserva el patrón SIAL de tabla: contador en cabecera, búsqueda y filtros alineados, acciones de fila sin borde, chips de estado y paginación del adaptador compartido. No duplica el formulario móvil.

## Fuente y alcance

- HU533 y tarea Azure 2595.
- FR-PTR-010, revisión 1 (31/12/2021), para vehículos particulares. Se usa como **catálogo provisional** de seis grupos y 42 puntos, adaptable en la propuesta a camión y tractomula por decisión del usuario. No se afirma que sea el checklist oficial de pesados.
- Los cuatro registros de la tabla son datos de ejemplo, no expedientes del producto.
- El resultado mostrado es un dato registrado del ejemplo; jamás se calcula automáticamente a partir del número de novedades.

## Pendiente de definición funcional

Validar versión oficial por tipo de vehículo, criticidad, evidencia por hallazgo, vigencia de la inspección, roles de decisión/corrección, liberación y el contrato de consulta con transporte y programación. La propuesta no escribe estado del vehículo ni simula una liberación.

## Conexiones

Menú Transporte → Preoperacional → detalle por inspección. En implementación de producto, enlazar además desde vehículo, disponibilidad y programación una vez aprobados los contratos de datos y permisos.

## Corrección de navegación · 14/10/2026

La primera versión omitía `sial-conductores.js`, adaptador que define `SIAL.applyShell` para el módulo Transporte. Por ello fallaba la inicialización del menú antes de montar el árbol compartido. La consulta y el detalle ahora cargan `sial-core.js` → `sial-conductores.js` → script local, igual que las vistas maestras del módulo. Verificación en navegador: 71 enlaces de navegación, «Preoperacional» activo, expansión del menú funcional y detalle accesible.
