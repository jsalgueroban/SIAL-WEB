# 401 con Bananito de acceso restringido

Actualización: la evolución posterior retira la card y franja, reordena la jerarquía y agrega caminar → detenerse → mirar → explicar. Fuentes y límites vigentes en `401-evolution/creative-brief.md`, `401-evolution/capability-ledger.md` y `401-evolution/promotion-plan.md`. La composición inicial que se describe abajo se conserva en `Errores/401-continuidad.html`, también sin línea lateral, para comparar; no implica aprobación de la evolución.

## Corrección de entrada y marca — 2026-10-30

La marca navideña se recortaba por el overflow hidden heredado de `.brand > span:not(.brand-badge)`. El override de esta vista permite overflow visible tanto en el contenedor como en el SVG.

Esta revisión sustituye los tiempos anteriores de la escena: marcha con brazos bajos hasta el frame 146 y mano del escudo vacía; elevación entre 146 y 196; aparición del escudo entre 180 y 206; mirada entre 196 y 236; mensaje entre 230 y 258; reposo en 270 (60 fps). El ALTO acompaña la mano durante la entrada. Se conservan los contornos del maestro; no se modifica la librería.

Build del preview aprobado y 4 pruebas Node de marcha, apoyo, secuencia y reposo aprobadas. Inspección visual en escritorio de frames 72 y 146, y móvil 390×844 del frame 212: marca completa, escudo ausente durante la marcha y visible al mirar, sin desborde horizontal. Movimiento reducido implementado, sin emulación del sistema. La última lectura del navegador encontró un timeout de captura DOM; no invalida las inspecciones previas ni se atribuye una nueva captura. Valoración estética pendiente. Misma tarea En Revisión; sin publicación ni QA de producto.

## Alcance y decisión

Web, perfil local, operación build sobre la vista existente `Errores/401.html`. Forma de tarea: recuperación de sesión. Decisión reuse: composición de sistema existente, textos y navegación de 401, con la variante forbidden seleccionada expresamente por el usuario. No se transforma 401 en un mensaje de permisos 403. No hay HU concreta confirmada; se mantiene como propuesta externa, sin mutaciones Azure ni autorización productiva simulada.

Baseline: card de dos columnas con código, recuperación y panel de ayuda textual. Delta: columna derecha con Bananito sobre fondo transparente y ayuda resumida debajo de las acciones. Marca, fuentes y tokens del core preservados. En móvil la ilustración antecede al texto y los botones se apilan. Es una excepción de esta vista, no un nuevo patrón global.

SELF: integración acotada que depende del estado visual local y de la compilación ya revisada de la librería; delegar no aporta un slice independiente. Capacidades activadas: SIAL design proposals (reuse/contexto), SIAL web library (consumo del preview), CUA (recorridos y geometría), Dona (seguimiento). No se ejecuta inventario integral ni se promueve un componente nuevo.

## Procedencia y componentes

- `SialMascot`: library-local-preview, pose forbidden, motion loop, procedente del build local 1.5.0 de la rama `chore/christmas-isotype`; no está publicado. Conserva la palma abierta y el escudo de la última corrección.
- `SialIsotype`: preview existente de marca navideña de la propuesta, mismo componente usado por el shell.
- Botones/enlaces, panel, tipografía y tema: adapters HTML/CSS del core de la propuesta; no se atribuye nueva adopción productiva de Button.
- `@banasandev/banasan-ui` instalado sigue siendo 1.4.0; no se altera dependencia, lockfile, runtime global ni release.

El bundle autónomo incluye su React y el árbol necesario de mascota, y solo carga en esta vista. `scripts/build-mascot-preview.mjs` recibe la raíz de la librería compilada. Reproducir: `npm run build:mascot-preview -- <checkout-librería>`. SHA256, versión y estado no publicado quedan en `shared/vendor/sial-mascot-preview.provenance.json`. Los HTML funcionan desde un servidor estático, sin necesitar la ruta del worktree en runtime.

El montaje autónomo de marca evita cargar el runtime general en esta página: su CSS seguía imponiendo tokens oscuros al seleccionar claro. Se verificaron surface blanca para claro y rgb(21,30,45) para oscuro. La corrección se limita a 401; no se afirma que el conflicto global esté resuelto en otras vistas.

## Evidencia ejecutada

- Build dedicado Vite aprobado (JSX validado por compilación); sintaxis del script mjs y `git diff --check`.
- 1280×900: dos columnas, código y acciones visibles, mascota montada como SVG forbidden sobre superficie de la card.
- 390×844: una columna, mascota 180 px, scrollWidth 375 frente a viewport 390, sin desborde. Ambos enlaces miden 44 px de alto y quedan dentro de la pantalla.
- Tema claro/oscuro con toggle nativo; preferencia conservada al navegar.
- Foco por Tab desde tema hasta Iniciar sesión; outline solid visible por estilos.
- Navegación ejecutada: catálogo de propuestas → Abrir Error 401 → 401; Iniciar sesión → Login/index.html; Volver al catálogo → index.html.
- Bananito montado y animado, `data-pose=forbidden`, `data-paused=false`. Ilustración decorativa excluida del árbol accesible; el h1 comunica el estado.
- Movimiento reducido conserva la regla de librería sin modificarla; no se emuló esa preferencia en navegador.

Gates: composición semántica y recuperación de propuesta recorridas; revisión responsive y temas ejecutada. Valoración estética pendiente del usuario. Esto no prueba autenticación, expiración real de sesión, backend, QA de producto ni despliegue. Vista en revisión local, sin publicación.

Seguimiento: tarea de propuesta «Implementación de vista web 401 | Bananito de acceso restringido», derivada de la tarea histórica de vistas de error, que permanece cerrada.
