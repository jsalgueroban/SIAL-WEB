# Seguimiento de contenedores — inicio de revisión

Fuente real comprobada: fe-sial-web, qa/eva-pilot-20261029, HEAD 4dfeb23d. Ruta /admin/audit/operational. Lectura de página, toolbar, actions, workbench, filtros, servicio y tipos. SELF: comparación encadenada de fuente y adaptador local; no se delega por contexto estrechamente ligado. Skills de propuesta/librería y Dona.

## Contraste

El workbench (560 líneas), toolbar y acciones de la propuesta coinciden con el proyecto salvo imports hacia bridge y React. Se conserva el dominio: contenedor, radicado, ID de programación, tipo/capacidad/contexto, inspecciones internas/externas, fotos vigentes e históricas, sellos, etiquetas y comentarios. Son propios de contenedores y no se trasladan a vehículos.

El producto consulta GET transport-operations/container-movements con viewMode=extended y filtros; obtiene semanas por año y descarga informe por POST inspections/container-report/{id}/generate. La propuesta usa fixtures y PDF de demostración, sin acceso productivo. La regla de inspecciones en puerto y elección por fecha/ID está conservada en el workbench.

## Primera mejora aplicada

FilterToolbar publicado para búsqueda/año/semana/etapa, etiquetas e IDs; SearchSelectInput conserva consulta paginada/buscable de semanas. DateInput para rango avanzado. Escoba compartida restaura año/semana iniciales y limpia los criterios adicionales, cancela debounce y sincroniza texto/URL; retirado botón Limpiar duplicado. No se agregan filtros de vehículo, estados de pallets ni reglas ajenas.

Build y diff-check aprobados. Navegador: búsqueda sin resultado, restablecer y recuperación de datos, fechas de librería y móvil sin desbordamiento comprobados.

## Pendiente de evolución/revisión

Resumen y densidad de datos del contenedor, árbol de inspecciones, jerarquía de evidencia vigente frente al historial, detalle/drawer y mensajes de reporte. Debe preservarse la correspondencia entre inspección, evidencia e informe. No se marca esta vista ni Seguridad completos.

Seguimiento operacional de vehículos está cerrado por aprobación visual explícita, incluido drawer; véase cierre-seguimiento-vehiculos-2026-11-03.md. POMA continúa pendiente después de contenedores.

## Normalización aplicada — lista para revisión visual

Se aplica la composición aprobada en vehículos al dominio de contenedores: dos superficies independientes (filtros/selección y contexto/recorrido/detalle), encabezado con divisor, datos en grupos Contenedor/Asignación/Registro mediante listas descriptivas y ubicación antes del recorrido. Los bordes se reservan para los bloques principales. No se trasladan POMA ni evidencias de pallets.

Mapa de consumo: CaseCarousel → selección; FilterToolbar y controles publicados → filtros; FlowTimeline connected → recorrido inverso, numeración, fecha/hora y último movimiento; Chip → estados/conteos; EvidenceViewer → fotos e historial; CommentList → anotaciones; Drawer → detalle agrupado; Button/Toast → informe simulado. ContainerFacts y container-audit.css son composición local de esta vista, no componentes promovidos a librería. Transición breve del movimiento con respeto a reduced-motion.

Se eliminó la repetición de responsable/sellos dentro del detalle. Se conservan asignación histórica del movimiento, formulario de inspección, etiquetas y la regla del informe (ambas inspecciones en puerto y selección de la más reciente). Se corrigieron identificadores heredados del segundo fixture.

Validación: build:ui correcto; selección de inspección externa cambia detalle y oculta informe; historial pasa de una a dos fotos; segundo contenedor actualiza radicado/orden/programación y muestra vacío de evidencias; drawer muestra ese contenedor y cierra con Escape; viewport estrecho sin desbordamiento horizontal observado. Búsqueda sin resultados y escoba recuperan las dos operaciones. Fuente y datos siguen siendo simulados: no se certifica backend ni descarga productiva.

Estado: implementación entregada para revisión visual; contenedores y Seguridad aún no cerrados. Captura: output/containers-normalized.png. Vehículos conserva su cierre aprobado.

## Reorganización contextual aprobada — 2026-11-03

Perfil local, Web, dirección explícitamente aprobada por el usuario. SELF: ajuste acotado de composición, sin cambio de contratos ni librería. Skills: sial-design-proposals (flujo rector), frontend-design y sial-web-library en modo consumo. Se sustituye la composición de tres columnas desiguales tras feedback visual: normalizar no implica copiar la densidad de vehículos.

Contexto: franja de tipo/capacidad/contexto/ubicación; asignación horizontal; registro secundario desplegable con orden y sincronización siempre visibles. Se conservan los seis campos del registro en vista y drawer. Disclosure de feature con Button publicado, aria-expanded/aria-controls y región oculta; no existe Accordion/Disclosure exportado en la dependencia instalada. No se promueve a componente público.

