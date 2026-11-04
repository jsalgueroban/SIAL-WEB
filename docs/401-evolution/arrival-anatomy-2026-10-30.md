# 401 — apoyos, frenada y elevación coordinada

Estado posterior vigente: `leg-frame-audit-2026-10-30.md`. La revisión exhaustiva retira la compresión durante el giro y deja ambos zapatos orientados hacia el avance con sus formas rígidas. La descripción de proyección de giro de este documento es un antecedente sustituido.

Solicitud: suavizar caminata → pose, orientar los pies hacia la marcha, organizar la llegada y hacer que el cuerpo acompañe a los brazos, manteniendo el maestro y el escudo estable. SELF: ajuste local de una sola composición y su revisión visual, sin beneficio independiente en delegar. Misma tarea de propuesta; sin cambios de librería.

## Cambios de composición y movimiento

Los brazos completos, cuerpo, palmas, accesorios y paths de los pies siguen siendo los del maestro. La zancada pasa de 48 a 40 unidades para reducir el solapamiento de zapatos. El pie izquierdo se refleja durante el avance para que ambos apunten a la derecha. Durante el último paso elevado, una proyección de giro lo devuelve a la orientación frontal del maestro; no gira mientras está plantado ni se interpolan sus paths. Una diferencia de opacidad de 10% distingue el pie lejano durante la marcha y desaparece al llegar.

El desplazamiento avanza a dos unidades/cuadro hasta 100 y desacelera continuamente hasta 140. El último apoyo izquierdo llega en 124 y queda inmóvil en coordenadas del escenario mientras termina la frenada. El pie derecho cierra entre 124–150; queda entonces la separación original del maestro. Los objetivos de apoyo restan el desplazamiento global, evitando que un pie plantado patine.

La ligera inclinación hacia el avance se endereza progresivamente. El cuerpo baja al recibir el peso del último paso y se eleva al subir los brazos entre 164–236. Se usan curvas de quinto grado con velocidad y aceleración nulas en los extremos. El cuerpo termina de asentarse después de presentar el gesto, en vez de congelarse entre marcha y elevación.

El ciclo de atención conserva cuatro segundos, con anticipación del cuerpo, elevación, pausa y retorno más largo. El escudo compensa también la inclinación del torso para permanecer vertical; su contacto con la palma se conserva. La entrada sigue ejecutándose una vez y el ciclo repite sólo la pose en el lugar.

## Evidencia

Diez pruebas Node aprobadas: continuidad y dimensiones del maestro, ALTO, escudo, periodicidad, apoyos de marcha, frenada con contacto estable, giro de pie sólo en el aire y transferencia de peso del torso. Build dedicado aprobado. Se inspeccionaron las poses de avance, cierre y elevación; las comprobaciones matemáticas no equivalen a valoración estética ni a capturas de cada cuadro.

Vista local: http://127.0.0.1:5198/Errores/401.html. El encuadre, el movimiento reducido y la repetición se revisan como parte de esta entrega. Naturalidad pendiente de la valoración visual del usuario; sin publicación ni QA productivo.

Revisión ejecutada en navegador: todas las fases y dos ciclos 575→336 observados; 1280×800 y 390×844 sin desborde horizontal. Escudo en el frame 420: ángulo global de −0.00000036° y error de contacto con palma de 0.000000036 px; pies en sus matrices originales de reposo. Movimiento reducido emulado: frame 336 permanece fijo y replay deshabilitado. Se mantiene la distinción entre comprobación técnica y valoración humana de naturalidad.

Corrección posterior de separación pie–cuerpo: se añadió una unión azul detrás de la silueta, desde un punto interior del torso transformado hasta un punto interior de la pierna del zapato. No se mueve el apoyo ni se modifica el path del zapato. La unión y el zapato lejano comparten opacidad de grupo para evitar una costura de color. Navegador: ambos extremos quedan dentro de las respectivas formas en 80 (marcha), 140 (cierre), 216 (elevación) y 420 (bucle), verificado con isPointInFill y matrices SVG. Build y diez pruebas existentes aprobados; valoración visual pendiente.

Rectificación tras nueva captura: el trazo central no cubría todo el borde superior, especialmente al reflejar el pie. Se sustituye por una superficie cerrada que une el ancho de la cadera con las cuatro esquinas de la parte superior de la pierna, solapándose dentro del zapato. Respeta reflexión, giro, apoyo y la capa posterior del cuerpo. La validación anterior de puntos centrales era insuficiente para certificar el borde. Se muestrearon 31 puntos a lo ancho de cada pierna en 40, 80, 110, 140, 216 y 420: todos cubiertos por la unión o el cuerpo (un punto del 110 está oculto por el cuerpo). Inspección del SVG aislado a escala 1:1 en 80 y build aprobado. Sin cambios del path del zapato ni de su trayectoria. Vista restaurada a reproducción normal después de la inspección.
