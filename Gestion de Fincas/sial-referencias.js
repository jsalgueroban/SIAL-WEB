const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function applyShell(activeKey) {
    const moduleId = "referencias";
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: moduleId, view: activeKey || "referencias" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["referencias", "gestion-referencias.html", "Gestion de referencias"],
      ["clases", "gestion-clases-referencia.html", "Clases de referencias"],
      ["productos", "gestion-productos.html", "Productos"]
    ];
    nav.innerHTML = items.map(([key, href, label]) =>
      `<a class="nav-link ${key === activeKey ? "active" : ""}" href="${href}"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>${label}</span></a>`
    ).join("");
  }

  function setFieldState(input, note, error, successText) {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function initContactForm() {
    const form = qs("#contactForm");
    if (!form) return;
    const ok = qs("#formOk");
    qsa("[data-uppercase]", form).forEach((input) => {
      input.addEventListener("input", (event) => {
        event.target.value = event.target.value.toUpperCase();
      });
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
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) {
        ok.classList.remove("is-hidden", "notice-error");
        ok.classList.add("notice-success");
        ok.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg><span>Contacto guardado correctamente.</span>';
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
        const show = (!term || text.includes(term)) && stateOk && ctxOk;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
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
    const close = () => { drawer.classList.remove("show"); backdrop.classList.remove("show"); };
    qsa("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = event.target.closest("tr");
        if (!row) return;
        qsa("[data-detail-target]").forEach((node) => {
          const key = node.dataset.detailTarget;
          node.textContent = row.dataset[key] || "-";
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
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  }

  function initGenericForm(formSelector = "[data-generic-form]") {
    if (window.SIALCore?.initGenericForm) { window.SIALCore.initGenericForm(formSelector); return; }
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
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "", "Dato validado.");
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
        ok.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg><span>Registro guardado correctamente.</span>';
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

  function initRelationForm() {
    const form = qs("#relationForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = new Set(["FIN-AC01|PROD-001", "FIN-BP07|PROD-001", "FIN-AC01|PROD-002"]);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      const farm = qs("#farmSelect");
      const product = qs("#productSelect");
      const fields = [
        [farm, qs("#farmSelectNote"), v => v ? "" : "Selecciona una finca activa."],
        [product, qs("#productSelectNote"), v => v ? "" : "Selecciona un producto activo."]
      ];
      fields.forEach(([input, note, rule]) => {
        if (!note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input.value);
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      const key = `${farm.value}|${product.value}`;
      const relationNote = qs("#relationRuleNote");
      if (!fail && existing.has(key)) {
        relationNote.classList.add("error");
        relationNote.textContent = "La relacion finca + producto ya existe.";
        fail = true;
      } else {
        relationNote.classList.remove("error");
        relationNote.textContent = "La combinacion finca + producto debe ser unica.";
      }
      ok?.classList.toggle("is-hidden", fail);
      if (!fail) {
        ok.classList.remove("is-hidden", "notice-error");
        ok.classList.add("notice-success");
        ok.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"></path></svg><span>Producto asignado a la finca correctamente.</span>';
      }
    });
  }

  return { applyShell, initTableFilters, initDrawer, initContactForm, initGenericForm, initEmbeddedForm, initRelationForm };
})();
