# Sincronización de la propuesta Web con el proyecto Web

Fecha de corte: 2026-10-01

## Objetivo

Conservar en la propuesta únicamente vistas que:

1. tienen una ruta vigente en `fe-sial-web`;
2. tuvieron una ruta verificable en la historia Git de `fe-sial-web`;
3. representan una HU o flujo Web aprobado aún no integrado; o
4. son soporte explícito del catálogo y no se presentan como vista funcional del producto.

Ninguna vista candidata se retira antes de la aprobación de John.

## Fuentes comparadas

- Propuesta Web: 110 archivos HTML.
- Proyecto Web actual: 62 rutas `page.tsx`.
- Historia del proyecto Web: 183 rutas `page.tsx` únicas.
- Catálogo de la propuesta: `sial-catalogo.js`.
- Evidencia complementaria: mapeos HU, README y decisiones locales por módulo.

La ausencia de una ruta actual no basta para retirar una vista. La historia Git y la trazabilidad HU prevalecen sobre una coincidencia de nombre.

## Clasificación inicial

### Conservar — equivalencia actual o histórica confirmada

| Familia de propuesta | Evidencia en proyecto Web |
| --- | --- |
| Autenticación institucional, selección de empresa y recuperación | Rutas actuales `/login`, `/login/select-company` y `/recovery-password`; el flujo OTP/restablecimiento también aparece en la historia. |
| Errores 401, 403, 404, 500 y 503 | Rutas actuales equivalentes. |
| Usuarios, permisos, empresas, contactos, dependencias y roles | Rutas actuales e históricas bajo `/admin/users`, `/admin/company` y `/admin/permissions`. |
| Fincas, grupos, sectores y asignación de roles | Rutas actuales e históricas bajo `/admin/farms`. |
| Avisos de corte, cintas y semanas | Rutas actuales bajo `/admin/planning`. |
| Referencias y clases de producto | Rutas actuales e históricas bajo `/admin/products/references`. |
| Conductores, licencias, vehículos, tipos y matriz documental | Rutas actuales e históricas bajo `/admin/transport`. |
| Puertos, contenedores, tipos, etapas, programación y pallets | Rutas actuales o históricas bajo `/admin/port`, `/admin/container` y `/admin/pallets`. |
| Auditoría operativa, auditoría de vehículos y POMA | Rutas actuales bajo `/admin/audit`. |
| Materiales, recetas y pedido sugerido | Rutas actuales bajo `/admin/supplies`; categorías de materiales aparece en la historia. |

### Conservar — propuesta con trazabilidad HU aunque aún no tenga ruta actual

- `Gestion de Transporte/plan-operacional.html` — HU2367.
- Vistas de aprobación, pedidos recurrentes, categorías, pedidos adicionales, trazabilidad, inventario y transporte de `Materiales y Suministros/` con mapeo HU o tarea operativa vigente.
- Vistas POMA separadas de preparación y documento cuando representan estados distintos del mismo flujo aprobado.

Estas vistas no se eliminan por ausencia de implementación actual; requieren decisión funcional o cierre explícito de su HU.

### Conservar como soporte del catálogo, fuera del inventario funcional

- `index.html` raíz.
- `shared/componentes.html`.
- Los `index.html` de módulo que sirven como navegación interna del catálogo.
- `404.html` raíz usado como fallback de GitHub Pages.

Estas páginas no deben presentarse como funcionalidades del proyecto Web.

## Candidatas de alta confianza para retirar o archivar

No tienen ruta actual propia, no muestran HU en la vista y duplican una superficie funcional que ya tiene equivalente canónico.

| Grupo | Archivos | Razón |
| --- | --- | --- |
| Variantes Cover Flow de autenticación | `Login/login-cover-flow.html`, `Login/recuperar-cover-flow.html`, `Login/verificar-cover-flow.html`, `Login/restablecer-cover-flow.html` | Son variantes visuales paralelas. El proyecto conserva un único flujo institucional y la propuesta ya tiene sus equivalentes canónicos sin Cover Flow. |
| Inicios conceptuales alternativos | `Inicio/centro-excepciones.html`, `Inicio/jornada-operativa.html`, `Inicio/torre-control.html`, `Inicio/inicio-personalizado.html`, `Inicio/resumen-ejecutivo.html` | El proyecto posee una única ruta `/dashboard`; estas cinco vistas fueron introducidas juntas como propuestas adaptables y no como rutas del producto. |
| Changelog independiente | `Changelog/index.html`, `Changelog/changelog-interno.html`, `Changelog/administracion-changelog.html` | No existe ruta actual o histórica equivalente en el proyecto Web. |
| Catálogo de indicadores | `Indicadores/index.html` | No existe ruta actual o histórica equivalente en el proyecto Web. |
| Mantenimiento duplicado | `Errores/mantenimiento.html` | Duplica el propósito cubierto por la vista 503, que sí tiene ruta vigente. |

