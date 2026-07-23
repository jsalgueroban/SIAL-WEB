(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initCutNoticeGrid() {
    const body = qs("[data-cut-grid-body]");
    if (!body) return;
    const statePresentation = document.body.dataset.cutStatePresentation || "column";

    const catalogs = {
      weeks: ["SEM-2026-30", "SEM-2026-31"],
      farms: ["FINCA LA ESPERANZA", "FINCA SANTA ISABEL", "FINCA LOS ALMENDROS"],
      sectors: ["SECTOR 01", "SECTOR 02", "SECTOR 04", "ZONA EMPAQUE"],
      groups: ["GRUPO NORTE", "GRUPO CENTRO", "GRUPO SUR"],
      clients: ["GLOBAL FRUIT EXPORT", "EUROBAN TRADING", "CARIBE FRESH", "FYFFES", "DOLE", "CHIQUITA"],
      references: ["AGSTDRA", "20LD7RA-14", "16FT7BD-8", "MPBORG303-5", "STDSRA-7"],
      boxes: ["48", "54", "66"],
      direct: ["No", "Si"],
      lines: ["MAERSK", "MSC", "HAPAG-LLOYD"],
      versions: ["AC-01", "AC-02", "AC-03"]
    };
    const referenceClasses = {
      "AGSTDRA": "CONVENCIONAL",
      "20LD7RA-14": "CONVENCIONAL",
      "16FT7BD-8": "CONVENCIONAL FAIRTRADE",
      "MPBORG303-5": "ORGANICA FAIRTRADE",
      "STDSRA-7": "CONVENCIONAL"
    };
    const fieldLabels = {
      week: "Semana",
      cutDate: "Dia corte",
      farm: "Finca",
      sector: "Sector",
      group: "Grupo",
      client: "Cliente",
      reference: "Referencia",
      pallets: "Pallets",
      boxes: "Cajas por pallet",
      bunches: "Racimos",
      direct: "Directo",
      line: "Linea",
      version: "Version",
      observation: "Observaciones"
    };
    const persistedFields = Object.keys(fieldLabels);
    const editableExisting = new Set(["client", "reference", "pallets", "boxes", "observation"]);
    let tempSequence = 0;
    let nextCodeSequence = 4;
    let lastFocusedControl = null;

    const records = [
      {
        id: "cut-001", code: "AC-2026-030-01", week: "SEM-2026-30", cutDate: "2026-07-23",
        farm: "FINCA LA ESPERANZA", sector: "SECTOR 01", group: "GRUPO NORTE", client: "FYFFES",
        reference: "AGSTDRA", fruitClass: "CONVENCIONAL", pallets: 120, boxes: 54, bunches: 5400,
        direct: "No", line: "MAERSK", version: "AC-01", materials: "Calculado", status: "CREADO",
        observation: "Planificacion inicial sin novedades.", lockReason: "",
        audit: ["Creado por planeacion.admin · 22/07/2026 08:15"],
        dirty: false, isNew: false, isEditing: false, invalidFields: new Set()
      },
      {
        id: "cut-002", code: "AC-2026-031-02", week: "SEM-2026-31", cutDate: "2026-07-28",
        farm: "FINCA SANTA ISABEL", sector: "ZONA EMPAQUE", group: "GRUPO CENTRO", client: "DOLE",
        reference: "MPBORG303-5", fruitClass: "ORGANICA FAIRTRADE", pallets: 88, boxes: 48, bunches: 3960,
        direct: "Si", line: "MSC", version: "AC-02", materials: "Pedido generado", status: "PROGRAMADO",
        observation: "Transporte confirmado para entrega directa.",
        lockReason: "El aviso ya genero pedido de materiales y programacion de transporte.",
        audit: ["Transporte programado por planeacion.supervisor · 22/07/2026 10:45", "Creado por planeacion.admin · 21/07/2026 09:10"],
        dirty: false, isNew: false, isEditing: false, invalidFields: new Set()
      },
      {
        id: "cut-003", code: "AC-2026-031-03", week: "SEM-2026-31", cutDate: "2026-07-30",
        farm: "FINCA LOS ALMENDROS", sector: "SECTOR 04", group: "GRUPO SUR", client: "CHIQUITA",
        reference: "STDSRA-7", fruitClass: "CONVENCIONAL", pallets: 148, boxes: 54, bunches: 6120,
        direct: "No", line: "HAPAG-LLOYD", version: "AC-03", materials: "Pedido generado", status: "EN_CARGUE",
        observation: "Contenedor actualmente en proceso de cargue.",
        lockReason: "El contenedor asociado se encuentra en EN_CARGUE. La correccion requiere flujo formal de novedad.",
        audit: ["Inicio de cargue registrado por finca.operador · 23/07/2026 07:30", "Creado por planeacion.auxiliar · 21/07/2026 11:20"],
        dirty: false, isNew: false, isEditing: false, invalidFields: new Set()
      }
    ];

    const snapshot = (record) => persistedFields.reduce((result, field) => {
      result[field] = record[field];
      return result;
    }, {});
    records.forEach((record) => { record.original = snapshot(record); });

    const refs = {
      search: qs("[data-cut-search]"),
      week: qs("[data-cut-filter-week]"),
      farm: qs("[data-cut-filter-farm]"),
      status: qs("[data-cut-filter-status]"),
      visibleCount: qs("[data-cut-visible-count]"),
      changeCount: qs("[data-cut-change-count]"),
      statusbar: qs("[data-cut-statusbar]"),
      save: qs("[data-cut-save]"),
      discard: qs("[data-cut-discard]"),
      empty: qs("[data-cut-empty]"),
      success: qs("[data-cut-feedback-success]"),
      error: qs("[data-cut-feedback-error]"),
      errorText: qs("[data-cut-feedback-error-text]"),
      pastePanel: qs("[data-cut-paste-panel]"),
      pasteInput: qs("[data-cut-paste-input]"),
      detailDrawer: qs("#detailDrawer"),
      detailBackdrop: qs("#detailBackdrop"),
      confirmBackdrop: qs("[data-cut-confirm-backdrop]"),
      confirmDialog: qs("[data-cut-confirm-dialog]"),
      diffBody: qs("[data-cut-diff-body]"),
      reason: qs("[data-cut-change-reason]"),
      reasonNote: qs("[data-cut-reason-note]"),
      reasonRequired: qs("[data-cut-reason-required]")
    };

    const escapeHtml = (value) => String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    const formatNumber = (value) => Number(value || 0).toLocaleString("es-CO");
    const formatDate = (value) => {
      if (!value) return "-";
      const [year, month, day] = String(value).split("-");
      return year && month && day ? `${day}/${month}/${year}` : value;
    };
    const parsePastedDate = (value) => {
      const match = String(value || "").trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : "";
    };
    const weekForDate = (date) => date >= "2026-07-27" && date <= "2026-08-02" ? "SEM-2026-31" : "SEM-2026-30";
    const totalBoxes = (record) => Number(record.pallets || 0) * Number(record.boxes || 0);
    const canEdit = (record) => record.status === "CREADO" && !record.lockReason;
    const isEditable = (record, field) => record.isEditing && (record.isNew || editableExisting.has(field));

    const optionsHtml = (values, selected, placeholder) => {
      const empty = placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : "";
      return empty + values.map((value) => `<option value="${escapeHtml(value)}"${String(value) === String(selected) ? " selected" : ""}>${escapeHtml(value)}</option>`).join("");
    };
    const controlHtml = (record, field, type = "text", values = []) => {
      const value = record[field] ?? "";
      if (!isEditable(record, field)) {
        const displayValue = field === "cutDate" ? formatDate(value) : value;
        return `<span class="cut-cell-value" title="${escapeHtml(displayValue || "-")}">${escapeHtml(displayValue || "-")}</span>`;
      }
      const errorClass = record.invalidFields.has(field) ? " is-error" : "";
      const label = fieldLabels[field] || field;
      if (type === "select") {
        return `<select class="select cut-cell-control${errorClass}" data-cut-field="${field}" aria-label="${escapeHtml(label)}">${optionsHtml(values, value, `Seleccionar ${label.toLowerCase()}`)}</select>`;
      }
      return `<input class="input cut-cell-control${errorClass}" data-cut-field="${field}" aria-label="${escapeHtml(label)}" type="${type}" value="${escapeHtml(value)}"${type === "number" ? ' min="1"' : ""} />`;
    };
    const statusClass = (status) => status === "CREADO" ? "status-active" : status === "PROGRAMADO" ? "status-warning" : "status-inactive";
    const editingState = (record) => {
      if (record.invalidFields.size) return { label: `${record.invalidFields.size} CAMPOS POR CORREGIR`, className: "status-inactive" };
      if (record.dirty) return { label: "CAMBIO PENDIENTE", className: "status-warning" };
      if (record.isEditing) return { label: "EN EDICION", className: "status-warning" };
      if (!canEdit(record) && !record.isNew) return { label: "BLOQUEADO", className: "status-inactive" };
      return { label: "GUARDADO", className: "status-active" };
    };
    const codeCellHtml = (record) => {
      const code = `<span class="cut-cell-value cut-code-cell">${escapeHtml(record.code || "NUEVO")}</span>`;
      if (statePresentation !== "code") return code;
      const state = editingState(record);
      return `<div class="cut-code-stack">${code}<span class="status ${state.className}">${escapeHtml(state.label)}</span></div>`;
    };
    const displayedStatusHtml = (record) => {
      if (statePresentation === "column" && (record.dirty || record.isEditing)) {
        const state = editingState(record);
        return `<span class="status ${state.className}">${escapeHtml(state.label)}</span>`;
      }
      return `<span class="status ${statusClass(record.status)}">${escapeHtml(record.status)}</span>`;
    };
    const materialHtml = (record) => {
      const className = record.materials === "Pendiente recalculo" ? "status-warning" : "status-active";
      return `<span class="status ${className}">${escapeHtml(record.materials)}</span>`;
    };
    const rowActionsHtml = (record) => {
      const view = `<button class="icon-btn" type="button" data-cut-action="view" aria-label="Ver detalle de ${escapeHtml(record.code || "nuevo aviso")}" title="Ver detalle"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>`;
      if (record.isNew) {
        return `${view}<button class="icon-btn danger" type="button" data-cut-action="remove" aria-label="Eliminar nueva fila" title="Eliminar fila"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg></button>`;
      }
      if (!canEdit(record)) {
        return `${view}<button class="icon-btn is-locked" type="button" data-cut-action="locked" aria-label="Aviso bloqueado" title="${escapeHtml(record.lockReason)}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg></button>`;
      }
      const label = record.isEditing ? "Finalizar edicion de fila" : "Editar aviso";
      const icon = record.isEditing ? '<path d="M20 6 9 17l-5-5"></path>' : '<path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>';
      return `${view}<button class="icon-btn" type="button" data-cut-action="edit" aria-label="${label}" title="${label}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icon}</svg></button>`;
    };
    const rowHtml = (record) => {
      const rowClasses = [statePresentation === "column" && record.dirty ? "state-updated is-dirty" : "", record.isNew ? "is-new" : "", !canEdit(record) && !record.isNew ? "is-locked" : ""].filter(Boolean).join(" ");
      return `
        <tr class="${rowClasses}" data-cut-row="${escapeHtml(record.id)}">
          <td class="cut-sticky-code" data-cut-code-cell>${codeCellHtml(record)}</td>
          <td>${controlHtml(record, "week", "select", catalogs.weeks)}</td>
          <td>${controlHtml(record, "cutDate", "date")}</td>
          <td>${controlHtml(record, "farm", "select", catalogs.farms)}</td>
          <td>${controlHtml(record, "sector", "select", catalogs.sectors)}</td>
          <td>${controlHtml(record, "group", "select", catalogs.groups)}</td>
          <td>${controlHtml(record, "client", "select", catalogs.clients)}</td>
          <td>${controlHtml(record, "reference", "select", catalogs.references)}</td>
          <td><span class="cut-cell-value" data-cut-derived-class>${escapeHtml(record.fruitClass || "-")}</span></td>
          <td>${controlHtml(record, "pallets", "number")}</td>
          <td>${controlHtml(record, "boxes", "select", catalogs.boxes)}</td>
          <td><span class="cut-cell-value is-calculated" data-cut-total-boxes>${formatNumber(totalBoxes(record))}</span></td>
          <td>${controlHtml(record, "bunches", "number")}</td>
          <td>${controlHtml(record, "direct", "select", catalogs.direct)}</td>
          <td>${controlHtml(record, "line", "select", catalogs.lines)}</td>
          <td>${controlHtml(record, "version", "select", catalogs.versions)}</td>
          <td data-cut-material-cell>${materialHtml(record)}</td>
          <td data-cut-status-cell>${displayedStatusHtml(record)}</td>
          <td>${controlHtml(record, "observation", "text")}</td>
          <td><div class="row-actions cut-row-actions">${rowActionsHtml(record)}</div></td>
        </tr>`;
    };
    const matchesFilters = (record) => {
      const search = String(refs.search?.value || "").trim().toLowerCase();
      const haystack = [record.code, record.farm, record.client, record.reference, record.observation].join(" ").toLowerCase();
      return (!search || haystack.includes(search))
        && (refs.week?.value === "all" || record.week === refs.week?.value)
        && (refs.farm?.value === "all" || record.farm === refs.farm?.value)
        && (refs.status?.value === "all" || record.status === refs.status?.value);
    };
    const getVisibleRecords = () => records.filter(matchesFilters);

    const updateSummary = () => {
      const visible = getVisibleRecords();
      const dirty = records.filter((record) => record.dirty);
      const pallets = visible.reduce((sum, record) => sum + Number(record.pallets || 0), 0);
      const boxes = visible.reduce((sum, record) => sum + totalBoxes(record), 0);
      const alerts = visible.filter((record) => record.dirty || record.lockReason || record.materials === "Pendiente recalculo").length;
      const values = [
        ["[data-cut-stat-records]", visible.length],
        ["[data-cut-stat-pallets]", pallets],
        ["[data-cut-stat-boxes]", boxes],
        ["[data-cut-stat-alerts]", alerts]
      ];
      values.forEach(([selector, value]) => { const node = qs(selector); if (node) node.textContent = formatNumber(value); });
      if (refs.visibleCount) refs.visibleCount.textContent = `${visible.length} ${visible.length === 1 ? "fila" : "filas"}`;
      const changeLabel = statePresentation === "bar"
        ? (dirty.length ? `${dirty.length} ${dirty.length === 1 ? "fila con cambios sin guardar" : "filas con cambios sin guardar"}` : "No hay cambios pendientes")
        : (dirty.length ? `${dirty.length} ${dirty.length === 1 ? "fila modificada" : "filas modificadas"}` : "Sin cambios pendientes");
      if (refs.changeCount) refs.changeCount.textContent = changeLabel;
      qsa("[data-cut-save], [data-cut-bar-save]").forEach((button) => {
        button.disabled = !dirty.length;
        button.textContent = dirty.length ? `Guardar cambios (${dirty.length})` : "Guardar cambios";
      });
      qsa("[data-cut-discard], [data-cut-bar-discard]").forEach((button) => button.classList.toggle("is-hidden", !dirty.length));
      refs.statusbar?.classList.toggle("has-changes", Boolean(dirty.length));
    };
    const bindCellEvents = () => {
      qsa("[data-cut-field]", body).forEach((control) => {
        const update = () => {
          const row = control.closest("[data-cut-row]");
          const record = records.find((item) => item.id === row?.dataset.cutRow);
          if (!record) return;
          const field = control.dataset.cutField;
          record[field] = control.type === "number" ? Number(control.value || 0) : control.value;
          record.dirty = true;
          record.invalidFields.delete(field);
          control.classList.remove("is-error");
          if (field === "reference") {
            record.fruitClass = referenceClasses[record.reference] || "";
            const node = qs("[data-cut-derived-class]", row);
            if (node) node.textContent = record.fruitClass || "-";
          }
          if (["reference", "pallets", "boxes"].includes(field)) {
            record.materials = "Pendiente recalculo";
            const node = qs("[data-cut-material-cell]", row);
            if (node) node.innerHTML = materialHtml(record);
          }
          if (["pallets", "boxes"].includes(field)) {
            const node = qs("[data-cut-total-boxes]", row);
            if (node) node.textContent = formatNumber(totalBoxes(record));
          }
          if (statePresentation === "column") {
            const statusCell = qs("[data-cut-status-cell]", row);
            if (statusCell) statusCell.innerHTML = displayedStatusHtml(record);
          }
          if (statePresentation === "code") {
            const codeCell = qs("[data-cut-code-cell]", row);
            if (codeCell) codeCell.innerHTML = codeCellHtml(record);
          }
          if (statePresentation === "column") row?.classList.add("state-updated", "is-dirty");
          refs.success?.classList.add("is-hidden");
          refs.error?.classList.add("is-hidden");
          updateSummary();
        };
        control.addEventListener(control.tagName === "SELECT" ? "change" : "input", update);
        control.addEventListener("keydown", (event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          const controls = qsa("[data-cut-field]", control.closest("[data-cut-row]"));
          controls[controls.indexOf(control) + 1]?.focus();
        });
      });
    };
    const render = () => {
      const visible = getVisibleRecords();
      body.innerHTML = visible.map(rowHtml).join("");
      refs.empty?.classList.toggle("show", !visible.length);
      bindCellEvents();
      updateSummary();
    };

    const newRecord = (defaults = {}) => ({
      id: `cut-new-${++tempSequence}`, code: "",
      week: defaults.week || (refs.week?.value !== "all" ? refs.week.value : "SEM-2026-30"),
      cutDate: defaults.cutDate || "", farm: defaults.farm || "", sector: defaults.sector || "",
      group: defaults.group || "GRUPO NORTE", client: defaults.client || "", reference: defaults.reference || "",
      fruitClass: referenceClasses[defaults.reference] || "", pallets: Number(defaults.pallets || 0),
      boxes: Number(defaults.boxes || 0), bunches: Number(defaults.bunches || 0), direct: defaults.direct || "No",
      line: defaults.line || "MAERSK", version: defaults.version || "AC-01", materials: "Pendiente recalculo",
      status: "CREADO", observation: defaults.observation || "", lockReason: "", audit: [],
      dirty: true, isNew: true, isEditing: true, invalidFields: new Set(), original: {}
    });
    const focusFirstNewControl = () => window.setTimeout(() => qs('[data-cut-row^="cut-new"] [data-cut-field]')?.focus(), 0);
    const validateRecord = (record) => {
      const required = ["week", "cutDate", "farm", "sector", "group", "client", "reference", "pallets", "boxes", "bunches", "line", "version"];
      record.invalidFields = new Set(required.filter((field) => !String(record[field] ?? "").trim()));
      ["pallets", "boxes", "bunches"].forEach((field) => { if (Number(record[field] || 0) <= 0) record.invalidFields.add(field); });
      return record.invalidFields.size === 0;
    };
    const collectDiffs = (record) => {
      if (record.isNew) return [{ field: "Nuevo aviso", before: "No existe", after: `${record.farm || "Finca pendiente"} · ${record.reference || "Referencia pendiente"}` }];
      return persistedFields.flatMap((field) => String(record.original[field] ?? "") === String(record[field] ?? "") ? [] : [{
        field: fieldLabels[field], before: record.original[field] ?? "", after: record[field] ?? ""
      }]);
    };

    const closeConfirm = () => {
      if (refs.confirmBackdrop) refs.confirmBackdrop.hidden = true;
      if (refs.confirmDialog) refs.confirmDialog.hidden = true;
      refs.reason?.classList.remove("is-error");
      if (refs.reasonNote) refs.reasonNote.textContent = "Obligatorio cuando se modifica un aviso existente.";
      lastFocusedControl?.focus?.();
    };
    const openConfirm = () => {
      const dirty = records.filter((record) => record.dirty);
      if (!dirty.every(validateRecord)) {
        refs.error?.classList.remove("is-hidden");
        if (refs.errorText) refs.errorText.textContent = "Revisa las celdas obligatorias resaltadas antes de guardar.";
        render();
        qs(".cut-cell-control.is-error", body)?.focus();
        return;
      }
      const diffs = dirty.flatMap((record) => collectDiffs(record).map((diff) => ({ ...diff, code: record.code || "NUEVO" })));
      if (refs.diffBody) refs.diffBody.innerHTML = diffs.map((diff) => `
        <tr><td>${escapeHtml(diff.code)}</td><td>${escapeHtml(diff.field)}</td><td>${escapeHtml(diff.before || "-")}</td><td>${escapeHtml(diff.after || "-")}</td></tr>
      `).join("");
      const requiresReason = dirty.some((record) => !record.isNew);
      refs.reasonRequired?.classList.toggle("is-hidden", !requiresReason);
      if (refs.reasonNote) refs.reasonNote.textContent = requiresReason ? "Obligatorio porque se modifican avisos existentes." : "Opcional para la creacion inicial.";
      if (refs.reason) refs.reason.value = "";
      lastFocusedControl = document.activeElement;
      if (refs.confirmBackdrop) refs.confirmBackdrop.hidden = false;
      if (refs.confirmDialog) refs.confirmDialog.hidden = false;
      window.setTimeout(() => refs.reason?.focus(), 0);
    };
    const saveConfirmed = () => {
      const dirty = records.filter((record) => record.dirty);
      const reason = String(refs.reason?.value || "").trim();
      if (dirty.some((record) => !record.isNew) && !reason) {
        refs.reason?.classList.add("is-error");
        if (refs.reasonNote) refs.reasonNote.textContent = "Ingresa el motivo para conservar la trazabilidad del cambio.";
        refs.reason?.focus();
        return;
      }
      const now = new Date().toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
      dirty.forEach((record) => {
        const wasNew = record.isNew;
        if (wasNew) record.code = `AC-2026-${record.week.endsWith("31") ? "031" : "030"}-${String(nextCodeSequence++).padStart(2, "0")}`;
        record.materials = "Calculado";
        record.audit.unshift(wasNew ? `Creado por planeacion.actual · ${now}` : `Editado por planeacion.actual · ${now} · ${reason}`);
        record.isNew = false;
        record.isEditing = false;
        record.dirty = false;
        record.invalidFields = new Set();
        record.original = snapshot(record);
      });
      closeConfirm();
      refs.error?.classList.add("is-hidden");
      refs.success?.classList.remove("is-hidden");
      render();
      refs.success?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    const discardChanges = () => {
      for (let index = records.length - 1; index >= 0; index -= 1) {
        const record = records[index];
        if (record.isNew) { records.splice(index, 1); continue; }
        if (!record.dirty) continue;
        Object.assign(record, record.original);
        record.dirty = false;
        record.isEditing = false;
        record.invalidFields = new Set();
        record.fruitClass = referenceClasses[record.reference] || record.fruitClass;
        if (record.materials === "Pendiente recalculo") record.materials = "Calculado";
      }
      refs.error?.classList.add("is-hidden");
      refs.success?.classList.add("is-hidden");
      render();
    };

    const closeDetail = () => {
      refs.detailDrawer?.classList.remove("show");
      refs.detailBackdrop?.classList.remove("show");
      refs.detailDrawer?.setAttribute("aria-hidden", "true");
      lastFocusedControl?.focus?.();
    };
    const openDetail = (record) => {
      lastFocusedControl = document.activeElement;
      const title = qs("[data-cut-detail-title]");
      const description = qs("[data-cut-detail-description]");
      const summary = qs("[data-cut-detail-summary]");
      const lock = qs("[data-cut-detail-lock]");
      const impact = qs("[data-cut-detail-impact]");
      const audit = qs("[data-cut-detail-audit]");
      if (title) title.textContent = record.code || "Nueva fila";
      if (description) description.textContent = `${record.farm || "Finca pendiente"} · ${record.reference || "Referencia pendiente"}`;
      const details = [
        ["Semana", record.week], ["Dia de corte", formatDate(record.cutDate)], ["Cliente", record.client],
        ["Referencia", record.reference], ["Proyeccion", `${formatNumber(record.pallets)} pallets · ${formatNumber(totalBoxes(record))} cajas`],
        ["Estado", record.status]
      ];
      if (summary) summary.innerHTML = details.map(([label, value]) => `<div class="detail-group"><span class="detail-label">${escapeHtml(label)}</span><div class="detail-value">${escapeHtml(value || "-")}</div></div>`).join("");
      if (lock) {
        lock.classList.toggle("is-hidden", !record.lockReason);
        lock.textContent = record.lockReason || "";
      }
      const impacts = [
        ["Materiales", record.materials],
        ["Transporte", record.materials === "Pendiente recalculo" ? "Requiere revision" : record.status === "CREADO" ? "Sin programacion" : "Programacion asociada"],
        ["Contenedor", record.status === "EN_CARGUE" ? "Contenedor en EN_CARGUE" : "Sin bloqueo de contenedor"]
      ];
      if (impact) impact.innerHTML = impacts.map(([label, value]) => `<div class="detail-group"><span class="detail-label">${escapeHtml(label)}</span><div class="detail-value">${escapeHtml(value)}</div></div>`).join("");
      const entries = record.audit.length ? record.audit : ["Fila nueva sin historial guardado."];
      if (audit) audit.innerHTML = entries.map((entry) => `<div class="detail-group"><span class="detail-label">Trazabilidad</span><div class="detail-value">${escapeHtml(entry)}</div></div>`).join("");
      refs.detailDrawer?.classList.add("show");
      refs.detailBackdrop?.classList.add("show");
      refs.detailDrawer?.setAttribute("aria-hidden", "false");
      window.setTimeout(() => qs("#closeDetail")?.focus(), 0);
    };

    body.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cut-action]");
      if (!button) return;
      const record = records.find((item) => item.id === button.closest("[data-cut-row]")?.dataset.cutRow);
      if (!record) return;
      const action = button.dataset.cutAction;
      if (action === "view" || action === "locked") { openDetail(record); return; }
      if (action === "remove") {
        records.splice(records.indexOf(record), 1);
        render();
        return;
      }
      if (action === "edit") {
        record.isEditing = !record.isEditing;
        render();
        if (record.isEditing) window.setTimeout(() => qs(`[data-cut-row="${record.id}"] [data-cut-field]`)?.focus(), 0);
      }
    });
    qsa("[data-cut-add-row]").forEach((button) => button.addEventListener("click", () => {
      records.unshift(newRecord());
      refs.error?.classList.add("is-hidden");
      refs.success?.classList.add("is-hidden");
      render();
      focusFirstNewControl();
    }));
    qsa("[data-cut-toggle-paste]").forEach((button) => button.addEventListener("click", () => {
      refs.pastePanel?.classList.toggle("is-hidden");
      if (!refs.pastePanel?.classList.contains("is-hidden")) refs.pasteInput?.focus();
    }));
    qs("[data-cut-paste-cancel]")?.addEventListener("click", () => {
      refs.pastePanel?.classList.add("is-hidden");
      if (refs.pasteInput) refs.pasteInput.value = "";
    });
    qs("[data-cut-paste-apply]")?.addEventListener("click", () => {
      const raw = String(refs.pasteInput?.value || "").trim();
      if (!raw) { refs.pasteInput?.focus(); return; }
      const parsed = raw.split(/\r?\n/).filter(Boolean).map((line) => {
        const [dateValue, farm, sector, client, reference, pallets, boxes, bunches] = line.split("\t");
        const cutDate = parsePastedDate(dateValue);
        return newRecord({
          cutDate, week: weekForDate(cutDate), farm: String(farm || "").trim().toUpperCase(),
          sector: String(sector || "").trim().toUpperCase(), client: String(client || "").trim().toUpperCase(),
          reference: String(reference || "").trim().toUpperCase(), pallets: Number(pallets || 0),
          boxes: Number(boxes || 0), bunches: Number(bunches || 0)
        });
      });
      records.unshift(...parsed);
      if (refs.pasteInput) refs.pasteInput.value = "";
      refs.pastePanel?.classList.add("is-hidden");
      render();
      focusFirstNewControl();
    });
    [refs.search, refs.week, refs.farm, refs.status].forEach((control) => {
      if (control) control.addEventListener(control.tagName === "INPUT" ? "input" : "change", render);
    });
    qsa("[data-cut-save], [data-cut-bar-save]").forEach((button) => button.addEventListener("click", openConfirm));
    qsa("[data-cut-discard], [data-cut-bar-discard]").forEach((button) => button.addEventListener("click", discardChanges));
    qsa("[data-cut-confirm-close]").forEach((button) => button.addEventListener("click", closeConfirm));
    refs.confirmBackdrop?.addEventListener("click", closeConfirm);
    qs("[data-cut-confirm-save]")?.addEventListener("click", saveConfirmed);
    qs("#closeDetail")?.addEventListener("click", closeDetail);
    refs.detailBackdrop?.addEventListener("click", closeDetail);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (refs.confirmDialog && !refs.confirmDialog.hidden) closeConfirm();
      else if (refs.detailDrawer?.classList.contains("show")) closeDetail();
    });
    render();
  }

  window.SIALCutNoticeGrid = { init: initCutNoticeGrid };
})();
