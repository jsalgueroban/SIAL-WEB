# Normalización parcial de formularios grandes de Fincas

Fecha: 2026-10-15. Plataforma: Web. Forma de tarea: formulario dedicado. Vía: `reuse` de la composición de formulario grande definida en `DESIGN.md` y `web-composition-contracts.md`; no se hereda la anatomía de tabla de las bandejas de gestión.

## Alcance y decisión

- Vistas: `Gestion de Fincas/registro-finca.html` y `Gestion de Fincas/registro-referencia.html`. Origen: acciones de alta/edición de `gestion-fincas.html` y `gestion-referencias.html`; el shell mantiene sus claves `fincas` y `referencias`.
- Los avisos que repetían reglas de campos se retiraron; las restricciones pertinentes siguen junto al campo. El estado activo inicial y la auditoría autogenerada no son decisiones del usuario y dejaron de ocupar campos en el alta.
- Los campos de texto y selección compatibles montan `TextInput` y `SelectInput` publicados mediante proxy nativo opt-in, conservando el validador y los eventos del prototipo. La acción Guardar monta `Button` publicado y permanece centrada junto a Cancelar. El éxito usa feedback inline con `role=status`.
- Los inputs numéricos, el mapa y la navegación con enlace permanecen locales: el adaptador actual no acredita un contrato equivalente para esos roles. No se modificó la API pública de `@banasandev/banasan-ui` 1.4.0.

## Cobertura y límites

`registro-finca`: 4 `TextInput` y 3 `SelectInput` adaptados; geolocalización `feature-local`; enlaces, input de coordenadas y estados de edición `pending`.

`registro-referencia`: 2 `TextInput` y 3 `SelectInput` adaptados; seis campos numéricos `pending`; enlaces, precarga desde copia y validación completa `pending`.

No se declara normalizada ninguna de las dos vistas. Esta decisión es de familia de formulario grande, no una regla para todas las páginas Web.

## Verificación

`pnpm build:ui`, `git diff --check` y `run-tests.ps1` terminaron sin errores; el último inventarió 101 HTML Web y 0 enlaces rotos. Después se abrió un servidor local y se verificó el montaje de controles de finca y referencia sin errores de consola, el envío vacío de finca con errores inline y la composición de referencia a 390 px. Siguen pendientes duplicado, copia, éxito, teclado completo y retorno a la bandeja.

Delegación: `SELF`. El slice afecta adaptador y estado nativo de dos formularios en un checkout compartido con cambios locales previos; separarlo no aporta un resultado independiente seguro. No se publicaron cambios ni se modificó la librería productiva.
