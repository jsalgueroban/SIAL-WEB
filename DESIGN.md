---
name: SIAL Web Design System
version: 1.2.0
status: vigente
language: es-CO
lastUpdated: 2026-10-05
owners:
  - Producto SIAL
  - Diseño UI/UX SIAL
platforms:
  - Propuesta Web HTML/CSS/JavaScript
  - Frontend Web productivo
---

# Sistema de diseño SIAL Web

## 1. Propósito

Este documento es el contrato visual, interactivo y de experiencia para las vistas Web de SIAL. Documenta la identidad que ya utiliza la propuesta y evita que cada módulo cree colores, tipografías, componentes o patrones incompatibles.

`SIAL Web - Propuesta` es una propuesta navegable, no un backend ni el frontend productivo. Sus vistas comunican intención funcional y visual. La implementación real debe respetar su arquitectura, librería y contratos técnicos; este documento no autoriza copiar literalmente HTML, CSS o JavaScript del prototipo.

Este documento define:

- identidad y principios de interfaz;
- tokens visuales y de movimiento;
- anatomía y comportamiento de componentes;
- shell, navegación, formularios, tablas, estados y feedback;
- criterios para vistas densas, tableros y experiencias por rol;
- accesibilidad, contenido y validación visual;
- reglas para extender la librería sin fragmentarla.

Este documento no define:

- reglas de negocio no aprobadas;
- contratos de API o persistencia;
- roles y permisos concretos;
- indicadores sin fuente funcional;
- comportamiento productivo simulado por el prototipo.

## 2. Fuentes de verdad

No existe una única fuente para todas las dimensiones:

1. La HU, el backend y las decisiones aprobadas gobiernan la funcionalidad.
2. Este `DESIGN.md` gobierna la intención visual y de experiencia.
3. El paquete Web instalado gobierna componentes, props, variantes y tokens reutilizables.
4. El frontend productivo gobierna rutas, permisos, shell y navegación.
5. La propuesta gobierna exploración y composición aprobada, no implementación productiva.
6. `shared/sial-core.css`, `shared/sial-core.js` y `shared/componentes.html` son adapters del prototipo.
7. Las referencias externas solo aportan candidatos y nunca prevalecen sobre SIAL.

Una pantalla local no crea una regla global. Si un patrón se repite o debe reutilizarse, se normaliza primero en `shared` y luego se consume desde los módulos.

El inventario completo y la matriz de adopción están en [`shared/patrones-de-diseno-web.md`](shared/patrones-de-diseno-web.md). Deben revisarse antes de agregar CSS local para distinguir canon, composición de dominio, candidato visual y deuda de migración.

### 2.1 Sincronización con producto y librería

El estado volátil no se mantiene manualmente en este documento. La skill de propuestas
genera `.sial-design-map/product-library-alignment.generated.json` y
`.sial-design-map/product-library-drift.generated.md` desde la aplicación, el paquete y
esta propuesta. Esos artefactos registran versión consumida, exports públicos, imports,
rutas, navegación, procedencia y adopción.

El menú aprobado y sanitizado vive en `shared/sial-navigation-contract.js`; el core lo
carga y renderiza sin sesión, backend ni permisos productivos. El mapa
`.sial-design-map/web-product-map.generated.json` contrasta ese contrato con la
aplicación Web principal. Las asociaciones confirmadas viven en
`shared/sial-route-map.json`; las coincidencias automáticas permanecen como candidatas.
Si el árbol real procede del backend, su jerarquía, orden y permisos solo se consideran
verificados mediante un snapshot runtime sanitizado.

Toda pieza reutilizable se clasifica como `library`, `library-variant`,
`library-composition`, `feature-local`, `proposal-only`, `candidate`, `legacy` o
`non-replicable`. Los adapters HTML declaran `data-sial-component`, `data-sial-source`
y, cuando aplique, `data-sial-variant`. La coincidencia visual no prueba que exista una
API productiva.

