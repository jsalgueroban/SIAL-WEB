# Auditoría de cobertura · HU1920 Web

Fuente: Azure DevOps HU1920, revisión 6, estado `New`, consultada el 27 de octubre de 2026. Alcance evaluado: propuesta Web local `Materiales y Suministros/control-trazabilidad-entregas.html`. Esta auditoría distingue demostración visual de cumplimiento operativo.

## Lectura de la lógica visual

La propuesta **sí expresa el núcleo de comparación** de la HU: aprobado, programado en Transporte, despacho confirmado como magnitud adicional y entrega con POD; muestra brechas por etapa y permite bajar a un caso con documento, orden y POD. El Aviso de Corte se usa como filtro/contexto versionado, según la decisión de composición, sin sumar sus cantidades a las de materiales.

La revisión operativa deja alertas como enlaces discretos bajo el título. Cuentan casos en el alcance de finca, aviso y búsqueda **sin ocultar otros materiales**; al elegir una se filtra la tabla y se oculta temporalmente la gráfica para no mezclar unidades. El detalle muestra viajes, vehículos y cantidades cuya suma coincide con `Programado`, además del exceso frente a lo aprobado. Se retiró el bloque de horarios por fuente: eran datos sintéticos que recargaban la lectura sin respaldar una decisión.

Así, la **fidelidad visual del escenario central** queda representada. La detección «en tiempo real» sigue siendo una condición de producto no acreditada: no hay actualización de fuentes, umbral de atraso ni recuperación ante falla. La propuesta tampoco valida la autenticidad del POD o de un evento de salida.

| Exigencia de la HU | Evidencia en la propuesta | Veredicto |
| --- | --- | --- |
| Consulta de supervisor/auditor sobre pedidos consolidados de materiales | Bandeja por caso, filtros, cuatro magnitudes y detalle. | Representada con datos ilustrativos; no hay consulta al producto ni control de acceso por actor. |
| Cantidad consolidada aprobada por Materiales | Indicador, curva y columna `Aprobado` alimentados por `approved`. | Representada; sin vínculo con la aprobación vigente ni documento versionado real. |
| Cantidad programada en vehículos por Transporte | Indicador, curva, tabla y detalle con viajes, vehículos y cantidad asignada; el fixture suma exactamente `programmed`. | Representada visualmente; las asignaciones son ilustrativas y no provienen de Transporte. |
| Cantidad entregada con POD en finca | Indicador, curva y columna `Con POD` alimentados por `delivered`; el detalle muestra un código POD. | Representada; no verifica que el POD exista, sea válido y corresponda a la cantidad recibida por línea. |
| Despachado por Transporte, citado en título y descripción | Indicador y columna de despacho confirmado. | Extensión de diseño solicitada; no hay evento efectivo de salida ni productor/contrato de cantidad identificado. No se equipara notificación con salida. |
| Avisos de Corte como fuente de planeación | Filtro y contexto versionado en el detalle. | Cubre el uso contextual acordado; no concilia una cantidad del aviso contra despacho. El criterio de aceptación detallado de HU1920 solo enumera las tres cantidades de materiales, programación y POD. |
| Detectar desvíos, pendientes y sobreasignaciones en tiempo real | Brechas, lecturas por caso y alertas transversales que filtran la tabla para sobreprogramación, entrega/POD pendiente y despacho sin confirmar. | Las alertas coexisten y llevan al caso; es demostración estática. No hay refresco, política de frescura ni falla de fuente. |
| Tipos de consolidado: RPT, remisiones, reservas, agros | El fixture contiene RPT, remisión y reserva. | `Agros` no está representado; no existe contrato de origen para normalizar todos los tipos. |

## Conclusión

La pantalla **sirve como propuesta visual operativa de la comparación**: indica qué revisar, permite localizar el caso y explica cómo se formó la programación en vehículos. **No acredita cumplimiento funcional de HU1920**: las cifras provienen de `materials-delivery-control-data.js`, la fecha de ejemplo es fija y los enlaces llevan a la vista de proceso sin abrir el registro sintético correspondiente.

Para cerrar la HU en producto se requiere acordar un contrato de agregación por compañía, finca, pedido/versión, documento, material y unidad; identificar el evento que confirma salida y sus cantidades; obtener la programación por vehículo/viaje; validar recepción y POD por línea; y definir frescura, permisos y comportamiento ante fuentes no disponibles. La propuesta puede entonces sustituir el fixture por datos verificables y probar desviaciones simultáneas, parciales y cero resultados. La fase móvil sigue separada según la secuencia de trabajo.

## Ajuste del 29 de octubre de 2026

Se incorpora un caso ilustrativo Agros con 100 KG reportados como recibidos, sin POD. La recepción reportada se muestra en el detalle y no se contabiliza como entrega con POD; la alerta también detecta una cantidad positiva sin identificador de soporte. La comparación cuantitativa de Avisos de Corte permanece pendiente de definición funcional: la HU no establece su unidad ni correspondencia por línea. El prototipo sigue sin conexión productiva.
