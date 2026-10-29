# Edición de usuario · normalización inicial

Alcance: propuesta Web, `editar-usuario.html`, información básica y relación empresa–roles señaladas por John. Se mantiene la composición existente de formulario y relación, con los campos y reglas originales. Se retiran los dos indicadores «Activo» de ancho completo señalados y se redistribuyen los campos restantes en dos columnas.

Campos compatibles: adaptadores `TextInput` y `SelectInput` de la librería instalada. El recuento de relaciones usa `Chip`; las cinco opciones de roles usan `CheckboxCard` con un puente al control nativo, y las acciones compatibles usan `Button`. El puente asigna nombre accesible al checkbox y sincroniza el cambio. Las tarjetas de agrupación y el resumen de relaciones conservan composición local. No se modificó la librería productiva.

Verificación: build UI y `git diff --check`; en navegador a 390 px, cinco tarjetas publicadas, selección con teclado y sincronización al control nativo, sin desbordamiento ni errores de página. Los campos y el chip publicados se verificaron en DOM. Esto no completa el módulo Usuarios: las acciones de relación y su persistencia ya eran estáticas y no se declaran funcionales por este ajuste visual; falta su recorrido, validación visual humana y revisión de las demás vistas.

Calibración posterior: separación vertical de 10 px entre tarjetas de roles en cada columna, comprobada a 1280 y 390 px sin desbordamiento.

## Asignación y consulta de roles

La selección múltiple usa casillas y permite mover el grupo por arrastre en ambos sentidos; los botones Agregar/Quitar permiten el mismo recorrido con teclado y en móvil. Se implementaron restauración, guardado y eliminación de relación en almacenamiento del navegador, con historial local y validación de al menos un rol por relación. El ejemplo corresponde al usuario m.garcia y no modifica permisos de producto. El catálogo disponible sigue siendo de demostración; la propuesta no acredita elegibilidad ni autorización real.

La vista de permisos presenta los usuarios demostrativos conocidos para el rol seleccionado y consulta las asignaciones locales de m.garcia. Se retiró de su encabezado el conteo demo no respaldado por nombres. La lista no representa el padrón completo de usuarios. Se verificaron movimiento múltiple por botones y arrastre en ambos sentidos, recarga, bloqueo de guardado sin roles y consulta del usuario en permisos. A 390 px no hubo desbordamiento. Build y comprobación de sintaxis aprobados. Pendiente conexión a fuentes reales, validación de elegibilidad y QA formal del módulo completo. SELF: el flujo y el adaptador comparten estado local y checkout con cambios previos.

## Levantamiento de roles

Referencia revisada: partición de órdenes de transporte de Materiales (`materials-transport-orders.jsx` y `sial-materiales.css`): vista previa compacta, atenuación del origen, resaltado del destino y llegada de 260 ms; la referencia original arrastra un ítem, mientras la propuesta de roles admite selección múltiple. La vista previa indica uno o varios roles, se atenúan todas las tarjetas movidas y se limpian las señales al soltar o cancelar. Con movimiento reducido se omite la animación. Verificados arrastre de dos roles, indicador de destino, cancelación con Escape, selección por teclado y ausencia de desbordamiento a 390 px. No se modificó la librería productiva.

## Consulta de roles y asignaciones

Nueva vista accesible desde Usuarios → Roles y asignaciones y desde el índice del módulo. Alterna entre agrupación por rol y por usuario, con filtro de empresa y búsqueda; muestra la empresa de cada relación y agrupa por empresa y rol para no mezclar asignaciones. Utiliza datos de demostración y los cambios de m.garcia guardados en el navegador. No es un padrón completo ni una consulta de permisos productivos. Se verificaron ambas perspectivas, búsqueda, vacío, lectura de datos locales, enlace de navegación y presentación a 390 px sin desbordamiento. La vista sigue pendiente de conexión al directorio real, revisión visual y QA formal. Pantalla de consulta, con `SelectInput` y `TextInput` publicados y composición de resultados local; no se modifica la librería.

## Conexión con permisos por rol

Por petición de John se retiró el bloque «Usuarios con este rol» añadido anteriormente en Permisos por rol y se restauró su resumen anterior. Desde cada rol con matriz existente, Roles y asignaciones enlaza a Permisos por rol con ese rol seleccionado; el enlace de regreso abre la consulta filtrada por rol y empresa. Roles sin matriz demo se identifican como no disponibles, sin redirigir a otro rol. El guardado de la matriz persiste localmente por rol, con aviso de error y sin afirmar cambios en el sistema real. Verificados ambos sentidos desde las perspectivas de rol y usuario, el rol seleccionado, filtro de retorno, cambio de permiso y recarga; sin desbordamiento a 390 px. Siguen pendientes datos productivos, permisos reales y QA formal.

## Jerarquía visual de roles y asignaciones

