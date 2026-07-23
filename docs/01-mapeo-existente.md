# SIAL Web - Mapeo de lo existente

Fecha de corte: 2026-07-19  
Alcance: carpeta `SIAL Web - Propuesta` del catálogo de vistas.

## 1. Qué es este repositorio

SIAL Web es una **propuesta web navegable** construida con HTML, CSS y JavaScript nativo. Su objetivo es concentrar y demostrar vistas, componentes, patrones de interacción y reglas funcionales para revisión. No es el frontend productivo, no contiene backend y no incluye un proyecto de React/Next, un sistema de build ni un paquete instalable de componentes.

El repositorio cumple simultáneamente cuatro funciones:

1. Catálogo de propuestas navegables.
2. Referencia visual y conductual de componentes compartidos.
3. Prototipo funcional local de módulos de negocio.
4. Fuente de contexto para construir una librería y portar las vistas al frontend real.

## 2. Foto cuantitativa

| Elemento | Cantidad | Lectura correcta |
| --- | ---: | --- |
| Archivos versionados | 149 | Incluye fuentes, documentación, activos y `.gitignore`. |
| HTML físicos | 89 | Incluye catálogo, vistas, formularios auxiliares y entradas de módulo. |
| Vistas publicadas en `sial-catalogo.js` | 74 | Es el inventario funcional visible en el catálogo. |
| JavaScript | 20 | Un core compartido, lógica del catálogo y scripts por módulo. |
| CSS | 16 | Un core compartido y capas locales por módulo. |
| README de raíz/módulos | 13 | Describen intención, reglas y pendientes. |
| Documentos adicionales | 4 | Gobierno, baseline y perfil global. |
| Activos visuales | 6 | Cinco fotografías y un isotipo SVG. |
| Estados `implementada` del catálogo | 66 | Implementada como propuesta navegable, no integrada a producción. |
| Estados `base` del catálogo | 8 | Referencias iniciales o capacidades aún menos maduras. |

Distribución de las 74 vistas por familia:

| Familia | Vistas |
| --- | ---: |
| Gestión | 30 |
| Autenticación | 9 |
| Configuración | 9 |
| Analítica | 8 |
| Sistema | 6 |
| Registro | 4 |
| Relación | 4 |
| Documentación | 2 |
| Comunicación | 2 |

## 3. Capas existentes

### 3.1 Catálogo raíz

| Archivo | Responsabilidad actual |
| --- | --- |
| `index.html` | Shell de publicación del catálogo. |
| `sial-catalogo.js` | Arreglo `views` con 74 entradas, render de tarjetas y filtros por texto, módulo, familia y estado. |
| `sial-catalogo.css` | Capa mínima que importa `shared/sial-core.css`. |
| `404.html` | Fallback de GitHub Pages. |

Cada entrada del catálogo declara `module`, `moduleLabel`, `title`, `family`, `status`, `href`, `description` y `tags`.

### 3.2 Librería compartida de propuesta

| Archivo | Responsabilidad actual |
| --- | --- |
| `shared/sial-core.css` | Tokens, tema claro/oscuro, shell, componentes, responsive, motion y visualizaciones. Tiene 6.454 líneas y 96 custom properties únicas. |
| `shared/sial-core.js` | API global `window.SIALCore` para navegación, tema, perfil, fechas, tablas, drawers, confirmaciones, exportación y changelog. Tiene 2.078 líneas. |
| `shared/componentes.html` | Inventario visual navegable de los componentes disponibles. |
| `shared/brand/isotipo-sial.svg` | Isotipo compartido de la propuesta. |
| `shared/README.md` | Regla de centralización y uso del core. |

El inventario visual cubre:

- tokens y estados visuales;
- layout, navegación y superficies;
- autenticación y acceso público;
- botones, alertas y callouts de marca;
- formularios base, DatePicker y formulario corto embebido;
- tablas, estados, drawer, relaciones y transfer;
- estados funcionales, mantenimiento y transiciones de vista;
- indicadores, KPIs, gauges, riesgo y familias de gráficas;
- patrones operativos, calendarios, cintas y changelog.

