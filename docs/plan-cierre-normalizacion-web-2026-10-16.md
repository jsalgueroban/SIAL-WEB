# Plan de cierre de normalización Web

Fecha: 2026-10-16. Base: 101 HTML (100 vistas y un catálogo técnico). Este inventario mide estado de verificación, no porcentaje de implementación. «Por auditar» puede incluir componentes ya adaptados; «Parcial» confirma trabajo pendiente. Ninguna etiqueta acredita cierre visual o funcional por sí sola.

## Distribución actual

| Módulo o familia | Por auditar | Parcial | React / otro |
| --- | ---: | ---: | ---: |
| Materiales y Suministros | 0 | 18 | 1 React auditado parcialmente |
| Transporte | 10 | 10 | 2 React |
| Planeación | 7 | 0 | 0 |
| Operaciones Puerto | 3 | 4 | 0 |
| Trazabilidad | 4 | 0 | 0 |
| Fincas | 1 | 8 | 0 |
| Usuarios | 2 | 4 | 0 |
| Empresas | 0 | 9 | 1 índice auditado, shell pendiente |
| Login, Errores, Changelog e índices generales | 16 | 0 | 0 |
| Catálogo técnico `shared/componentes.html` | 0 | 0 | 1 fuera del cierre de vistas |

Total: 43 por auditar, 53 parciales, 3 React y un índice de Empresas con shell pendiente. El catálogo técnico no es una vista de producto. Las 19 rutas de Materiales tienen revisión técnica inicial, pero ninguna se declara normalizada: las diez bandejas y los ocho flujos no React continúan parciales y Categorías React requiere el gate funcional completo. Véase la matriz de Materiales del 16/10.

## Ataque por bloques

1. **Triage verificable por vista.** Confirmar familia (tabla, formulario breve/mediano/grande, detalle, dashboard, autenticación o estado), controles realmente montados, origen funcional/HU y excepciones. Pasar de «Por auditar» a «Parcial» o «No aplica justificado» solo con evidencia; no copiar composición entre familias.
2. **Bandejas repetibles.** Cerrar por módulo las tablas de consulta y catálogos: búsqueda/filtros, contador, `Table`, `Chip`, iconos, `Pagination`, exportación, detalle y acciones. Revisar vacío, filtros combinados, cambios de página y 390 px. Priorizar los 18 de Materiales y los 7 de Planeación, donde hay mayor volumen sin inventario de runtime; las tres vistas Puerto restantes se clasifican antes de adaptación porque no todas son catálogos.
3. **Flujos especiales y formularios.** Tratar por separado editor masivo de Programación, plan operacional, documentos, registros grandes, trazabilidad, login y errores. Aplicar componentes de librería en cada campo equivalente sin imponer anatomía de tabla; mantener lógica propia y justificar controles nativos o nuevos patrones.
4. **Cierre de los 35 parciales y tres React.** Recorrer captura válida/inválida, estado, permisos, exportación, teclado, contraste, responsive y navegación. Comparar con la librería y el producto real donde corresponda. No cerrar una vista solo porque el adaptador React monta.
5. **Gate final.** Inventario de 101 rutas sin omisiones, decisión de componente por vista, `build:ui`, contexto, enlaces y gate runtime ampliado a las familias representativas; revisión visual de John antes de publicación. Cerrar la tarea global solo con el gate y la publicación aprobada.

Cada bloque debe registrar rutas tocadas, componentes consumidos, excepciones, evidencia de interacción y deuda pendiente. Los indicadores de avance serán vistas con gate completo y defectos abiertos, no solo cantidad de archivos editados. Decisión de delegación: `SELF` para esta planificación/inventario y para el bloque compartido de Materiales; las vistas dependen del mismo renderizador y estado local, por lo que separarlas añade costo de coordinación sin slice independiente útil.
