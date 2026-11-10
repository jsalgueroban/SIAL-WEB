# Avisos de corte · alineación con producto

## Correspondencia con la Librería Web

El filtro de finca y referencia en los encabezados define la intención visual de `TableColumnFilter`: búsqueda, selección múltiple y aplicación explícita. La librería contiene ahora ese componente en una rama de revisión. Esta propuesta HTML conserva su implementación local y no afirma consumir un paquete aún no publicado; los datos y el filtrado sincronizado entre las dos tablas siguen siendo lógica de la vista.

## Alcance y dirección

- Plataforma: Web. Perfil: evolución local de las vistas de gestión, creación y consulta.
- Se conserva la composición y el lenguaje visual de la propuesta. El producto real se usa como fuente de capacidades y contrato de datos, no como referencia estética.
- Fuente revisada: `fe-sial-web/src/features/planning/cut-notices`, `ms-sial/prisma/schema.prisma` y `sial-protos/proto/ms-sial/harvest_notice.service.proto`.

## Contrato que informa la propuesta

- Un aviso pertenece a una semana. En el producto real el registro inicial se almacena como versión numérica 1 y cada actualización incrementa el número; las auditorías son consultables.
- El esquema actual permite un solo aviso por semana (`@@unique([weekId])`). Las varias tarjetas de una misma semana en los datos ilustrativos de la maqueta representan escenarios alternativos de diseño, no registros simultáneos válidos para persistir.
- Cada asignación persistible contiene fecha de corte, finca, código y versión de referencia y cantidad de palés. La combinación aviso, fecha, finca, referencia y versión de referencia es única.
- La interfaz muestra cliente, grupo, sector, certificación, cajas y racimos como contexto o cálculo de la propuesta; esos datos no se envían como campos de `HarvestScheduleInput`.
- El producto real importa CSV para el aviso. La carga directa de `.xlsx` y la carga de Loading Plan no están disponibles en el frontend actual. En la propuesta, los archivos delimitados se leen localmente para explorar el flujo; no se representa una lectura ficticia de Excel.
- Los filtros de la bandeja y el historial de versiones existen en el producto. La propuesta conserva sus propias superficies y estados para mostrarlos.

## Decisiones de esta evolución

### Ajuste de composición solicitado

