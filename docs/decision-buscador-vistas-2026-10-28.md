# Buscador de vistas en menú izquierdo · 28/10/2026

Dirección explícita de John; propuesta Web, vía reuse de TextInput e IconButton publicados en @banasandev/banasan-ui 1.4.0. Dona mantiene la tarea global de normalización. SELF: componente compartido de navegación y estado local; no hay un slice independiente útil para delegar.

El shell React incluye búsqueda por nombre de vista y módulo, con términos combinados e insensible a tildes y mayúsculas. Solo filtra el contrato de navegación existente: no agrega rutas, permisos ni consultas remotas. Los grupos coincidentes se abren temporalmente; limpiar recupera expansión previa sin modificar localStorage de los módulos. Se muestra cantidad de coincidencias o estado vacío anunciado. Escape limpia primero; en móvil un segundo Escape cierra el menú. El menú contraído ofrece una lupa que expande y enfoca el campo. El buscador superior previo queda fuera de este cambio.

Los resultados conservan enlaces y vista activa. El alto de las filas de resultados se adapta a nombres de varias líneas, evitando textos superpuestos. La búsqueda es transitoria y se reinicia al navegar. Sin backend ni cambios en librería productiva.

Verificado en navegador: búsqueda de aprobacion encuentra Aprobación; materiales inventario encuentra tres vistas; cero resultados; limpiar y Escape; persistencia de expansión previa; foco desde menú contraído; navegación real a Reglas documentales; overlay móvil y Escape en dos pasos; claro/oscuro y ancho 390/1280. Inputs y resultados dentro del panel. Build aprobado; gate runtime transversal 45/45 previo al ajuste final de altura de resultados, verificado específicamente después en navegador. Code craft del shell sin hallazgos. Publicación y aprobación visual pendientes; cambios locales.