Los estados de adopción son `proposal-only`, `library-candidate`,
`published-not-adopted`, `adopted-product-proposal-pending`, `aligned` y `validated`.
Diseñado, publicado, consumido y validado son hechos distintos.

La navegación de la propuesta debe reproducir la anatomía y los estados del menú
productivo mediante perfiles sanitizados. El registry estático de la propuesta no es
autoridad sobre niveles, ramas, selección, permisos, rutas o comportamiento responsive.

La representación aprobada usa navegación ramificada: cada módulo es un nodo principal,
sus vistas forman ramas conectadas y la ruta activa mantiene tronco, curva y marcador de
acento. La expansión es independiente y persistente por módulo. El mismo contrato cubre
sidebar expandido y colapsado en escritorio, overlay móvil, foco visible y reducción de
movimiento; las vistas no mantienen copias locales del menú.

### 2.2 Auditoría de madurez visual — 2026-08-21

La base original resolvía correctamente shell, gestión, formularios, tablas y estados. Las vistas recientes de Inicio, Avisos de corte, Trazabilidad de pallets y POMA añaden mayor intención visual: contexto de decisión, estados de preparación, datos de solo lectura agrupados, impacto calculado y trazabilidad verificable. Esa riqueza se convierte en referencia para necesidades equivalentes, no en una obligación decorativa para todas las páginas.

| Necesidad transversal | Canon | Referencias maduras | Pertenece al dominio |
| --- | --- | --- | --- |
| Condición para ejecutar una acción | `.sial-readiness-grid` | POMA, publicación y validación de planeación | Reglas que habilitan o bloquean la HU |
| Datos consolidados de solo lectura | `.sial-key-value-grid` | POMA, detalle de avisos y perfil | Etiquetas, datos y permisos de cada entidad |
| Gestión densa | toolbar, tabla, paginación, `error-state` | Avisos, transporte, usuarios, fincas y materiales | Columnas y filtros propios de cada catálogo |
| Trazabilidad | timeline, auditoría, detalle lateral | Trazabilidad/Puerto y POMA | Eventos, cálculos y evidencia del proceso |

Los mapas de estiba, matrices de asignación, cálculo de impacto, POMA, indicadores y calendarios no se promueven como controles genéricos: son composiciones de dominio que consumen el canon sin trasladar sus reglas a otras vistas.

## 3. Personalidad y principios

SIAL Web es operativo, confiable, sobrio y legible. La interfaz privilegia datos, estados y acciones sobre decoración. Su carácter proviene del azul SIAL, la tipografía Poppins, superficies limpias y una estructura constante entre módulos.

### 3.1 Operación primero

Cada vista debe facilitar una tarea o decisión reconocible. No se agregan métricas, cards, ilustraciones o controles si no ayudan a actuar, comparar o comprender.

### 3.2 Continuidad entre módulos

Planeación, Materiales, Transporte, Puerto y Trazabilidad pertenecen al mismo sistema, aunque sus roles y flujos sean distintos. Deben compartir shell, controles, estados, tablas y lenguaje visual.

### 3.3 Visibilidad según rol

La interfaz muestra únicamente módulos, datos y acciones autorizados. Un dashboard no supone acceso global. La ausencia de una etapa por permisos no se presenta como error ni se reemplaza con datos simulados.

### 3.4 Densidad controlada

SIAL administra mucha información. La densidad se resuelve con jerarquía, agrupación y ancho adecuado, no reduciendo excesivamente tipografía o espaciado.

### 3.5 Estado honesto

Los estados visibles deben corresponder a una condición real o a una simulación claramente identificada. `Guardado`, `publicado`, `sincronizado`, `aprobado` y `completado` no son equivalentes.

### 3.6 Una acción principal por contexto

Cada página, sección o modal tiene una acción principal. Las acciones secundarias se mantienen visibles sin competir. Las acciones destructivas se separan y explican.

### 3.7 Sin duplicación

No se repite la misma métrica, filtro, instrucción o estado en dos componentes cercanos. Si la tabla ya comunica una cantidad, un indicador superior solo se conserva cuando aporta comparación o prioridad.

