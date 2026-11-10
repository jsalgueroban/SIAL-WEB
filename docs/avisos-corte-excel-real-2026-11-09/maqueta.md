# Maqueta del aviso real · criterio de composición

Fecha: 2026-11-10. Plataforma `web`. Operación `evolve/build`, perfil `local`. Pantalla maestra: `Gestion de Planeacion/crear-aviso-corte.html`, formulario de planeación con matriz editable y detalle. Fuente funcional: ocho criterios del usuario, correcciones posteriores de esta conversación, producto `fe-sial-web/src/features/planning/cut-notices`, contrato `ms-sial/prisma/schema.prisma` y las cuatro hojas del Excel auditado en `auditoria.md`.

## Decisión

Se conserva la composición de captura aprobada: matriz semanal, filtros en los encabezados, detalle visible, calendario y menú contextual para gestiones secundarias. Después de la proyección de impacto se añade **una consulta de referencia del aviso real**, separada del borrador ilustrativo. Esta consulta tiene cuatro perspectivas sobre los mismos datos, equivalentes a las cuatro hojas: palés por finca, cajas por finca, consolidado por referencia y cambios por versión. Así se puede estudiar el Excel sin inventar campos ausentes ni mezclar sus totales con los de la edición.

La alternativa de copiar las cuatro hojas como cuatro tablas completas apiladas se descartó por densidad y pérdida de contexto. La alternativa de cargar las 329 combinaciones directamente en el editor se descartó porque el Excel no trae cliente, código/versionado de referencia ni sector por asignación y no puede convertirse en un borrador válido sin resolución de catálogos.

## Trazabilidad de criterios

| Criterio / evidencia | Sección y comportamiento | Estado |
|---|---|---|
| 1. Tabla tipo Excel precargada | Matriz editable existente; consulta del caso real en cuatro perspectivas con 329 filas actuales | Maquetado; carga real de XLSX pendiente de producto |
| 2. Finca y referencia por día hasta domingo | Matriz editable conserva siete días; caso real muestra las seis fechas presentes en el archivo | Maquetado; regla operativa dominical por confirmar |
| 3. Filtros en columnas | Encabezados de la matriz existente y de la consulta real: grupo, finca y referencia; 20 filas por página | Maquetado |
| 4. Celdas con tipos distintos | Selectores, fecha, cantidad y totales derivados en el editor; lectura sin edición en el consolidado | Maquetado |
| 5. Término “palés” | Encabezados, métricas y entrada semanal | Aplicado |
| 6. Calendario de fecha | Editor existente | Aplicado |
| 7. Corrección como modificación | Flujo existente de corrección, historial y resumen de cambios | Maquetado; contrato de persistencia pendiente |
| 8. Inicial sin versión → Versión 1 | Etiquetas actuales del editor; comparación real “Inicial” a V3 | Maquetado; backend usa inicial numérico 1 |
| Excel: `Resumen Pallets` y `Resumen Cajas` | Pestañas por finca/referencia, suma diaria y total; cajas derivadas | Conciliado con 3.520 palés y 192.021 cajas |
| Excel: `Resumen x Ref.` | Pestaña que agrupa las 53 referencias y permite abrir su desglose por finca | Conciliado con 3.520 palés |
| Excel: `Resumen Materiales` | Comparación de 335 combinaciones históricas, cuatro versiones y cambio V2→V3 | Conciliado; aclarado que no contiene insumos |
| Producto real | El detalle editable mantiene su estructura; datos del Excel son consulta de propuesta, sin mutación API | Representado; no integrado |

## Componente e interacción

El menú contextual de la consulta es una variante **feature-local**: clic derecho sobre fila, Mayús+F10 o botón `⋯`; ofrece subopciones para cambiar de perspectiva y filtrar la referencia. El menú contextual de edición permanece independiente. Las pestañas permiten teclado con flechas, Inicio y Fin. La tabla tiene encabezados visibles, filtro dentro de la columna, resultado vacío, totales del filtro, paginación y desplazamiento horizontal contenido en móvil. Motion: ninguno en cambios de tabla; prioriza rapidez de consulta. La API pública de Librería Web no cambia.

Los cuatro valores de cabecera provienen de la transcripción de las cuatro hojas a `sial-aviso-corte-real-46-data.js`; esta es una muestra local de solo lectura, no un servicio ni una capacidad de importación XLSX. La matriz editable se ajustó a `step=0.001` para representar medios palés del caso real y mantiene validación de cantidad positiva con hasta tres decimales.

## Evidencia y límites

`maqueta-desktop.png` y `maqueta-mobile.png` muestran la superficie. En navegador se verificaron pestañas, filtros, menú y submenú, navegación a la referencia, paginación, totales de palés/cajas/versiones, `0,5` palés en la matriz y ausencia de errores de consola. A 390 px no desborda la página; la tabla tiene desplazamiento propio. `node --check` pasó en los scripts afectados y `git diff --check` no encontró errores del cambio.

Pendientes de producto: traducción de versiones Excel↔backend, conversión/importación del XLSX consolidado, factor de cajas según versión de referencia, reglas de domingo y significado de `Corta`, `Second` y `Total Cajas 20 Kilogramos`. Los indicadores de sellos, cartones y transporte siguen siendo estimaciones ilustrativas, no datos certificados por este Excel.

### Corrección de la barra de filtros · 2026-11-10

El botón «Limpiar filtros» se comprimía entre la fecha y los siete días y partía su etiqueta y el contador. Se fijó su ancho al contenido y se permitió que los días pasen a una segunda línea cuando el ancho útil no alcanza. En móvil, la fecha y el botón ocupan líneas propias. Se verificó con un filtro activo a 990, 1440 y 390 px, sin desbordamiento ni pérdida de la acción de restablecer. Evidencia: `barra-filtros-corregida.png`. Decisión `SELF`: ajuste CSS local sobre la misma vista; sin API pública de Librería Web afectada.

Delegación: **SELF**. El slice depende de la maqueta local ya modificada, sus interacciones y un archivo operativo del usuario; exportar ese estado a otro worker no añade beneficio independiente. Estado de entrega: propuesta maquetada y verificada técnicamente, pendiente de revisión visual del usuario; no integrada al producto ni certificada por QA.
