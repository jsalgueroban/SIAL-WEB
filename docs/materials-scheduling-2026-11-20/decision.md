# Programación de pedidos de insumos · revisión local

Fecha: 2026-11-20. Plataforma web, operación evolve, perfil local, alcance view.
SELF: corrección acotada en una propuesta y estado local; no hay beneficio independiente de delegación. No se modifican contratos de paquete, migraciones ni arquitectura.

## Decisión vigente y contraste previo
Fuente funcional: solicitud de esta sesión; diez pedidos de demostración, semana 47. No se infiere HU.
Ventana flotante elegida por usuario. Reuse de la anatomía visual de Ruta operativa de materials-order-trace.jsx y trazabilidad-pedido.css, adaptada de siete etapas logísticas a cinco etapas del insumo. No se promueve un patrón global.
Identidad: DESIGN.md 1.2.0, shared/sial-core.css, paquete instalado @banasandev/banasan-ui 1.5.0. Se conservan tipografía, tokens y controles publicados. El paquete exporta Drawer lateral y ProfileDialog específico; no ofrece modal genérico. El dialog nativo es una excepción feature-local, no adopción de un modal de librería.
Capacidades propias activadas: inspección de identidad y API instalada, diagnóstico de composición, estados/interacción y revisión de densidad con navegador. No se necesitan assets ni alternativas: la superficie y referencia ya fueron elegidas.
Densidad: compactar duplicación de encabezados y conservar lectura de datos; cuatro columnas en escritorio y dos en móvil. Movimiento: ninguno, por operación frecuente.

## Hallazgo y delta
Antes: círculos y conectores sin color por variables definidas únicamente en .order-trace; icono actual atenuado por un marcador superpuesto que aquí no existe; cálculo de extremos para siete etapas; CSS superpuesto.
Después: CSS local acotado a .schedule-operational-route, cinco marcadores, conector 10%-90%, completadas verdes y actual azul con ACTUAL. Se retira import de toda la hoja de trazabilidad. Sin tarjetas individuales ni encabezados repetidos. Identificador de tabla de solo lectura: el ojo de Acciones abre detalle.
El cierre llama close() antes de desmontar y devuelve foco en el siguiente frame. El pedido se resuelve contra rows, sin depender de la página visible.
No hay imports a otros checkouts, Drawer forzado, roles manipulados ni Timeline/FlowTimeline/ControlPointList en el archivo de esta vista. Los cambios ajenos del checkout se preservan.

## Vista × componente
| Elemento | Contrato consumido | Estado/evidencia |
|---|---|---|
| Indicadores | Card variant=stats 1.5.0 | Montados; compactos en captura escritorio |
| Filtros | TextInput, SelectInput, DateInput 1.5.0 | Montados; seis campos con base a y=477.15 en 1440×1000; búsqueda con uno/cero resultados probada. Selector/fecha individual pendientes |
| Estados | Chip preset warning/info/active 1.5.0 | Visible en tabla y detalle |
| Tabla y ojo | Table, TableRowActions, IconButton, ViewIcon 1.5.0 | Diez registros, ojo PED-004/PED-006 probado |
| Pie | Pagination 1.5.0 | Tamaño 5 y página 2: 6–10 de 10; uno y cero resultados coherentes |
| Acciones | Button, IconButton 1.5.0 | Asignar y guardar responsable, avance de estado, cancelar edición probados |
| Editar cargue | SelectInput 1.5.0 | Apertura de edición probada; elección y guardado pendientes |
| Detalle | dialog nativo, feature-local | Modal centrado; Escape y retorno al ojo comprobados |
| Ruta | composición local con SVG de referencia | Cinco etapas; futura Preparación = Por realizar; avance actual a Preparación probado |

## Evidencia y gates
Build: npm.cmd run build:ui exitoso; warning de minificador @reference existente en estilos compilados. Runtime: consola sin errores.
Revisión visual ejecutada: 1440×1000 claro (PED-004), 1440×1000 oscuro (edición de cargue), 390×844 (ruta vertical). Capturas de la sesión: .playwright-mcp/page-2026-11-20T20-23-44-505Z.png (antes), page-2026-11-20T20-24-48-302Z.png (después), page-2026-11-20T20-25-39-540Z.png (móvil), page-2026-11-20T20-26-18-301Z.png (oscuro).
Lectura: etiquetas y datos separados, ruta conectada, sin cabeceras redundantes. Interacción: foco visible definido y retorno comprobado. Contenido: no se fabrican fechas históricas; Sin registro/Pendiente. Responsive: ruta vertical, scroll del cuerpo conserva encabezado; acceso a acciones inferiores requiere desplazamiento.
Acceso estático: contrato de navegación materiales/programacionPedidos → programacion-pedidos.html; acceso en home-access-data.json; montaje en main.jsx. Click del menú y contraste visual de la pantalla maestra completa pendientes.
Semántico: aprobado para el delta local; funcional: parcial según escenarios pendientes; visual: revisado por agente, aprobación del usuario pendiente. No certificación Eva (es propuesta), no publicación ni commit/push. No se ejecutó matriz piloto ni validación de mapa integral: no se entrega inventario.

## Límites y Dona
Datos en memoria; recargar reinicia cambios. No backend. No se afirma alineación integral de producto/librería ni accesibilidad completa. No se cambia la librería instalada.
Ares: tarea 146ecc51-3ff6-436a-9fa1-713805808242, SIAL · Propuestas UI. Registro inicial Backlog; no cerrar mientras falta aprobación. HU/Azure sin identificar; no se escribe Azure.

## Delta solicitado: lectura rápida sin bajar
El usuario solicita eliminar la necesidad de scroll en escritorio. Se compactan padding de cabecera/cuerpo, gaps de datos y separaciones de ruta/acciones sin reducir fuentes ni targets. Se conserva ventana flotante y toda la información. Revisión visual PED-006 a 1366×768: ventana 1080×532, cuerpo clientHeight=scrollHeight=453, acciones completas visibles. No se oculta overflow para simular ajuste. El CSS es externo al bundle: no requiere regenerar runtime.

Delta local solicitado: centrar horizontalmente el grupo de acciones del detalle mediante justify-content:center; conserva orden y controles publicados.

## Filtros con revelado progresivo
Solicitud: aligerar la barra con Más filtros. Principales: semana, finca, estado. Secundarios: insumo, cargue, recepción. Button outlined publicado controla región local con aria-expanded/aria-controls y hidden; los campos publicados se conservan montados, con sus valores. Contador de criterios secundarios activos evita filtros ocultos inadvertidos. Reutilizar FilterToolbar fue evaluado: su contrato controla reset/actions, no disclosure, por lo que se mantiene composición local y TableFilterReset existente. Build correcto. Navegador: abrir/cerrar, seleccionar Estibas, cinco filas resultantes y Más filtros (1) al cerrar. Revisión visual de barra cerrada ejecutada.

Delta de indicadores: se aplica texto secundario como la referencia mediante description del Card stats publicado (contrato comprobado). El copy declara semana seleccionada porque los indicadores usan weekly y no todos los filtros de tabla. Build y montaje verificados; revisión visual en navegador realizada.