### 3.8 Lenguaje del usuario

La interfaz nombra operaciones, documentos y resultados reconocibles. Se evitan términos técnicos de implementación, códigos internos e instrucciones dirigidas al equipo de desarrollo.

## 4. Tokens visuales

La autoridad técnica actual es `shared/sial-core.css`. Los valores siguientes documentan sus tokens vigentes.

### 4.1 Marca y acción

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `primary-50` | `#F2F7FC` | `#102B45` | Fondo azul suave |
| `primary-100` | `#E6F0F8` | `#12345A` | Selección y énfasis suave |
| `primary-500` | `#005CA8` | `#1D7FE0` | Acción principal y enlaces activos |
| `primary-600` | `#004A87` | `#176BC0` | Hover o énfasis |
| `primary-700` | `#003766` | `#12559A` | Estado presionado |
| `on-primary` | `#FFFFFF` | `#FFFFFF` | Contenido sobre azul |

El azul SIAL es el color primario de acción. El amarillo institucional se utiliza con moderación en identidad o advertencia; no reemplaza el azul en botones principales.

### 4.2 Semántica

| Estado | Color principal | Fondo claro | Fondo oscuro |
|---|---|---|---|
| Éxito | `#2E7D32` | `#EDF7ED` | `#153322` |
| Advertencia | `#D4A800` | `#FFF7CC` | `#3B2F10` |
| Error | `#D32F2F` | `#FDECEA` | `#3B171A` |
| Información | `#0288D1` | `#E3F2FD` | `#143142` |

El color nunca es la única señal. Todo estado relevante incluye texto y, cuando corresponde, icono o explicación.

### 4.3 Superficies y texto

| Rol | Claro | Oscuro |
|---|---|---|
| Fondo | `#F5F7FA` | `#0F1724` |
| Superficie | `#FFFFFF` | `#151E2D` |
| Superficie elevada | `#FFFFFF` | `#1B2636` |
| Overlay | `#FFFFFF` | `#223048` |
| Borde | `#D9DDE3` | `#2E3B52` |
| Borde sutil | `#E7EAF0` | `#253247` |
| Texto principal | `#1A1F36` | `#F3F6FB` |
| Texto secundario | `#5B6475` | `#C3CBDA` |
| Texto terciario | `#8C94A6` | `#94A0B6` |
| Fondo de campo | `#FFFFFF` | `#101928` |

Las sombras se reservan para superficies elevadas y overlays. Las secciones ordinarias se separan primero mediante fondo, borde y espaciado.

### 4.4 Tipografía

Familia oficial: `Poppins`, con fallback `Segoe UI`, `Arial`, `sans-serif`.

| Rol | Tamaño | Peso | Uso |
|---|---:|---:|---|
| Título de página | 28 px | 600 | Nombre principal de la vista |
| Título de sección/card | 18 px | 600 | Agrupación funcional |
| Subtítulo | 14 px | 400–500 | Contexto e instrucciones |
| Cuerpo | 14 px | 400 | Contenido estándar |
| Etiqueta | 12–13 px | 600 | Campos y metadatos |
| Ayuda | 12–13 px | 400 | Restricciones y estado secundario |
| Botón | 14 px | 600 | Acciones |
| Dato destacado | 20–32 px | 600–700 | Métrica relevante |

Los datos numéricos y tabulares deben utilizar cifras tabulares cuando la fuente lo permita. No se disminuye el cuerpo para hacer caber una tabla; primero se revisan anchos, wrapping y contenido.

### 4.5 Espaciado y forma

La escala usa base de 4 px: 4, 8, 12, 16, 20, 24 y 32 px.

| Token | Valor | Uso |
|---|---:|---|
| `radius-control` | 8 px | Botones, inputs y selects |
| `radius-surface` | 12 px | Cards y paneles |
| `radius-pill` | 999 px | Chips, badges y estados compactos |
| `shadow-elevated` | `0 4px 16px rgba(16,24,40,.08)` | Elevación discreta |
| `shadow-overlay` | `0 12px 32px rgba(16,24,40,.16)` | Modal o capa contextual |

