# Traza de normalización y publicación Web · 26/10/2026

## Estado verificable

La propuesta Web está en `origin/main` en `0db2b04`. El bloque de normalización se registró en `4d5a93b` (108 archivos) y se integró con la evolución interactiva de órdenes de transporte que ya estaba en `6160c1b`. La resolución conservó el arrastre de ítems completos y el restablecimiento de filtros. La rama y `main` remotos apuntaron a `0db2b04` tras la integración. No hay cambios versionables pendientes en el checkout al cierre de este registro.

**Publicación del código no equivale a normalización integral.** El build UI pasó; el inventario registró 102 rutas Web y cero enlaces internos rotos. El gate piloto informó componentes y geometría correctos a 1280 y 390 px, pero una ejecución posterior terminó con `EBUSY` al limpiar el perfil temporal de Chrome en Windows. Se recorrieron en navegador contenedores y órdenes de transporte a esos dos anchos sin desborde; en contenedores, la ayuda de formato queda en el campo del formulario y no aparece como aviso persistente sobre la bandeja. La revisión visual y funcional de cada ruta continúa pendiente donde la matriz la marca **Parcial**.

## Cambios trazados

| Frente | Decisión aplicada | Fuente de evidencia | Límite actual |
| --- | --- | --- | --- |
| Shell Web | Una raíz React consume el contrato sanitizado de navegación; conserva rutas, tema, expansión y vista activa. | `src/web/shell-navigation.jsx`, `shared/sial-navigation-contract.js`, gate de rutas. | Menú de producto y permisos reales siguen bajo autoridad de la aplicación. |
| Materiales | 19 rutas del inventario con montaje React directo y estado por flujo; la ruta adicional de configuración por referencia se registra aparte. | `docs/matriz-normalizacion-materiales-web-2026-10-16.md`, `src/web/materials-*.jsx`. | 0/19 con cierre integral documentado; no inferir aprobación visual. |
| Bandejas de otros módulos | Adopción de controles publicados donde preservan valor, evento y semántica; el adaptador subsiste en rutas no migradas. | `docs/cobertura-componentes-por-vista-2026-10-13.md`, `src/web/legacy-table-controls.jsx`. | Un proxy o import no prueba adopción directa. |
| Filtros | Escoba condicionada a criterios activos, en la misma barra; restablece búsqueda, selectores, fechas y página. | `docs/decision-limpiar-filtros-tablas-2026-10-26.md`, `src/web/table-filter-reset.jsx`, `shared/sial-filter-reset.css`. | Icono local atribuido; no se añadió a la librería productiva. |
| Transporte de insumos | La partición mueve ítems completos entre órdenes por arrastre, con alternativa de selección accesible. | `docs/decision-hu546-particion-2026-10-21.md`, `docs/hu546-distribucion-interactiva.md`. | Composición del flujo local; no constituye un patrón de tabla universal. |
| Lenguaje y feedback | Ayudas junto al campo; avisos persistentes solo para información operativa que requiere lectura continua. La copia visible explica la tarea sin mencionar HUs ni decisiones de implementación. | Vistas y decisiones de catálogo, formularios y pedidos. | Revisar cada texto de rutas aún parciales antes de declararlas terminadas. |

## Relación con la librería Web

La propuesta instala `@banasandev/banasan-ui@1.4.0`. `Button`, `IconButton`, `TextInput`, `SelectInput`, `NumberInput`, `DateInput`, `Chip`, `Notice`, `Toast`, `Table`, `TableRowActions`, `Pagination`, `Drawer` y otros exports aplicables se evalúan por **vista × componente**. El paquete gobierna API y tokens; la vista conserva estado, reglas, composición y datos. Las piezas locales se justifican por brecha semántica. No se modificó el código de la librería productiva en este bloque. El inventario público y las reglas de migración están en `docs/consumo-directo-libreria-web-2026-10-19.md`.

## Puertas pendientes

1. Completar recorridos de datos, cero resultados, error, filtros combinados, paginación, acciones, cancelación, teclado y foco de cada vista parcial.
2. Revisar composición visual y textos de las vistas intervenidas con referencia equivalente a 1280 y 390 px. El gate piloto es una muestra, no certificación del módulo.
3. Registrar aprobación visual por vista y mantener la tarea de normalización en progreso hasta satisfacer su criterio completo.

**ROUTER: SELF.** Registro y conciliación transversal sobre un checkout y runtime compartidos; delegar un fragmento aislado no aportaría una verificación independiente del estado publicado.
