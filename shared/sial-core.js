const SIALCore = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const normalize = (value) => String(value || "").trim().toLowerCase();
  const getCoreScript = () => {
    const scripts = qsa('script[src*="sial-core.js"]');
    return document.currentScript || scripts[scripts.length - 1] || null;
  };
  const getSharedAssetUrl = (assetPath) => {
    const coreScript = getCoreScript();
    if (!coreScript?.src) return `shared/${assetPath}`;
    return new URL(assetPath, coreScript.src).href;
  };
  const defaultTypeLabels = {
    feature: "Nuevo",
    improvement: "Mejora",
    fix: "Correccion",
    docs: "Documentacion"
  };
  const navigationIcons = {
    catalogo: '<path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>',
    usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>',
    empresas: '<path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path>',
    transporte: '<path d="M3 7h11v10H3z"></path><path d="M14 11h4l3 3v3h-7z"></path><circle cx="7" cy="18" r="2"></circle><circle cx="18" cy="18" r="2"></circle>',
    materiales: '<path d="M21 8 12 3 3 8l9 5 9-5Z"></path><path d="M3 8v8l9 5 9-5V8"></path><path d="M12 13v8"></path>',
    fincas: '<path d="M4 20V9l8-5 8 5v11"></path><path d="M8 20v-7h8v7"></path>',
    referencias: '<path d="M5 4h14v16H5z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path><path d="M9 16h4"></path>',
    planeacion: '<rect x="4" y="5" width="16" height="16" rx="2"></rect><path d="M16 3v4"></path><path d="M8 3v4"></path><path d="M4 11h16"></path>',
    puerto: '<path d="M4 20h16"></path><path d="M7 20V9l5-4 5 4v11"></path><path d="M9 13h6"></path>',
    seguridad: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-5"></path>',
    indicadores: '<path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 15l3-4 3 2 5-7"></path>',
    changelog: '<rect x="4" y="3" width="16" height="18" rx="2"></rect><path d="M8 8h8"></path><path d="M8 12h8"></path><path d="M8 16h5"></path>',
    libreria: '<path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path>',
    default: '<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>'
  };
  const navigationRegistry = {
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
            { id: "tiposFruta", label: "Tipos de fruta", href: "gestion-tipos-fruta.html" },
            { id: "productos", label: "Productos", href: "gestion-productos.html" },
            { id: "productosFinca", label: "Productos por finca", href: "gestion-productos-finca.html" }
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
            { id: "cintas", label: "Gestion de cintas", href: "gestion-cintas.html" },
            { id: "validacion", label: "Validacion calendario", href: "validacion-calendario.html" },
            { id: "monitoreo", label: "Monitoreo calendario", href: "monitoreo-calendarios.html" }
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
            { id: "inventario", label: "Inventario de materiales", href: "inventario-materiales-finca.html" },
            { id: "movimientos", label: "Movimientos de inventario", href: "movimientos-inventario.html" },
            { id: "pallets", label: "Inventario de pallets", href: "inventario-pallets.html" },
            { id: "ordenes", label: "Ordenes de transporte", href: "ordenes-transporte-insumos.html" },
            { id: "proveedores", label: "Resumen proveedores", href: "resumen-proveedores.html" },
            { id: "entregas", label: "Seguimiento entregas", href: "seguimiento-entregas.html" },
            { id: "trazabilidad-pedido", label: "Trazabilidad del pedido", href: "trazabilidad-pedido.html" },
            { id: "materiales", label: "Catálogo de materiales", href: "gestion-materiales.html" },
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
            { id: "poma", label: "Generar POMA", href: "generar-documento-poma.html" },
            { id: "tiposInspeccion", label: "Tipos de inspeccion", href: "gestion-tipos-inspeccion.html" },
            { id: "tiposEvento", label: "Tipos de evento trazabilidad", href: "gestion-tipos-evento-trazabilidad.html" }
          ]
        }
      ]
    }
  };

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");
  }

  function iconTemplate(name) {
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${navigationIcons[name] || navigationIcons.default}</svg>`;
  }

  function isLocalPrototypePath() {
    const pathSegments = window.location.pathname
      .toLowerCase()
      .split(/[\\/]+/)
      .map((segment) => decodeURIComponent(segment));
    const localFolders = navigationRegistry.gestion.modules.map((module) => module.localFolder);
    return pathSegments.some((segment) => localFolders.includes(segment));
  }

  function getCurrentNavigationFolder() {
    const segments = window.location.pathname
      .split(/[\\/]+/)
      .map((segment) => decodeURIComponent(segment))
      .filter(Boolean);
    return segments.length > 1 ? segments[segments.length - 2] : "";
  }

  function getNavigationFolder(targetModule, targetView) {
    if (isLocalPrototypePath()) return targetView?.localFolder || targetModule.localFolder || targetView?.folder || targetModule.folder;
    return targetView?.folder || targetModule.folder || targetView?.localFolder || targetModule.localFolder;
  }

  function resolveNavigationHref(targetModule, targetView) {
    const view = typeof targetView === "object" ? targetView : { href: targetView };
    const href = view?.href;
    if (!href) return "#";
    if (href.startsWith("#") || /^https?:\/\//i.test(href)) return href;
    const folder = getNavigationFolder(targetModule, view);
    if (!folder || normalize(folder) === normalize(getCurrentNavigationFolder())) return href;
    return `../${encodeURI(folder)}/${href}`;
  }

  function initSidebarToggle() {
    const sidebar = qs(".sidebar");
    if (!sidebar || sidebar.dataset.sidebarToggleReady === "true") return;
    sidebar.dataset.sidebarToggleReady = "true";

    const toggles = qsa("[data-sidebar-toggle], .header [aria-label='Abrir menu']");
    if (!toggles.length) return;

    let backdrop = qs("[data-sidebar-backdrop]");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      backdrop.dataset.sidebarBackdrop = "true";
      backdrop.hidden = true;
      document.body.appendChild(backdrop);
    }

    const isSmallViewport = () => window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    const storedState = localStorage.getItem("sial-sidebar-state") === "collapsed" ? "collapsed" : "expanded";

    function syncToggleLabels(expanded, overlayOpen = false) {
      toggles.forEach((toggle) => {
        toggle.dataset.sidebarToggle = "true";
        toggle.setAttribute("aria-expanded", String(expanded));
        const label = overlayOpen ? "Cerrar menu" : isSmallViewport() ? "Abrir menu" : expanded ? "Contraer menu" : "Expandir menu";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
      });
    }

    function setSidebarState(state) {
      const normalizedState = state === "collapsed" ? "collapsed" : "expanded";
      document.documentElement.dataset.sidebarState = normalizedState;
      localStorage.setItem("sial-sidebar-state", normalizedState);
      syncToggleLabels(normalizedState !== "collapsed");
    }

    function openOverlay() {
      document.documentElement.dataset.sidebarOverlay = "open";
      backdrop.hidden = false;
      syncToggleLabels(true, true);
      const firstLink = qs("a, button", sidebar);
      firstLink?.focus();
    }

    function closeOverlay() {
      if (document.documentElement.dataset.sidebarOverlay !== "open") return;
      document.documentElement.dataset.sidebarOverlay = "closed";
      backdrop.hidden = true;
      syncToggleLabels(false, false);
    }

    setSidebarState(storedState);
    if (isSmallViewport()) {
      document.documentElement.dataset.sidebarOverlay = "closed";
      backdrop.hidden = true;
      syncToggleLabels(false, false);
    }

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        if (isSmallViewport()) {
          if (document.documentElement.dataset.sidebarOverlay === "open") {
            closeOverlay();
          } else {
            openOverlay();
          }
          return;
        }
        const nextState = document.documentElement.dataset.sidebarState === "collapsed" ? "expanded" : "collapsed";
        setSidebarState(nextState);
      });
    });

    backdrop.addEventListener("click", closeOverlay);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeOverlay();
    });
    window.addEventListener("resize", () => {
      if (!isSmallViewport()) closeOverlay();
    });
  }

  function initNavigation(config = {}) {
    const areaId = config.area || "gestion";
    const group = navigationRegistry[areaId];
    const nav = qs(config.nav || "[data-nav]");
    if (!group || !nav) {
      initThemeToggle();
      initSidebarToggle();
      initStateActionConfirm();
      initProfileMenu();
      return;
    }

    const activeModuleId = config.module || group.modules[0]?.id;
    const activeModule = group.modules.find((module) => module.id === activeModuleId) || group.modules[0];
    const activeViewId = config.view || activeModule?.views?.[0]?.id;
    const activeViewsStateKey = `sial-nav-views:${areaId}:${activeModule.id}`;
    const activeViewsExpanded = localStorage.getItem(activeViewsStateKey) !== "collapsed";
    const caption = nav.closest(".sidebar")?.querySelector(".menu-caption");
    if (caption) caption.textContent = group.label;

    nav.classList.add("sidebar-nav");
    nav.setAttribute("aria-label", `${group.label}: modulos y vistas`);
    nav.innerHTML = group.modules.map((module) => {
      const isActiveModule = module.id === activeModule.id;
      const firstView = module.views[0];
      const moduleHref = resolveNavigationHref(module, firstView);
      const sublistId = `nav-${areaId}-${module.id}-views`;
      const sublist = isActiveModule ? `
        <div class="nav-sublist" id="${escapeHtml(sublistId)}" aria-label="Vistas de ${escapeHtml(module.label)}" ${activeViewsExpanded ? "" : "hidden"}>
          ${module.views.map((view) => {
            const isActiveView = view.id === activeViewId;
            return `<a class="nav-link nav-sub-link ${isActiveView ? "active" : ""}" href="${escapeHtml(resolveNavigationHref(module, view))}" ${isActiveView ? 'aria-current="page"' : ""}><span>${escapeHtml(view.label)}</span></a>`;
          }).join("")}
        </div>
      ` : "";
      const moduleToggle = isActiveModule ? `
        <button class="nav-module-toggle" type="button" data-nav-module-toggle data-storage-key="${escapeHtml(activeViewsStateKey)}" aria-controls="${escapeHtml(sublistId)}" aria-expanded="${String(activeViewsExpanded)}" aria-label="${activeViewsExpanded ? "Contraer vistas de" : "Expandir vistas de"} ${escapeHtml(module.label)}" title="${activeViewsExpanded ? "Contraer vistas" : "Expandir vistas"}">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
        </button>
      ` : "";

      return `
        <div class="nav-module ${isActiveModule ? "is-active" : ""}">
          <div class="nav-module-head">
            <a class="nav-link nav-module-link ${isActiveModule ? "active" : ""}" href="${escapeHtml(moduleHref)}" title="${escapeHtml(module.label)}">
              ${iconTemplate(module.icon)}
              <span class="nav-text">${escapeHtml(module.label)}</span>
            </a>
            ${moduleToggle}
          </div>
          ${sublist}
        </div>
      `;
    }).join("");

    qsa("[data-nav-module-toggle]", nav).forEach((button) => {
      button.addEventListener("click", () => {
        const sublist = qs(`#${button.getAttribute("aria-controls")}`, nav);
        if (!sublist) return;
        const willExpand = sublist.hasAttribute("hidden");
        const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const motionDuration = reducedMotion ? 0 : 180;
        clearTimeout(sublist.navMotionTimer);
        if (willExpand) {
          sublist.hidden = false;
          if (reducedMotion) {
            delete sublist.dataset.navMotion;
          } else {
            sublist.dataset.navMotion = "opening";
          }
          sublist.navMotionTimer = window.setTimeout(() => {
            delete sublist.dataset.navMotion;
          }, motionDuration + 40);
        } else if (motionDuration > 0) {
          sublist.dataset.navMotion = "closing";
          sublist.navMotionTimer = window.setTimeout(() => {
            sublist.hidden = true;
            delete sublist.dataset.navMotion;
          }, motionDuration);
        } else {
          sublist.hidden = true;
          delete sublist.dataset.navMotion;
        }
        button.setAttribute("aria-expanded", String(willExpand));
        button.setAttribute("aria-label", `${willExpand ? "Contraer" : "Expandir"} vistas de ${activeModule.label}`);
        button.setAttribute("title", willExpand ? "Contraer vistas" : "Expandir vistas");
        localStorage.setItem(button.dataset.storageKey, willExpand ? "expanded" : "collapsed");
      });
    });

    initThemeToggle();
    initSidebarToggle();
    initStateActionConfirm();
    initTableExport();
    initProfileMenu();
  }

  function initShell(config = {}) {
    initNavigation(config);
  }

  function initThemeToggle() {
    const toggles = qsa("[data-theme-toggle]").filter((toggle) => toggle.dataset.themeReady !== "true");
    if (!toggles.length) return;
    toggles.forEach((toggle) => {
      toggle.dataset.themeReady = "true";
    });
    const storedTheme = localStorage.getItem("sial-theme");
    const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (systemDark ? "dark" : "light");

    const setTheme = (theme) => {
      const normalizedTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = normalizedTheme;
      localStorage.setItem("sial-theme", normalizedTheme);
      const isDark = normalizedTheme === "dark";
      qsa("[data-theme-toggle]").forEach((toggle) => {
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
        toggle.setAttribute("title", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      });
    };

    setTheme(initialTheme);
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
      });
    });
    initSidebarToggle();
  }

  function getLoginUrl() {
    const coreScript = getCoreScript();
    if (!coreScript?.src) return "Login/index.html";
    return new URL("../Login/index.html", coreScript.src).href;
  }

  function closeProfileMenu(menu) {
    if (!menu) return;
    menu.classList.remove("is-open");
    const trigger = qs(".profile-trigger", menu);
    const panel = qs(".profile-panel", menu);
    trigger?.setAttribute("aria-expanded", "false");
    if (panel) panel.hidden = true;
  }

  function closeProfileMenus(exceptMenu = null) {
    qsa("[data-profile-menu].is-open").forEach((menu) => {
      if (menu !== exceptMenu) closeProfileMenu(menu);
    });
  }

  function setProfileMenuOpen(menu, open) {
    if (!menu) return;
    closeProfileMenus(open ? menu : null);
    const trigger = qs(".profile-trigger", menu);
    const panel = qs(".profile-panel", menu);
    menu.classList.toggle("is-open", open);
    trigger?.setAttribute("aria-expanded", String(open));
    if (panel) panel.hidden = !open;
  }

  function focusProfileItem(panel, direction = 1) {
    if (!panel) return;
    const items = qsa("[data-profile-action]", panel);
    if (!items.length) return;
    const currentIndex = items.indexOf(document.activeElement);
    const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  function profileActionIcon(action) {
    const icons = {
      view: '<path d="M16 21v-2a4 4 0 0 0-8 0v2"></path><circle cx="12" cy="8" r="4"></circle>',
      settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"></path>',
      logout: '<path d="M10 17l5-5-5-5"></path><path d="M15 12H3"></path><path d="M21 19V5a2 2 0 0 0-2-2h-6"></path>'
    };
    return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[action] || icons.view}</svg>`;
  }

  function initProfileMenu(config = {}) {
    const selector = config.selector || ".app-shell > .header .header-right > .avatar";
    const avatars = qsa(selector).filter((avatar) => avatar.dataset.profileReady !== "true");
    if (!avatars.length) return;

    const dialogState = {
      backdrop: null,
      dialog: null,
      lastAction: "view",
      lastFocusedActionControl: null,
      carouselCleanup: null
    };

    const parseProfileList = (value) => String(value || "")
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean);

    const normalizeFarms = (farms) => (Array.isArray(farms) ? farms : parseProfileList(farms))
      .map((farm) => typeof farm === "string" ? { id: farm, name: farm } : farm)
      .filter((farm) => farm?.name);

    const getInitials = (name, fallback = "US") => {
      const words = String(name || "").trim().split(/\s+/).filter(Boolean);
      return words.length
        ? words.slice(0, 2).map((word) => word[0]).join("").toUpperCase()
        : fallback;
    };

    const getProfileData = (avatar) => {
      const sessionProfile = window.SIALProfile || {};
      const activeContext = sessionProfile.activeContext || {};
      const farms = normalizeFarms(activeContext.scope?.farms || sessionProfile.farms || avatar.dataset.profileFarms);
      const name = sessionProfile.user?.displayName || sessionProfile.name || avatar.dataset.profileName || "Usuario SIAL";
      const role = activeContext.role?.name || sessionProfile.role || avatar.dataset.profileRole || "Sin contexto operativo";
      const company = activeContext.company?.name || sessionProfile.company || avatar.dataset.profileCompany || "Empresa no seleccionada";
      const scope = activeContext.scope?.label || sessionProfile.scope || avatar.dataset.profileScope || (farms.length ? `${farms.length} finca${farms.length === 1 ? "" : "s"} asignada${farms.length === 1 ? "" : "s"}` : "Alcance por definir");
      return {
        initials: sessionProfile.user?.initials || sessionProfile.initials || avatar.textContent.trim() || getInitials(name),
        name,
        role,
        company,
        scope,
        modules: activeContext.modules || sessionProfile.modules || parseProfileList(avatar.dataset.profileModules),
        document: sessionProfile.user?.documentMasked || sessionProfile.documentMasked || avatar.dataset.profileDocument || "No disponible",
        phone: sessionProfile.user?.phone || sessionProfile.phone || avatar.dataset.profilePhone || "No disponible",
        email: sessionProfile.user?.email || sessionProfile.email || avatar.dataset.profileEmail || "No disponible",
        farms,
        memberships: sessionProfile.memberships || [],
        lastLoginAt: sessionProfile.session?.lastLoginAt || sessionProfile.lastLoginAt || "Sesión actual"
      };
    };

    const renderProfileChips = (items, className = "profile-context-chip") => items.length
      ? items.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("")
      : `<span class="${className} is-muted">Sin módulos asignados</span>`;

    const setThemeLabel = (button, buttonText) => {
      if (!button) return;
      const isDark = document.documentElement.dataset.theme === "dark";
      button.textContent = buttonText || `Tema ${isDark ? "claro" : "oscuro"}`;
      button.dataset.profileTheme = isDark ? "light" : "dark";
      button.setAttribute("aria-label", `Cambiar a tema ${isDark ? "claro" : "oscuro"}`);
    };

    const getProfileSettingsLabelState = () => {
      const isDark = document.documentElement.dataset.theme === "dark";
      const notificationsEnabled = localStorage.getItem("sial-notifications") !== "false";
      return {
        isDark,
        notificationsEnabled
      };
    };

    const getProfileSettingsNoticeText = () => {
      const { isDark, notificationsEnabled } = getProfileSettingsLabelState();
      return `Tema actual: ${isDark ? "oscuro" : "claro"} | Notificaciones ${notificationsEnabled ? "activas" : "inactivas"}.`;
    };

    const toggleProfileTheme = (button) => {
      const toggles = qsa("[data-theme-toggle]");
      if (toggles.length) {
        toggles[0].click();
      } else {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem("sial-theme", nextTheme);
      }
      setThemeLabel(button);
    };

    const updateProfileSettingsNotice = (notice) => {
      if (!notice) return;
      notice.textContent = getProfileSettingsNoticeText();
    };

    const syncProfileSettingsLabels = (themeNode, notificationNode, notificationSwitchLabel) => {
      const { isDark, notificationsEnabled } = getProfileSettingsLabelState();
      if (themeNode) {
        themeNode.textContent = isDark ? "Oscuro" : "Claro";
      }
      if (notificationNode) {
        notificationNode.textContent = notificationsEnabled ? "Activadas" : "Desactivadas";
      }
      if (notificationSwitchLabel) {
        notificationSwitchLabel.textContent = notificationsEnabled ? "Activadas" : "Desactivadas";
      }
    };

    const normalizeProfileSessionDate = () => {
      return new Date().toLocaleString("es-CO", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    };

    const getProfileActionFocusables = () => {
      if (!dialogState.dialog) return [];
      return qsa("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", dialogState.dialog)
        .filter((node) => node instanceof HTMLElement && !node.disabled && node.tabIndex !== -1 && node.offsetParent !== null);
    };

    const closeProfileActionDialog = () => {
      if (!dialogState.backdrop || !dialogState.dialog) return;
      dialogState.carouselCleanup?.();
      dialogState.carouselCleanup = null;
      dialogState.backdrop.hidden = true;
      dialogState.dialog.hidden = true;
      const returnFocus = dialogState.lastFocusedActionControl;
      dialogState.lastFocusedActionControl = null;
      if (returnFocus instanceof HTMLElement && returnFocus.isConnected) {
        returnFocus.focus();
      }
    };

    const ensureProfileActionDialog = () => {
      if (dialogState.dialog) return;
      dialogState.backdrop = document.createElement("div");
      dialogState.backdrop.className = "confirm-backdrop";
      dialogState.backdrop.dataset.profileActionBackdrop = "true";
      dialogState.backdrop.hidden = true;

      dialogState.dialog = document.createElement("section");
      dialogState.dialog.className = "confirm-dialog profile-action-dialog";
      dialogState.dialog.dataset.profileActionDialog = "true";
      dialogState.dialog.hidden = true;
      dialogState.dialog.setAttribute("role", "dialog");
      dialogState.dialog.setAttribute("aria-modal", "true");
      dialogState.dialog.setAttribute("aria-labelledby", "profileActionTitle");
      dialogState.dialog.setAttribute("aria-describedby", "profileActionDescription");
      dialogState.dialog.innerHTML = `
        <div class="confirm-dialog-head">
          <div>
            <h2 id="profileActionTitle"></h2>
            <p id="profileActionDescription"></p>
          </div>
          <button class="icon-btn" type="button" data-profile-action-close aria-label="Cerrar">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        <div class="confirm-dialog-body">
          <div class="notice notice-info" id="profileActionNotice"></div>
          <div id="profileActionContent"></div>
        </div>
        <div class="confirm-dialog-actions">
          <button class="btn btn-secondary" type="button" data-profile-action-close>Cerrar</button>
        </div>
      `;

      document.body.appendChild(dialogState.backdrop);
      document.body.appendChild(dialogState.dialog);

      const closeButtons = qsa("[data-profile-action-close]", dialogState.dialog);
      closeButtons.forEach((button) => {
        button.addEventListener("click", closeProfileActionDialog);
      });
      dialogState.backdrop.addEventListener("click", closeProfileActionDialog);
      dialogState.dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeProfileActionDialog();
          return;
        }
        if (event.key === "Tab") {
          const focusables = getProfileActionFocusables();
          if (!focusables.length) {
            event.preventDefault();
            return;
          }
          const currentIndex = focusables.indexOf(document.activeElement);
          const direction = event.shiftKey ? -1 : 1;
          const nextIndex = currentIndex < 0 ? 0 : (currentIndex + direction + focusables.length) % focusables.length;
          focusables[nextIndex]?.focus();
          event.preventDefault();
        }
      });
    };

    const openProfileActionDialog = ({ title, description, contentHtml, action, showNotice = true }) => {
      ensureProfileActionDialog();
      dialogState.carouselCleanup?.();
      dialogState.carouselCleanup = null;
      dialogState.lastFocusedActionControl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const titleNode = qs("#profileActionTitle", dialogState.dialog);
      const descriptionNode = qs("#profileActionDescription", dialogState.dialog);
      const contentNode = qs("#profileActionContent", dialogState.dialog);
      const noticeNode = qs("#profileActionNotice", dialogState.dialog);
      if (!titleNode || !descriptionNode || !contentNode) return;

      dialogState.lastAction = action || "view";
      titleNode.textContent = title || "Accion de perfil";
      const safeDescription = String(description || "").trim();
      descriptionNode.textContent = safeDescription;
      descriptionNode.hidden = !safeDescription;
      contentNode.innerHTML = contentHtml || "";
      if (noticeNode) {
        noticeNode.hidden = !showNotice;
        if (showNotice) {
          updateProfileSettingsNotice(noticeNode);
        }
      }
      dialogState.dialog.dataset.profileActionType = dialogState.lastAction;
      dialogState.dialog.querySelector(".confirm-dialog-actions").style.display = "flex";

      dialogState.backdrop.hidden = false;
      dialogState.dialog.hidden = false;

      const firstAction = qsa("[data-profile-action-close], [data-profile-theme-toggle], [data-profile-notifications], [data-profile-logout], .confirm-dialog-actions button", dialogState.dialog)[0];
      firstAction?.focus();
    };

    const initProfileFarmCarousel = (farms) => {
      const root = qs("[data-profile-farm-carousel]", dialogState.dialog);
      const viewport = qs("[data-profile-farm-viewport]", root);
      const track = qs("[data-profile-farm-track]", root);
      const previousButton = qs("[data-profile-farm-previous]", root);
      const nextButton = qs("[data-profile-farm-next]", root);
      if (!root || !viewport || !track) return;

      const pageSize = viewport.clientWidth < 440 ? 1 : 3;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let currentIndex = 0;
      let timer = null;
      let resetTimer = null;

      const stopRotation = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
      };

      const moveTrack = (animate = true) => {
        const firstCard = qs(".profile-farm-card", track);
        if (!firstCard) return;
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
        track.classList.toggle("is-resetting", !animate);
        track.style.transform = `translateX(-${currentIndex * (firstCard.offsetWidth + gap)}px)`;
      };
      const moveTo = (nextIndex) => {
        window.clearTimeout(resetTimer);
        if (nextIndex < 0) {
          currentIndex = farms.length;
          moveTrack(false);
          window.requestAnimationFrame(() => {
            currentIndex = farms.length - 1;
            moveTrack(true);
          });
          return;
        }
        currentIndex = nextIndex;
        moveTrack(true);
        if (currentIndex >= farms.length) {
          resetTimer = window.setTimeout(() => {
            currentIndex = 0;
            moveTrack(false);
          }, 360);
        }
      };

      const startRotation = () => {
        stopRotation();
        if (reduceMotion || farms.length <= pageSize || dialogState.dialog?.hidden) return;
        timer = window.setInterval(() => moveTo(currentIndex + 1), 5000);
      };
      const showPrevious = () => {
        moveTo(currentIndex - 1);
        startRotation();
      };
      const showNext = () => {
        moveTo(currentIndex + 1);
        startRotation();
      };
      const handleKeydown = (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPrevious();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNext();
        }
      };
      const resumeAfterFocus = (event) => {
        if (!root.contains(event.relatedTarget)) startRotation();
      };

      previousButton?.addEventListener("click", showPrevious);
      nextButton?.addEventListener("click", showNext);
      root.addEventListener("keydown", handleKeydown);
      root.addEventListener("mouseenter", stopRotation);
      root.addEventListener("mouseleave", startRotation);
      root.addEventListener("focusin", stopRotation);
      root.addEventListener("focusout", resumeAfterFocus);
      previousButton?.toggleAttribute("hidden", farms.length <= pageSize);
      nextButton?.toggleAttribute("hidden", farms.length <= pageSize);
      moveTrack(false);
      startRotation();

      dialogState.carouselCleanup = () => {
        stopRotation();
        previousButton?.removeEventListener("click", showPrevious);
        nextButton?.removeEventListener("click", showNext);
        root.removeEventListener("keydown", handleKeydown);
        root.removeEventListener("mouseenter", stopRotation);
        root.removeEventListener("mouseleave", startRotation);
        root.removeEventListener("focusin", stopRotation);
        root.removeEventListener("focusout", resumeAfterFocus);
        window.clearTimeout(resetTimer);
      };
    };

    const openProfileView = (profile) => {
      const farms = profile.farms.map((farm) => farm.name);
      const memberships = profile.memberships.length
        ? profile.memberships.map((membership) => `
          <article class="profile-membership-item">
            <strong>${escapeHtml(membership.companyName || membership.company || "Empresa")}</strong>
            <span>${escapeHtml((membership.roles || []).map((role) => role.name || role).join(", ") || "Sin roles activos")}</span>
          </article>
        `).join("")
        : `<p class="profile-empty-copy">No hay relaciones adicionales para mostrar.</p>`;
      openProfileActionDialog({
        action: "view",
        title: "Mi perfil",
        description: "",
        showNotice: false,
        contentHtml: `
          <section class="profile-overview" aria-label="Identidad del usuario">
            <div class="profile-full-identity">
              <span class="avatar profile-action-avatar-xl" aria-hidden="true">${escapeHtml(profile.initials)}</span>
              <div class="profile-action-identity-content">
                <strong>${escapeHtml(profile.name)}</strong>
                <span>${escapeHtml(profile.role)}</span>
              </div>
              <span class="profile-session-chip">Sesión activa</span>
            </div>
          </section>
          <section class="profile-context-card" aria-labelledby="profileContextTitle">
            <div class="profile-section-heading">
              <div>
                <span class="detail-label">Contexto activo</span>
                <h3 id="profileContextTitle">${escapeHtml(profile.company)}</h3>
              </div>
              <span class="profile-scope-chip">${escapeHtml(profile.scope)}</span>
            </div>
            <div class="profile-context-role">
              <span>Rol actual</span>
              <strong>${escapeHtml(profile.role)}</strong>
            </div>
            <div class="profile-context-modules" aria-label="Módulos disponibles">
              ${renderProfileChips(profile.modules)}
            </div>
          </section>
          <div class="profile-detail-grid">
            <section class="profile-detail-section" aria-labelledby="profileFarmsTitle">
              <div class="profile-section-heading">
                <div>
                  <span class="detail-label">Alcance operativo</span>
                  <h3 id="profileFarmsTitle">Fincas asignadas</h3>
                </div>
                <span class="table-count">${farms.length}</span>
              </div>
              <div class="profile-chip-list" aria-label="Fincas asignadas">
                ${renderProfileChips(farms, "profile-farm-chip")}
              </div>
            </section>
            <section class="profile-detail-section" aria-labelledby="profileMembershipsTitle">
              <div class="profile-section-heading">
                <div>
                  <span class="detail-label">Accesos</span>
                  <h3 id="profileMembershipsTitle">Empresas y roles</h3>
                </div>
              </div>
              <div class="profile-membership-list">${memberships}</div>
            </section>
          </div>
          <section class="profile-contact-section" aria-label="Datos de contacto y sesión">
            <div class="profile-contact-grid">
              <div class="profile-contact-item">
                <span>Identificación</span>
                <strong>${escapeHtml(profile.document)}</strong>
              </div>
              <div class="profile-contact-item">
                <span>Teléfono</span>
                <strong>${escapeHtml(profile.phone)}</strong>
              </div>
              <div class="profile-contact-item">
                <span>Correo</span>
                <strong>${escapeHtml(profile.email)}</strong>
              </div>
              <div class="profile-contact-item">
                <span>Sesión</span>
                <strong>${escapeHtml(profile.lastLoginAt)}</strong>
              </div>
            </div>
          </section>
        `
      });
    };

    const openProfileSettings = () => {
      const { isDark, notificationsEnabled } = getProfileSettingsLabelState();
      openProfileActionDialog({
        action: "settings",
        title: "Preferencias de cuenta",
        description: "",
        showNotice: false,
        contentHtml: `
          <div class="detail-group profile-action-card">
            <div class="detail-label">Tema visual</div>
            <div class="profile-action-toggle-row">
              <div class="profile-action-inline-copy">
                <span class="muted">Tema en esta sesion</span>
                <strong data-profile-theme-state></strong>
              </div>
              <button class="btn btn-secondary profile-action-theme-btn" type="button" data-profile-theme-toggle></button>
            </div>
          </div>
          <div class="detail-group profile-action-card">
            <div class="detail-label">Canales de alerta</div>
            <div class="profile-action-toggle-row">
              <div class="profile-action-inline-copy">
                <span class="muted">Notificaciones de sistema</span>
                <strong data-profile-notification-state></strong>
              </div>
              <label class="profile-action-toggle-switch">
                <input type="checkbox" data-profile-notifications />
                <span class="profile-action-toggle-slider" aria-hidden="true"></span>
              </label>
            </div>
          </div>
          <div class="detail-group profile-action-card">
            <div class="detail-label">Acceso rapido</div>
            <button class="btn btn-danger profile-action-quick-btn" type="button" data-profile-logout>
              Cerrar sesion
            </button>
          </div>
        `
      });

      const themeButton = qs("[data-profile-theme-toggle]", dialogState.dialog);
      const notifications = qs("[data-profile-notifications]", dialogState.dialog);
      const notificationsLabel = qs("[data-profile-notification-state]", dialogState.dialog);
      const logoutButton = qs("[data-profile-logout]", dialogState.dialog);
      const themeStateLabel = qs("[data-profile-theme-state]", dialogState.dialog);
      const notificationsStateLabel = qs("[data-profile-notification-state]", dialogState.dialog);
      if (!themeButton || !notifications || !logoutButton) return;
      let isThemeDark = isDark;
      let isNotificationsEnabled = notificationsEnabled;
      setThemeLabel(themeButton);
      themeButton.textContent = isThemeDark ? "Cambiar a claro" : "Cambiar a oscuro";
      notifications.checked = isNotificationsEnabled;
      syncProfileSettingsLabels(themeStateLabel, notificationsStateLabel, notificationsLabel);
      if (!themeButton.dataset.profileActionBound) {
        themeButton.dataset.profileActionBound = "true";
        themeButton.addEventListener("click", () => {
          toggleProfileTheme(themeButton);
          isThemeDark = document.documentElement.dataset.theme === "dark";
          themeButton.textContent = isThemeDark ? "Cambiar a claro" : "Cambiar a oscuro";
          syncProfileSettingsLabels(themeStateLabel, notificationsStateLabel, notificationsLabel);
        });
      }
      if (!notifications.dataset.profileActionBound) {
        notifications.dataset.profileActionBound = "true";
        notifications.addEventListener("change", () => {
          isNotificationsEnabled = notifications.checked;
          localStorage.setItem("sial-notifications", String(isNotificationsEnabled));
          syncProfileSettingsLabels(themeStateLabel, notificationsStateLabel, notificationsLabel);
        });
      }
      if (!logoutButton.dataset.profileActionBound) {
        logoutButton.dataset.profileActionBound = "true";
        logoutButton.addEventListener("click", () => {
          closeProfileActionDialog();
          window.location.href = getLoginUrl();
        });
      }
    };
    avatars.forEach((avatar) => {
      const profile = getProfileData(avatar);
      const menu = document.createElement("div");
      menu.className = "profile-menu";
      menu.dataset.profileMenu = "true";
      menu.innerHTML = `
        <button class="profile-trigger" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Abrir menu de perfil">
          <span class="avatar" aria-hidden="true">${escapeHtml(profile.initials)}</span>
          <svg class="profile-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
        </button>
        <div class="profile-panel" role="menu" aria-label="Menu de perfil" hidden>
          <div class="profile-summary">
            <div class="profile-summary-identity">
              <span class="avatar" aria-hidden="true">${escapeHtml(profile.initials)}</span>
              <div>
                <strong class="profile-user">${escapeHtml(profile.name)}</strong>
                <span class="profile-role">${escapeHtml(profile.role)}</span>
              </div>
            </div>
            <div class="profile-summary-meta"><span>${escapeHtml(profile.company)}</span></div>
          </div>
          <div class="profile-context-preview">
            <span class="detail-label">Contexto activo</span>
            <strong>${escapeHtml(profile.role)}</strong>
            <span>${escapeHtml(profile.scope)}</span>
            <div class="profile-context-modules">
              ${renderProfileChips(profile.modules.slice(0, 3))}
            </div>
          </div>
          <div class="profile-menu-list">
            <button class="profile-menu-item" type="button" role="menuitem" data-profile-action="view">
              ${profileActionIcon("view")}
              <span>Ver mi perfil</span>
            </button>
            <button class="profile-menu-item" type="button" role="menuitem" data-profile-action="settings">
              ${profileActionIcon("settings")}
              <span>Preferencias</span>
            </button>
            <a class="profile-menu-item profile-menu-item-danger" role="menuitem" href="${escapeHtml(getLoginUrl())}" data-profile-action="logout">
              ${profileActionIcon("logout")}
              <span>Cerrar sesion</span>
            </a>
          </div>
        </div>
      `;
      avatar.dataset.profileReady = "true";
      avatar.replaceWith(menu);

      const trigger = qs(".profile-trigger", menu);
      const panel = qs(".profile-panel", menu);
      trigger?.addEventListener("click", (event) => {
        event.stopPropagation();
        setProfileMenuOpen(menu, !menu.classList.contains("is-open"));
      });
      trigger?.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowDown") return;
        event.preventDefault();
        setProfileMenuOpen(menu, true);
        focusProfileItem(panel);
      });
      panel?.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeProfileMenu(menu);
          trigger?.focus();
        }
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          focusProfileItem(panel, event.key === "ArrowDown" ? 1 : -1);
        }
      });
      panel?.addEventListener("click", (event) => {
        const actionControl = event.target?.closest?.("[data-profile-action]");
        if (!actionControl) return;
        const action = actionControl.dataset.profileAction;
        trigger?.dispatchEvent(new CustomEvent("sial:profile-action", {
          bubbles: true,
          detail: { action, profile }
        }));
        closeProfileMenu(menu);
        if (action === "logout") {
          event.preventDefault();
          window.location.href = actionControl.getAttribute("href") || getLoginUrl();
          return;
        }
        if (action === "view") {
          event.preventDefault();
          openProfileView(profile);
          return;
        }
        if (action === "settings") {
          event.preventDefault();
          openProfileSettings();
        }
      });
    });

    if (document.documentElement.dataset.profileMenuEvents === "true") return;
    document.documentElement.dataset.profileMenuEvents = "true";
    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-profile-menu]")) closeProfileMenus();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeProfileMenus();
    });
  }

  function ensureFavicon() {
    const href = getSharedAssetUrl("brand/isotipo-sial.svg");
    const iconLinks = qsa('link[rel~="icon"], link[rel="shortcut icon"]');
    let icon = iconLinks[0];
    if (!icon) {
      icon = document.createElement("link");
      document.head.appendChild(icon);
    }
    icon.setAttribute("rel", "icon");
    icon.setAttribute("type", "image/svg+xml");
    icon.setAttribute("href", href);
    iconLinks.slice(1).forEach((extraIcon) => extraIcon.remove());
  }

  /* === SIAL View Motion START (reversible block) ===
     Remove this function, its exports, and the DOMContentLoaded call at the end to disable page motion. */
  function initPageTransitions(config = {}) {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", () => initPageTransitions(config), { once: true });
      return;
    }
    const root = document.documentElement;
    if (root.dataset.viewMotionReady === "true") return;
    if (root.dataset.viewMotionDisabled === "true" || document.body.hasAttribute("data-view-motion-disabled")) return;
    root.dataset.viewMotionReady = "true";

    const reducedMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leaveDelay = Number(config.leaveDelay ?? 150);
    const overlayDelay = Number(config.overlayDelay ?? 320);
    let navigationTimer = null;
    let overlayTimer = null;

    function ensureMotionSurfaces() {
      if (!qs("[data-view-motion-bar]")) {
        const bar = document.createElement("div");
        bar.className = "view-motion-bar";
        bar.dataset.viewMotionBar = "true";
        bar.setAttribute("aria-hidden", "true");
        document.body.appendChild(bar);
      }
      if (!qs("[data-view-motion-overlay]")) {
        const overlay = document.createElement("div");
        overlay.className = "view-motion-overlay";
        overlay.dataset.viewMotionOverlay = "true";
        overlay.setAttribute("role", "status");
        overlay.setAttribute("aria-live", "polite");
        overlay.innerHTML = `
          <div class="view-motion-card">
            <span class="view-motion-brand" aria-hidden="true"></span>
            <span class="view-motion-text">Cargando vista</span>
            <span class="view-motion-track" aria-hidden="true"><span></span></span>
          </div>
        `;
        document.body.appendChild(overlay);
      }
    }

    function markMotionItems() {
      const selectors = [
        ".main .page > .page-header",
        ".main .page > .notice",
        ".main .page > .stats",
        ".main .page > .card",
        ".main .page > .catalog-section",
        ".main .page > .pattern-card",
        ".public-changelog-page > .changelog-hero",
        ".public-changelog-page > .release-filterbar",
        ".public-changelog-page > .release-list",
        ".error-page > .error-panel"
      ];
      qsa("[data-view-motion-item]").forEach((item) => {
        delete item.dataset.viewMotionItem;
        item.style.removeProperty("--view-motion-index");
      });
      qsa(selectors.join(",")).slice(0, 12).forEach((item, index) => {
        item.dataset.viewMotionItem = "true";
        item.style.setProperty("--view-motion-index", String(index));
      });
    }

    function enterView() {
      ensureMotionSurfaces();
      markMotionItems();
      if (reducedMotion()) {
        root.dataset.viewMotion = "ready";
        return;
      }
      root.dataset.viewMotion = "entering";
      window.setTimeout(() => {
        if (root.dataset.viewMotion === "entering") root.dataset.viewMotion = "ready";
      }, 760);
    }

    function resetMotion() {
      window.clearTimeout(navigationTimer);
      window.clearTimeout(overlayTimer);
      delete root.dataset.viewMotionOverlay;
      if (root.dataset.viewMotion === "leaving") root.dataset.viewMotion = "ready";
    }

    function shouldHandleLink(link, event) {
      if (!link || event.defaultPrevented || event.button !== 0) return false;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
      if (link.hasAttribute("download")) return false;
      if (link.target && link.target !== "_self") return false;
      if (link.dataset.viewMotion === "false") return false;
      const rawHref = link.getAttribute("href");
      if (!rawHref || rawHref.startsWith("#")) return false;
      if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;

      let url;
      try {
        url = new URL(rawHref, window.location.href);
      } catch {
        return false;
      }
      if (url.origin !== window.location.origin) return false;
      const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search;
      if (sameDocument && url.hash) return false;
      return url.href !== window.location.href;
    }

    function startTransition(targetHref) {
      if (reducedMotion()) {
        window.location.href = targetHref;
        return;
      }
      resetMotion();
      ensureMotionSurfaces();
      root.dataset.viewMotion = "leaving";
      overlayTimer = window.setTimeout(() => {
        root.dataset.viewMotionOverlay = "visible";
      }, overlayDelay);
      navigationTimer = window.setTimeout(() => {
        window.location.href = targetHref;
      }, leaveDelay);
    }

    document.addEventListener("click", (event) => {
      const link = event.target.closest?.("a[href]");
      if (!shouldHandleLink(link, event)) return;
      event.preventDefault();
      startTransition(link.href);
    });

    window.addEventListener("pagehide", resetMotion);
    window.addEventListener("pageshow", (event) => {
      resetMotion();
      if (event.persisted) enterView();
    });

    window.requestAnimationFrame(enterView);
  }
  /* === SIAL View Motion END (reversible block) === */

  function setFieldState(input, note, error, successText = "Dato validado.") {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function initDatePickers(config = {}) {
    const pickers = qsa(config.selector || "[data-sial-datepicker]").filter((picker) => picker.dataset.datepickerReady !== "true");
    if (!pickers.length) return;
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const weekdays = ["L", "M", "M", "J", "V", "S", "D"];
    const pad = (value) => String(value).padStart(2, "0");
    const toInputValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const toDisplayValue = (date) => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    const parseDate = (value) => {
      const parts = String(value || "").split("-").map(Number);
      if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
      const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };
    const sameDate = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    const sameMonth = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    const sameYear = (a, b) => a && b && a.getFullYear() === b.getFullYear();

    pickers.forEach((picker) => {
      picker.dataset.datepickerReady = "true";
      const trigger = qs("[data-date-trigger]", picker);
      const popover = qs("[data-date-popover]", picker);
      const input = qs("[data-date-input]", picker);
      const valueLabel = qs("[data-date-value]", picker);
      const monthButton = qs("[data-date-month]", picker);
      const yearButton = qs("[data-date-year]", picker);
      const weekdaysNode = qs("[data-date-weekdays]", picker);
      const grid = qs("[data-date-grid]", picker);
      const selectedFromMarkup = parseDate(input?.value || picker.dataset.value);
      let selectedDate = selectedFromMarkup;
      let viewDate = selectedDate ? new Date(selectedDate) : new Date();
      let mode = "day";

      function syncOpen(open) {
        picker.classList.toggle("is-open", open);
        trigger?.setAttribute("aria-expanded", String(open));
        if (popover) popover.hidden = !open;
      }

      function setSelected(date) {
        selectedDate = date ? new Date(date) : null;
        if (input) input.value = selectedDate ? toInputValue(selectedDate) : "";
        if (valueLabel) valueLabel.textContent = selectedDate ? toDisplayValue(selectedDate) : "Selecciona fecha";
      }

      function renderHeader() {
        const year = viewDate.getFullYear();
        if (mode === "year") {
          const first = year - (year % 12);
          if (monthButton) monthButton.textContent = "Anos";
          if (yearButton) yearButton.textContent = `${first} - ${first + 11}`;
          return;
        }
        if (monthButton) monthButton.textContent = mode === "month" ? "Meses" : monthNames[viewDate.getMonth()];
        if (yearButton) yearButton.textContent = String(year);
      }

      function renderDays() {
        if (!grid) return;
        const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const offset = (firstDay.getDay() + 6) % 7;
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1 - offset);
        const today = new Date();
        grid.dataset.mode = "day";
        weekdaysNode?.removeAttribute("hidden");
        grid.innerHTML = Array.from({ length: 42 }, (_, index) => {
          const date = new Date(start);
          date.setDate(start.getDate() + index);
          const outside = date.getMonth() !== viewDate.getMonth();
          const selected = sameDate(date, selectedDate);
          const current = sameDate(date, today);
          return `<button class="sial-date-cell ${outside ? "is-outside" : ""} ${selected ? "is-selected" : ""} ${current ? "is-today" : ""}" type="button" data-date-day="${toInputValue(date)}" aria-pressed="${selected ? "true" : "false"}">${date.getDate()}</button>`;
        }).join("");
      }

      function renderMonths() {
        if (!grid) return;
        grid.dataset.mode = "month";
        weekdaysNode?.setAttribute("hidden", "hidden");
        grid.innerHTML = monthShort.map((label, index) => {
          const date = new Date(viewDate.getFullYear(), index, 1);
          return `<button class="sial-date-cell ${sameMonth(date, selectedDate) ? "is-selected" : ""}" type="button" data-date-month-index="${index}">${label}</button>`;
        }).join("");
      }

      function renderYears() {
        if (!grid) return;
        const year = viewDate.getFullYear();
        const first = year - (year % 12);
        grid.dataset.mode = "year";
        weekdaysNode?.setAttribute("hidden", "hidden");
        grid.innerHTML = Array.from({ length: 12 }, (_, index) => {
          const date = new Date(first + index, 0, 1);
          return `<button class="sial-date-cell ${sameYear(date, selectedDate) ? "is-selected" : ""}" type="button" data-date-year-value="${date.getFullYear()}">${date.getFullYear()}</button>`;
        }).join("");
      }

      function render() {
        renderHeader();
        if (mode === "month") renderMonths();
        else if (mode === "year") renderYears();
        else renderDays();
      }

      weekdaysNode && (weekdaysNode.innerHTML = weekdays.map((day) => `<span>${day}</span>`).join(""));
      setSelected(selectedDate);
      syncOpen(picker.dataset.open === "true");
      render();

      trigger?.addEventListener("click", () => syncOpen(!picker.classList.contains("is-open")));
      monthButton?.addEventListener("click", () => { mode = mode === "month" ? "day" : "month"; render(); });
      yearButton?.addEventListener("click", () => { mode = mode === "year" ? "day" : "year"; render(); });
      qs("[data-date-prev]", picker)?.addEventListener("click", () => {
        if (mode === "year") viewDate.setFullYear(viewDate.getFullYear() - 12);
        else if (mode === "month") viewDate.setFullYear(viewDate.getFullYear() - 1);
        else viewDate.setMonth(viewDate.getMonth() - 1);
        render();
      });
      qs("[data-date-next]", picker)?.addEventListener("click", () => {
        if (mode === "year") viewDate.setFullYear(viewDate.getFullYear() + 12);
        else if (mode === "month") viewDate.setFullYear(viewDate.getFullYear() + 1);
        else viewDate.setMonth(viewDate.getMonth() + 1);
        render();
      });
      grid?.addEventListener("click", (event) => {
        const dayButton = event.target.closest("[data-date-day]");
        const monthItem = event.target.closest("[data-date-month-index]");
        const yearItem = event.target.closest("[data-date-year-value]");
        if (dayButton) {
          const date = parseDate(dayButton.dataset.dateDay);
          if (!date) return;
          viewDate = new Date(date);
          setSelected(date);
          render();
        } else if (monthItem) {
          viewDate.setMonth(Number(monthItem.dataset.dateMonthIndex || 0));
          mode = "day";
          render();
        } else if (yearItem) {
          viewDate.setFullYear(Number(yearItem.dataset.dateYearValue || viewDate.getFullYear()));
          mode = "month";
          render();
        }
      });
      qs("[data-date-clear]", picker)?.addEventListener("click", () => { setSelected(null); render(); });
      qs("[data-date-today]", picker)?.addEventListener("click", () => {
        const today = new Date();
        viewDate = new Date(today);
        mode = "day";
        setSelected(today);
        render();
      });
      qs("[data-date-apply]", picker)?.addEventListener("click", () => syncOpen(false));
    });

    document.addEventListener("click", (event) => {
      qsa(config.selector || "[data-sial-datepicker]").forEach((picker) => {
        if (!picker.contains(event.target)) {
          picker.classList.remove("is-open");
          qs("[data-date-trigger]", picker)?.setAttribute("aria-expanded", "false");
          const popover = qs("[data-date-popover]", picker);
          if (popover) popover.hidden = true;
        }
      });
    });
  }

  function initTableFilters(config) {
    const rows = qsa(config.rowSelector || "tbody tr");
    const search = qs(config.search);
    const status = qs(config.status);
    const context = qs(config.context);
    const empty = qs(config.empty);
    const count = qs(config.count);
    let page = 1;
    let pageSize = Number(config.pageSize) || 10;
    const pageSizeOptions = (config.pageSizeOptions || [10, 30, 50]).filter((option) => [10, 30, 50].includes(Number(option))).map(Number);
    let pagination = config.pagination ? qs(config.pagination) : null;

    if (config.pagination !== false && !pagination && rows[0]) {
      const tableWrap = rows[0].closest(".table-wrap");
      if (tableWrap) {
        pagination = document.createElement("div");
        pagination.className = "table-pagination";
        pagination.setAttribute("aria-label", config.paginationLabel || "Paginacion de registros");
        tableWrap.insertAdjacentElement("afterend", pagination);
      }
    }

    function pageButton(label, targetPage, disabled = false, active = false) {
      return `<button class="pagination-btn ${active ? "active" : ""}" type="button" data-page="${targetPage}" ${disabled ? "disabled" : ""} ${active ? 'aria-current="page"' : ""}>${escapeHtml(label)}</button>`;
    }

    function renderPagination(total) {
      if (!pagination) return;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      page = Math.min(Math.max(page, 1), totalPages);
      const start = total === 0 ? 0 : ((page - 1) * pageSize) + 1;
      const end = Math.min(page * pageSize, total);
      const currentOptions = pageSizeOptions.includes(pageSize) ? pageSizeOptions : [10, 30, 50];
      const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((item) => totalPages <= 5 || Math.abs(item - page) <= 2 || item === 1 || item === totalPages);
      const pages = visiblePages.reduce((items, item, index) => {
        if (index > 0 && item - visiblePages[index - 1] > 1) items.push('<span class="pagination-gap" aria-hidden="true">...</span>');
        items.push(pageButton(String(item), item, false, item === page));
        return items;
      }, []).join("");

      pagination.innerHTML = `
        <div class="pagination-summary" aria-live="polite">Mostrando ${start}-${end} de ${total} registros</div>
        <label class="pagination-size">
          <span>Registros por pagina</span>
          <select class="select" data-page-size aria-label="Registros por pagina">
            ${currentOptions.map((option) => `<option value="${option}" ${option === pageSize ? "selected" : ""}>${option}</option>`).join("")}
          </select>
        </label>
        <div class="pagination-pages" aria-label="Cambiar pagina">
          ${pageButton("Anterior", page - 1, page <= 1)}
          ${pages}
          ${pageButton("Siguiente", page + 1, page >= totalPages)}
        </div>
      `;
    }

    function filterRows() {
      const term = (search?.value || "").trim().toLowerCase();
      const state = status?.value || "all";
      const ctx = context?.value || "all";
      const filteredRows = rows.filter((row) => {
        const show = (!term || row.textContent.toLowerCase().includes(term)) &&
          (state === "all" || row.dataset.status === state) &&
          (ctx === "all" || row.dataset.context === ctx);
        row.dataset.filterMatch = show ? "true" : "false";
        return show;
      });
      const visible = filteredRows.length;
      const totalPages = Math.max(1, Math.ceil(visible / pageSize));
      page = Math.min(Math.max(page, 1), totalPages);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      rows.forEach((row) => {
        const filteredIndex = filteredRows.indexOf(row);
        const show = filteredIndex >= startIndex && filteredIndex < endIndex;
        row.classList.toggle("is-hidden", !show);
      });
      empty?.classList.toggle("show", visible === 0);
      if (count) {
        const start = visible === 0 ? 0 : startIndex + 1;
        const end = Math.min(endIndex, visible);
        count.textContent = `${start}-${end} de ${visible} registros`;
      }
      renderPagination(visible);
    }

    [search, status, context].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => {
        page = 1;
        filterRows();
      });
    });

    pagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page]");
      if (!button || button.disabled) return;
      page = Number(button.dataset.page) || 1;
      filterRows();
    });

    pagination?.addEventListener("change", (event) => {
      const selector = event.target.closest("[data-page-size]");
      if (!selector) return;
      pageSize = Number(selector.value) || 10;
      page = 1;
      filterRows();
    });
    document.addEventListener("sial:table-state-change", () => {
      page = 1;
      filterRows();
    });
    filterRows();
  }

  function cleanExportText(node) {
    return String(node?.textContent || "").replace(/\s+/g, " ").trim();
  }

  function csvCell(value) {
    const text = String(value || "");
    return /[",;\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  function exportFileName(value) {
    return normalize(value || "sial-export")
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "sial-export";
  }

  function exportableColumns(table) {
    const headers = qsa("thead th", table);
    if (!headers.length) {
      const cells = qsa("tbody tr:first-child td, tbody tr:first-child th", table);
      return cells.map((_, index) => index);
    }
    return headers
      .map((header, index) => ({ header: cleanExportText(header).toLowerCase(), index }))
      .filter((item) => item.header !== "acciones")
      .map((item) => item.index);
  }

  function rowsForExport(table) {
    const rows = qsa("tbody tr", table);
    const hasFilterState = rows.some((row) => row.dataset.filterMatch !== undefined);
    return rows.filter((row) => {
      if (row.classList.contains("empty-state")) return false;
      if (hasFilterState) return row.dataset.filterMatch === "true";
      return !row.classList.contains("is-hidden");
    });
  }

  function exportTableTitle(table) {
    const monthTitle = table.closest(".month-card")?.querySelector(".month-title");
    const cardTitle = table.closest(".card")?.querySelector(".card-title");
    return cleanExportText(monthTitle || cardTitle);
  }

  function tablesForExport(button) {
    const targetSelector = button.dataset.exportTarget;
    const target = targetSelector ? qs(targetSelector) : (button.closest(".card") || document);
    if (target?.matches?.("table")) return [target];
    const tables = target ? qsa("table", target) : [];
    if (tables.length) return tables;
    const fallback = qs("table");
    return fallback ? [fallback] : [];
  }

  function buildTableCsv(tables) {
    const lines = [];
    tables.forEach((table, tableIndex) => {
      const columns = exportableColumns(table);
      const headers = qsa("thead th", table);
      const title = exportTableTitle(table);
      if (tables.length > 1 && title) lines.push(csvCell(title));
      if (headers.length) lines.push(columns.map((index) => csvCell(cleanExportText(headers[index]))).join(";"));
      rowsForExport(table).forEach((row) => {
        const cells = qsa("td, th", row);
        lines.push(columns.map((index) => csvCell(cleanExportText(cells[index]))).join(";"));
      });
      if (tableIndex < tables.length - 1) lines.push("");
    });
    return `\uFEFF${lines.join("\n")}`;
  }

  function downloadCsv(filename, content) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName(filename)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function initTableExport(config = {}) {
    const buttons = qsa(config.selector || "[data-export-table]").filter((button) => button.dataset.exportReady !== "true");
    buttons.forEach((button) => {
      button.dataset.exportReady = "true";
      button.addEventListener("click", () => {
        const tables = tablesForExport(button);
        if (!tables.length) return;
        const fallbackName = cleanExportText(button.closest(".card")?.querySelector(".card-title")) || document.title || "sial-export";
        downloadCsv(button.dataset.exportFilename || fallbackName, buildTableCsv(tables));
      });
    });
  }

  function initDrawer() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;

    const close = () => {
      drawer.classList.remove("show");
      backdrop.classList.remove("show");
      drawer.setAttribute("aria-hidden", "true");
    };

    qsa("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = event.target.closest("tr");
        if (!row) return;
        qsa("[data-detail-target]").forEach((node) => {
          node.textContent = row.dataset[node.dataset.detailTarget] || "-";
        });
        const audit = qs("#detailAudit");
        if (audit) {
          audit.innerHTML = (row.dataset.audit || "").split(";").filter(Boolean).map((item) => {
            const [title, meta] = item.split("|");
            return `<div class="audit-item"><strong>${title || "-"}</strong><div class="muted">${meta || ""}</div></div>`;
          }).join("");
        }
        drawer.classList.add("show");
        backdrop.classList.add("show");
        drawer.setAttribute("aria-hidden", "false");
        qs("#closeDetail")?.focus();
      });
    });

    qs("#closeDetail")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initStateActionConfirm(config = {}) {
    const selector = config.selector || 'tbody button[aria-label^="Inactivar"], tbody button[aria-label^="Activar"]';
    const buttons = qsa(selector).filter((button) => button.dataset.stateConfirmReady !== "true");
    if (!buttons.length) return;

    const inactiveIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>';
    const activeIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';
    let pending = null;
    let lastTrigger = null;

    let backdrop = qs("[data-state-confirm-backdrop]");
    let dialog = qs("[data-state-confirm-dialog]");
    if (!backdrop || !dialog) {
      backdrop = document.createElement("div");
      backdrop.className = "confirm-backdrop";
      backdrop.dataset.stateConfirmBackdrop = "true";
      backdrop.hidden = true;
      dialog = document.createElement("section");
      dialog.className = "confirm-dialog";
      dialog.dataset.stateConfirmDialog = "true";
      dialog.hidden = true;
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", "stateConfirmTitle");
      dialog.setAttribute("aria-describedby", "stateConfirmDescription");
      dialog.innerHTML = `
        <div class="confirm-dialog-head">
          <div>
            <h2 id="stateConfirmTitle">Confirmar accion</h2>
            <p id="stateConfirmDescription">Esta accion modifica la disponibilidad del registro y conserva auditoria.</p>
          </div>
          <button class="icon-btn" type="button" data-state-confirm-close aria-label="Cerrar confirmacion">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        <div class="confirm-dialog-body">
          <div class="confirm-summary">
            <span>Registro</span>
            <strong data-state-confirm-record>-</strong>
          </div>
          <div class="notice notice-warning" data-state-confirm-notice>
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16h.01"></path></svg>
            <span data-state-confirm-message>-</span>
          </div>
          <div class="notice notice-info">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 15l3-4 3 2 5-7"></path></svg>
            <span>La accion quedara registrada con usuario, fecha y hora dentro de la auditoria visual del prototipo.</span>
          </div>
        </div>
        <div class="confirm-dialog-actions">
          <button class="btn btn-secondary" type="button" data-state-confirm-cancel>Cancelar</button>
          <button class="btn btn-danger" type="button" data-state-confirm-accept>Inactivar registro</button>
        </div>
      `;
      document.body.append(backdrop, dialog);
    }

    const title = qs("#stateConfirmTitle", dialog);
    const description = qs("#stateConfirmDescription", dialog);
    const record = qs("[data-state-confirm-record]", dialog);
    const message = qs("[data-state-confirm-message]", dialog);
    const notice = qs("[data-state-confirm-notice]", dialog);
    const accept = qs("[data-state-confirm-accept]", dialog);

    function getButtonAction(button) {
      const label = button.getAttribute("aria-label") || "";
      if (/^Inactivar\b/i.test(label)) return "inactive";
      if (/^Activar\b/i.test(label)) return "active";
      return button.dataset.stateAction === "active" ? "active" : "inactive";
    }

    function getEntityLabel(button) {
      const label = button.getAttribute("aria-label") || "registro";
      return label.replace(/^(Inactivar|Activar)\s+/i, "").trim() || "registro";
    }

    function syncButton(button, action, entityLabel) {
      const nextAction = action === "active" ? "inactive" : "active";
      const nextLabel = nextAction === "active" ? "Activar" : "Inactivar";
      button.dataset.stateAction = nextAction;
      button.setAttribute("aria-label", `${nextLabel} ${entityLabel}`);
      button.setAttribute("title", `${nextLabel} ${entityLabel}`);
      button.innerHTML = nextAction === "active" ? activeIcon : inactiveIcon;
    }

    function closeDialog() {
      pending = null;
      backdrop.hidden = true;
      dialog.hidden = true;
      lastTrigger?.focus();
    }

    function openDialog(button) {
      const row = button.closest("tr");
      if (!row) return;
      const action = getButtonAction(button);
      const entityLabel = getEntityLabel(button);
      const recordLabel = [row.dataset.code, row.dataset.name].filter(Boolean).join(" - ") || row.cells[0]?.textContent?.trim() || "Registro seleccionado";
      pending = { action, button, entityLabel, row };
      lastTrigger = button;

      const isActivation = action === "active";
      title.textContent = isActivation ? "Confirmar activacion" : "Confirmar inactivacion";
      description.textContent = isActivation ? "El registro volvera a quedar disponible segun las reglas del modulo." : "El registro no se elimina; solo cambia su disponibilidad operativa.";
      record.textContent = recordLabel;
      message.textContent = isActivation
        ? "El registro quedara activo y podra usarse nuevamente en nuevas operaciones si cumple las reglas funcionales."
        : "El registro quedara inactivo y no estara disponible para nuevas operaciones. Podra reactivarse si el usuario cuenta con permisos.";
      notice.classList.toggle("notice-warning", !isActivation);
      notice.classList.toggle("notice-success", isActivation);
      accept.textContent = isActivation ? "Activar registro" : "Inactivar registro";
      accept.classList.toggle("btn-primary", isActivation);
      accept.classList.toggle("btn-danger", !isActivation);
      backdrop.hidden = false;
      dialog.hidden = false;
      accept.focus();
    }

    function updateVisibleAudit(row, auditAction, timestamp, button) {
      const actionCell = button.closest("td");
      if (!actionCell) return;
      const cells = Array.from(row.children);
      const auditCell = cells[cells.indexOf(actionCell) - 1];
      if (!auditCell?.classList.contains("muted")) return;
      auditCell.innerHTML = `${escapeHtml(auditAction)} - prototipo.ui<br />${escapeHtml(timestamp)}`;
    }

    function applyStateAction() {
      if (!pending) return;
      const { action, button, entityLabel, row } = pending;
      const isActivation = action === "active";
      const nextStatus = isActivation ? "active" : "inactive";
      const nextState = isActivation ? "Activo" : "Inactivo";
      const auditAction = isActivation ? "Activar" : "Inactivar";
      const timestamp = new Date().toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      row.dataset.status = nextStatus;
      row.dataset.state = nextState;
      row.dataset.audit = `${auditAction}|prototipo.ui - ${timestamp}${row.dataset.audit ? `;${row.dataset.audit}` : ""}`;

      const status = qs(".status", row);
      if (status) {
        status.classList.remove("status-active", "status-warning", "status-inactive");
        status.classList.add(isActivation ? "status-active" : "status-inactive");
        status.textContent = nextState;
      }

      updateVisibleAudit(row, auditAction, timestamp, button);
      syncButton(button, action, entityLabel);
      row.classList.add("state-updated");
      setTimeout(() => row.classList.remove("state-updated"), 1400);
      document.dispatchEvent(new CustomEvent("sial:table-state-change", { detail: { row, status: nextStatus } }));
      closeDialog();
    }

    buttons.forEach((button) => {
      button.dataset.stateConfirmReady = "true";
      button.dataset.stateAction = getButtonAction(button);
      button.setAttribute("title", button.getAttribute("aria-label") || "Cambiar estado");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openDialog(button);
      });
    });

    qsa("[data-state-confirm-close], [data-state-confirm-cancel]", dialog).forEach((button) => {
      if (button.dataset.stateConfirmCloseReady === "true") return;
      button.dataset.stateConfirmCloseReady = "true";
      button.addEventListener("click", closeDialog);
    });
    if (backdrop.dataset.stateConfirmCloseReady !== "true") {
      backdrop.dataset.stateConfirmCloseReady = "true";
      backdrop.addEventListener("click", closeDialog);
    }
    if (accept.dataset.stateConfirmAcceptReady !== "true") {
      accept.dataset.stateConfirmAcceptReady = "true";
      accept.addEventListener("click", applyStateAction);
    }
    if (document.documentElement.dataset.stateConfirmEscapeReady !== "true") {
      document.documentElement.dataset.stateConfirmEscapeReady = "true";
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !dialog.hidden) closeDialog();
      });
    }
  }

  function initEmbeddedForm(config = {}) {
    const panel = qs(config.panel || "[data-inline-form-panel]");
    const openButton = qs(config.openButton || "[data-open-inline-form]");
    const cancelButton = qs(config.cancelButton || "[data-cancel-inline-form]");
    const title = qs(config.title || "[data-inline-form-title]");
    const form = panel?.querySelector("form");
    if (!panel || !openButton) return;

    const open = (mode = "new") => {
      panel.classList.remove("is-hidden");
      openButton.setAttribute("aria-expanded", "true");
      if (title) title.textContent = mode === "edit" ? config.editTitle || "Editar registro" : config.newTitle || "Nuevo registro";
      panel.querySelector("input:not([readonly]), select, textarea")?.focus();
    };

    const close = () => {
      panel.classList.add("is-hidden");
      openButton.setAttribute("aria-expanded", "false");
      form?.reset();
      openButton.focus();
    };

    openButton.addEventListener("click", () => open("new"));
    cancelButton?.addEventListener("click", close);
    qsa(config.editButtons || "[data-edit-inline]").forEach((button) => {
      button.addEventListener("click", () => open("edit"));
    });
  }

  function initReleaseChangelog(config = {}) {
    const releases = Array.isArray(config.releases) ? config.releases : [];
    const list = qs(config.list || "#releaseList");
    const search = qs(config.search || "#releaseSearch");
    const moduleFilter = qs(config.moduleFilter || "#moduleFilter");
    const typeFilter = qs(config.typeFilter || "#typeFilter");
    const empty = qs(config.empty || "#releaseEmpty");
    const count = qs(config.count || "#releaseCount");
    const copyButton = config.copyButton ? qs(config.copyButton) : null;
    const cardClass = config.cardClass || "public-release-card";
    const typeLabels = { ...defaultTypeLabels, ...(config.typeLabels || {}) };
    const countLabel = config.countLabel || "versiones visibles";
    const copyText = config.copyText || "Copiar enlace";
    if (!list) return;

    function releaseTemplate(release) {
      const changes = (release.changes || []).map((change) => `<li>${escapeHtml(change)}</li>`).join("");
      const searchValue = normalize(`${release.version} ${release.title} ${release.moduleLabel} ${release.summary} ${(release.changes || []).join(" ")}`);
      return `
        <article class="release-card ${cardClass}" id="${escapeHtml(release.id)}" data-module="${escapeHtml(release.module)}" data-type="${escapeHtml(release.type)}" data-search="${escapeHtml(searchValue)}">
          <div class="release-date">
            <span>${escapeHtml(release.date)}</span>
            <strong>${escapeHtml(release.version)}</strong>
          </div>
          <div class="release-content">
            <div class="release-head">
              <div>
                <p class="section-kicker">${escapeHtml(release.moduleLabel)}</p>
                <h2>${escapeHtml(release.title)}</h2>
              </div>
              <span class="tag tag-success">${escapeHtml(typeLabels[release.type] || release.type)}</span>
            </div>
            <p>${escapeHtml(release.summary)}</p>
            <ul>${changes}</ul>
          </div>
        </article>
      `;
    }

    function applyFilters() {
      const term = normalize(search?.value);
      const module = moduleFilter?.value || "all";
      const type = typeFilter?.value || "all";
      let visible = 0;

      qsa(".release-card", list).forEach((card) => {
        const show = (!term || card.dataset.search.includes(term)) &&
          (module === "all" || card.dataset.module === module) &&
          (type === "all" || card.dataset.type === type);
        card.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });

      empty?.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} ${countLabel}`;
    }

    list.innerHTML = releases.map(releaseTemplate).join("");
    [search, moduleFilter, typeFilter].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", applyFilters);
    });

    copyButton?.addEventListener("click", async () => {
      const url = window.location.href.split("#")[0];
      try {
        await navigator.clipboard.writeText(url);
        copyButton.textContent = "Enlace copiado";
      } catch {
        copyButton.textContent = "Copia no disponible";
      }
      setTimeout(() => {
        copyButton.textContent = copyText;
      }, 1800);
    });

    initThemeToggle();
    applyFilters();
  }

  return {
    qs,
    qsa,
    escapeHtml,
    normalize,
    getSharedAssetUrl,
    ensureFavicon,
    initThemeToggle,
    initPageTransitions,
    initSidebarToggle,
    initNavigation,
    initShell,
    initProfileMenu,
    navigationRegistry,
    setFieldState,
    initDatePickers,
    initTableFilters,
    initTableExport,
    initDrawer,
    initStateActionConfirm,
    initEmbeddedForm,
    initReleaseChangelog
  };
})();

window.SIALCore = SIALCore;

SIALCore.ensureFavicon();

/* === SIAL View Motion START (reversible hook) === */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    SIALCore.initPageTransitions();
    SIALCore.initProfileMenu();
  }, { once: true });
} else {
  SIALCore.initPageTransitions();
  SIALCore.initProfileMenu();
}
/* === SIAL View Motion END (reversible hook) === */


