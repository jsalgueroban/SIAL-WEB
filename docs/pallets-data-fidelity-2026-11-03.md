# Fidelidad de datos de pallets — 2026-11-03

Continuación de la vista aprobada. SELF: contraste multirrepositorio y sesión local, sin beneficio independiente de delegación. Skills propuestas SIAL y librería web en consumo; Dona para seguimiento. No se modifica producto ni paquete.

Se retiran los seis ejemplos iniciales incompletos (SSCC177012345678900073,0066,0059,0042,0026,0019). La bandeja contiene dos casos reales contrastados y cuatro simulaciones marcadas tanto en la tabla como en el encabezado. Los filtros se construyen con las fases y semanas de esos seis registros.

## Evidencia real
Consulta autenticada en /admin/pallets, semana43, fase Descargado de contenedor. La búsqueda con Todas las semanas no devolvió resultados en esta sesión; semana43 sí permitió consultar los registros. No confundir un resultado vacío con ausencia de datos.

- 353970050177452895: EDKORG V1,54cajas,cinco eventos,OP-7724E616,radicado62.
- 353970050177492747: CLORFTFYMI13 V4,26cajas,incompleto,cinco eventos,OP-C042A898,radicado64.

Las transcripciones DOM de todos los detalles están en pallet-real-452895-events.json y pallet-real-492747-events.json. Se cotejaron los diez eventos en la propuesta.

## Cobertura
| Fuente real | Presentación |
|---|---|
| SSCC,finca,semana,referencia,versión | Encabezado y contenido actual |
| Ubicación,fase,operación,despacho,contenedor | Contexto actual |
| Orden,número,título,lugar,fecha/hora,estado del evento | FlowTimeline conectado |
| Estado actual / Completado | Chip del recorrido y del detalle |
| Lugar y responsable | Dos datos separados, mismo contenido |
| Contenedor,placa,radicado,conductor | Contexto del evento cuando existe |
| Registro asociado | Evento, conserva ARM u OP |
| Novedad,motivo,observaciones | Resultado de descarga según datos |
| Inicio/fin cargue | Evento de camión |
| Inicio/fin armado,responsable,número referencias,total cajas | Sección armado; responsable sin repetir si es el mismo |
| Referencia,versión,cajas | Table del paquete |
| Origen/destino cajas y observaciones del armado | Listas semánticas y párrafo, cuando existe |

Las simulaciones también incluyen armado en sus eventos de creación. No se inventan campos para los movimientos reales que no los traen. No se reproducen bloques duplicados del producto.

## Verificación
Build Vite y sintaxis correctos; diez eventos reales recorridos y cotejados con transcripciones. Sin cambio de orden/selección. Fases del paquete conservan composición y se agregan los estados del evento con API pública statusLabel/statusTone. Las simulaciones siguen identificadas. Entrega en revisión visual; no representa sincronización en vivo ni todos los 53 registros productivos.
