# Revisión documental interna · CA10

24 noviembre de 2026. HU1919 revisión 16, CA10.7–11. Propuesta Web, no implementación productiva. SELF: flujo acoplado al estado local y archivos de la vista anterior; no aporta independencia suficiente una delegación. Skills de propuestas, librería Web en modo consulta y Dona.

## Composición

Bandeja SIAL con Card de gestión, FilterToolbar de ruta/estado/transportadora, tabla y paginación. Estado inicial En revisión. Ventana compacta compartida con soportes para descargar, revisar versiones y decidir; confirmación reemplaza contenido sin anidar ventanas. La transportadora conserva sus acciones de carga/envío; Banasan tiene una entrada de revisión explícita. No se duplican componentes ni estado documental entre páginas.

Navegación: Transporte → Revisión documental interna; panel → pendientes documentales → Consultar soportes. Catálogo actualizado. Campana global con contexto interno; sus eventos abren la ruta de revisión correspondiente. Componentes publicados Card, Toolbar, FilterToolbar, TextInput, SelectInput, Button, IconButton, Table, TableRowActions, Chip, Pagination, Notice y ToastProvider; ConmatFloatingView conserva la brecha de ventana genérica ya declarada.

## Reglas representadas

Sólo se decide sobre el último soporte En revisión y una ruta finalizada. Confirmación retiene número de versión e identificador; una modificación o decisión simultánea invalida el comando. Rechazo exige observación no vacía. Se registran resultado, observación, fecha/hora y actor ilustrativo Revisor Banasan en la versión, más evento de ruta. Historial preserva cada revisión. El rechazo avisa en campana a la transportadora y habilita nueva versión; ninguna versión anterior se borra.

Habilitación administrativa ilustrativa: ruta vigente finalizada y soporte vigente aprobado. No se agregan validaciones fiscales desconocidas ni procesos de cobro/facturación. El estado se muestra en tabla y detalle; no aprueba factura ni confirma pago. Un soporte cargado o rechazado no habilita el trámite. El archivo debe estar disponible en este navegador para confirmar la decisión; faltante produce un error sin aprobación.

CA10.7 aprobación/rechazo y observaciones; CA10.8 aviso y reemplazo; CA10.9 habilitación diferenciada; CA10.10 consulta por estado/empresa; CA10.11 explicación expresa de separación con facturas/pagos. Carga, descarga y versiones de CA10.1–6 siguen compartidas con la vista de soportes.

Rol y permisos son contexto demostrativo local: el cliente no garantiza autorización real. Los archivos permanecen en IndexedDB y el estado de rutas en almacenamiento local; no existe auditoría, revisión ni notificación de servidor.

## Validación

Build correcto y check-conmat-document-review (incluye cierre, seguimiento y soportes) correcto: rol, versión vigente, duplicados, motivo requerido, reemplazo, aprobación, notificación y habilitación.

Navegador limpio: rechazar sin motivo muestra error; rechazo válido → campana externa → observación visible → versión 2 cargada/enviada → aprobación interna. Cancelar confirmación no decide. Historial conserva las dos versiones y ambos resultados. Aprobación persiste al recargar. Sin errores de consola y móvil de 390 px sin desbordamiento global. Enter abre, Escape cierra y devuelve foco. Descarga del soporte y filtro por empresa/resultado vacío comprobados. Revisión visual en review-1440.png, review-decision.png, review-390.png y review-dark.png. Pendiente aprobación visual del usuario y revisión transversal final de la HU.
