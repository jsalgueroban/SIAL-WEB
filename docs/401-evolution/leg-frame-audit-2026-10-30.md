# Piernas y pies — revisión exhaustiva de cuadros

Solicitud: revisar ambas piernas durante la caminata y el bucle, conservando los zapatos del maestro y evitando separaciones o deformaciones. SELF: auditoría local de una sola composición, con evaluación del SVG real, sin beneficio independiente en delegar. Misma tarea de propuesta; no es certificación QA productiva.

## Hallazgos y correcciones

La proyección anterior cambiaba `scaleX` entre −1 y 1 y comprimía el pie casi a cero durante el giro. Se retira esa proyección. Ambos zapatos terminan orientados hacia el avance; el izquierdo conserva su reflejo rígido, y los pasos usan únicamente traslación y rotación. No se interpolan ni sustituyen sus paths originales.

La primera pasada completa encontró una esquina superior izquierda descubierta en 26 cuadros: 20–26, 60–66 y 100–111. Se amplió el solape superior de la unión menos de una unidad lateral y 1.2 unidades hacia arriba, sin alterar el zapato ni sus apoyos.

## Comprobación reproducible

`Errores/401-revision-piernas.html` muestra los 576 cuadros de entrada y una vuelta completa del bucle. Renderiza el mismo `SessionActor` y evaluador de poses que la vista 401; sólo centra el desplazamiento global y recorta la vista a los pies para inspeccionarlos. La cobertura y las proporciones relativas son invariantes ante esa traslación.

En cada cuadro se comprueban ambas piernas: 33 muestras a lo ancho de cada borde superior y nueve en el encuentro con el cuerpo. Se comprueba también que los paths sean idénticos al snapshot maestro y que la matriz relativa de cada pie conserve longitudes, perpendicularidad y área (reflejo permitido, compresión prohibida).

Segunda pasada tras corregir: **576 cuadros, 1.152 piernas, 48.384 puntos, cero cuadros con fallos detectados**. Desviación máxima de la matriz rígida: 2.22e−16, redondeo numérico. Sin cambios de paths del maestro. Resumen antes/después en `leg-frame-audit.json`; el informe completo por cuadro se recalcula y queda visible en la página de revisión.

Build y diez pruebas de movimiento aprobados. La tira de cuadros permite revisión visual; las comprobaciones geométricas exhaustivas no equivalen a aprobación estética. Las capturas adicionales de tramos se demoraron en el navegador; no se afirma una inspección manual individual de las 576 imágenes. Naturalidad pendiente del usuario. No hay publicación ni modificación de librería.

Animación: http://127.0.0.1:5198/Errores/401.html

Revisión: http://127.0.0.1:5198/Errores/401-revision-piernas.html