Movimiento: encabezado con fecha/ubicación/responsable, sección Datos del movimiento, Evidencias con conteo e historial juntos, Sellos y etiquetas, comentarios y acción del informe al cierre. EvidenceViewer conserva observaciones y fotos, Chip conserva estados y etiquetas, FlowTimeline y Drawer siguen publicados. Composición CSS específica; no modifica tokens ni API de librería. Datos históricos de asignación se conservan aunque coincidan con el contexto actual.

Comprobaciones: build:ui aprobado; abrir/cerrar registro y aria-expanded; registro en drawer con todos sus campos; historial de dos fotos y reinicio al cambiar hito; informe oculto en inspección externa; cambio de contenedor y vacío de evidencia; Escape; ancho 390 px sin desbordamiento horizontal. Captura revisada: output/containers-reorganized.png. Servidor local 4189 levantado. Pendiente aprobación visual, sin cierre del módulo ni certificación de backend.

## Contraste de datos y eliminación de repeticiones

SELF: lectura de mapper/tipos reales y adaptación local estrechamente ligada, sin beneficio de delegar contexto parcial. Fuente: src/features/audit/operational/utils/operational-audit.mapper.ts y types/operational-audit.entity.ts del proyecto real. mapContainerMovementOperation confirma: asignación global = último movimiento; comentarios = agregado de operación; evidencias se vinculan por evidenceIds; sellos/etiquetas = movimiento. getContainerCapacityLabel ya incluye pallets. registeredAt en ese mapper es último movimiento, no necesariamente creación (se conserva en registro por contrato actual).

Delta: asignación sólo en hito seleccionado; en drawer se identifica explícitamente como asignación del último movimiento. Comentarios fuera del panel seleccionado, una sola sección de operación. No se eliminan anotaciones por coincidencia textual, pues podrían ser registros distintos. Estados idénticos al título se omiten únicamente en la presentación del recorrido. Responsable visible una vez en detalle; sellos/etiquetas sólo en su sección. Ausencia total de asignación se resume en una frase. Capacidad consume etiqueta sin añadir unidad. Selector distingue ID de programación y radicado. SIN_STATUS se presenta como Sin estado definido, sin mutar fuente.

Caso de referencia de capturas: semana 43, radicado 64, programación AD90CCD0, MMAU135866-8, tipo ESPECIAL, capacidad20 pallets, Zona Externa, siete códigos ZI280305–ZI280311 y dos comentarios visibles. Son seis movimientos parciales legibles, no reconstrucción de los catorce. Las dieciséis imágenes son placeholders explícitos, no evidencia real. Responsable truncado se mantiene como aparece; fecha de inspección interna, registro y sincronización no confirmados se muestran ausentes. No se consultó API autenticada ni se presenta el fixture como extracción de producción. Orden parcial visible preservado; fechas faltantes no se inventan.

Build correcto. Navegador: seis eventos, dieciséis fotos demo, siete etiquetas, asignación ausente condensada, cambio a despacho conserva comentarios globales; responsive390 sin desbordamiento. Evidencia output/containers-source-review.png. Pendiente validación visual y acceso a respuesta real completa si se necesita reproducir la operación íntegra.

## Sustitución definitiva por lectura de la aplicación real — 2026-11-03

Se accedió a la pestaña autenticada de https://sial.banasan.com.co/admin/audit/operational?year=2026 y se recorrieron los catorce hitos de OP-AD90CCD0 / Rad.64 / MMAU135866-8, el drawer y las 87 fotografías mediante controles de la UI. Esta lectura sustituye el fixture parcial anterior y sus incertidumbres; no se consultaron credenciales ni se modificó producto.

Fuente local: output/container-case-live.json (DOM visible, metadatos y formulario); output/container-case-live-media.json (descargas de imágenes observadas). Snapshot consumido: src/web/security-product/container-case-live.json. Medios: shared/cases/ad90ccd0/evidence-01.jpg a evidence-87.jpg. Extracción del DOM y copia de archivos reproducible en output/import-container-case.py. Material de revisión local; sin publicación, commit ni despliegue.

Cobertura: 14 movimientos; fotografías por hito en orden descendente [0,12,0,0,4,14,16,12,0,0,1,12,16,0]; 5 formularios con 26 puntos verificados; 7 etiquetas internas y16 externas, conservando el código largo irregular exactamente como en la fuente. Comentarios completos y autores conservados. Último movimiento21:21 En cross docking; inspección interna inicial08:32, responsable completo Margarita Rosa Leguia Rodríguez. Asignación real KUS342/Diego Alfredo Angarita Dietes/Christian Mejia/S26432 sólo donde corresponde. Sellos3061835, OUV20072 y bolsaVQTX023311 asociados a sus hitos.

Pulido: encabezado de foto omite prefijo idéntico al título del hito; observación idéntica a comentario de operación enlaza a éste en vez de repetir texto; formularios consultables con Button accesible y puntos semánticos en el hito; drawer diferencia inspecciones homónimas por fecha/ubicación; estados sin sellos/etiquetas condensados; Último registro sustituye Fecha de registro; sincronización no se inventa cuando la vista real no la expone. No se repone Ver historial.

