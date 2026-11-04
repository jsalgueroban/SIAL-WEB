# 401 — volver a la composición del modelo existente

El usuario rechazó la falta de uniformidad del movimiento y de los brazos respecto a los modelos existentes. La comparación del código mostró que cortar `MasterPresentationArm` y añadir cápsulas y círculos cambiaba su silueta. Esta revisión sustituye ese ensamblaje por el brazo curvo completo del snapshot, sin recortes, huesos separados, rellenos nuevos ni codo circular.

SELF: ajuste local que une comparación visual, composición y movimiento de una misma fuente; no hay beneficio independiente en delegar. Misma tarea de propuesta; se conservan las skills Dona, SIAL design proposals, web library y Remotion. No se modifica el paquete de librería.

## Referencias y cambio

- Referencia: `mascot_artwork.tsx` y `mascot_master_limbs.tsx` del worktree christmas-isotype, modelos authentication/forbidden. El brazo de presentación y la palma son compartidos por esos modelos.
- Colocación final derecha: hombro 365/425, rotación −18°, escala .92; izquierda: hombro 215/425, reflejo, rotación 28°, escala .9. Son las colocaciones del modelo forbidden existente. Mano y brazo viven bajo la misma matriz; la señal compensa el reflejo para conservar el texto legible y su orientación.
- Caminata con brazos bajos a 48°/−42°, elevación conjunta con la misma curva temporal hasta la pose del catálogo. La palma usa sólo 12° de corrección adicional durante el porte. No se reconstruye el brazo a partir de segmentos rectos ni se cambia su curvatura para alcanzar un destino.
- Bucle de cuatro segundos con anticipación leve del cuerpo, elevación del ALTO, pausa y regreso. Cuerpo y brazos responden al mismo gesto; el escudo permanece apoyado y no cabecea de forma independiente. Se conserva la entrada única y el segmento nativo de repetición.

## Revisión

`Errores/401-modelos.html` muestra lado a lado el SialMascot forbidden del build local y la composición ajustada, a la misma escala. `?scene-frame=336` permite comparar la pose base quieta; sin parámetro se reproduce el ciclo ajustado. La vista funcional permanece en `Errores/401.html`.

Siete pruebas comprueban dimensiones rígidas, continuidad de muñecas, orientación del ALTO, presentación del escudo, apoyo, periodicidad y coincidencia con las colocaciones del catálogo. Build aprobado. La comparación visual no equivale a aceptación humana: uniformidad y naturalidad quedan pendientes de valoración del usuario.

Esta decisión sustituye las envolventes y longitudes segmentadas descritas en `idle-transition-2026-10-30.md`; ese documento queda como antecedente. Cuerpo, manos y accesorios conservan su fuente; el brazo ahora conserva también su silueta completa.

Evidencia runtime: comparación lado a lado a 1200×780; pose del gesto y vista a 390×844 sin desborde. Cada brazo conserva los tres elementos del fragmento original, sin piezas de relleno. Error medido entre origen de mano y anclaje del maestro inferior a 1e-12 px en ambos lados. Observador registró todas las fases de entrada y dos wraps 575→336. Movimiento reducido fijó 336 durante la observación. No se certifica naturalidad por medición geométrica; la valoración visual permanece pendiente.
