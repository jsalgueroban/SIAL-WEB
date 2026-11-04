# 401 — tres contextos de aplicación

Modo creative/explore, plataforma Web, forma de tarea recuperación de sesión. El usuario rechaza el contexto de puerta que rodea al personaje y pide tres propuestas. En la consulta de dirección eligió «Relacionado con la aplicación». Esa respuesta fija intención, no selecciona una composición.

## Criterios previos

Conservar Poppins, azul SIAL, marca, maestro y animación corregida, acción inmediata de iniciar sesión, retorno al catálogo y movimiento reducido. Contexto de 401 no autenticado, sin convertirlo en 403 ni prometer conservación de datos. Libres: jerarquía, distribución, superficie, relación entre Bananito y espacio de aplicación. Se evitan puertas, paisajes, candados repetidos y métricas ficticias.

Se contrastan tres estructuras: acceso abierto y despejado («Sesión en pausa»), ventana del espacio de trabajo («Tu espacio de trabajo») y superficie focalizada de recuperación («Acceso integrado»). Deben diferenciarse por distribución, integración del personaje y jerarquía, no sólo por color. La segunda se recomienda por la preferencia de contexto de aplicación; selección pendiente.

Fuentes: DESIGN.md, PRODUCT.md, Login/index.html, Errores/401.html, shared/sial-core.css y build local de SialMascot. El paquete instalado sigue en 1.4.0; el preview local conserva procedencia de librería 1.5.0 no publicada. Botones/tema HTML son adapters del core y el personaje es consumo real del componente compilado. No se promueve API ni cambia la geometría del maestro.

## Capacidades

SIAL design proposals gobierna dirección y comparación. SIAL web library aporta contrato/procedencia del preview. Frontend Design aporta composición y restricción de una firma por opción. Impeccable: contexto resuelto mediante launcher y respuesta del usuario, crítica de repetición/jerarquía, craft floor y detector final. Semilla de superficie consultada: seed:6459aaec116dd7bd; identidad SIAL y petición explícita gobiernan las tres alternativas. Se construyen prototipos navegables completos para la selección solicitada, sin pedir aprobación antes de hacerlos revisables.

SELF para el router externo: contexto visual local compartido. Las tres construcciones HTML/CSS se ejecutan en subagentes internos con archivos separados, conforme al flujo de exploración paralela de Impeccable; la raíz integra catálogo y revisión. Dona mantiene la misma tarea 401 y no se crean tareas duplicadas.

Modo Operate: recuperación comprensible desde la apertura, navegación estándar, sin datos privados de una sesión inactiva. Las superficies que evocan la aplicación son propuesta visual; no simulan una sesión ni reglas backend. Comparación en Errores/propuestas-401/index.html; cada opción tiene URL propia y acceso al login real del prototipo.

## Resultado y revisión

Rutas locales bajo http://127.0.0.1:5198/Errores/propuestas-401/: index.html compara; pausa.html ofrece texto e ilustración separados sobre una superficie abierta; espacio.html usa una ventana de aplicación con recuperación centrada y personaje acompañante; acceso.html reúne panel azul e identificación en una superficie compacta. B ofrece el contexto de aplicación más directo, A deja más aire y C da más peso al personaje y al azul.

Se revisaron escritorio 1440×900, móvil 390×844 y tema oscuro. Sin desbordamiento horizontal en las opciones. A/B priorizan la acción en móvil; C muestra primero el personaje y mantiene la acción dentro del alto móvil revisado. Se corrigió el orden móvil de B, contraste oscuro del botón y legibilidad de notas pequeñas. Los enlaces llevan al login, al catálogo y a la comparación. El maestro y la animación compartida no se modificaron.

El detector estático devolvió hallazgos: se corrigieron contraste de notas y tamaños de texto pequeños. Las advertencias sobre pseudoelementos y marquee del core corresponden a definiciones compartidas no usadas en estas propuestas. El apoyo visual inferior de C es deliberado. No se declara un detector sin hallazgos ni QA de producto completo.

La comparación usa capturas reales ligeras para evitar montar tres reproductores a la vez. Cada enlace abre el prototipo con su entrada y bucle animados. Las miniaturas muestran el modo claro; cada propuesta permite cambiar de tema. La vista 401 actual permanece disponible y no se ha reemplazado. Misma tarea Notion en En Revisión, con resumen leído y verificado; pendiente elección e integración.

## Ajuste local de altura — 2026-10-30

**Decisión posterior del usuario:** «la opción 1 es la ganadora». Sesión en pausa queda elegida; sustituye la recomendación previa de B. Su estructura guiará neutral, autenticación y mantenimiento (confirmación explícita), con escenario propio por contexto. Antes se pule el reposo de acceso restringido. Esta decisión no autoriza publicación.

El usuario solicita que Sesión en pausa ocupe correctamente la pantalla: su captura muestra el pie fuera del viewport. Perfil local, Web, reuse de la misma composición; sólo cambia geometría vertical. Se conserva marca, texto, navegación, maestro y movimiento. No se promueve una selección definitiva entre las tres propuestas.

El escenario Remotion mantiene una composición interna de 540×470. Su contenedor ahora limita el ancho según la altura disponible; así el reproductor escala uniformemente sin tocar anatomía ni animación. El shell distribuye cabecera, contenido flexible y pie en al menos 100svh. Cabecera/pie se adaptan y la copia reduce separaciones/título en escritorios bajos. En móvil se mantiene flujo natural y scroll; no se oculta overflow para simular ajuste. Sólo pausa.css cambia; core y paquete de librería permanecen intactos.

Fuente CSS confirmada tras la edición. La nueva comprobación visual del ajuste quedó pendiente: el navegador de pruebas se bloqueó al navegar y tampoco respondió la ejecución alternativa de terminal. No se atribuyen las mediciones de la entrega anterior a este delta. Misma tarea en En Revisión, con limitación explícita y selección general pendiente. SELF: ajuste local pequeño, sin beneficio de delegación.
