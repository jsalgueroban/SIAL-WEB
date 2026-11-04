# Impulso rápido y giro centrado — 2026-10-31

Corrección Web focalizada sobre la composición elegida. Dona conserva la tarea del taller y sial-design-proposals la evidencia; contrato maestro de sial-web-library y evaluación determinista Remotion. SELF: trayectoria, pivote y estelas son un slice local entrelazado, sin beneficio de delegación. No se publica ni se modifica el paquete público.

El usuario valora los rebotes y la recuperación, y pide pulir sólo el despegue y giros. Antes de editar se capturaron445 poses aprobadas, cuadros360–804, en scripts/tests/fixtures/cartoon-recovery-approved.json. Una prueba compara todos sus campos originales con el evaluador nuevo, normalizando sólo la representación JSON de cero negativo. Se conservan exactamente aterrizaje, rebotes, levantada, dos sacudidas, mirada y carrera.

El impulso cambia de ease-out de potencia1.5 a cúbico: la mitad de270 unidades se alcanza en unos12 cuadros tras liberación en vez de21. El giro pasa de una interpolación larga de450° alrededor de los pies a una vuelta breve304–332 sobre el centro del torso, seguida de orientación de90°328–360. El pivote vuelve al del apoyo con una compensación suave antes del contacto; actorPoint y el SVG usan exactamente las mismas traslaciones y pivote.

Las estelas dejan de seguir el punto transformado del brazo del martillo. Se calcula velocidad del centro real del cuerpo en cuadros consecutivos; tres trazos apuntan en dirección opuesta, comienzan junto al borde estimado de la silueta y ajustan longitud/opacidad con velocidad. Desaparecen antes del contacto, sin orbitación causada por la mano ni diagonal fija ajena al recorrido. Los modelos y contornos permanecen intactos.

32 pruebas Node y build Vite aprobados. Nuevas comprobaciones: conservación exacta de las445 poses aprobadas, proyección inicial más rápida, pivote en torso y dirección de estelas. La excepción de velocidad del test de continuidad se limita al impulso305–329 y sólo a posición; los contactos y el resto mantienen sus presupuestos. Build:JS622.71kB/gzip188.33kB. Revisión visible de314 y332; captura D:/SIAL/Librerias/bananito-despegue-rapido.png. La naturalidad visual sigue sujeta a valoración.

Prototipo http://127.0.0.1:5198/Errores/mantenimiento-taller.html. Estado: misma tarea En Revisión, sin publicación.

Auditoría renovada del SVG: fast-launch-arm-audit.json contiene2580 cuadros con0 fallos de unión detectados y0px de separación de muñeca. La comprobación geométrica no sustituye valoración estética. Vista completa dejada en reproducción.
