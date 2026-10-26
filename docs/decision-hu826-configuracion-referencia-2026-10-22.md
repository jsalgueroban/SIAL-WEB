# HU826 · Configuración por referencia (propuesta Web)

## Decisión de composición

La HU distingue el material del catálogo de su configuración para una referencia y versión de receta. La bandeja `gestion-materiales.html` conserva la consulta y el alta breve del material SAP; su acción «Configuraciones por referencia» navega a `configuracion-materiales-referencia.html`. La nueva ruta también está en el menú de Materiales, con clave activa propia y retorno al catálogo. `recetas-materiales.html` conserva la composición de materiales y cantidades por caja.

La configuración tiene bandeja de consulta con búsqueda, filtro de estado, contador, chips, detalle y paginación. «Nueva configuración» cambia a una captura enfocada en la misma ruta, sin dejar la tabla visible debajo. No se añadió una tarjeta dentro de otra.

## Mapeo funcional

| Exigencia HU826 | Propuesta | Estado |
| --- | --- | --- |
| Referencia, versión y material existentes | Selección encadenada sobre las recetas guardadas en la propuesta (con semillas iniciales); nombre y unidad SAP se muestran como dato de fuente | Prototipo local; integración con catálogos reales pendiente |
| Vigencia, desperdicio, sustitutos y redondeo | Campos y validaciones de rango/fecha en la captura | Implementado en propuesta |
| Regla de validación, responsable, observación y auditoría | Campos obligatorios; registro con fecha/hora y usuario en almacenamiento local | Implementado en propuesta, sin autenticación real |
| Disponibilidad de materiales | No se captura ni se declara un saldo libre; la configuración se guarda «En revisión» | Consulta externa y validación de disponibilidad pendientes |
| Idempotencia y consulta posterior | Bloqueo local de combinación repetida, persistencia local, tabla y detalle | Prototipo local, no contrato de servicio |

Se retiraron de esta captura los campos propios de un pedido concreto —finca, semana, documento, cantidades sugerida/ajustada—. Los registros que ya estaban guardados bajo `sial-hu826-configurations` siguen siendo legibles en la nueva bandeja; no se borró ni transformó su almacenamiento.
Las ediciones del catálogo se conservan ahora bajo `sial-materials-catalog-records` para que navegar a la configuración y volver no descarte cambios hechos en la sesión de la propuesta.

## Verificación y límites

Acceso: menú de Materiales o Catálogo → «Configuraciones por referencia» → nueva configuración → cancelar/guardar → consulta. `npm run build:ui` y `validate-context.ps1 -Platform web` pasaron el 22/10/2026. En navegador se comprobaron apertura de la ruta, selección encadenada de referencia `16FT7BD-8` → versión `V1` → material `101279`, bloqueo del envío incompleto y composición a 390 px. El selector de fechas requiere seleccionar el día y pulsar «Aplicar»; se comprobó que ambas vigencias quedan reflejadas en el formulario. Se guardó la combinación con vigencia `2026-10-22` a `2026-10-23`: apareció un registro «En revisión», se abrió su detalle y se comprobó la persistencia local. La búsqueda produjo un resultado y cero resultados; búsqueda más filtro «Activo» produjo cero, con contador y paginación coherentes. Un segundo guardado de la misma combinación se bloqueó con error inline sin crear otro registro. Se amplió el detalle para mostrar también desperdicio, sustitutos y redondeo.

Cancelar devolvió a la bandeja sin crear un segundo registro; la recarga conservó el primero y «Volver al catálogo» abrió la ruta correcta. En otra pasada se sembraron tres registros temporales solo en el navegador de pruebas: con cuatro filas, tamaño 2 mostró páginas 1-2 y 3-4 de 4, y la búsqueda desde la segunda página devolvió 1-1 de 1 en la primera. Los registros temporales se retiraron. A 390 px el documento no tuvo desbordamiento horizontal y la tabla mantuvo su desplazamiento interno. Se corrigió la validación de fechas para exigir «hasta» posterior, y se comprobó que el mismo día se rechaza; desperdicio 101 % se rechaza y 100 % permite guardar. El segundo registro de prueba se retiró tras la verificación. `npm run build:ui` y la validación de contexto Web volvieron a pasar.

Faltan aprobación visual y pruebas de todos los estados alternativos de la HU con datos reales. La vista permanece **Parcial** y local; no se publicó ni se modificó Azure. Los datos de prueba se guardaron solo en el almacenamiento del navegador de pruebas.

## Continuidad catálogo → receta → configuración

La vista de recetas persiste altas, ediciones y cambios de estado bajo `sial-materials-recipe-records`; la configuración carga esos mismos registros al abrir su ruta. Se comprobó en navegador: crear `AGSTDRA · V99` con material `4925`, recargar Recetas y encontrar luego esa referencia, versión y material en Configuraciones. El registro de prueba se retiró del navegador. El catálogo persistido alimenta las opciones de material de Recetas; no se modificó la librería productiva.

Para conservar la identidad referencial, editar una receta ya no cambia su referencia ni versión; una combinación nueva se crea como receta nueva. La edición impide retirar un material que ya tenga configuración guardada. En navegador, al intentar quitar `101279` de `16FT7BD-8 · V1`, el formulario mantuvo la receta y mostró el error específico. También se bloqueó una línea duplicada dentro de la misma receta y se añadió «Quitar material» para deshacer una línea adicional.

`ROUTER: SELF`: las rutas comparten estado local y un checkout con cambios ajenos; delegar escritura no aportaba aislamiento seguro.