### 3.3 Módulos de propuesta

| Módulo funcional | Carpeta física | Vistas catalogadas | Estado del catálogo | Cobertura existente |
| --- | --- | ---: | --- | --- |
| Librería UI | `shared` | 1 | 1 base | Catálogo de componentes compartidos. |
| Indicadores y KPIs | `Indicadores` | 1 | 1 implementada | Escenarios, proyección, riesgo, capacidad, ranking, alertas y atlas de gráficas. |
| Changelog | `Changelog` | 3 | 3 implementadas | Consulta externa, consulta interna y administración. |
| Errores del sistema | `Errores` | 6 | 6 implementadas | 401, 403, 404, 500, 503 y mantenimiento programado. |
| Login y autenticación | `Login` | 9 | 9 implementadas | Dos propuestas de login, selección de empresa y dos recorridos de recuperación en tres pasos. |
| Usuarios | `Gestion de Usuarios` | 4 | 4 implementadas | Gestión, registro, edición y permisos por rol. |
| Empresa | `Gestion de Empresas` y dos HTML en `Gestion de Transporte` | 8 | 6 implementadas, 2 base | Empresas, roles, tipos, relación empresa-tipo, clientes, contactos y dependencias. |
| Transporte | `Gestion de Transporte` | 10 | 10 implementadas | Conductores, licencias, vehículos, analítica, disponibilidad y programación. |
| Fincas | `Gestion de Fincas` | 3 | 3 implementadas | Fincas, grupos y sectores. |
| Referencias | `Gestion de Fincas` | 5 | 2 implementadas, 3 base | Referencias, clases, tipos de fruta, productos y productos por finca. |
| Puerto | `Gestion Operaciones Puerto` | 5 | 5 implementadas | Contenedores, programación, tipos, etapas y puertos. |
| Seguridad | `Trazabilidad` | 3 | 1 implementada, 2 base | Auditoría operativa y maestras de inspección/eventos. |
| Planeación | `Gestion de Planeacion` | 6 | 6 implementadas | Avisos de corte, semanas, cintas, validación y monitoreo. |
| Materiales y suministros | `Materiales y Suministros` | 10 | 10 implementadas | Tablero, pedidos, inventarios, transporte, proveedores, entregas y reglas documentales. |

Total: **74 vistas catalogadas**.

## 4. Inventario funcional publicado

### Librería UI

- `shared/componentes.html` — Componentes compartidos SIAL — documentación — base.

### Indicadores y KPIs

- `Indicadores/index.html` — Catálogo funcional de indicadores — analítica — implementada.

### Changelog

- `Changelog/index.html` — Changelog externo SIAL — comunicación — implementada.
- `Changelog/changelog-interno.html` — Changelog interno TI — documentación — implementada.
- `Changelog/administracion-changelog.html` — Administración de changelog — gestión — implementada.

### Errores del sistema

- `Errores/401.html` — Acceso no autenticado.
- `Errores/403.html` — Sin permisos.
- `Errores/404.html` — Vista no encontrada.
- `Errores/500.html` — Falla de servicio.
- `Errores/503.html` — Servicio temporalmente no disponible.
- `Errores/mantenimiento.html` — Mantenimiento programado.

Todas son familia sistema y estado implementada.

### Login y autenticación

- `Login/index.html` — Login institucional.
- `Login/seleccionar-empresa.html` — Selección de empresa.
- `Login/login-cover-flow.html` — Login propuesta 2, cover flow.
- `Login/recuperar-cover-flow.html` — Cover flow, solicitar código.
- `Login/verificar-cover-flow.html` — Cover flow, verificar OTP.
- `Login/restablecer-cover-flow.html` — Cover flow, nueva contraseña.
- `Login/recuperar-contrasena.html` — Solicitar código.
- `Login/verificar-codigo.html` — Verificar OTP.
- `Login/restablecer-contrasena.html` — Restablecer contraseña.

