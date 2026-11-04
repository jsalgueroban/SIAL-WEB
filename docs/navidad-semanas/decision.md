# Navidad en Gestión de semanas — 2026-11-03

Web, propuesta local, operación evolve, vía reuse. Forma: bandeja/gestión.
Fuente funcional y maestra: Gestion de Planeacion/gestion-semanas.html. Datos de ejemplo existentes, tres registros, seis columnas. No se cambian reglas de negocio.

Dirección explícitamente seleccionada: ambientación sobria sin Bananito; header, sidebar, cards y contenedor de tabla. No se fabrica una alternativa de estructura porque se aprobó conservar la pantalla.

## Composición

Mantener geometría y tipografía SIAL. Segunda iteración: se retiran los pinos junto a marca y en centro de tabla por feedback explícito. Header con guirnalda extendida de dos caídas, sin buscador global (el usuario confirma que no existe en el producto real). Luces base encendidas; otras12 se encienden al expandir menú con desfase35ms por posición y se apagan al contraerlo. Respeta estado desktop y overlay móvil. Indicadores con pino/esfera y estrella/lazo distintos. Acciones Generar semanas y Exportar con guirnalda, lazo y campana colgante. Bastón de caramelo enganchado al borde exterior de card de tabla; datos libres. El buscador de vistas del sidebar permanece.

Marca navideña ya montada por runtime de librería: no se reconstruye. Adornos originales SVG con IDs únicos, ocultos a accesibilidad y sin capturar puntero. Copa/pompón existentes, esfera decorativa con balanceo 8s y luces por opacidad 6s, con reposos. Pausa conjunta y movimiento reducido. Sin nieve, sonidos ni movimiento de datos.

## Componentes y fronteras

Shell/navegación: composición local; logo: librería vigente consumida por runtime existente. Indicadores compactos: fuente de propuesta vigente. Búsqueda de tabla, selectores, chips, botones, tabla, drawer y paginación: adapters existentes sin sustitución; buscador global oculto solo en esta muestra estacional para reflejar el producto. Adornos y control de comparación: proposal-only, ninguna API pública nueva. Corrección local de precedencia de tokens light ante media dark del runtime; copia literal de paleta core, no cambio de identidad.

Acceso: Gestión de semanas → Probar Navidad → misma ruta con ?season=christmas → Vista habitual. Clave activa semanas. El modo no se propaga a otras vistas ni se activa en producto.

SELF: slice local dependiente de geometría compartida, sin beneficio independiente de delegación. No cambios de librería, backend, Azure ni publicación.

## Validación

Revisión en navegador a 1440×900 y 390×844. Geometría de documento idéntica entre habitual y Navidad: header 64px; indicador 280×88px; page 1112,67px de ancho; card principal 552,65px de alto; toolbar 71,5px de alto. Misma posición de cada bloque descontando scroll y animación de entrada. En móvil cards 350,67×88px; documento 375px frente a viewport390, sin desborde horizontal. Guirnalda móvil simplificada a cuatro luces; adornos de acciones limitados a190px para evitar deformarlos en botones de ancho completo. Navegación existente conservada.

Acceso ida/vuelta por enlaces de comparación comprobado. Pausa detiene esfera y copa del gorro (animation-play-state paused). Búsqueda SEM-2026-05 deja una fila; búsqueda sin coincidencias muestra vacío y contador0; escoba restablece tres filas y foco en búsqueda. Drawer abre detalle correcto y cierra. Temas claro y oscuro revisados. Reglas de movimiento reducido e impresión inspeccionadas en CSS; sin emulación de preferencia de sistema ni certificación funcional formal. Sintaxis JS, formatter y diff-check del alcance correctos. No build: archivos estáticos, sin dependencia ni bundle añadido.

## Promoción

Pendiente aceptación visual. Probar primero como composición estacional del shell real; librería solo recibe adornos si se aprueba reutilización y contrato. Activación/configuración real fuera de este prototipo.

## Evidencia de segunda iteración

Escritorio1440×900: header64px, indicadores280×88 y card552,65px de alto conservados. Luz de menú cerrado rgb(137,148,127)/halo0; abierto rgb(243,203,112)/halo1. Selector móvil sidebar-overlay abierto sincroniza luces open. Dos adornos de acción sin duplicación tras filtrar y limpiar. Pausa confirmada en campana y copa del gorro. Cero remates descartados en brand/card-header. Móvil390 sin desborde: documento375px. Sintaxis JS, Prettier y diff-check del alcance. Pendiente aprobación estética de John, sin promoción productiva.

## Tercera iteración — adornos sujetos al botón

