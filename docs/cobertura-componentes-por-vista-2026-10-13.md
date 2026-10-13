# Cobertura de componentes por vista Web — inventario inicial

Fecha: 2026-10-13. Alcance: 97 HTML de la propuesta, incluido el catálogo técnico `shared/componentes.html`. Los números son la línea base estática al abrir este inventario, no un recuento tras cada edición; los controles creados por JavaScript requieren revisión en runtime. La columna de estado sí recoge avances posteriores. «React» o «Table adaptada» identifica únicamente esa adopción, no la normalización completa de la vista.

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
| `Gestion de Empresas/gestion-clientes.html` | 8 | 3 | 0 | 1 | 1 | 17 | 1 | 0 | Por auditar |
| `Gestion de Empresas/gestion-contactos.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Empresas/gestion-dependencias.html` | 3 | 1 | 0 | 1 | 1 | 19 | 2 | 0 | Banner de regla retirado; feedback del formulario inline. Otros componentes pendientes |
| `Gestion de Empresas/gestion-empresas.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Empresas/gestion-notificaciones-contactos.html` | 5 | 4 | 0 | 1 | 1 | 10 | 0 | 7 | Por auditar |
| `Gestion de Empresas/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Empresas/parametrizacion-roles.html` | 8 | 1 | 1 | 1 | 1 | 19 | 2 | 0 | Por auditar |
| `Gestion de Empresas/registro-contacto.html` | 11 | 4 | 0 | 0 | 0 | 5 | 2 | 0 | Por auditar |
| `Gestion de Empresas/registro-empresa.html` | 4 | 0 | 0 | 0 | 0 | 6 | 1 | 0 | Por auditar |
| `Gestion de Empresas/roles-empresa.html` | 5 | 1 | 0 | 0 | 0 | 6 | 1 | 0 | Por auditar |
| `Gestion de Fincas/gestion-clases-referencia.html` | 3 | 3 | 0 | 1 | 1 | 13 | 3 | 0 | Table, 2 campos, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-fincas.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Table, filtros, búsqueda, contador, exportación, paginación y cajón de detalle adaptados; parcial: enlaces de alta/edición y confirmación de estado |
| `Gestion de Fincas/gestion-grupos.html` | 3 | 2 | 0 | 1 | 1 | 14 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-productos.html` | 3 | 1 | 0 | 1 | 1 | 13 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/gestion-referencias.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Table, filtros, búsqueda, contador, exportación, paginación y cajón de detalle adaptados; parcial: enlaces de alta/edición/copia y confirmación de estado |
| `Gestion de Fincas/gestion-sectores.html` | 3 | 2 | 0 | 1 | 1 | 14 | 2 | 0 | Table, campo, búsqueda, botones y Drawer adaptados; banner de regla retirado, feedback inline; parcial |
| `Gestion de Fincas/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Fincas/registro-finca.html` | 10 | 3 | 0 | 0 | 0 | 5 | 2 | 0 | Por auditar |
| `Gestion de Fincas/registro-referencia.html` | 14 | 3 | 0 | 0 | 0 | 4 | 2 | 0 | Por auditar |
| `Gestion de Planeacion/consultar-aviso-corte.html` | 1 | 0 | 0 | 2 | 2 | 4 | 1 | 0 | Por auditar |
| `Gestion de Planeacion/crear-aviso-corte.html` | 6 | 3 | 3 | 1 | 1 | 19 | 4 | 0 | Por auditar |
| `Gestion de Planeacion/generacion-semanas.html` | 3 | 1 | 0 | 1 | 1 | 5 | 2 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-avisos-corte.html` | 2 | 3 | 0 | 1 | 1 | 5 | 0 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-cintas.html` | 6 | 2 | 0 | 1 | 1 | 24 | 2 | 0 | Por auditar |
| `Gestion de Planeacion/gestion-semanas.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Planeacion/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Transporte/dashboard-transporte.html` | 1 | 0 | 0 | 1 | 0 | 3 | 1 | 0 | Por auditar |
| `Gestion de Transporte/detalle-mantenimiento.html` | 2 | 0 | 1 | 0 | 0 | 3 | 1 | 0 | Por auditar |
| `Gestion de Transporte/disponibilidad-operativa.html` | 2 | 2 | 0 | 1 | 1 | 9 | 1 | 0 | Por auditar |
| `Gestion de Transporte/gestion-categorias-licencia.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React |
| `Gestion de Transporte/gestion-conductores.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Transporte/gestion-mantenimientos.html` | 2 | 2 | 0 | 1 | 1 | 2 | 0 | 0 | Por auditar |
| `Gestion de Transporte/gestion-operaciones.html` | 3 | 5 | 0 | 2 | 2 | 14 | 2 | 0 | Por auditar |
| `Gestion de Transporte/gestion-tipos-empresa.html` | 4 | 2 | 0 | 1 | 1 | 16 | 2 | 0 | Por auditar |
| `Gestion de Transporte/gestion-tipos-vehiculo.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React |
| `Gestion de Transporte/gestion-vehiculos.html` | 2 | 4 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Transporte/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Transporte/inicio-operacion.html` | 13 | 4 | 1 | 0 | 0 | 5 | 2 | 0 | Por auditar |
| `Gestion de Transporte/matriz-documental-vehiculos.html` | 2 | 2 | 0 | 1 | 1 | 8 | 1 | 0 | Advertencia operativa adoptada como Notice de librería; resto de componentes parcial |
| `Gestion de Transporte/plan-operacional.html` | 10 | 2 | 1 | 1 | 0 | 6 | 2 | 0 | Por auditar |
| `Gestion de Transporte/registrar-mantenimiento.html` | 8 | 2 | 2 | 0 | 0 | 4 | 2 | 0 | Por auditar |
| `Gestion de Transporte/registro-conductor.html` | 15 | 3 | 0 | 0 | 0 | 5 | 3 | 0 | Por auditar |
| `Gestion de Transporte/registro-vehiculo.html` | 14 | 5 | 0 | 0 | 0 | 5 | 2 | 0 | Por auditar |
| `Gestion de Transporte/relacion-conductor-licencia.html` | 3 | 4 | 0 | 1 | 1 | 14 | 3 | 0 | Por auditar |
| `Gestion de Transporte/relacion-empresa-tipo.html` | 2 | 4 | 0 | 1 | 1 | 13 | 2 | 0 | Por auditar |
| `Gestion de Usuarios/editar-usuario.html` | 13 | 1 | 0 | 0 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Usuarios/gestion-permisos-rol.html` | 2 | 2 | 0 | 0 | 1 | 5 | 0 | 0 | Por auditar |
| `Gestion de Usuarios/gestion-usuarios.html` | 2 | 2 | 0 | 1 | 1 | 11 | 1 | 0 | Por auditar |
| `Gestion de Usuarios/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion de Usuarios/registro-usuario.html` | 10 | 4 | 0 | 0 | 0 | 6 | 1 | 0 | Por auditar |
| `Gestion Operaciones Puerto/gestion-contenedores.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Por auditar |
| `Gestion Operaciones Puerto/gestion-etapas-contenedor.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Por auditar |
| `Gestion Operaciones Puerto/gestion-puertos.html` | 3 | 3 | 0 | 1 | 1 | 17 | 2 | 0 | Por auditar |
| `Gestion Operaciones Puerto/gestion-tipos-contenedor.html` | 5 | 2 | 0 | 1 | 1 | 17 | 2 | 0 | Por auditar |
| `Gestion Operaciones Puerto/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Gestion Operaciones Puerto/programacion-contenedores.html` | 4 | 3 | 1 | 1 | 2 | 7 | 2 | 1 | Por auditar |
| `Gestion Operaciones Puerto/trazabilidad-pallets.html` | 2 | 3 | 0 | 1 | 1 | 4 | 0 | 1 | Por auditar |
| `index.html` | 1 | 3 | 0 | 0 | 0 | 4 | 1 | 0 | Por auditar |
| `Login/index.html` | 3 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | Por auditar |
| `Login/recuperar-contrasena.html` | 1 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | Por auditar |
| `Login/restablecer-contrasena.html` | 2 | 0 | 0 | 0 | 0 | 10 | 0 | 0 | Por auditar |
| `Login/seleccionar-empresa.html` | 6 | 0 | 0 | 0 | 0 | 8 | 0 | 0 | Por auditar |
| `Login/verificar-codigo.html` | 6 | 0 | 0 | 0 | 0 | 9 | 0 | 0 | Por auditar |
| `Materiales y Suministros/ajustar-pedido-sugerido.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/aprobacion-pedidos-materiales.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Materiales y Suministros/categorias-pedido.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | React |
| `Materiales y Suministros/gestion-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/gestion-pedidos-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/gestion-proveedores.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/index.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/inventario-materiales-finca.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/inventario-pallets.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/movimientos-inventario.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/ordenes-transporte-insumos.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/pedidos-adicionales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/pedidos-recurrentes.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Materiales y Suministros/recetas-materiales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/reglas-documentales.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/resumen-proveedores.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/seguimiento-entregas.html` | 1 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | Por auditar |
| `Materiales y Suministros/seguimiento-pedidos-finca.html` | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | Por auditar |
| `Materiales y Suministros/trazabilidad-pedido.html` | 2 | 0 | 0 | 0 | 0 | 4 | 0 | 0 | Por auditar |
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