Los controles no deben convertirse indiscriminadamente en pills. La forma pill comunica estado, cantidad o selección compacta.

### 4.6 Iconografía y marca

- Icono base: 18–20 px.
- Trazo: 2 px, terminales redondeadas.
- Usar una sola familia visual de SVG funcionales.
- Los botones de solo icono requieren `aria-label`.
- No usar emojis ni caracteres Unicode como iconos.
- La marca utiliza `shared/brand/isotipo-sial.svg`.
- El logo no se repite dentro de banners, alertas, toast o modales.

## 5. Shell y navegación

### 5.1 Anatomía

El shell estándar utiliza:

1. sidebar de módulos y vistas;
2. header de 64 px;
3. contenido principal centrado hasta 1280 px;
4. perfil, tema y acciones globales en el header.

Tokens vigentes:

- Sidebar expandido: 264 px.
- Sidebar colapsado: 72 px.
- Header: 64 px.
- Página: `max-width: 1280px`.

### 5.2 Sidebar

- Se genera mediante `SIALCore.initNavigation`.
- Solo muestra módulos y vistas permitidos.
- La vista activa se comunica con color, peso e indicador lateral.
- El colapso conserva iconos y nombres accesibles.
- En viewport reducido se comporta como navegación superpuesta con backdrop.
- No se crea una navegación paralela dentro de cada módulo.

### 5.3 Encabezado de página

Orden recomendado:

1. etiqueta de módulo o `page-eyebrow`;
2. título;
3. descripción breve orientada a la tarea;
4. acciones principales cuando no pertenecen a una card de gestión.

Si la acción opera sobre una tabla o bandeja, debe ubicarse en el encabezado de ese contenedor, como ocurre en otras vistas SIAL.

### 5.4 Responsividad

- La experiencia se diseña primero para escritorio operativo.
- En anchos menores, grids pasan progresivamente de tres a dos y una columna.
- Las tablas conservan scroll horizontal cuando reducir columnas afectaría comprensión.
- El sidebar pasa a overlay alrededor de 900 px.
- Botones y filtros pueden envolver o apilarse sin perder orden de prioridad.
- Ninguna acción crítica queda fuera del viewport o cubierta por otra superficie.

## 6. Estructura de páginas

### 6.1 Bandeja o gestión

Anatomía recomendada:

1. título y propósito;
2. acción principal dentro de la card de gestión;
3. toolbar de búsqueda y filtros;
4. tabla o listado;
5. paginación y resumen de registros;
6. estados vacío, loading y error dentro del mismo contenedor.

No duplicar pestañas, filtros y métricas que representen exactamente la misma clasificación.

### 6.2 Formulario

Anatomía:

1. contexto de la operación;
2. secciones por concepto de negocio;
3. campos y ayudas;
4. validación inline;
5. resumen o impacto cuando sea necesario;
6. acciones de guardar, cancelar o completar.

Los formularios extensos pueden usar secciones o pasos únicamente cuando existe una secuencia real. No se numeran bloques como recurso decorativo.

### 6.3 Consulta y detalle

Una vista de consulta permite buscar, filtrar, ordenar y revisar detalle. No incorpora acciones de creación o edición que contradigan su propósito. La información histórica se presenta de solo lectura.

### 6.4 Dashboard e Inicio

- El contenido se construye según rol y permisos.
- Cada indicador debe permitir interpretar o actuar.
- No existe un tablero global obligatorio para todos los usuarios.
- Los módulos restringidos se omiten; no se presentan deshabilitados sin razón funcional.
- Las etapas de un flujo pueden resumirse si expresan continuidad real.
- Una bienvenida utiliza lenguaje operativo, no tecnicismos como alcance, RBAC o módulos visibles.

## 7. Componentes

### 7.1 Botones

Variantes compartidas:

