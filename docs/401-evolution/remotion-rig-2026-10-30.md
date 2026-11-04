# 401 — entrada articulada con Remotion

Corrección de la propuesta, no promoción de una API de librería. Reuse de composición 401 y contornos del maestro; sustitución del motor y ensamblaje local. SELF: el slice depende de geometría, inspección visual y ajustes del mismo estado local; no hay beneficio independiente en exportar ese contexto.

## Fuente y construcción

`scripts/snapshot-session-master.py` extrae los paths de brazos, manos, cuerpo, pies y accesorios del worktree `christmas-isotype`. Verifica XML y ausencia de JSX pendiente. `src/web/session-master.json` conserva fuente y SHA256. Las piezas se trasladan y rotan; no se interpolan sus coordenadas. El brazo original se separa en dos segmentos rígidos y una unión circular que cubre la articulación. La cinemática de dos segmentos mantiene sus longitudes en todos los cuadros. Muñeca, mano y accesorio comparten un anclaje. El agarre del ALTO gira unido; la palma derecha se relaja durante la marcha y se abre para presentar el escudo.

Remotion Player 4.0.523 embebido, sin temporizador RAF propio ni CSS keyframes para el personaje. `SessionComposition` recibe el frame de Remotion y la configuración de fps. La composición de Studio `Sesion401` importa el mismo actor y evaluador desde la propuesta. Dependencias del proyecto Remotion recuperado; React deduplicado en el build de preview. El paquete público instalado sigue en 1.4.0 y la librería no se modifica.

336 cuadros a 60 fps, 5.6 s: marcha 0–119; apoyos finales 120–157; pausa 158–173; elevación 174–227; mirada 228–293; explicación 294–317 y reposo 318–335. Escudo oculto durante la marcha, aparece 224–246 al completar la elevación. Acción principal siempre disponible. Movimiento reducido muestra directamente 335, sin reproducción. Replay reinicia la misma composición.

## Evidencia ejecutada

- Build dedicado Vite aprobado. Preview JS 579.88 kB, gzip 173.10 kB; crecimiento por integrar Player, limitado al bundle local de esta propuesta.
- Tres pruebas Node: longitudes y continuidad de muñecas en los 336 cuadros; apoyo que cancela el avance; llegada anterior a elevación y aparición del escudo. No equivalen a 336 capturas visuales.
- Inspección visual de 88 (marcha), 168 (llegada), 200 (elevación móvil), 226 y 335 (presentación). Se corrigió la unión del codo y el barrido del ALTO que salía del margen móvil.
- Navegador 1280×800 y 390×844, sin desborde horizontal; acciones móviles de 44 px. Marca navideña completa. Preferencia de movimiento reducido emulada: frame 335, escudo visible, replay deshabilitado.
- Replay ejecutado y leído de 0 a 22 en 450 ms, fase walking y escudo 0. Player silenciado y sin tags de audio compartidos; comprobación posterior sin errores de consola ni avisos de autoplay. Permanece el aviso de licencia propio de Remotion, sin suprimirlo.
- Studio `/Sesion401` carga y muestra su composición. Vista final: `http://127.0.0.1:5198/Errores/401.html`; Studio: `http://localhost:3001/Sesion401`.

Build reproducible: `npm run build:mascot-preview -- <checkout-librería-compilado> <proyecto-remotion-recuperado>`. La procedencia del bundle incluye versión de Remotion y hash del snapshot. Consulta de referencia: https://www.remotion.dev/docs/player/player.

Pendiente valoración visual del usuario. Sin publicación, integración productiva, cambios de autenticación ni certificación QA. La secuencia anterior de 270 cuadros queda sustituida; se retiran su evaluador, pruebas y overrides CSS.
