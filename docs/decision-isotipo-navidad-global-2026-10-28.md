# Isotipo navideño en superficies Web independientes · 28/10/2026

El shell React ya mostraba el isotipo en las vistas operativas, pero el catálogo, acceso, errores, changelog y catálogo de componentes usaban marcas HTML propias sin ese montaje. La propuesta conecta esas marcas al mismo `SialIsotype` de temporada sin alterar la navegación ni modificar la librería; el shell operativo conserva su montaje existente. El cargador compartido y sus URLs llevan versión para renovar recursos en estas entradas.

Verificación local: 16 rutas independientes a 390 px, marcas y SVG uno a uno (dos en el catálogo de componentes) y sin desborde; cinco superficies probadas con movimiento reducido y alineación centrada. También se verificaron Fincas y Control de entregas sin duplicar el isotipo. Build y gate transversal 45/45 aprobados. El barrido inicial completo del navegador se interrumpió en la página 404 por su base específica de GitHub Pages; no acredita las 103 rutas y la 404 raíz debe contrastarse en el despliegue público.

El código es una copia de la fuente de la librería en desarrollo, no una publicación del paquete; la librería no fue modificada ni subida. La visibilidad publicada depende de la entrega de GitHub Pages y su caché.