| Variante | Uso |
|---|---|
| Primario | Acción principal del contexto |
| Secundario | Alternativa válida de menor jerarquía |
| Ghost | Navegación o acción terciaria |
| Danger | Acción destructiva o de alto riesgo |
| Icon-only | Acción compacta con nombre accesible |

Estados obligatorios: default, hover, active, focus-visible, disabled y loading.

Reglas:

- Altura mínima habitual: 44 px.
- Un botón loading conserva ancho e impide doble activación.
- Usar verbo + objeto: `Crear aviso`, `Guardar borrador`, `Publicar versión`.
- Evitar `Aceptar` cuando pueda nombrarse el resultado.
- La acción destructiva explica exactamente qué se elimina, descarta o inactiva.

### 7.2 Cards y paneles

Las cards agrupan una tarea, un conjunto relacionado o una superficie interactiva. No se envuelve cada dato en una card.

- Header: título, descripción y acciones.
- Body: contenido con padding coherente.
- Footer: acciones o paginación cuando corresponda.
- Los bordes y fondos separan; las sombras no deben crear un mosaico flotante innecesario.

### 7.3 Campos

Anatomía:

1. label visible;
2. control;
3. ayuda o restricción;
4. mensaje de error o éxito.

Estados: vacío, con valor, hover, focus, read-only, disabled, error y success.

- No usar placeholder como única etiqueta.
- Read-only debe distinguirse de disabled.
- El error explica cómo corregir el dato.
- Fecha, cantidades y códigos usan formato y unidad inequívocos.
- Los campos calculados no deben parecer editables.

### 7.4 Tablas

Las tablas son el patrón principal para conjuntos comparables y operaciones de gestión.

- Encabezados breves y consistentes.
- Alineación numérica deliberada.
- Columnas dimensionadas según contenido; no todas tienen el mismo ancho.
- Las celdas permiten wrapping cuando el dato lo exige.
- Identificador principal y acción deben permanecer reconocibles.
- Los estados usan el componente compartido, no estilos locales.
- La columna de acciones agrupa controles sin crear botones de ancho excesivo.
- El toolbar y encabezado de tabla comparten la misma identidad que `shared/componentes.html`.
- La exportación usa `data-export-table` y omite la columna `Acciones`.

En tablas tipo Excel:

- mantener navegación por teclado;
- diferenciar editables, calculadas y errores;
- conservar encabezados visibles;
- evitar columnas decorativas o selecciones sin función;
- no comprimir la fila para ocultar desbordes.

### 7.5 Chips, tags y estados

- `status`: condición del registro.
- `chip`: selección, filtro o dato compacto.
- `tag`: clasificación secundaria.

Usar texto breve y color semántico. No introducir colores por módulo. Un chip no sustituye un botón si realiza una acción importante.

### 7.6 Toolbar y filtros

- Búsqueda primero cuando aplica a todo el conjunto.
- Filtros ordenados de general a específico.
- Un mismo criterio no aparece simultáneamente como tabs y select.
- Los filtros activos deben poder identificarse y restablecerse.
- En responsive, los filtros se apilan conservando su orden.

### 7.7 Paginación

La base compartida admite 10, 30 y 50 registros. Debe mostrar rango visible, total, tamaño de página y navegación. Los controles deshabilitados conservan legibilidad.

### 7.8 Drawer, modal y página

El drawer existe en la librería de la propuesta, pero **no es el patrón predeterminado del frontend productivo**.

- Página: procesos completos, navegación, edición extensa o contenido que necesita URL propia.
- Modal: confirmación o captura breve que bloquea el contexto.
- Drawer: detalle contextual no obligatorio, cuando el producto real ya use este patrón o exista aprobación expresa.

No crear drawers para evitar diseñar una vista real. Un flujo con decisiones, formularios extensos o navegación debe resolverse como página o modal compatible con la arquitectura existente.

## 8. Feedback y estados

### 8.1 Selección del patrón

| Necesidad | Patrón |
|---|---|
| Confirmación breve | Toast |
| Error corregible en la vista | Inline |
| Condición global persistente | Banner |
| Decisión crítica | Modal |
| Falla dentro de tabla/card | `error-state` embebido |
| Falla de página | Página 401, 403, 404, 500 o 503 |

