# Normalización Web — Gestión de Empresas

Fecha: 2026-10-15. Estado: bloque local y parcial; no acredita aprobación funcional, publicación ni cierre global.

## Decisión

Tres vistas de gestión (`gestion-empresas`, `gestion-contactos` y `gestion-clientes`) son bandejas de registros comparables. Vía `reuse`: composición de bandeja maestra con acción en encabezado de card, búsqueda y filtros, tabla, estados, detalle y paginación. Los dos registros son formularios grandes; la captura breve de clientes permanece embebida en su propia bandeja. No se convierten en una misma anatomía por pertenecer al módulo Empresa.

La fuente funcional es el contenido e interacciones existentes en esas vistas. El paquete instalado `@banasandev/banasan-ui` 1.4.0 gobierna los controles publicados. Se retiraron cuatro métricas de demostración en Empresas, que no correspondían a las tres filas del prototipo, y avisos permanentes redundantes en las bandejas de Empresas y Contactos. No se cambió la regla de inactivación.

## Evidencia por componente

| Vista | Adoptado/adaptado | Local o pendiente |
| --- | --- | --- |
| Empresas, Contactos y Clientes | `TextInput`, dos `SelectInput`, contador `Chip`, `Button` de exportación, `Table` con chips e iconos de acción, `Pagination`, `Drawer` | Exportación, confirmación de cambio de estado y teclado requieren recorrido final. |
| Clientes, panel embebido | Seis `TextInput`, un `SelectInput` y dos `Button`; apertura desde el CTA comprobada | Validación de alta completa, persistencia y estados específicos del flujo. |
| Registro de empresa | Tres `TextInput` y dos `Button`; feedback inline | Asignación de tipos de empresa específica; no hay equivalente general que justifique reemplazarla. |
| Registro de contacto | Seis `TextInput`, cuatro `SelectInput`, dos `Button`; feedback inline | Auditoría y relaciones de negocio conservadas; falta alta completa. |

En `127.0.0.1:4175` se comprobó una tabla visible por bandeja, tres filas iniciales, tres chips de estado y tres acciones por fila. La búsqueda sin coincidencias en Empresas sincronizó contador y pie; el `Drawer` de Contactos abrió con el registro elegido. En Contactos, el envío vacío marcó 13 controles inválidos. A 390 px, los formularios y toolbar inspeccionados no desbordaron la página. No se agregaron páginas ficticias para tres filas.

La navegación existente expone cada vista desde el shell o CTA de la bandeja; no se añadieron rutas nuevas. El HTML nativo permanece como proxy oculto para los adaptadores React. El detalle de clientes y los formularios mantienen datos de demostración sin persistencia real. Decisión de delegación: `SELF`; las cinco vistas usan el mismo adaptador y el mismo estado local, sin slice independiente que mejore el resultado.

Pendiente para cierre: completar recorridos de exportación, acciones de estado, captura válida, teclado y contraste; validar visualmente con John y publicar la rama aprobada. Esta evidencia no equivale a normalización de las 101 vistas Web.

## Continuación: dependencias, roles y alertas de contactos

`gestion-dependencias` y `parametrizacion-roles` son catálogos breves con alta embebida. Vía `reuse` de la misma anatomía de bandeja: controles de búsqueda/filtro, contador, `Table` con chips y acciones, `Pagination`, `Drawer` y botones publicados. Los campos compatibles de alta usan `TextInput`; la selección múltiple de empresas y el editor de permisos permanecen `feature-local`. Se retiraron cuatro cifras de demostración de Roles que no correspondían a sus tres filas. El aviso de regla anterior a la tabla usa el `Notice` publicado; el mensaje de éxito dentro del formulario se expresa inline.

`roles-empresa` es un formulario de relación, no una tabla. Su selector de empresa y botón de guardado consumen `SelectInput` y `Button`; la transferencia entre roles disponibles/incluidos queda `feature-local`, porque no hay un componente publicado equivalente. El aviso de regla sobre la card usa `Notice` de librería.

`gestion-notificaciones-contactos` es una bandeja con editor de alertas embebido. Búsqueda, tres filtros, contador, tabla de estados y acciones, y pie consumen `TextInput`, `SelectInput`, `Chip`, `Table` e `Pagination`. El editor de casillas conserva su lógica específica. Se corrigió la sincronización del pie al filtrar a cero y se limpió el texto de contexto al abrirlo desde una acción de fila. No se añadió una paginación ficticia: el prototipo solo tiene tres contactos.