Total inicial de alta confianza: **14 vistas**.

## Candidatas que requieren validación funcional antes de retirar

No se encontró una ruta actual o histórica nominalmente equivalente, pero el nombre puede representar una capacidad absorbida por otra pantalla o un flujo respaldado por HU.

| Archivo | Pregunta de decisión |
| --- | --- |
| `Gestion de Empresas/gestion-notificaciones-contactos.html` | ¿Las alertas por contacto siguen siendo una capacidad Web o quedaron absorbidas por la gestión de contactos? |
| `Gestion de Fincas/gestion-productos-finca.html` | ¿La relación producto–finca continúa en alcance o fue sustituida por referencias/roles de finca? |
| `Gestion de Fincas/gestion-tipos-fruta.html` | ¿Tipo de fruta sigue siendo una maestra Web vigente o quedó fuera del modelo actual? |
| `Gestion de Planeacion/monitoreo-calendarios.html` | ¿El monitoreo es una vista propia o una lectura dentro de semanas? |
| `Gestion de Planeacion/validacion-calendario.html` | ¿La validación es una vista propia o una acción/estado de semanas? |
| `Trazabilidad/gestion-tipos-evento-trazabilidad.html` | ¿La maestra de tipos de evento se administra desde Web o desde backend/configuración? |
| `Trazabilidad/gestion-tipos-inspeccion.html` | ¿La maestra de tipos de inspección se administra desde Web o desde backend/configuración? |

Total pendiente de decisión funcional: **7 vistas**.

## Decisión de validación de John

Fecha: 2026-10-01

John indicó conservar únicamente las candidatas **10, 11, 12, 14 y 15** del inventario numerado. Las demás candidatas quedan aprobadas para retiro, sin ejecutar todavía la eliminación física hasta completar la revisión del impacto en navegación y referencias.

| # | Vista | Decisión |
| ---: | --- | --- |
| 1 | `Login/login-cover-flow.html` | Retirar |
| 2 | `Login/recuperar-cover-flow.html` | Retirar |
| 3 | `Login/verificar-cover-flow.html` | Retirar |
| 4 | `Login/restablecer-cover-flow.html` | Retirar |
| 5 | `Inicio/centro-excepciones.html` | Retirar |
| 6 | `Inicio/jornada-operativa.html` | Retirar |
| 7 | `Inicio/torre-control.html` | Retirar |
| 8 | `Inicio/inicio-personalizado.html` | Retirar |
| 9 | `Inicio/resumen-ejecutivo.html` | Retirar |
| 10 | `Changelog/index.html` | Conservar |
| 11 | `Changelog/changelog-interno.html` | Conservar |
| 12 | `Changelog/administracion-changelog.html` | Conservar |
| 13 | `Indicadores/index.html` | Retirar |
| 14 | `Errores/mantenimiento.html` | Conservar |
| 15 | `Gestion de Empresas/gestion-notificaciones-contactos.html` | Conservar |
| 16 | `Gestion de Fincas/gestion-productos-finca.html` | Retirar |
| 17 | `Gestion de Fincas/gestion-tipos-fruta.html` | Retirar |
| 18 | `Gestion de Planeacion/monitoreo-calendarios.html` | Retirar |
| 19 | `Gestion de Planeacion/validacion-calendario.html` | Retirar |
| 20 | `Trazabilidad/gestion-tipos-evento-trazabilidad.html` | Retirar |
| 21 | `Trazabilidad/gestion-tipos-inspeccion.html` | Retirar |

Resultado: **5 vistas se conservan y 16 quedan aprobadas para retiro**.

## Acciones después de la aprobación

1. Retirar o mover a archivo las vistas aprobadas.
2. Eliminar sus entradas de `sial-catalogo.js` y de la navegación compartida.
3. Corregir enlaces entrantes, referencias documentales y contadores del catálogo.
4. Validar que no existan rutas internas rotas.
5. Ejecutar validación de contexto y QA visual/navegacional.
6. Publicar únicamente después de la aprobación explícita de John.

## Registro de delegación

- Decisión: `SELF`.
- Slice evaluado: comparación transversal propuesta Web ↔ proyecto Web.
- Razón: antes de aprobar el inventario no existe un slice independiente; transferir historia Git, mapeos HU y excepciones del catálogo cuesta lo mismo que el análisis directo.
