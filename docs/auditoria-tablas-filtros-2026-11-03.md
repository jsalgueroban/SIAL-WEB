# Análisis de tablas y movimiento de filtros

Fecha03/11/2026. Web, audit. Muestra: Semanas, Empresas y Avisos de la propuesta; contraste runtime con Semanas del proyecto real y fuente de FilterToolbar. No es inventario integral ni QA de HU. Sin edición de UI, reglas de negocio o librería. SELF: medición de runtime local y lectura de fuentes relacionadas; no aporta independencia delegar el mismo contexto.

## Conclusión

La consistencia base de Table ya existe. Las diferencias relevantes están en jerarquía de datos, composición de filtros y coreografía. El piloto FilterToolbar adoptó duraciones pero simplificó geometría, rebote y adaptación. Conviene calibrar esas dimensiones antes de expandirlo a más bandejas. No hay evidencia para rehacer Table completa.

## Mediciones y anatomía

Mediciones a1280px, tabla visible, con13px de texto/19.5px de línea,12px en encabezado,16px de padding horizontal y56px por fila en las muestras. Semanas propuesta y real: tabla1143.33px; misma densidad base.

| Muestra | Composición visible | Diferencia relevante |
| --- | --- | --- |
| Semanas propuesta |6 columnas: Semana, Período, Mes, Cinta, Estado, Acciones |Identidad SEM-2026-01, fechas juntas y mes en texto facilitan lectura |
| Semanas real |9 columnas: Semana, Año, Mes, Inicio, Fin, Cinta, Estado, Auditoría, Acciones |Separación de fechas y año/mes numéricos aumenta el esfuerzo de lectura; la información de auditoría ya existe también en Drawer |
| Empresas propuesta |8 columnas: Código, Empresa, NIT, Roles, Alcance, Estado, Auditoría, Acciones |Es una familia de composición distinta de Semanas; no conviene imponer el mismo esquema de columnas |
| Avisos propuesta |7 columnas; código/responsable, tipo/versión y fecha/nota en dos niveles |Permite más contexto manteniendo fila56px; notas se truncan visualmente y deben poder consultarse por la acción de detalle |

Propuesta y aplicación usan Table de librería; Semanas/Empresas de propuesta pasan por el adaptador LinkedFamilyTable y Avisos por CutHubTable. La propuesta conserva tablas nativas ocultas como proxy; ese puente no debe trasladarse al frontend conectado. Las keys derivadas de índice/texto del adaptador son una limitación del prototipo; el proyecto debe mantener IDs reales estables.

Recomendación de composición para Semanas: identidad de semana y período juntos, mes legible y auditoría detallada en Drawer, manteniendo datos disponibles. Esto es propuesta de jerarquía y requiere valorar las necesidades reales de consulta; no se eliminan campos ni se cambian períodos/fechas del backend por los datos de demostración.

## Filtros: diferencias medidas

Semanas1280px, barra1095.33px:

| Estado | Propuesta: búsqueda / tres filtros | Piloto actual: búsqueda / tres filtros |
| --- | --- | --- |
| Reposo |507.33 /180/180/180px |423.73 /211.86/211.86/211.86px |
| Con limpiar |387.33 /200/200/200px +44px |401.33 /200.67/200.67/200.67px +44px |

La propuesta abre espacio reduciendo mucho la búsqueda y ensanchando selectores. El piloto reduce todos los campos proporcionalmente y mantiene anclada la acción a la derecha. Es una composición distinta, aunque ambas transiciones nominales duren520ms.

Los filtros de la propuesta tienen etiquetas persistentes y barra de unos71.5px; el piloto44px usa principalmente placeholders/valor. Al escribir, la búsqueda pierde la pista visual de su propósito. Etiquetas y proporciones merecen calibración antes de extender el patrón.

## Coreografía original y adaptación

Fuente `shared/sial-filter-motion.js`:

