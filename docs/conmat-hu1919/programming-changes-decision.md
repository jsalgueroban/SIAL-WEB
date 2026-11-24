# HU1919 CA-05 · Cambios de programación

24 de noviembre de 2026. Propuesta Web local, sin publicación. Continuidad de la agrupación y ventana compacta aprobadas. Acceso: Transporte → Agrupación de rutas → Cambiar programación. Se mantiene el contexto de ruta y selección, sin nueva bandeja ni drawer. Forma formulario/revisión; vía reuse. SELF según programming-changes-brief.md.

## Cobertura de la propuesta

| Criterio | Representación |
|---|---|
| Cancelar una o varias órdenes sin afectar las demás | Checkboxes de órdenes vinculadas; revisión y confirmación; libera sólo las seleccionadas |
| Anular un viaje completo | Selector de viaje activo, estructura conservada con etiqueta Anulado, órdenes liberadas, edición e incorporación bloqueadas |
| Reprogramar ruta, subgrupo u órdenes | Alcance explícito, nueva fecha, fecha efectiva individual; conserva agrupación |
| Motivo y estados diferenciados | Motivo obligatorio; Cancelada, Anulado y Reprogramado en revisión/historial; la orden conserva por separado su estado Preasignada/Programada |
| Totales y disponibilidad | Derivación desde pertenencia única, sin borrar órdenes ni cantidades; canceladas/anuladas disponibles en la empresa original |
| Comunicación y restricciones | Aviso si la ruta está asignada y registro Pendiente de comunicar; ejecución/finalización bloqueadas |

Cancelar la programación no cancela la orden original. Se asume que las órdenes demo liberadas continúan vigentes. La vigencia real, entrega de notificaciones y permisos requieren integración productiva y quedan fuera de esta propuesta. Reprogramar exige fecha distinta, sin imponer una regla definitiva de antelación. Antes de confirmar se revalida alcance y selección para detectar cambios de composición. No se simula envío exitoso a la transportadora.

## Componentes y persistencia

Todos los controles nuevos importan el snapshot banasan-ui-conmat existente: Button, SelectInput, CheckboxInput, DateInput, TextInput, Table, Chip, KeyValueGrid y Notice; ToastProvider del workspace confirma el resultado. ConmatFloatingView sigue como contenedor feature-local por la brecha de modal genérico ya registrada. Sin cambios en la librería. La tabla de revisión es una matriz finita del alcance, no una nueva bandeja paginable. Las opciones de checkbox desplazan internamente cuando hace falta. No hay chips globales de registros ni iconos decorativos añadidos.

El estado conserva version2 y es compatible con las sesiones anteriores. Campos locales de demostración: programmingStatus, plannedDate por orden/subgrupo y motivo/estado/comunicación en evento. No constituyen DTO. Regresar o cerrar antes de confirmar no escribe. Al reagrupar se elimina la fecha individual anterior y el marcador de programación anterior; su historial permanece. El panel cuenta las órdenes por su fecha efectiva en cada semana, por lo que una reprogramación parcial entre semanas no arrastra las demás órdenes. La consulta de órdenes muestra último cambio y motivo en el historial.

## Evidencia ejecutada

- Build Vite correcto y script check-conmat-demo.mjs: motivo, selección obsoleta, compatibilidad, cancelación parcial, totales, reprogramación por orden/subgrupo/ruta, fecha inválida, anulación y bloqueo; regresión de fixtures/migración previa.
- Navegador aislado: cancelar OS-04812 de R-001 conserva las otras dos, revisión no escribe, historial contiene motivo. Anular Viaje1 libera sus tres órdenes, conserva estructura y deshabilita nuevo subgrupo. R-003 en ejecución bloquea Cambiar programación. Detalle de orden muestra motivo.
- Móvil390×844: reprogramar OS-04812 al 28 nov conserva fecha de las demás y de ruta. Diálogo366px, scrollWidth365px, sin overflow del contenedor. Captura changes-review-mobile.png inspeccionada.
- Escritorio1440×1000: captura changes-review-desktop.png inspeccionada; Tab desde confirmar vuelve a cerrar. Checkboxes operables con Space; selectores y calendario nativos publicados operables en portal.
- Cruce semanal: reprogramar OS-04812 al 30 nov muestra R-001 con una sola orden y finca El Rubí en semana49 del panel. Las otras conservan semana48. Recorridos de anulación sin errores JS.

Gates semántico e interacción del alcance ejecutados; revisión visual local realizada en ambos tamaños. Aprobación visual del usuario pendiente. No certifica toda la HU ni QA productivo. Seguimiento operativo Ares: tarea 17a3040d-216b-4466-9656-87006790d12e.
