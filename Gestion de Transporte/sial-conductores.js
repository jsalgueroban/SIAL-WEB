const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function applyShell(activeKey) {
    const companyViews = ["tiposEmpresa", "empresaTipo"];
    const moduleId = companyViews.includes(activeKey) ? "empresas" : "transporte";
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: moduleId, view: activeKey || "gestion" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = moduleId === "empresas" ? [
      ["empresas", "../Gestion%20de%20Empresas/gestion-empresas.html", "Gestion de empresas"],
      ["roles", "../Gestion%20de%20Empresas/roles-empresa.html", "Roles por empresas"],
      ["paramRoles", "../Gestion%20de%20Empresas/parametrizacion-roles.html", "Creacion de roles"],
      ["tiposEmpresa", "gestion-tipos-empresa.html", "Tipos de empresas"],
      ["empresaTipo", "relacion-empresa-tipo.html", "Empresa + tipo"]
    ] : [
      ["gestion", "gestion-conductores.html", "Gestion de conductores"],
      ["licencias", "gestion-categorias-licencia.html", "Gestion de licencias"],
      ["relacion", "relacion-conductor-licencia.html", "Conductor + licencia"],
      ["vehiculos", "gestion-vehiculos.html", "Gestion de vehiculos"],
      ["tiposVehiculo", "gestion-tipos-vehiculo.html", "Tipos de vehiculos"],
      ["dashboard", "dashboard-transporte.html", "Dashboard transporte"],
      ["documental", "matriz-documental-vehiculos.html", "Matriz documental"],
      ["disponibilidad", "disponibilidad-operativa.html", "Disponibilidad"],
      ["mantenimientos", "gestion-mantenimientos.html", "Mantenimientos"],
      ["operaciones", "gestion-operaciones.html", "Programacion de vehiculos"]
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

  function setFieldState(input, note, error, successText) {
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
    const rows = qsa(config.rowSelector);
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
        const text = row.textContent.toLowerCase();
        const stateOk = state === "all" || row.dataset.status === state;
        const ctxOk = ctx === "all" || row.dataset.context === ctx;
        let extraOk = true;
        (config.extraFilters || []).forEach((filter) => {
          const sel = qs(filter.select);
          if (sel && sel.value !== "all") extraOk = extraOk && row.dataset[filter.datasetKey] === sel.value;
        });
        const show = (!term || text.includes(term)) && stateOk && ctxOk && extraOk;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} registros visibles`;
    }
    [search, status, context].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    (config.extraFilters || []).forEach((filter) => {
      const control = qs(filter.select);
      if (control) control.addEventListener("change", filterRows);
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
          const key = node.dataset.detailTarget;
          node.textContent = row.dataset[key] || "-";
        });
        const licenses = qs("#detailLicenses");
        if (licenses) {
          licenses.innerHTML = (row.dataset.licenses || "").split(";").filter(Boolean).map((item) => {
            const [title, meta] = item.split("|");
            return `<div class="license-item"><strong>${title || "-"}</strong><div class="muted">${meta || ""}</div></div>`;
          }).join("");
        }
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

  function initDriverForm() {
    const form = qs("#driverForm");
    if (!form) return;
    const ok = qs("#formOk");
    const fields = {
      company: [qs("#company"), qs("#companyNote"), v => v ? "" : "Selecciona la empresa del conductor."],
      firstName: [qs("#firstName"), qs("#firstNameNote"), v => v.trim().length >= 2 ? "" : "Los nombres son obligatorios."],
      lastName: [qs("#lastName"), qs("#lastNameNote"), v => v.trim().length >= 2 ? "" : "Los apellidos son obligatorios."],
      idType: [qs("#idType"), qs("#idTypeNote"), v => v ? "" : "Selecciona el tipo de identificacion."],
      idNumber: [qs("#idNumber"), qs("#idNumberNote"), v => /^[0-9]{6,15}$/.test(v.trim()) ? "" : "Ingresa entre 6 y 15 digitos."],
      phone: [qs("#phone"), qs("#phoneNote"), v => /^[0-9]{10}$/.test(v.trim()) ? "" : "El celular debe tener 10 digitos."],
      email: [qs("#email"), qs("#emailNote"), v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Ingresa un correo electronico valido."],
      licenseNumber: [qs("#licenseNumber"), qs("#licenseNumberNote"), v => v.trim().length >= 5 ? "" : "El numero de licencia es obligatorio."],
      arlCompany: [qs("#arlCompany"), qs("#arlCompanyNote"), v => v ? "" : "Selecciona la empresa ARL."],
      arlStart: [qs("#arlStart"), qs("#arlStartNote"), v => v ? "" : "La fecha de inicio ARL es obligatoria."],
      arlEnd: [qs("#arlEnd"), qs("#arlEndNote"), v => {
        const start = qs("#arlStart").value;
        if (!v) return "La fecha de fin ARL es obligatoria.";
        if (start && v < start) return "La fecha de fin no puede ser anterior al inicio.";
        return "";
      }]
    };
    ["firstName", "lastName"].forEach((id) => {
      qs(`#${id}`)?.addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    });
    function validateLicenses() {
      const note = qs("#licenseAssignmentNote");
      const checked = qsa('input[name="licenseCategory"]:checked');
      if (!checked.length) {
        note.classList.add("error");
        note.textContent = "Debes asignar al menos una categoria de licencia activa.";
        return false;
      }
      const missing = checked.some((item) => !qs(`#exp${item.value}`).value);
      if (missing) {
        note.classList.add("error");
        note.textContent = "Cada categoria activa debe tener fecha de vencimiento.";
        return false;
      }
      note.classList.remove("error");
      note.classList.add("success");
      note.textContent = "Categorias activas listas para registrar la relacion conductor-licencia.";
      return true;
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      Object.values(fields).forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      if (!validateLicenses()) fail = true;
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) window.scrollTo({ top: 0, behavior: "smooth" });
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

  function initLicenseForm() {
    const form = qs("#licenseForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = ["C2", "C3", "B1"];
    const fields = {
      licenseCode: [qs("#licenseCode"), qs("#licenseCodeNote"), v => {
        const code = v.trim().toUpperCase();
        if (!/^[A-Z0-9]{1,6}$/.test(code)) return "El codigo es obligatorio, alfanumerico y en mayusculas.";
        if (existing.includes(code)) return "El codigo de licencia ya existe.";
        return "";
      }],
      description: [qs("#description"), qs("#descriptionNote"), v => v.trim().length >= 4 ? "" : "La descripcion es obligatoria."]
    };
    qs("#licenseCode")?.addEventListener("input", (event) => {
      event.target.value = event.target.value.toUpperCase();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      Object.values(fields).forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      ok?.classList.toggle("is-hidden", fail);
    });
  }

  function initRelationForm() {
    const form = qs("#relationForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = new Set(["CD-00124|C2", "CD-00124|C3", "CD-00141|C3"]);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      const conductor = qs("#driverCodeSelect");
      const license = qs("#licenseCodeSelect");
      const expiration = qs("#expirationDate");
      const fields = [
        [conductor, qs("#driverCodeNote"), v => v ? "" : "Selecciona un conductor activo."],
        [license, qs("#licenseCodeNote"), v => v ? "" : "Selecciona una categoria activa."],
        [expiration, qs("#expirationDateNote"), v => v ? "" : "La fecha de vencimiento es obligatoria."]
      ];
      fields.forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      const key = `${conductor.value}|${license.value}`;
      const relationNote = qs("#relationRuleNote");
      if (!fail && existing.has(key)) {
        relationNote.classList.add("error");
        relationNote.textContent = "La relacion conductor + licencia ya existe y es llave primaria.";
        fail = true;
      } else {
        relationNote.classList.remove("error");
        relationNote.textContent = "La combinacion conductor + licencia debe ser unica.";
      }
      ok?.classList.toggle("is-hidden", fail);
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

  function initCatalogForm(config = {}) {
    const form = qs(config.form || "[data-catalog-form]");
    if (!form) return;
    const ok = qs(config.ok || "#formOk");
    const existing = (config.existing || "").split("|").map((item) => item.trim().toUpperCase()).filter(Boolean);
    const code = qs(config.code || "[data-catalog-code]", form);
    const name = qs(config.name || "[data-catalog-name]", form);
    const codeNote = code ? qs(`#${code.getAttribute("aria-describedby")}`) : null;
    const nameNote = name ? qs(`#${name.getAttribute("aria-describedby")}`) : null;

    [code, name].filter(Boolean).forEach((input) => {
      input.addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      if (code && !code.readOnly) {
        const value = code.value.trim().toUpperCase();
        const error = value && /^[A-Z0-9-]{1,12}$/.test(value) ? "" : "El codigo es obligatorio, alfanumerico y en mayusculas.";
        setFieldState(code, codeNote, error, "Dato validado.");
        if (error) fail = true;
      }
      if (name) {
        const value = name.value.trim().toUpperCase();
        let error = value.length >= 3 ? "" : "El nombre es obligatorio.";
        if (!error && existing.includes(value)) error = "El nombre ya existe en la tabla maestra.";
        setFieldState(name, nameNote, error, "Dato validado.");
        if (error) fail = true;
      }
      ok?.classList.toggle("is-hidden", fail);
    });
  }

  function initCompanyTypeRelationForm() {
    const form = qs("#companyTypeRelationForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = new Set(["EMP-TRANSPORTE-01|2", "EMP-COMERCIAL-09|1"]);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      const company = qs("#companyCodeSelect");
      const type = qs("#companyTypeSelect");
      const fields = [
        [company, qs("#companyCodeNote"), v => v ? "" : "Selecciona una empresa activa."],
        [type, qs("#companyTypeNote"), v => v ? "" : "Selecciona un tipo de empresa activo."]
      ];
      fields.forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      const relationNote = qs("#companyTypeRuleNote");
      const key = `${company.value}|${type.value}`;
      if (!fail && existing.has(key)) {
        relationNote.classList.add("error");
        relationNote.textContent = "La relacion empresa + tipo ya existe y es llave primaria.";
        fail = true;
      } else {
        relationNote.classList.remove("error");
        relationNote.textContent = "La combinacion empresa + tipo debe ser unica.";
      }
      ok?.classList.toggle("is-hidden", fail);
    });
  }

  function initVehicleForm() {
    const form = qs("#vehicleForm");
    if (!form) return;
    const ok = qs("#formOk");
    const required = [
      ["plate", "La placa es obligatoria, unica y alfanumerica.", v => /^[A-Z0-9-]{5,10}$/.test(v.trim().toUpperCase())],
      ["vehicleType", "Selecciona el tipo de vehiculo activo.", v => Boolean(v)],
      ["carrierCompany", "Selecciona la empresa transportadora activa.", v => Boolean(v)],
      ["ownFleet", "Selecciona si pertenece a flota propia.", v => Boolean(v)],
      ["soatNumber", "El numero SOAT es obligatorio.", v => v.trim().length >= 4],
      ["soatIssuedAt", "La fecha de expedicion SOAT es obligatoria.", v => Boolean(v)],
      ["soatStartAt", "La fecha de vigencia desde SOAT es obligatoria.", v => Boolean(v)],
      ["soatEndAt", "La fecha de vigencia hasta SOAT es obligatoria.", v => Boolean(v)],
      ["insuranceCompany", "Selecciona la aseguradora activa.", v => Boolean(v)],
      ["techNumber", "El numero de tecnomecanica es obligatorio.", v => v.trim().length >= 4],
      ["certifierCompany", "Selecciona la certificadora activa.", v => Boolean(v)],
      ["techIssuedAt", "La fecha de expedicion tecnomecanica es obligatoria.", v => Boolean(v)],
      ["techEndAt", "La fecha de vencimiento tecnomecanica es obligatoria.", v => Boolean(v)]
    ];
    qs("#plate")?.addEventListener("input", (event) => {
      event.target.value = event.target.value.toUpperCase();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      required.forEach(([id, message, rule]) => {
        const input = qs(`#${id}`);
        const note = qs(`#${id}Note`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input?.value || "") ? "" : message;
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      const datePairs = [
        ["soatStartAt", "soatEndAt", "La vigencia desde SOAT no puede ser mayor que la vigencia hasta."],
        ["techIssuedAt", "techEndAt", "La expedicion tecnomecanica no puede ser mayor que el vencimiento."]
      ];
      datePairs.forEach(([startId, endId, message]) => {
        const start = qs(`#${startId}`);
        const end = qs(`#${endId}`);
        const note = qs(`#${startId}Note`);
        if (start?.value && end?.value && start.value > end.value) {
          setFieldState(start, note, message, "");
          fail = true;
        }
      });
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return { applyShell, initTableFilters, initDrawer, initDriverForm, initLicenseForm, initRelationForm, initEmbeddedForm, initCatalogForm, initCompanyTypeRelationForm, initVehicleForm };
})();