### 8.2 Alertas

Las variantes `notice-info`, `notice-warning`, `notice-error` y `notice-success` usan fondo, texto, borde e icono semánticos.

- El mensaje indica qué ocurrió y qué debe hacer el usuario.
- Reservar `notice` para estados accionables: información necesaria para continuar, advertencia, bloqueo, error o confirmación. No usarlo para mostrar números de HU, alcance de canal, contratos futuros ni documentación interna de la propuesta.
- Si un texto solo orienta sobre el propósito normal de la vista, integrarlo de forma breve en el subtítulo o eliminarlo cuando ya resulte evidente por el título y el contenido.
- No repetir el logo.
- No usar bordes laterales gruesos como única identidad.
- No duplicar un error simultáneamente como toast e inline.

### 8.3 Modal

Debe incluir título orientado a la decisión, consecuencia, acciones explícitas, foco inicial, trampa de foco y retorno al disparador. Si no es descartable, Escape y backdrop no lo cierran.

La información se presenta de forma compacta. No usar cards individuales para cada dato cuando una lista o resumen transmite mejor el alcance.

### 8.4 Vacío, loading y error

- Vacío: explica qué falta y cuál es la siguiente acción válida.
- Loading: conserva la estructura y no produce saltos de layout.
- Error: conserva los datos válidos y ofrece corrección o reintento cuando aplica.
- Skeleton: se usa cuando se conoce la forma del contenido final.

## 9. Movimiento

Tokens vigentes:

| Token | Duración | Uso |
|---|---:|---|
| `motion-fast` | 160 ms | Press, cierre y feedback inmediato |
| `motion-base` | 220 ms | Cambio de estado y controles |
| `motion-slow` | 340 ms | Entrada de superficie o vista |
| `motion-loading` | 900 ms | Loading continuo |
| `ease-standard` | `cubic-bezier(.2,.8,.2,1)` | Movimiento habitual |
| `ease-emphasis` | `cubic-bezier(.16,1,.3,1)` | Entrada destacada |

Reglas:

- Animar para comunicar continuidad, progreso o resultado.
- Preferir opacity y transform.
- No fingir avance de una operación.
- No usar rebotes, pulsos permanentes o stagger extensivo.
- Respetar `prefers-reduced-motion`.
- `SIAL View Motion` es reversible y puede deshabilitarse por vista.

La carga de archivos puede mostrar progreso, análisis y resultado, pero la animación refleja un estado real o una simulación claramente indicada en el prototipo.

## 10. Dark mode

- Se controla mediante `data-theme` en `document.documentElement`.
- Se persiste con la llave `sial-theme`.
- Cada vista incluye inicialización temprana para evitar parpadeo.
- Los módulos consumen tokens; no duplican una paleta oscura local.
- Estados, tablas, gráficos, overlays y campos deben validarse en ambos temas.

## 11. Accesibilidad

- Contraste WCAG AA para texto y controles esenciales.
- Foco visible con anillo de 2 px.
- Orden de tabulación lógico.
- Labels asociados a campos.
- Botones de icono con nombre accesible.
- Estados no dependientes solo del color.
- Encabezados semánticos y estructura comprensible.
- Tablas con encabezados y nombres accesibles.
- Modales con `aria-labelledby`, `aria-describedby` y manejo correcto de foco.
- Soporte para zoom y texto largo sin ocultar acciones.
- Reducción de movimiento respetada.
- Objetivo mínimo de 44 × 44 px en controles críticos y responsive táctil.

## 12. Contenido y terminología

### Voz

Directa, profesional y orientada a la operación. Español colombiano claro.

### Acciones

Usar verbo + objeto y mantener el mismo término durante el flujo. Si el botón dice `Publicar versión`, el resultado confirma `Versión publicada`.

### Instrucciones

