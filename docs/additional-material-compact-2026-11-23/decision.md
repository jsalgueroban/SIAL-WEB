# Auditoría de Material — Nuevo pedido adicional
Fecha: 2026-11-23. Perfil audit, plataforma web. SELF: alcance local de inspección, sin beneficio independiente de delegación. Sin cambios de interfaz ni librería.

Fuente: src/web/materials-additional-orders.jsx, Materiales y Suministros/sial-materiales.css, DESIGN.md y runtime servido localmente en 127.0.0.1:8080. Controles existentes SelectInput, NumberInput, Button e IconButton; no se propone ampliar API pública. Identidad conservada; distribución, densidad y copy son los ejes libres. Capacidad activada: medición DOM y revisión visual mediante Playwright.

## Evidencia
Escritorio 1366×768, dos materiales: sección 449 px; filas 169 y 168 px; columnas material 810 px, cantidad 292 px y acción 40 px. Motivo queda después de y=846 y pie en y=1193. El selector utiliza aproximadamente 69% del ancho interno de fila; los datos de comparación quedan debajo. El label de cantidad repite el nombre y se parte; su control comienza más abajo que el selector. Cantidad vacía muestra error antes de interacción. Al ingresar 10, el resultado cambia a stock disponible (1270), pero la altura de fila sigue en 169 px.

Móvil 390×844, dos materiales: sección 983 px; filas 401 y 382 px. Sin overflow horizontal del documento. Acción quitar aparece en una línea propia inferior; la secuencia de datos y avisos aumenta el recorrido. Pie a y=2165. El apilado móvil requiere composición específica, no trasladar seis columnas.

Capturas: output/playwright/adicional-material-audit-desktop.png y adicional-material-audit-mobile.png. La medición preliminar de 202 px por fila correspondía a viewport 1036×638; no compararla como si fuera 1366×768. Agregar material se ejecutó con force; no acredita clic natural ni QA funcional completo.

## Decisión recomendada
Compactar. Escritorio: material/código, pedido base, stock, cantidad adicional y quitar en una fila alineada. Mantener unidades visibles y relación accesible entre cantidad y material. Simplificar label visible de cantidad sin perder nombre accesible. Mensaje neutro antes de interacción, error después de interacción o intento de envío; conservar advertencias reales de stock. Móvil: material y quitar arriba, pedido base/stock juntos si caben, cantidad debajo con aviso corto.

Reducir separaciones redundantes y cabecera explicativa de sección; conservar tipografía y controles cómodos. No fijar porcentajes de ahorro sin prototipo medido. El bloque Pedido base también ocupa espacio antes de empezar, pero su modificación queda como observación adicional, no parte del cambio solicitado.

## Límites
Auditoría visual y geométrica de propuesta. No implementación, build, publicación, certificación Eva ni prueba integral de teclado, temas, selectores y envío. La mejora propuesta requiere construcción y comparación al mismo viewport/datos antes de declararse validada.

## Implementación local autorizada — 2026-11-23
El usuario seleccionó la composición descrita y pidió realizarla y mostrarla. Perfil local evolve; composición explore local ya elegida, sin alternativas globales pendientes. SELF: cambio acotado, sin contratos públicos ni beneficio independiente de delegación. Forma de tarea: captura repetida de materiales dentro de pedido adicional. Se conservan shell, fuentes, tokens y datos. API publicada revisada: NumberInput soporta onBlur/onChange; label conserva nombre accesible con texto visualmente oculto. No cambio de librería.

Delta: columnas material/código, pedido base, stock, cantidad y quitar. Ayuda neutra antes de interacción, errores al cambiar/salir de cantidad; advertencias y stock remanente conservados. Responsive con datos juntos y cantidad debajo. Se conserva validación de negocio y botón de envío existente.

Build UI correcto, advertencia @reference preexistente. diff --check de los dos archivos pasa. Runtime: agregar por clic natural, quitar, apertura de selector con cuatro opciones, cantidad 0/error, 1300/faltante 20 y 10/remanente 1270; Tab desde cantidad ejecutado. No envío real ni teclado completo certificado.

Escritorio 1366×768 con dos materiales vacíos: sección 449.38 → 318.48 px (29.1% menos). Con cantidades válidas y avisos completos: 380.88 px; no confundir estados distintos al comparar. Móvil 390×844 con dos cantidades válidas: 823.02 px, sin overflow horizontal. Capturas adicional-compacto-seccion.png, adicional-compacto-desktop.png, adicional-compacto-mobile-seccion.png y adicional-compacto-dark.png en output/playwright. Claro/oscuro y móvil revisados visualmente. Candidato local, pendiente aprobación visual del usuario; no publicación, integración de producto ni certificación Eva. Bundle local reconstruido conservando cambios preexistentes del checkout. Acceso por ruta existente de pedido adicional; click de navegación desde listado pendiente.
