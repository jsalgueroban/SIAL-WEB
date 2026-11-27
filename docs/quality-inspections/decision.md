# Decisión y verificación · 2026-11-27

## Entrega local

Ruta: `/Calidad/inspecciones.html`. Acceso comprobado: catálogo raíz → Abrir propuesta; shell Gestión → Calidad → Inspecciones de calidad. Clave activa: calidad/inspecciones. El ítem nuevo pertenece a la propuesta, no acredita alta en el menú ni permisos productivos.

Comparación visible: `?vista=analitica` presenta las tres gráficas antes de la tabla; la ruta base prioriza bandeja. Decisión del owner: retain bandeja para revisión frecuente; retain analítica como orden alternativo para explorar. Objeción a la bandeja: la lectura agregada queda bajo la tabla. El selector permite revisar la alternativa con el mismo conjunto de datos. Selección humana de composición pendiente; no se declara mejora medida ni patrón global.

## Identidad y densidad

Shell y geometría de `conmat-panel.html`, DESIGN.md y tokens existentes. No se modifican anchura ni márgenes globales. Capturas comparables a 1440×1000 y comprobaciones móviles a 390×844. Tabla compacta con desplazamiento horizontal local; detalle amplio con bloques apilados en móvil. Decisión density_review: compact en bandeja, expand en expediente. Lectura: títulos, resultados y revisión diferenciados; interacción: controles y navegación por teclado comprobados; contenido: cinco cajas visibles individualmente; responsive: no overflow global en los recorridos probados.

La paleta categórica de dona/horizontales pertenece al contrato de SialChart; el gráfico no usa el color como única señal. La serie semanal y los chips sí utilizan semántica de resultado. No se altera el paquete para añadir una API de color por categoría. Esa personalización es una brecha de librería si se exige equivalencia cromática entre todos los gráficos.

## Mapa de componentes montados

| Elemento | API / versión | Evidencia |
|---|---|---|
| Acciones y secciones | Button, banasan-ui 1.5.0; filled/outlined/ghost | Navegación, revisión y retorno ejecutados |
| Resumen y superficies | Card, stats y composición | Render en escritorio, oscuro y móvil |
| Resultado y revisión | Chip preset | Estados independientes visibles |
| Búsqueda y filtros | TextInput, SelectInput, FilterToolbar | Búsqueda, filtros cruzados y limpieza |
| Bandeja y cajas | Table / Pagination | Cinco cajas, paginación y vacío |
| Comprobaciones | CheckboxInput value/onChange | Selección por etiqueta y Space |
| Avisos | Notice heading/variant | Error recuperable y contexto demo |
| Confirmación de guardado | Toast title/onClose | Guardado visible; cierre manual o a 6 segundos |
| Gráficas | banasan-ui-conmat/charts SialChart 1.5.0 | Tres figuras ECharts; clic real en sector filtra Aceptado |
| Observación | textarea local | El paquete inspeccionado no expone entrada multilinea; validación, límite y foco propios |
| Evidencia | dialog HTML nativo local | Ficha semántica de evidencia; Escape y retorno de foco comprobados |

Los dos paquetes locales tienen versión nominal 1.5.0, pero distinta procedencia: controles del paquete instalado principal, gráficos del paquete conmat disponible. No se afirma publicación ni adopción de esta revisión en producto.

## Pruebas ejecutadas

- Build Vite dedicado correcto. Bundle aislado; no se reconstruyó ni sustituyó sial-ui-runtime.
- `scripts/check-quality-browser.cjs`: PASS para tres gráficos, búsqueda, cinco cajas, ficha de evidencia, bloqueo por checklist/comentario, guardado, persistencia tras recarga, historial, retorno conservando filtros, filtrado resultado+semana, paginación, vacío, recuperación de error, oscuro y móvil.
- Clic real sobre sector SVG ECharts: filtro Aceptado aplicado. Entradas equivalentes por botones accesibles.
- Acceso desde catálogo comprobado por navegación. Checklist operable con Space.
- Console: cero errores y advertencias observados en el recorrido. La vista no forma parte de la matriz piloto global; no se declara cobertura de otras vistas.
- Movimiento reducido activado en comprobación final. Selección de sección contrastada con aria-pressed y estilo final tras transición.

Capturas: `output/quality-final-tray.png`, `quality-final-analytics.png`, `quality-five-boxes-desktop.png`, `quality-supervisor-final.png`, `quality-traceability-desktop.png`, `quality-analytics-dark.png`, `quality-review-mobile-dark.png`. Las capturas inmediatamente posteriores a clicks pueden representar la transición; el estilo final se comprobó por separado.

## Límites

