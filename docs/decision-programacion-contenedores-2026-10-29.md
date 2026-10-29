# Programación de contenedores: evolución visual

Fecha: 2026-10-29. Plataforma: web. Forma de tarea: gestión con formulario y consulta. Composición seleccionada: formulario de parametrización con representación de contenedor y tabla de programaciones.

Fuentes: vista local `Gestion Operaciones Puerto/programacion-contenedores.html`; formulario y contratos de operaciones de contenedor de SIAL; referencias fotográficas del usuario. La navegación existente corresponde a Puerto → Programación de contenedores (`programacionContenedores`).

La selección múltiple, observación única, validaciones y etapas del prototipo previo se conservan. Se distinguen la etapa y el estado de la semana; la imagen es una representación genérica. El formulario mantiene los controles y adaptadores existentes: el selector especializado es local a la propuesta. No se modificó la librería.

Límite: esta propuesta no está conectada al backend; calcula una semana desde una fecha y opera con datos en memoria, mientras el producto utiliza el catálogo de semanas vigentes o futuras. La selección de semanas reales, persistencia, permisos, actualización concurrente y eliminación condicionada necesitan integración de producto. No se declara implementado el movimiento inicial ni las validaciones del servidor.

Verificación local: selección, retiro, limpieza al cambiar semana, guardado de ejemplo y carga de imagen; comprobación de desborde a 1280 y 390 px. No equivale a QA funcional, prueba de permisos ni publicación.

## Ajuste posterior: utilidad visual

Tras el feedback de John, se reemplazó la ilustración decorativa por una vista previa ligada a la selección: código y tipo, cantidad seleccionada, navegación anterior/siguiente, semana calculada y etapa inicial. Es una imagen genérica y no representa una fotografía de la unidad. Verificados en navegador selección múltiple, navegación, limpieza al cambiar semana, estado vacío y desborde móvil; datos y persistencia conservan la frontera local indicada arriba.
