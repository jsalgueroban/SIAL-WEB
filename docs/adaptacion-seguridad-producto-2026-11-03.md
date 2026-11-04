# Seguridad: base adaptada al producto antes de evolucionar

Fecha: 2026-11-03. Estado: lista para revisión visual, no cierre del módulo.
SELF: adaptación acoplada entre fuente, puente simulado y consumidor; sin beneficio independiente de delegación.

## Fuente y alcance

Fuente local: D:/SIAL/Repos/sial/fe-sial-web, rama qa/eva-pilot-20261029, commit 4dfeb23d. No se modificó el producto real. Esto acredita correspondencia con este checkout, no con un despliegue remoto.

Se trasladaron 16 archivos de componentes, hooks y utilidades conservando su cuerpo/JSX/props. Solo cambiaron imports y el import de React requerido por el build de la propuesta. Inventario y hashes: security-product-source-map.json. Comparación automática: output/security-product-source-verification.json (16/16 cuerpos iguales excluyendo imports y cabecera).

## Vistas

- auditoria-operativa.html: seguimiento de contenedores, selección de operación, árbol, evidencias actuales e históricas, etiquetas, sellos, comentarios, detalle lateral e informe condicionado por las inspecciones.
- seguimiento-vehiculos.html: vista antes ausente, vehículo/contenedor, hitos de entradas/salidas, detalle y acción POMA vinculada a salida.
- generar-documento-poma.html: búsqueda por radicación, selección de cargue/tramo, datos consolidados, pallets y generación. Probar radicación 418 (dos cargues).

Corrección del análisis anterior: la ruta activa PomaPage consume PomaWorkspace; PomaTable existe en el repositorio pero no determina esta composición. La tabla de pallets activa no está paginada. No se añade paginación ni confirmación ajena al flujo. Se retira la aprobación de evidencias inventada en la propuesta anterior. Los scripts anteriores quedan fuera de las rutas activas.

## Mapeo comprobado de librería

Propuesta: @banasandev/banasan-ui 1.4.0 instalado. Producto: declara ^1.4.1 y tiene override local a ribbon-purple-variant. No se presume igualdad de versiones: se verificaron exports, declaraciones de props del paquete instalado, build y render de los consumidores utilizados. No se actualizó ni publicó la librería.

| Uso | Componente real | Contrato instalado | Consumidor preservado |
| --- | --- | --- | --- |
| Selección de cargue POMA | CaseCarousel | dist/Audit/audit.type.d.ts | poma-workspace.tsx |
| Hitos y estado de auditoría | FlowTimeline, AuditStatusDot | dist/Audit/audit.type.d.ts | operational-audit-workbench.tsx y operational-vehicle-audit-workbench.tsx |
| Evidencias e historial | EvidenceViewer | dist/Audit/audit.type.d.ts | ambos workbenches |
| Datos, comentarios y controles | KeyValueGrid, CommentList, ControlPointList | dist/Audit/audit.type.d.ts | workbenches y POMA |
| Detalle lateral | Drawer con children | dist/Drawers/drawer.type.d.ts | ambos workbenches |
| Pallets | Table y TableColumn | exports del paquete, props del consumidor real | poma-workspace.tsx |
| Estados y contexto persistente | Chip, Notice | exports del paquete | workbenches, workspace, pages |
| Acciones y feedback | Button, Spinner, ToastProvider/useToast | dist/Toast/toast.type.d.ts y exports | generación y bridge |

Se usa React directo; no se sustituye el componente publicado por HTML parecido. Las flechas sin handler del selector artesanal de operaciones se conservan como en la fuente, pendiente para evolución; no se confunden con CaseCarousel de POMA.

## Adaptaciones explícitas

pages.jsx reproduce el contenedor de las páginas y el puente cliente de consulta. bridge.jsx reemplaza navegación Next, acciones de servidor, permisos y descargas por simulación. fixtures.js contiene datos sintéticos, SVG de demostración y PDF sin validez operativa; no consulta APIs ni usa fotos reales. Los cambios de generación permanecen en memoria y se reinician al recargar.

Las clases Tailwind de los componentes del producto se compilan con scripts/build-security-product-css.cjs usando el toolchain instalado del producto. El CSS se limita a body[data-security-product]. Se neutraliza la grilla de 12 columnas del shell y se oculta el Drawer cerrado para evitar desbordamiento durante la entrada animada. security-product.css contiene solo adaptaciones del contenedor de propuesta. No equivale a copiar todo el tema del despliegue.

## Verificación

- Build Vite aprobado (2320 módulos); no se declara typecheck completo del puente simulado.
- Gate de regresión compartido: 45/45, output/security-product-gate-20261103.json.
- Tres rutas a 390 y 1280 px: sin overflow horizontal; capturas output/security-product-*.png.
- Historial de evidencias, apertura/cierre de Drawer con Escape y condición de informe comprobados.
- POMA: cambio de 12 a 6 pallets entre cargues, descarga PDF, contador y toast de éxito; radicación inexistente y errores de consulta, detalle y generación comprobados.
- Estados de demostración: demoState=error, detail-error, generation-error. No constituyen validación de backend.

