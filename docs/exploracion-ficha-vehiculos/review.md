# Revisión de composiciones

Alcance: solo ficha de contexto e información del hito. Identidad, filtros, selector, recorrido y acciones conservados. Datos de demostración.

Assessment A (agente design_review): problema de jerarquía, 17 datos pasivos tratados como unidades equivalentes. Recomienda ficha de grupos semánticos: vehículo, asignación, ubicación y registro. Hito: etapa/contenedor/carga, observación y responsable sin tarjetas. Alternativa B prioriza ubicación/destino y filas compactas; riesgo de mayor altura y énfasis excesivo en ubicación sin novedades.

Assessment B (agente browser_evidence): detector CLI sin hallazgos ([]), ambas variantes con 12+5 campos, dl/dt/dd, sin overflow 1440/390. No overlay ni certificación completa de accesibilidad. Browser evidence separado.

Síntesis: A recomendada por continuidad y asociación semántica sin introducir más superficies. B aporta alineación de valores y prioridad a ubicación. Ambas preservan información íntegra y permiten cambiar vehículo e hito. Build aprobado; ruta vigente verificada sin barra de exploración ni patrón candidato. Selección pendiente del usuario.

## Componente y promoción
VehicleFacts es proposal-only, no un export publicado. Ruta vigente devuelve KeyValueGrid. Alternativas usan dl semántico, tokens SIAL y CSS limitado a nombres vf-. Button, Chip, Drawer, CaseCarousel, FlowTimeline y POMA conservan componentes reales. Después de selección: evaluar variante plana/agrupar de KeyValueGrid o componente descriptivo independiente con la skill de librería. Sin modificación ni publicación implícita del paquete.

## Gobernanza
Delegación ROUTER: revisión de diseño y detector aislados exigidos por Impeccable, sin delegar implementación. Contexto Impeccable cargado: PRODUCT.md conserva campo Register obsoleto; ignorado, sin alterar producto ni ampliar alcance. Frontend Design aporta agrupación visual; Impeccable aporta contraste independiente. No se cambian fuentes/colores para aparentar evolución.

## Opción B seleccionada: refinamiento
El usuario prefiere B y pide resolver espacios desaprovechados. Se distribuyen etapa/contenedor/carga en tres columnas y observación/responsable en dos; POMA al cierre derecho. Registro ocupa tres columnas repartidas. Ubicación actual y destino tienen etiquetas explícitas, iconos locales de punto y destino y aclaración temporal respecto al hito. Sin inferir llegada ni cambiar ubicación al seleccionar historial. Los 12+5 campos se conservan; ambos vehículos y móvil 390 sin overflow; build aprobado. Alcance en ruta de exploración, pendiente revisión del pulido.

## Contexto cercano al recorrido y límites de bloque
Petición aplicada a B: ubicación y destino salen del encabezado de datos y pasan al inicio del workspace de recorrido/hito en franja compacta (aprox. 66 px en viewport de validación). Se retira Referencia actual. Bordes finos redondeados solo para los dos bloques mayores, no para campos. 17 campos, build y móvil sin overflow verificados.

## Organización superior B
Sección superior con tres grupos equivalentes: Vehículo (4), Asignación (3), Registro de la operación (3). Etiquetas sobre valores y separadores solo entre grupos. Se elimina la fila administrativa dispersa. En tablet Registro pasa a una fila completa; móvil apila grupos. Conservados 17 campos incluyendo ubicación/destino e hito. Build y 1440/1024/768/390 sin overflow.

### Separación de selección y contexto — 2026-11-03
Ajuste solicitado para B: divisor superior y 24 px interiores antes del encabezado del contexto seleccionado. Se conserva CaseCarousel y la información enlazada por selección; no se añaden tarjetas por campo. Alcance local de la exploración.

