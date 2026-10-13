# Normalización de la propuesta Web con la librería

Fecha: 2026-10-13. Estado: tres vistas piloto de `Table`, cuatro catálogos simples de Fincas con `Table` adaptada y reparto transversal de controles publicados; la normalización integral de las 97 vistas sigue pendiente.

## Decisión de integración

- La propuesta consume `@banasandev/banasan-ui` versión `1.4.0`, la misma versión mayor del proyecto Web vigente (`origin/dev`, `22c5e7d0`).
- Vite compila React y los componentes de la librería a `shared/vendor/sial-ui-runtime.js` y `sial-ui-runtime.css`. Las tres vistas piloto cargan esos activos relativos; el núcleo los carga bajo demanda en las vistas heredadas que contienen controles de tabla aplicables, incluso cuando se renderizan después del arranque. No requiere servidor para abrirse como `file://` después de compilar.
- `src/web/main.jsx` registra vistas por `data-sial-react-view`; cada vista mantiene su HTML de entrada y el shell compartido. La adopción es gradual, no una reescritura de las 97 vistas.
- Los marcadores `data-sial-source`/`data-sial-component` de los pilotos y `data-sial-source`/`data-sial-component` del adaptador permiten auditar la procedencia. No equivalen por sí solos a una validación visual o funcional.

## Piloto: categorías de pedido

Vista: `Materiales y Suministros/categorias-pedido.html`, equivalente a `/admin/supplies/material-categories` y asociada a HU1918.

| Necesidad | Componente real | Composición |
| --- | --- | --- |
| Acción principal de tabla | `Button` filled | Primer botón, extremo superior derecho de la tabla |
| Total de registros | `Chip` informativo | Encabezado de la tabla, antes de la acción principal; refleja los filtros activos |
| Búsqueda y filtro | `TextInput`, `SelectInput` | Franja de filtros sobre los registros |
| Lista y acciones por fila | `Table`, `TableRowActions`, `IconButton` e iconos `ViewIcon`, `EditIcon`, `CloseIcon`/`CheckIcon` | Variante `ghost`, sin marco; desactivar rojo, activar verde, conservando las acciones funcionales por fila |
| Estado | `Chip` | Solo en la fila y el detalle; no se añade un estado obvio al formulario de alta |
| Paginación | `Pagination` | Pie de la misma tabla, con tamaño de página |
| Alta/edición pequeña | `TextInput`, `Button` | Formulario embebido entre filtros y filas; botones centrados, primaria a la derecha |

Se retiró de esta vista el bloque de aviso contextual y el chip de «Activo» del formulario de creación. La categoría nueva nace activa en los datos de demostración, sin ocupar espacio visual para informar un valor automático. La información de auditoría se conserva en un detalle invocado desde la fila.

## Verificación del piloto

- `pnpm build:ui`: compilación correcta.
- Navegador: render y acciones de crear, buscar, editar, inactivar y abrir auditoría comprobados con Playwright CLI; sin errores de consola tras la corrección del bundle.
- Captura a 1280 × 800 y a 390 × 844 revisadas. En ancho estrecho la tabla conserva desplazamiento horizontal interno; los filtros y el formulario se apilan.
- Apertura `file://` comprobada con Chrome en tema oscuro. Los activos se cargaron por rutas relativas.
- `scan-proposal.ps1`: 97 HTML, 515 enlaces/activos resueltos, 0 rotos.
- `validate-context.ps1`: válido, sin errores ni advertencias.
- `sync-product-design-context.ps1`: 1 vista con procedencia declarada, 0 hallazgos materiales de alineación Web. Esto **no** significa que las otras 96 vistas estén normalizadas.

## Límites y siguiente secuencia

