const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function applyShell(activeKey) {
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: "puerto", view: activeKey || "contenedores" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["contenedores", "gestion-contenedores.html", "Gestion de contenedores"],
      ["programacionContenedores", "programacion-contenedores.html", "Programacion de contenedores"],
      ["trazabilidadPallets", "trazabilidad-pallets.html", "Trazabilidad de pallets"],
      ["tipos", "gestion-tipos-contenedor.html", "Tipos de contenedor"],
      ["etapas", "gestion-etapas-contenedor.html", "Etapas de contenedor"],
      ["puertos", "gestion-puertos.html", "Gestion de puertos"]
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
        const show = (!term || text.includes(term)) && (state === "all" || row.dataset.status === state) && (ctx === "all" || row.dataset.context === ctx);
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
    openButton.addEventListener("click", () => { form?.reset(); if (form) { delete form.dataset.originalCode; delete form.dataset.originalName; } open("new"); });
    cancelButton?.addEventListener("click", close);
    qsa(config.editButtons || "[data-edit-inline]").forEach((button) => button.addEventListener("click", () => {
      const data = button.closest('tr')?.dataset || {};
      const map = { containerNumber: 'code', containerType: 'type', typeCode: 'code', typeDescription: 'name', typeCapacity: 'capacity', stageName: 'name', stageState: 'state', portName: 'name', portState: 'state' };
      form.dataset.originalCode = data.code || ''; form.dataset.originalName = data.name || '';
      Object.entries(map).forEach(([id, key]) => { const input = qs(`#${id}`, form); if (!input) return; input.value = id === 'typeCapacity' ? parseFloat(data[key]) || '' : id.endsWith('State') ? String(data[key] || '').toUpperCase() : data[key] || ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); });
      open('edit');
    }));
  }

  function initCatalogForm(config = {}) {
    const form = qs(config.form || "[data-catalog-form]");
    if (!form) return;
    const ok = qs("#formOk");
    const existingCodes = (config.existingCodes || "").split("|").map((item) => item.trim().toUpperCase()).filter(Boolean);
    const existingNames = (config.existingNames || "").split("|").map((item) => item.trim().toUpperCase()).filter(Boolean);
    const fields = qsa("[data-uppercase]", form);
    fields.forEach((input) => input.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); }));
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
      qsa("[data-unique-code]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const value = input.value.trim().toUpperCase();
        if (value && value !== form.dataset.originalCode && existingCodes.includes(value)) {
          setFieldState(input, note, "El codigo ya existe en la tabla maestra.", "");
          fail = true;
        }
      });
      qsa("[data-unique-name]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const value = input.value.trim().toUpperCase();
        if (value && value !== form.dataset.originalName && existingNames.includes(value)) {
          setFieldState(input, note, "El nombre ya existe en la tabla maestra.", "");
          fail = true;
        }
      });
      qsa("[data-positive-number]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (input.value && Number(input.value) <= 0) {
          setFieldState(input, note, "Debe ser un valor numerico mayor a cero.", "");
          fail = true;
        }
      });
      ok?.classList.add("is-hidden");
      if (!fail) window.CompanyFeedback?.show('Datos validados', 'success', 'Formulario correcto en esta propuesta de demostración.');
    });
  }

  function initContainerForm() {
    const form = qs("#containerForm");
    if (!form) return;
    const ok = qs("#formOk");
    const existing = ["MSCU1234567", "TCLU7654321"];
    const number = qs("#containerNumber");
    number?.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      const fields = [
        [number, qs("#containerNumberNote"), v => {
          const value = v.trim().toUpperCase();
          if (!/^[A-Z]{4}[0-9]{7}$/.test(value)) return "Debe cumplir formato ISO: 4 letras + 7 digitos.";
          if (value !== form.dataset.originalCode && existing.includes(value)) return "El número de contenedor ya existe.";
          return "";
        }],
        [qs("#containerType"), qs("#containerTypeNote"), v => v ? "" : "Selecciona un tipo de contenedor existente."]
      ];
      fields.forEach(([input, note, rule]) => {
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input?.value || "");
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      ok?.classList.add("is-hidden");
      if (!fail) window.CompanyFeedback?.show('Datos validados', 'success', 'Formulario correcto en esta propuesta de demostración.');
    });
  }

  const containerStages = [
    { id: "stage-disponible", code: "ET-001", name: "DISPONIBLE", active: true },
    { id: "stage-inspeccion", code: "ET-003", name: "EN INSPECCION", active: true },
    { id: "stage-puerto", code: "ET-006", name: "EN PUERTO", active: true },
    { id: "stage-exportado", code: "ET-007", name: "EXPORTADO", active: false }
  ];

  const containers = [
    { id: "ctr-001", code: "MSCU1234567", type: "40RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-001" },
    { id: "ctr-002", code: "TCLU7654321", type: "20RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-002" },
    { id: "ctr-003", code: "SIALU1234567", type: "40RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-003" },
    { id: "ctr-004", code: "BANU4567890", type: "40HC", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-004" },
    { id: "ctr-005", code: "HLBU9876543", type: "40HC", status: "inactive", processStatus: "available", processLabel: "Disponible", processCode: "CP-005" },
    { id: "ctr-006", code: "MSCU2233445", type: "20RF", status: "active", processStatus: "inspection", processLabel: "En inspeccion", processCode: "CP-006" },
    { id: "ctr-007", code: "TLLU3344556", type: "40RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-007" },
    { id: "ctr-008", code: "CMAU4455667", type: "40RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-008" },
    { id: "ctr-009", code: "EISU5566778", type: "20RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-009" },
    { id: "ctr-010", code: "TRIU6677889", type: "40HC", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-010" },
    { id: "ctr-011", code: "CXDU7788990", type: "40RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-011" },
    { id: "ctr-012", code: "MAEU8899001", type: "20RF", status: "active", processStatus: "available", processLabel: "Disponible", processCode: "CP-012" }
  ];

  const containerSchedules = [
    {
      uuid: "8b420c90-7b8d-4705-9f55-000000000001",
      code: "PCO-2026-001",
      containerId: "ctr-001",
      operationWeek: "2026-07-06",
      stageId: "stage-disponible",
      observation: "Habilitado para inspeccion y asignacion en la semana vigente.",
      audit: "Crear - admin.puerto|08/07/2026 08:10"
    },
    {
      uuid: "8b420c90-7b8d-4705-9f55-000000000002",
      code: "PCO-2026-002",
      containerId: "ctr-003",
      operationWeek: "2026-07-13",
      stageId: "stage-inspeccion",
      observation: "Programacion futura para inicio de inspeccion externa.",
      audit: "Crear - supervisor.puerto|08/07/2026 09:25"
    },
    {
      uuid: "8b420c90-7b8d-4705-9f55-000000000003",
      code: "PCO-2026-003",
      containerId: "ctr-007",
      operationWeek: "2026-06-22",
      stageId: "stage-puerto",
      observation: "Programacion terminada; queda disponible solo para consulta historica.",
      audit: "Finalizar - auditor.puerto|28/06/2026 17:45"
    },
    {
      uuid: "8b420c90-7b8d-4705-9f55-000000000004",
      code: "PCO-2026-004",
      containerId: "ctr-008",
      operationWeek: "2026-07-20",
      stageId: "stage-disponible",
      observation: "Reserva operativa para inspeccion y cargue posterior.",
      audit: "Crear - admin.puerto|08/07/2026 10:30"
    }
  ];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function parseDateInput(value) {
    return new Date(`${value}T00:00:00`);
  }

  function toDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function getWeekStart(date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    const day = next.getDay() || 7;
    next.setDate(next.getDate() - day + 1);
    return next;
  }

  function getIsoWeek(date) {
    const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNumber = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    return Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  }

  function formatShortDate(date) {
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function formatWeekLabel(value) {
    const start = parseDateInput(value);
    const end = addDays(start, 6);
    return `Semana ${getIsoWeek(start)} - ${start.getFullYear()} (${formatShortDate(start)} al ${formatShortDate(end)})`;
  }

  function todayDate() {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }

  function scheduleStatus(schedule) {
    const start = parseDateInput(schedule.operationWeek);
    const end = addDays(start, 6);
    const now = todayDate();
    if (now < start) return { key: "programado", label: "Programado", className: "status-warning", bucket: "future" };
    if (now > end) return { key: "finalizado", label: "Finalizado", className: "status-inactive", bucket: "past" };
    return { key: "vigente", label: "Vigente", className: "status-active", bucket: "current" };
  }

  function findContainer(id) {
    return containers.find((item) => item.id === id);
  }

  function findStage(id) {
    return containerStages.find((item) => item.id === id);
  }

  function isContainerScheduled(containerId, operationWeek) {
    return containerSchedules.some((schedule) =>
      schedule.containerId === containerId &&
      schedule.operationWeek === operationWeek &&
      scheduleStatus(schedule).key !== "finalizado"
    );
  }

  function initContainerScheduling() {
    const form = qs("#containerScheduleForm");
    const weekInput = qs("#scheduleOperationWeek");
    const selectInput = qs("#containerSearchSelectInput");
    const selectPanel = qs("#containerSearchSelectPanel");
    const selectList = qs("#availableContainerList");
    const selectPagination = qs("#availableContainerPagination");
    const selectNote = qs("#containerSearchSelectNote");
    const selectedList = qs("#selectedContainersList");
    const observation = qs("#containerScheduleObservation");
    const ok = qs("#scheduleFormOk");
    const warning = qs("#scheduleFormWarning");
    const availabilityChip = qs("#containerAvailabilityChip");
    const tableBody = qs("#containerScheduleBody");
    const tableCount = qs("#containerScheduleCount");
    const tableEmpty = qs("#containerScheduleEmpty");
    const tablePagination = qs("#containerSchedulePagination");
    const scheduleSearch = qs("#containerScheduleSearch");
    const scheduleStatusFilter = qs("#containerScheduleStatus");
    const scheduleWeekFilter = qs("#containerScheduleWeekFilter");
    const scheduleStageFilter = qs("#containerScheduleStageFilter");
    const drawer = qs("#containerScheduleDrawer");
    const backdrop = qs("#containerScheduleBackdrop");
    const closeDrawer = qs("#closeContainerScheduleDetail");
    const selectState = { page: 1, pageSize: 5 };
    const tableState = { page: 1, pageSize: 10 };
    const selectedContainers = new Set();

    if (!form || !weekInput || !selectInput || !selectPanel || !selectList || !selectedList || !tableBody) return;

    function activeWeek() {
      const date = weekInput.value ? parseDateInput(weekInput.value) : todayDate();
      return toDateInputValue(getWeekStart(date));
    }

    function activeAvailableContainers() {
      const term = selectInput.value.trim().toLowerCase();
      const week = activeWeek();
      return containers.filter((container) => {
        const matches = !term || `${container.code} ${container.type}`.toLowerCase().includes(term);
        return matches &&
          container.status === "active" &&
          container.processStatus === "available" &&
          !selectedContainers.has(container.id) &&
          !isContainerScheduled(container.id, week);
      });
    }

    function openSelect() {
      selectPanel.classList.remove("is-hidden");
      selectInput.setAttribute("aria-expanded", "true");
      renderAvailableContainers();
    }

    function closeSelect() {
      selectPanel.classList.add("is-hidden");
      selectInput.setAttribute("aria-expanded", "false");
    }

    function clearSelectedContainers() {
      selectedContainers.clear();
      selectInput.value = "";
      selectInput.dataset.selectedLabel = "";
      selectState.page = 1;
      renderSelectedContainers();
      renderAvailableContainers();
    }

    function renderSelectedContainers() {
      const selected = Array.from(selectedContainers).map(findContainer).filter(Boolean);
      if (!selected.length) {
        selectedList.innerHTML = '<div class="selected-containers-empty">Sin contenedores seleccionados.</div>';
        return;
      }
      selectedList.innerHTML = selected.map((container) => `
        <span class="selected-container-chip">
          <span><strong>${escapeHtml(container.code)}</strong><small>${escapeHtml(container.type)}</small></span>
          <button class="icon-btn" type="button" data-remove-selected-container="${escapeHtml(container.id)}" aria-label="Retirar ${escapeHtml(container.code)}"><svg class="icon" viewBox="0 0 24 24"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg></button>
        </span>
      `).join("");
    }

    function renderAvailableContainers() {
      qs('[data-container-search-select]')?.dispatchEvent(new Event('sial:selection-state'));
      const available = activeAvailableContainers();
      const totalPages = Math.max(1, Math.ceil(available.length / selectState.pageSize));
      selectState.page = Math.min(Math.max(selectState.page, 1), totalPages);
      const start = (selectState.page - 1) * selectState.pageSize;
      const pageItems = available.slice(start, start + selectState.pageSize);
      if (availabilityChip) availabilityChip.textContent = `${available.length} disponibles`;

      if (!pageItems.length) {
        selectList.innerHTML = '<div class="search-select-empty">No hay contenedores disponibles para esta semana.</div>';
      } else {
        selectList.innerHTML = pageItems.map((container) => `
          <button class="search-select-option" type="button" data-container-option="${escapeHtml(container.id)}">
            <span><strong>${escapeHtml(container.code)}</strong><small>${escapeHtml(container.type)} / ${escapeHtml(container.processLabel)}</small></span>
            <span class="status status-active" data-sial-chip-adapter>Activo</span>
          </button>
        `).join("");
      }

      const startLabel = available.length ? start + 1 : 0;
      const endLabel = Math.min(start + selectState.pageSize, available.length);
      selectPagination.innerHTML = `
        <span>${startLabel}-${endLabel} de ${available.length}</span>
        <div class="search-select-pages">
          <button class="pagination-btn" type="button" data-container-select-page="${selectState.page - 1}" ${selectState.page <= 1 ? "disabled" : ""}>Anterior</button>
          <button class="pagination-btn" type="button" data-container-select-page="${selectState.page + 1}" ${selectState.page >= totalPages ? "disabled" : ""}>Siguiente</button>
        </div>
      `;
    }

    function renderStageOptions() {
      const activeStages = containerStages.filter((stage) => stage.active);
      scheduleStageFilter.innerHTML = '<option value="all">Todas las etapas</option>' + activeStages.map((stage) =>
        `<option value="${escapeHtml(stage.id)}">${escapeHtml(stage.name)}</option>`
      ).join("");
    }

    function defaultScheduleStage() {
      return containerStages.find((stage) => stage.id === "stage-disponible" && stage.active) ||
        containerStages.find((stage) => stage.active);
    }

    function renderTablePagination(total) {
      const totalPages = Math.max(1, Math.ceil(total / tableState.pageSize));
      tableState.page = Math.min(Math.max(tableState.page, 1), totalPages);
      const start = total ? ((tableState.page - 1) * tableState.pageSize) + 1 : 0;
      const end = Math.min(tableState.page * tableState.pageSize, total);
      tablePagination.innerHTML = `
        <div class="pagination-summary">Mostrando ${start}-${end} de ${total} registros</div>
        <label class="pagination-size"><span>Registros por pagina</span><select class="select" data-container-schedule-page-size aria-label="Registros por pagina"><option value="10" ${tableState.pageSize === 10 ? "selected" : ""}>10</option><option value="30" ${tableState.pageSize === 30 ? "selected" : ""}>30</option><option value="50" ${tableState.pageSize === 50 ? "selected" : ""}>50</option></select></label>
        <div class="pagination-pages">
          <button class="pagination-btn" type="button" data-container-schedule-page="${tableState.page - 1}" ${tableState.page <= 1 ? "disabled" : ""}>Anterior</button>
          <button class="pagination-btn active" type="button" aria-current="page">${tableState.page}</button>
          <button class="pagination-btn" type="button" data-container-schedule-page="${tableState.page + 1}" ${tableState.page >= totalPages ? "disabled" : ""}>Siguiente</button>
        </div>
      `;
    }

    function filteredSchedules() {
      const term = (scheduleSearch?.value || "").trim().toLowerCase();
      const statusValue = scheduleStatusFilter?.value || "all";
      const weekValue = scheduleWeekFilter?.value || "all";
      const stageValue = scheduleStageFilter?.value || "all";
      return containerSchedules.filter((schedule) => {
        const container = findContainer(schedule.containerId);
        const stage = findStage(schedule.stageId);
        const status = scheduleStatus(schedule);
        const text = `${schedule.code} ${container?.code || ""} ${container?.type || ""} ${stage?.name || ""} ${formatWeekLabel(schedule.operationWeek)}`.toLowerCase();
        return (!term || text.includes(term)) &&
          (statusValue === "all" || status.key === statusValue) &&
          (weekValue === "all" || status.bucket === weekValue) &&
          (stageValue === "all" || schedule.stageId === stageValue);
      });
    }

    function renderSchedules() {
      const schedules = filteredSchedules();
      const totalPages = Math.max(1, Math.ceil(schedules.length / tableState.pageSize));
      tableState.page = Math.min(Math.max(tableState.page, 1), totalPages);
      const start = (tableState.page - 1) * tableState.pageSize;
      const pageItems = schedules.slice(start, start + tableState.pageSize);

      tableBody.innerHTML = pageItems.map((schedule) => {
        const container = findContainer(schedule.containerId);
        const stage = findStage(schedule.stageId);
        const status = scheduleStatus(schedule);
        return `
          <tr data-schedule-uuid="${escapeHtml(schedule.uuid)}">
            <td><strong>${escapeHtml(schedule.code)}</strong></td>
            <td>${escapeHtml(container?.code || "--")}<br /><span class="muted">${escapeHtml(container?.type || "--")}</span></td>
            <td>${escapeHtml(formatWeekLabel(schedule.operationWeek))}</td>
            <td>${escapeHtml(stage?.name || "--")}</td>
            <td><span class="status ${escapeHtml(status.className)}" data-sial-chip-adapter>${escapeHtml(status.label)}</span></td>
            <td class="muted">${escapeHtml((schedule.audit || "").replace("|", " / "))}</td>
            <td><div class="row-actions"><button class="icon-btn" type="button" data-open-schedule-detail="${escapeHtml(schedule.uuid)}" aria-label="Visualizar programación"><svg class="icon" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button></div></td>
          </tr>
        `;
      }).join("");

      tableEmpty?.classList.toggle("show", schedules.length === 0);
      if (tableCount) {
        const end = Math.min(start + tableState.pageSize, schedules.length);
        tableCount.textContent = `${schedules.length ? start + 1 : 0}-${end} de ${schedules.length} registros`;
      }
      renderTablePagination(schedules.length);
    }

    function openDrawer(scheduleUuid) {
      const schedule = containerSchedules.find((item) => item.uuid === scheduleUuid);
      if (!schedule || !drawer || !backdrop) return;
      const container = findContainer(schedule.containerId);
      const stage = findStage(schedule.stageId);
      const status = scheduleStatus(schedule);
      const values = {
        code: schedule.code,
        uuid: schedule.uuid,
        container: `${container?.code || "--"} / ${container?.type || "--"}`,
        week: formatWeekLabel(schedule.operationWeek),
        stage: stage?.name || "--",
        status: status.label,
        validation: "Contenedor activo y disponible al programar",
        process: `${container?.processCode || "--"} / ${container?.processLabel || "--"}`
      };
      qsa("[data-schedule-detail]", drawer).forEach((node) => {
        node.textContent = values[node.dataset.scheduleDetail] || "-";
      });
      const audit = qs("#containerScheduleAudit");
      if (audit) {
        audit.innerHTML = (schedule.audit || "").split(";").filter(Boolean).map((item) => {
          const [title, meta] = item.split("|");
          return `<div class="audit-item"><strong>${escapeHtml(title || "-")}</strong><div class="muted">${escapeHtml(meta || "")}</div></div>`;
        }).join("");
      }
      drawer.classList.add("show");
      backdrop.classList.add("show");
      closeDrawer?.focus();
    }

    function closeDetail() {
      drawer?.classList.remove("show");
      backdrop?.classList.remove("show");
    }

    function resetFormMessages() {
      ok?.classList.add("is-hidden");
      warning?.classList.add("is-hidden");
    }

    function nowAuditText() {
      const value = new Date();
      const date = `${String(value.getDate()).padStart(2, "0")}/${String(value.getMonth() + 1).padStart(2, "0")}/${value.getFullYear()}`;
      const time = `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`;
      return `Crear - admin.puerto|${date} ${time}`;
    }

    function nextScheduleCode(offset = 1) {
      return `PCO-2026-${String(containerSchedules.length + offset).padStart(3, "0")}`;
    }

    function nextUuid() {
      return window.crypto?.randomUUID?.() || `8b420c90-7b8d-4705-9f55-${String(Date.now()).slice(-12)}`;
    }

    const selectionSource = qs('[data-container-search-select]');
    selectionSource.sialContainerSelection = {
      read: () => ({ value: Array.from(selectedContainers), options: [...activeAvailableContainers(), ...Array.from(selectedContainers).map(findContainer).filter(Boolean)].map(item => ({ value: item.id, label: item.code, description: item.type })) }),
      change: (ids) => { selectedContainers.clear(); ids.forEach(id => selectedContainers.add(id)); renderSelectedContainers(); renderAvailableContainers(); setFieldState(selectInput, selectNote, '', `${ids.length} contenedores seleccionados.`); }
    };
    renderStageOptions();
    if (!weekInput.value) weekInput.value = toDateInputValue(getWeekStart(todayDate()));
    renderSelectedContainers();
    renderAvailableContainers();
    renderSchedules();

    selectInput.addEventListener("focus", openSelect);
    selectInput.addEventListener("input", () => {
      selectState.page = 1;
      openSelect();
    });
    selectPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    selectList.addEventListener("click", (event) => {
      event.stopPropagation();
      const option = event.target.closest("[data-container-option]");
      if (!option) return;
      const container = findContainer(option.dataset.containerOption);
      if (!container) return;
      selectedContainers.add(container.id);
      selectInput.value = "";
      selectState.page = 1;
      renderSelectedContainers();
      renderAvailableContainers();
      setFieldState(selectInput, selectNote, "", `${selectedContainers.size} contenedor(es) seleccionado(s).`);
    });
    selectPagination.addEventListener("click", (event) => {
      event.stopPropagation();
      const button = event.target.closest("[data-container-select-page]");
      if (!button || button.disabled) return;
      selectState.page = Number(button.dataset.containerSelectPage) || 1;
      renderAvailableContainers();
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-container-search-select]")) closeSelect();
    });

    weekInput.addEventListener("change", () => {
      clearSelectedContainers();
      setFieldState(weekInput, qs("#scheduleOperationWeekNote"), "", formatWeekLabel(activeWeek()));
      renderAvailableContainers();
    });
    selectedList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-selected-container]");
      if (!button) return;
      selectedContainers.delete(button.dataset.removeSelectedContainer);
      renderSelectedContainers();
      renderAvailableContainers();
      setFieldState(selectInput, selectNote, "", selectedContainers.size ? `${selectedContainers.size} contenedor(es) seleccionado(s).` : "Selecciona uno o varios contenedores disponibles.");
    });

    [scheduleSearch, scheduleStatusFilter, scheduleWeekFilter, scheduleStageFilter].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => {
        tableState.page = 1;
        renderSchedules();
      });
    });
    tablePagination?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-container-schedule-page]");
      if (!button || button.disabled) return;
      tableState.page = Number(button.dataset.containerSchedulePage) || 1;
      renderSchedules();
    });
    tablePagination?.addEventListener("change", (event) => {
      const selector = event.target.closest("[data-container-schedule-page-size]");
      if (!selector) return;
      tableState.pageSize = Number(selector.value) || 10;
      tableState.page = 1;
      renderSchedules();
    });
    tableBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-open-schedule-detail]");
      if (!button) return;
      openDrawer(button.dataset.openScheduleDetail);
    });
    closeDrawer?.addEventListener("click", closeDetail);
    backdrop?.addEventListener("click", closeDetail);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeDetail();
    });

    qs("#clearContainerScheduleForm")?.addEventListener("click", () => {
      form.reset();
      weekInput.value = toDateInputValue(getWeekStart(todayDate()));
      clearSelectedContainers();
      resetFormMessages();
      renderAvailableContainers();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      resetFormMessages();
      const weekNote = qs("#scheduleOperationWeekNote");
      const weekStart = activeWeek();
      const selectedIds = Array.from(selectedContainers);
      const selectedItems = selectedIds.map(findContainer).filter(Boolean);
      const stage = defaultScheduleStage();
      let fail = false;
      let warningMessage = "Revisa los campos requeridos antes de parametrizar los contenedores.";

      setFieldState(weekInput, weekNote, weekInput.value ? "" : "Selecciona una fecha para calcular la semana.", weekInput.value ? formatWeekLabel(weekStart) : "");
      if (!weekInput.value) fail = true;

      if (!selectedItems.length) {
        setFieldState(selectInput, selectNote, "Selecciona al menos un contenedor disponible del listado.", "");
        fail = true;
      } else if (selectedItems.some((container) => isContainerScheduled(container.id, weekStart))) {
        setFieldState(selectInput, selectNote, "Uno de los contenedores seleccionados ya tiene programacion vigente en esta semana.", "");
        fail = true;
      } else {
        setFieldState(selectInput, selectNote, "", `${selectedItems.length} contenedor(es) disponible(s) para la semana.`);
      }

      if (!stage) {
        fail = true;
        warningMessage = "No hay una etapa activa disponible para crear la programacion.";
      }

      if (fail) {
        if (warning) {
          warning.textContent = warningMessage;
          warning.classList.remove("is-hidden");
        }
        return;
      }

      const confirmed = await window.CompanyFeedback.confirm('Confirmar programación', `Se programarán ${selectedItems.length} contenedores para ${formatWeekLabel(weekStart)}.`, 'Programar contenedores');
      if (!confirmed) return;
      const createdSchedules = selectedItems.map((container, index) => ({
        uuid: nextUuid(),
        code: nextScheduleCode(index + 1),
        containerId: container.id,
        operationWeek: weekStart,
        stageId: stage.id,
        observation: observation.value.trim() || "Programacion creada desde propuesta web.",
        audit: nowAuditText()
      }));
      containerSchedules.unshift(...createdSchedules);

      if (ok) {
        ok.textContent = `${selectedItems.length} contenedor(es) quedaron parametrizados para ${formatWeekLabel(weekStart)} con etapa ${stage.name}.`;
        ok.classList.add("is-hidden");
        window.CompanyFeedback?.show('Contenedores programados', 'success', ok.textContent);
      }
      selectedContainers.clear();
      selectInput.value = "";
      observation.value = "";
      renderSelectedContainers();
      renderAvailableContainers();
      renderSchedules();
    });
  }

  return { applyShell, initTableFilters, initDrawer, initEmbeddedForm, initCatalogForm, initContainerForm, initContainerScheduling };
})();
