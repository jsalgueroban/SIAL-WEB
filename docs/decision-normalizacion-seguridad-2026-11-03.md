# Seguridad — entrega para revisión visual

## Alcance y criterio

Perfil local, plataforma Web: Auditoría operativa y Generar documento POMA, más entrada del módulo y vista auxiliar Documento POMA. Acceso: menú Seguridad → Auditoría / Generar POMA; índice enlaza ambas; vista auxiliar vuelve a generación. Se conserva la composición de revisión por operación, árbol y evidencia. No se agregan permisos, sesión ni integraciones productivas.

Skills: sial-design-proposals, sial-web-library y Dona Asistente. Router evaluado: SELF, porque el slice depende de los adaptadores y estado local de la misma propuesta; transferir el contexto no aporta independencia útil. No se modifica ni publica el paquete de librería.

## Cambios

- Auditoría: TextInput, SelectInput, DateInput, Chip, Button, Notice y Toast publicados mediante los adaptadores existentes. Etiquetas visibles sin duplicación; escoba condicional y movimiento compartido de entrada, salida y reacomodo. La limpieza conserva el año inicial y restablece los demás criterios.
- Aprobar evidencias requiere confirmación con operación, evento y cantidad; cancelar no modifica nada. La aprobación de demostración actualiza chip/comentario y emite Toast. No se afirma persistencia fuera de la sesión.
- Fechas invertidas marcan error e informan con Toast. El detalle contiene el foco y lo devuelve a Detalle completo al cerrar. Se conserva el contenido contextual del panel y visor de evidencias.
- POMA: carga de la salida de ejemplo por identificadores visibles, validación y recuperación. Al editar la búsqueda se ocultan datos anteriores hasta cargar una coincidencia. TextInput y Button publicados.
- Table y Pagination publicados para 12 pallets de muestra, sin fila provisional de puntos suspensivos. Totales coherentes: 12 × 88 cajas y 12 × 1.670 kg. Confirmación previa a generar; PDF local válido marcado DEMOSTRACIÓN, visor, descarga, contador y fecha de generación, Toast de resultado.
- Entrada: retiro de métricas sin dato útil y accesos a las dos vistas vigentes. Documento POMA auxiliar: estado vacío comprensible y regreso a generación.
- Ajuste móvil del carrusel: se elimina columna residual de navegación oculta que reducía el contenido a 34 px. Tipografía de resúmenes y pares etiqueta/valor normalizada. Tildes en etiquetas y títulos intervenidos.

## Evidencia

- Build UI aprobado; sintaxis de los tres scripts y diff --check sin errores.
- Gate transversal aprobado: output/seguridad-gate-20261103.json. No sustituye los recorridos específicos.
- Cuatro rutas × 1280/390: sin errores JS ni desbordes documentales.
- Auditoría: búsqueda sin resultados, escoba y limpieza, seleccionar operación, cancelar/aprobar evidencias (0→1 aprobación), fechas publicadas, abrir/cerrar detalle y recuperación de foco.
- Movimiento compartido capturado: reacomodo 520 ms, entrada 480 ms. Con movimiento reducido no se ejecuta farm-filter-layout.
- POMA: segunda página 11–12, carga inválida oculta datos y marca aria-invalid; recuperación con TUL458. Confirmar genera blob PDF con encabezado %PDF-1.4; Escape cierra visor.
- Capturas inspeccionadas: output/seguridad-auditoria-desktop.png, output/seguridad-auditoria-mobile.png y output/seguridad-poma-mobile.png. La captura móvil identificó el defecto del carrusel y se regeneró tras corregirlo.

## Excepciones y estado

El árbol, carrusel y panel de evidencia son composiciones de esta vista. El detalle contextual y los visores conservan sus contenedores locales: el adaptador genérico de Drawer no conserva imágenes, puntos de control ni la estructura de trazabilidad. La confirmación reutiliza la composición compartida con Button publicado. No se presentan estas piezas como componentes publicados.

Las fotografías de los datos sin archivo asociado conservan su estado vacío; no se fabrican evidencias. POMA utiliza datos de ejemplo y un PDF local, no la plantilla oficial ni un servicio productivo. La verificación de las vistas no constituye certificación funcional del producto.

**En Revisión**: listo para revisión visual de John; no cerrado ni publicado. Puerto mantiene su cierre aprobado. Primero se completan los bloques; después se abordan mejoras específicas de vistas y flujos, distinguiendo criterios locales, de familia y compartidos.

## Estado actualizado por aprobación del usuario
Seguimiento operacional de vehículos: cerrado como propuesta, incluido drawer y consumo local del recorrido publicado en la rama de trabajo de librería (sin release remoto). Siguiente: seguimiento de contenedores, contraste e inicio documentados en contraste-contenedores-2026-11-03.md. Seguridad sigue abierto.
