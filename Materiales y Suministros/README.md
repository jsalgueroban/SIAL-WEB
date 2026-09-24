# Materiales y Suministros - Propuesta UI/UX SIAL

Modulo orquestador para pedidos de materiales, inventario en finca, pallets, ordenes de transporte de insumos, proveedores externos, entregas y POD.

## Historias cubiertas

- `HU659`: pedido sugerido por finca desde aviso de corte.
- `HU662`: consulta de stock por finca y material.
- `HU666`: pedidos adicionales asociados a semana, finca y pedido base.
- `HU667`: segmentacion documental en RPT, remision o reserva.
- `HU546`, `HU669`, `HU670`, `HU532`: ordenes de transporte y notificaciones.
- `HU668`: resumen digital para proveedores externos.
- `HU681`, `HU682`, `HU547`: entrega movil, POD, foto/firma y recepcion.
- `HU826`: maestra de materiales y configuración por referencia.
- `HU559`, `HU560`: pallets completos e incompletos.
- `HU607`: enlace contextual hacia Seguridad / Auditoria Operativa.

## Vistas

- `index.html`: tablero operativo del modulo.
- `gestion-pedidos-materiales.html`: pedidos sugeridos, adicionales y estandar.
- `inventario-materiales-finca.html`: existencias por finca y material, con disponible, reservado, total informado y acceso al historial.
- `movimientos-inventario.html`: historial de entradas, salidas y ajustes, con filtros por material, tipo y fechas.
- `inventario-pallets.html`: pallets completos y mochos.
- `ordenes-transporte-insumos.html`: ordenes de transporte y notificaciones.
- `resumen-proveedores.html`: generacion y envio digital a proveedores externos.
- `seguimiento-entregas.html`: entrega, POD y evidencia consultable.
- `trazabilidad-pedido.html`: consulta focalizada del recorrido integral de un pedido en siete estados, con estado actual protagonista y vehículo animado que avanza por la ruta operativa.
- `gestion-materiales.html`: catálogo de materiales (código SAP, nombre, unidad de medida y estado).
- `recetas-materiales.html`: recetas por combinación Referencia + Versión y cantidades sugeridas por caja.
- `gestion-proveedores.html`: maestra minima de proveedores.
- `reglas-documentales.html`: reglas para clasificacion documental.

## Reglas de propuesta

- La matriz completa de canales y responsabilidades está en [`MATRIZ_HU_CANALES.md`](./MATRIZ_HU_CANALES.md): web concentra planeación, maestros, gestión, notificaciones y consulta; móvil concentra ejecución/captura en campo, offline y POD cuando la HU lo exige.
- La web no duplica formularios de recepción, foto, firma ni outbox móvil. En entregas/POD solo consulta, gestiona y audita; la captura efectiva permanece en la app móvil.
- HU660 no aplica porcentajes ilustrativos: cualquier cambio de cantidad queda bloqueado hasta publicar la matriz oficial de tolerancias, sugerido cero y aprobador.
- HU666 admite múltiples solicitudes por pedido base, cada una con motivo, actor, fecha y clave de idempotencia; no se impone un máximo automático.
- HU662 muestra existencias por finca con saldo disponible, reservado y total informado; no permite editar un número de stock libre y enlaza su historial de movimientos.
- HU826 separa el catálogo de la receta: la receta se identifica por Referencia + Versión y sus líneas conservan la cantidad sugerida por caja.
- El modulo no reemplaza Seguridad, Transporte ni Pallets; los orquesta y enlaza cuando corresponde.
- Los archivos manuales externos no son el mecanismo principal de coordinacion; se simula envio digital con auditoria.
- Las maestras cortas usan formulario embebido.
- Los listados conservan busqueda, filtros, contador, exportacion, paginacion y drawer lateral.
- La conexion backend queda pendiente; los payloads conceptuales deben derivarse de las HU.
