# Normalización Web — Gestión de usuarios

Fecha: 2026-10-15. Estado: parcial; no acredita QA funcional ni cierre de toda la propuesta.

## Decisión

- Forma de tarea: bandeja de gestión con registros comparables.
- Vía: `reuse` de la familia de bandejas maestras de Fincas. No se copia su contenido ni se añaden campos de negocio.
- Fuente: composición y comportamiento ya presentes en `Gestion de Usuarios/gestion-usuarios.html`; componentes publicados del paquete instalado `@banasandev/banasan-ui` 1.4.0.
- Se retiraron un aviso de regla permanente y cuatro métricas de demostración sin relación con las tres filas de la tabla. No se altera la regla de inactivación.

## Componentes y comprobaciones

| Pieza | Estado | Evidencia |
| --- | --- | --- |
| Búsqueda | `adapted` a `TextInput` | Montaje visible, valor sincronizado con filtro y resultado vacío. |
| Estado y empresa | `adapted` a dos `SelectInput` | Montaje visible; opciones originales conservadas. |
| Contador | `adopted` `Chip` | Tres registros iniciales; cero tras búsqueda sin coincidencias. |
| Filas y estados | `adapted` a `Table`, `TableRowActions`, `IconButton` y `Chip` | Una sola tabla visible con tres filas y tres acciones por fila; HTML previo funciona como fuente oculta. |
| Pie | `adopted` `Pagination` | Rango 1–3 de 3 y estado sin registros coherentes con el filtro. |
| Exportación, drawer y reglas de permisos | `pending` | Requieren recorrido funcional propio antes de declarar la vista completa. |

La vista se abre desde la navegación del módulo Usuarios. A 390 px no se observó desbordamiento horizontal y los tres controles apilan dentro de la toolbar. La propuesta no modifica la aplicación productiva.

El detalle se comprobó en ejecución: el `Drawer` de librería abre con los datos de `m.garcia`, cierra sin duplicar el drawer nativo y devuelve el foco a la acción de origen. La confirmación de inactivación se abrió y canceló, sin modificar datos. Exportación, contraste y recorrido completo de permisos continúan pendientes.

## Registro de usuario

Forma de tarea: formulario grande; vía `reuse` del contrato de captura por secciones, sin convertirlo en una tabla. Se montaron seis `TextInput`, cuatro `SelectInput` y dos `Button` compatibles con el adaptador. Fecha, contraseñas y selector de roles siguen `feature-local` porque el adaptador publicado usado aquí no cubre sus contratos específicos. El aviso de éxito dentro del formulario se sustituyó por un estado inline previo a las acciones, que aclara que el prototipo no persiste usuarios. A 1280 px los dos primeros campos comparten línea base y a 390 px no hay desbordamiento; el envío vacío marca los campos requeridos. Aún falta ejecutar un alta completa con asignación de roles y validación de teclado/foco.

## Edición de usuario

Forma de tarea: formulario grande con gestión relacional. Los seis controles del bloque de datos básicos y sus dos botones de acción consumen `TextInput` y `Button` de la librería; los campos bloqueados conservan su estado. El envío muestra un estado inline que aclara la ausencia de persistencia. El selector de empresa, las casillas de roles y las acciones relacionales siguen locales: no se atribuye a los botones una gestión funcional aún inexistente.

## Administración de permisos

Forma de tarea: matriz de permisos; no es una tabla de registros paginada. La barra superior consume dos `SelectInput`, un `TextInput` y dos `Button` de la librería. El filtro de búsqueda se sincroniza con la matriz: una consulta sin coincidencias muestra el vacío correspondiente. A 390 px no hay desbordamiento horizontal. La matriz, sus estados y reglas de cambios se mantienen específicos de la función; falta recorrer guardado, restablecimiento y todos los roles antes de declararla completa.

Validación de este bloque sobre el servidor de esta rama en `127.0.0.1:4175`: `pnpm build:ui` correcto. El servidor antiguo en `4173` entregaba otra copia, por lo que no se usó como evidencia. Decisión de delegación: `SELF`, dado que el slice depende de la misma capa de adaptación y del mismo estado local; no había una partición independiente útil.