Se reforzaron títulos, nombres, descripciones y enlaces con la tipografía y los colores de SIAL; un acento lateral identifica cada agrupación sin añadir tarjetas anidadas. El encabezado de resultados cambia según la perspectiva y los datos de demostración se explican al pie. Verificadas ambas perspectivas y el acceso a permisos en móvil, además de colores de texto y acento en tema oscuro a 1280 px sin desbordamiento. Pendiente aprobación visual humana.

## Bandeja y detalle para volumen

La consulta ahora usa una bandeja paginada por rol o usuario y un detalle lateral modal con búsqueda y paginación propias. La relación rol–empresa mantiene el enlace a la matriz de permisos correspondiente. Las búsquedas y la paginación se ejecutan sobre datos locales; la tabla, el diálogo y la paginación son composición local de la propuesta, pendientes de evaluación para adopción de los componentes publicados equivalentes. El escenario opt-in `?escenario=volumen` agrega 500 usuarios sintéticos en memoria sin guardar registros ni modificar datos del navegador.

Verificados 501 usuarios asociados al rol Administrador general, páginas 1–10 y 11–20, búsqueda del usuario 499 y navegación a permisos. En móvil se verificaron 503 usuarios en la bandeja, cambio de página, apertura y cierre con retorno de foco, sin desbordamiento. No se validó rendimiento con backend, directorio real ni QA formal; pendiente revisión visual de John. SELF: composición y datos del prototipo acoplados al mismo checkout y runtime.

## Opción B seleccionada por John

Se reemplazó el diálogo por lista de roles/usuarios y detalle en la misma página. Cada lista tiene búsqueda y paginación independiente; el detalle conserva acceso a permisos y el retorno mantiene rol y empresa. En móvil la lista y el detalle se apilan. La vista usa los controles de búsqueda, selección y botones adaptados a la librería instalada; la lista maestra, tabla y paginación siguen siendo composición local, pendientes de adopción de componentes publicados compatibles. El escenario opcional de 500 usuarios es sintético y no altera almacenamiento.

Probados a 1280 px: 501 usuarios para un rol, páginas 1–10 y 11–20 y búsqueda de demo.0499. A 390 px: 503 usuarios en perspectiva por usuario, paginación, búsqueda de m.garcia, navegación a permisos, vuelta al rol, estado vacío y limpieza del filtro al cambiar selección, sin desbordamiento. No se verificó backend ni se publicó la librería.

## Normalización de componentes de la opción B

La selección maestra utiliza `RadioCard`, el detalle `Table` y cada lista `Pagination` de la versión instalada de `@banasandev/banasan-ui`. Un adaptador mantiene los controles existentes como puente oculto y preserva enlaces a permisos por fila. La paginación usa tamaño de 10, coherente con el prototipo. El contenedor de paginación de la columna estrecha permite desplazamiento horizontal para no superponerse al detalle. No se modificó la librería productiva.

Build UI y comprobación de sintaxis aprobados. Con el escenario aislado de 500 usuarios se verificaron 501 usuarios para un rol, página 11–20, búsqueda demo.0499, cambio de rol y navegación a permisos; en la perspectiva de usuarios, 503 registros y página 11–20, búsqueda de m.garcia y acceso a Supervisor campo. A 390 px se verificaron selección con teclado y ausencia de desbordamiento documental. No se valida rendimiento de backend ni QA formal.

## Calibración de estructura y espaciado

Las tarjetas de la lista maestra tienen 10 px de separación. Su navegación muestra solo Anterior y Siguiente mediante botones publicados; la tabla del detalle conserva `Pagination`. El buscador pasa a la cabecera del detalle, se elimina el título y el contador visual repetidos y el contador sigue disponible como anuncio accesible. El acceso a permisos utiliza `IconButton` y `LockIcon` publicados con etiqueta y título accesibles. Verificados separación a 1280 px, paginación de 501 asignaciones y 503 usuarios, acción de permisos y ausencia de desbordamiento a 390 px. Pendiente revisión visual humana.

Calibración posterior: el icono queda al lado del buscador y alineado con el borde inferior del campo. El pie de la tabla se fija al fondo del área de detalle y los botones de la lista se distribuyen a los extremos. A 1280 px se midió la alineación inferior de ambos pies; a 390 px se comprobó la acción de permisos y la paginación de 501 usuarios sin desbordamiento.

Por indicación posterior de John, se retiró la cabecera visual de identidad del detalle y la acción de permisos pasó a cada tarjeta de rol con matriz demo disponible. Conserva `IconButton` publicado; el candado animado es un SVG local porque el icono publicado de candado es un único trazo sin apertura separable. El arco abre en hover o foco y cierra al salir, con transición desactivada por movimiento reducido. Verificados acción, foco, movimiento reducido, paginación con 501 usuarios y móvil a 390 px; no se modificó la librería.

Se retiró el buscador dentro del detalle; la tabla conserva la paginación y muestra la relación completa seleccionada. La búsqueda general filtra las tarjetas, sin recortar los integrantes del rol seleccionado. Verificado en móvil con una búsqueda de un usuario del escenario de 500: la tabla conserva 501 integrantes y permite avanzar a la segunda página sin desbordamiento.
