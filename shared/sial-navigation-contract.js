window.SIALNavigationContract = Object.freeze({
  schemaVersion: "1.0",
  source: Object.freeze({
    type: "sanitized-proposal-contract",
    derivedFrom: "fe-sial-web-menu",
    authority: "approved-reference",
    containsSensitiveData: false
  }),
  areas: Object.freeze({
    gestion: {
      label: "Gestion",
      modules: [
        {
          id: "referencias",
          label: "Referencias",
          icon: "referencias",
          folder: "Gestion de Fincas",
          localFolder: "Gestion de Fincas",
          views: [
            { id: "referencias", label: "Gestion de referencias", href: "gestion-referencias.html" },
            { id: "clases", label: "Clases de referencias", href: "gestion-clases-referencia.html" },
            { id: "productos", label: "Productos", href: "gestion-productos.html" }
          ]
        },
        {
          id: "fincas",
          label: "Fincas",
          icon: "fincas",
          folder: "Gestion de Fincas",
          localFolder: "sial-fincas-propuesta",
          views: [
            { id: "fincas", label: "Gestion de fincas", href: "gestion-fincas.html" },
            { id: "sectores", label: "Gestion de sectores", href: "gestion-sectores.html" },
            { id: "grupos", label: "Gestion de grupos", href: "gestion-grupos.html" }
          ]
        },
        {
          id: "transporte",
          label: "Transporte",
          icon: "transporte",
          folder: "Gestion de Transporte",
          localFolder: "Gestion de Transporte",
          views: [
            { id: "gestion", label: "Gestion de conductores", href: "gestion-conductores.html" },
            { id: "licencias", label: "Gestion de licencias", href: "gestion-categorias-licencia.html" },
            { id: "relacion", label: "Conductor + licencia", href: "relacion-conductor-licencia.html" },
            { id: "vehiculos", label: "Gestion de vehiculos", href: "gestion-vehiculos.html" },
            { id: "tiposVehiculo", label: "Tipos de vehiculos", href: "gestion-tipos-vehiculo.html" },
            { id: "dashboard", label: "Dashboard transporte", href: "dashboard-transporte.html" },
            { id: "documental", label: "Matriz documental", href: "matriz-documental-vehiculos.html" },
            { id: "disponibilidad", label: "Disponibilidad", href: "disponibilidad-operativa.html" },
            { id: "planes", label: "Planes operacionales", href: "plan-operacional.html" },
            { id: "operaciones", label: "Programacion de vehiculos", href: "gestion-operaciones.html" },
          ]
        },
        {
          id: "empresas",
          label: "Empresa",
          icon: "empresas",
          folder: "Gestion de Empresas",
          localFolder: "Gestion de Empresas",
          views: [
            { id: "empresas", label: "Gestion de empresas", href: "gestion-empresas.html" },
            { id: "roles", label: "Roles por empresas", href: "roles-empresa.html" },
            { id: "paramRoles", label: "Creacion de roles", href: "parametrizacion-roles.html" },
            { id: "tiposEmpresa", label: "Tipos de empresas", href: "gestion-tipos-empresa.html", folder: "Gestion de Transporte", localFolder: "Gestion de Transporte" },
            { id: "empresaTipo", label: "Empresa + tipo", href: "relacion-empresa-tipo.html", folder: "Gestion de Transporte", localFolder: "Gestion de Transporte" },
            { id: "clientes", label: "Clientes", href: "gestion-clientes.html" },
            { id: "contactos", label: "Contactos", href: "gestion-contactos.html" },
            { id: "alertasContactos", label: "Alertas por contacto", href: "gestion-notificaciones-contactos.html" },
            { id: "dependencias", label: "Dependencias", href: "gestion-dependencias.html" }
          ]
        },
        {
          id: "usuarios",
          label: "Usuarios",
          icon: "usuarios",
          folder: "Gestion de Usuarios",
          localFolder: "Gestion de Usuarios",
          views: [
            { id: "usuarios", label: "Gestion de usuarios", href: "gestion-usuarios.html" },
            { id: "registro", label: "Registro de usuario", href: "registro-usuario.html" },
            { id: "edicion", label: "Editar usuario", href: "editar-usuario.html" },
            { id: "permisosRol", label: "Permisos por rol", href: "gestion-permisos-rol.html" }
          ]
        },
        {
          id: "planeacion",
          label: "Planeacion",
          icon: "planeacion",
          folder: "Gestion de Planeacion",
          localFolder: "Gestion de Planeacion",
          views: [
            { id: "avisos", label: "Avisos de corte", href: "gestion-avisos-corte.html" },
            { id: "crearAviso", label: "Crear aviso", href: "crear-aviso-corte.html" },
            { id: "semanas", label: "Gestion de semanas", href: "gestion-semanas.html" },
            { id: "generacion", label: "Generar semanas", href: "generacion-semanas.html" },
            { id: "cintas", label: "Gestion de cintas", href: "gestion-cintas.html" }
          ]
        },
        {
          id: "materiales",
          label: "Materiales y Suministros",
          icon: "materiales",
          folder: "Materiales y Suministros",
          localFolder: "Materiales y Suministros",
          views: [
            { id: "dashboard", label: "Tablero materiales", href: "index.html" },
            { id: "pedidos", label: "Gestion de pedidos", href: "gestion-pedidos-materiales.html" },
            { id: "seguimientoPedidos", label: "Seguimiento de pedidos", href: "seguimiento-pedidos-finca.html" },
            { id: "aprobacionPedidos", label: "Aprobación de pedidos", href: "aprobacion-pedidos-materiales.html" },
            { id: "pedidosRecurrentes", label: "Pedidos recurrentes", href: "pedidos-recurrentes.html" },
            { id: "inventario", label: "Inventario de materiales", href: "inventario-materiales-finca.html" },
            { id: "movimientos", label: "Movimientos de inventario", href: "movimientos-inventario.html" },
            { id: "pallets", label: "Inventario de pallets", href: "inventario-pallets.html" },
            { id: "ordenes", label: "Ordenes de transporte", href: "ordenes-transporte-insumos.html" },
            { id: "proveedores", label: "Resumen proveedores", href: "resumen-proveedores.html" },
            { id: "entregas", label: "Seguimiento entregas", href: "seguimiento-entregas.html" },
            { id: "trazabilidad-pedido", label: "Trazabilidad del pedido", href: "trazabilidad-pedido.html" },
            { id: "materiales", label: "Catálogo de materiales", href: "gestion-materiales.html" },
            { id: "categoriasPedido", label: "Categorías de pedido", href: "categorias-pedido.html" },
            { id: "recetas", label: "Recetas de materiales", href: "recetas-materiales.html" },
            { id: "proveedoresMaster", label: "Gestion de proveedores", href: "gestion-proveedores.html" },
            { id: "reglas", label: "Reglas documentales", href: "reglas-documentales.html" }
          ]
        },
        {
          id: "puerto",
          label: "Puerto",
          icon: "puerto",
          folder: "Gestion Operaciones Puerto",
          localFolder: "Gestion Operaciones Puerto",
          views: [
            { id: "contenedores", label: "Gestion de contenedores", href: "gestion-contenedores.html" },
            { id: "programacionContenedores", label: "Programacion de contenedores", href: "programacion-contenedores.html" },
            { id: "trazabilidadPallets", label: "Trazabilidad de pallets", href: "trazabilidad-pallets.html" },
            { id: "tipos", label: "Tipos de contenedor", href: "gestion-tipos-contenedor.html" },
            { id: "etapas", label: "Etapas de contenedor", href: "gestion-etapas-contenedor.html" },
            { id: "puertos", label: "Gestion de puertos", href: "gestion-puertos.html" }
          ]
        },
        {
          id: "trazabilidad",
          label: "Seguridad",
          icon: "seguridad",
          folder: "Trazabilidad",
          localFolder: "Trazabilidad",
          views: [
            { id: "auditoria", label: "Auditoria operativa", href: "auditoria-operativa.html" },
            { id: "poma", label: "Generar POMA", href: "generar-documento-poma.html" }
          ]
        }
      ]
    }
  })
});