- Explicar la acción, no la implementación.
- Evitar nombres de variables, estados técnicos o códigos internos.
- HU, evento y metadatos técnicos pueden aparecer en detalle o auditoría, no como instrucción principal.
- Las abreviaturas se expanden cuando el operador no puede inferirlas.

### Mensajes

Un mensaje responde:

1. qué ocurrió;
2. sobre qué operación o dato;
3. qué puede hacer el usuario.

## 13. Patrones por tipo de trabajo

### 13.1 Operación tipo Excel

Se utiliza cuando los usuarios trabajan con muchas filas comparables y necesitan captura rápida.

- navegación con Tab, Shift + Tab y Enter;
- encabezados persistentes;
- validación por celda y fila;
- columnas calculadas claramente diferenciadas;
- importación con vista previa;
- errores sin borrar datos válidos;
- acciones globales fuera de la grilla.

Visualmente sigue siendo SIAL: tipografía, campos, bordes, estados y botones compartidos.

### 13.2 Versionado y publicación

- Un borrador puede editarse.
- Una versión publicada se consulta en solo lectura.
- Una corrección genera una nueva versión cuando esa sea la regla aprobada.
- El modal de publicación resume consecuencias y alcance sin exceso de cards.

### 13.3 Auditoría

La auditoría muestra actor, fecha, acción, estado anterior/nuevo y contexto. No permite reescribir eventos históricos. Se usa timeline o tabla según la necesidad de comparación.

### 13.4 Indicadores

- Cada indicador tiene definición, unidad, periodo y fuente.
- Un KPI sin acción o comparación no se agrega.
- Los gráficos usan tokens SIAL y una leyenda comprensible.
- No usar colores semánticos para categorías neutrales.

## 14. Arquitectura de estilos

### Compartido

- `shared/sial-core.css`: tokens, shell y componentes.
- `shared/sial-core.js`: interacciones compartidas.
- `shared/componentes.html`: catálogo visual y QA.
- `shared/README.md`: inventario técnico.

### Módulo

Cada CSS local importa el core:

```css
@import url("../shared/sial-core.css");
```

El archivo local contiene únicamente composición o variantes propias del dominio. No redefine botones, campos, tablas, estados, modal, navegación o tokens existentes.

Los estilos locales de Login, Indicadores y Planeación se conservan como compatibilidad; los patrones nuevos reutilizables se agregan al core.

## 15. Crear o ajustar una vista

1. Revisar el expediente funcional en `Respaldo de Vistas`.
2. Confirmar HU, criterios, canal y rol.
3. Identificar una pantalla maestra comparable.
4. Reutilizar shell y componentes de `shared`.
5. Documentar cualquier componente nuevo antes de replicarlo.
6. Implementar todos los estados: default, loading, vacío, error, disabled y éxito según aplique.
7. Validar claro, oscuro, responsive, teclado y reducción de movimiento.
8. Actualizar el catálogo y la librería si el patrón es compartido.

## 16. Pantallas maestras

Toda evolución debe contrastarse con estas familias:

1. `shared/componentes.html`: autoridad visual de componentes.
2. Login y recuperación: autenticación y formularios focalizados.
3. Gestión de referencias: card, toolbar, tabla, acciones y paginación.
4. Gestión de avisos de corte: captura tabular, archivos, validación y publicación.
5. Gestión de transporte: programación, estados y monitoreo.
6. Inicio: composición por rol y permisos.
7. Trazabilidad/auditoría: eventos históricos y consulta.
8. Errores: página completa y error embebido.

Una pantalla maestra orienta la estructura; no autoriza copiar contenido o reglas de otro módulo.

## 17. Hacer y no hacer

### Hacer

- Reutilizar tokens y componentes compartidos.
- Mantener Poppins y azul SIAL.
- Diseñar según rol y tarea.
- Usar tablas para datos comparables.
- Ubicar acciones en el contexto que afectan.
- Explicar estados, consecuencias y recuperación.
- Separar requisitos HU de mejoras aprobadas.
- Validar light, dark, responsive y accesibilidad.

### No hacer