1. El CSS publicado por la librería pesa 3,62 MB (1,61 MB gzip). Es un coste medido del paquete actual; el adaptador lo carga en las vistas heredadas que necesitan controles de tabla, no en las 97 indiscriminadamente. Evaluar estilos por componente en la librería en una tarea separada.
2. La persistencia del piloto es local al navegador (`localStorage`); la propuesta no sustituye API, permisos ni persistencia del producto.
3. El shell y el cajón de auditoría siguen siendo composición local. Deben contrastarse con los contratos de navegación y detalle del proyecto antes de migrarlos.
4. El adaptador de `SelectInput`, `Chip`, `IconButton` y `Pagination` se repartió por pertinencia y conserva eventos nativos mediante proxies. La migración de `Table` completo y formularios medianos/grandes sigue siendo por familia/HU. No aplicar el patrón de tabla a una vista transaccional por semejanza visual. Véase [el mapeo transversal](mapeo-patrones-web-2026-10-13.md).
5. La tarea de normalización Web permanece abierta hasta que **cada componente aplicable de cada vista vigente** esté clasificado, consuma la librería o tenga excepción semántica justificada. Una página con contador o filtro adaptado sigue parcial si conserva inputs, botones, estados o tabla propios sin revisión. El inventario inicial por vista está en [cobertura de componentes](cobertura-componentes-por-vista-2026-10-13.md); los faltantes del producto continúan en el backlog dependiente de la normalización.

## Extensión: maestras de transporte

Se migraron `Gestion de Transporte/gestion-categorias-licencia.html` y `Gestion de Transporte/gestion-tipos-vehiculo.html` con la misma composición de tabla/formulario breve. Las dos consumen componentes reales de la librería y comparan estructura y campos contra las rutas vigentes de transporte en Web. El contador superior usa `Chip` informativo con punto y se actualiza al filtrar; sustituye el texto plano del primer corte. Las acciones conservan consultar, editar y activar/inactivar, pero ahora usan los iconos publicados y `IconButton` `ghost` del producto, sin los bordes del primer corte. No se añadió el botón de cuadrícula de la referencia porque estas vistas no tienen un modo de cuadrícula funcional.

Para reproducir: `pnpm install`, `pnpm build:ui`, abrir `Materiales y Suministros/categorias-pedido.html`. El registro privado de Banasan se declara en `.npmrc`; los activos compilados permiten consultar el piloto sin instalar dependencias.

## Primer bloque del plan integral: formularios breves de Fincas

El 2026-10-13 se conectaron los campos de los formularios embebidos de Clases de referencia, Grupos, Productos y Sectores a los componentes publicados `TextInput` y, en Clases, `SelectInput`. La propuesta conserva controles nativos ocultos como puente para las reglas y eventos existentes; los campos visibles son instancias de la librería, con valor, ayuda, requerido y error sincronizados. El adaptador es opt-in por `data-sial-form-control`, no transforma otros formularios por semejanza de clases.

Comprobación técnica en navegador local: los cinco campos se montan en las cuatro vistas; en Clases, escritura en minúsculas llegó en mayúsculas al control nativo y visible, la opción seleccionada se propagó, la validación de duplicado apareció en el componente y cancelar limpió valor/error antes de reabrir. `pnpm build:ui` terminó correctamente. Esto **no** certifica las cuatro vistas: los demás componentes aún requieren clasificación/adopción o excepción documentada, junto con QA formal por HU. La cobertura integral de las 97 vistas permanece abierta.

## Segundo bloque: búsqueda y botones en las cuatro bandejas de Fincas

Clases, Grupos, Productos y Sectores montan ahora `TextInput` real para la búsqueda y `Button` real para alta, exportación cuando existe, cancelar y guardar. Los controles nativos ocultos conservan filtros, exportación CSV y validación/submit; el foco vuelve al botón visible al cancelar. El botón primario permanece arriba a la derecha de la tabla y las acciones del formulario siguen centradas. En móvil, el contador ocupa una fila propia para mantener los botones de acción juntos y la primaria a la derecha. La búsqueda conserva semántica `searchbox` aunque la librería publique `TextInput` solo con tipo `text`.

