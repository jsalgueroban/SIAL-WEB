# Validación final local · HU1919 CONMAT

24 de noviembre de 2026. Fuente funcional conservada: revisión 16, 102 criterios. Entrada: sial-design-proposals + sial-web-library + Dona. Es validación de propuesta, por lo que aplica la excepción expresa de Eva. SELF: revisión transversal de estado local compartido y UI ya calibrada; exportar el contexto para delegar cuesta tanto como verificarlo directamente. No hay publicación, commit, modificación de librería ni aprobación visual implícita.

## Resultado

Recorridos principales construidos e integrados: panel, órdenes/preasignación, agrupación Ruta → Viaje → Subgrupo → Órdenes, portal/asignación embebida, seguimiento, cierre, soportes, revisión interna e historial. Nueve páginas actuales más el flujo embebido de asignación. El HTML anterior de asignación es redirección, no una vista adicional.

La matriz vigente está en final-validation-matrix.json y final-validation-matrix.md, con una fila por criterio y sus límites. El diagnóstico inicial de hu1919-coverage.json se conserva como historia y apunta a esta evaluación. No se calcula un porcentaje de cumplimiento funcional a partir de UI.

## Correcciones de esta revisión

- Campana CONMAT unificada también en panel, órdenes y agrupación; se elimina en esas vistas el contenido genérico de otro módulo. Se conserva la bandeja compartida anclada, sin modal centrado.
- Enlaces del menú CONMAT separados por contexto Banasan/transportadora; las consultas internas preservan interno=1 y las externas preservan empresa e interno=0. No se presenta el filtrado de menú como autorización real.
- Estados reproducibles de carga, error con reintento y acceso no disponible en todas las vistas; vacíos y validaciones conservan sus componentes de origen.
- Escenario origen comunica modificación de una orden y posible impacto en su ruta; permite revisar la orden. No simula una API ni altera datos reales del módulo de origen.
- Aviso de retirada conservado para la transportadora anterior al reasignar ruta u orden, sin acceso a los datos actuales de otra empresa.
- Conteo de Con novedades basado en vehículos distintos, manteniendo la composición de cuatro cards y filtro aprobada por el usuario.

## Evidencia integrada

Navegador limpio, sin tocar el almacenamiento usado por el usuario:

1. Seleccionar OS-04801 y preasignar a Transportes del Caribe mediante confirmación.
2. Incorporarla al subgrupo de R-001 con GroupMove y Confirmar movimiento.
3. Portal: asignar KLM-456 / Ana Herrera, revisar y confirmar.
4. Preparación, salida, llegada, entrega y retorno registrados desde seguimiento.
5. Revisar condiciones y confirmar cierre de ruta.
6. Cargar un PDF real desde la ventana de soportes y enviarlo a revisión.
7. Banasan aprueba la versión; la ruta queda Finalizada/Aprobado, con cuatro órdenes, OS-04801 vinculada, 11 eventos y habilitación administrativa local.

Resultado: sin errores de consola. Captura final-e2e.png. Las pruebas anteriores document-review-decision.md conservan el recorrido complementario rechazo → aviso a transportadora → versión 2 → aprobación, con descarga y conservación de ambas versiones.

Barrido de nueve páginas a 1440×1000 y 390×844: sin desbordamiento horizontal global; las tablas conservan scroll propio. Tema oscuro aplicado en todas y evidencia visual específica en los archivos de cada vista. Se comprobó una única bandeja anclada en las nueve páginas y enlaces internos/externos correctos. Teclado, foco y movimiento reducido se recorrieron en los detalles y campana durante sus correcciones.

Error → Reintentar recupera bandeja normal; escenario de origen y acceso no disponible representados. Evidencias final-notifications.png y final-error.png. Los menús de lectura, pendientes y registro relacionado fueron comprobados en notifications-restored.png y en el recorrido de revisión documental.

Scripts correctos: check-conmat-demo, check-conmat-assignment, check-conmat-document-review (incluye tracking/closure/documents), check-conmat-history y check-conmat-notifications. Build Vite correcto. No se añadieron pruebas que pretendan certificar seguridad de servidor desde el cliente.

## Frontera y decisiones pendientes de producto

La propuesta está lista para revisión final del usuario. No equivale a producto desplegado ni a autorización para publicar.

Autenticación/autorización, sincronización automática de órdenes originales, entrega de notificaciones, persistencia compartida, auditoría de servidor y almacenamiento de archivos productivo requieren backend. IndexedDB conserva archivos sólo en este navegador; la matriz distingue expresamente estos casos.

Supuestos de dominio que deben trasladarse a implementación: requisitos de cierre (retorno completo y novedades atendidas), PDF/JPG/PNG hasta 10 MB, soporte único que cubre servicios de una ruta y habilitación administrativa por cierre + última versión aprobada. No se inventan validaciones fiscales ni se aprueban facturas/pagos. La jerarquía de niveles separados fue confirmada expresamente por el usuario.