- Cambia sólo cuando aparece/desaparece limpiar; no anima resultados ni cada cambio entre valores ya activos.
- Campos: FLIP con translate/scaleX,520ms y sobrepaso9% al68% de la frase. Puede estirar temporalmente el texto porque escala todo el campo.
- Escoba: entrada480ms desde−16px/.78, pasa por+3px/1.08 y termina en0/1. Salida180ms mediante clon inerte temporal.
- Captura global de input/change/click/keydown y mide todas las barras, incluso para soportar opciones renderizadas en portal. Puede programar trabajo redundante y depende de un requestAnimationFrame para observar el commit. Riesgo de arquitectura, no fallo de rendimiento medido en esta revisión.

Fuente librería `filter-toolbar.css`/`filter-toolbar.tsx`:

- Interpola columnas del grid520ms y gap, sin escala del texto.
- Entrada480ms desde−6px/.9 y sin sobrepaso; salida180ms. El gesto resulta más discreto que el original.
- Acción de44px estable; inactiva invisible/inert/fuera del teclado y limpiar devuelve foco al primer control. No añade listeners globales ni clona nodos.
- Respeta reduced motion por CSS; la propuesta lo consulta por matchMedia. En esta revisión la preferencia efectiva era false: no se certifica la rama de movimiento reducido.

Recomendación: recuperar una entrada corta con sobrepaso suave exclusivamente de la escoba; mantener campos sin deformación; distinguir aparición, salida y actualización de resultados. No añadir rebote de filas por cada pulsación. Si hay consulta remota, preservar el encabezado y contexto de lectura y comunicar la actualización en una región discreta.

## Hallazgo reproducido: Roles se cuenta como filtro

Empresas1280px, búsqueda Banapalma: la acción Roles pasa de74.32px a200px al aparecer limpiar; la búsqueda pasa de621.99px a402.67px. `markFilterToolbar` cuenta todos los hijos visibles excepto la escoba y el CSS asigna una columna de filtro a Roles. Resultado: una acción de navegación se estira y comprime la búsqueda sin necesidad.

Separar grupos explícitos campos/acciones. Las acciones no deben participar en el cálculo de columnas de filtros. Captura: `D:/SIAL/Librerias/auditoria-filtros-empresas-propuesta.png`.

## Móvil y estados

A390px, Semanas propuesta con filtro activo: campos301.33px de ancho, una columna, barra364px con etiquetas y limpiar en fila propia; tabla900px con desplazamiento interno, sin desborde del documento. Semanas real activa: campos245.33px, barra212px, tabla1060px desplazable, sin desborde documental. El piloto reserva una franja lateral44px+12px durante toda la pila: reduce el espacio de cada campo aunque sólo use la escoba en el extremo inferior.

Para móvil conviene ancho completo de campos y acción al final; recuperar etiquetas con densidad ajustada. Un panel avanzado colapsable sería una decisión de diseño posterior, no una implementación implícita. No se debe convertir la tabla completa en tarjetas por defecto.

La propuesta actualiza conteo y paginación al filtrar y presenta vacíos. Los resultados cambian por filtrado, sin una animación de entrada/salida de filas. En Semanas se detectan varias regiones aria-live con conteos, incluyendo duplicación de paginación de los adaptadores: revisar el árbol accesible antes de añadir nuevos anuncios. No se probó un lector de pantalla; esto es un riesgo observado en DOM, no un fallo auditivo confirmado.

## Orden recomendado

1. Separar acciones de campos; corregir el estiramiento de Roles y definir composición por familia.
2. Calibrar FilterToolbar: etiquetas, proporciones, entrada con sobrepaso sólo en escoba y acción en fila propia en móvil.
3. Ajustar columnas de Semanas para lectura, conservando datos y detalles disponibles.
4. Mantener estable la identidad de filas, posición de lectura y estados de actualización/vacío; evitar anuncios duplicados.
5. Repetir recorridos teclado/táctil, cambios rápidos y movimiento reducido antes de expansión.

Evidencia: capturas locales indicadas, mediciones `tables-motion-audit-observations.json` en visualizaciones de esta sesión y fuentes citadas. Algunas mediciones etiquetadas960/mobile conservaron1280px en la pestaña de propuesta que estaba en segundo plano; se excluyen de conclusiones de móvil. La medida móvil de propuesta válida es proposal-weeks-mobile-active, width390. No se auditó toda la aplicación ni cada estado de tabla.
