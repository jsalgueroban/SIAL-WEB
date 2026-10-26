# Acción para limpiar filtros de tablas Web

- **Alcance:** bandejas con tabla y controles de búsqueda o filtros en la propuesta Web. Las tablas de detalle sin filtros no muestran la acción.
- **Forma de tarea:** bandeja o consulta tabular. **Vía:** reutilizar la composición calibrada de toolbar → tabla → pie, con una acción secundaria compacta.
- **Decisión:** mostrar una escoba de 44 px solo cuando hay criterios activos. El nombre accesible y la ayuda son «Limpiar filtros». Al pulsarla se restablecen búsqueda, selectores y fechas de esa tabla; la paginación vuelve a la primera página.
- **Composición:** la acción ocupa la última columna de la barra de filtros, alineada con la base de los controles. Usa un icono legible y tratamiento neutro en reposo, con realce al pasar el cursor o recibir foco. En ancho móvil pasa bajo los campos, alineada a la derecha, sin dejar una fila vacía cuando está oculta.
- **Componentes:** `IconButton` publicado en vistas React; en controladores heredados, botón local conectado a sus eventos existentes hasta que cada bandeja migre a React. El icono de escoba es local porque el paquete instalado no lo publica. No se modifica la librería.
- **Iconografía:** se usa la silueta de escoba de Font Awesome Free (CC BY 4.0), con atribución en ambas implementaciones. El dibujo anterior se confundía con un sello o una herramienta de edición a 22 px.
- **Identidad y alcance:** la acción vive con los filtros, separada de exportación, creación y acciones por fila. No se añade a formularios ni matrices sin filtro.
- **Verificación:** build Web y `run-tests.ps1` correctos; barrido de 40 archivos HTML con tablas sin duplicados en sus barras; 17 rutas React con búsqueda probada; recorridos manuales de Catálogo de materiales, Fincas, Mantenimientos y Avisos de corte; geometría a 390 px sin desborde. La revisión visual completa por ruta sigue pendiente.
- **Delegación:** `SELF`. Es un cambio transversal, pero el estado local compartido y la dependencia entre runtime, CSS y vistas React hacen que un slice aislado no mejore la integración.
