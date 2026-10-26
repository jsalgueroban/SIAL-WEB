# Normalización Web — bandejas de Transporte

Fecha: 2026-10-15. Estado: bloque local y parcial; no acredita aprobación funcional ni publicación.

## Decisión

`gestion-tipos-empresa` es catálogo breve con alta embebida. `gestion-vehiculos` es bandeja maestra con registro dedicado. `relacion-empresa-tipo` y `relacion-conductor-licencia` son bandejas relacionales con alta breve. Las cuatro reutilizan los controles de `@banasandev/banasan-ui` 1.4.0 mediante el adaptador existente: búsqueda, filtros, contador, tabla, chips de estado, acciones, paginación y detalle lateral. La anatomía de los formularios no se igualó a la de las tablas.

En tipos de empresa, el campo del formulario breve y sus botones consumen la librería; el mensaje de éxito se dejó inline y el aviso de regla encima de la tabla usa `Notice`. En las dos relaciones, los selectores y botones de alta usan componentes publicados, mientras la fecha nativa en conductor-licencia y las reglas de unicidad siguen siendo locales. Se sustituyeron sus banners de regla y sus mensajes internos por `Notice` externo e información inline, respectivamente. En vehículos se retiraron cuatro métricas de demostración incompatibles con las tres filas visibles. Se conservan sus cinco filtros y el enlace al registro dedicado. No se tocó la librería ni se añadieron datos o rutas ficticios.

## Evidencia y pendientes

`pnpm build:ui` y `validate-context.ps1` terminaron correctamente. Tras la extensión a las relaciones, `run-tests.ps1` volvió a pasar: 101 vistas Web y 53 Móvil, cero enlaces rotos y runtime gate sin incidencias en sus rutas piloto. En el servidor local `127.0.0.1:4175`, la tabla de vehículos montó tres filas, su filtro de tipo `CAMION` redujo tabla, contador y paginado a un registro. Tipos de empresa montó tres filas, `Table`, `Pagination` y `Notice`; el CTA abrió el formulario y allí se comprobó `TextInput` y dos `Button` publicados. El detalle de una fila abrió el `Drawer` publicado con el código correcto. Las relaciones montaron tablas de dos y tres filas con `Pagination` y sus formularios mostraron dos `SelectInput` y dos `Button` cada uno. A 390 px, la relación empresa-tipo y los cinco filtros de vehículos no desbordaron horizontalmente. Aún faltan pruebas de captura válida, acciones de estado, exportación, teclado, contraste y validación visual de John. Estos cuatro archivos no representan el cierre del módulo Transporte ni de la normalización Web.

Decisión de delegación: `SELF`, por cambios acoplados al adaptador compartido y a filtros locales; no hay un slice independiente que compense el traspaso de contexto. La tarea global de normalización permanece En Progreso.
