# Bananito 401 — espera con atención

Perfil local, Web, reuse de la estructura elegida «Sesión en pausa». Restricciones: contornos del maestro, brazo y mano completos, agarre compartido, escudo orientado, apoyos y entrada existentes. Eje libre: frase de espera; movimiento suave con propósito, sin retrasar el acceso. SELF: ajuste pequeño sobre una fuente compartida, sin beneficio independiente de delegación.

El reposo pasa de cuatro a ocho segundos a 60 fps. Mirada hacia la acción de acceso, pequeño doble gesto del ALTO, mirada de vuelta, exploración breve y pausa. Cuerpo acompaña con amplitud pequeña y respiración; el hombro mueve el brazo original completo. El ALTO conserva orientación casi vertical y se mueve junto con mano y agarre, no como una pieza independiente. El escudo mantiene compensación de giro y apenas sigue la mano. Sin nuevos temporizadores de animación ni CSS keyframes: todo depende del cuadro Remotion.

Los 336 cuadros de entrada permanecen; el reposo ocupa 480 y la inspección completa 816. Studio comparte las constantes de duración con la propuesta. El reproductor muestra 336 con movimiento reducido y deshabilita replay. El gesto es autónomo; no se ha añadido seguimiento del cursor ni se presenta como reacción a hover. El botón existente reinicia la entrada.

## Evidencia

- 11 pruebas Node aprobadas: longitudes/continuidad de brazos, orientación de señal, escudo, periodicidad y apoyos; alternancia de miradas, doble gesto y descanso.
- Build Vite de preview aprobado: JS 586.36 kB, gzip 175.56 kB. Remotion Player 4.0.523; maestro SHA256 a2aed0430aadd0f1fdbd2d703f6b2ca47a4342c41d5bf0896bf36da70af22a50. Librería pública sin cambios.
- Auditoría geométrica en navegador: 816 cuadros, 1632 piernas, 68544 muestras, cero cuadros fallidos y distorsión máxima 2.22e-16. Se acompaña de revisión visual del gesto; no representa 816 capturas revisadas manualmente.
- Opción 1 a 1280×640: pie termina en y=640 y alto total=640; resuelta la validación de altura anteriormente pendiente. Captura del gesto y reproducción real.
- Móvil 390×844 con reduced motion: cuadro 336, replay deshabilitado, CTA 48 px y sin desbordamiento horizontal. Reproducción normal en escritorio: pasa a idle y avanza 336→395; replay habilitado. Sin errores de consola; permanece aviso de licencia de Remotion.

Vista: http://127.0.0.1:5198/Errores/propuestas-401/pausa.html. Comparativa marca A como elegida. Sin publicación ni certificación QA de producto.

## Continuación confirmada

### Calibración posterior: «ey, acá»

El usuario pide una sacudida más fuerte. La amplitud del hombro izquierdo pasa de 4.8° a 16°, la señal de 2.2° a 7° y el segundo acento del 72% al 85% del primero. El cuerpo acompaña con inclinación de 0.95° y ascenso de 1.8 unidades. Se conserva la frase de ocho segundos, miradas, agarre y escudo; no se deforman paths. El presupuesto de desplazamiento de muñeca por cuadro pasa a 1.2 unidades del maestro para admitir el gesto explícitamente solicitado, conservando continuidad. Pruebas verifican elevación de muñeca superior a 17 unidades en el primer acento y 14 en el segundo.

11 pruebas y build aprobados. Nueva auditoría geométrica: 816 cuadros, 68544 muestras, cero fallos. Pico inspeccionado en cuadro 406: hombro 44°; captura visual de la composición completa a 1280×640 sin recorte. Fuente y movimiento reducido no cambian. Misma tarea en revisión; calibración local, no regla global.

Neutral, autenticación y mantenimiento reutilizarán jerarquía, marca y acciones de la opción 1, pero no su escena: orientación/bienvenida, identificación y reparación/ensamblaje respectivamente. Son direcciones de trabajo pendientes de construir y revisar; no se consideran variantes implementadas por actualizar este registro. La composición concreta de cada escenario se resolverá con su contexto funcional vigente.
