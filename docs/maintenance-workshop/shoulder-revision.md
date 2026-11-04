# Anclaje anatómico del brazo libre — 2026-10-30

Corrección Web focalizada de la composición elegida, reuse/evolve. Misma tarea de Dona; contrato de maestro conservado con sial-web-library y animación Remotion del prototipo. SELF: modificación local de un anclaje y su orientación, sin beneficio independiente de delegación.

La captura mostró que bajar el brazo sólo por rotación no resolvía la anatomía: la reflexión horizontal del brazo maestro orientaba el codo hacia dentro del torso y su oclusión dejaba visible casi únicamente la mano. El antiguo hombro215,425 también estaba demasiado dentro del cuerpo.

Se fija el hombro libre en196,410, sobre el borde del torso (el contorno original pasa por193,411). La raíz circular de24 unidades solapa el cuerpo desde atrás y conserva unión. Se orienta el conjunto original en ambos ejes, sin escalar sus dimensiones, para que el codo se curve hacia el exterior en la pose baja. Brazo/palma o agarre comparten transformación rígida. El helper de posición de mano y el renderer usan el mismo anclaje; el extremo del cable sigue la nueva mano.

23 pruebas aprobadas: se añade regresión del anclaje, longitud de brazo/antebrazo y codo visible fuera del torso en todas las poses bajas de ambas secuencias. Permanecen las pruebas de contacto, fragmentos, cierre del bucle y regresión401. Build Vite aprobado. Revisión visual de reposo0, carrera650 y soldadura1150 a1280×720. Evidencia: D:/SIAL/Librerias/mantenimiento-hombro-corregido.png.

El bucle29s de reparación/recaída y el martillo no cambian en esta corrección. Misma tarea del taller En Revisión; pendiente valoración visual, sin publicar ni cambiar el paquete de librería.
