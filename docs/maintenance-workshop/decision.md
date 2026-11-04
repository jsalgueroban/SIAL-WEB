# Escena de mantenimiento — resultado revisable

## Alcance y acceso

Propuesta Web sobre Sesión en pausa, seleccionada por el usuario. Escena nueva y aún en revisión. Ruta desde la opción elegida: `Errores/propuestas-401/pausa.html` → «Ver Bananito en mantenimiento» → `Errores/mantenimiento-taller.html`. Alternativa `?escena=soldadura`, y créditos en `Errores/recursos-taller.html`. No se reemplaza aún mantenimiento.html ni se promueve una API a la librería.

## Coreografía y respuesta al feedback

Taller: 1440 cuadros a 60 fps, 24 segundos. Golpes 108/204/300, estallido, expulsión hacia el fondo con escala uniforme 1→0.18, recuperación a distancia, caminata 474–804 con escala creciente hasta 1, golpes 876/972, cambio de herramienta/gafas y soldadura 1050–1280. Inspección final y cierre continuo del ciclo. Alternativa de soldadura: 600 cuadros, diez segundos, sin explosión ni alejamiento.

Se sustituyó la caída simple por profundidad y regreso explícito. Los pies conservan contornos y orientación del maestro; durante la caminata se reutilizan el evaluador de pasos y las uniones de piernas de 401. El vuelo es una transformación rígida y una escala uniforme del conjunto; no comprime partes por separado. El martillo vuelve detrás de la cabeza al levantar el brazo. La mano y la herramienta de soldar comparten pivote de muñeca; cinemática de dos longitudes rígidas lleva la boquilla por las juntas.

La marca real se divide mediante ocho polígonos con bordes irregulares compartidos, relieve, daños y recolocación gradual. Una pieza queda fijada en el punto de golpe. Los golpes posteriores recolocan grupos, y la soldadura sigue dos juntas con calor y cordón visibles. Al completar, se dibuja una sola instancia limpia del logo para eliminar las costuras de rasterización de los recortes.

## Recursos públicos y materiales

Yunque: modelo original GLB CC0 de Innerscene; proyección ortográfica con 28 caras visibles, iluminación y azul SIAL. Gafas: geometría Steampunk goggles de Delapouite, Game-icons.net, CC BY 3.0; montura y lentes adaptados al maestro. Efectos: humo, llama y chispa CC0 del Particle Pack de Kenney mediante máscaras de luminancia, con onda y fragmentos deterministas. Se conserva transparencia, sin imagen de fondo ni canvas WebGL. `assets/workshop/README.md`, `sources.json` y la página de créditos registran origen, licencias, hashes y adaptaciones.

## Evidencia y límites

- Quince pruebas Node aprobadas: contactos de todos los golpes, boquilla sobre la trayectoria de soldadura, recuperación, crecimiento monótono de escala y retorno, pasos, ocho fragmentos, continuidad de ambos ciclos y regresión de 401.
- Build dedicado Vite aprobado; bundle de preview 886.13 kB / gzip 391.04 kB. El incremento corresponde a las texturas abiertas de partículas. Sigue siendo preview local y no paquete publicado.
- Studio registra TallerMantenimiento (1440 cuadros) y SoldaduraSial (600), usando la misma composición que la página.
- Revisión visual de explosión, alejamiento (390), retorno (650), soldadura (1150/1200) y marca reconstruida (1320). Evidencia de pantalla completa: D:/SIAL/Librerias/mantenimiento-taller-profesional.png.
- Escritorio 1280×640: alto de documento y pie en 640, sin desbordamiento horizontal. Móvil 390×844: sin desbordamiento, CTA 48 px, título 33 px; revisión de soldadura y tema oscuro. El móvil conserva scroll natural. No se midió rendimiento de producción en dispositivos físicos.
- Pausa real conserva cuadro 183 en lecturas sucesivas; reanudar restaura reproducción y replay vuelve a cuadro cero. Enlaces a alternativa y créditos recorridos. Controles de 44 px, acción principal disponible durante toda la escena.
- Movimiento reducido: rama de código muestra composición completa en 1320/470 y suprime reproducción/efectos; listener de preferencia del sistema. En esta iteración no se cambió la preferencia del sistema operativo para probarlo.
- El adaptador DOM de la revisión CUA no expone SVG getCTM/isPointInFill. Por ello no se atribuye a esta escena una auditoría geométrica de todas las uniones en navegador. Se revisan poses visibles y pruebas del evaluador; no se reutiliza como prueba nueva el informe de 816 cuadros de 401.

Validación de propuesta, sin certificación QA de producto. Pendiente valoración visual y elección entre taller y soldadura; sin publicación ni cambios de autenticación. SELF: coreografía, geometría y evaluación comparten estado local; el trabajo directo evita duplicar ese contexto.
