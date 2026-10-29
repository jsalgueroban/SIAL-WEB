# Notice: prueba del estilo actualizado

Perfil local Web. DirecciÃ³n ya seleccionada: Notice persistente con banano a 30 px,
carril interno de icono, una superficie y colores semÃ¡nticos. No hay rediseÃ±o abierto.

La propuesta instala `@banasandev/banasan-ui@1.4.0`. Se mantiene su componente y
contrato. `src/web/notice-preview.css` adapta temporalmente su apariencia al CSS de
`D:/SIAL/Librerias/.worktrees/web/christmas-isotype/src/components/Notices/notice.css`.
Los Ãºltimos selectores desactivan el pseudoborde y el posicionamiento absoluto de la
versiÃ³n anterior; no incorporan selectores Toast. Retirar este adapter cuando la
versiÃ³n publicada del paquete incluya este estilo y se valide su consumo.

Cobertura: consumidores React de Notice y avisos que ya monta el adapter de Notice.
Los avisos HTML sin montaje React conservan su implementaciÃ³n. No se amplÃ­an reglas
de montaje, contenido, permisos ni acciones. Toast y sus flujos permanecen intactos.

Se recompila el runtime compartido y se cambia su clave de cachÃ©. La evidencia tÃ©cnica
se conserva en `proposal-notice-20261029` dentro de la carpeta de visualizaciones de
este chat; distingue revisiÃ³n de propuesta de QA formal y publicaciÃ³n.

## Ajuste de densidad solicitado

Calibración local Web: altura mínima de 80 a 64 px, contenedor de icono de 48 a 40 px, carril de 52 a 40 px y padding vertical de 14 a 10 px. Se conserva el banano a 30 px, tipografía de 14 px y contenido adaptable. No se promueve este ajuste a la librería antes de revisar la propuesta. SELF: cambio estrecho, sin beneficio independiente de delegación.

## Franja discreta aprobada

La segunda calibración sustituye la densidad anterior: 48 px mínimos, banano y carril de 24 px sin recuadro, texto de 13 px y padding de 8 por 12 px. Fondo semántico al 55%, borde tenue y sin sombra. El texto envuelve y aumenta la altura según contenido. Sólo propuesta; Toast intacto. Dirección expresamente aprobada por el usuario.
