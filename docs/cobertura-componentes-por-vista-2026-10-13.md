# Cobertura de componentes por vista Web — inventario inicial

> **Inventario histórico (13–16/10).** Los totales estáticos de esta página no describen el estado actual. Consultar [estado-normalizacion-web-2026-10-26.md](estado-normalizacion-web-2026-10-26.md) y la [matriz vigente](matriz-vista-componente-web-2026-10-26.csv) para el alcance de 102 HTML y el seguimiento por componente.

Fecha inicial: 2026-10-13. Alcance actualizado el 2026-10-16: 101 HTML de la propuesta, incluido el catálogo técnico `shared/componentes.html`. Los números originales son la línea base estática al abrir este inventario; las cuatro rutas incorporadas después se contaron al agregarlas, no equivalen a un recuento general tras cada edición. Los controles creados por JavaScript requieren revisión en runtime. La columna de estado sí recoge avances posteriores. «React» o «Table adaptada» identifica únicamente esa adopción, no la normalización completa de la vista.

Criterio de terminado: cada vista debe tener inventario estático y runtime, equivalencia con la librería para cada componente aplicable, implementación o excepción justificada, y comprobación de estados/interacciones. «Sin componente aplicable» se documenta; no se deduce de la ausencia de marcadores.

Totales estáticos observados: inputs 324 · selects 142 · textareas 15 · tablas 46 · chips 43 · botones 716 · notices 88 · paginadores 16. Estos totales incluyen el catálogo técnico y no equivalen a trabajo pendiente.

