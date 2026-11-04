# Movimiento compartido de filtros: propuesta → librería → frontend

Fecha: 2026-11-03. Plataforma Web; operación map, perfil audit. Alcance documental: localizar la mejora existente y definir su adopción. No se implementa ni publica software en esta sesión. Tarea Notion40d70c9c-1cbc-81f4-82d0-ee027c83f72a. SELF: comparación acotada de fuentes locales relacionadas; delegar no aporta beneficio independiente.

## Fuente y comportamiento recuperados

- `shared/sial-filter-motion.js`: movimiento FLIP de campos al cambiar la presencia de la acción Limpiar filtros. Redistribución520ms con rebote leve; entrada de escoba480ms desde−16px/escala.78 hacia posición final; salida180ms. Usa Web Animations API y omite animaciones si prefers-reduced-motion está activo.
- `shared/sial-filter-reset.css`: acción44×44px y redistribución de1–5 campos; dos columnas hasta1050px y una hasta680px.
- `shared/sial-core.js`: carga los recursos compartidos y conecta la acción en vistas HTML; captura eventos incluso si SelectInput usa un portal.
- `src/web/table-filter-reset.jsx`: composición React de la acción de limpieza de la propuesta.
- `docs/decision-normalizacion-planeacion-2026-10-30.md`: recuperación explícita de entrada/salida y desplazamiento, teclado y movimiento reducido durante normalización de Avisos, Semanas y Cintas.
- `docs/decision-normalizacion-usuarios-2026-10-30.md`: mismo patrón en bandeja/permisos, con composición adaptada.

La mejora corresponde al contexto de filtros activos: señala que existe una acción de recuperación y evita un salto brusco de la barra. No cambia la semántica de búsqueda ni necesita animación continua de controles.

## Frontera de responsabilidad

| Pieza | Responsable propuesto |
| --- | --- |
| Entrada/salida de limpiar, desplazamiento de campos y cancelación de transiciones | Librería Web, composición de filtros reutilizable |
| Tamaño, foco, teclado, etiqueta accesible y movimiento reducido | Librería Web |
| Qué filtros están activos y sus valores iniciales | Feature del frontend |
| Limpiar parámetros, conservar empresa/alcance, reiniciar paginación y consultas | Feature del frontend |
| Distribución particular de una vista y filtros en una segunda fila | Composición del consumidor dentro del contrato adaptable |

## Estado actual de las fuentes reales

Toolbar en christmas-isotype y en el paquete enlazado ribbon-purple-variant sólo ofrece children/compact y atributos HTML. Su CSS implementa flex responsive; no incluye presencia de limpiar ni movimiento de redistribución. El script de la propuesta no demuestra que esa capacidad esté publicada.

Frontend principal: `src/components/common/toolbar/toolbar-table.tsx` exporta ToolbarPage, usa Toolbar/TextInput/SelectInput y useQueryParams; búsqueda con debounce500ms y selectores que actualizan URL. No incorpora el patrón compartido de la escoba. `src/components/sections/search-filters.tsx` es otro consumidor de filtros con grid estático. `src/features/planning/weeks/components/planning-weeks-toolbar.tsx` compone ToolbarPage y un filtro anual separado: limpiar debe declarar expresamente si incluye el año, sin inferirlo del DOM.

## Implementación recomendada

1. Promover una composición específica de barra de filtros sobre Toolbar y Button/IconButton existentes, sin cambiar automáticamente todas las Toolbar. Nombre tentativo FilterToolbar; no es API disponible hoy. Debe aceptar campos con identidad estable, presencia de filtros activos y callback de limpieza; no nombres de query params, fetch, permisos ni conocimiento del módulo.
2. Reutilizar el movimiento de la propuesta como referencia visual y convertirlo a un ciclo React con referencias locales. Capturar geometría anterior y posterior al commit, animar sólo elementos de esa barra y cancelar/reorientar transiciones ante cambios rápidos. Evitar listeners globales de input/click/keydown, barridos de todas las barras y clones insertados en document.body.
3. Mantener la acción saliente dentro de su composición sólo el tiempo de salida, sin recibir foco/eventos y sin duplicar IDs. Si el foco estaba en limpiar, devolverlo al buscador antes de retirarlo. Con movimiento reducido, cambio inmediato y funcionalidad intacta. Preservar texto sin distorsión: preferir desplazamiento de contenedores o medir el impacto del scaleX antes de adoptar ese detalle.
4. Adaptar ToolbarPage en el frontend para derivar actividad desde valores reales y limpiar únicamente la lista explícita de filtros del módulo. Cancelar debounce pendiente al limpiar y sincronizar controles con URL, incluida navegación atrás/adelante. No resetear contexto de empresa ni permisos. Conservar el contrato de page/pageSize de cada pantalla.
5. Piloto en Semanas y una segunda bandeja con filtros distintos; después cubrir los demás consumidores. El año de Semanas está fuera de ToolbarPage y debe coordinarse con la misma acción si forma parte de su alcance.

## Criterios antes de promover y adoptar

Teclado y selección en portal; limpiar desde búsqueda/selector/combinación; filtros iniciales en URL; vacío; móvil; temas; movimiento reducido; clics rápidos durante entrada/salida; debounce pendiente; atrás/adelante; foco al desaparecer limpiar; ausencia de consultas duplicadas o resultados fuera de orden. Catálogo de librería y pantallas conectadas se verifican por separado con Eva para producto. No se ejecutó una nueva QA visual ni funcional en este mapeo estático.

Decisión: sí corresponde llevar el comportamiento visual compartido a la librería y conectar estado/URL en el frontend. Copiar el script global de la propuesta al proyecto real dejaría dependencias de clases/DOM y dos owners de estado. La promoción y su adopción son la siguiente etapa, no una capacidad ya entregada.

## Ejecución posterior autorizada

El mismo03/11 se implementó FilterToolbar como composición de Toolbar/IconButton en christmas-isotype, con consumo local mediante ribbon-purple-variant. Pilotos reales Semanas y Empresas activados explícitamente; las otras barras conservan su comportamiento. Movimiento por interpolación de grid, sin escalar texto ni listeners globales. Contrato y pruebas en docs/filter-toolbar-promotion.md de librería y docs/filter-toolbar-pilot-2026-11-03.md del frontend. Tarea40d70c9c-1cbc-816c-a1aa-e8ad0dab4658, entrega local para revisión; no publicación.