- No cambiar la identidad para diferenciar un módulo.
- No crear colores, tipografías o radios locales sin aprobación.
- No usar drawers como sustituto automático de una página.
- No duplicar KPI, filtros o mensajes.
- No envolver todos los datos en cards.
- No comprimir tablas hasta hacerlas ilegibles.
- No mezclar consulta con edición o creación.
- No inventar indicadores o reglas backend.
- No usar tecnicismos como texto principal.

## 18. Checklist de revisión

### Alcance

- [ ] La vista tiene propósito, rol y HU o fuente identificados.
- [ ] Las mejoras fuera de HU están marcadas.
- [ ] No se modificaron flujos ajenos.

### Identidad

- [ ] Usa tokens del core, Poppins e iconografía compartida.
- [ ] No introduce una paleta o estilo propio del módulo.
- [ ] Cards, tablas, campos y botones coinciden con la librería.

### Estructura

- [ ] El shell y navegación son los compartidos.
- [ ] La acción principal está en el contexto correcto.
- [ ] No hay métricas, filtros ni instrucciones duplicadas.
- [ ] Las tablas conservan legibilidad y ancho útil.

### Estados

- [ ] Existen loading, vacío, error y disabled cuando aplican.
- [ ] Los errores corregibles aparecen inline.
- [ ] Los estados persistentes no dependen de toast.
- [ ] Publicado, guardado y sincronizado no se confunden.

### Accesibilidad y responsive

- [ ] Foco, teclado, labels y contraste fueron revisados.
- [ ] Modales manejan foco y cierre correctamente.
- [ ] Funciona en claro y oscuro.
- [ ] Funciona en 1280, 1024, 768 y 360 px cuando aplique.
- [ ] Respeta `prefers-reduced-motion`.

### Calidad técnica de la propuesta

- [ ] `node --check` pasa para scripts modificados.
- [ ] `git diff --check` no reporta errores.
- [ ] El componente compartido se actualizó antes de replicarse.
- [ ] La vista fue validada visualmente y sus acciones navegables funcionan.

## 19. Gobierno y evolución

Este documento utiliza versionado semántico:

- patch: aclaración sin impacto visual o de comportamiento;
- minor: nuevo componente o patrón compatible;
- major: cambio de identidad, token fundamental o comportamiento transversal.

Todo cambio debe registrar motivo, vistas afectadas, token o componente, estados revisados, evidencia visual y aprobación.

El sistema permite crear nuevas vistas, componentes, estilos y composiciones cuando el canon no resuelve la necesidad. Nacen como **candidatos visuales** con alcance local y deben documentar propósito, estados, accesibilidad y razón de no reutilización. Antes de reutilizarlos fuera de la vista de origen o declararlos base, Diseño/Producto y revisión técnica verifican coherencia con marca/tokens, valor transversal, claro/oscuro, responsive, accesibilidad, movimiento y estados reales.

Si se aprueba, el candidato se incorpora a `shared/sial-core.css` o `shared/sial-core.js`, se muestra en `shared/componentes.html`, se registra en la matriz y pasa a ser base visual. Si no, se ajusta, permanece local o se retira. Tres usos equivalentes obligan a abrir la revisión, pero no impiden aprobar una buena solución desde el primer caso.

## 20. Inventario vivo

- `shared/sial-core.css`: tokens y estilos transversales.
- `shared/sial-core.js`: navegación, tema e interacciones compartidas.
- `shared/componentes.html`: catálogo visual.
- `shared/patrones-de-diseno-web.md`: mapeo de vistas, patrones, responsables y gobierno de adopción.
- `shared/README.md`: reglas técnicas de consumo.
- `sial-catalogo.css`: únicamente excepciones del catálogo.
- CSS de módulo: composición y reglas locales justificadas.
- `docs/superpowers/specs/2026-07-09-perfil-global-sial-design.md`: especificación puntual del perfil global, no reemplaza este documento.

Un componente documentado pero inexistente es una definición pendiente. Un componente existente pero no documentado debe auditarse antes de normalizarlo.