Comprobaciones ejecutadas en `127.0.0.1:4175`: cuatro filas y cuatro chips en Dependencias; tres filas y tres chips en Roles y Alertas; apertura de formularios embebidos, validación vacía de Dependencias, apertura de editor de Alertas, contador/pie/vacío sincronizados y ausencia de desbordamiento de la toolbar de cuatro filtros a 390 px. Pendientes por vista: alta válida, persistencia, acciones de estado, selección múltiple por teclado, foco/contraste y validación visual de John. Decisión de delegación: `SELF`, por adaptación compartida acoplada a lógica local; no se modificó la librería.

`index.html` se clasificó como índice de navegación, no como bandeja. No le corresponden `Table`, chips ni paginación. Se retiraron cuatro tarjetas que repetían la clasificación de los enlaces y se conservaron las rutas a las vistas del módulo. El CTA y el shell siguen sujetos a la revisión global de navegación.

## Continuación del registro de empresa · 28/10/2026

Se corrigió el feedback del formulario: al modificar datos o asignaciones se oculta el resultado de la validación anterior y, al limpiar, se retiran errores y se recuperan los textos de ayuda. Se conserva el mensaje explícito de que los datos no se guardan en el sistema real. Verificados envío vacío, limpieza, validación con datos y tipo de demostración, modificación y nueva limpieza mediante los controles visibles de librería. El alta, edición, persistencia, estados, auditoría y la unicidad de NIT siguen pendientes; este cambio no completa el módulo ni constituye QA formal. No se modifica la librería.

## Gestión principal de empresas · continuación

Alta y edición comparten el almacenamiento local `sial-proposal-companies-v1` con la bandeja. Se conservan registros demo, estado y auditoría previos; se agregan tipos y razón social si se capturan. Se verifica unicidad por dígitos del NIT entre las empresas del navegador, sin considerar el separador. El código correlativo, estado inicial activo y actor «Propuesta local» son convenciones del prototipo. Las empresas históricas no tienen tipos conocidos: se solicita seleccionar al menos uno al guardarlas. Los cambios de estado requieren confirmación y agregan una entrada sin borrar el historial. La lectura o escritura fallida informa el error y no anuncia éxito. No hay persistencia, concurrencia ni auditoría del backend.

Verificados en navegador aislado: NIT duplicado con y sin guion, creación, recarga de bandeja, edición conservando el propio NIT, inactivación con historial acumulado y ancho móvil de 390 px. Pendientes: el resto de vistas de Empresa (contactos, clientes, roles, dependencias y alertas) y sus recorridos completos; no se declara cerrado el módulo. No se modificó la librería. `SELF`: flujo de catálogo y formulario acoplados al mismo adaptador y almacenamiento local; no hay slice independiente sin duplicar contexto.

## Continuación de catálogos y asignaciones

Se conectaron contactos, clientes, dependencias y parametrización de roles a almacenamiento local con altas, edición, cambios de estado e historial local. Contactos valida identificación y correo de contactos activos; clientes valida código y nombre; dependencias y roles validan nombre. Las asignaciones de roles por empresa y alertas se guardan en claves locales independientes. No son permisos, notificaciones, auditoría ni persistencia de producción. Las reglas de código correlativo, estado inicial y actor son convenciones de demostración. Los formularios sin guardado efectivo dejan de indicar que guardaron.

Se probaron alta de cliente, dependencia y rol; edición y cambio de estado de cliente y dependencia; edición, duplicado de identificación y cambio de estado de contacto; asignación de roles y alertas con recarga. Las seis bandejas o vistas de asignación inspeccionadas no desbordan a 390 px. Build y sintaxis JS correctos. Falta completar pruebas de alta de contacto, edición y estados de roles, duplicados, errores de almacenamiento, filtros, teclado y contraste, así como conectar las asignaciones y alertas con los catálogos locales en lugar de datos semilla separados. Tampoco se ha hecho QA formal ni revisión visual. Por ello no se declara cerrado el módulo. `SELF`: las vistas comparten adaptadores y estado local de un checkout con cambios previos; separación no aporta independencia proporcional.
