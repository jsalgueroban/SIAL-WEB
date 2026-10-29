const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const companyTypes = [
    ["transportadora", "Transportadora", "Opera flota, conductores o servicios logisticos."],
    ["productor", "Productor", "Asocia fincas, grupos o informacion productiva."],
    ["exportador", "Exportador", "Participa en procesos comerciales y de despacho."],
    ["cliente", "Cliente", "Recibe servicios o informacion administrativa."]
  ];

  function applyShell(activeKey) {
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: "empresas", view: activeKey || "empresas" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["empresas", "gestion-empresas.html", "Gestion de empresas"],
      ["roles", "roles-empresa.html", "Roles por empresas"],
      ["paramRoles", "parametrizacion-roles.html", "Creacion de roles"],
      ["tiposEmpresa", "../Gestion%20de%20Transporte/gestion-tipos-empresa.html", "Tipos de empresas"],
      ["empresaTipo", "../Gestion%20de%20Transporte/relacion-empresa-tipo.html", "Empresa + tipo"],
      ["clientes", "gestion-clientes.html", "Clientes"],
      ["contactos", "gestion-contactos.html", "Contactos"],
      ["alertasContactos", "gestion-notificaciones-contactos.html", "Alertas por contacto"],
      ["dependencias", "gestion-dependencias.html", "Dependencias"]
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
    const initialTheme = storedTheme || (systemDark ? "dark" : "light");

    const setTheme = (theme) => {
      const normalizedTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = normalizedTheme;
      localStorage.setItem("sial-theme", normalizedTheme);
      const isDark = normalizedTheme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
      toggle.setAttribute("title", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    };

    setTheme(initialTheme);
    toggle.addEventListener("click", () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
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
          audit.replaceChildren();
          (row.dataset.audit || "").split(";").filter(Boolean).forEach((item) => {
            const [title, meta] = item.split("|");
            const entry = document.createElement("div");
            const heading = document.createElement("strong");
            const detail = document.createElement("div");
            entry.className = "audit-item"; detail.className = "muted";
            heading.textContent = title || "-"; detail.textContent = meta || "";
            entry.append(heading, detail); audit.append(entry);
          });
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

  function initBasicFormValidation(formSelector = "[data-company-form]") {
    const form = qs(formSelector);
    if (!form) return;
    const result = qs("#formOk");
    const hideResult = () => result?.classList.add("is-hidden");
    form.addEventListener("input", hideResult);
    form.addEventListener("change", hideResult);
    form.addEventListener("click", (event) => {
      if (event.target.closest("#addCompanyTypeAssignment, [data-remove-company-type]")) hideResult();
    });
    form.addEventListener("reset", () => {
      hideResult();
      qsa("[data-required], [data-nit]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        input.classList.remove("is-error");
        input.removeAttribute("aria-invalid");
        if (note) {
          note.classList.remove("error", "success");
          if (note.dataset.base) note.textContent = note.dataset.base;
        }
      });
    });
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
      qsa("[data-nit]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (input.value && !/^[0-9]{6,12}-?[0-9]?$/.test(input.value)) {
          setFieldState(input, note, "El NIT debe tener formato numerico valido.", "");
          fail = true;
        }
        if (input.value && window.CompanyPrototype?.isDuplicate(input.value)) {
          setFieldState(input, note, "Ya existe una empresa con este NIT.", "");
          fail = true;
        }
      });
      const companyTypeNote = qs("#companyTypeAssignmentNote", form);
      if (companyTypeNote) {
        const assignments = qsa("[data-company-type-assignment]", form).length;
        companyTypeNote.classList.toggle("error", assignments < 1);
        companyTypeNote.classList.toggle("success", assignments >= 1);
        companyTypeNote.textContent = assignments < 1 ? "Agrega al menos un tipo de empresa antes de guardar." : "Tipos de empresa listos para guardar.";
        if (assignments < 1) fail = true;
      }
      if (!fail && window.CompanyPrototype && !window.CompanyPrototype.save(form)) fail = true;
      result?.classList.toggle("is-hidden", fail);
    });
  }

  function initCompanyTypeAssignment() {
    const form = qs("[data-company-form]");
    const typeGrid = qs("#companyTypeDraftGrid");
    const typeNote = qs("#companyTypeNote");
    const assignmentNote = qs("#companyTypeAssignmentNote");
    const assignmentList = qs("#companyTypeAssignmentList");
    const addButton = qs("#addCompanyTypeAssignment");
    if (!form || !typeGrid || !assignmentList) return;

    let assignments = window.CompanyPrototype?.current()?.types?.slice() || [];

    const typeLabel = (value) => companyTypes.find(([typeValue]) => typeValue === value)?.[1] || value;
    const selectedTypes = () => qsa("input[type='checkbox']:checked", typeGrid).map((input) => input.value);

    const renderDraft = () => {
      typeGrid.innerHTML = companyTypes.map(([value, label, description]) => `
        <label class="role-option">
          <input type="checkbox" value="${value}">
          <span><strong>${label}</strong><span>${description}</span></span>
        </label>
      `).join("");
    };

    const renderAssignments = () => {
      if (!assignments.length) {
        assignmentList.innerHTML = `<div class="empty-state show">Aun no hay tipos de empresa asignados.</div>`;
        assignmentNote?.classList.remove("success");
        if (assignmentNote) assignmentNote.textContent = "Agrega al menos un tipo de empresa antes de guardar.";
        return;
      }
      assignmentList.innerHTML = assignments.map((value) => `
        <div class="assignment-item" data-company-type-assignment="${value}">
          <input type="hidden" name="companyTypes[]" value="${value}">
          <div>
            <strong>${typeLabel(value)}</strong>
            <div class="muted">Tipo de empresa agregado al registro.</div>
          </div>
          <div class="assignment-actions">
            <button class="btn btn-secondary" type="button" data-remove-company-type="${value}">Quitar</button>
          </div>
        </div>
      `).join("");
      assignmentNote?.classList.remove("error");
      assignmentNote?.classList.add("success");
      if (assignmentNote) assignmentNote.textContent = `${assignments.length} tipo${assignments.length === 1 ? "" : "s"} de empresa asignado${assignments.length === 1 ? "" : "s"}.`;
      qsa("[data-remove-company-type]", assignmentList).forEach((button) => {
        button.addEventListener("click", () => {
          assignments = assignments.filter((value) => value !== button.dataset.removeCompanyType);
          renderAssignments();
        });
      });
    };

    addButton?.addEventListener("click", () => {
      const selected = selectedTypes();
      if (!selected.length) {
        typeNote?.classList.add("error");
        if (typeNote) typeNote.textContent = "Selecciona al menos un tipo para agregarlo.";
        return;
      }
      assignments = Array.from(new Set([...assignments, ...selected]));
      qsa("input[type='checkbox']", typeGrid).forEach((input) => { input.checked = false; });
      typeNote?.classList.remove("error");
      typeNote?.classList.add("success");
      if (typeNote) typeNote.textContent = "Tipos agregados al resumen inferior.";
      renderAssignments();
    });

    form.addEventListener("reset", () => {
      assignments = [];
      window.setTimeout(() => {
        renderDraft();
        renderAssignments();
        typeNote?.classList.remove("error", "success");
        if (typeNote) typeNote.textContent = "Selecciona uno o mas tipos y agregalos a la asignacion.";
        assignmentNote?.classList.remove("error", "success");
        if (assignmentNote) assignmentNote.textContent = "Agrega al menos un tipo de empresa antes de guardar.";
      }, 0);
    });

    renderDraft();
    renderAssignments();
  }

  function initCompanyRoleTransfer() {
    const included = qs("#rolesIncluded");
    const excluded = qs("#rolesExcluded");
    const save = qs("#saveRoles");
    const note = qs("#rolesTransferNote");
    if (!included || !excluded) return;
    const company = qs("#companyRole");
    const key = "sial-proposal-company-roles-v1";
    const options = [...qsa(".role-option", included), ...qsa(".role-option", excluded)];
    const initial = qsa(".role-option", included).map(option => qs("strong", option).textContent.trim());
    function loadAssignments() {
      try { const value = JSON.parse(localStorage.getItem(key) || "{}"); if (!value || Array.isArray(value) || typeof value !== "object") throw new Error(); return value; }
      catch { if (note) { note.textContent = "No se pudieron leer las asignaciones guardadas."; note.classList.add("error"); } save.disabled = true; return null; }
    }
    function loadCompany() {
      const data = loadAssignments(); if (!data) return;
      const assigned = data[company.value]?.roles || (company.selectedIndex === 0 ? initial : []);
      options.forEach(option => { const label = qs("strong", option).textContent.trim(); (assigned.includes(label) ? included : excluded).appendChild(option); qs("input", option).checked = false; });
      save.disabled = true;
      note.classList.remove("error", "success");
      note.textContent = "Sin cambios pendientes.";
    }
    company?.addEventListener("change", loadCompany);
    const move = (from, to) => {
      qsa("input:checked", from).forEach((input) => {
        const option = input.closest(".role-option");
        input.checked = false;
        to.appendChild(option);
      });
      if (note) {
        note.classList.remove("error");
        note.classList.add("success");
        note.textContent = "Cambios pendientes por guardar.";
      }
      save?.removeAttribute("disabled");
    };
    qs("#includeRole")?.addEventListener("click", () => move(excluded, included));
    qs("#excludeRole")?.addEventListener("click", () => move(included, excluded));
    save?.addEventListener("click", () => {
      try {
        const companies = JSON.parse(localStorage.getItem("sial-proposal-companies-v1") || "null");
        const record = Array.isArray(companies) ? companies.find(item => item.name.toLocaleLowerCase("es") === company.value.toLocaleLowerCase("es")) : null;
        if ((record ? record.status : company.value === "AgroCeiba" ? "inactive" : "active") === "inactive") {
          note.classList.add("error"); note.textContent = "La empresa está inactiva; no se pueden guardar nuevas asignaciones."; return;
        }
      } catch { note.classList.add("error"); note.textContent = "No se pudo comprobar el estado de la empresa."; return; }
      const total = qsa(".role-option", included).length;
      if (total < 1) {
        note?.classList.add("error");
        if (note) note.textContent = "Debe seleccionar al menos un rol para la empresa.";
        return;
      }
      const data = loadAssignments();
      if (!data) return;
      try {
        const roles = qsa(".role-option strong", included).map(option => option.textContent.trim());
        const previous = data[company.value]?.audit || [];
        data[company.value] = { roles, audit: [{ action: "Asignación de roles", actor: "Propuesta local", date: new Date().toISOString() }, ...previous] };
        localStorage.setItem(key, JSON.stringify(data));
      } catch {
        note.classList.add("error"); note.textContent = "No se pudieron guardar los roles en este navegador."; return;
      }
      note?.classList.remove("error");
      note?.classList.add("success");
      if (note) note.textContent = "Roles guardados en este navegador; no se actualizó el sistema real.";
      save.setAttribute("disabled", "disabled");
    });
    loadCompany();
  }

  function initRoleAdminPanel() {
    const form = qs("[data-role-admin-form]");
    const inlinePanel = qs("#roleInlineForm");
    const openButton = qs("#newRoleMode");
    const cancelButton = qs("#cancelRoleMode");
    const formTitle = qs("#roleFormTitle");
    const rows = qsa("[data-role-row]");
    const search = qs("#roleAdminSearch");
    const status = qs("#roleAdminStatus");
    const empty = qs("#roleAdminEmpty");
    const count = qs("#roleAdminCount");
    const permissionNote = qs("#permissionSummaryNote");
    const roleSummaryText = qs("#roleSummaryText");
    const roleName = qs("#roleName");
    const roleScope = qs("#roleScope");
    const roleRisk = qs("#roleRisk");
    const roleCompanyAssignment = qs("#roleCompanyAssignment");
    const roleDescription = qs("#roleDescription");
    const formOk = qs("#formOk");
    const checkboxes = qsa("[data-permission-check]", form || document);
    if (!form) return;

    const companyLabel = () => roleCompanyAssignment?.selectedOptions?.[0]?.textContent || "";
    let currentMode = "new";

    const selectedPermissions = () => qsa("[data-permission-check]:checked", form).map((input) => input.value);

    const updateSummary = () => {
      const total = selectedPermissions().length;
      if (permissionNote) {
        permissionNote.classList.toggle("error", total === 0);
        permissionNote.classList.toggle("success", total > 0);
        permissionNote.textContent = total === 0 ? "Selecciona al menos un permiso." : `${total} permiso${total === 1 ? "" : "s"} seleccionado${total === 1 ? "" : "s"}.`;
      }
      if (roleSummaryText) {
        const role = roleName?.value?.trim() || "Nuevo rol";
        const company = roleCompanyAssignment?.value ? companyLabel() : "empresa pendiente";
        roleSummaryText.textContent = `${role} para ${company} - ${total} permiso${total === 1 ? "" : "s"}`;
      }
      return total;
    };

    const clearNotes = () => {
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (!note) return;
        if (note.dataset.base) note.textContent = note.dataset.base;
        note.classList.remove("error", "success");
        input.classList.remove("is-error");
        input.setAttribute("aria-invalid", "false");
      });
      if (permissionNote) {
        permissionNote.classList.remove("error", "success");
      }
    };

    const openPanel = () => {
      inlinePanel?.classList.remove("is-hidden");
      formTitle.textContent = currentMode === "new" ? "Nuevo rol" : "Editar rol";
      window.setTimeout(() => roleName?.focus(), 0);
    };

    const closePanel = () => {
      inlinePanel?.classList.add("is-hidden");
      clearNotes();
      formOk?.classList.add("is-hidden");
      currentMode = "new";
      form?.reset();
    };

    const setMode = (mode) => {
      currentMode = mode;
      form.dataset.roleMode = mode;
      form.setAttribute("data-role-mode", mode);
      const isEdit = mode === "edit";
      const code = form.dataset.roleCode;
      if (roleSummaryText) {
        roleSummaryText.textContent = `${isEdit && code ? code : "Nuevo rol"} listo para actualizar.`;
      }
      openPanel();
    };

    const fillFormFromRow = (row) => {
      if (!row) return;
      const allowedPermissions = new Set((row.dataset.permissions || "").split("|").map((item) => item.trim()).filter(Boolean));
      checkboxes.forEach((input) => {
        input.checked = allowedPermissions.has(input.value);
      });
      if (roleName) roleName.value = row.dataset.roleName || "";
      if (roleScope) roleScope.value = row.dataset.roleType || "";
      if (roleRisk) roleRisk.value = row.dataset.roleRisk || "Baja";
      if (roleCompanyAssignment) roleCompanyAssignment.value = row.dataset.companyCode || "";
      if (roleDescription) roleDescription.value = row.dataset.summary || "";
      form.dataset.roleCode = row.dataset.roleCode || "";
      setMode("edit");
      if (roleSummaryText) {
        roleSummaryText.textContent = `${row.dataset.roleName || "Rol"} para ${row.dataset.companyName || "empresa"} - ${allowedPermissions.size} permiso${allowedPermissions.size === 1 ? "" : "s"}.`;
      }
      updateSummary();
    };

    const setNewMode = () => {
      form.dataset.roleCode = "";
      form.reset();
      checkboxes.forEach((input) => {
        input.checked = false;
      });
      setMode("new");
      clearNotes();
      if (permissionNote) permissionNote.textContent = "Selecciona al menos un permiso para guardar.";
      if (roleSummaryText) roleSummaryText.textContent = "Nuevo rol para SIAL Central - 0 permisos";
      if (formOk) formOk.classList.add("is-hidden");
      updateSummary();
    };

    const filterRows = () => {
      const term = String(search?.value || "").trim().toLowerCase();
      const selectedStatus = status?.value || "all";
      let visible = 0;
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const statusMatch = selectedStatus === "all" || row.dataset.status === selectedStatus;
        const searchMatch = !term || text.includes(term);
        const show = statusMatch && searchMatch;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      empty?.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} rol${visible === 1 ? "" : "es"} visibles`;
    };

    const validate = () => {
      let fail = false;
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const empty = !String(input.value || "").trim();
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "");
        if (empty) fail = true;
      });
      const permissionTotal = updateSummary();
      if (permissionTotal === 0) {
        permissionNote?.classList.add("error");
        fail = true;
      }
      if (!fail) {
        formOk?.classList.remove("is-hidden");
      } else {
        formOk?.classList.add("is-hidden");
      }
      return !fail;
    };

    rows.forEach((row) => {
      const editButton = row.querySelector("[data-edit-inline]");
      if (!editButton) return;
      editButton.addEventListener("click", (event) => {
        event.preventDefault();
        fillFormFromRow(row);
      });
    });

    [search, status].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    [roleName, roleScope, roleRisk, roleDescription, roleCompanyAssignment].filter(Boolean).forEach((control) => {
      control.addEventListener("input", updateSummary);
      control.addEventListener("change", updateSummary);
    });
    checkboxes.forEach((input) => input.addEventListener("change", updateSummary));
    openButton?.addEventListener("click", setNewMode);
    cancelButton?.addEventListener("click", closePanel);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) return;
      if (formOk) {
        formOk.classList.remove("is-hidden");
        if (currentMode === "edit" && form.dataset.roleCode) {
          formOk.textContent = `Rol ${form.dataset.roleCode} actualizado (vista previa de alta).`;
        } else {
          formOk.textContent = "Rol y asignacion listos para guardar.";
        }
      }
      updateSummary();
    });
    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        closePanel();
      }, 0);
    });

    filterRows();
    setNewMode();
  }

  const initRolePermissionMatrix = initRoleAdminPanel;

  function initGenericForm(formSelector = "[data-generic-form]") {
    const form = qs(formSelector);
    if (!form) return;
    const ok = qs("#formOk");
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
      qsa("[data-unique-list]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const values = input.dataset.uniqueList.split("|").map((v) => v.trim().toUpperCase());
        const duplicate = input.value && values.includes(input.value.trim().toUpperCase());
        if (duplicate) { setFieldState(input, note, "El valor ya existe en la tabla maestra.", ""); fail = true; }
      });
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) {
        ok.classList.remove("is-hidden", "notice-error");
        ok.classList.add("notice-success");
        ok.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg><span>Datos revisados en la propuesta; todavía no se guardan.</span>';
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
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

  function initContactForm() {
    const form = qs("#contactForm");
    if (!form) return;
    const ok = qs("#formOk");
    qsa("[data-uppercase]", form).forEach((input) => {
      input.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); });
    });
    const fields = [
      ["idType", "Selecciona el tipo de identificacion.", v => Boolean(v)],
      ["idNumber", "El numero de identificacion es obligatorio.", v => v.trim().length >= 5],
      ["firstName", "Los nombres son obligatorios.", v => v.trim().length >= 2],
      ["lastName", "Los apellidos son obligatorios.", v => v.trim().length >= 2],
      ["position", "Selecciona el cargo.", v => Boolean(v)],
      ["companyFarm", "Selecciona la empresa o finca asociada.", v => Boolean(v)],
      ["email", "Ingresa un correo electronico valido.", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())],
      ["phone", "El telefono principal es obligatorio.", v => v.trim().length >= 7],
      ["dependency", "Selecciona la dependencia.", v => Boolean(v)]
    ];
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      fields.forEach(([id, message, rule]) => {
        const input = qs(`#${id}`);
        const note = qs(`#${id}Note`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input?.value || "") ? "" : message;
        setFieldState(input, note, error);
        if (error) fail = true;
      });
      if (!fail && window.ContactPrototype && !window.ContactPrototype.save()) fail = true;
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) {
        ok.classList.remove("is-hidden", "notice-error");
        ok.classList.add("notice-success");
        ok.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg><span>Datos revisados en la propuesta; el contacto todavía no se guarda.</span>';
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
    form.addEventListener("reset", () => {
      setTimeout(() => {
        qsa(".is-error", form).forEach((node) => node.classList.remove("is-error"));
        qsa(".field-note", form).forEach((note) => {
          note.classList.remove("error", "success");
          if (note.dataset.base) note.textContent = note.dataset.base;
        });
        ok?.classList.add("is-hidden");
      }, 0);
    });
  }

  return { applyShell, initTableFilters, initDrawer, initBasicFormValidation, initCompanyRoleTransfer, initCompanyTypeAssignment, initRolePermissionMatrix, initRoleAdminPanel, initGenericForm, initEmbeddedForm, initContactForm };
})();