18 inspecciones sintéticas; reglas y métricas de ejemplo coherentes con cinco cajas. Sin acceso a API productiva. Las fichas fotográficas no contienen fotografías reales. Fechas de recepción y revisiones iniciales son demostración explícita. Revisión persistida sólo en localStorage, con error de almacenamiento manejado. No existe implementación de permisos, aprobación productiva, rectificación ni consulta de borradores aún locales del teléfono.

Build: verificado. Runtime y recorrido: verificados en alcance descrito. Revisión visual: realizada en las capturas. Aprobación del usuario: pendiente. Publicación: no realizada; servidor local disponible.


## Corrección solicitada: estructura SIAL y eliminación de elementos marcados

2026-11-27. Perfil local, vía reuse. La petición del usuario sustituye la decisión anterior de mostrar aviso de demostración y desplegables de datos. Referencia exacta: DESIGN.md §6.1 y §16, Gestión de referencias para header/toolbar/tabla/acciones/pie; farm-consultations.jsx como consumo actual de TableRowActions/IconButton/ViewIcon. No se copia su dominio.

Implementado: page-header, card standard-master-card, card-header con título y contador, FilterToolbar con campos alineados, Table con acción de consulta mediante componentes públicos, Pagination. Se retiran el aviso superior, explicaciones técnicas redundantes y el pie técnico. Se conserva la información funcional y los avisos de ausencia de fotografía.

El paquete SialChart 1.5.0 no expone una opción para omitir el desplegable. Adaptación local explícita: se oculta exclusivamente .bui-sial-chart-values dentro de .qi-chart; no se modifica el paquete. Se aporta una tabla estática para lectores de pantalla y se conservan filtros accesibles por categoría, evitando controles ocultos enfocables. Los gráficos siguen siendo instancias reales de SialChart.

Verificado: build; recorrido completo check-quality-browser PASS; los dos elementos marcados no están visibles; tres SVG ECharts montados; campos de toolbar a y=427.67 y altura=44 en 1440 px, contenido dentro de toolbar con 18 px inferiores. Móvil 390 px sin overflow global; oscuro y revisión conservados. Capturas actualizadas: output/quality-sial-analytics.png y quality-sial-tray.png. Aprobación visual y publicación siguen pendientes; no se modificó la librería.

## Mejora de gráficas y movimiento — 2026-11-27

SELF: adaptación visual local acotada; sin beneficio independiente de delegación. Se conservan los datos y el flujo de supervisión.

Dona con colores semánticos compartidos con evolución, centro contextual y leyenda completa. Evolución con selector de cantidades/porcentajes, leyenda exterior y totales por semana. Defectos ordenados, nombres completos, barras con fondo y separación fruta/empaque.

Adaptación local explícita en quality-charts.jsx: SialChart mantiene montaje, renderer SVG, selección y disposición. Su API no expone todas las opciones visuales; getInstanceByDom y setOption personalizan la misma instancia ECharts. No se modifica el paquete. El ocultamiento de datos duplicados pasa a .qc-canvas, con tabla alternativa para lector de pantalla.

Entrada de dona 900 ms, barras 720 ms con escalonado, actualización 460 ms, énfasis 180 ms y contador 650 ms. Sin bucles. Entrada al aparecer en viewport, repetición voluntaria y prefers-reduced-motion desactiva movimiento. Referencia consultada: https://echarts.apache.org/handbook/en/how-to/animation/transition/.

Verificación: build Vite PASS; check-quality-browser.cjs PASS (bandeja, cinco cajas, revisión persistida, trazabilidad, filtros, paginación, recuperación, móvil, oscuro y movimiento reducido). Tres gráficas listas, consola sin errores. Replay con SVG diferentes a 50/230/1180 ms confirma animación real; selector porcentual muestra eje 100%. Captura final: output/quality-motion-final.png. Continúa como propuesta local en revisión.

## Corrección de regresión de hover — 2026-11-27
La librería reconstruye sus opciones base en cada render porque genera un objeto de tema nuevo. El estado de hover del adaptador provocaba ese render y restauraba el total central y la leyenda originales. Se añade una frontera memo con callback de selección estable que consulta la referencia actual; los cambios reales de datos siguen propagándose. Build PASS. Comprobación de hover, selección de Aceptado y cambio porcentual PASS: ningún texto total de la configuración base en los SVG y eje 100% presente. Captura output/quality-hover-fixed.png. Cache de assets actualizada a motion-4.

## Tooltip de dona — 2026-11-27
Corregida superposición: el tooltip richText se pintaba dentro del SVG, por debajo del contador HTML; confine lo desplazaba al centro. Se utiliza tooltip HTML de ECharts anexado a body, sobre la capa del contador, posición a 18 px del puntero y límites del viewport. Sin transición de posición para seguir el segmento. Build PASS. Hover real en Aceptado y Rechazo parcial: contenido correcto, tooltip visible en body y coordenadas a 18 px del cursor en ambos casos. Captura output/quality-tooltip-fixed.png. Assets motion-5.

