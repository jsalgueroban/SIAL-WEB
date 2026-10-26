# Normalización parcial de formularios grandes de Transporte

Fecha: 2026-10-15. Plataforma: Web. Operación: `evolve` de formularios dedicados, vía `reuse` de la anatomía de captura Web; no se impone una tabla ni pasos a tareas sin secuencia obligatoria. Alcance: registro de conductor, registro de vehículo y registro de mantenimiento. Fuentes: sus flujos ya presentes en la propuesta y acciones de las bandejas de Transporte. No se agregaron datos, estados ni reglas nuevos.

## Decisión de composición y componentes

- El estado activo inicial, los campos de auditoría autogenerada y los avisos que repetían instrucciones de campos se retiraron de conductor y vehículo. Las restricciones permanecen en la ayuda o validación del campo. Mantenimiento conserva el aviso de bloqueo porque depende de una operación activa real del prototipo.
- Los campos de texto/correo y selectores compatibles, además de las acciones de limpiar y guardar/revisar, montan `TextInput`, `SelectInput` y `Button` de `@banasandev/banasan-ui` 1.4.0. El adaptador es opt-in y conserva los validadores y eventos HTML existentes. La API pública del paquete no cambió.
- Los campos de fechas/horas, números, checkbox de licencia, área de texto y archivo permanecen locales: no se acreditó equivalencia completa para su formato, valor vacío, inputmode, validación o flujo de archivos. `NumberInput` y `DateInput` están publicados, pero su existencia no autoriza reemplazar `datetime-local` o un campo con teclado numérico sin comprobar semántica y eventos.
- En mantenimiento, los errores de campos adaptados también actualizan `aria-invalid`; el primer error enfoca el control visible de la librería y el reset limpia el estado. El aviso de bloqueo y el feedback de revisión conservan su semántica de tarea.

## Evidencia y límites

Conductor: montaje de 4 `TextInput`, 3 `SelectInput` y 2 `Button`; envío vacío mostró errores inline y se seleccionó una empresa desde el menú publicado. Vehículo: montaje de 3 `TextInput`, 5 `SelectInput` y 2 `Button`; envío vacío mostró errores inline. Mantenimiento: montaje de 5 `TextInput`, 2 `SelectInput` y 2 `Button`; selección de vehículo habilitó la acción, envío vacío enfocó el selector visible de Tipo y anunció el error. No hubo errores de consola en los recorridos probados. Se revisaron capturas de conductor a 1280 px, vehículo y mantenimiento a 390 px.

Estado de las tres vistas: **parcial**. Faltan flujos completos de éxito, validación de datos reales, teclado exhaustivo, tema oscuro, otros tamaños y QA funcional formal. La prueba de compilación y el inventario de propuesta no sustituyen esas verificaciones.

Delegación: `SELF`. Las tres vistas comparten el adaptador de un checkout con cambios locales previos y sus validadores están acoplados al HTML nativo; separar este corte no aportaba independencia útil. No se publicaron cambios ni se modificó la librería productiva.
