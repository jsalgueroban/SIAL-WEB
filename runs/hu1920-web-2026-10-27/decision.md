# Decisión de composición · HU1920 Web

| Campo | Decisión |
| --- | --- |
| Vista | Control de trazabilidad y estado de entregas |
| Forma | Dashboard de consulta y conciliación |
| Fuente | HU1920 y cadena HU2370 → HU1919/HU546 → evento de despacho → HU547/HU681/HU682 |
| Vía | `explore`: el dashboard de Transporte existente cubre flota, no conciliación de cantidades de materiales |
| Alcance | Específico de HU1920; no se promueve como patrón global |
| Hipótesis | Cuatro indicadores, curva de avance y barras de brecha muestran dónde se interrumpe la entrega sin sumar unidades incompatibles |
| Dirección de continuidad considerada | Tabla con filtros y cuatro columnas de cantidad; es precisa, pero obliga a reconstruir mentalmente la secuencia y el origen del desvío |
| Primera dirección explorada | Secuencia azul continua de cuatro etapas y matriz de casos. La referencia posterior del usuario pidió más estadísticas y gráficas. |
| Dirección intermedia explorada | Dashboard con barras por finca y anillo de cobertura POD. La revisión pidió que la gráfica principal leyera avance y brechas por etapa. |
| Dirección actual del prototipo | Una superficie de avance con cuatro cifras, curva y tres brechas; alertas discretas en la cabecera que abren la tabla filtrada; detalle por caso y viaje |
| Movimiento | La selección enfatiza la etapa en indicador y punto de la curva; curva y barras de brecha tienen transición breve. No anima cifras como si fueran tiempo real; movimiento reducido sin transición. |
| Estado | Prototipo Web listo para publicación de propuesta; escenario central representado visualmente y cobertura funcional productiva pendiente según `acceptance-audit.md` |

## Componentes

Controles publicados: `SelectInput`, `TextInput`, `Chip`, `Button`, `IconButton`, `Table`, `TableRowActions` y `Pagination`. Composición local: cuatro cifras y curva Recharts con tres brechas en una misma superficie, más tabla y detalle por caso. No se modifica la librería. La curva parte de cero y conecta etapas, no fechas.

Las alertas cuentan **casos** en finca, aviso y búsqueda, sin aplicar el filtro de material. Aparecen como enlaces de texto bajo el título; al seleccionar uno, la tabla muestra sus casos en todos los materiales y oculta temporalmente el panorama cuantitativo. Así no se mezclan unidades en indicadores. El detalle muestra asignaciones por viaje y vehículo; cada suma coincide con la magnitud programada. Se retiró el bloque de cortes por fuente porque sus horarios sintéticos no aportaban una decisión real. La fecha del ejemplo sigue visible en cabecera y la del caso en detalle; la frescura productiva permanece pendiente. Estas piezas locales responden a HU1920 y no se promueven como patrón general. `ROUTER: SELF`: ajuste de una vista con filtros, fixture y detalle acoplados, sin slice independiente rentable.

Excepción local de `SelectInput`: su variante publicada agrega fondo transparente; en los tres filtros de esta vista se usa `--color-field-bg` para igualar el fondo del `TextInput`. Se conservan borde, menú, foco y selección del componente.

## Verificación

- Acceso: Materiales y Suministros → Control de trazabilidad y estado de entregas → `control-trazabilidad-entregas.html`; clave activa `controlEntregas`.
- Vista y componentes: build UI y gate runtime de 45 recorridos en 1280 × 800 y 390 × 844, sin fallos de montaje, navegación, conteo o geometría. Inventario Web: 103 HTML; enlaces locales rotos: 0.
- Datos: sumas por material/unidad comprobadas para 2.000 aprobadas, 2.000 programadas, 1.800 despachadas y 1.700 con POD en UN. Se comprobó sobreprogramación de Zuncho, ausencia de POD, cero resultados, búsqueda por nombre de material y foco del detalle.
- Revisión operativa: cinco asignaciones de caso cuadran con `Programado`; la alerta sobreprogramada filtra la tabla a Zuncho y su detalle muestra 400 M aprobados frente a 450 M programados (300 + 150 M). Alertas iniciales: 1 sobreprogramado, 3 con entrega/POD por conciliar y 1 sin despacho. La selección de alerta muestra la tabla sin gráfica y sin sumar unidades distintas. Sin desbordamiento horizontal a 1280 y 390 px.
- Aspecto: claro y oscuro inspeccionados en 1280 × 800 y 390 × 844; la curva se desplaza dentro de su panel a 390 sin desbordar la página. `prefers-reduced-motion` desactiva transiciones y animación de las gráficas.
- Límite: las rutas de origen abren la vista de cada proceso, sin deep link a un registro sintético. Los errores de una fuente remota y su recuperación dependen del contrato productivo aún no disponible.
- Cobertura HU: ver `acceptance-audit.md`. El prototipo no debe presentarse como implementación completa o validación operativa de HU1920.
- `run-tests.ps1` de la skill se detiene antes de la propuesta por una prueba interna que exige la cadena histórica «Débora» en `design-impact-evaluation.md`. Se ejecutaron por separado sincronización de contexto, escaneo, registro, validación y gate runtime; no se cambió la skill para esta entrega.
