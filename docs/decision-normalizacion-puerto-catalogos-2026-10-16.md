# Normalización Web — catálogos de Operaciones Puerto

Fecha: 2026-10-16. Estado: bloque local y parcial; no acredita aprobación visual ni publicación.

## Decisión

`gestion-contenedores`, `gestion-etapas-contenedor`, `gestion-puertos` y `gestion-tipos-contenedor` son catálogos con alta breve embebida. Reutilizan la anatomía de bandeja: acción y contador en el encabezado, búsqueda y filtros alineados, `Table` con chips y acciones, `Pagination`, `Drawer` y controles de formulario publicados por `@banasandev/banasan-ui` 1.4.0. Se conservaron las reglas de unicidad, formato ISO y capacidad existentes. El control numérico de capacidad sigue nativo, no se presentó como componente de librería.

Se retiraron cuatro banners que repetían reglas ya descritas en el encabezado del formulario o junto al campo. Los mensajes de éxito ocultos dentro de los formularios pasaron a feedback inline; no se añadió una notice dentro de ellos. Se mantuvieron los formularios centrados y las acciones de tabla en el encabezado de cada card. No se tocó el paquete de librería ni se añadieron rutas o métricas ficticias.

## Evidencia y pendientes

El navegador local `127.0.0.1:4175` montó en las cuatro vistas una `Table` con tres filas, `Pagination`, búsqueda `TextInput`, dos filtros `SelectInput` y formularios con botones publicados. En Tipos de contenedor, el filtro Inactivo redujo tabla, contador y paginado a un registro; el detalle abrió el `Drawer` publicado. A 390 px, la toolbar de Tipos no desbordó horizontalmente. `pnpm build:ui` pasó. La suite de contexto sin gate runtime pasó con 101 HTML Web, 53 Móvil y cero enlaces rotos; esta corrida no sustituye la verificación visual o funcional por vista.

Faltan captura válida, exportación, acciones de estado, teclado, contraste y revisión visual de John. El inventario se amplió de 97 a 101 rutas para incluir cuatro vistas nuevas; las cifras originales no se recalcularon retroactivamente. Decisión de delegación: `SELF`, por cuatro adaptaciones homogéneas acopladas al mismo estado local y adaptador, sin slice independiente que compense el traspaso.

## Corrección de alineación

El campo nativo `type=number` de Capacidad conservaba el `gap` de la rejilla `.field` además del margen del label, por lo que su input quedaba 8 px por debajo de Código y Descripción montados desde la librería. Se aplicó una excepción local `native-number-field` en `sial-puerto.css`, sin alterar otros formularios. En navegador, los tres labels quedaron en `y=514` y los tres inputs en `y=542`; tras enviar vacío, los tres inputs mantuvieron `y=542` con error visible. No se cambió la validación de capacidad.