- Perfil `local`, plataforma `web`, forma `formulario de planeación con matriz`, alcance específico de `crear-aviso-corte.html`. Fuente: captura y aclaración del usuario: retirar la composición que oculta y muestra «Filtros y columnas» y «Editar datos detallados», conservando sus bloques y lógica. El problema es que ambos controles requieren desplegar secciones necesarias para completar la tarea.
- Vía `reuse` de la composición actual con cambio de jerarquía: los filtros de finca y referencia quedan dentro de los encabezados de ambas tablas, con la misma selección aplicada a la matriz semanal y a las asignaciones detalladas. La barra permanente conserva solo el calendario para ir a una fecha, la visibilidad de días y «Limpiar filtros» cuando corresponde. La tabla detallada queda permanente debajo, con encabezado informativo sin control de expansión. La alternativa de sustituirla por un panel contextual fue descartada tras la aclaración del usuario. El menú contextual conserva el salto a la fila del detalle.
- Alcance de componente: matriz, filtros por columna y menú contextual `feature-local`; controles y tabla de detalle existentes. API pública de Librería Web: sin cambios. Movimiento: ninguno para las secciones estáticas; el menú contextual conserva su transición breve y respeta movimiento reducido.
- Delegación: `SELF`. El slice depende del estado local del mismo checkout y de la interacción existente entre matriz, validación y menú; exportarlo a un worker tendría un costo de contexto comparable al trabajo directo.
- Pulido de filtros, decisión local de vista: el contorno azul observado en el foco del encabezado y de la búsqueda se sustituye por sombreado de superficie; el foco sigue distinguible. Las flechas tipográficas se reemplazan visualmente por cheurones discretos, alineados al extremo derecho del título en ambos encabezados. No cambia la lógica de filtrado ni la API de la Librería Web. Delegación `SELF`: ajuste CSS acotado al mismo archivo y sin beneficio de un slice independiente.
- Evidencia de pulido: `output/cut-notice-filter-polish-open.png` muestra el menú abierto sin anillo azul; `output/cut-notice-filter-chevrons.png` muestra la alineación final de cheurones en finca, referencia, días y total. Se verificó abrir desde la tabla detallada y la matriz semanal, aplicar filtro y restablecerlo.
- Ajuste de ancho solicitado: «Proyección de impacto» pasa debajo del plan semanal, de modo que la matriz y la tabla detallada aprovechen todo el ancho del contenedor. El impacto conserva cálculos y estado, con distribución interna adaptable a escritorio, tableta y móvil. Decisión de vista `reuse` con cambio local de composición; sin cambios de API de librería. Delegación `SELF`: CSS localizado y prueba visual en el mismo checkout.
- Evidencia del ajuste: `output/cut-notice-impact-below-desktop.png` y `output/cut-notice-impact-below-mobile.png`. A 1440, 1024 y 390 px el impacto queda bajo el plan, ambos ocupan el mismo ancho y no hay desbordamiento horizontal de la página; el cálculo ilustrativo de cajas permanece en 2.004.
- Refinamiento del impacto solicitado: la distribución de tres columnas dejaba el estado aislado y un vacío visual entre datos. Se conserva el bloque bajo el plan y su contenido; se compone en dos áreas: cifra principal con estado asociado y cuatro métricas agrupadas en una cuadrícula 2×2. A menor ancho las áreas se apilan. Decisión `reuse` local de esta vista, sin nuevos datos ni componente de librería. Delegación `SELF`: ajuste CSS acotado, dependiente del estado visual del checkout, sin slice independiente útil.
- Evidencia de composición: `output/cut-notice-impact-composed-desktop.png`, `output/cut-notice-impact-composed-tablet.png` y `output/cut-notice-impact-composed-mobile.png`. A 1440, 1024 y 390 px la cuadrícula conserva valores y no desborda la página; una validación con cliente incompatible mostró el estado «Bloqueos» sin romper la distribución.

- El requerimiento actual distingue el aviso «Inicial · sin versión» de la primera modificación, que se muestra como «Versión 1». Esto difiere de la numeración persistida hoy en el producto real y requiere una decisión de contrato antes de integrar la propuesta.
- La matriz incorpora «Versión ref.» por asignación y comprueba duplicados con la misma clave que el modelo persistente.
- La importación de aviso ofrece CSV y revisa sus filas antes de agregarlas. Loading Plan sigue siendo una exploración local, sin afirmación de integración con el servicio real.
- La propuesta muestra una matriz semanal precargada: finca y referencia por fila, versión de referencia bajo el código, palés por día de lunes a domingo y total. Cada celda con valor corresponde a una asignación individual por fecha; se agrupa solo para presentación. El editor detallado conserva cliente, grupo, sector, certificación, cajas, racimos, línea y fecha con calendario nativo. Si esos metadatos difieren entre días de la misma combinación, la matriz avisa y conserva el detalle por asignación.
- Tras la revisión del usuario se simplificó la captura: «Agregar finca y referencia» abre un formulario corto de cuatro datos; luego se escribe la cantidad directamente en la celda del día. La celda vacía significa sin programación. Al borrar una cantidad existente se quita ese día del borrador y aparece «Deshacer». Si era el único día, la combinación permanece sin días para que pueda reutilizarse o quitarse explícitamente.
- Finca y referencia se filtran desde los encabezados de las dos tablas. En escritorio se pueden mostrar u ocultar días y elegir una fecha con calendario; en móvil un selector permite editar un día a la vez, sin desplazamiento horizontal de la matriz semanal. Los controles de fecha y visibilidad permanecen a la vista y se pueden restablecer junto con los filtros.
- Los filtros por encabezado permiten búsqueda y selección múltiple para finca y referencia; cada día y el total filtran por presencia de palés. La selección de finca o referencia se aplica también a las filas de la tabla detallada y a sus contadores. Cambiar de semana limpia los filtros de días anteriores.
- La matriz usa tipos de celda según el dato: finca y referencia se cambian con selector en la propia celda; los días aceptan una cantidad numérica positiva; el total es cálculo de solo lectura; los avisos de validación son indicadores. La fecha sigue en un control de calendario. La edición de finca y referencia afecta a todas las asignaciones agrupadas de esa combinación y evita duplicar otra combinación existente.
- El menú contextual quedó para acciones secundarias de la combinación: ver datos detallados, ir a un día mediante submenú, copiar finca/referencia o quitar la fila con «Deshacer». Se abre con clic derecho, Mayús+F10 o un botón visible en móvil; conserva teclado y «Volver» en móvil. Es un adaptador local del patrón propuesto para Materiales, no un componente publicado de la Librería Web.
- Tras otro feedback se eliminó la columna de acciones de la matriz: en escritorio el menú se abre con clic derecho sobre finca/referencia o Mayús+F10 en la fila; en móvil queda un botón «⋯» dentro de la celda de finca. Los siete días y el total caben sin desplazamiento horizontal en el viewport de revisión.
- Al crear una asignación en otro día se heredan los metadatos de la misma combinación como hipótesis de la propuesta. El producto debe confirmar esta semántica antes de integrar.
- La validación marca como bloqueo una fecha de corte fuera de la semana elegida. Al cambiar de semana, las asignaciones anteriores siguen visibles en el editor detallado y la matriz de la nueva semana muestra sus celdas vacías y el estado por corregir; no traslada fechas de forma implícita.
- El control de fecha del editor detallado y el localizador semanal usan calendario nativo. «Palés» y «Modificación» son los términos visibles; los nombres `pallets` y «Cantidad Pallets» se conservan solo como campos técnicos o etiquetas del CSV de origen.
- El aviso inicial aparece sin versión y la primera modificación como Versión 1, según el criterio recibido. Sigue pendiente resolver la diferencia con el backend, que persiste el inicial como versión numérica 1.

