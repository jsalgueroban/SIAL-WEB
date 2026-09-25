# Mapeo HU — Gestión de materiales

Fecha de corte: 2026-08-26 (America/Bogota). Plataforma de administración: **Web**.

## Decisión de canal

La HU826 indica Web para gestionar materiales y recetas; móvil solo expone consulta cuando el rol operativo la requiere. Por tanto, las cuatro vistas de este alcance son web. La consulta móvil `materiales/inventario-finca.html` conserva su responsabilidad complementaria para HU662.

## HU modificada

**HU826 — Gestionar materiales y su configuración por referencia** está en `In Progress` (revisión 15). El alcance actual se debe interpretar con el insumo funcional recibido para UX:

| Tema | Criterio histórico | Alcance vigente para las vistas |
| --- | --- | --- |
| Catálogo | Categoría, subcategoría, nombre y código de ítem | Código SAP, nombre, unidad de medida y estado |
| Configuración | Versión de referencia con cantidades por caja y por pallet de 48/54 | Receta por combinación **Referencia + Versión**, varias líneas de material y cantidad sugerida por caja |
| Inventario | Stock como condición de la configuración | Consulta de existencias y detalle; el stock procede de movimientos |
| Movimientos | No existía una vista propia | Historial de entradas, salidas y ajustes, filtrable y auditable |

No se trasladan categoría, subcategoría ni cantidades por pallet 48/54 a las nuevas vistas porque no aparecen en el alcance actualizado. Si siguen siendo reglas de negocio, Producto debe confirmarlas antes de incorporarlas.

## Trazabilidad de vistas

| Vista web propuesta | HU principal | Función y datos confirmados | Cobertura actual | Relación aguas abajo |
| --- | --- | --- | --- | --- |
| `gestion-materiales.html` (Catálogo) | HU826 | Listar, crear, consultar, editar y activar/inactivar materiales. Código SAP, nombre, unidad y estado. | Implementada: reemplaza el listado combinado. | Las recetas solo pueden seleccionar materiales activos; HU659/HU660 consumen la configuración resultante. |
| `inventario-materiales-finca.html` | HU662 | Código SAP, nombre, unidad, stock disponible, reservado y total; entrada al detalle de material. | Implementada: conserva el filtro de finca y enlaza el historial. | HU659 calcula pedido sugerido desde stock; HU660 valida el ajuste contra disponibilidad. |
| `aprobacion-pedidos-materiales.html` | HU2370 | Bandeja, cantidad entregable y decisión canónica por producto, justificación bloqueante, documentos asociados, TXT versionado y respuesta por rol. | Propuesta funcional con persistencia y archivos demostrativos locales; backend, ERP y almacén fuera de alcance. | Consume pedidos sugeridos, adicionales y estándar; entrega un compromiso lógico al despacho. |
| `pedidos-recurrentes.html` | Por asociar | Solicitudes operativas sin aviso de corte y aprobación directa de Materiales. | Propuesta funcional implementada con datos demostrativos. | Converge en las mismas reglas de decisión por producto. |
| `categorias-pedido.html` | Por asociar | Código, nombre, estado y auditoría de la categoría compartida. | Propuesta funcional implementada con persistencia local. | Una categoría activa por pedido y una por material. |
| `movimientos-inventario.html` | HU826 + insumo UX | Historial de entradas, salidas y ajustes: material, tipo, cantidad, fecha, motivo y usuario. Filtros por material, tipo y rango de fechas. | Implementada como vista dedicada. | Es la fuente de trazabilidad del stock de HU662; no permite editar el stock como cifra libre. |
| `recetas-materiales.html` | HU826 | Crear, consultar, editar y activar/inactivar receta por **Referencia + Versión**. Múltiples materiales con cantidad sugerida por caja. | Implementada como vista separada. | HU659 usa la receta vigente para el pedido sugerido; HU1040 la consumirá para cálculo de materiales y cajas. |

## Relación entre HUs

```text
HU826: catálogo + recetas ─┐
                           ├─> HU659: pedido sugerido
HU662: inventario <────────┘
    ▲
    └── movimientos de inventario (alcance trazable de HU826)

HU660 valida ajustes contra receta e inventario.
HU1040 consume la receta para calcular materiales y cajas.
```

## Reglas que guían la propuesta

- El stock debe ser derivado de movimientos; no se edita como número libre.
- La receta se identifica por `Referencia + Versión`; un material puede repetirse en recetas diferentes, pero no duplicarse dentro de la misma receta.
- Los materiales inactivos no deben ser seleccionables al crear una receta nueva.
- La activación/inactivación y cada movimiento requieren el usuario, fecha y motivo que exige la trazabilidad de HU826.
- El total de stock se muestra como dato recibido/calculado por el backend. La fórmula exacta entre disponible, reservado y total no está definida en las HUs ni en el insumo UX; no se debe asumir en interfaz.

## Brechas y decisiones pendientes

1. Confirmar el alcance geográfico del inventario: HU662 habla de finca y el nuevo insumo lo plantea por material. La vista debe conservar el filtro de finca/ubicación mientras Producto confirme si habrá stock consolidado.
2. Confirmar los estados válidos de material y receta, además de Activo/Inactivo.
3. Confirmar si vigencia, desperdicio, sustitutos y redondeo —mencionados por HU826— son campos de la receta inicial o una fase posterior. No se muestran como obligatorios sin esa definición.
4. Confirmar el contrato del total de stock para no presentar una suma que contradiga reservas, daños o ajustes.

## Delta de implementación en la propuesta

- `gestion-materiales.html` se convirtió en catálogo puro y la receta se extrajo a `recetas-materiales.html`.
- `inventario-materiales-finca.html` incorpora el contrato visual de disponible, reservado y total informado, conservando el contexto de finca.
- `movimientos-inventario.html` implementa el historial dedicado y se enlaza desde inventario.
- Navegación y documentación de trazabilidad actualizadas el 2026-08-26.
