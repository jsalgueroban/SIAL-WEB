# Explosión y recuperación de comedia física — 2026-10-31

Dirección solicitada: Bananito como mascota caricaturesca y jocosa. Se implementa la evolución descrita en cartoon-brief.md: anticipación del último golpe, pausa de cuatro cuadros, estallido gráfico, salida con giro en arco y reducción hasta14%, aterrizaje360, rebote grande360–384, rebote menor384–400, mareo398–434, apoyo e incorporación432–474 y retorno474–804. La estructura de página, soldadura y recaída final del bucle29s se conservan.

La explosión ahora tiene corona dentada de28 vértices, núcleo claro y líneas de impacto; humo de lóbulos dibujados, fragmentos y ondas coordinados. Estelas siguen el desplazamiento y polvo breve señala ambos contactos con el suelo. Ojos de mareo y estrellas orbitales preceden una expresión de esfuerzo al levantarse. La sombra cambia durante vuelo y postura acostada, reforzando profundidad y apoyo.

Se aplica elasticidad leve a todo el rig desde una matriz común, alrededor del apoyo, conservando área mediante elasticY=1/elasticX. No se alteran los paths maestros ni se separan piezas anatómicas. actorPoint usa exactamente esa misma matriz. El giro de vuelo se normaliza por una vuelta completa al aterrizar; las matrices son equivalentes y no hay corte de orientación visible. La mano conserva el martillo durante la expulsión y vuelve baja en la carrera. El modo de movimiento reducido sigue mostrando la marca reparada sin reproducir efectos.

Evidencia:27 pruebas Node pasan, incluyendo hit-pause, arco, rebotes decrecientes, elasticidad global con área constante, continuidad de giro al aterrizar, regreso y regresiones existentes. Build Vite aprobado:JS620.46kB/gzip186.84kB. Studio abre TallerMantenimiento y se revisan305/330/360/372/412/450. Vista a1280×720 con explosión305 comprobada y guardada en D:/SIAL/Librerias/bananito-explosion-caricatura.png.

Auditoría del renderer renovada después de cambiar la trayectoria: cartoon-arm-frame-audit.json contiene2580 cuadros reales y0 fallos de unión; separación de muñeca0px y cobertura de raíz mínima96.43%. El informe anterior arm-frame-audit.json permanece como evidencia histórica. El análisis geométrico no determina aceptación estética ni implica inspección visual manual de cada cuadro.

Misma tarea del taller En Revisión. Prototipo local: http://127.0.0.1:5198/Errores/mantenimiento-taller.html. Sin publicación ni cambios del paquete público. La coreografía y los efectos se desarrollaron en el proyecto; las fuentes de principios se citan en el brief y no se incorporan personajes ni assets externos.
