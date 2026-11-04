# Corrección de brazos, contacto y fragmentos — 2026-10-30

Continuación de la propuesta elegida; modo evolve / reuse, sin modificar estructura ni paquete público. Se aplican Dona Asistente, sial-design-proposals, sial-web-library (contrato maestro) y Remotion. SELF: geometría, evaluación de cuadros y renderer comparten estado local; separarlos no aporta independencia útil.

Los brazos conservan los paths del maestro y sus longitudes. Se corrige el hombro libre hacia el exterior, se ocultan las raíces tras el torso y la solución de soldadura usa el codo exterior. Mano, agarre y herramienta comparten sus transformaciones rígidas. El cable llega a la mano libre.

Los ocho fragmentos usan una huella calculada desde sus paredes y contorno real. La huella transformada permanece dentro de la cara útil del yunque, con margen en sus bordes. El fragmento que recibe el martillo y el datum quedan fijados. El resto reacciona después de los golpes 108/204/300/876/972 o durante la soldadura; se eliminan el desplazamiento previo al golpe de regreso y el desarmado automático final.

Las chispas de martillo se emiten por evento, con edad desde el contacto, dieciséis trayectorias balísticas, estelas, puntas calientes y núcleo breve. No se reciclan partículas por módulo temporal como si existieran antes del golpe. La soldadura conserva su emisión sostenida en la boquilla.

El relato se reproduce una vez y termina en un estado de inspección con mirada/parpadeo en bucle; la marca permanece armada. El botón de repetición reinicia explícitamente el relato. Se preservan pausa, movimiento reducido, tema y rutas existentes.

Validación: 20 pruebas Node aprobadas; recorridos completos de 1440/600 cuadros para contención, contacto, boquilla y continuidad, además de regresión 401. Build Vite aprobado. Revisión visual representativa: contacto108, chispas114 y soldadura1150. No equivale a inspeccionar visualmente cada SVG de cada cuadro.

Prototipo local: http://127.0.0.1:5198/Errores/mantenimiento-taller.html. Pendiente valoración del usuario; sin publicación, integración ni cambios de librería.