Comprobación técnica: en Clases la búsqueda redujo de dos a una fila y el formulario abrió/cerró con foco en el campo visible; en Grupos `Exportar` descargó `grupos-registrados.csv` y `Guardar grupo` vacío mostró el error obligatorio en el campo de librería. Se inspeccionaron capturas a 1280 px y 390 px; el contador móvil queda sobre las acciones y `Nuevo grupo` a la derecha. `pnpm build:ui`, `git diff --check` y `run-tests.ps1` pasaron; la suite encontró 97 HTML Web, 49 móviles y cero enlaces rotos. Continúan parciales: notices contextuales, cajones de detalle, botones del cajón y semántica de cada estado requieren clasificación; no se aplica un reemplazo global por clases CSS.

Delegación de este bloque: `SELF`; el adaptador, la lógica nativa ya presente y el estado local sin publicar forman un slice acoplado que no aporta independencia al separarlo.

## Bandejas maestras de Fincas y Referencias: cierre parcial del hueco visible

`gestion-fincas.html` y `gestion-referencias.html` usan ahora `Table` con `TableRowActions`/`IconButton`, `TextInput`, `SelectInput`, `Chip`, `Button` para exportar, `Pagination`, `Drawer` y `DrawerAuditList` de `@banasandev/banasan-ui`. Se conservan los manejadores existentes a través del HTML fuente oculto. El cajón mantiene datos, auditoría y geolocalización, y al cerrarlo devuelve el foco a la acción de fila. Los avisos contextuales que repetían reglas se quitaron; las reglas pertinentes quedaron en la descripción de la bandeja.

No se fuerza `Button` sobre navegación: alta, edición y copia conservan enlaces reales porque el paquete no publica una variante `LinkButton` equivalente. El icono de copiar es local dentro del `IconButton` de la librería; el paquete no publica `CopyIcon`. Las confirmaciones de activar/inactivar siguen siendo del flujo heredado y requieren una revisión específica antes de declarar normalizada cada vista.

El adaptador asigna a `Exportar` la tabla fuente concreta para que el CSV no duplique filas con la tabla renderizada; el serializador respeta el espacio en saltos `<br>` de auditoría. En navegador se verificó exportación de Fincas (encabezado y dos filas sin duplicados), detalle y retorno del foco, copia de referencia hacia el formulario con parámetros correctos y composición móvil de Referencias a 390 px. `pnpm build:ui` pasó. Son comprobaciones de prototipo, no una certificación de QA de la HU.

## Avisos con propósito y cajones de catálogos breves

Se confirmó que la librería instalada publica `Notice` (`info`, `warning`, `success`, `error`). El adaptador opt-in usa esa implementación real solo en la advertencia operativa de `matriz-documental-vehiculos.html`: documentos vencidos o por vencer requieren revisión antes de asignar un vehículo. El HTML de respaldo queda oculto para no duplicar el mensaje. Se verificó una sola instancia visible en escritorio y a 390 px.

En Clases, Grupos, Productos y Sectores de Fincas, y en Dependencias, las barras superiores repetían una regla de inactivación o validación que ya se puede expresar junto al listado o al campo. Se retiraron y se conservó la regla en la descripción de la bandeja o en la ayuda del campo. El éxito de sus formularios dejó de usar la caja de aviso: se muestra como `form-feedback` inline con `role=status`. En los cuatro catálogos de Fincas, el detalle lateral se adaptó a `Drawer`/`DrawerAuditList` de la librería; Grupos se probó con abrir, cerrar y retorno del foco al disparador. Esta elección es de familia para catálogos breves; no elimina los avisos de riesgo o feedback necesarios en otras formas de tarea.

Permanecen pendientes la clasificación de otros avisos estáticos y dinámicos, la confirmación de estado y los componentes restantes por vista. Que una vista use `Notice` o `Drawer` no significa que esté normalizada por completo.

Delegación: `SELF`. Slice: integración de la librería Web y una vista piloto. El estado local, el contrato de archivos estáticos y la composición visual están acoplados; separar el slice no aportaba una revisión independiente útil.