## Composición y alcance del patrón

- Forma de tarea: formulario de planeación con matriz de captura; pantalla maestra: la vista existente `crear-aviso-corte.html`. Fuente funcional: los ocho criterios de la imagen adjunta y el contrato de producto ya registrado arriba. Se conserva el shell, las cards, la jerarquía de acciones, los tokens y el resumen de impacto.
- Anatomía: contexto del aviso, fuentes, matriz semanal editable, filtros, editor detallado, validación, impacto y acciones de borrador/publicación. Estados comprobables: precarga, vacío por filtros, asignación incompleta, bloqueo, publicado y solo lectura. La paginación no aplica a esta matriz de edición.
- Patrón: `feature-local` en la propuesta. Alternativa descartada: exigir el menú para programar o quitar cada día; ocultaba la operación principal y confundía la captura. El menú agrupa solo acciones secundarias, mientras el editor conserva los campos extensos.
- Motion: entrada breve de 105 ms con puntero, inmediata con teclado; submenú compacto en móvil y sin animación con movimiento reducido. No anima el valor de las celdas, para que la edición frecuente no retrase el trabajo.
- Delegación: `SELF`. Slice transversal de HTML, CSS, JavaScript y revisión visual dentro del mismo checkout de propuesta, con cambios locales ajenos; exportar el estado para un worker independiente tendría costo similar al trabajo directo.

## Límite de validación

Los datos de esta propuesta son ilustrativos y los borradores se guardan en `localStorage`. No hay consultas ni mutaciones reales a la API desde estas páginas HTML. La alineación visual con el producto no implica integración, publicación ni QA funcional. La eliminación al vaciar una celda, la herencia de metadatos y la correspondencia de versiones requieren decisión funcional para producto.

## Evidencia local

`output/cut-notice-header-filters-final-desktop.png`, `output/cut-notice-table-header-filters-mobile.png` y `output/cut-notice-inline-tools.png`. En navegador se comprobó precarga de tres combinaciones, ausencia de los dos desplegables, filtros de finca y referencia desde los encabezados de ambas tablas, sincronización de filas y contadores, estado sin resultados con recuperación, edición de cliente en el detalle, visibilidad de días y restablecimiento. A 390 px y 1440 px no hubo desbordamiento horizontal de la página. `node --check` y `git diff --check` pasaron. La propuesta sigue pendiente de revisión visual y de decisiones de contrato antes de llevarla al producto.