### Corrección: dos bloques independientes
La separación anterior mediante divisor no respondía a la intención. B ahora contiene dos superficies hermanas: filtros y selector en la primera; contexto, ubicación, recorrido e hito en la segunda. Separación exterior de 24 px. CaseCarousel y selección compartida conservados. Build correcto; selección 418/419 y viewport móvil comprobados.

### Integración aprobada en la vista principal — 2026-11-03
El usuario aprobó B y autorizó su integración. seguimiento-vehiculos.html activa la misma composición: dos bloques independientes, datos agrupados en Vehículo/Asignación/Registro, ubicación y destino compactos antes del recorrido y detalle, hitos recientes primero. Conserva componentes publicados y datos del vehículo; sin controles de comparación en la principal. Build correcto. Comprobadas selección 418/419, detalle completo, cambio de hito, búsqueda y limpiar filtros; sin desbordamiento en los tres tamaños revisados. La exploración permanece como evidencia.

### Recorrido conectado — primera evolución visual
Dirección solicitada: mejorar composición, eje y transiciones; retirar borde azul de selección. Se conserva FlowTimeline 1.4.0 y su contrato, con variante visual local explícita pendiente de promoción a librería. Filas sin marcos, eje continuo entre marcadores de 28 px, títulos completos, fondo tenue de selección y marcador activo con rebote breve. Detalle entra suavemente por hito. Descripciones, numeración y orden conservados. Build correcto; teclado Enter, foco visible, movimiento reducido y móvil comprobados. No se publica paquete ni se propaga a otros consumidores.

### Recorrido: metadatos y listas largas
Fecha/hora en elemento time separado de descripción mediante ReactNode admitido por FlowTimeline, sin usar date/status ignorados. Último movimiento calculado por fecha, independiente de selectedKey. Botón Ir al último; flechas/Home/End; scroll interno 480 px (380 móvil) con selección visible y movimiento reducido. Verificado escenario explícito demoState=long-journey con 24 hitos: End llega a #1, etiqueta permanece en #24 y retorno restaura scroll 0. Escenario normal conserva 4 hitos, textos y detalle. Sin desbordamiento móvil. Build correcto. Variante local lista para revisión, sin cambios en paquete publicado.

### Ajuste de densidad y detalle del hito
Retirada fila Consultando/Ir al último por solicitud. Responsable junto a Etapa/Contenedor/Carga, nombre ficticio Carlos Mendoza; Observación sola a todo el ancho con saltos de línea. POMA centrado cuando corresponde mostrarlo; condición funcional intacta. Build y composición 4 columnas desktop/1 móvil comprobados, sin desbordamiento. Variante pendiente revisión.

### Promoción a librería y consumo — 2026-11-03
Composición aprobada integrada en FlowTimeline variant=connected de chore/christmas-isotype. Consumo desde tarball local 1.5.0 de esa rama, manifiesto y lock actualizados. La vista aporta títulos/descripción/timestamp/markerLabel, orden y selección; librería controla filas/eje/movimiento/teclado/scroll. Retirados overrides y lógica duplicada. Responsable/observación/POMA y dos bloques conservados. Hashes JS/CJS/CSS coinciden con fuente. Véase library-consumption.json y documentación de promoción del paquete. No publicado ni enviado a remoto.

### Drawer de vehículos: composición alineada
Se reutiliza Drawer publicado con width=min(600px,100vw). Encabezado conserva placa/radicado/OP; estado/semana y ubicación/destino preceden a Vehículo, Asignación y Registro. Se retiran 16 pequeñas cards; datos con etiquetas y valores completos y separadores. Recorrido connected de librería (340 px máximo) y detalle seleccionado visibles dentro del drawer, compartiendo selección con la vista. Se conserva documento del conductor, contenedor, capacidad y todos los datos previos. Build correcto; grupos, ausencia de cards, selección de hito, Escape y ausencia de desbordamiento móvil comprobados. Cambios locales de composición; no modifica Drawer publicado.
