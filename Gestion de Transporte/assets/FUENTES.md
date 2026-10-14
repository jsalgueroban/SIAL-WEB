# Modelos genéricos del visor 3D

Estos archivos GLB son activos de referencia de la propuesta Web, no componentes publicados de la librería ni representaciones de un vehículo específico.

| Archivo | Modelo original | Fuente | Licencia |
| --- | --- | --- | --- |
| `camion-rigido.glb` | 7.5 t class box truck with roll-up door | [Innerscene 3D Parts Library](https://www.innerscene.com/tools/library/3d-parts/7-5-t-class-box-truck-with-roll-up-door-12baea66) | CC0 / dominio público |
| `tractomula.glb` | Semi tractor and box trailer | [Innerscene 3D Parts Library](https://www.innerscene.com/tools/library/3d-parts/semi-tractor-and-box-trailer-bc0bdac8) | CC0 / dominio público |
| `tractomula-detallada.glb` | Derivado del modelo anterior con detalles SIAL de cabina, chasis, acople y semirremolque | Modelo anterior + `src/web/tractomula-detail.js`, generado por `pnpm build:tractomula` | CC0 / dominio público para el modelo base |

Los dos modelos base se descargaron el 13 de octubre de 2026. Los activos se sirven localmente, sin dependencia del sitio de origen en tiempo de ejecución. La tractomula detallada conserva el chasis y semirremolque de Innerscene, reemplaza la cabina cúbica por una carrocería continua con cristales inclinados y añade piezas propias de la propuesta, sin marca ni placa. No representa un vehículo específico ni se considera una reproducción fotográfica o CAD. El activo derivado es reproducible con el script indicado.
