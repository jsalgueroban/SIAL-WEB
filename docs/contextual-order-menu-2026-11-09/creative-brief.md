# Acciones contextuales en Materiales · brief

## Intención y alcance

- Plataforma: Web. Módulo: Materiales y Suministros. Perfil: exploración creativa de interacción, limitada a un prototipo aislado.
- Pedido de John: ver en acción una propuesta de clic derecho aplicable a las vistas de Materiales y sus gestiones extensas. Después solicitó pulir el prototipo, usarlo en diferentes contextos y perfeccionar movimiento e interacción.
- Objetivo: llevar al operador desde un pedido de una bandeja hasta la consulta o gestión pertinente, conservando el contexto y reduciendo acciones visibles repetidas.
- Criterio observable: el menú abre en la fila elegida por clic derecho, botón visible o teclado; distingue pedidos pendientes y cerrados; conduce a un resumen contextual o a vistas existentes.
- Forma de tarea: bandeja de gestión. Pantalla maestra: las bandejas de Materiales existentes. El prototipo no representa la aprobación por material ni ejecuta transiciones.

## Restricciones y ejes de diseño

- Se conserva shell, tipografía, colores, tabla, tokens y ruta actual de Materiales. Los datos del prototipo son ilustrativos.
- La HU y la aplicación real conservan la autoridad sobre estados, permisos, cantidades, persistencia y destinos exactos. No se asume que la vista real acepte un identificador por URL.
- Ejes libres: ubicación del acceso, densidad de acciones, jerarquía del menú, adaptación a pantallas estrechas y continuidad visual entre pedido, material e inventario.
- Movimiento: apertura breve anclada al origen para puntero; apertura inmediata por teclado; feedback de panel y copia de baja amplitud; sin movimiento con preferencia reducida.
- La composición seleccionada para explorar es «menú sobre pedido → destino preciso»: acciones breves en el menú y operaciones extensas en su vista actual. John pidió una propuesta, por lo que se construye una sola variante navegable para revisión.

## Frontera de promoción

El menú y la composición móvil de tarjetas son `proposal-only`. No se modifica la librería Web productiva ni se declaran permisos o datos de stock verificados. Si el patrón se aprueba, la librería Web deberá evaluar un componente accesible de menú contextual y la aplicación definirá acciones según objeto, estado y permisos. Los tres contextos de la exploración comparten motor de interacción, pero cada vista productiva conservará su fuente funcional.
