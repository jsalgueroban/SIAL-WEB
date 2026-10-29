const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  const rolesByCompany = {
    "SIAL Central": [
      ["admin-general", "Administrador general", "Acceso administrativo completo."],
      ["seguridad", "Seguridad y roles", "Gestiona usuarios, roles y permisos."],
      ["auditoria", "Consulta auditoria", "Consulta trazabilidad y eventos."]
    ],
    Banapalma: [
      ["supervisor-campo", "Supervisor campo", "Gestiona operacion regional."],
      ["gestor-documental", "Gestor documental", "Consulta y actualiza soportes."],
      ["consulta", "Consulta operativa", "Acceso de lectura operacional."]
    ],
    AgroCeiba: [
      ["consulta-historica", "Consulta historica", "Acceso limitado a informacion historica."]
    ]
  };

  const permissionActions = [
    ["consultar", "Consultar"],
    ["crear", "Crear"],
    ["editar", "Editar"],
    ["inactivar", "Inactivar"],
    ["exportar", "Exportar"]
  ];

  const permissionModules = [
    {
      id: "usuarios",
      label: "Usuarios",
      description: "Altas, consulta, edicion y control de acceso de usuarios.",
      permissions: [
        ["gestion-usuarios", "Gestion de usuarios", "Listado, detalle y estados de usuarios."],
        ["registro-usuario", "Registro de usuario", "Creacion de usuarios y asignacion empresa + roles."],
        ["editar-usuario", "Editar usuario", "Actualizacion de datos base y asignaciones."],
        ["permisos-rol", "Administracion de permisos", "Matriz de permisos asociada a roles."]
      ]
    },
    {
      id: "empresa",
      label: "Empresa",
      description: "Empresas, roles por empresa y tipos asociados.",
      permissions: [
        ["gestion-empresas", "Gestion de empresas", "Consulta y mantenimiento de empresas."],
        ["roles-empresa", "Roles por empresas", "Roles habilitados para una empresa."],
        ["creacion-roles", "Creacion de roles", "Alta y edicion de roles base."],
        ["tipos-empresa", "Tipos de empresas", "Catalogo de clasificacion de empresas."],
        ["empresa-tipo", "Empresa + tipo", "Relacion entre empresa y tipo."]
      ]
    },
    {
      id: "fincas",
      label: "Fincas",
      description: "Estructura productiva: fincas, sectores y grupos.",
      permissions: [
        ["gestion-fincas", "Gestion de fincas", "Maestra de fincas disponibles."],
        ["gestion-sectores", "Gestion de sectores", "Sectores asociados a fincas."],
        ["gestion-grupos", "Gestion de grupos", "Grupos de operacion productiva."]
      ]
    },
    {
      id: "transporte",
      label: "Transporte",
      description: "Conductores, vehiculos, licencias y control documental.",
      permissions: [
        ["conductores", "Gestion de conductores", "Maestra y detalle de conductores."],
        ["licencias", "Gestion de licencias", "Categorias y relacion conductor + licencia."],
        ["vehiculos", "Gestion de vehiculos", "Flota, estado y datos operativos."],
        ["tipos-vehiculo", "Tipos de vehiculos", "Catalogo de tipos de vehiculo."],
        ["control-documental", "Control documental", "Seguimiento SOAT, tecnomecanica y soportes."]
      ]
    },
    {
      id: "planeacion",
      label: "Planeacion",
      description: "Cintas, calendario y monitoreo de programacion.",
      permissions: [
        ["gestion-cintas", "Gestion de cintas", "Configuracion de cintas y colores."],
        ["monitoreo-calendario", "Monitoreo calendario", "Consulta de semanas y eventos."],
        ["aviso-corte", "Aviso de corte", "Registro y control de avisos."]
      ]
    },
    {
      id: "referencias",
      label: "Referencias",
      description: "Referencias, clases y productos de catalogo.",
      permissions: [
        ["gestion-referencias", "Gestion de referencias", "Maestra de referencias."],
        ["clases-referencias", "Clases de referencias", "Clasificacion de referencias."],
        ["productos", "Productos", "Catalogo de productos asociados."]
      ]
    },
    {
      id: "puerto",
      label: "Puerto",
      description: "Contenedores, etapas, puertos y operaciones.",
      permissions: [
        ["contenedores", "Gestion de contenedores", "Control de contenedores."],
        ["tipos-contenedor", "Tipos de contenedor", "Catalogo de tipos."],
        ["etapas", "Etapas", "Etapas del flujo portuario."],
        ["puertos", "Puertos", "Catalogo de puertos."]
      ]
    },
    {
      id: "trazabilidad",
      label: "Trazabilidad",
      description: "Eventos, inspecciones y auditoria del flujo logistico.",
      permissions: [
        ["tipos-inspeccion", "Tipos de inspeccion", "Catalogo para inspecciones."],
        ["eventos-trazabilidad", "Eventos de trazabilidad", "Eventos operativos del flujo."],
        ["consulta-auditoria", "Consulta de auditoria", "Lectura de eventos y cambios."]
      ]
    }
  ];

  const permissionKey = (moduleId, permissionId, actionId) => `${moduleId}:${permissionId}:${actionId}`;
  const allPermissionKeys = () => permissionModules.flatMap((module) =>
    module.permissions.flatMap(([permissionId]) =>
      permissionActions.map(([actionId]) => permissionKey(module.id, permissionId, actionId))
    )
  );
  const permissionsForModules = (moduleIds, actions = ["consultar"]) => permissionModules
    .filter((module) => moduleIds.includes(module.id))
    .flatMap((module) => module.permissions.flatMap(([permissionId]) =>
      actions.map((actionId) => permissionKey(module.id, permissionId, actionId))
    ));

  const permissionRoles = [
    {
      id: "admin-general",
      name: "ADMINISTRADOR GENERAL",
      company: "SIAL Central",
      status: "active",
      statusLabel: "Activo",
      users: 8,
      updatedBy: "seguridad.sial",
      updatedAt: "22/04/2026 09:20",
      description: "Acceso administrativo transversal para operacion y parametrizacion completa.",
      permissions: allPermissionKeys(),
      audit: [
        ["Actualizacion de permisos", "seguridad.sial - 22/04/2026 09:20"],
        ["Alta del rol", "admin.sial - 18/04/2026 08:45"]
      ]
    },
    {
      id: "seguridad-roles",
      name: "SEGURIDAD Y ROLES",
      company: "SIAL Central",
      status: "active",
      statusLabel: "Activo",
      users: 3,
      updatedBy: "seguridad.sial",
      updatedAt: "25/04/2026 14:12",
      description: "Gestiona usuarios, roles y permisos sin intervenir operacion productiva.",
      permissions: [
        ...permissionsForModules(["usuarios", "empresa"], ["consultar", "crear", "editar", "inactivar", "exportar"]),
        ...permissionsForModules(["trazabilidad"], ["consultar", "exportar"])
      ],
      audit: [
        ["Revision de alcance", "seguridad.sial - 25/04/2026 14:12"],
        ["Permisos de auditoria agregados", "auditor.master - 21/04/2026 10:30"]
      ]
    },
    {
      id: "supervisor-campo",
      name: "SUPERVISOR CAMPO",
      company: "Banapalma",
      status: "warning",
      statusLabel: "Revision",
      users: 14,
      updatedBy: "admin.empresas",
      updatedAt: "20/04/2026 11:04",
      description: "Supervision regional con control operativo limitado a finca, planeacion y consulta logistica.",
      permissions: [
        ...permissionsForModules(["fincas", "planeacion"], ["consultar", "crear", "editar", "exportar"]),
        ...permissionsForModules(["transporte", "referencias"], ["consultar", "exportar"])
      ],
      audit: [
        ["Pendiente validacion de inactivacion", "admin.empresas - 20/04/2026 11:04"],
        ["Alta regional", "operacion.regional - 19/04/2026 16:05"]
      ]
    },
    {
      id: "gestor-documental",
      name: "GESTOR DOCUMENTAL",
      company: "Banapalma",
      status: "active",
      statusLabel: "Activo",
      users: 6,
      updatedBy: "documental.sial",
      updatedAt: "24/04/2026 08:35",
      description: "Consulta y actualiza soportes documentales de transporte y empresas asociadas.",
      permissions: [
        ...permissionsForModules(["transporte"], ["consultar", "editar", "exportar"]),
        permissionKey("empresa", "gestion-empresas", "consultar"),
        permissionKey("empresa", "empresa-tipo", "consultar"),
        ...permissionsForModules(["trazabilidad"], ["consultar"])
      ],
      audit: [
        ["Permisos documentales ajustados", "documental.sial - 24/04/2026 08:35"],
        ["Consulta empresa habilitada", "seguridad.sial - 22/04/2026 15:18"]
      ]
    },
    {
      id: "consulta-auditoria",
      name: "CONSULTA AUDITORIA",
      company: "SIAL Central",
      status: "inactive",
      statusLabel: "Inactivo",
      users: 2,
      updatedBy: "auditor.master",
      updatedAt: "18/04/2026 08:55",
      description: "Rol de solo lectura para revision historica y auditoria.",
      permissions: [
        ...permissionsForModules(["usuarios", "empresa", "fincas", "transporte", "planeacion", "referencias", "puerto", "trazabilidad"], ["consultar", "exportar"])
      ],
      audit: [
        ["Rol inactivado para nuevas asignaciones", "auditor.master - 18/04/2026 08:55"],
        ["Permisos de solo lectura confirmados", "seguridad.sial - 16/04/2026 12:00"]
      ]
    }
  ];

  function applyShell(activeKey) {
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: "usuarios", view: activeKey || "usuarios" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["usuarios", "gestion-usuarios.html", "Gestion de usuarios"],
      ["registro", "registro-usuario.html", "Registro de usuario"],
      ["edicion", "editar-usuario.html", "Editar usuario"],
      ["permisosRol", "gestion-permisos-rol.html", "Permisos por rol"]
    ];
    nav.innerHTML = items.map(([key, href, label]) =>
      `<a class="nav-link ${key === activeKey ? "active" : ""}" href="${href}"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>${label}</span></a>`
    ).join("");
  }

  function initThemeToggle() {
    const toggle = qs("[data-theme-toggle]");
    if (!toggle || toggle.dataset.themeReady === "true") return;
    toggle.dataset.themeReady = "true";
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

  function setFieldState(input, note, error, successText = "Dato validado.") {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function initTableFilters(config) {
    if (window.SIALCore?.initTableFilters) {
      window.SIALCore.initTableFilters(config);
      return;
    }
    const rows = qsa(config.rowSelector || "tbody tr");
    const search = qs(config.search);
    const status = qs(config.status);
    const context = qs(config.context);
    const empty = qs(config.empty);
    const count = qs(config.count);
    function filterRows() {
      const term = (search?.value || "").trim().toLowerCase();
      const state = status?.value || "all";
      const ctx = context?.value || "all";
      let visible = 0;
      rows.forEach((row) => {
        const show = (!term || row.textContent.toLowerCase().includes(term)) &&
          (state === "all" || row.dataset.status === state) &&
          (ctx === "all" || row.dataset.context === ctx);
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      empty?.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} registros visibles`;
    }
    [search, status, context].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    filterRows();
  }

  function initDrawer() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;
    const close = () => {
      drawer.classList.remove("show");
      backdrop.classList.remove("show");
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
        qs("#closeDetail")?.focus();
      });
    });
    qs("#closeDetail")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") close();
    });
  }

  function initBasicFormValidation(formSelector = "[data-user-form]") {
    const form = qs(formSelector);
    if (!form) return;
    qsa("[data-uppercase]", form).forEach((input) => {
      input.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const empty = !String(input.value || "").trim();
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "");
        if (empty) fail = true;
      });
      qsa("[type='email']", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          setFieldState(input, note, "Debe tener formato de correo valido.", "");
          fail = true;
        }
      });
      const password = qs("#password", form);
      const confirm = qs("#confirmPassword", form);
      if (password && confirm && password.value !== confirm.value) {
        setFieldState(confirm, qs("#confirmPasswordNote"), "Debe coincidir exactamente con la contrasena.", "");
        fail = true;
      }
      const assignments = qsa("[data-assignment-company]").length;
      const assignmentNote = qs("#assignmentNote");
      if (assignmentNote) {
        assignmentNote.classList.toggle("error", assignments < 1);
        assignmentNote.classList.toggle("success", assignments >= 1);
        assignmentNote.textContent = assignments < 1 ? "Agrega al menos una relacion empresa + roles antes de guardar." : "Relaciones empresa + roles listas para guardar.";
        if (assignments < 1) fail = true;
      }
      qs("#formOk")?.classList.toggle("is-hidden", fail);
    });
  }

  function initUserRoleAssignment() {
    const companySelect = qs("#company");
    const roleGrid = qs("#roleDraftGrid");
    const rolesNote = qs("#rolesNote");
    const companyNote = qs("#companyNote");
    const assignmentList = qs("#assignmentList");
    const addButton = qs("#addAssignment");
    let assignments = [];
    let editingCompany = "";

    const renderRoleDraft = (company, selected = []) => {
      if (!roleGrid) return;
      const roles = rolesByCompany[company] || [];
      if (!company || !roles.length) {
        roleGrid.innerHTML = `<div class="empty-state show">Selecciona una empresa activa para cargar roles disponibles.</div>`;
        return;
      }
      roleGrid.innerHTML = roles.map(([value, label, description]) => `
        <label class="role-option">
          <input type="checkbox" value="${value}" ${selected.includes(value) ? "checked" : ""}>
          <span><strong>${label}</strong><span>${description}</span></span>
        </label>
      `).join("");
    };

    const selectedRoles = () => qsa("input[type='checkbox']:checked", roleGrid).map((input) => input.value);
    const roleLabel = (company, roleValue) => (rolesByCompany[company] || []).find(([value]) => value === roleValue)?.[1] || roleValue;

    const renderAssignments = () => {
      if (!assignmentList) return;
      if (!assignments.length) {
        assignmentList.innerHTML = `<div class="empty-state show">Aun no hay relaciones empresa + roles agregadas.</div>`;
        return;
      }
      assignmentList.innerHTML = assignments.map((item) => `
        <div class="assignment-item" data-assignment-company="${item.company}">
          <div>
            <strong>${item.company}</strong>
            <div class="muted">${item.roles.map((role) => roleLabel(item.company, role)).join(", ")}</div>
          </div>
          <div class="assignment-actions">
            <button class="btn btn-secondary" type="button" data-edit-company="${item.company}">Editar</button>
            <button class="btn btn-secondary" type="button" data-remove-company="${item.company}">Quitar</button>
          </div>
        </div>
      `).join("");
      qsa("[data-edit-company]", assignmentList).forEach((button) => {
        button.addEventListener("click", () => {
          const company = button.dataset.editCompany;
          const current = assignments.find((item) => item.company === company);
          editingCompany = company;
          companySelect.value = company;
          renderRoleDraft(company, current?.roles || []);
          setFieldState(companySelect, companyNote, "", "Empresa cargada para editar roles.");
        });
      });
      qsa("[data-remove-company]", assignmentList).forEach((button) => {
        button.addEventListener("click", () => {
          assignments = assignments.filter((item) => item.company !== button.dataset.removeCompany);
          renderAssignments();
        });
      });
    };

    companySelect?.addEventListener("change", () => {
      const company = companySelect.value;
      const current = assignments.find((item) => item.company === company);
      editingCompany = current ? company : "";
      renderRoleDraft(company, current?.roles || []);
      setFieldState(companySelect, companyNote, company ? "" : "Selecciona una empresa.", company ? "Empresa lista para cargar roles." : "");
      if (rolesNote) rolesNote.textContent = "Selecciona uno o mas roles y agrega la asignacion.";
    });

    addButton?.addEventListener("click", () => {
      const company = companySelect.value;
      const roles = selectedRoles();
      if (!company) {
        setFieldState(companySelect, companyNote, "Selecciona una empresa antes de agregar la asignacion.", "");
        return;
      }
      if (!roles.length) {
        rolesNote?.classList.add("error");
        if (rolesNote) rolesNote.textContent = "Selecciona al menos un rol para la empresa actual.";
        return;
      }
      const index = assignments.findIndex((item) => item.company === company);
      const payload = { company, roles };
      if (index >= 0) assignments[index] = payload;
      else assignments.push(payload);
      editingCompany = "";
      companySelect.value = "";
      renderRoleDraft("");
      renderAssignments();
      rolesNote?.classList.remove("error");
      rolesNote?.classList.add("success");
      if (rolesNote) rolesNote.textContent = "Asignacion agregada al resumen inferior.";
    });

    renderRoleDraft("");
    renderAssignments();
  }

  function initPermissionGrid() {
    const saveButton = qs("#savePerms");
    const resetButton = qs("#resetPermissions");
    const roleSelect = qs("#permissionRoleSelect");
    const matrix = qs("#permissionMatrix");
    const matrixSearch = qs("#permissionSearch");
    const moduleFilter = qs("#permissionModuleFilter");
    const empty = qs("#permissionEmpty");
    if (!saveButton || !roleSelect || !matrix) return;

    const permissionsKey = "sial-proposal-role-permissions-v1";
    const persistenceStatus = qs("#permissionPersistenceStatus");
    let storageAvailable = true;
    try {
      const stored = JSON.parse(localStorage.getItem(permissionsKey) || "{}");
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) throw new Error();
      permissionRoles.forEach(role => {
        if (stored[role.id] && Array.isArray(stored[role.id].permissions)) Object.assign(role, stored[role.id]);
      });
    } catch {
      storageAvailable = false;
      if (persistenceStatus) persistenceStatus.textContent = "No se pudieron leer los permisos guardados en este navegador.";
    }

    const requestedRole = new URLSearchParams(location.search).get("rol");
    let activeRoleId = permissionRoles.some(role => role.id === requestedRole) ? requestedRole : (permissionRoles[0]?.id || "");
    let originalPermissions = new Set(permissionRoles.find(role => role.id === activeRoleId)?.permissions || []);
    let workingPermissions = new Set(originalPermissions);

    const currentRole = () => permissionRoles.find((role) => role.id === activeRoleId) || permissionRoles[0];
    const activePermissionCount = () => workingPermissions.size;
    const getChanges = () => {
      const added = Array.from(workingPermissions).filter((item) => !originalPermissions.has(item));
      const removed = Array.from(originalPermissions).filter((item) => !workingPermissions.has(item));
      return { added, removed, total: added.length + removed.length };
    };

    const setSetValue = (key, enabled) => {
      if (enabled) workingPermissions.add(key);
      else workingPermissions.delete(key);
    };

    const setModulePermissions = (moduleId, mode) => {
      const module = permissionModules.find((item) => item.id === moduleId);
      if (!module) return;
      module.permissions.forEach(([permissionId]) => {
        permissionActions.forEach(([actionId]) => {
          const key = permissionKey(moduleId, permissionId, actionId);
          const enabled = mode === "all" || (mode === "consultar" && actionId === "consultar");
          setSetValue(key, enabled);
        });
      });
      renderAll(false);
    };

    function renderModuleOptions() {
      if (!moduleFilter || moduleFilter.dataset.ready === "true") return;
      moduleFilter.dataset.ready = "true";
      moduleFilter.innerHTML = `<option value="all">Todos los modulos</option>${permissionModules.map((module) =>
        `<option value="${escapeHtml(module.id)}">${escapeHtml(module.label)}</option>`
      ).join("")}`;
    }

    function renderRoleList() {
      if (roleSelect.dataset.ready !== "true") {
        roleSelect.innerHTML = permissionRoles.map((role) =>
          `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}</option>`
        ).join("");
        roleSelect.dataset.ready = "true";
      }
      roleSelect.value = activeRoleId;
    }

    function renderSummary() {
      const role = currentRole();
      if (!role) return;
      const selectedRole = qs("#selectedPermissionRole");
      const selectedMeta = qs("#selectedPermissionMeta");
      if (selectedRole) selectedRole.textContent = role.name;
      if (selectedMeta) {
        selectedMeta.textContent = `${role.company} - ${role.users} usuario${role.users === 1 ? "" : "s"} - ${role.statusLabel} - ${activePermissionCount()} permisos activos`;
      }
      const assignments = qs("#viewRoleAssignments");
      if (assignments) assignments.href = `roles-asignaciones.html?empresa=${encodeURIComponent(role.company)}&rol=${encodeURIComponent(role.name)}`;
    }

    function renderChanges() {
      const changes = getChanges();
      const chip = qs("#permissionStateChip");
      if (chip) chip.textContent = changes.total ? `${changes.total} cambios pendientes` : "Sin cambios";
      saveButton.disabled = changes.total === 0;
      resetButton.disabled = changes.total === 0;
    }

    function renderMatrix() {
      const moduleValue = moduleFilter?.value || "all";
      const term = String(matrixSearch?.value || "").trim().toLowerCase();
      let visibleModules = 0;
      matrix.innerHTML = permissionModules.map((module) => {
        if (moduleValue !== "all" && module.id !== moduleValue) return "";
        const rows = module.permissions.filter(([, label, description]) => {
          const text = `${module.label} ${label} ${description}`.toLowerCase();
          return !term || text.includes(term);
        });
        if (!rows.length) return "";
        visibleModules += 1;
        return `
          <section class="permission-module" data-permission-module="${escapeHtml(module.id)}">
            <div class="permission-module-head">
              <div>
                <h3>${escapeHtml(module.label)}</h3>
                <p>${escapeHtml(module.description)}</p>
              </div>
              <div class="permission-module-actions">
                <button class="btn btn-secondary" type="button" data-module-action="consultar" data-module-id="${escapeHtml(module.id)}">Solo consulta</button>
                <button class="btn btn-secondary" type="button" data-module-action="all" data-module-id="${escapeHtml(module.id)}">Marcar todo</button>
                <button class="btn btn-secondary" type="button" data-module-action="none" data-module-id="${escapeHtml(module.id)}">Limpiar</button>
              </div>
            </div>
            <div class="table-wrap">
              <table class="permission-table">
                <thead>
                  <tr>
                    <th>Permiso</th>
                    ${permissionActions.map(([, label]) => `<th>${escapeHtml(label)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map(([permissionId, label, description]) => `
                    <tr>
                      <td class="permission-row-label"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(description)}</span></td>
                      ${permissionActions.map(([actionId, actionLabel]) => {
                        const key = permissionKey(module.id, permissionId, actionId);
                        return `<td class="permission-cell"><input class="permission-toggle" type="checkbox" data-permission-key="${escapeHtml(key)}" aria-label="${escapeHtml(`${actionLabel} - ${label}`)}" ${workingPermissions.has(key) ? "checked" : ""}></td>`;
                      }).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      }).join("");
      empty?.classList.toggle("is-hidden", visibleModules > 0);
    }

    function renderAll(renderRoleFilters = true) {
      renderModuleOptions();
      if (renderRoleFilters) renderRoleList();
      renderSummary();
      renderMatrix();
      renderChanges();
    }

    roleSelect.addEventListener("change", () => {
      activeRoleId = roleSelect.value;
      const role = currentRole();
      originalPermissions = new Set(role.permissions || []);
      workingPermissions = new Set(originalPermissions);
      renderAll();
    });

    matrix.addEventListener("change", (event) => {
      const input = event.target.closest("[data-permission-key]");
      if (!input) return;
      setSetValue(input.dataset.permissionKey, input.checked);
      renderSummary();
      renderChanges();
    });

    matrix.addEventListener("click", (event) => {
      const button = event.target.closest("[data-module-action]");
      if (!button) return;
      setModulePermissions(button.dataset.moduleId, button.dataset.moduleAction);
    });

    [matrixSearch, moduleFilter].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", renderMatrix);
    });

    resetButton?.addEventListener("click", () => {
      workingPermissions = new Set(originalPermissions);
      renderAll(false);
    });

    saveButton.addEventListener("click", () => {
      const role = currentRole();
      const changes = getChanges();
      if (!role || changes.total === 0) return;
      if (!storageAvailable) { if (persistenceStatus) persistenceStatus.textContent = "No se pueden guardar los cambios mientras el almacenamiento local no esté disponible."; return; }
      const previous = {permissions: role.permissions, updatedBy: role.updatedBy, updatedAt: role.updatedAt, audit: role.audit};
      role.permissions = Array.from(workingPermissions);
      role.updatedBy = "prototipo.ui";
      role.updatedAt = new Date().toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      role.audit = [
        [`${changes.total} cambio${changes.total === 1 ? "" : "s"} de permisos guardado${changes.total === 1 ? "" : "s"}`, `${role.updatedBy} - ${role.updatedAt}`],
        ...role.audit
      ].slice(0, 4);
      try {
        const all = JSON.parse(localStorage.getItem(permissionsKey) || "{}");
        if (!all || typeof all !== "object" || Array.isArray(all)) throw new Error();
        all[role.id] = {permissions:role.permissions, updatedBy:role.updatedBy, updatedAt:role.updatedAt, audit:role.audit};
        localStorage.setItem(permissionsKey, JSON.stringify(all));
        if (persistenceStatus) persistenceStatus.textContent = "Permisos guardados en este navegador; el sistema real no se modificó.";
      } catch {
        Object.assign(role, previous);
        if (persistenceStatus) persistenceStatus.textContent = "No se pudieron guardar los permisos en este navegador.";
        return;
      }
      originalPermissions = new Set(role.permissions);
      workingPermissions = new Set(originalPermissions);
      renderAll();
      saveButton.textContent = "Guardado";
      window.setTimeout(() => {
        saveButton.textContent = "Guardar";
      }, 1600);
    });

    renderAll();
  }

  return { applyShell, initTableFilters, initDrawer, initBasicFormValidation, initUserRoleAssignment, initPermissionGrid };
})();
