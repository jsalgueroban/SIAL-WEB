# 401 — elevación y atención en bucle

Petición posterior del usuario: corregir el giro del ALTO, aparición del escudo y construcción de brazos; mantener el movimiento del cuerpo y la señal en bucle después de llegar. La restricción anterior de finalizar en una pose quieta queda sustituida, excepto cuando el sistema solicita movimiento reducido.

SELF: corrección de composición local, articulación y reproducción que comparten una sola fuente de poses. Sin beneficio independiente en delegar el estado visual. Se conserva la misma tarea de propuesta, sin modificar API ni checkout de la librería.

## Construcción

- Longitudes de huesos medidas desde los puntos reales del fragmento maestro: hombro 365/425, codo 400/443, muñeca 453/420. Esto alinea el final del antebrazo con el anclaje de la mano.
- Contornos originales dentro de envolventes redondeadas, con relleno de respaldo y unión de codo menor. Las envolventes recortan los extremos puntiagudos de los fragmentos: no se afirma que la silueta externa del brazo sea idéntica al path original completo. Cuerpo, manos y accesorios conservan sus paths del snapshot. Agarre izquierdo reflejado para orientar el pulgar.
- ALTO inclinado entre −12° y 0°, sin la inversión de −165°. Mano y señal giran como una unidad; el brazo hace la elevación principal.
- Palma y escudo comparten la rotación de muñeca. El escudo gira desde el canto entre 196–238 alrededor de su punto de apoyo en la palma; su opacidad no produce el efecto de escudo fantasma. No se desplaza separadamente de la mano.
- Una entrada de 336 cuadros/5.6 s da paso a otra instancia del mismo componente Remotion, con offset 336, duración 240 cuadros/4 s y loop nativo. Se evita la carrera de pause/play al intentar reiniciar desde ended. La caminata no pertenece al segmento repetido.
- El cuerpo se inclina hasta 1.2°, respira dos unidades y el ALTO se eleva 14 unidades con inclinación adicional de 4°. Pies y desplazamiento global permanecen fijos. Pose y velocidad coinciden en la unión del ciclo. Movimiento reducido fija 336; replay recrea la entrada y después retoma el ciclo.

## Comprobaciones ejecutadas

Build dedicado aprobado. Seis pruebas Node cubren los 576 cuadros, longitudes reales de huesos, continuidad de muñecas, rango del ALTO, presentación del escudo, apoyos y periodicidad del ciclo. Se corrigió una aserción de cero negativo en el test, sin alterar el movimiento por ese motivo.

Revisión visual de elevación y bucle en escritorio 1280×800 y móvil 390×844; sin desborde horizontal. El observador runtime registró dos transiciones 575 → 336, ambas idle, y cambios efectivos del transform del cuerpo. No se reinició la caminata. Movimiento reducido emulado: 336 → 336 durante la observación, cuerpo quieto y replay deshabilitado. Las pruebas matemáticas de todos los cuadros no equivalen a capturas de todos ellos.

Remotion Studio conserva `Sesion401` (entrada y una vuelta) y añade `Sesion401Reposo` (solo ciclo) para revisión. Vista local: http://127.0.0.1:5198/Errores/401.html. La aceptación visual sigue pendiente; no hay publicación ni QA productivo.

Medición SVG durante la elevación (frame 214): distancia del final del antebrazo al anclaje de mano inferior a 0.00003 px en ambos brazos; error del contacto escudo–palma inferior a 0.000001 px. Esto comprueba el ensamblaje runtime, además de los tests de longitudes.
