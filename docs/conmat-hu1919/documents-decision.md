# Soportes de transportadora · CA10

24 noviembre de 2026. HU1919 revisión 16. Propuesta Web local; no constituye aprobación visual ni entrega productiva. SELF: continuidad con estado local compartido de rutas/cierre; sin beneficio independiente de delegar este slice. Skills: sial-design-proposals, sial-web-library (consulta publicada), Dona.

## Composición y consumo

Reuse de gestión SIAL: título, propósito, Card única de bandeja, FilterToolbar, Table, Pagination. Ventana ConmatFloatingView compacta para carga/consulta; confirmación de envío dentro de la misma ventana. Navegación desde menú, catálogo y acción Gestionar soportes en cierre finalizado. Consulta interna de solo lectura. Campana global única consume eventos compartidos.

Card, Toolbar, Button, IconButton, Chip, TextInput, SelectInput, FilterToolbar, Table, TableRowActions, Pagination, Notice y ToastProvider publicados en banasan-ui-conmat. El paquete no exporta uploader: selector de archivos nativo mediante Button publicado y Notice, composición feature-local explícita. No se modifica ni reconstruye la librería.

## Alcance por criterio

| Criterio | Representación |
|---|---|
| CA10.1–2 | Carga vinculada a ruta y snapshot de servicios ejecutados, requiere cierre operativo |
| CA10.3 | Nombre, fecha/hora, actor, versión y estado visibles |
| CA10.4 | PDF/JPG/PNG, contenido inicial y extensión consistentes, archivo no vacío, máximo 10 MB |
| CA10.5 | Descarga real del Blob guardado en IndexedDB; aviso si falta el archivo local |
| CA10.6 | Pendiente de soporte → Soporte cargado → En revisión; consulta de Aprobado/Rechazado preparada |
| CA10.7–9 | Motivo de rechazo visible y reemplazo versionado; aprobar/rechazar, notificar rechazo y habilitación administrativa se completan en la siguiente vista interna |
| CA10.10 | Filtros por los cinco estados documentales y ruta |

Supuestos declarados: formatos/límite no enumerados por HU; carga sólo tras cierre, un soporte vigente cubre todos los servicios ejecutados, nueva versión sólo tras rechazo. El envío a revisión es explícito y bloquea reemplazo. No aprueba factura ni pago. Los archivos guardados quedan en este navegador; metadatos y eventos se comparten con las otras vistas locales. R-004 conserva un PDF ilustrativo consultable para el estado inicial En revisión.

Las versiones se conservan, incluyendo rechazo y motivo. El escenario de rechazo fue inyectado únicamente en contexto de prueba aislado: no simula que ya exista una vista de revisión interna. No se asegura autorización, validación exhaustiva de archivo, almacenamiento, antivirus o auditoría de servidor.

## Verificación

Build Vite correcto. check-conmat-documents incluye seguimiento/cierre y valida empresa, cierre previo, formato/tamaño, versiones, rechazo, obsolescencia, metadatos y envío.

Navegador limpio: archivo inválido rechazado, PDF real guardado y descargado, envío con confirmación, persistencia de archivo/metadatos al recargar, rechazo simulado y carga de versión 2 preservando versión 1. Sin errores de consola. Móvil 390 px sin desbordamiento global, oscuro y apertura por teclado/retorno de foco correctos. Evidencias documents-1440.png, documents-versions.png, documents-390.png y documents-dark.png. No se modificó el estado local del usuario durante el recorrido de versiones.
Corrección de aviso de cierre pendiente: Notice sólo contiene título y explicación; Consultar cierre operativo pasa a Button outlined fuera del aviso, alineado a la derecha y de ancho completo en móvil. Build y geometría móvil verificados.