Verificación: build:ui y diff-check del alcance correctos; integridad14/87 y87 imágenes locales comprobada; navegador recorrió los14 hitos y contrastó conteos, etiquetas y regla del informe (sólo inspección externa de puerto20:03). Fotos cargan desde archivos locales; navegar a foto2, expandir7 puntos, consultar26 valores verificados en drawer y cierre comprobados. Captura final output/containers-live-final.png. Estado En Revisión, esperando validación visual; no se cierra Seguridad.

## Retiro de drawers y comentarios por hito — 2026-11-03

Por solicitud explícita se retiran botón Detalle completo, estado y Drawer de vehículos y contenedores. Documento del conductor, único campo de vehículo que sólo estaba en drawer, pasa a Asignación. Los formularios de contenedores permanecen consultables por hito mediante Ver puntos, con resultado/tipo, sellos y observaciones en sus secciones correspondientes.

Se corrige la conclusión anterior: la colección agregada de comentarios no prueba que sean generales. En el caso real leído, autor/fecha de Sin novedad coincide unívocamente con recepción19:02; el comentario largo coincide con inspección externa20:03 y su observación. El snapshot incorpora traceNodeId explícito para ambos. No se inventa asociación genérica para comentarios sin evidencia: sólo esos quedan como generales. El importador local conserva el vínculo si la coincidencia autor/fecha es única.

Comentarios del movimiento dentro del panel seleccionado, con12px entre registros. Observación de foto idéntica al comentario asociado se omite de la foto y se lee una vez en la sección del movimiento. No queda lista global para este caso.

Verificado: build:ui y diff-check; cero botones Detalle completo y cero drawers en ambas vistas; documento del conductor visible; recepción muestra únicamente Sin novedad; inspección externa muestra únicamente su observación; cero comentarios generales en Rad64. Pendiente revisión visual.

### Etiquetas: composición de verificación
Perfil local, web; reuse de la composición de puntos aprobada por el usuario. Etiquetas con código sobre estado en tres columnas (dos/una en pantallas pequeñas), sin cards individuales; Button y Chip del paquete vigente. Recuento y desplegable accesible Ver/Ocultar etiquetas. Códigos íntegros con salto de línea, sin truncado ni cambios de datos. SELF: ajuste local acotado. Build correcto; 16 etiquetas y cierre comprobados a 1440 y 390 px sin desbordamiento de sección. Evidencia: output/container-labels-refined.png. Pendiente aprobación visual.

`nAprobación del usuario: composición de etiquetas de seguridad aprobada. Próximo bloque de revisión: flujo POMA; esta aprobación no acredita su validación.

### Selector de casos: evolución de interacción
Perfil local Web, SELF: dos consumidores del mismo adaptador, sin cambios del paquete. Se conserva CaseCarousel instalado; adaptador proposal-only añade arrastre de ratón (umbral6px/supresión de click), desplazamiento táctil nativo y avance32px/s tras3s si hay desbordamiento. Pausa con hover, foco, pestaña oculta, reduced-motion y control explícito. Reanuda tras4s de inactividad; se detiene en el final sin duplicar casos. La selección no cambia con el avance. Tarjetas260px, jerarquía de título/metadatos y fondo de selección sutil sin raya lateral; foco independiente. Componentes publicados CaseCarousel/Button, CSS local pendiente de calibración; no promovido a librería. Build correcto. A390: avance0→53px, hover estable, arrastre→0 sin selección accidental, reduced-motion estable. Vehículos1440: selección manual y geometría correctas. Evidencia output/case-carousel-refined.png. Pendiente aprobación visual antes de promoción.
`nCarrusel aprobado visualmente. Se añaden 12 operaciones sintéticas DEMO por vista en semana45 para probar densidad (14 tarjetas por vista). Caso real y medios intactos; las nuevas operaciones tienen IDs propios y no copian evidencia real. Build correcto.
`nAjuste solicitado: retirado control visible de pausa. Arrastre con inercia por velocidad de salida (máximo2.8px/ms), amortiguación exponencial240ms y parada en bordes; nuevo gesto, rueda o teclado interrumpe. Sin impulso si sostiene antes de soltar o con movimiento reducido. Selección preservada; avance automático conserva pausa por hover/foco. Build correcto.
`nCarrusel aprobado promovido a CaseCarousel variant=interactive autoAdvance en chore/christmas-isotype. Adaptador y CSS locales retirados; ambas vistas consumen paquete1.5.0 empacado localmente. Hashes ESM/CJS/CSS/tipos coinciden. Verificados tipos/build/lint,5 pruebas de artefacto y scanners sin altos. Ambas vistas: avance ~37px, impulso289→842px, selección intacta y Enter funcional. Reduced-motion0px, móvil390 sin overflow. No release ni push. Evidencia docs/case-carousel-consumption.json.
