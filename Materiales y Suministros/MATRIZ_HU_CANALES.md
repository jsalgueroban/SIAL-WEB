# Matriz de responsabilidad web y móvil — Materiales y Suministros

Fuente: Azure DevOps `Proyecto SIAL`, contexto operativo documentado en Drive y catálogo local SIAL Web / SIAL Móvil.

## Regla de canal

- Web: planeación, configuración, gestión, notificación, consulta y seguimiento.
- Móvil: ejecución en finca/campo, captura de cantidades, evidencia, firma y operación offline.
- Ambas: la web gestiona o consulta y el móvil ejecuta; no se duplica la captura transaccional.

| HU | Responsabilidad web | Responsabilidad móvil | Vista web | Vista móvil | Regla de diseño |
| --- | --- | --- | --- | --- | --- |
| HU659 | Generar pedido sugerido por finca y consultar fórmula/trazabilidad | Consulta opcional según rol | `gestion-pedidos-materiales.html` | `pedido-sugerido.html` | Móvil no genera ni ajusta el pedido |
| HU2370 | Validar disponibilidad externa, decidir cantidades, relacionar documentos, intercambiar TXT y responder pedidos de finca | La finca consulta y aprueba o rechaza la respuesta | `aprobacion-pedidos-materiales.html` | Pendiente | SIAL conserva trazabilidad y compromisos lógicos; no administra existencias maestras del ERP |
| Por asociar | Registrar y aprobar pedidos recurrentes sin aviso de corte | Consulta de la decisión | `pedidos-recurrentes.html` | Pendiente | Materiales aprueba directamente, sin segunda aceptación de finca |
| Por asociar | Administrar categorías compartidas por pedidos y materiales | No administra la maestra | `categorias-pedido.html` | No aplica | Código único; registros referenciados se inactivan |
| HU660 | Ajustar y validar cantidades | Consulta opcional | `ajustar-pedido-sugerido.html` | No requerida | No aplicar tolerancias hasta que exista matriz oficial |
| HU662 | Consultar stock por finca/material y su historial | Consulta opcional | `inventario-materiales-finca.html`, `movimientos-inventario.html` | `inventario-finca.html` | Mostrar disponible, reservado, total informado y origen; no editar saldos libres |
| HU666 | Registrar y procesar múltiples pedidos adicionales | Solo si el evento ocurre en campo | `pedidos-adicionales.html` | Complementaria condicionada al evento | Mantener pedido base, aviso, finca, semana, motivo, actor, fecha e idempotencia |
| HU826 | Gestionar catálogo y receta por referencia | Consulta opcional | `gestion-materiales.html`, `recetas-materiales.html` | No requerida | Separar catálogo de la receta; identificar receta por Referencia + Versión y cantidad sugerida por caja |
| HU546 | Registrar orden de transporte de insumos | Consulta/hitos de campo | `ordenes-transporte-insumos.html` | `ordenes-asignadas.html` | Web crea y coordina; móvil ejecuta hitos |
| HU669 | Notificar despacho a transporte | No requerida para emitir notificación | `ordenes-transporte-insumos.html` | Complementaria | Acción separada y auditable para transporte |
| HU670 | Notificar al conductor asignado | Consulta del despacho | `ordenes-transporte-insumos.html` | `detalle-orden.html` | Bloquear notificación si no hay conductor/vehículo asignado |
| HU547 | Consultar, gestionar y seguir la entrega | Confirmar recepción en finca | `seguimiento-entregas.html` | `registrar-entrega.html` | Web no captura foto/firma ni reemplaza la ejecución móvil |
| HU681 | Seguimiento de entrega efectiva | Registrar entrega desde app | `seguimiento-entregas.html` | `registrar-entrega.html` | Web refleja estado, cantidades y novedades |
| HU682 | Consultar POD y trazabilidad | Capturar foto/firma offline | `seguimiento-entregas.html` | `registrar-entrega.html`, `pod.html` | POD único, inmutable y vinculado al documento |

## Decisiones de implementación

- Esta carpeta es la propuesta web; no debe importar ni reutilizar el JavaScript de `SIAL Móvil`.
- Los datos de `localStorage` solo simulan persistencia de la propuesta. La aplicación real requiere contrato REST/gateway, permisos, auditoría e idempotencia en dominio/backend.
- Cuando una regla de negocio está pendiente —por ejemplo la tolerancia 10/15% de HU660— la interfaz debe bloquear la confirmación y explicar el dato faltante; no convertir una cifra ilustrativa en regla operativa.
