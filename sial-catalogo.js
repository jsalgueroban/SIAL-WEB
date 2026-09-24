const SIALCatalog = (() => {
  const views = [
    {
      module: "inicio",
      moduleLabel: "Inicio adaptable",
      title: "Centro de control por excepciones",
      family: "analitica",
      status: "implementada",
      href: "Inicio/centro-excepciones.html",
      description: "Bandeja priorizada de bloqueos, alertas y acciones, compuesta únicamente con módulos y permisos autorizados.",
      tags: ["Permisos", "Excepciones", "Acciones"]
    },
    {
      module: "inicio",
      moduleLabel: "Inicio adaptable",
      title: "Mi jornada operativa",
      family: "gestion",
      status: "implementada",
      href: "Inicio/jornada-operativa.html",
      description: "Agenda diaria con eventos y tareas del usuario, filtrada por módulo, acción y alcance de datos.",
      tags: ["Agenda", "Tareas", "Rol"]
    },
    {
      module: "inicio",
      moduleLabel: "Inicio adaptable",
      title: "Torre de control logística",
      family: "analitica",
      status: "implementada",
      href: "Inicio/torre-control.html",
      description: "Flujo operativo que omite etapas restringidas y declara cuándo la lectura de continuidad es parcial.",
      tags: ["Flujo", "Etapas", "Alcance"]
    },
    {
      module: "inicio",
      moduleLabel: "Inicio adaptable",
      title: "Inicio personalizado por rol",
      family: "gestion",
      status: "implementada",
      href: "Inicio/inicio-personalizado.html",
      description: "Espacio personal construido con contribuciones de cada módulo y acciones permitidas para el perfil efectivo.",
      tags: ["Personalización", "Módulos", "RBAC"]
    },
    {
      module: "inicio",
      moduleLabel: "Inicio adaptable",
      title: "Resumen ejecutivo autorizado",
      family: "analitica",
      status: "implementada",
      href: "Inicio/resumen-ejecutivo.html",
      description: "Indicadores y riesgos consolidados sin calcular ni revelar información proveniente de fuentes restringidas.",
      tags: ["Ejecutivo", "Indicadores", "Seguridad"]
    },
    {
      module: "libreria",
      moduleLabel: "Libreria UI",
      title: "Componentes compartidos SIAL",
      family: "documentacion",
      status: "base",
      href: "shared/componentes.html",
      description: "Guia visual navegable de tokens, botones, alertas, formularios, tablas, estados, analitica y modo oscuro.",
      tags: ["Componentes", "Dark mode", "Tokens"]
    },
    {
      module: "indicadores",
      moduleLabel: "Indicadores y KPIs",
      title: "Catalogo funcional de indicadores",
      family: "analitica",
      status: "implementada",
      href: "Indicadores/index.html",
      description: "Vista funcional con filtros, escenarios, proyeccion, riesgo, capacidad, graficas analiticas y lectura operativa accionable.",
      tags: ["KPIs", "Proyeccion", "Graficas", "Riesgo"]
    },
    {
      module: "changelog",
      moduleLabel: "Changelog",
      title: "Changelog externo SIAL",
      family: "comunicacion",
      status: "implementada",
      href: "Changelog/index.html",
      description: "Historial consumible por usuarios para versiones, mejoras, correcciones y cambios visibles de la propuesta.",
      tags: ["Comunicacion", "Versiones", "Usuarios"]
    },
    {
      module: "changelog",
      moduleLabel: "Changelog",
      title: "Changelog interno TI",
      family: "documentacion",
      status: "implementada",
      href: "Changelog/changelog-interno.html",
      description: "Registro tecnico para dev, TI y lideres tecnicos con riesgos, dependencias, validaciones QA y notas internas.",
      tags: ["Interno", "TI", "QA"]
    },
    {
      module: "changelog",
      moduleLabel: "Changelog",
      title: "Administracion de changelog",
      family: "gestion",
      status: "implementada",
      href: "Changelog/administracion-changelog.html",
      description: "Vista de gestion para crear, editar, publicar o remover entradas conservando auditoria de cambios.",
      tags: ["Gestion", "Auditoria", "Publicacion"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Error 401 - Acceso no autenticado",
      family: "sistema",
      status: "implementada",
      href: "Errores/401.html",
      description: "Estado completo para sesiones no autenticadas o vencidas, con retorno seguro al login.",
      tags: ["401", "Sesion", "Acceso"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Error 403 - Sin permisos",
      family: "sistema",
      status: "implementada",
      href: "Errores/403.html",
      description: "Estado completo para operaciones no autorizadas o usuarios sin permisos suficientes.",
      tags: ["403", "Permisos", "Seguridad"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Error 404 - Vista no encontrada",
      family: "sistema",
      status: "implementada",
      href: "Errores/404.html",
      description: "Estado completo para rutas inexistentes, vistas movidas o recursos aun no publicados.",
      tags: ["404", "Ruta", "Navegacion"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Error 500 - Falla de servicio",
      family: "sistema",
      status: "implementada",
      href: "Errores/500.html",
      description: "Estado completo para fallas internas, con accion de reintento y retorno al catalogo.",
      tags: ["500", "Servicio", "Reintento"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Mantenimiento 503",
      family: "sistema",
      status: "implementada",
      href: "Errores/503.html",
      description: "Estado completo para mantenimiento programado o servicio temporalmente no disponible.",
      tags: ["503", "Mantenimiento", "Sistema"]
    },
    {
      module: "errores",
      moduleLabel: "Errores del sistema",
      title: "Vista de mantenimiento",
      family: "sistema",
      status: "implementada",
      href: "Errores/mantenimiento.html",
      description: "Vista funcional para comunicar una ventana de mantenimiento programado sin tratarla como error tecnico.",
      tags: ["Mantenimiento", "Programado", "Sistema"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Login institucional",
      family: "autenticacion",
      status: "implementada",
      href: "Login/index.html",
      description: "Propuesta de login con panel visual rotativo de sectores operativos y formulario alineado a la familia Autenticacion.",
      tags: ["Autenticacion", "Carrusel", "Responsive"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Seleccion de empresa",
      family: "autenticacion",
      status: "implementada",
      href: "Login/seleccionar-empresa.html",
      description: "Paso posterior al login para elegir empresa de trabajo antes de ingresar al modulo asignado. En el prototipo redirige a Gestion de usuarios.",
      tags: ["Autenticacion", "Empresa", "Contexto"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Login propuesta 2 - Cover flow",
      family: "autenticacion",
      status: "implementada",
      href: "Login/login-cover-flow.html",
      description: "Segunda propuesta de login con cover flow institucional en el panel izquierdo y formulario funcional conservado.",
      tags: ["Autenticacion", "Cover flow", "Responsive"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Cover flow - Paso 1 solicitar codigo",
      family: "autenticacion",
      status: "implementada",
      href: "Login/recuperar-cover-flow.html",
      description: "Primer paso de recuperacion para la propuesta cover flow: captura de usuario y envio del codigo OTP.",
      tags: ["Autenticacion", "Cover flow", "OTP"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Cover flow - Paso 2 verificar OTP",
      family: "autenticacion",
      status: "implementada",
      href: "Login/verificar-cover-flow.html",
      description: "Verificacion OTP de seis digitos para la propuesta cover flow, con reenvio controlado y accesibilidad basica.",
      tags: ["Autenticacion", "Cover flow", "OTP"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Cover flow - Paso 3 nueva contrasena",
      family: "autenticacion",
      status: "implementada",
      href: "Login/restablecer-cover-flow.html",
      description: "Paso final de restablecimiento de contrasena para la propuesta cover flow.",
      tags: ["Autenticacion", "Cover flow", "Contrasena"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Paso 1 - Solicitar codigo",
      family: "autenticacion",
      status: "implementada",
      href: "Login/recuperar-contrasena.html",
      description: "Primer paso del flujo de recuperacion: captura de usuario y envio del codigo OTP al correo registrado.",
      tags: ["Autenticacion", "Recuperacion", "OTP"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Paso 2 - Verificar codigo OTP",
      family: "autenticacion",
      status: "implementada",
      href: "Login/verificar-codigo.html",
      description: "Paso de verificacion con indicador de progreso, entrada OTP de seis digitos, reenvio controlado y continuidad al cambio de contrasena.",
      tags: ["Autenticacion", "OTP", "Stepper"]
    },
    {
      module: "autenticacion",
      moduleLabel: "Login y Autenticacion",
      title: "Paso 3 - Restablecer contrasena",
      family: "autenticacion",
      status: "implementada",
      href: "Login/restablecer-contrasena.html",
      description: "Paso final del flujo de recuperacion para definir nueva contrasena manteniendo la familia visual del login.",
      tags: ["Autenticacion", "Contrasena", "Stepper"]
    },
    {
      module: "usuarios",
      moduleLabel: "Gestion de Usuarios",
      title: "Gestion de usuarios",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Usuarios/gestion-usuarios.html",
      description: "Listado maestro con filtros, estado, auditoria, acciones y detalle lateral de empresas y roles.",
      tags: ["Usuarios", "Drawer derecho"]
    },
    {
      module: "usuarios",
      moduleLabel: "Gestion de Usuarios",
      title: "Registro de usuario",
      family: "registro",
      status: "implementada",
      href: "Gestion%20de%20Usuarios/registro-usuario.html",
      description: "Formulario extenso con datos personales, acceso y relacion acumulativa empresa + roles.",
      tags: ["Formulario extenso", "Empresa + roles"]
    },
    {
      module: "usuarios",
      moduleLabel: "Gestion de Usuarios",
      title: "Editar usuario",
      family: "registro",
      status: "implementada",
      href: "Gestion%20de%20Usuarios/editar-usuario.html",
      description: "Edicion separada de datos basicos y roles por empresa para evitar cambios acoplados.",
      tags: ["Edicion", "Roles"]
    },
    {
      module: "usuarios",
      moduleLabel: "Gestion de Usuarios",
      title: "Permisos por rol",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Usuarios/gestion-permisos-rol.html",
      description: "Vista agil para administrar permisos de roles existentes con selector de rol, filtros basicos, matriz editable por modulo y guardado de cambios.",
      tags: ["Permisos", "Roles", "Administracion"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Gestion de empresas",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Empresas/gestion-empresas.html",
      description: "Listado maestro de empresas con NIT, roles asociados, alcance, estado y auditoria.",
      tags: ["Empresas", "Maestra"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Roles por empresa",
      family: "relacion",
      status: "implementada",
      href: "Gestion%20de%20Empresas/roles-empresa.html",
      description: "Gestion relacional tipo transfer para roles disponibles por empresa.",
      tags: ["Relacion", "Transfer"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Creacion de roles",
      family: "configuracion",
      status: "implementada",
      href: "Gestion%20de%20Empresas/parametrizacion-roles.html",
      description: "Panel administrativo para crear o editar roles, asignarlos a una empresa activa y parametrizar permisos en el mismo flujo.",
      tags: ["Roles", "Permisos", "Seguridad"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Gestion de conductores",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-conductores.html",
      description: "Tabla maestra de conductores con registro dedicado, auditoria, estados y visualizacion lateral.",
      tags: ["Conductores", "Maestra grande", "Drawer derecho"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Gestion de licencias",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-categorias-licencia.html",
      description: "Maestra corta con formulario embebido y acciones de activar o inactivar.",
      tags: ["Maestra corta", "Formulario embebido"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Conductor + licencia",
      family: "relacion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/relacion-conductor-licencia.html",
      description: "Vista de relacion para categorias activas por conductor y fecha de vencimiento.",
      tags: ["Relacion", "Clave compuesta"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Gestion de vehiculos",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-vehiculos.html",
      description: "Gestion principal de vehiculos con acceso a registro dedicado por reglas documentales.",
      tags: ["Vehiculos", "Maestra grande", "SOAT"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Tipos de vehiculos",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-tipos-vehiculo.html",
      description: "Catalogo corto para tipos de vehiculo con nombre unico y estado.",
      tags: ["Maestra corta", "Transporte"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Tipos de empresas",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-tipos-empresa.html",
      description: "Catalogo de clasificacion de empresas para flujos comerciales y logisticos.",
      tags: ["Maestra corta", "Empresa"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Relacion empresa tipo",
      family: "relacion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/relacion-empresa-tipo.html",
      description: "Relacion de empresas con uno o varios tipos activos.",
      tags: ["Relacion", "Clave compuesta"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Dashboard transporte",
      family: "analitica",
      status: "implementada",
      href: "Gestion%20de%20Transporte/dashboard-transporte.html",
      description: "Resumen analitico para seguimiento operativo de transporte.",
      tags: ["Analitica", "KPIs"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Matriz documental vehiculos",
      family: "analitica",
      status: "implementada",
      href: "Gestion%20de%20Transporte/matriz-documental-vehiculos.html",
      description: "Control documental de SOAT, tecnomecanica, alertas y vencimientos.",
      tags: ["Analitica", "Documentos"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Disponibilidad operativa",
      family: "analitica",
      status: "implementada",
      href: "Gestion%20de%20Transporte/disponibilidad-operativa.html",
      description: "Vista de disponibilidad y restricciones operativas de flota.",
      tags: ["Analitica", "Disponibilidad"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Programacion de vehiculos",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Transporte/gestion-operaciones.html",
      description: "Listado de programacion de vehiculos con filtros por estado, destino y semana, parametrizacion masiva y reprogramacion de vehiculos finalizados.",
      tags: ["Programacion", "Vehiculos", "Masivo"]
    },
    {
      module: "transporte",
      moduleLabel: "Transporte",
      title: "Programar vehiculo",
      family: "registro",
      status: "implementada",
      href: "Gestion%20de%20Transporte/inicio-operacion.html",
      description: "Formulario para programar vehiculo con conductor validado, fecha futura libre, semana operativa calculada y tipo de destino.",
      tags: ["Programacion", "Formulario", "Planificacion"]
    },
    {
      module: "fincas",
      moduleLabel: "Fincas",
      title: "Gestion de fincas",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Fincas/gestion-fincas.html",
      description: "Gestion principal de fincas con acceso a registro dedicado por estructura grande.",
      tags: ["Fincas", "Maestra grande", "FK"]
    },
    {
      module: "referencias",
      moduleLabel: "Referencias",
      title: "Gestion de referencias",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Fincas/gestion-referencias.html",
      description: "Gestion de referencias con versionamiento y acceso a registro dedicado.",
      tags: ["Referencias", "Versionamiento"]
    },
    {
      module: "fincas",
      moduleLabel: "Fincas",
      title: "Gestion de grupos",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Fincas/gestion-grupos.html",
      description: "Maestra corta con formulario embebido para grupos de fincas.",
      tags: ["Maestra corta", "Formulario embebido"]
    },
    {
      module: "fincas",
      moduleLabel: "Fincas",
      title: "Gestion de sectores",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Fincas/gestion-sectores.html",
      description: "Maestra corta para sectores asociados a ubicacion de fincas.",
      tags: ["Maestra corta", "Sectores"]
    },
    {
      module: "referencias",
      moduleLabel: "Referencias",
      title: "Clases de referencias",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Fincas/gestion-clases-referencia.html",
      description: "Maestra corta con formulario embebido y validacion de nombre mas tamano.",
      tags: ["Maestra corta", "Clase"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Gestion de clientes",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Empresas/gestion-clientes.html",
      description: "Maestra de clientes y exportadores requerida por HU290 para asociar avisos de corte a un comprador o destino comercial.",
      tags: ["HU290", "Clientes", "Exportadores"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Contactos",
      family: "gestion",
      status: "base",
      href: "Gestion%20de%20Empresas/gestion-contactos.html",
      description: "Tabla maestra de contactos administrativos y operativos con registro dedicado, validacion de correo unico y trazabilidad.",
      tags: ["Contactos", "Maestra grande", "Notificaciones"]
    },
    {
      module: "referencias",
      moduleLabel: "Referencias",
      title: "Tipos de fruta",
      family: "configuracion",
      status: "base",
      href: "Gestion%20de%20Fincas/gestion-tipos-fruta.html",
      description: "Catalogo de tipos de fruta con formulario embebido, validacion de nombre unico y mayuscula sostenida.",
      tags: ["Maestra corta", "Formulario embebido", "Fruta"]
    },
    {
      module: "referencias",
      moduleLabel: "Referencias",
      title: "Productos",
      family: "configuracion",
      status: "base",
      href: "Gestion%20de%20Fincas/gestion-productos.html",
      description: "Catalogo de productos agricolas con formulario embebido, validacion de nombre unico y estado.",
      tags: ["Maestra corta", "Formulario embebido", "Productos"]
    },
    {
      module: "referencias",
      moduleLabel: "Referencias",
      title: "Productos por finca",
      family: "relacion",
      status: "base",
      href: "Gestion%20de%20Fincas/gestion-productos-finca.html",
      description: "Relacion N:N entre productos y fincas para identificar cultivos por ubicacion con validacion de duplicidad compuesta.",
      tags: ["Relacion", "Fincas", "Productos"]
    },
    {
      module: "empresas",
      moduleLabel: "Empresa",
      title: "Dependencias",
      family: "configuracion",
      status: "base",
      href: "Gestion%20de%20Empresas/gestion-dependencias.html",
      description: "Catalogo de areas o dependencias funcionales con formulario embebido, nombre unico y estado.",
      tags: ["Maestra corta", "Formulario embebido", "Dependencias"]
    },
    {
      module: "puerto",
      moduleLabel: "Gestion Operaciones Puerto",
      title: "Gestion de contenedores",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20Operaciones%20Puerto/gestion-contenedores.html",
      description: "Maestra de contenedores con validacion de formato ISO, tipo existente y estado.",
      tags: ["Contenedores", "Formato ISO"]
    },
    {
      module: "puerto",
      moduleLabel: "Gestion Operaciones Puerto",
      title: "Programacion de contenedores",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20Operaciones%20Puerto/programacion-contenedores.html",
      description: "Parametrizacion semanal de uno o varios contenedores activos y disponibles, con selector paginado tipo SearchSelectInput, validacion contra container_process, etapa visible en tabla y listado de programaciones vigentes/finalizadas.",
      tags: ["Programacion", "Contenedores", "SearchSelectInput"]
    },
    {
      module: "puerto",
      moduleLabel: "Gestion Operaciones Puerto",
      title: "Tipos de contenedor",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20Operaciones%20Puerto/gestion-tipos-contenedor.html",
      description: "Catalogo de tipos de contenedor con codigo definido por usuario y capacidad mayor a cero.",
      tags: ["Maestra corta", "Capacidad"]
    },
    {
      module: "puerto",
      moduleLabel: "Gestion Operaciones Puerto",
      title: "Etapas de contenedor",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20Operaciones%20Puerto/gestion-etapas-contenedor.html",
      description: "Catalogo de etapas operativas para recepcion, inspeccion, consolidacion y exportacion.",
      tags: ["Maestra corta", "Etapas"]
    },
    {
      module: "puerto",
      moduleLabel: "Gestion Operaciones Puerto",
      title: "Gestion de puertos",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20Operaciones%20Puerto/gestion-puertos.html",
      description: "Catalogo de puertos con codigo autoincremental, nombre obligatorio y estado.",
      tags: ["Maestra corta", "Puertos"]
    },
    {
      module: "trazabilidad",
      moduleLabel: "Seguridad",
      title: "Auditoria operativa",
      family: "analitica",
      status: "implementada",
      href: "Trazabilidad/auditoria-operativa.html",
      description: "Consulta de eventos auditables generados por transporte web y operacion movil, con trazabilidad, evidencias, aprobacion humana de inspeccion, usuarios, fechas y sincronizacion.",
      tags: ["Auditoria", "Seguridad", "Operacion movil", "Transporte"]
    },
    {
      module: "trazabilidad",
      moduleLabel: "Seguridad",
      title: "Generar documento POMA",
      family: "registro",
      status: "implementada",
      href: "Trazabilidad/generar-documento-poma.html",
      description: "Vista HU337 para validar la operación de finca, consolidar carga y controles, y generar el POMA digitalizado.",
      tags: ["HU337", "POMA", "Trazabilidad"]
    },
    {
      module: "trazabilidad",
      moduleLabel: "Seguridad",
      title: "Tipos de inspeccion",
      family: "configuracion",
      status: "base",
      href: "Trazabilidad/gestion-tipos-inspeccion.html",
      description: "Catalogo de tipos de inspeccion para control de seguridad de contenedores en finca y puerto. Nombre unico en mayuscula sostenida.",
      tags: ["Maestra corta", "Inspeccion", "Seguridad"]
    },
    {
      module: "trazabilidad",
      moduleLabel: "Seguridad",
      title: "Tipos de evento trazabilidad",
      family: "configuracion",
      status: "base",
      href: "Trazabilidad/gestion-tipos-evento-trazabilidad.html",
      description: "Catalogo de eventos del flujo logistico: recepcion, inspeccion, cargue, despacho y exportacion. Incluye orden numerico opcional.",
      tags: ["Maestra corta", "Trazabilidad", "Eventos"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Gestion de avisos de corte",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/gestion-avisos-corte.html",
      description: "Vista independiente HU290 con KPIs y tabla de avisos; el boton Crear aviso abre el formulario de creacion sin KPIs.",
      tags: ["HU290", "Aviso de corte", "Formulario"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Gestion de semanas",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/gestion-semanas.html",
      description: "Consulta de semanas productivas con rango lunes a domingo, cinta asignada, mes calculado y auditoria.",
      tags: ["Semanas", "52 semanas", "Drawer derecho"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Generacion de semanas",
      family: "registro",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/generacion-semanas.html",
      description: "Formulario dedicado para generar automaticamente 52 semanas desde la semana 1 y una cinta inicial.",
      tags: ["Formulario grande", "Secuencia", "Validacion fechas"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Gestion de cintas",
      family: "gestion",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/gestion-cintas.html",
      description: "Maestra corta con formulario embebido para el calendario oficial de cintas y orden sin saltos.",
      tags: ["Cintas", "Maestra corta", "Calendario oficial"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Validacion calendario",
      family: "analitica",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/validacion-calendario.html",
      description: "Vista de control operativo para validar 52 semanas, traslapes, secuencia de cintas, auditoria y hallazgos.",
      tags: ["Analitica", "QA operativo", "Reglas HU"]
    },
    {
      module: "aviso-corte",
      moduleLabel: "Planeacion Aviso de Corte",
      title: "Monitoreo calendario",
      family: "analitica",
      status: "implementada",
      href: "Gestion%20de%20Planeacion/monitoreo-calendarios.html",
      description: "Vista anual tipo calendario para monitorear semanas generadas, cintas, notas operativas y trazabilidad.",
      tags: ["Analitica", "Calendario", "Operacion"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Tablero materiales",
      family: "analitica",
      status: "implementada",
      href: "Materiales%20y%20Suministros/index.html",
      description: "Centro orquestador para pedidos sugeridos, stock por finca, ordenes, proveedores externos, entregas y POD.",
      tags: ["HU659", "HU662", "HU666", "Orquestador"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Gestion de pedidos de materiales",
      family: "gestion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/gestion-pedidos-materiales.html",
      description: "Pedidos sugeridos, adicionales y estandar vinculados a semana de corte, finca, stock y clasificacion documental.",
      tags: ["HU659", "HU666", "HU667", "Pedidos"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Inventario por finca",
      family: "gestion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/inventario-materiales-finca.html",
      description: "Consulta de stock disponible por finca y material antes de confirmar pedidos o sobrepedidos.",
      tags: ["HU662", "Stock", "Fincas"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Inventario de pallets",
      family: "gestion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/inventario-pallets.html",
      description: "Pallets completos y mochos con referencia, finca origen, cajas restantes y destino operativo.",
      tags: ["HU559", "HU560", "Pallets"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Ordenes de transporte de insumos",
      family: "gestion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/ordenes-transporte-insumos.html",
      description: "Ordenes de transporte con documento logistico, vehiculo, conductor y notificaciones a transporte, seguridad y fincas.",
      tags: ["HU546", "HU669", "HU670", "HU532"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Resumen para proveedores externos",
      family: "comunicacion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/resumen-proveedores.html",
      description: "Consolidacion digital por proveedor, materiales, cantidades, destinos y fechas con registro de generacion y envio.",
      tags: ["HU668", "Proveedores", "Envio digital"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Seguimiento de entregas y POD",
      family: "gestion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/seguimiento-entregas.html",
      description: "Consulta read-only de entregas moviles, evidencia POD, firma digital y enlace contextual a Seguridad.",
      tags: ["HU681", "HU682", "HU547", "HU607"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Trazabilidad integral del pedido",
      family: "gestion",
      status: "propuesta",
      href: "Materiales%20y%20Suministros/trazabilidad-pedido.html",
      description: "Ruta operativa de un pedido desde su creación hasta el cierre, con foco en el estado actual y transiciones en vivo.",
      tags: ["Pedidos", "Trazabilidad", "Tiempo real", "Propuesta"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Gestion de materiales",
      family: "configuracion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/gestion-materiales.html",
      description: "Maestra minima de materiales usados por pedidos, inventario, ordenes y proveedores externos.",
      tags: ["Maestra corta", "Materiales"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Gestion de proveedores",
      family: "configuracion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/gestion-proveedores.html",
      description: "Maestra minima de proveedores externos para resumenes digitales y coordinacion de cartoneras o estibaderos.",
      tags: ["Maestra corta", "Proveedores"]
    },
    {
      module: "materiales",
      moduleLabel: "Materiales y Suministros",
      title: "Reglas documentales",
      family: "configuracion",
      status: "implementada",
      href: "Materiales%20y%20Suministros/reglas-documentales.html",
      description: "Parametrizacion de clasificacion automatica para RPT, remision o reserva, visible en pedidos y ordenes.",
      tags: ["HU667", "RPT", "Remision", "Reserva"]
    }
  ];

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function cardTemplate(view) {
    const familyLabel = view.family.charAt(0).toUpperCase() + view.family.slice(1);
    const tags = view.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
    return `
      <article class="module-card" data-module="${view.module}" data-family="${view.family}" data-status="${view.status}" data-search="${normalize(`${view.moduleLabel} ${view.title} ${view.description} ${view.tags.join(" ")}`)}">
        <div class="module-card-header">
          <div>
            <p class="section-kicker">${view.moduleLabel}</p>
            <h3 class="module-title">${view.title}</h3>
          </div>
          <span class="tag tag-success">${familyLabel}</span>
        </div>
        <p class="module-description">${view.description}</p>
        <div class="tag-row">
          <span class="tag tag-warning">${view.status === "implementada" ? "Implementada" : "Base"}</span>
          ${tags}
        </div>
        <div class="module-actions">
          <a href="${view.href}">Abrir vista</a>
          <a class="btn btn-secondary" href="${view.href}" aria-label="Abrir ${view.title}">Ver propuesta</a>
        </div>
      </article>
    `;
  }

  function render() {
    ["inicio", "libreria", "indicadores", "changelog", "errores", "autenticacion", "referencias", "fincas", "transporte", "empresas", "usuarios", "aviso-corte", "materiales", "puerto", "trazabilidad"].forEach((module) => {
      const group = qs(`[data-module-group="${module}"]`);
      if (!group) return;
      group.innerHTML = views.filter((view) => view.module === module).map(cardTemplate).join("");
    });
  }

  function applyFilters() {
    const term = normalize(qs("#globalSearch")?.value);
    const moduleFilter = qs("#moduleFilter")?.value || "all";
    const familyFilter = qs("#familyFilter")?.value || "all";
    const statusFilter = qs("#statusFilter")?.value || "all";
    let visible = 0;

    qsa(".module-card").forEach((card) => {
      const show = (!term || card.dataset.search.includes(term)) &&
        (moduleFilter === "all" || card.dataset.module === moduleFilter) &&
        (familyFilter === "all" || card.dataset.family === familyFilter) &&
        (statusFilter === "all" || card.dataset.status === statusFilter);
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });

    const visibleCount = qs("#visibleCount");
    if (visibleCount) visibleCount.textContent = String(visible);
    qs("#emptyState")?.classList.toggle("show", visible === 0);
  }

  function initFilters() {
    ["#globalSearch", "#moduleFilter", "#familyFilter", "#statusFilter"].forEach((selector) => {
      const control = qs(selector);
      if (!control) return;
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", applyFilters);
    });
    qs("#clearFilters")?.addEventListener("click", () => {
      qs("#globalSearch").value = "";
      qs("#moduleFilter").value = "all";
      qs("#familyFilter").value = "all";
      qs("#statusFilter").value = "all";
      applyFilters();
      qs("#globalSearch").focus();
    });
  }

  function initSectionLinks() {
    qsa("[data-section-link]").forEach((link) => {
      link.addEventListener("click", () => {
        qsa("[data-section-link]").forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  function initThemeToggle() {
    const toggle = qs("[data-theme-toggle]");
    if (!toggle) return;

    const storedTheme = localStorage.getItem("sial-theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    function setTheme(theme) {
      const normalizedTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = normalizedTheme;
      localStorage.setItem("sial-theme", normalizedTheme);
      const isDark = normalizedTheme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      toggle.setAttribute("title", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }

    setTheme(storedTheme || (systemDark ? "dark" : "light"));

    toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  function init() {
    render();
    initFilters();
    initSectionLinks();
    window.SIALCore?.initThemeToggle?.();
    applyFilters();
  }

  return { init };
})();

SIALCatalog.init();






