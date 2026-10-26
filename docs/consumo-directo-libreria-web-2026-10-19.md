# Consumo directo de la librería Web en la propuesta SIAL

Estado: arquitectura aprobada el 2026-10-19; migración en progreso. Plataforma: Web. Paquete instalado: `@banasandev/banasan-ui@1.4.0`. Esta propuesta no cambia la librería productiva ni la aplicación Web real.

## Camino único

Cada URL conserva su HTML como entrada ligera y una raíz React propia. La vista compone directamente los exports publicados del paquete; su estado, validación y reglas de la HU viven en la feature. Shell, navegación y tema conservan un único contrato compartido, que se migra sin inventar rutas ni permisos. No se adopta el scanner de selectores ni el DOM oculto como arquitectura final.

Una actualización de componente se realiza en la librería, se instala una versión publicada y se recompila la propuesta. La vista solo cambia si debe usar otra API, variante, contenido o composición. El paquete instalado, no una captura o el repositorio fuente, gobierna las props disponibles.

## Catálogo público que debe entrar al inventario

Fuente: `node_modules/@banasandev/banasan-ui/dist/index.d.ts` de la versión 1.4.0. Este es el alcance de descubrimiento, no una orden de insertar todos los componentes en todas las vistas.

| Capacidad | Exports públicos |
| --- | --- |
| Acciones | `Button`, `IconButton` |
| Estado e identificación | `Chip`, `RibbonCode`, `RibbonLabel` |
| Captura | `TextInput`, `NumberInput`, `SelectInput`, `SearchSelectInput`, `MultiSearchSelectInput`, `DateInput`, `CheckboxInput`, `OtpInput`, `RadioCard` |
| Feedback y carga | `Notice`, `Toast`, `ToastProvider`, `useToast`, `Spinner`, `Skeleton`, `SkeletonCard`, `SkeletonTable`, `SkeletonText` |
| Datos y navegación | `Table`, `TableRowActions`, `TableEmpty`, `Toolbar`, `Pagination`, `TreeList`, `TransferList` |
| Superficies y secuencias | `Card`, `CheckboxCard`, `Drawer`, `DrawerAuditItem`, `DrawerAuditList`, `WizardForm`, `WizardStep`, `useWizard`, `Slider`, `SliderFrame`, `ViewMotion` |
| Perfil | `ProfileDialog`, `ProfileFarmCarousel`, `ProfileMenu`, `Avatar`, `AvatarBadge`, `AvatarGroup`, `AvatarMenu` |
| Información operativa | `BarChart`, `LineChart`, `Timeline`, `CaseCarousel`, `CommentList`, `ControlPointList`, `EvidenceViewer`, `FlowTimeline`, `KeyValueGrid`, `AuditStatusDot` |
| Identidad e iconografía | `SialIcon`, `createSialIcon`, `sialIconNames`, `SialIsotype` y los iconos nombrados exportados por `Icons/named-icons` |
| Constantes de avatar | `AVATAR_SIZE_CLASSES`, `AVATAR_SHAPE_CLASSES`, `AVATAR_STATUS_COLORS`, `AVATAR_GROUP_SPACING`, `AVATAR_DEFAULTS` (API pública de apoyo, no controles visuales independientes) |

## Migración por vista y componente

1. Registrar `HU → acción → URL → componente visible`, forma de tarea, API publicada, variante y evidencia. Marcar cada pieza `directo`, `adaptador transitorio`, `local justificado`, `candidato` o `no aplica` con razón. Un componente disponible pero no usado no cuenta como adopción.
2. Migrar una familia vertical completa: HTML de entrada, estado y eventos React, componentes directos, estilos de composición, acceso desde menú y pruebas. Preservar datos y transiciones existentes; no copiar el HTML original como JSX oculto.
3. En una vista migrada, no permitir `.sial-native-proxy`, escaneo de selectores ni dos árboles para la misma interacción. Revisar tabla, filtros, formulario, estados, overlays, feedback y acciones que correspondan a esa vista, no solo el primer render.
4. Mantener el adaptador únicamente para vistas aún no migradas, con contador de consumidores. Retirar cada rama al llegar a cero consumidores; borrar el runtime legado solo cuando ninguna vista dependa de él.
5. Antes de declarar una vista directa: probar ruta y menú, datos/uno/cero/error, operaciones válidas e inválidas, teclado/foco, 1280 y 390 px, paquete compilado y ausencia de duplicados. La aprobación visual y publicación son gates separados.

