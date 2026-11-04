# Comparación · semanas

- A, consulta tabular: recomendada para buscar y comparar rangos y cintas con densidad y patrones conocidos; Table, Pagination y filtros compartidos. Compromiso: menos lectura de conjunto por mes.
- B, navegación por mes: prioriza lectura cronológica agrupada; facilita explorar períodos. Compromiso: más espacio y controles locales de exploración todavía por integrar a librería si se elige.

Ambas eliminan paneles Estado operativo y secuencia completa; conservan Generar semanas como entrada a la vista existente. Sólo tres filas de ejemplo, año 2026 y meses enero/febrero; no representan un calendario completo ni guardan datos. No se propone inactivar, editar fechas o generar registros como regla nueva. Deben aclararse las acciones reales sobre semanas, significado de inactivar y gestión de excepciones antes de promover funcionalidad. A usa tabla y paginación publicadas; B es una composición candidata. Búsqueda comprobada en ambas, 1280/390 sin desborde ni errores capturados. Selección y revisión visual de John pendientes; sin publicar.

## Revisión del proyecto principal y tercera opción

Fuente viva: D:/SIAL/Repos/sial/fe-sial-web/src/features/planning/weeks y ms-sial/src/application/use-cases/week, ms-sial/src/infrastructure/repositories/week.repository.ts. En la pantalla web existen búsqueda, estado, mes, año, tabla paginada, detalle y activación/inactivación; exportar está deshabilitado. Generación registra 52 semanas, toma como semana 1 el lunes de la semana que contiene el 1 de enero, mes según domingo, cinta inicial activa y secuencia del catálogo; permite regenerar con confirmación. El servicio impide inactivar o regenerar cuando encuentra operaciones de transporte asociadas. El uso por avisos y operaciones se evidencia en tipos y servicios; no se asume cobertura de todas las dependencias. Backend actualiza otros campos, pero la bandeja web revisada no ofrece edición individual de fechas ni cinta. Las opciones son hipótesis visuales y no implementan estas operaciones.

Tres alternativas: A tabla y filtros con Table y Pagination, recomendada para operación y escalabilidad; B agrupación por mes, útil para navegación temporal; C listado y detalle persistente para consultar una semana sin abrir un panel. Se corrigieron las fechas de los datos de demostración para respetar el cálculo del proyecto: semana 1 inicia 29/12/2025. Los filtros de B y C y sus composiciones requieren integrar librería si se seleccionan; A también es demostración parcial, sin acciones de estado ni detalle. Los datos son simulados y no representan el año completo. Revisión a 1280/390 sin desbordes ni errores capturados; selección interactiva C. SELF: análisis y variantes comparten contexto de repositorio local y decisión de diseño; no se exportan datos. Pendiente selección y validación con usuario.

## Opción A integrada · 31/10/2026

John seleccionó la tabla. La vista de gestión conserva búsqueda, filtros por estado/mes/año, exportación de la propuesta, detalle, activar/inactivar y generación. Se eliminaron paneles y cifras fijas; tabla simplificada a semana, período, mes, cinta, estado y acciones. Fechas de los tres ejemplos ajustadas al cálculo del proyecto principal. Table, Pagination, SelectInput, TextInput, Chip, Drawer, Button, Toast y confirmación se consumen en la propuesta; no se modificó el paquete publicado. La exportación es una simulación disponible en la propuesta; el frontend principal la muestra deshabilitada. La generación y restricciones reales siguen fuera de la maqueta.

Verificados búsqueda, filtro real por mes y animaciones de escoba, limpieza, detalle, cancelar y confirmar, activación/inactivación con recarga y toast, CSV de ejemplo, 1280/390 con movimiento reducido y sin errores JS capturados. La paginación se visualiza para los tres registros; no se ha ensayado segunda página en esta revisión. Pendiente revisión visual de John.

## Resumen y ciclo de cintas · 31/10/2026

Por petición de John se añadieron tarjetas para año consultado, semanas registradas y activas, calculadas a partir de registros de la propuesta; el ciclo se calcula desde la primera cinta del año y el catálogo de cintas de ejemplo, en su orden activo. La vista explicita que usa datos de propuesta: no consulta el backend ni afirma que se trate del calendario real completo. Los elementos del ciclo usan Chip de librería; las tarjetas reutilizan el patrón compartido local de estadísticas. Comprobados 8 chips, 3 registros, transición 3→2 al inactivar y persistencia tras recarga, año, vista móvil y escritorio sin desborde ni errores JS. Pendiente revisión visual.

## Exploración visual de cintas · 31/10/2026

Tres alternativas en exploracion-secuencia-cintas.html: A etiquetas compactas con muestra de color; B recorrido conectado con orden numerado; C muestras en mosaico. Se conserva diseño actual en la comparación y el contexto de Gestión de semanas. Colores basados en tokens de la propuesta, complementados con código y nombre; datos de ejemplo. Composiciones locales candidatas, no componentes publicados; selección de John pendiente. Comprobados ocho elementos por alternativa a 1280 y 390, movimiento reducido, tabla visible y ausencia de desborde o errores JS capturados. No se modificó la vista activa.

