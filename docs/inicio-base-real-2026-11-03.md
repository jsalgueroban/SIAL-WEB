# Inicio: traslado de base real — 2026-11-03

SELF: lectura multirrepositorio con snapshot local; no slice independiente. Perfil local de réplica, web. Skills sial-design-proposals, sial-web-library modo consumo y Dona. La evolución creativa posterior permanece abierta.

## Fuentes
- Producto: src/app/(main)/dashboard/page.tsx y src/features/dashboard/{components,utils.ts}.
- Runtime: https://sial.banasan.com.co/dashboard, sesión visible SOPORTE TI, C.I. BANASAN S.A.S.
- Propuesta: inicio.html, accesible desde catálogo > Inicio > Inicio SIAL.

## Contenido y comportamiento conservados
Bienvenida, fecha capturada3noviembre, empresa/perfil, Continuar trabajando, cuatro resúmenes8módulos/29rutas/rol/sesión, primeros seis accesos del menú, usuario/rol/última actividad29oct12:05, ocho áreas con conteos1+2+4+6+4+6+3+3=29.
Continuar navega al primer acceso (Usuarios), como en producto. Las áreas enlazan a su primera vista local correspondiente. Los29accesos son el conteo del snapshot real, no el total de pantallas existentes en la propuesta. Datos estáticos para revisar la base; no autenticación ni consulta de permisos real.

## Consumo
Card y Card variant stats, Chip, Button, SialIcon, SialIsotype y flechas/reloj/check del paquete instalado. Links semánticos locales y CSS responsive de la composición. Isotipo normal en hero, shell compartido de propuesta preservado. Corrección local de tamaño del valor textual del perfil para evitar partir palabras; no se cambia la API pública.

## Hallazgos para evolución
- Accesos frecuentes no usa frecuencia: rutas.slice(0,6), dependiente del orden del menú.
- Continuar trabajando no reanuda una actividad; abre routes[0].
- Rol/empresa/sesión se repiten en bienvenida, resumen y contexto.
- Conteos de accesos informan disponibilidad, no actividad operacional. No inventar KPI.
- Priorizar accesos útiles y reducir redundancia será una decisión de composición posterior; la base actual se conserva para comparación.

## Validación
Build Vite correcto. Inicio abre sin errores de consola. Contenidos cotejados contra DOM real. Enlaces locales comprobados; acceso desde catálogo incorporado. Pallets cerrado por aprobación; Inicio queda en revisión como base de evolución.
