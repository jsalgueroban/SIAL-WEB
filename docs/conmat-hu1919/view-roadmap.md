# Vistas de la propuesta CONMAT

Corte 24 noviembre2026. Inventario de propuesta UI, no avance funcional ni aprobación visual. La HU gobierna necesidades; esta descomposición de pantallas es una organización de diseño, no un número impuesto por la HU.

| Estado | Vista | Alcance |
|---|---|---|
| Construida local | Panel interno | Panorama semanal, estados, filtros y consulta resumida |
| Construida local | Órdenes y preasignación | Consulta, selección, preasignación y detalle |
| Construida local | Agrupación | Ruta/viaje/subgrupo/órdenes, materiales, historial y cambios de programación |
| Construida local | Portal de transportadora | Bandeja propia, pendientes, notificaciones y detalle de ruta, CA06 |
| Integrada en portal | Asignación operativa (formulario embebido) | Placa/conductor por ruta/subgrupo, habilitación, horario, conflicto y reemplazo con motivo, CA07; no pantalla independiente |
| Construida local | Seguimiento operativo | Estados, hitos, novedades, vehículo/conductor, consulta interna de solo lectura y transportadora, CA08; detalle embebido y estado compartido |
| Construida local | Cierre operativo | Bandeja, revisión embebida, condiciones, confirmación, responsable/fecha e histórico; separado del cierre documental, CA09 |
| Construida local | Soportes de transportadora | Carga/descarga local, validación de archivo, versiones, reemplazo tras rechazo, envío y consulta de estado documental, CA10 |
| Construida local | Revisión documental interna | Aprobar/rechazar versión vigente con observaciones, aviso a transportadora e habilitación administrativa diferenciada, CA10 |
| Construida local | Historial de rutas | Consulta transversal de operaciones, antes/después, motivo y responsable; detalle bajo tabla con patrón de pallets, CA11.3–4 |

Preasignación, creación/edición de niveles, cancelación/anulación/reprogramación y sus confirmaciones son flujos integrados; no se cuentan como pantallas independientes. Validación transversal local realizada: ver final-validation.md y matriz vigente de 102 criterios. La campana conserva bandeja anclada compartida; navegación por contexto y escenarios de carga/error están representados. Permanecen la aprobación visual final y las garantías de producto/backend indicadas en la matriz. No se requiere una vista de facturación completa; aprobar soporte no equivale a aprobar factura o pago.
