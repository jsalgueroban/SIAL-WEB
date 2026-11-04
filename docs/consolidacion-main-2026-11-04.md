# Consolidación de la propuesta Web — 2026-11-04

Alcance autorizado: reunir cambios locales y ramas de SIAL-WEB, validar e integrar en main. SELF: integración depende del estado local completo; delegar este estado no aporta aislamiento ni independencia útil.

- Inventario: checkout principal con cambios y worktree HU546 Publicacion limpio.
- Todas las ramas funcionales ya eran antecesoras de origin/main. La rama hotfix tenía commits duplicados con árbol exactamente igual a origin/main antes del trabajo local (git diff origin/main 6e1c270 sin diferencias).
- Se guardaron 497 archivos de normalización, exploraciones, recursos, artefactos compilados y documentación. No se añaden node_modules, .npmrc ni archivos ignorados. Exploraciones no aprobadas se conservan como tales; consolidar no equivale a aprobarlas.
- Los conflictos de integración duplicada se resolvieron conservando el árbol consolidado; no existía un delta remoto independiente que descartar.
- El respaldo histórico de julio se conserva íntegro como patch en docs/archivo-ramas. Su ascendencia se incorpora sin restaurar versiones antiguas sobre Planeación aprobada. No se borran ramas.
- Verificación: 40 pruebas unitarias existentes pasan; builds de UI, visor de vehículos y control de entregas pasan. Inspección de patrones de credenciales sin hallazgos y sin archivos mayores de 50 MB. Esta verificación no sustituye una revisión visual integral de las 497 piezas.
- Los bundles de experimentación de mascota se conservan junto con su procedencia; su compilación requiere checkouts externos y no se vuelve a generar en esta consolidación.

Publicación: verificar SHA local/remoto y contención de todas las referencias después del push. No se afirma despliegue en Pages únicamente por integrar Git.