Feedback: adornos demasiado genéricos, integración insuficiente y campanas que deben responder al cursor sin cubrir texto ni cambiar tamaño.

Se reconstruye la familia: pino con agujas rellenas por capas, hojas de acebo con nervadura, lazo con pliegues, estrella facetada y máscara de franjas del bastón corregida. Botones con cordón adaptable independiente y piezas laterales de tamaño fijo. Lazo/follaje izquierdo sujeto por enganche al borde; dos campanas metálicas con reflejos, labio interior, argolla y badajos al derecho. Los SVG laterales no se estiran con el botón; solo el cordón cambia de ancho. Adornos aria-hidden y pointer-events none.

Interacción: pointerenter y foco disparan balanceo amortiguado de1600ms; badajos con contramovimiento y retardo70ms. Al salir el cursor continúa hasta reposo, sin corte. Al reentrar comienza desde la matriz visual actual. WeakMap por botón y conjunto de animaciones para cancelar, pausar y limpiar. Preferencia de movimiento reducido evita iniciar y cancela gesto activo. Sin movimiento perpetuo de campanas.

Evidencia: cursor real sobre Generar semanas mostró matriz de giro; Tab dejó foco en Exportar y activó ambas campanas. Pausa guardó matrices de rig/badajos idénticas en dos lecturas separadas. Generar conserva164,30×44px y Exportar124,46×44px en escritorio1440; en móvil390 ambos44px de alto y adornos laterales35px fijos, documento375px sin desborde. Follaje de Exportar compacto para evitar contador. No se modifican textos, padding, foco, objetivos de click ni flujo de acciones. Validación de propuesta, pendiente aceptación estética y promoción productiva.

## Cuarta iteración — composición de indicadores y tabla

Los adornos de indicadores pasan de flotar encima de las cifras a colgar del borde derecho mediante enganche visible. Sprite60×64 con follaje compacto y dos esferas, estrella reducida con cuerda; margen adicional12px en cifra, sin variar caja de card. Bastón se abraza al lateral izquierdo en divisor de cabecera/filtros; ResizeObserver lee altura real de cabecera y ubica el gancho, también con acciones apiladas en móvil. Se mantienen título, cifras y filtros despejados. Revisados1440×900 y390×844; card88px, documento375px en viewport390. Sintaxis, formatter y diff-check correctos. Pendiente aceptación visual.

## Quinta iteración — reacciones y bastón insertado por abajo

Hover de cada indicador mueve su rig desde enganche fijo (44,9 / 43,9); amplitudes7/9grados,1700ms amortiguados, retorno y reentrada desde matriz actual. Tabla mueve bastón desde base insertada (11,64),7grados, con recorte inferior estático y labio de contacto delante; se conserva visible curva/lazo/tramo superior. Cambio explícito posterior: ocultar por abajo, no por lado. Ancho36px frente a28 anterior; móvil32px, con oclusión inferior18px. Exportar ya no recibe adornos; solo Generar semanas mantiene campanas. Tres giros comprobados mediante cursor real y matrices SVG; pivotes correctos. Móvil390/doc375, sin desborde, Exportar sin decoración. Sin nuevas paradas de tab para decoración; focusin de tabla reacciona solo al entrar desde fuera. Animaciones usan pausa/reduced motion y limpieza existentes. Pendiente aprobación visual.

### Corrección de oclusión solicitada durante revisión

Se descarta el recorte CSS: parecía cortar el dibujo porque la base seguía fuera. Base movida dentro del panel, bastón inclinado24° hacia fuera y superficie frontal de tabla (pseudo-elemento con fondo/borde del tema) cubriendo el tramo inferior. clip-path none. Bastón36×77,4px, curva/lazo/tramo superior visibles. Pivot11,64 estable, amplitud5° sobre inclinación de reposo-24°, sin volver a0 al terminar. Móvil32×68,8, misma capa frontal. Cursor real comprobado con matriz de giro alrededor de-21°; Exportar sin adornos. Este ajuste sustituye los recortes descritos antes.

## Sexta iteración — revisión del ciclo completo y header de luces

Guirnalda simplificada:18 luces conservadas, solo3 grupos pequeños de follaje en extremos y centro. Se sustituye el borde rectangular visible por boca de inserción con sombra y labio curvo del mismo material de tabla; superficie inferior cubre el resto del tallo. Se conserva pivote11,64 y reposo-24°.

Se agrega herramienta local review=candy con selector de cuadro0..102 (ausente en vista normal y producto), que pausa la animación real y permite recorrerla a60fps. Se detectó arranque sin inclinación al preparar animación antes del CSS; corregido fallback al ángulo de reposo si transform es none.

