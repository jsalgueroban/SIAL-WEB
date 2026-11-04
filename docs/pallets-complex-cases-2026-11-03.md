# Pallets: casos complementarios — 2026-11-03

## Alcance y decisión
SELF: contraste de dos repositorios con sesión autenticada local; no hay slice independiente que justifique delegación. Perfil web, continuidad de la composición aprobada. Skills: sial-design-proposals (estructura contextual), sial-web-library modo consumo (API instalada), Dona (seguimiento). No se modifica producto ni librería productiva.

## Contraste
Fuente de código: fe-sial-web/src/features/pallets/traceability/components/pallet-traceability-event-detail.tsx y pallet-build-detail.tsx; utilidades y constantes de la misma feature.
Consulta real: /admin/pallets, todas las fincas y semanas. Los filtros de fase actual Pallet rearmado y Cargado en camión no devolvieron registros. Esto no demuestra ausencia de esos eventos históricos. Las descargas 353970050177492747 y 353970050177492846 muestran Sin novedad, OP-C042A898, radicado 64 y cinco eventos. Se conserva el caso real 353970050177452895 incorporado previamente.
Los cuatro casos nuevos son SIMULACIONES, identificadas en su encabezado, basadas en el contrato del código. No se presentan como extracción de producción.

## Casos revisables
- 177012345678900101: rearmado receptor; origen de 30 + 24 cajas, composición 54.
- 177012345678900118: rearmado donante; 30 cajas evacuadas hacia el anterior y 18 en contenido actual. Las cajas del movimiento no se confunden con las actuales.
- 177012345678900132: descarga de camión con novedad; motivo Embalaje dañado, observación completa y contexto de vehículo. Evento anterior permite revisar inicio/fin de cargue.
- 177012345678900149: cargue de camión con inicio, fin, vehículo, radicado y conductor.

## Composición / consumo
FlowTimeline connected, Chip, Button y Table se importan de @banasandev/banasan-ui 1.5.0 instalado. La bandeja conserva adaptadores de tabla, filtros y paginación. Los facts, transferencias y observaciones son composición de feature, no componentes nuevos promovidos.
La ubicación sólo aplica estilos a su etiqueta directa; ya no sobreescribe spans del Chip. Con novedad conserva indicador 6x6 y tono warning. En finca utiliza inactive, tono neutro soportado por tipos. Observación sola a ancho completo; sin cards por dato. Se omite fecha duplicada del evento cuando existen tiempos de cargue.
No se añaden acciones de escritura, confirmaciones ni toast a una consulta de detalle. Se conserva exportación existente.

## Verificación
- Build Vite con RAYON_NUM_THREADS=1, sintaxis JS y diff check.
- Cuatro casos abiertos; selección de evento anterior limpia novedad y muestra tiempos propios; tablas de composición renderizan cantidades y versiones.
- Filtro Pallet rearmado devuelve dos filas; limpiar restaura 11 registros. Segunda página muestra el chip Con novedad señalado por el usuario.
- Chip comprobado en DOM: marcador 6x6, color warning y estilo propio sin override local.
- Ancho 390: detalle 349px, scrollWidth349, recorrido y detalle a una columna317px; viewport restaurado.
- Sin errores de consola en la revisión. Transición local 200ms y regla prefers-reduced-motion conservadas.

## Pendiente
Revisión visual del usuario. El contraste runtime de rearmado/cargue/novedad necesita un caso real con esos datos si se requiere equivalencia de registros; el soporte visual se verificó con simulaciones explícitas y el contrato del código real.
