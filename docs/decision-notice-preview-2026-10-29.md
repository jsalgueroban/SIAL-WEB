# Notice: prueba del estilo actualizado

Perfil local Web. Direcci贸n ya seleccionada: Notice persistente con banano a 30 px,
carril interno de icono, una superficie y colores sem谩nticos. No hay redise帽o abierto.

La propuesta instala `@banasandev/banasan-ui@1.4.0`. Se mantiene su componente y
contrato. `src/web/notice-preview.css` adapta temporalmente su apariencia al CSS de
`D:/SIAL/Librerias/.worktrees/web/christmas-isotype/src/components/Notices/notice.css`.
Los 煤ltimos selectores desactivan el pseudoborde y el posicionamiento absoluto de la
versi贸n anterior; no incorporan selectores Toast. Retirar este adapter cuando la
versi贸n publicada del paquete incluya este estilo y se valide su consumo.

Cobertura: consumidores React de Notice y avisos que ya monta el adapter de Notice.
Los avisos HTML sin montaje React conservan su implementaci贸n. No se ampl铆an reglas
de montaje, contenido, permisos ni acciones. Toast y sus flujos permanecen intactos.

Se recompila el runtime compartido y se cambia su clave de cach茅. La evidencia t茅cnica
se conserva en `proposal-notice-20261029` dentro de la carpeta de visualizaciones de
este chat; distingue revisi贸n de propuesta de QA formal y publicaci贸n.

## Ajuste de densidad solicitado

Calibraci髇 local Web: altura m韓ima de 80 a 64 px, contenedor de icono de 48 a 40 px, carril de 52 a 40 px y padding vertical de 14 a 10 px. Se conserva el banano a 30 px, tipograf韆 de 14 px y contenido adaptable. No se promueve este ajuste a la librer韆 antes de revisar la propuesta. SELF: cambio estrecho, sin beneficio independiente de delegaci髇.

## Franja discreta aprobada

La segunda calibraci髇 sustituye la densidad anterior: 48 px m韓imos, banano y carril de 24 px sin recuadro, texto de 13 px y padding de 8 por 12 px. Fondo sem醤tico al 55%, borde tenue y sin sombra. El texto envuelve y aumenta la altura seg鷑 contenido. S髄o propuesta; Toast intacto. Direcci髇 expresamente aprobada por el usuario.
