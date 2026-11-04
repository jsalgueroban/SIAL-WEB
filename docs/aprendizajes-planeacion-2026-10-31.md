# Planeación: evolución de la normalización y de sus verificaciones

Gestión de semanas aprobada visualmente por John el 31/10/2026. La aprobación comprende composición, indicadores compactos con relieve discreto y tokens SIAL, eliminación del contexto exterior y secuencia al final. No acredita publicación ni convierte esa composición en plantilla de otras vistas.

## Diagnóstico y destino del aprendizaje

Evaluación SELF: análisis transversal con contexto histórico y runtime compartidos; transportar el contexto cuesta tanto como revisar directamente. Skills consultadas: propuestas SIAL, librería Web, Dona y gobernanza de la suite. Esta entrega analiza cambios de skills; no modifica ni publica la suite instalada.

| Corrección observada | Causa y regla existente | Ajuste recomendado y owner |
| --- | --- | --- |
| Componentes locales que parecían normalizados | validation.md ya exige evidencia por componente; faltó recorrer estados dinámicos | Ampliar evidencia runtime de propuestas: incluir diálogos, drawers, filas añadidas y resumen tras validar. Comprobar montaje visible, no solamente imports o clases. |
| Selectores no filtraban y escoba no aparecía | Se probó búsqueda pero no el evento real del selector publicado | En validación de propuestas, exigir selección real por cada tipo de filtro, combinación, limpieza, reinicio de página y entrada/salida. En el adaptador, comprobar el contrato input/change. |
| Tabla local y paginación omitida | Se confundió preservar datos con preservar implementación | En handoff de librería, documentar por separado capacidades de tabla, celdas y acciones. Una brecha en encabezados agrupados no justifica omitir Button, Chip o controles compatibles. No imponer paginación a matrices de captura ni a muestras deliberadamente limitadas. |
| Notice usado como éxito transitorio | La distinción Toast/Notice ya está escrita | Fortalecer caso conductual, sin duplicar prosa: una acción produce un único éxito transitorio; información persistente y validación accionable permanecen junto al contexto. |
| Tipografía desigual y bloques pegados | La revisión de geometría no cubrió estado con avisos visibles | Extender evidencia visual con título, etiqueta, cifra, ayuda, separación entre superficies y aparición de avisos. Revisar contenido real en ambos temas y móvil, no solo tamaños del viewport. |
| Cards grandes o grises ajenas al sistema | Se interpretó la referencia de material como paleta | En criterios de diseño: separar anatomía, material y color. Medir densidad con datos reales y utilizar tokens semánticos al integrar la intención seleccionada. |
| Resúmenes y estados que no aportaban | Los criterios ya prohíben decoración y redundancia | Evidenciar la pregunta de negocio que responde cada indicador y su alcance temporal. Eliminar datos redundantes; no convertir todo contexto en card. Ordenar información auxiliar después de la tarea principal cuando no sea necesaria para decidir. |
| Escritura interrumpida al recalcular matriz | Se verificó valor final, no escritura continua | Añadir escenario de edición con varias pulsaciones, conservación de cursor, foco y navegación después de recalcular o añadir filas. Owner de implementación: adaptador/frontend; owner del escenario de propuesta: validation.md. |
| Restricciones de sesión o permisos fuera de alcance | Se amplió una propuesta visual hacia producto | Mantener simulación declarada y recorridos accesibles. La validación visual no autoriza construir autenticación, permisos ni persistencia productiva. |

## Qué no promover como norma global

No fijar 88 px, dos indicadores, texto de 13 px, ausencia universal de iconos o secuencia al pie como reglas de toda SIAL. Son decisiones calibradas en una vista. El relieve es candidato de componente; requiere otro consumidor justificado y contrato de librería antes de promoverse. Tampoco convertir rebote solicitado en animación obligatoria para todo elemento: conservar finalidad y movimiento reducido.

## Casos para una futura modificación de la skill

- Positivo: filtrar mediante SelectInput, comprobar resultado y página, limpiar, comprobar salida de escoba y desplazamiento; abrir diálogo y comprobar componentes dinámicos.
- Negativo: importar Table, mostrar éxito mediante Notice y aprobar solo porque no hay errores de consola debe mantener el gate pendiente.
- Handoff: matriz agrupada no soportada por Table produce contrato explícito de brecha (encabezados, edición, foco y scroll), conserva controles compatibles y no aplana la estructura para declarar adopción.
- Regresión de diseño: una referencia con sombra gris no reemplaza los tokens de identidad; una card aprobada no se replica sin dato útil.

## Avance y pendientes de las otras vistas

Se comprobaron los estados iniciales de Avisos, Crear aviso, Consultar aviso, Generación y Cintas a 1280/390 sin desbordamiento documental ni errores JS capturados. Esto no certifica todos los recorridos ni reemplaza revisión visual.

En Crear aviso se corrigió la pérdida de foco/cursor al reconstruir filas, se añadieron nombres accesibles por campo y fila, y el botón dinámico de publicación del resumen usa Button publicado mediante el adaptador. Escritura continua de GRUPO PRUEBA conserva foco en ambos tamaños; Validar aviso monta Button y conserva el resumen. Sintaxis JS y diff de los archivos modificados comprobados.

Pendiente principal: resolver la matriz agrupada y sus controles locales mediante contrato con librería, verificando API actual antes de elegir composición. Después: recorrer edición, importación, recuperación de borrador, confirmación y publicación simulada con componentes y foco; revisar visualmente esos estados junto con consulta, generación y catálogo. No se declara completo el módulo ni implementada la brecha de Table.
