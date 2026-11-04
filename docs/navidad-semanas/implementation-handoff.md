# Adopción navideña en SIAL Web

Propuesta de implementación, no ejecutada en producto. Fuentes locales leídas el2026-11-03.

## Fronteras

- Librería: SVG originales, anclajes, capa frontal de inserción, comportamiento amortiguado, pausa, tema y movimiento reducido. Componente decorativo optativo, sin datos de negocio ni fechas de campaña. API por definir y validar en catálogo; no se presenta como publicada.
- Aplicación: activación de temporada, alcance de vistas y estado del menú. Una configuración central en el shell decide Navidad/default; no se consultan fechas en cada componente.
- No copiar el script de propuesta: las inserciones usan React y referencias explícitas a slots, sin selectores ni MutationObserver del DOM.

## Puntos confirmados

1. `src/components/sections/dashboard-header.tsx`: DashboardHeader usa useSidebar. Leer collapsed y pasar expanded={!collapsed} al candidato de luces. Mantener menú, tema y perfil. No introducir buscador como parte de la temporada; existe SearchInput en este checkout, aunque la referencia visual del usuario no lo muestra: respetar el shell efectivo del consumidor.
2. `src/app/(main)/layout.tsx`: composición estable dentro de SidebarProvider; aquí se puede distribuir configuración de temporada, conservando rutas y sesión.
3. `src/features/planning/weeks/components/planning-weeks-page.tsx` y `weeks-management-table.tsx`: piloto de indicadores y superficie de tabla. Montar adornos en slots de decoración optativos, no añadir padding al componente para hacerlos caber. Generar semanas conserva variante decorada; Exportar normal.
4. `src/contexts/sidebar-context.tsx`: collapsed ya es estado canónico. La guirnalda no crea otro menú ni otro temporizador.

## Dependencia que debe resolverse antes del piloto

El proyecto declara @banasandev/banasan-ui y lo sobrescribe mediante link a `.worktrees/web/ribbon-purple-variant`; el trabajo navideño del logo está en christmas-isotype. El tipo de SialIsotype del checkout consumido no tiene variant navideña. Consolidar el delta autorizado en la fuente realmente consumida y comprobar sus exports/build antes de probar. No cambiar el link o sustituir el paquete completo sin conservar el trabajo ya presente. La adopción definitiva usa versión de paquete publicada; el link se limita al piloto local.

## Orden mínimo

1. Consolidar arte y motion en librería, con dos consumidores previstos y pruebas de anclaje/oclusión; conservar default intacto.
2. Conectar una sola vez luces al header y temporada al shell.
3. Activar solo Semanas para comparar default/Navidad y revisar claro/oscuro, escritorio/móvil, hover/foco y movimiento reducido.
4. Validar segunda bandeja antes de generalizar; luego versionar/publicar el paquete y adoptar la versión en producto.

Contrato visual: mismo tamaño/click target de controles, base de bastón bajo superficie frontal y pivote fijo, cifras libres. La aprobación del prototipo no equivale a despliegue o certificación funcional.

SELF: lectura puntual multirrepositorio para preparar adopción; no hay slice de construcción independiente ni cambio contractual ejecutado en producto.