| Vista | Inputs | Selects | Textareas | Tablas | Chips | Botones | Notices | Paginación | Estado parcial |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `404.html` | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | Por auditar |
| `Changelog/administracion-changelog.html` | 6 | 6 | 3 | 1 | 1 | 5 | 1 | 0 | Por auditar |
| `Changelog/changelog-interno.html` | 1 | 2 | 0 | 0 | 1 | 2 | 0 | 0 | Por auditar |
| `Changelog/index.html` | 1 | 2 | 0 | 0 | 1 | 2 | 0 | 0 | Por auditar |
| `Errores/401.html` | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | Por auditar |
| `Errores/403.html` | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | Por auditar |
| `Errores/404.html` | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | Por auditar |
| `Errores/500.html` | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Errores/503.html` | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Errores/mantenimiento.html` | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Gestion de Empresas/gestion-clientes.html` | 8 | 3 | 0 | 1 | 1 | 17 | 1 | 0 | Parcial: bandeja con TextInput, 2 SelectInput, Chip, Button, Table, Pagination y Drawer; alta embebida con 6 TextInput, SelectInput y 2 Button. Filtros, vacío y apertura comprobados. |
| `Gestion de Empresas/gestion-contactos.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Parcial: bandeja con TextInput, 2 SelectInput, Chip, Button, Table, Pagination y Drawer; detalle y 3 chips de estado comprobados. |
| `Gestion de Empresas/gestion-dependencias.html` | 3 | 1 | 0 | 1 | 1 | 19 | 2 | 0 | Parcial: TextInput, SelectInput, Chip, Button, Table, Pagination y Drawer; formulario embebido con TextInput y 2 Button. Apertura, validación vacía y chips comprobados. |
| `Gestion de Empresas/gestion-empresas.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Parcial: bandeja con TextInput, 2 SelectInput, Chip, Button, Table, Pagination y Drawer; búsqueda sin resultados y 390 px comprobados. Retiradas métricas de demostración. |
| `Gestion de Empresas/gestion-notificaciones-contactos.html` | 5 | 4 | 0 | 1 | 1 | 10 | 0 | 7 | Parcial: TextInput, 3 SelectInput, Chip, Button, Table y Pagination; edición de alertas y estado vacío sincronizado comprobados. Checkbox de alertas específico. |
| `Gestion de Empresas/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Auditado como índice de navegación, no bandeja: tabla/chips/paginación no aplican. Se retiraron cuatro tarjetas de clasificación redundantes; enlaces locales conservados. CTA y shell pendientes de revisión global. |
| `Gestion de Empresas/parametrizacion-roles.html` | 8 | 1 | 1 | 1 | 1 | 19 | 2 | 0 | Parcial: Notice, TextInput, SelectInput, Chip, Button, Table, Pagination y Drawer; nombre de rol y acciones del formulario embebido adaptados. Métricas de demostración retiradas. |
| `Gestion de Empresas/registro-contacto.html` | 11 | 4 | 0 | 0 | 0 | 5 | 2 | 0 | Parcial: 6 TextInput, 4 SelectInput y 2 Button; envío vacío marca 13 controles y 390 px sin desbordamiento. Estado inline sustituye aviso de éxito. |
| `Gestion de Empresas/registro-empresa.html` | 4 | 0 | 0 | 0 | 0 | 6 | 1 | 0 | Parcial: 3 TextInput y 2 Button; asignación de tipos sigue local. Estado inline sustituye aviso de éxito y 390 px sin desbordamiento. |
| `Gestion de Empresas/roles-empresa.html` | 5 | 1 | 0 | 0 | 0 | 6 | 1 | 0 | Parcial: Notice, SelectInput de empresa y Button de guardado consumen librería; transferencia de roles permanece específica y pendiente de recorrido completo. |
| `Gestion de Fincas/gestion-clases-referencia.html` | 3 | 3 | 0 | 1 | 1 | 13 | 3 | 0 | Table, 2 campos, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-fincas.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Table, filtros, búsqueda, contador, exportación, paginación y cajón de detalle adaptados; parcial: enlaces de alta/edición y confirmación de estado |
| `Gestion de Fincas/gestion-grupos.html` | 3 | 2 | 0 | 1 | 1 | 14 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-productos.html` | 3 | 1 | 0 | 1 | 1 | 13 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-referencias.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Table, filtros, búsqueda, contador, exportación, paginación y cajón de detalle adaptados; parcial: enlaces de alta/edición/copia y confirmación de estado |
| `Gestion de Fincas/gestion-sectores.html` | 3 | 2 | 0 | 1 | 1 | 14 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Fincas/registro-finca.html` | 10 | 3 | 0 | 0 | 0 | 5 | 2 | 0 | Formulario grande parcial: 4 TextInput, 3 SelectInput y Button de guardar adaptados; mapa local; sin estado inicial, trazabilidad ni aviso redundantes. Montaje y envío vacío verificados; faltan recorridos completos. |
| `Gestion de Fincas/registro-referencia.html` | 14 | 3 | 0 | 0 | 0 | 4 | 2 | 0 | Formulario grande parcial: 2 TextInput, 3 SelectInput y Button de guardar adaptados; numéricos locales; sin estado inicial, trazabilidad ni aviso redundantes. Montaje y 390 px revisados; faltan recorridos completos. |
| `Gestion de Planeacion/consultar-aviso-corte.html` | 1 | 0 | 0 | 2 | 2 | 4 | 1 | 0 | Por auditar |
| `Gestion de Planeacion/crear-aviso-corte.html` | 6 | 3 | 3 | 1 | 1 | 19 | 4 | 0 | Por auditar |
| `Gestion de Planeacion/generacion-semanas.html` | 3 | 1 | 0 | 1 | 1 | 5 | 2 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-avisos-corte.html` | 2 | 3 | 0 | 1 | 1 | 5 | 0 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-cintas.html` | 6 | 2 | 0 | 1 | 1 | 24 | 2 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-semanas.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Planeacion/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Transporte/dashboard-transporte.html` | 1 | 0 | 0 | 1 | 0 | 3 | 1 | 0 | Por auditar |
| `Gestion de Transporte/detalle-mantenimiento.html` | 2 | 0 | 1 | 0 | 0 | 3 | 1 | 0 | Por auditar |
| `Gestion de Transporte/detalle-preoperacional.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar: vista incorporada después del inventario inicial |
| `Gestion de Transporte/disponibilidad-operativa.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Parcial: controles de librería montados; datos y flujo por validar |
| `Gestion de Transporte/gestion-categorias-licencia.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React |
| `Gestion de Transporte/gestion-conductores.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Transporte/gestion-mantenimientos.html` | 2 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | Por auditar |
| `Gestion de Transporte/gestion-operaciones.html` | 3 | 5 | 0 | 2 | 2 | 14 | 2 | 0 | Parcial: bandeja normalizada; editor masivo específico pendiente |
| `Gestion de Transporte/gestion-preoperacionales.html` | 2 | 2 | 0 | 1 | 1 | 2 | 0 | 1 | Por auditar: vista incorporada después del inventario inicial |
| `Gestion de Transporte/gestion-tipos-empresa.html` | 4 | 2 | 0 | 1 | 1 | 16 | 2 | 0 | Parcial: controles de librería montados; falta recorrido funcional completo |
| `Gestion de Transporte/gestion-tipos-vehiculo.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React |
| `Gestion de Transporte/gestion-vehiculos.html` | 2 | 4 | 0 | 1 | 1 | 11 | 1 | 0 | Parcial: controles de librería montados; falta recorrido funcional completo |
| `Gestion de Transporte/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Transporte/inicio-operacion.html` | 13 | 4 | 1 | 0 | 0 | 5 | 2 | 0 | Por auditar |
| `Gestion de Transporte/matriz-documental-vehiculos.html` | 2 | 2 | 0 | 1 | 1 | 8 | 1 | 0 | Parcial: Notice y bandeja con controles de librería; datos por validar |
| `Gestion de Transporte/modelo-vehiculo-3d.html` | 1 | 0 | 0 | 0 | 0 | 10 | 0 | 0 | Por auditar: visor especializado incorporado después del inventario inicial |
| `Gestion de Transporte/plan-operacional.html` | 10 | 2 | 1 | 1 | 0 | 6 | 2 | 0 | Por auditar |
| `Gestion de Transporte/registrar-mantenimiento.html` | 8 | 2 | 2 | 0 | 0 | 4 | 2 | 0 | Formulario grande parcial: 5 TextInput, 2 SelectInput y 2 Button adaptados; fechas, números, textarea y archivo locales. Selección, bloqueo y foco de error verificados en navegador; falta recorrido completo. |
| `Gestion de Transporte/registro-conductor.html` | 15 | 3 | 0 | 0 | 0 | 5 | 3 | 0 | Formulario grande parcial: 4 TextInput, 3 SelectInput y 2 Button adaptados; fechas, identificación y celular con teclado numérico, licencias locales. Estado inicial y avisos redundantes retirados. |
| `Gestion de Transporte/registro-vehiculo.html` | 14 | 5 | 0 | 0 | 0 | 5 | 2 | 0 | Formulario grande parcial: 3 TextInput, 5 SelectInput y 2 Button adaptados; fechas y capacidad numérica locales. Trazabilidad y aviso redundantes retirados; validación vacía comprobada. |
| `Gestion de Transporte/relacion-conductor-licencia.html` | 3 | 4 | 0 | 1 | 1 | 14 | 3 | 0 | Parcial: controles de librería montados; fecha local y flujo por validar |
| `Gestion de Transporte/relacion-empresa-tipo.html` | 2 | 4 | 0 | 1 | 1 | 13 | 2 | 0 | Parcial: controles de librería montados; flujo por validar |
| `Gestion de Usuarios/editar-usuario.html` | 13 | 1 | 0 | 0 | 1 | 11 | 1 | 0 | Parcial: datos básicos con 6 TextInput y 2 Button de librería; feedback inline comprobado. Relaciones y roles siguen locales y pendientes de interacción. |
| `Gestion de Usuarios/gestion-permisos-rol.html` | 2 | 2 | 0 | 0 | 1 | 5 | 0 | 0 | Parcial: toolbar con 2 SelectInput, TextInput y 2 Button de librería; filtro vacío y 390 px verificados. Matriz de permisos sigue específica. |
| `Gestion de Usuarios/gestion-usuarios.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Parcial: búsqueda, 2 filtros, contador, Table con Chip/acciones y Pagination montados; vacío y 390 px verificados. Exportación, detalle y permisos pendientes de recorrido. |
| `Gestion de Usuarios/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Usuarios/mis-dispositivos.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar: vista incorporada después del inventario inicial |
| `Gestion de Usuarios/registro-usuario.html` | 10 | 4 | 0 | 0 | 0 | 6 | 1 | 0 | Formulario grande parcial: 6 TextInput, 4 SelectInput y 2 Button montados; fecha, contraseñas y roles locales. Aviso interno sustituido por estado inline; vacío y 390 px revisados. |
| `Gestion Operaciones Puerto/gestion-contenedores.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Parcial: catálogo, formulario breve y detalle con librería; flujo completo pendiente |
| `Gestion Operaciones Puerto/gestion-etapas-contenedor.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Parcial: catálogo, formulario breve y detalle con librería; flujo completo pendiente |
| `Gestion Operaciones Puerto/gestion-puertos.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Parcial: catálogo, formulario breve y detalle con librería; flujo completo pendiente |
| `Gestion Operaciones Puerto/gestion-tipos-contenedor.html` | 5 | 2 | 0 | 1 | 1 | 17 | 2 | 0 | Parcial: catálogo, formulario breve y detalle con librería; control numérico local y flujo completo pendiente |
| `Gestion Operaciones Puerto/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion Operaciones Puerto/programacion-contenedores.html` | 4 | 3 | 1 | 1 | 2 | 7 | 2 | 1 | Por auditar |
| `Gestion Operaciones Puerto/trazabilidad-pallets.html` | 2 | 3 | 0 | 1 | 1 | 4 | 0 | 1 | Por auditar |
| `index.html` | 1 | 3 | 0 | 0 | 0 | 4 | 1 | 0 | Por auditar |
| `Login/index.html` | 3 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | Por auditar |
| `Login/recuperar-contrasena.html` | 1 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | Por auditar |
| `Login/restablecer-contrasena.html` | 2 | 0 | 0 | 0 | 0 | 10 | 0 | 0 | Por auditar |
| `Login/seleccionar-empresa.html` | 6 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | Por auditar |
| `Login/verificar-codigo.html` | 6 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | Por auditar |
| `Materiales y Suministros/ajustar-pedido-sugerido.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial: flujo por receta auditado; sin tabla aplicable. Gate de reglas y captura pendiente. |
| `Materiales y Suministros/aprobacion-pedidos-materiales.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Parcial: galería con filtros y contador; retirados paginador fijo y filtro sin lógica. Decisiones por material pendientes de gate. |
| `Materiales y Suministros/categorias-pedido.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React auditado parcialmente: Table, TextInput/SelectInput, Chip y Pagination montados; alta abre formulario. Falta gate funcional completo. |
| `Materiales y Suministros/gestion-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/gestion-pedidos-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial: pedido sugerido por receta auditado como flujo, no bandeja tabular; faltan transiciones completas. |
| `Materiales y Suministros/gestion-proveedores.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial: dashboard y accesos auditados; tabla, filtros y paginación no aplican. Shell pendiente del gate global. |
| `Materiales y Suministros/inventario-materiales-finca.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/inventario-pallets.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/movimientos-inventario.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/ordenes-transporte-insumos.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/pedidos-adicionales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial: Table, filtros, Chip y paginación funcional; formulario con SelectInput publicado. Gate de alta/detalle pendiente. |
| `Materiales y Suministros/pedidos-recurrentes.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Parcial: Table, filtros, Chip y paginación funcional; probado cambio a página 2 con datos temporales. Captura/decisiones pendientes. |
| `Materiales y Suministros/recetas-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/reglas-documentales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/resumen-proveedores.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/seguimiento-entregas.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Parcial (runtime) |
| `Materiales y Suministros/seguimiento-pedidos-finca.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Parcial: Table, búsqueda/filtro, contador, chip y acción de detalle; paginación no aplica al conjunto actual. Gate de detalle pendiente. |
| `Materiales y Suministros/trazabilidad-pedido.html` | 2 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | Parcial: búsqueda TextInput de librería conserva consulta; ruta PED-2026-10482 verificada. Tabla/paginación no aplican. |
| `shared/componentes.html` | 21 | 9 | 2 | 6 | 0 | 56 | 9 | 7 | Catálogo técnico |
| `Trazabilidad/auditoria-operativa.html` | 4 | 4 | 0 | 0 | 1 | 10 | 1 | 0 | Por auditar |
| `Trazabilidad/documento-poma.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Trazabilidad/generar-documento-poma.html` | 2 | 0 | 0 | 1 | 0 | 7 | 1 | 0 | Por auditar |
| `Trazabilidad/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |

## Pendiente operativo

- Revisar controles renderizados por JavaScript y el uso real de cada elemento; este inventario no declara cobertura funcional.
- Para cada familia, migrar componentes equivalentes de la librería sin alterar acciones ni contenido de la HU. Cuando la librería no tenga equivalente semántico, registrar `feature-local` o `candidate` con razón y handoff.
- Verificar por vista los estados con datos, vacío, error, foco, teclado, responsive y la interacción principal. Registrar evidencia y aprobación antes de llamar «normalizada» a una vista.
- Enlace con producto: 23 de 63 rutas explícitas; 8 candidatas y 36 sin relación confirmada siguen en el mapeo. No se crean vistas sin HU y necesidad verificadas.