## Primer piloto y límites

### Bloque local 19/10: shell y tres consultas directas

El shell compartido monta navegación y controles de expansión/tema desde una raíz React en las rutas que llaman `SIALCore.initShell`. Conserva el contrato `shared/sial-navigation-contract.js`, las claves `sial-nav-views:*`, `sial-sidebar-state-v2` y `sial-theme`, la vista activa y los enlaces entre carpetas. El perfil continúa con su implementación local: no se declara migrado a `ProfileMenu` sin comprobar su contrato completo. La búsqueda global sigue como composición local, sin atribuirle una búsqueda funcional que la propuesta no tenía. El renderizador DOM anterior queda como fallback de carga, no como árbol oculto cuando React monta. `ROUTER: SELF` por runtime y checkout compartidos.

`inventario-materiales-finca`, `inventario-pallets` y `movimientos-inventario` ahora tienen estado React propio y consumen directamente los controles publicados. En sus tres rutas se retiró `SIALMaterials.init()` y no se monta `.sial-native-proxy`. Se conservaron los registros semilla y `?material=`, filtros, contador, CSV, tabla, detalle y paginado; la evidencia de recorridos ejecutados se delimita en la matriz. El resto de Materiales aún usa el adaptador: tres migraciones no cierran el módulo de 19.

Build UI correcto y gate de rutas/contexto: 101 Web y 53 Móvil, cero enlaces rotos; gate estructural Web aprobado a 1280/390. Se probaron en navegador ruta activa, expansión y tema del shell, además de apertura/Escape/foco del sidebar a 390. La prueba manual de 86 rutas, todos los flujos de las 19 vistas y la aprobación visual permanecen pendientes. Ninguna publicación o cambio de Azure se realizó.

`categorias-pedido.html` ya tiene raíz React y usa controles publicados sin proxy. En esta sesión se sustituyó su drawer local de auditoría por `Drawer` + `DrawerAuditList` publicados. Se comprobaron apertura, contenido, cierre con Escape y retorno del foco al botón de auditoría; cero resultados, error de alta/cancelación, alta válida, edición e inactivación locales con restauración del almacenamiento, y ausencia de desborde a 390 px. El build UI y las pruebas de rutas pasaron: 101 Web, 53 Móvil, cero enlaces rotos; el gate runtime Web pasó. Faltan filtros combinados y paginación con más de una página antes de declararla normalizada.

`pedidos-recurrentes.html` continúa en el camino legado: el `Notice` visible es publicado, pero se monta sobre un HTML oculto. No clasificarlo como consumo directo. Será un piloto posterior de migración vertical, conservando la solicitud y decisión local.

`ROUTER: SELF`: el primer slice comparte runtime y checkout con cambios locales anteriores; la separación para un worker externo no aporta aislamiento de escritura ni ahorro de contexto. No se delega ni se modifica la librería productiva.

El registro generado de componentes canónicos aún informó `0` pese a detectar 177 identificadores técnicos. No se usa esa cifra para declarar adopción; habrá que corregir el mapeo de aliases y contrastar contra los exports del paquete antes de automatizar cobertura por vista.

### Segundo corte local: tablero y cuatro rutas de consulta/catálogo

`index`, `resumen-proveedores`, `seguimiento-entregas`, `gestion-proveedores` y `reglas-documentales` se montan ahora como features React sin llamar `SIALMaterials.init` ni conservar su DOM proxy. Las bandejas usan `TextInput`, `SelectInput`, `Chip`, `Button`, `Table`, `TableRowActions`, `Pagination`, `Drawer` e `IconButton` según su forma de tarea; los catálogos breves mantienen panel embebido, campos publicados, error inline y acciones centradas. Los datos y rutas semilla se preservaron. La generación y envío de resumen siguen siendo simulación de propuesta; los cambios de estado de catálogos son de sesión, no persistencia productiva.

El módulo cuenta nueve rutas React directas de 19; diez conservan adaptador o JavaScript legado. Build, validación de contexto, enlaces (101 Web/53 Móvil, cero rotos) y gate estructural Web pasaron. Esto no acredita todos los estados alternativos, decisiones de pedidos ni aprobación visual. La tarea Dona permanece En Progreso; no hay publicación ni cambios Azure.