Todas son familia autenticación y estado implementada.

### Usuarios

- `Gestion de Usuarios/gestion-usuarios.html` — Gestión — implementada.
- `Gestion de Usuarios/registro-usuario.html` — Registro — implementada.
- `Gestion de Usuarios/editar-usuario.html` — Registro/edición — implementada.
- `Gestion de Usuarios/gestion-permisos-rol.html` — Gestión de permisos — implementada.

### Empresa

- `Gestion de Empresas/gestion-empresas.html` — Gestión — implementada.
- `Gestion de Empresas/roles-empresa.html` — Relación — implementada.
- `Gestion de Empresas/parametrizacion-roles.html` — Configuración — implementada.
- `Gestion de Transporte/gestion-tipos-empresa.html` — Gestión — implementada.
- `Gestion de Transporte/relacion-empresa-tipo.html` — Relación — implementada.
- `Gestion de Empresas/gestion-clientes.html` — Gestión — implementada.
- `Gestion de Empresas/gestion-contactos.html` — Gestión — base.
- `Gestion de Empresas/gestion-dependencias.html` — Configuración — base.

### Transporte

- `Gestion de Transporte/gestion-conductores.html` — Gestión — implementada.
- `Gestion de Transporte/gestion-categorias-licencia.html` — Gestión — implementada.
- `Gestion de Transporte/relacion-conductor-licencia.html` — Relación — implementada.
- `Gestion de Transporte/gestion-vehiculos.html` — Gestión — implementada.
- `Gestion de Transporte/gestion-tipos-vehiculo.html` — Gestión — implementada.
- `Gestion de Transporte/dashboard-transporte.html` — Analítica — implementada.
- `Gestion de Transporte/matriz-documental-vehiculos.html` — Analítica — implementada.
- `Gestion de Transporte/disponibilidad-operativa.html` — Analítica — implementada.
- `Gestion de Transporte/gestion-operaciones.html` — Gestión/programación — implementada.
- `Gestion de Transporte/inicio-operacion.html` — Registro/programación — implementada.

### Fincas y referencias

- `Gestion de Fincas/gestion-fincas.html` — Fincas — gestión — implementada.
- `Gestion de Fincas/gestion-grupos.html` — Fincas — gestión — implementada.
- `Gestion de Fincas/gestion-sectores.html` — Fincas — gestión — implementada.
- `Gestion de Fincas/gestion-referencias.html` — Referencias — gestión — implementada.
- `Gestion de Fincas/gestion-clases-referencia.html` — Referencias — gestión — implementada.
- `Gestion de Fincas/gestion-tipos-fruta.html` — Referencias — configuración — base.
- `Gestion de Fincas/gestion-productos.html` — Referencias — configuración — base.
- `Gestion de Fincas/gestion-productos-finca.html` — Referencias — relación — base.

### Puerto

- `Gestion Operaciones Puerto/gestion-contenedores.html` — Gestión — implementada.
- `Gestion Operaciones Puerto/programacion-contenedores.html` — Gestión/programación — implementada.
- `Gestion Operaciones Puerto/gestion-tipos-contenedor.html` — Gestión — implementada.
- `Gestion Operaciones Puerto/gestion-etapas-contenedor.html` — Gestión — implementada.
- `Gestion Operaciones Puerto/gestion-puertos.html` — Gestión — implementada.

### Seguridad

- `Trazabilidad/auditoria-operativa.html` — Analítica/auditoría — implementada.
- `Trazabilidad/gestion-tipos-inspeccion.html` — Configuración — base.
- `Trazabilidad/gestion-tipos-evento-trazabilidad.html` — Configuración — base.

### Planeación

- `Gestion de Planeacion/gestion-avisos-corte.html` — Gestión — implementada.
- `Gestion de Planeacion/gestion-semanas.html` — Gestión — implementada.
- `Gestion de Planeacion/generacion-semanas.html` — Registro — implementada.
- `Gestion de Planeacion/gestion-cintas.html` — Gestión — implementada.
- `Gestion de Planeacion/validacion-calendario.html` — Analítica — implementada.
- `Gestion de Planeacion/monitoreo-calendarios.html` — Analítica — implementada.

