const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const ribbons = [
    ["BL", "Blanco", "White", 1],
    ["AZ", "Azul", "Blue", 2],
    ["RO", "Rojo", "Red", 3],
    ["CA", "Cafe", "Brown", 4],
    ["NE", "Negro", "Black", 5],
    ["NA", "Naranja", "Orange", 6],
    ["VE", "Verde", "Green", 7],
    ["AM", "Amarillo", "Yellow", 8]
  ];

  function applyShell(activeKey) {
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: "planeacion", view: activeKey || "semanas" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["avisos", "gestion-avisos-corte.html", "Avisos de corte"],
      ["crearAviso", "crear-aviso-corte.html", "Crear aviso"],
      ["semanas", "gestion-semanas.html", "Gestion de semanas"],
      ["generacion", "generacion-semanas.html", "Generar semanas"],
      ["cintas", "gestion-cintas.html", "Gestion de cintas"]
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

  function initEmbeddedForm() {
    const panel = qs("[data-inline-form-panel]");
    const openButton = qs("[data-open-inline-form]");
    const cancelButton = qs("[data-cancel-inline-form]");
    if (!panel || !openButton) return;
    const open = () => {
      panel.classList.remove("is-hidden");
      openButton.setAttribute("aria-expanded", "true");
      panel.querySelector("input:not([readonly]), select")?.focus();
    };
    const close = () => {
      panel.classList.add("is-hidden");
      openButton.setAttribute("aria-expanded", "false");
      panel.querySelector("form")?.reset();
      openButton.focus();
    };
    openButton.addEventListener("click", open);
    cancelButton?.addEventListener("click", close);
    qsa("[data-edit-inline]").forEach((button) => button.addEventListener("click", open));
  }

  function initRibbonForm() {
    const form = qs("[data-ribbon-form]");
    if (!form) return;
    const existingCodes = ribbons.map(([code]) => code);
    qsa("[data-uppercase]", form).forEach((input) => {
      input.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); });
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const empty = !String(input.value || "").trim();
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "");
        if (empty) fail = true;
      });
      const code = qs("#ribbonCode", form);
      if (code?.value && existingCodes.includes(code.value.trim().toUpperCase())) {
        setFieldState(code, qs("#ribbonCodeNote"), "El codigo ya existe en el calendario oficial.", "");
        fail = true;
      }
      const order = qs("#ribbonOrder", form);
      if (order?.value && Number(order.value) < 1) {
        setFieldState(order, qs("#ribbonOrderNote"), "El orden debe ser entero mayor a cero.", "");
        fail = true;
      }
      qs("#formOk")?.classList.toggle("is-hidden", fail);
    });
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  function initWeekGeneration() {
    const form = qs("[data-week-generation-form]");
    const previewBody = qs("#weekPreviewBody");
    const previewCount = qs("#weekPreviewCount");
    if (!form || !previewBody) return;
    const startInput = qs("#weekStartDate");
    const ribbonSelect = qs("#initialRibbon");
    const yearInput = qs("#year");
    const note = qs("#weekStartDateNote");

    function generatePreview() {
      const startValue = startInput.value;
      const initialRibbon = ribbonSelect.value || "BL";
      const year = Number(yearInput.value || new Date().getFullYear());
      if (!startValue) return;
      const start = new Date(`${startValue}T00:00:00`);
      if (start.getDay() !== 1) {
        setFieldState(startInput, note, "La semana 1 debe iniciar un lunes.", "");
        previewBody.innerHTML = "";
        previewCount.textContent = "0 semanas generadas";
        return;
      }
      setFieldState(startInput, note, "", "Fecha valida. Cada semana terminara domingo.");
      const initialIndex = Math.max(0, ribbons.findIndex(([code]) => code === initialRibbon));
      const rows = Array.from({ length: 52 }, (_, index) => {
        const weekStart = addDays(start, index * 7);
        const weekEnd = addDays(weekStart, 6);
        const ribbon = ribbons[(initialIndex + index) % ribbons.length];
        return {
          week: index + 1,
          year,
          month: weekEnd.getMonth() + 1,
          start: formatDate(weekStart),
          end: formatDate(weekEnd),
          ribbon
        };
      });
      previewBody.innerHTML = rows.slice(0, 8).map((row) => `
        <tr>
          <td>${row.week}</td>
          <td>${row.year}</td>
          <td>${row.month}</td>
          <td>${row.start}</td>
          <td>${row.end}</td>
          <td>${row.ribbon[0]} - ${row.ribbon[1]}</td>
        </tr>
      `).join("");
      previewCount.textContent = "52 semanas generadas";
    }

    [startInput, ribbonSelect, yearInput].forEach((control) => {
      control?.addEventListener("change", generatePreview);
      control?.addEventListener("input", generatePreview);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      generatePreview();
      qs("#formOk")?.classList.remove("is-hidden");
    });

    generatePreview();
  }

  function initCalendarMonitor() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;
    const close = () => {
      drawer.classList.remove("show");
      backdrop.classList.remove("show");
    };
    qsa("[data-open-calendar-detail]").forEach((button) => {
      button.addEventListener("click", () => {
        qsa("[data-detail-target]").forEach((node) => {
          node.textContent = button.dataset[node.dataset.detailTarget] || "-";
        });
        const audit = qs("#detailAudit");
        if (audit) {
          audit.innerHTML = (button.dataset.audit || "").split(";").filter(Boolean).map((item) => {
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

  function initCutNoticeViewMode() {
    const listNodes = qsa("[data-cut-list-view]");
    const createView = qs("[data-cut-create-view]");
    const openButtons = qsa("[data-open-cut-create]");
    const closeButtons = qsa("[data-close-cut-create]");
    if (!listNodes.length || !createView) return;

    const setMode = (mode) => {
      const isCreate = mode === "create";
      listNodes.forEach((node) => node.classList.toggle("is-hidden", isCreate));
      createView.classList.toggle("is-hidden", !isCreate);
      if (isCreate) {
        window.history.replaceState(null, "", "#crear");
        createView.scrollIntoView({ block: "start", behavior: "smooth" });
        createView.querySelector("form input, form select, form textarea")?.focus();
        return;
      }
      if (window.location.hash === "#crear") {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    openButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        setMode("create");
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode("list"));
    });

    window.addEventListener("hashchange", () => {
      setMode(window.location.hash === "#crear" ? "create" : "list");
    });

    if (window.location.hash === "#crear") {
      window.setTimeout(() => setMode("create"), 0);
    } else {
      setMode("list");
    }
  }

  function initCutNoticeForm() {
    const form = qs("[data-cut-notice-form]");
    if (!form) return;

    const okNotice = qs("#cutNoticeOk");
    const warningNotice = qs("#cutNoticeWarning");
    const farmSummary = qs("#cutSummaryFarm");
    const productSummary = qs("#cutSummaryProduct");
    const palletsSummary = qs("#cutSummaryPallets");
    const logisticsSummary = qs("#cutSummaryLogistics");
    const fieldValue = (selector) => String(qs(selector, form)?.value || "").trim();

    qsa(".field-note", form).forEach((note) => {
      if (!note.dataset.base) note.dataset.base = note.textContent;
    });

    function updateSummary() {
      const farm = fieldValue("#cutFarm") || "Finca pendiente";
      const reference = fieldValue("#cutReference") || "Referencia pendiente";
      const client = fieldValue("#cutClient") || "Cliente pendiente";
      const pallets = Number(fieldValue("#cutPallets") || 0);
      const week = fieldValue("#cutWeek") || "Semana pendiente";
      const line = fieldValue("#cutLine") || "Linea pendiente";
      const boxes = fieldValue("#cutBoxes") ? `${fieldValue("#cutBoxes")} cajas por pallet` : "Cajas pendientes";

      if (farmSummary) farmSummary.textContent = farm;
      if (productSummary) productSummary.textContent = `${reference} para ${client}.`;
      if (palletsSummary) palletsSummary.textContent = `${pallets} pallets`;
      if (logisticsSummary) logisticsSummary.textContent = `${week} - ${line} - ${boxes}.`;
    }

    function validateRequired() {
      let valid = true;
      qsa("[data-cut-required]", form).forEach((control) => {
        const noteId = control.getAttribute("aria-describedby");
        const note = noteId ? qs(`#${noteId}`) : null;
        const empty = !String(control.value || "").trim();
        setFieldState(control, note, empty ? "Este campo es obligatorio." : "");
        if (empty) valid = false;
      });

      [
        ["#cutPallets", "#cutPalletsNote", "La cantidad de pallets debe ser mayor a cero."],
        ["#cutBunches", "#cutBunchesNote", "La cantidad estimada de racimos debe ser mayor a cero."]
      ].forEach(([fieldSelector, noteSelector, message]) => {
        const input = qs(fieldSelector, form);
        if (!input || !input.value) return;
        const invalid = Number(input.value) <= 0;
        setFieldState(input, qs(noteSelector), invalid ? message : "");
        if (invalid) valid = false;
      });

      return valid;
    }

    qsa("input, select, textarea", form).forEach((control) => {
      control.addEventListener(control.tagName === "SELECT" ? "change" : "input", updateSummary);
      control.addEventListener("change", updateSummary);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = validateRequired();
      updateSummary();
      okNotice?.classList.toggle("is-hidden", !valid);
      warningNotice?.classList.toggle("is-hidden", valid);
      (valid ? okNotice : warningNotice)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        qsa("[data-cut-required], #cutPallets, #cutBunches", form).forEach((control) => {
          const noteId = control.getAttribute("aria-describedby");
          setFieldState(control, noteId ? qs(`#${noteId}`) : null, "", "");
        });
        okNotice?.classList.add("is-hidden");
        warningNotice?.classList.add("is-hidden");
        updateSummary();
      }, 0);
    });

    updateSummary();
  }

  return { applyShell, initTableFilters, initDrawer, initEmbeddedForm, initRibbonForm, initWeekGeneration, initCalendarMonitor, initCutNoticeViewMode, initCutNoticeForm };
})();