## Secuencia de cintas · opción A integrada

John seleccionó las etiquetas compactas con muestra de color, código y nombre; se integraron en Gestión de semanas usando tokens del sistema. Es una composición local específica de la propuesta, no un Chip de librería ni una modificación del paquete. Los datos siguen procediendo del catálogo de ejemplo. Comprobados ocho colores y etiquetas, resumen 3→2 tras inactivar, tabla y paginación, escritorio y móvil con movimiento reducido, y estado alternativo si el catálogo no carga. Sin errores JS capturados; pendiente revisión visual.

## Exploración de cards de indicadores

John solicita cards compactas para uso justificado por contexto. La card actual mide aproximadamente 371 × 125 px a 1280; el proyecto principal consume Card variant stats de la librería mediante StatisticCard. La API instalada expone title, value, description y className, no dicta la adopción de estas composiciones exploratorias. Tres alternativas visibles en exploracion-cards-indicadores.html: A dato alineado 260×74, B apoyo visual 260×82 y C valor protagonista 260×88; alturas medidas con el contenido de ejemplo. Año es contexto y no KPI. Ninguna opción es patrón aprobado ni cambio de librería. Semanas registradas y activas se calculan sobre tres filas de la propuesta y se sincronizan al cambiar estado. Verificados a 1280 y 390, sin desbordamiento ni errores JS capturados; pendiente selección y revisión visual. La vista activa no se modificó.

## Variantes de la opción A · indicadores

John prefiere el tamaño de A, encuentra deficiencias en títulos y tamaños, descarta B por genérica y C por acento lateral. Tres variantes de la anatomía A se presentan en exploracion-variantes-indicadores.html: lectura equilibrada, valor inicial y título destacado, sin iconos ni franja. Se usa título 13 px seminegrita, texto contextual 12 px y valor 24 px, altura mínima 82 px; ancho 280 px en escritorio, adaptable en móvil. No es patrón aprobado ni cambio de librería. Comprobadas proporciones, actualización de valores de ejemplo y ausencia de desborde o errores capturados a 1280/390. Vista activa intacta, pendiente selección de John.

## Relieve suave para indicadores

Exploración solicitada por John a partir de imagen de superficie mate con sombras opuestas y radio amplio. Se construyeron dos intensidades del estilo sobre la variante A, 88 px de alto, sin iconos ni franja lateral. Archivo exploracion-indicadores-relieve.html. Verificados escritorio claro y móvil oscuro sin desbordes ni errores capturados; datos de ejemplo. Es un candidato visual local, no cambio de Card ni tokens globales. Pendiente revisión y selección.

## Relieve discreto integrado

John aprobó integrar el relieve discreto en Gestión de semanas. Las dos cards son registradas y activas; año en contexto exterior. Alto 88 px, títulos 13 px, valores 24 px y ayuda 12 px; color, borde y sombras equivalentes al prototipo. Cambio local de composición, no promoción global ni modificación del paquete. Verificados cuatro escenarios 1280/390 y claro/oscuro sin desborde ni errores capturados; contador activo 3→2 tras acción simulada. Cintas y tabla conservadas. Pendiente revisión visual.

## Ajuste cromático del relieve · propuesta

El gris propio de las cards y las sombras opuestas resultaban ajenos a las superficies de SIAL. Se propone blanco de surface-raised, texto y borde mediante tokens existentes, sombra inferior más corta y luz superior discreta. Se conserva composición aprobada y alto de 88 px. Preview aislado: exploracion-indicadores-color-sial.html; vista activa sin modificar. Verificados 1280/390 en claro y oscuro: sin desbordamiento ni errores JS capturados. Pendiente revisión visual. SELF: ajuste local acotado, sin beneficio independiente de delegación.

## Color SIAL integrado en indicadores

John aprobó la propuesta cromática y su integración. Perfil local / web / reuse: las cards de Gestión de semanas consumen tokens de superficie, borde y texto del sistema; sombras equivalentes al preview aprobado. Se reemplazan valores anteriores en la regla existente y se actualiza la versión CSS de la vista. Composición de 88 px conservada. Verificados 1280/390 claro/oscuro sin desborde ni errores JS, ocho cintas conservadas. Alcance específico de esta vista, sin promoción global de componente. Pendiente revisión visual de integración; no publicado. SELF: ajuste local acotado.

## Orden de lectura de Gestión de semanas

Se retira el texto exterior Año / Calendario de la propuesta por solicitud de John, sin crear otra card. Secuencia de cintas trasladada al final, después de la tabla y su paginación. El resumen admite ausencia de la etiqueta de año y conserva compatibilidad con previews. Comprobados 1280/390: secuencia como último bloque, ocho cintas, contadores y ausencia de errores JS o desborde. Perfil local, SELF; pendiente revisión visual.

## Aprobación visual

John aprueba Gestión de semanas con su composición final y solicita continuar las otras vistas. Aprobación de vista, sin inferir publicación ni adopción global de indicadores. Análisis transversal y siguiente bloque en docs/aprendizajes-planeacion-2026-10-31.md.