### Materiales y suministros

- `Materiales y Suministros/index.html` — Tablero — analítica — implementada.
- `Materiales y Suministros/gestion-pedidos-materiales.html` — Gestión — implementada.
- `Materiales y Suministros/inventario-materiales-finca.html` — Gestión — implementada.
- `Materiales y Suministros/inventario-pallets.html` — Gestión — implementada.
- `Materiales y Suministros/ordenes-transporte-insumos.html` — Gestión — implementada.
- `Materiales y Suministros/resumen-proveedores.html` — Comunicación — implementada.
- `Materiales y Suministros/seguimiento-entregas.html` — Gestión — implementada.
- `Materiales y Suministros/gestion-materiales.html` — Configuración — implementada.
- `Materiales y Suministros/gestion-proveedores.html` — Configuración — implementada.
- `Materiales y Suministros/reglas-documentales.html` — Configuración — implementada.

## 5. HTML existentes que no son entradas del catálogo

Hay 15 HTML físicos que no aparecen como tarjetas independientes en `sial-catalogo.js`:

- `index.html`: shell del catálogo.
- `404.html`: fallback de publicación.
- `Gestion Operaciones Puerto/index.html`.
- `Gestion de Empresas/index.html`.
- `Gestion de Fincas/index.html`.
- `Gestion de Planeacion/index.html`.
- `Gestion de Transporte/index.html`.
- `Gestion de Usuarios/index.html`.
- `Trazabilidad/index.html`.
- `Gestion de Empresas/registro-empresa.html`.
- `Gestion de Empresas/registro-contacto.html`.
- `Gestion de Fincas/registro-finca.html`.
- `Gestion de Fincas/registro-referencia.html`.
- `Gestion de Transporte/registro-conductor.html`.
- `Gestion de Transporte/registro-vehiculo.html`.

Los `index.html` de módulo son entradas o resúmenes auxiliares. Los formularios de registro se alcanzan desde sus vistas de gestión, pero no todos tienen tarjeta propia en el catálogo.

## 6. Diferencias entre ubicación física y módulo funcional

- **Referencias** se presenta como módulo propio, pero sus archivos viven en `Gestion de Fincas`.
- **Tipos de empresa** y **relación empresa-tipo** pertenecen funcionalmente a Empresa, pero viven en `Gestion de Transporte`.
- **Seguridad** es el nombre visible del módulo cuya carpeta física continúa llamándose `Trazabilidad`.
- `shared` es la fuente técnica declarada; las copias publicadas fuera de esta carpeta no deben evolucionar de forma independiente.

Estas diferencias ya están resueltas por `shared/sial-core.js` mediante `navigationRegistry`, `folder` y `localFolder`; deben tratarse como compatibilidad de rutas de la propuesta, no como estructura objetivo obligatoria del frontend.

## 7. Tecnología y dependencias observadas

- HTML estático.
- CSS nativo con custom properties.
- JavaScript nativo basado en IIFE y objetos globales.
- Fuente Poppins cargada desde Google Fonts.
- Sin `package.json`, bundler, TypeScript, framework, Docker o manifiesto de aplicación.
- Sin llamadas `fetch`, XHR, Axios o clientes API.
- Sin contratos OpenAPI/DTO ejecutables.
- Sin suite de pruebas incluida en la carpeta.
- `output/playwright` contiene evidencia visual generada e ignorada por Git; no forma parte del código fuente.

## 8. Fuente de verdad para mantener el mapa

1. `sial-catalogo.js` define qué vistas están publicadas y cómo se clasifican.
2. `shared/sial-core.js` define la navegación funcional entre módulos.
3. Los README de módulo explican intención, reglas y pendientes.
4. Los HTML y JS muestran el comportamiento ejecutable real del prototipo.

La etiqueta `implementada` debe leerse como **implementada dentro del prototipo**, no como integrada con backend ni lista para producción.