## Revisión integral de flotantes — 2026-11-27
Se unifica el tooltip HTML sobre body en las tres gráficas. Evolución y defectos conservaban richText dentro del SVG, susceptible a recorte. Posición relativa al puntero calculada desde la instancia concreta y limitada al viewport; ocultación al salir, desplazar la página y actualizar configuración. Se elimina la implementación de posición duplicada de la dona.

Prueba reproducible scripts/check-quality-tooltips.cjs: 149 hovers comprobados, un flotante visible por vez, contenido no vacío, límites del viewport, salida sin residuo y ausencia de total predeterminado. Incluye cantidades, porcentajes, selección de resultado, Bandeja/Analítica, búsqueda por pallet, oscuro y móvil 390 px. Cero pageerrors. Build PASS y check-quality-browser.cjs PASS con filtros cruzados, cinco cajas, revisión, persistencia, trazabilidad, vacío y recuperación. Cache motion-6. SELF: corrección local, sin cambio de paquete.

## Pulido del expediente — 2026-11-27
Propuesta Web SIAL, reuse, SELF: slice local. Regreso con flecha, estados con etiquetas de dominio separadas, navegación de cinco secciones, eliminación del borde superior rojo y resultado semántico. Acción inicial dirigida a las cinco cajas; navegación anterior/siguiente con posición de lectura recuperada. Ver evidencia abre el defecto exacto de la caja actual, sin perder contexto; Escape restaura foco. Datos y validación no cambian.
Build y regresión funcional PASS. Prueba dirigida: Caja 3/Cicatriz abre la ficha correspondiente, foco restaurado y caja conservada al avanzar/volver. Ancho 390 sin overflow global. Captura output/quality-detail-polished.png. Assets flow-1.

## Ajuste a referencia SIAL — 2026-11-27
Regreso: Button outlined en acciones de cabecera, conforme a conmat-tracking.jsx/conmat-closure.jsx; se elimina flecha textual y personalización del botón. Secciones sin numeración añadida, selección outlined del paquete; selector de cajas agrupado. Título Resultado del pallet en estilo de sección, sin uppercase ni espaciado editorial. Modal nativo local (no hay export Modal genérico en paquete instalado) centrado con margin auto e inset, cierre IconButton/CloseIcon público, altura limitada y bloqueo del scroll raíz restaurado al cerrar.
Build y regresión funcional PASS. Modal escritorio 680x523 en x380/y238 para viewport 1440x1000; móvil 358x530 en x16/y157 para 390x844. Escape cierra y restaura contexto. Capturas quality-sial-modal.png y quality-sial-detail.png. Assets flow-2.

## Evidencia a superficie completa — 2026-11-27
Tarjetas con área visual completa y datos sobre degradado inferior; modal ampliado a 920 px, área visual 480 px y metadatos superpuestos en dos columnas. Se conserva indicación de fotografía ausente; no se inventa evidencia. Build y recorrido funcional verificados. Assets photo-1.

## Visor completo — 2026-11-27
Petición explícita: se retira aviso inferior marcado y se ocupa pantalla completa. Imagen/estado ausente a toda superficie, encabezado y cierre superpuestos, datos en cuatro columnas de escritorio y dos móviles. Sin scroll interno. Build PASS; viewport 1440x900 y 390x844 comprobados con metadatos visibles, sin overflow del diálogo y Escape operativo. Assets photo-2.

## Visor simplificado — 2026-11-27
Se elimina regreso duplicado. Navegación con IconButton de flecha sin texto visible ni borde, hover transparente y etiquetas accesibles. Degradado inferior reducido a opacidad máxima .5 con sombra de texto. Build PASS; siguiente/anterior cambia contexto y X cierra. Assets photo-4.

## Zoom con rueda — 2026-11-27
Zoom local del visor por wheel nativo no pasivo, rango 1–5, anclado al cursor y traslación limitada. No se agregan controles de zoom. Al cambiar evidencia se reinicia transform mediante key. Overlay no intercepta rueda ni altera metadatos. Build PASS; rueda amplía, reduce hasta 1 y cambio de imagen reinicia a 1. Assets photo-5.

## Arrastre con zoom — 2026-11-27
Pointer capture para arrastre primario con escala mayor a 1; cursor grab/grabbing, límites de traslación compartidos con rueda, finalización en pointerup/cancel/lostcapture. Cambio de evidencia reinicia posición y escala. Build PASS; drag cambia transform, mouseup detiene movimiento y siguiente reinicia zoom. Assets photo-6.

## Navegación de secciones y cajas — 2026-11-27
Dos niveles diferenciados: secciones compactas con selección suave; muestra agrupada en card con título, instrucción y cinco botones de igual ancho, estado y selección consistentes. Build PASS; cinco cajas abren su detalle y móvil 390 sin overflow global. Assets nav-1.