Se recorrieron los103 cuadros reales de1700ms en escritorio1440 y móvil390, leyendo matrices y geometría renderizadas. Inicio/fin iguales; extremos observados-27,277° y-19,160°. Pivote con deriva0px en ambas resoluciones. Contorno muestreado del tallo inferior y remate circular dentro de capa de oclusión en todos los cuadros:0 violaciones. Profundidad conservadora del pivote bajo el labio0,6px escritorio/0,2px móvil (se toma el control más bajo de curva como límite conservador). Revisados visualmente los extremos27/41 en escritorio. Informes locales navidad-cane-103-frame-audit.json y navidad-cane-mobile-103-frame-audit.json. Sin certificación funcional formal de producto.

Adopción preparada en implementation-handoff.md desde lectura real de shell, useSidebar, Semanas y dependencia enlazada. No se modificó producto ni librería. SELF por revisión local de composición y lectura puntual de adopción.

## Séptima iteración — referencia dibujada de guirnalda

La reducción anterior de hojas no interpretó la amplitud pedida: usuario aporta trazado de cuatro caídas. Se rehace la cuerda en4 tramos cuadráticos con profundidades42/64/46/58, anclajes0/235/510/780/1000 y24 luces calculadas sobre las mismas curvas. Follaje discreto solo en5 sujeciones, con escala0,55. Alto decorativo96px permite caídas sobre espacio libre inferior del header sin alterar caja64px; última luz por debajo de82px frente a contenido a88px o más. Medido en1440: guirnalda termina20px antes de controles. Menú cerrado/open conmuta luces correctamente. Sin cambios de bastón, acciones, cards o datos. Perfil local, SELF. Sintaxis/formatter correctos; pendiente aceptación visual.

## Ciclos ocasionales de luces

Siete duraciones8,7–15,3s y desfases individuales negativos calculados por índice. Estado encendido prolongado; apagado por fill/opacidad y halo, con transiciones suaves. Se activa en luces de menú solo cuando está abierto; luces base conservan ciclos. Apertura usa transición de grupo con desfase; pausa congela CSS, reduced motion cancela movimiento y conserva apariencia estática. Navegador:7 duraciones reales, cambios de color/opacidad entre lecturas, pausa estable de24 luces y reanudación. Sintaxis/formatter/diffcheck correctos.


## Ajuste de integración y superficies — 2026-11-04

La captura del usuario invalida la aceptación visual del parche anterior: sobresalía del borde. Se elimina el pseudo-elemento rectangular y el hilo superior; la boca pasa a18×8px dentro del panel, centrada sobre el pivote. Recorte fijo al74,42% del contenedor del bastón; el tallo gira detrás del pequeño labio curvo del material de tabla. Desktop: pivote a57,6px; móvil51,2px. No se altera el tamaño de la tabla ni los controles.

Cards de semanas usan --color-surface igual que la tabla; se conserva anatomía y relieve compacto existente. Verificado rgb(21,30,45) en ambos componentes en oscuro y rgb(255,255,255) en claro. Revisados103 cuadros reales desktop y103 móvil390×844: recorte fijo, sin pseudo-elemento y matriz inicial/final idéntica. Evidencia navidad-cane-fixed-frames.json y navidad-tabla-cards-corregidas.png. Sintaxis y diff check correctos. SELF: geometría local acoplada sin beneficio independiente al delegar; perfil local/reuse, alcance proposal-only. Pendiente aceptación visual, sin cambios productivos.


## Contenedor de tres cards compactas — 2026-11-04

Perfil local/reuse. Se sustituye el grid fijo de dos columnas por flex con wrap, base280px sin crecimiento y separación mínima22px. Con tres o más indicadores se distribuye el espacio sobrante con space-between. Tres cards de igual ancho alinean izquierda/centro/derecha con tabla. En móvil se conservan280×88px y se apilan, gap18px; no se estiran. Dos indicadores conservan su agrupación inicial.

Caso reproducible: gestion-semanas.html?season=christmas&indicators=3; añade únicamente en la muestra Semanas inactivas calculadas por año desde filas existentes y actualizadas por el render compartido. Sin query, dos indicadores. Fuente de datos y controles existentes conservados. Sin promoción a librería. SELF: ajuste local trivial, sin beneficio independiente al delegar.

Verificación:1440px cards280×88, x288/704,333/1120,667; tabla x288/ancho1112,667, márgenes y centro coincidentes. A1000px dos cards en primera fila y tercera en segunda, mismo tamaño. A390px viewport efectivo375px, documento375px, tres cards280×88 apiladas sin desborde. node --check y git diff --check correctos. Evidencia navidad-tres-cards.png. Pendiente valoración visual.
