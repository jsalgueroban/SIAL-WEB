# Matriz de Planeación y aprendizajes aplicados

## Alcance y autoridad

Propuesta Web, perfil local. SELF: matriz y puente comparten estado local; se conserva el alcance visual y simulado. No se modifica backend, permisos ni paquete productivo. Gestión de semanas conserva aprobación del usuario. La revisión visual de esta matriz sigue pendiente.

Contrato inspeccionado: @banasandev/banasan-ui 1.4.0, TableColumn/TableProps y BaseInputProps/SelectProps. Table soporta columnas planas y renderizadores, pero no filas agrupadas de encabezado. Se mantiene una composición de tabla semántica local con colgroup, scope y encabezados agrupados; no se declara adopción de Table. Sus celdas consumen DateInput, SelectInput, NumberInput y TextInput publicados; estados Chip y acción IconButton. La paginación no se añade a esta matriz de captura: el conjunto permanece editable dentro del scroll acotado.

## Implementación

Composición React con claves estables por asignación/campo, puente hacia las reglas de la propuesta y actualización del snapshot de filas. Conserva foco y cursor durante recálculo, nombres accesibles vinculados a cada control, navegación Enter, foco de nueva fila, estados de validación y campos deshabilitados tras publicar. Columna de fecha ampliada para evitar recorte; controles mantienen dimensiones de librería. Artefactos de runtime regenerados y cache de recursos actualizada.

## Evidencia

- Build UI aprobado y diff --check sin errores.
- 1280/390: escribir GRUPO PRUEBA sin perder caracteres; elegir finca mediante SelectInput actualiza grupo a BANEX; agregar y eliminar fila 3→4→3. Sin desbordes ni errores JS capturados.
- Oscuro y movimiento reducido: inserción en mitad de ABCDE produce ABCDXE y conserva cursor en 5; Enter avanza a Sector; 12 palés × 54 recalcula 648 cajas; validación abre confirmación de publicación.
- Móvil: nueva fila enfoca fecha, nueve bloqueos impiden publicar fila vacía; eliminarla permite validar, confirmar publicación simulada y mostrar un Toast; campos quedan deshabilitados.
- Captura de escritorio revisada en output/planeacion-matrix-20261101.png; detectó fecha truncada y motivó ampliar su columna de 140 a 180 px.
- Gate transversal runtime terminó passed=true. Es cobertura de sus vistas piloto, no prueba de todos los estados de Planeación.

## Skill aplicada y evaluación conductual

Modificadas únicamente referencias validation.md y design-criteria.md de sial-design-proposals. Reglas existentes de Toast/Notice y adopción se refuerzan mediante recorridos, sin duplicar ownership en otras skills. Se añaden criterios de utilidad y alcance de indicadores, separación material/paleta y no promoción automática de dimensiones.

Quick validate aprobado. Suite: 30 skills, 266 archivos, cero errores y advertencias.

Casos evaluados: positivo, controles publicados alcanzados por interacción real y foco conservado; negativo, importar Table o pasar consola no aprueba una matriz local (permanece composición explícita); handoff, brecha de encabezados agrupados no elimina la semántica ni impide reutilizar inputs compatibles. Código vecino legacy sirve como puente de reglas, no como patrón nuevo. La referencia gris no sustituye tokens ni convierte cards de una vista en canon global.

Pendientes: revisión visual del usuario de la matriz; agrupación nativa en Table permanece una capacidad futura del paquete, no bloquea esta composición declarada. No se certifican todas las variantes de importación/corrección ni se publica suite o propuesta en este bloque.
