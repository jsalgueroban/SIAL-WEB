# Operaciones Puerto · normalización visual cerrada

## Alcance

Seis vistas: Contenedores, Programación, Trazabilidad de pallets, Tipos, Etapas y Puertos; índice conserva navegación. Perfil local de propuesta Web. Skills de propuestas SIAL y librería consultadas; Dona conserva tarea transversal. SELF: estado de demostración y adaptadores compartidos, sin slice independiente que compense transferir contexto. No se modifica paquete productivo ni backend.

## Componentes y decisiones

- Las seis tablas consumen Table publicado. Programación y Trazabilidad conservan renderizadores de celdas, acciones y paginación existente mediante el adaptador de Pagination.
- Programación usa DateInput y MultiSearchSelectInput de @banasandev/banasan-ui 1.4.0; tipos/props verificados en paquete instalado. La selección sincroniza contenedores disponibles, selección múltiple y cambios de semana con la simulación existente. Textarea de observación permanece local por ausencia de equivalente publicado.
- Contadores y estados usan Chip. «En finca» usa la anatomía publicada de estado con indicador cuadrado de 6 px, contorno uniforme y tokens neutros mediante un wrapper compartido por tabla y detalle; se retira la raya lateral de la variante de etiqueta. Los demás tonos conservan su semántica.
- Formularios: Button, TextInput, SelectInput y NumberInput; Capacidad deja la excepción nativa. Editar precarga los datos de la fila y no rechaza su propio código/nombre como duplicado.
- Formulario de programación valida, confirma antes de agregar registros simulados y devuelve Toast de resultado. Catálogos muestran Toast de datos validados, sin éxito fijo duplicado: conservan su alcance demostrativo, sin afirmar escritura real.
- Drawers publicados preservan datos y cierre, incluido el identificador particular del drawer de programación. Se retira UUID técnico y se traduce la validación interna a lenguaje de usuario.
- Notice publicado para novedad del pallet, sin repetir el título. Trazabilidad conserva composición contextual del recorrido/eventos. No se impone una tabla o árbol genérico a su detalle.
- Tildes en títulos, columnas y labels; filtros usan buscador publicado y escoba/movimiento compartidos.

## Evidencia

- Build UI aprobado; sintaxis JS y diff --check sin errores.
- Gate transversal 45/45: output/puerto-gate-20261103.json. No acredita por sí solo cada flujo particular.
- Seis rutas × 1280/390: búsqueda sin resultado, escoba visible, limpieza que devuelve búsqueda vacía, Table montado, sin errores JS ni desbordes.
- Editar en los cuatro catálogos precarga valores y valida sin falso duplicado; Toast de validación. Tipos vacío presenta tres errores obligatorios.
- Programación: envío vacío informa error; selección real de contenedor por MultiSearchSelectInput; confirmación agrega una fila, contador 4→5 y Toast; se conserva actualización de disponibilidad.
- Puertos: selección real Inactivo devuelve una fila, limpiar restaura; inactivación abre confirmación con identidad de fila. Drawer de puerto consultado.
- Drawer de programación muestra fila correcta y su botón de cierre lo oculta.
- Trazabilidad: estado Con novedad filtra, acción abre detalle y Notice; se eliminó duplicación del mensaje.
- Movimiento capturado: reacomodo con rebote 520 ms y entrada 480 ms; con movimiento reducido no hay animaciones farm-filter-layout.
- Captura móvil de programación inspeccionada: output/puerto-programacion-mobile-20261103.png. Tema oscuro/movimiento reducido recorridos en validación y trazabilidad; sin desbordes.

## Estado

**Cerrado con aprobación visual explícita de John el 03/11/2026**, posterior al ajuste final de «En finca». El usuario confirmó: «Ya revisé visualmente Operaciones Puerto y me gusta. Culmina y cierra el módulo». La compilación del ajuste final aprobó y se comprobó el indicador y los bordes en tabla y detalle; captura: `output/puerto-chip-neutro.png`. La evidencia anterior permanece vigente; este cierre documental no supone una nueva ejecución de los recorridos.

Persistencia de catálogos y reglas productivas no forman parte de esta normalización; sus formularios validan datos de demostración. No se ha publicado el código remoto ni se han extendido los componentes del paquete. Las excepciones se mantienen explícitas.

La normalización global continúa abierta. Tras completar los bloques restantes, se abordarán vistas y flujos específicos con criterio de negocio, separando decisiones locales de patrones compartidos y conservando componentes de la librería. Las mejoras posteriores se registrarán como nuevas revisiones sobre esta base aprobada.