Pendiente: revisión visual de esta base y luego evolución deliberada de composición, densidad, controles, animaciones y mensajes. No se cierra Seguridad ni se extrapola la validación a producción.


## Delta solicitado: vehículos, radicado y filtros

Perfil local/build Web, reuse. Forma de tarea: consulta/detalle operacional. Fuente: mismo checkout 4dfeb23d, operational-vehicles. SELF: corrección acoplada de una vista; no hay slice independiente que justifique delegación. Se conserva la composición funcional del producto y se corrige el puente de presentación, sin alternativa estructural abierta.

- CaseCarousel.eyebrow y Drawer.subtitle ahora incluyen filingNumber (Rad. 418 / 419 de demostración), además del KeyValueGrid de resumen. Drawer también incluye el par Radicado/valor.
- Toolbar, TextInput, SelectInput y Button son exports publicados de 1.4.0. Se verificaron BaseInputProps.value/label/id/onChange y SelectProps; la distribución se aplica a wrappers de feature, no al className del input interno. No se modificó ni publicó el paquete.
- Buscador y cuatro filtros con etiquetas: cuatro columnas en escritorio, dos en tablet y una en móvil. URL como estado único, sin debounce que reponga un valor después de limpiar; año reinicia semana; búsqueda incluye carrier y texto Rad. N.
- Escoba: Button publicado con SVG local decorativo (feature-local, no icono publicado). Animación reutiliza shared/sial-filter-motion.js con entrada, salida y desplazamiento, respetando reduced motion.
- Corrección de fixture: OP-0419 ya no reutiliza OP-0418. No se importaron datos reales del radicado 64.
- El snapshot de 16 cuerpos iguales corresponde a la entrega anterior. Toolbar, workbench y filtros de vehículos tienen ahora deltas explícitos autorizados; el manifiesto conserva el origen, no acredita igualdad posterior.

Validación: build aprobado; búsqueda Rad. 419 excluye 418, etapa En tránsito filtra CAM102, año sin datos muestra vacío, año reinicia semana, ubicación actualiza URL, limpiar restaura valores y resultados. Drawer muestra el radicado seleccionado. Animación runtime detectada: layout 520 ms y entrada 480 ms. Sin overflow a 390 y 1280 px. Capturas output/vehicle-filters-final.png y vehicle-filters-mobile.png. Revisión visual del delta pendiente; alcance limitado a vehículos.


## Evolución de composición de vehículos — 03/11/2026

Petición: corregir filtros y reducir repetición de datos. SELF, scope local de la vista. Dirección: reuse de componentes publicados, evolución de su composición en la feature. Continuidad (paneles paralelos completos) descartada porque repetía placa, transportadora, ubicación y estado; se aplica contexto único + recorrido/detalle, manteniendo selector y Drawer. No se promueve como patrón global.

- Filtros: una fila en escritorio con búsqueda, año, semana, etapa y ubicación; redistribución a anchos menores, escoba compartida. El check de SelectInput caía a otra fila por el reset .grid de la propuesta: se restauran las dos columnas del option en el host, sin modificar el paquete.
- Selector: identidad de vehículo/radicado y contenedor; resumen seleccionado: periodo, último registro, estado único, conductor, transportadora, ubicación actual y destino. Ubicación y destino tienen semánticas distintas aunque coincidan en una fixture.
- Recorrido: FlowTimeline usa meta para fecha, description para ubicación. La prop date aislada no es contrato de FlowTimeline; se conserva date para Timeline del Drawer.
- Hito: fecha/lugar y datos históricos, sin sustituir una etapa histórica ausente por la etapa actual. Descripción como texto; Notice solo para novedad. Evidencias disponibles del hito, sin repetir su título en otro encabezado. Generar POMA conserva condición de salida.
- Drawer: carrier, capacidad, documento, sincronización y detalle completo. Se elimina panel redundante de Estado actual y el Notice introductorio repetido.

Validación: SelectInput option 38 px, check/texto en misma fila; filtros, limpieza, cambio ingreso/salida, ausencia de POMA en ingreso; sin overflow en 1440/1280/768/390. Build aprobado. Capturas vehicle-evolution-final.png y vehicle-evolution-mobile.png. Pendiente aprobación visual; backend y librería productiva sin cambios.

## Corrección de alcance de evidencias
El usuario detectó mezcla entre vistas. Se revierte la ampliación incorrecta del panel: como en producto, solo aplica a pallets de camión sin contenedor con palletEvidenceSummary en el hito. Se separan las fixtures: inspecciones solo en contenedores; foto sintética de pallets solo en salida de camión. Ingreso sin panel. Verificado en navegador: seis comprobaciones correctas y build aprobado. SELF: corrección local. Aprendizaje específico: evolucionar composición no autoriza ampliar condiciones de negocio ni compartir fixtures semánticamente distintas.
