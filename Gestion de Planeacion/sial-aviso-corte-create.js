(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const draftStorageKey = "sial-cut-notice-drafts-v1";

  const farms = {
    "LA CEIBA": { group: "AGROS", sector: "SECTOR 01", certifications: ["CONVENCIONAL", "FAIRTRADE"] },
    "MARTE": { group: "AGROS", sector: "SECTOR 02", certifications: ["CONVENCIONAL", "FAIRTRADE"] },
    "VIJAGUAL": { group: "AGROS", sector: "SECTOR 04", certifications: ["CONVENCIONAL", "FAIRTRADE", "ORGANICA FAIRTRADE"] },
    "CATALINA": { group: "BANAPALMA", sector: "ZONA CENTRO", certifications: ["CONVENCIONAL"] },
    "TAMACARA": { group: "BANEX", sector: "ZONA NORTE", certifications: ["CONVENCIONAL", "FAIRTRADE"] }
  };

  const references = {
    AGSTDRA: { className: "CONVENCIONAL", boxes: 54, package: "STD-RA", sealFactor: 1, clients: ["FYFFES", "DOLE"] },
    "20LD7RA": { className: "CONVENCIONAL", boxes: 55, package: "20L-RA", sealFactor: 1, clients: ["FYFFES", "CHIQUITA"] },
    "ALGFT18BD": { className: "FAIRTRADE", boxes: 54, package: "FT-18-BD", sealFactor: 1, clients: ["FYFFES"] },
    "MPBORG303": { className: "ORGANICA FAIRTRADE", boxes: 48, package: "ORG-303", sealFactor: 2, clients: ["DOLE"] },
    STDSRA: { className: "CONVENCIONAL", boxes: 54, package: "STD-RA", sealFactor: 1, clients: ["GLOBAL FRUIT EXPORT"] }
  };

  const clients = ["FYFFES", "DOLE", "CHIQUITA", "GLOBAL FRUIT EXPORT"];
  const lines = ["NORMAL", "STARCARE", "MAERSK", "HAPAG LLOYD"];
  const seedRows = [
    {
      id: "row-1", cutDate: "2026-08-03", farm: "LA CEIBA", group: "AGROS", sector: "SECTOR 01",
      client: "FYFFES", reference: "AGSTDRA", referenceVersion: 1, pallets: 18, boxes: 54, bunches: 820, direct: "No", line: "NORMAL"
    },
    {
      id: "row-2", cutDate: "2026-08-04", farm: "MARTE", group: "AGROS", sector: "SECTOR 02",
      client: "FYFFES", reference: "ALGFT18BD", referenceVersion: 1, pallets: 12, boxes: 54, bunches: 560, direct: "Sí", line: "STARCARE"
    },
    {
      id: "row-3", cutDate: "2026-08-05", farm: "VIJAGUAL", group: "AGROS", sector: "SECTOR 04",
      client: "DOLE", reference: "MPBORG303", referenceVersion: 1, pallets: 8, boxes: 48, bunches: 390, direct: "No", line: "NORMAL"
    }
  ];

  const seededDrafts = [
    {
      id: "draft-32-a", code: "BOR-2026-032-01", week: "SEM-2026-32", type: "Inicial",
      updated: "Hoy, 08:42", owner: "Planeación", rows: seedRows.slice(0, 2), missing: "1 referencia por confirmar"
    },
    {
      id: "draft-32-b", code: "BOR-2026-032-02", week: "SEM-2026-32", type: "Proyectado",
      updated: "Ayer, 16:20", owner: "Planeación", rows: seedRows.slice(1), missing: "Loading Plan sin conciliar"
    },
    {
      id: "draft-33-a", code: "BOR-2026-033-01", week: "SEM-2026-33", type: "Inicial",
      updated: "28/07/2026, 11:05", owner: "Planeación", rows: [], missing: "Sin asignaciones"
    }
  ];

  function initCutNoticeCreate() {
    const body = qs("[data-assignment-body]");
    if (!body) return;

    let rows = seedRows.map((row) => ({ ...row }));
    let rowSequence = rows.length;
    let sourceMode = "";
    let sourceStage = 1;
    let sourceFile = null;
    let fileProcessToken = 0;
    let importedRows = [];
    let loadingDemand = {};
    let validated = false;
    let published = false;
    let lastTrigger = null;
    let pendingAction = "publish";
    const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const visibleDays = new Set([0, 1, 2, 3, 4, 5, 6]);
    let mobileSelectedDay = 0;
    let weeklyGroups = [];
    let selectedWeeklyGroup = null;
    let weeklyMenuTrigger = null;
    let weeklyParent = null;
    let weeklyHoverTimer = 0;
    let weeklyUndo = null;
    let editingWeeklyCell = null;
    const columnFilters = { farm: null, reference: null, days: new Map(), total: "all" };
    let columnFilterTrigger = null;
    const route = new URLSearchParams(window.location.search);
    const routeMode = route.get("modo");
    const routeNotice = route.get("aviso");
    const blockedCorrectionReasons = {
      "AC-2026-031-02": "La programación de transporte ya inició. Esta versión está disponible únicamente para consulta.",
      "AC-2026-030-01": "La operación ya fue cerrada. Esta versión está disponible únicamente para trazabilidad."
    };
    const isBlockedCorrection = routeMode === "corregir" && Boolean(blockedCorrectionReasons[routeNotice]);
    const isCorrection = routeMode === "corregir" && !isBlockedCorrection;
    const isReadOnly = routeMode === "consultar" || isBlockedCorrection;
    const correctionEditableFields = new Set(["client", "reference", "pallets", "boxes"]);
    const correctionMetaByNotice = { "AC-2026-032": { originVersion: "Inicial · sin versión", nextVersion: "Versión 1", stage: "Preoperativa" }, "AC-2026-031-01": { originVersion: "Versión 1", nextVersion: "Versión 2", stage: "Preoperativa" } };
    const correctionMeta = correctionMetaByNotice[routeNotice] || { originVersion: "Versión publicada", nextVersion: "Nueva versión", stage: "Preoperativa" };
    const originalRows = rows.map((row) => ({ ...row }));

    const refs = {
      week: qs("#noticeWeek"),
      type: qs("#noticeType"),
      version: qs("#noticeVersion"),
      code: qs("[data-notice-code]"),
      state: qs("[data-draft-state]"),
      rowCount: qs("[data-row-count]"),
      validationSummary: qs("[data-validation-summary]"),
      publish: qs("[data-open-publish]"),
      backdrop: qs("[data-modal-backdrop]"),
      sourceDialog: qs("[data-source-dialog]"),
      draftsDialog: qs("[data-drafts-dialog]"),
      publishDialog: qs("[data-publish-dialog]"),
      sourceTitle: qs("[data-source-title]"),
      sourceDescription: qs("[data-source-description]"),
      sourceNext: qs("[data-source-next]"),
      sourceResult: qs("[data-source-result]"),
      loadingFile: qs("[data-loading-file]"),
      loadingZone: qs('[data-upload-zone="loading"]'),
      loadingSummary: qs("[data-loading-summary]"),
      loadingPreview: qs("[data-loading-preview]"),
      excelFile: qs("[data-excel-file]"),
      excelZone: qs('[data-upload-zone="excel"]'),
      excelSummary: qs("[data-excel-summary]"),
      excelMapping: qs("[data-excel-mapping]"),
      excelPreview: qs("[data-excel-preview]"),
      pasteInput: qs("[data-paste-input]"),
      draftsList: qs("[data-drafts-list]"),
      editContext: qs("[data-edit-context]"), editNotice: qs("[data-edit-notice]"),
      editOriginVersion: qs("[data-edit-origin-version]"), editNextVersion: qs("[data-edit-next-version]"), editStage: qs("[data-edit-stage]"),
      changeReason: qs("[data-change-reason]"), changeSummary: qs("[data-change-summary]"), publishChanges: qs("[data-publish-changes]")
    };
    const weekly = {
      head: qs("[data-week-head]"), body: qs("[data-week-body]"),
      date: qs("[data-week-date-picker]"), columns: qs("[data-week-column-options]"),
      mobileDay: qs("[data-week-mobile-day]"),
      reset: qs("[data-week-reset]"), tools: qs("[data-week-tools]"), filterSummary: qs("[data-week-filter-summary]"),
      columnMenu: qs("[data-week-column-menu]"),
      newForm: qs("[data-week-new-form]"), newFarm: qs("#cutNewFarm"), newReference: qs("#cutNewReference"),
      newClient: qs("#cutNewClient"), newReferenceVersion: qs("#cutNewReferenceVersion"), newError: qs("[data-week-new-error]"),
      editor: qs("[data-detail-editor]"), menu: qs("[data-week-menu]"), toast: qs("[data-week-toast]")
    };

    if (routeMode && routeNotice) {
      const title = qs("[data-create-title]");
      const eyebrow = qs("[data-create-eyebrow]");
      const subtitle = qs("[data-create-subtitle]");
      if (title) title.textContent = isCorrection ? "Preparar modificación" : isReadOnly ? "Consultar aviso de corte" : "Continuar borrador";
      if (eyebrow) eyebrow.textContent = `Avisos de corte / ${isCorrection ? "Modificación" : isReadOnly ? "Consulta" : "Edición"}`;
      if (subtitle) {
        subtitle.textContent = isCorrection
          ? "Revisa la versión publicada y prepara únicamente los cambios que formarán una nueva versión."
          : isBlockedCorrection
            ? blockedCorrectionReasons[routeNotice]
          : isReadOnly
            ? "Consulta las asignaciones y el impacto de esta versión publicada."
            : "Completa la información pendiente, valida las asignaciones y conserva el avance del borrador.";
      }
      refs.code.textContent = routeNotice;
      refs.state.textContent = isCorrection ? "Nueva versión" : isReadOnly ? "Publicado" : "Borrador guardado";
      refs.state.classList.remove("status-active", "status-warning", "status-inactive"); refs.state.classList.add(isReadOnly ? "status-active" : "status-warning");
      if (isReadOnly) published = true;
      if (isCorrection) {
        refs.type.value = "Modificación"; refs.version.value = correctionMeta.nextVersion; refs.editContext?.classList.remove("is-hidden");
        refs.editNotice.textContent = routeNotice; refs.editOriginVersion.textContent = correctionMeta.originVersion; refs.editNextVersion.textContent = correctionMeta.nextVersion; refs.editStage.textContent = correctionMeta.stage;
        qs(".cut-create-note span").textContent = "La versión publicada se conserva. Esta modificación creará una nueva versión del mismo aviso.";
        qs(".cut-source-card")?.classList.add("is-hidden"); qs("[data-open-drafts]")?.classList.add("is-hidden"); qs("[data-add-assignment]")?.classList.add("is-hidden");
        qs("[data-save-draft]").textContent = "Guardar modificación"; qs("[data-validate-notice]").textContent = "Validar cambios"; refs.publish.textContent = "Revisar cambios"; qs("[data-confirm-publish]").textContent = "Publicar nueva versión";
      }
    }

    const esc = (value) => String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    const formatNumber = (value) => Number(value || 0).toLocaleString("es-CO");
    const totalBoxes = (row) => Number(row.pallets || 0) * Number(row.boxes || 0);
    const unique = (values) => [...new Set(values.filter(Boolean))];
    const fieldLabels = { cutDate: "Día de corte", farm: "Finca", group: "Grupo", sector: "Sector", client: "Cliente", reference: "Referencia", referenceVersion: "Versión de referencia", pallets: "Palés", boxes: "Cajas por palé", bunches: "Racimos", direct: "Directo", line: "Línea" };
    const isFieldLocked = (field) => published || (isCorrection && !correctionEditableFields.has(field));
    const getChanges = () => {
      if (!isCorrection) return []; const changes = [];
      rows.forEach((row, index) => { const original = originalRows.find((item) => item.id === row.id) || originalRows[index]; if (!original) return; correctionEditableFields.forEach((field) => { if (String(row[field] ?? "") !== String(original[field] ?? "")) changes.push({ row: index + 1, farm: row.farm, field, label: fieldLabels[field], before: original[field], after: row[field] }); }); });
      return changes;
    };
    const options = (values, current, placeholder) => `${placeholder ? `<option value="">${esc(placeholder)}</option>` : ""}${values.map((value) => `<option value="${esc(value)}"${value === current ? " selected" : ""}>${esc(value)}</option>`).join("")}`;

    const getDrafts = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(draftStorageKey) || "[]");
        return Array.isArray(stored) && stored.length ? stored : seededDrafts;
      } catch {
        return seededDrafts;
      }
    };

    const saveDrafts = (drafts) => {
      localStorage.setItem(draftStorageKey, JSON.stringify(drafts));
      qsa("[data-draft-count]").forEach((node) => { node.textContent = String(drafts.length); });
    };

    const markChanged = () => {
      if (published) return;
      validated = false;
      refs.publish.disabled = true;
      refs.state.textContent = isCorrection ? "Cambios sin guardar" : "Borrador sin guardar";
      refs.state.classList.remove("status-active", "status-inactive"); refs.state.classList.add("status-warning");
      refs.validationSummary.classList.add("is-hidden");
    };

    function validateRows() {
      const results = new Map();
      rows.forEach((row) => results.set(row.id, { errors: [], warnings: [] }));

      rows.forEach((row) => {
        const result = results.get(row.id);
        const emptyCombination = row.farm && row.reference && !row.cutDate && Number(row.pallets || 0) === 0;
        const required = {
          cutDate: "día de corte", farm: "finca", reference: "referencia",
          referenceVersion: "versión de referencia", pallets: "palés"
        };
        Object.entries(required).forEach(([field, label]) => {
          if (emptyCombination && (field === "cutDate" || field === "pallets")) return;
          if (!String(row[field] ?? "").trim() || (["referenceVersion", "pallets"].includes(field) && Number(row[field]) <= 0)) {
            result.errors.push(`Falta ${label}.`);
          }
        });
        if (emptyCombination) result.errors.push("Escribe palés en al menos un día.");
        if (row.cutDate && !weeklyDates().includes(row.cutDate)) result.errors.push("El día de corte está fuera de la semana productiva elegida.");
        if (!Number.isInteger(Number(row.referenceVersion)) || Number(row.referenceVersion) < 1) result.errors.push("La versión de referencia debe ser un entero positivo.");

        const farm = farms[row.farm];
        const reference = references[row.reference];
        if (row.farm && !farm) result.errors.push("La finca no está activa en el alcance disponible.");
        if (row.reference && !reference) result.errors.push("La referencia no está activa.");
        if (farm && reference && !farm.certifications.includes(reference.className)) {
          result.errors.push(`La finca no cuenta con certificación ${reference.className}.`);
        }
        if (reference?.clients && row.client && !reference.clients.includes(row.client)) {
          result.errors.push(`La referencia ${row.reference} no está habilitada para ${row.client}.`);
        }
      });

      rows.forEach((row, index) => {
        const result = results.get(row.id);
        const duplicate = rows.find((candidate, candidateIndex) => candidateIndex !== index
          && candidate.cutDate === row.cutDate && candidate.farm === row.farm
          && candidate.reference === row.reference && Number(candidate.referenceVersion || 1) === Number(row.referenceVersion || 1));
        if (duplicate) result.errors.push("Asignación duplicada para la misma fecha, finca y referencia.");

        const ref = references[row.reference];
        const mixRisk = rows.find((candidate, candidateIndex) => {
          const candidateRef = references[candidate.reference];
          return candidateIndex !== index && candidate.farm === row.farm && candidate.cutDate === row.cutDate
            && candidate.reference !== row.reference && ref && candidateRef && ref.package === candidateRef.package;
        });
        if (mixRisk) result.warnings.push(`Riesgo de mezcla con ${mixRisk.reference}: comparten diseño de empaque.`);
      });

      return results;
    }

    function rowStatus(result) {
      if (result.errors.length) return `<span class="status status-inactive" data-sial-chip-adapter>${result.errors.length} por corregir</span>`;
      if (result.warnings.length) return `<span class="status status-warning" data-sial-chip-adapter>${result.warnings.length} advertencia</span>`;
      return `<span class="status status-active" data-sial-chip-adapter>Lista</span>`;
    }

    function rowTemplate(row, index, results) {
      const reference = references[row.reference];
      const result = results.get(row.id);
      const lock = (field) => isFieldLocked(field) ? " disabled" : "";
      const changed = (field) => isCorrection && getChanges().some((change) => change.row === index + 1 && change.field === field) ? " is-changed" : "";
      const issueTitle = [...result.errors, ...result.warnings].join(" ");
      return `
        <tr data-assignment-row="${esc(row.id)}"${result.errors.length ? ' class="has-errors"' : result.warnings.length ? ' class="has-warnings"' : ""}>
          <td class="cut-create-sticky"><strong>${index + 1}</strong></td>
          <td><input class="input cut-cell-control${changed("cutDate")}" type="date" data-field="cutDate" value="${esc(row.cutDate)}"${lock("cutDate")} /></td>
          <td><select class="select cut-cell-control${changed("farm")}" data-field="farm"${lock("farm")}>${options(Object.keys(farms), row.farm, "Seleccionar")}</select></td>
          <td><input class="input cut-cell-control${changed("group")}" data-field="group" value="${esc(row.group)}"${lock("group")} /></td>
          <td><input class="input cut-cell-control${changed("sector")}" data-field="sector" value="${esc(row.sector)}"${lock("sector")} /></td>
          <td><select class="select cut-cell-control${changed("client")}" data-field="client"${lock("client")}>${options(clients, row.client, "Seleccionar")}</select></td>
          <td><select class="select cut-cell-control${changed("reference")}" data-field="reference"${lock("reference")}>${options(Object.keys(references), row.reference, "Seleccionar")}</select></td>
          <td><input class="input cut-cell-control${changed("referenceVersion")}" type="number" min="1" step="1" data-field="referenceVersion" value="${esc(row.referenceVersion || 1)}"${lock("referenceVersion")} /></td>
          <td><span class="cut-cell-value">${esc(reference?.className || "-")}</span></td>
          <td><input class="input cut-cell-control${changed("pallets")}" type="number" min="0.001" step="0.001" data-field="pallets" value="${esc(row.pallets)}"${lock("pallets")} /></td>
          <td><input class="input cut-cell-control${changed("boxes")}" type="number" min="1" data-field="boxes" value="${esc(row.boxes)}"${lock("boxes")} /></td>
          <td><span class="cut-cell-value is-calculated">${formatNumber(totalBoxes(row))}</span></td>
          <td><input class="input cut-cell-control${changed("bunches")}" type="number" min="1" data-field="bunches" value="${esc(row.bunches)}"${lock("bunches")} /></td>
          <td><select class="select cut-cell-control${changed("direct")}" data-field="direct"${lock("direct")}>${options(["No", "Sí"], row.direct)}</select></td>
          <td><select class="select cut-cell-control${changed("line")}" data-field="line"${lock("line")}>${options(lines, row.line)}</select></td>
          <td title="${esc(issueTitle)}">${rowStatus(result)}</td>
          <td><div class="row-actions"><button class="icon-btn danger" type="button" data-remove-row aria-label="Eliminar fila ${index + 1}" title="Eliminar fila"${published || isCorrection ? " disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5"></path></svg></button></div></td>
        </tr>`;
    }

    function renderImpact(results) {
      const pallets = rows.reduce((sum, row) => sum + Number(row.pallets || 0), 0);
      const boxes = rows.reduce((sum, row) => sum + totalBoxes(row), 0);
      const seals = rows.reduce((sum, row) => sum + totalBoxes(row) * Number(references[row.reference]?.sealFactor || 1), 0);
      const trips = Math.ceil(pallets / 20);
      const errors = [...results.values()].reduce((sum, result) => sum + result.errors.length, 0);
      const warnings = [...results.values()].reduce((sum, result) => sum + result.warnings.length, 0);
      const demand = Object.values(loadingDemand).reduce((sum, value) => sum + Number(value || 0), 0);
      const coverage = demand ? Math.round((boxes / demand) * 100) : 0;

      qs("[data-impact-boxes]").textContent = formatNumber(boxes);
      qs("[data-impact-pallets]").textContent = formatNumber(pallets);
      qs("[data-impact-cartons]").textContent = formatNumber(boxes);
      qs("[data-impact-seals]").textContent = formatNumber(seals);
      qs("[data-impact-trips]").textContent = formatNumber(trips);
      qs("[data-impact-coverage]").textContent = demand ? `${coverage}% del Loading Plan asignado` : "Sin Loading Plan cargado";

      const alerts = qs("[data-impact-alerts]");
      const items = [];
      if (errors) items.push(`<div class="cut-impact-warning is-blocking"><span>${errors}</span><p><strong>Bloqueos</strong><small>Deben resolverse antes de publicar.</small></p></div>`);
      if (warnings) items.push(`<div class="cut-impact-warning"><span>${warnings}</span><p><strong>Advertencias</strong><small>Revisa posibles mezclas de empaque.</small></p></div>`);
      if (demand && coverage < 100) items.push(`<div class="cut-impact-warning"><span>${100 - coverage}%</span><p><strong>Pendiente por asignar</strong><small>Comparado con el Loading Plan.</small></p></div>`);
      alerts.innerHTML = items.join("") || '<div class="cut-impact-ready"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span>Sin impactos pendientes por revisar.</span></div>';
    }

    function renderSummary(results) {
      const pallets = rows.reduce((sum, row) => sum + Number(row.pallets || 0), 0);
      const boxes = rows.reduce((sum, row) => sum + totalBoxes(row), 0);
      const blockers = [...results.values()].reduce((sum, result) => sum + result.errors.length, 0);
      refs.rowCount.textContent = `${rows.length} ${rows.length === 1 ? "fila" : "filas"}`;
      qs("[data-status-farms]").textContent = String(unique(rows.map((row) => row.farm)).length);
      qs("[data-status-pallets]").textContent = formatNumber(pallets);
      qs("[data-status-boxes]").textContent = formatNumber(boxes);
      qs("[data-status-blockers]").textContent = formatNumber(blockers);
      renderImpact(results);
    }

    function bindRowEvents() {
      qsa("[data-assignment-row]", body).forEach((tableRow) => {
        const row = rows.find((item) => item.id === tableRow.dataset.assignmentRow);
        if (!row) return;
        qsa("[data-field]", tableRow).forEach((control) => {
          control.setAttribute("aria-label", `${fieldLabels[control.dataset.field]} · fila ${rows.indexOf(row) + 1}`);
          const update = () => {
            const field = control.dataset.field;
            row[field] = control.type === "number" ? Number(control.value || 0) : control.value;
            if (field === "farm" && farms[row.farm]) {
              row.group = farms[row.farm].group;
              row.sector = farms[row.farm].sector;
            }
            if (field === "reference" && references[row.reference]) row.boxes = references[row.reference].boxes;
            markChanged();
            render();
          };
          control.addEventListener(control.tagName === "SELECT" ? "change" : "input", update);
          control.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            event.preventDefault();
            const controls = qsa("[data-field]", tableRow);
            controls[controls.indexOf(control) + 1]?.focus();
          });
        });
        qs("[data-remove-row]", tableRow)?.addEventListener("click", () => {
          rows = rows.filter((item) => item.id !== row.id);
          markChanged();
          render();
        });
      });
    }

    function renderChangeSummary() {
      if (!isCorrection || !refs.changeSummary) return;
      const changes = getChanges(); refs.changeSummary.classList.remove("is-hidden");
      if (!changes.length) { refs.changeSummary.className = "cut-change-summary is-empty"; refs.changeSummary.innerHTML = "<strong>Aún no hay cambios</strong><span>Modifica un campo permitido para preparar la nueva versión.</span>"; return; }
      const materials = changes.some((change) => ["reference", "pallets", "boxes"].includes(change.field)); const transport = changes.some((change) => ["pallets", "boxes"].includes(change.field));
      refs.changeSummary.className = "cut-change-summary";
      refs.changeSummary.innerHTML = `<div class="cut-change-summary-head"><div><strong>${changes.length} ${changes.length === 1 ? "cambio preparado" : "cambios preparados"}</strong><span>Se publicarán como ${esc(correctionMeta.nextVersion)} sin reemplazar ${esc(correctionMeta.originVersion)}.</span></div><span class="status ${validated ? "status-active" : "status-warning"}" data-sial-chip-adapter>${validated ? "Validado" : "Pendiente de validar"}</span></div><div class="cut-change-list">${changes.slice(0, 6).map((change) => `<div><span>Fila ${change.row} · ${esc(change.farm)} · ${esc(change.label)}</span><del>${esc(change.before)}</del><b aria-hidden="true">→</b><ins>${esc(change.after)}</ins></div>`).join("")}${changes.length > 6 ? `<small>Y ${changes.length - 6} cambios más.</small>` : ""}</div><div class="cut-change-impact"><span><strong>Materiales:</strong> ${materials ? "recalcular sugerencias" : "sin cambios"}.</span><span><strong>Transporte:</strong> ${transport ? "revisar capacidad" : "sin cambios"}.</span></div>`;
    }

    function render() {
      const focused = body.contains(document.activeElement) ? document.activeElement : null;
      const focusedRow = focused?.closest("[data-assignment-row]")?.dataset.assignmentRow;
      const focusedField = focused?.dataset.field;
      const selection = focused && typeof focused.selectionStart === "number"
        ? [focused.selectionStart, focused.selectionEnd] : null;
      const results = validateRows();
      const visibleIds = new Set(buildWeeklyGroups().filter((group) => weeklyGroupMatchesFilters(group, weeklyDates())).flatMap((group) => group.rows.map((row) => row.id)));
      const detailRows = rows.filter((row) => visibleIds.has(row.id));
      body.innerHTML = detailRows.length
        ? detailRows.map((row) => rowTemplate(row, rows.indexOf(row), results)).join("")
        : `<tr><td colspan="17"><div class="empty-state show">${rows.length ? "No hay asignaciones para estos filtros." : "Aún no hay asignaciones. Agrega una fila o carga información existente."}</div></td></tr>`;
      bindRowEvents();
      if (focusedRow && focusedField) {
        const restoredRow = qsa("[data-assignment-row]", body).find((element) => element.dataset.assignmentRow === focusedRow);
        const restored = restoredRow && qsa("[data-field]", restoredRow).find((element) => element.dataset.field === focusedField);
        restored?.focus({ preventScroll: true });
        if (restored && selection) restored.setSelectionRange(...selection);
      }
      renderSummary(results); renderChangeSummary();
      renderWeekly(results);
      weekly.editor.classList.toggle("is-filter-empty", rows.length > 0 && detailRows.length === 0);
      qs("[data-detail-filter-empty]").hidden = !(rows.length > 0 && detailRows.length === 0);
      const active = columnFilters.farm || columnFilters.reference || columnFilters.days.size || columnFilters.total !== "all";
      if (active) refs.rowCount.textContent = `${detailRows.length} de ${rows.length} filas`;
      qsa("[data-header-field]").forEach((control) => { control.disabled = published || isCorrection; });
      qsa("[data-add-assignment], [data-source]").forEach((button) => { button.disabled = published || isCorrection; });
      qsa("[data-save-draft], [data-validate-notice]").forEach((button) => { button.disabled = published; });
    }

    function newRow(defaults = {}) {
      rowSequence += 1;
      const farm = defaults.farm || "";
      const reference = defaults.reference || "";
      return {
        id: `row-${rowSequence}`, cutDate: defaults.cutDate || "", farm,
        group: defaults.group || farms[farm]?.group || "", sector: defaults.sector || farms[farm]?.sector || "",
        client: defaults.client || "", reference, referenceVersion: Number(defaults.referenceVersion || 1), pallets: Number(defaults.pallets || 0),
        boxes: Number(defaults.boxes || references[reference]?.boxes || 0), bunches: Number(defaults.bunches || 0),
        direct: defaults.direct || "No", line: defaults.line || "NORMAL"
      };
    }

    function mondayForWeek() {
      const match = refs.week.value.match(/(\d{4})-(\d{1,2})$/);
      if (!match) return new Date("2026-08-03T12:00:00");
      const jan4 = new Date(Number(match[1]), 0, 4, 12);
      jan4.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7) + (Number(match[2]) - 1) * 7);
      return jan4;
    }
    function weeklyDates() {
      const monday = mondayForWeek();
      return weekDays.map((_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      });
    }
    function buildWeeklyGroups() {
      const groups = new Map();
      rows.forEach((row) => {
        const key = row.farm && row.reference
          ? [row.farm, row.reference, row.referenceVersion || 1].join("\u001f") : row.id;
        if (!groups.has(key)) groups.set(key, { key, farm: row.farm, reference: row.reference, version: row.referenceVersion || 1, rows: [] });
        groups.get(key).rows.push(row);
      });
      return [...groups.values()];
    }
    function weeklyGroupMatchesFilters(group, dates) {
      if (columnFilters.farm && !columnFilters.farm.has(group.farm)) return false;
      if (columnFilters.reference && !columnFilters.reference.has(group.reference)) return false;
      const total = group.rows.filter((row) => dates.includes(row.cutDate)).reduce((sum, row) => sum + Number(row.pallets || 0), 0);
      if (columnFilters.total === "filled" && total <= 0) return false;
      if (columnFilters.total === "empty" && total > 0) return false;
      for (const [date, mode] of columnFilters.days) {
        const filled = group.rows.some((row) => row.cutDate === date && Number(row.pallets) > 0);
        if (mode === "filled" && !filled || mode === "empty" && filled) return false;
      }
      return true;
    }
    function renderWeekly(results) {
      if (!weekly.body) return;
      const dates = weeklyDates();
      const displayedDays = window.matchMedia("(max-width: 720px)").matches ? new Set([mobileSelectedDay]) : visibleDays;
      weekly.mobileDay.innerHTML = weekDays.map((day, index) => `<option value="${index}">${day} · ${dates[index].slice(8)}/${dates[index].slice(5, 7)}</option>`).join("");
      weekly.mobileDay.value = String(mobileSelectedDay);
      weeklyGroups = buildWeeklyGroups();
      weekly.columns.innerHTML = weekDays.map((day, index) => `<label><input type="checkbox" data-week-day="${index}" ${visibleDays.has(index) ? "checked" : ""} />${day}</label>`).join("");
      weekly.head.innerHTML = `<tr><th scope="col" class="cut-week-sticky"><button class="cut-week-head-filter${columnFilters.farm ? " is-filtered" : ""}" type="button" data-column-filter="farm" aria-label="Filtrar columna finca">Finca <span>⌄</span></button></th><th scope="col" class="cut-week-reference"><button class="cut-week-head-filter${columnFilters.reference ? " is-filtered" : ""}" type="button" data-column-filter="reference" aria-label="Filtrar columna referencia">Referencia <span>⌄</span></button></th>${weekDays.map((day, index) => displayedDays.has(index) ? `<th scope="col" class="cut-week-day" data-week-date="${dates[index]}"><button class="cut-week-head-filter${columnFilters.days.has(dates[index]) ? " is-filtered" : ""}" type="button" data-column-filter="day" data-filter-date="${dates[index]}" aria-label="Filtrar ${day} ${dates[index]}">${day}<small>${dates[index].slice(8)}/${dates[index].slice(5, 7)}</small></button></th>` : "").join("")}<th scope="col"><button class="cut-week-head-filter${columnFilters.total !== "all" ? " is-filtered" : ""}" type="button" data-column-filter="total" aria-label="Filtrar total">Total <span>⌄</span></button></th></tr>`;
      qsa(".cut-detail-head-filter").forEach((button) => button.classList.toggle("is-filtered", Boolean(columnFilters[button.dataset.columnFilter])));
      const shown = weeklyGroups.filter((group) => weeklyGroupMatchesFilters(group, dates));
      weekly.body.innerHTML = shown.length ? shown.map((group) => {
        const index = weeklyGroups.indexOf(group);
        const groupResults = group.rows.map((row) => results.get(row.id)).filter(Boolean);
        const errors = groupResults.reduce((sum, result) => sum + result.errors.length, 0);
        const warnings = groupResults.reduce((sum, result) => sum + result.warnings.length, 0);
        const meta = unique(group.rows.map((row) => [row.client, row.boxes, row.group, row.sector].join("|"))).length > 1;
        const total = group.rows.filter((row) => dates.includes(row.cutDate)).reduce((sum, row) => sum + Number(row.pallets || 0), 0);
        const cells = dates.map((date, day) => {
          if (!displayedDays.has(day)) return "";
          const assignment = group.rows.find((row) => row.cutDate === date);
          const label = `${weekDays[day]} ${date}, ${group.farm || "finca pendiente"}, ${group.reference || "referencia pendiente"}`;
          if (assignment) return `<td class="cut-week-quantity"><input class="input" type="number" min="0.001" step="0.001" data-week-quantity="${esc(assignment.id)}" aria-label="Palés · ${esc(label)}" value="${esc(assignment.pallets)}"${isFieldLocked("pallets") ? " disabled" : ""} /></td>`;
          return `<td class="cut-week-quantity is-empty">${published || isCorrection || !group.farm || !group.reference ? '<span aria-label="Sin programación">—</span>' : `<input class="input" type="number" min="0.001" step="0.001" data-week-new="${index}" data-week-date="${date}" aria-label="Palés · ${esc(label)}" placeholder="—" />`}</td>`;
        }).join("");
        const emptyCombination = group.rows.every((row) => !row.cutDate);
        const status = emptyCombination ? '<span class="cut-week-inline-status is-warning">Sin días</span>' : errors ? `<span class="cut-week-inline-status is-error">${errors} por corregir</span>` : warnings || meta ? `<span class="cut-week-inline-status is-warning">${warnings + Number(meta)} advertencia</span>` : "";
        const cellEditor = (field, value, values, locked = false) => editingWeeklyCell?.key === group.key && editingWeeklyCell.field === field
          ? `<select class="select cut-week-cell-select" data-week-cell-select="${field}" data-week-group="${index}" aria-label="${field === "farm" ? "Finca" : "Referencia"}">${options(values, value, "Seleccionar")}</select>`
          : locked ? `<strong>${esc(value || "Por completar")}</strong>` : `<button class="cut-week-cell-value" type="button" data-week-edit-cell="${field}" data-week-group="${index}" aria-label="Cambiar ${field === "farm" ? "finca" : "referencia"}">${esc(value || "Por completar")} <span>⌄</span></button>`;
        return `<tr data-week-group="${index}" tabindex="0" aria-label="${esc(group.farm || "Finca pendiente")}, ${esc(group.reference || "referencia pendiente")}, ${total} palés. Mayús más F10 para acciones."><td class="cut-week-sticky">${cellEditor("farm", group.farm, Object.keys(farms), published || isReadOnly || isCorrection)}<small>${esc(group.rows[0].group || "Selecciona la finca en detalles")}</small><div class="cut-week-mobile-reference">${cellEditor("reference", group.reference, Object.keys(references), published || isReadOnly)}</div>${status}<button class="cut-week-more" type="button" data-week-more="${index}" aria-label="Más acciones para ${esc(group.farm || "finca pendiente")} y ${esc(group.reference || "referencia pendiente")}" aria-haspopup="menu" aria-expanded="false">⋯</button></td><td class="cut-week-reference">${cellEditor("reference", group.reference, Object.keys(references), published || isReadOnly)}${meta ? '<small>Datos variables por día</small>' : `<small>${esc(group.rows[0].client || "Cliente pendiente")} · ref. v${esc(group.version)}</small>`}</td>${cells}<td class="cut-week-total">${formatNumber(total)}</td></tr>`;
      }).join("") : `<tr><td colspan="${displayedDays.size + 3}"><div class="empty-state show">No hay combinaciones para estos filtros.</div></td></tr>`;
      const shownCount = shown.reduce((count, group) => count + group.rows.length, 0);
      qs("[data-detail-count]").textContent = `· ${shownCount === rows.length ? shownCount : `${shownCount} de ${rows.length}`} asignaciones`;
      const selectedDate = weekly.date.value && dates.includes(weekly.date.value) ? weekly.date.value : dates[0];
      weekly.date.value = selectedDate;
      qsa("[data-week-date]", weekly.head).forEach((head) => head.classList.toggle("is-selected", head.dataset.weekDate === selectedDate));
      const activeFilters = Number(Boolean(columnFilters.farm)) + Number(Boolean(columnFilters.reference)) + columnFilters.days.size + Number(columnFilters.total !== "all") + (visibleDays.size < 7 ? 1 : 0) + Number(selectedDate !== dates[0]);
      weekly.reset.hidden = activeFilters === 0;
      weekly.filterSummary.textContent = activeFilters ? `· ${activeFilters} activo${activeFilters === 1 ? "" : "s"}` : "";
    }

    function weeklyToast(message, undo = null) {
      weeklyUndo = undo;
      weekly.toast.innerHTML = `<span>${esc(message)}</span>${undo ? '<button type="button" data-week-undo>Deshacer</button>' : ""}`;
      weekly.toast.hidden = false;
      clearTimeout(weeklyToast.timer);
      weeklyToast.timer = setTimeout(() => { weekly.toast.hidden = true; weeklyUndo = null; }, 5000);
    }

    function closeColumnFilter(restoreFocus = false) {
      if (weekly.columnMenu.hidden) return;
      weekly.columnMenu.hidden = true;
      if (restoreFocus && columnFilterTrigger?.isConnected) columnFilterTrigger.focus({ preventScroll: true });
      columnFilterTrigger = null;
    }
    function openColumnFilter(field, trigger, date = "") {
      closeWeeklyMenu(false);
      columnFilterTrigger = trigger;
      const title = field === "farm" ? "Finca" : field === "reference" ? "Referencia" : field === "total" ? "Total de palés" : `${weekDays[weeklyDates().indexOf(date)]} · ${date}`;
      weekly.columnMenu.dataset.field = field;
      weekly.columnMenu.dataset.date = date;
      if (field === "farm" || field === "reference") {
        const values = unique(weeklyGroups.map((group) => group[field] || "(Vacío)"));
        const selected = columnFilters[field];
        weekly.columnMenu.innerHTML = `<div class="cut-week-column-title">Filtrar ${esc(title)}</div><input class="input cut-week-column-search" type="search" placeholder="Buscar ${field === "farm" ? "finca" : "referencia"}" aria-label="Buscar valor" /><div class="cut-week-column-options-list">${values.map((value) => `<label><input type="checkbox" data-filter-value="${esc(value)}" ${!selected || selected.has(value) ? "checked" : ""} /><span>${esc(value)}</span></label>`).join("")}</div><div class="cut-week-column-footer"><button type="button" data-filter-clear>Limpiar</button><button class="btn btn-primary" type="button" data-filter-apply>Aplicar</button></div>`;
      } else {
        const selected = field === "total" ? columnFilters.total : columnFilters.days.get(date) || "all";
        weekly.columnMenu.innerHTML = `<div class="cut-week-column-title">Filtrar ${esc(title)}</div><div class="cut-week-column-options-list">${[["all", "Todos"], ["filled", "Con palés"], ["empty", "Sin palés"]].map(([value, label]) => `<label><input type="radio" name="cut-column-mode" value="${value}" ${selected === value ? "checked" : ""} /><span>${label}</span></label>`).join("")}</div><div class="cut-week-column-footer"><button type="button" data-filter-clear>Limpiar</button><button class="btn btn-primary" type="button" data-filter-apply>Aplicar</button></div>`;
      }
      weekly.columnMenu.hidden = false;
      const rect = trigger.getBoundingClientRect();
      const width = weekly.columnMenu.offsetWidth;
      const height = weekly.columnMenu.offsetHeight;
      weekly.columnMenu.style.left = `${Math.max(12, Math.min(rect.left, innerWidth - width - 12))}px`;
      weekly.columnMenu.style.top = `${Math.max(12, Math.min(rect.bottom + 5, innerHeight - height - 12))}px`;
      qs("input", weekly.columnMenu)?.focus({ preventScroll: true });
    }
    function applyColumnFilter(clear = false) {
      const field = weekly.columnMenu.dataset.field;
      const date = weekly.columnMenu.dataset.date;
      if (field === "farm" || field === "reference") {
        const checks = qsa("[data-filter-value]", weekly.columnMenu);
        const selected = new Set(checks.filter((check) => check.checked).map((check) => check.dataset.filterValue));
        columnFilters[field] = clear || selected.size === checks.length ? null : selected;
      } else {
        const mode = clear ? "all" : qs('input[name="cut-column-mode"]:checked', weekly.columnMenu)?.value || "all";
        if (field === "total") columnFilters.total = mode;
        else if (mode === "all") columnFilters.days.delete(date);
        else columnFilters.days.set(date, mode);
      }
      closeColumnFilter(true);
      render();
    }

    const compactWeeklyMenu = () => window.matchMedia("(max-width: 720px)").matches;
    const weeklyRootItems = () => qsa('.cut-week-menu-root [role="menuitem"]', weekly.menu);
    const weeklyChildItems = () => qsa('.cut-week-submenu [role="menuitem"]', weekly.menu);
    function closeWeeklySubmenu(restoreFocus = false) {
      clearTimeout(weeklyHoverTimer);
      const child = qs(".cut-week-submenu", weekly.menu);
      if (!child || child.hidden) return;
      child.hidden = true;
      weekly.menu.classList.remove("is-drilled");
      weeklyParent?.setAttribute("aria-expanded", "false");
      if (restoreFocus || child.contains(document.activeElement)) weeklyParent?.focus({ preventScroll: true });
      weeklyParent = null;
    }
    function closeWeeklyMenu(restoreFocus = true) {
      if (weekly.menu.hidden) return;
      clearTimeout(weeklyHoverTimer);
      closeWeeklySubmenu();
      weekly.menu.hidden = true;
      weekly.menu.classList.remove("is-drilled");
      qsa("[data-week-group]", weekly.body).forEach((node) => node.classList.remove("is-active"));
      if (weeklyMenuTrigger?.matches?.("button")) weeklyMenuTrigger.setAttribute("aria-expanded", "false");
      if (restoreFocus && weeklyMenuTrigger?.isConnected) weeklyMenuTrigger.focus({ preventScroll: true });
      weeklyMenuTrigger = null;
      selectedWeeklyGroup = null;
    }
    function weeklyActions(group) {
      const dates = weeklyDates();
      const dayLinks = weekDays.map((day, index) => ({ label: `${day} · ${dates[index].slice(8)}/${dates[index].slice(5, 7)}`, action: "focus", date: dates[index] }));
      return [
        { label: "Ver datos de la fila", action: "details" },
        { label: "Ir a un día", children: dayLinks },
        { label: "Copiar finca y referencia", action: "copy" },
        ...(!published && !isCorrection ? [{ label: "Quitar fila del borrador", action: "remove-group" }] : [])
      ];
    }
    function weeklyActionButton(action, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "cut-week-menu-item";
      button.setAttribute("role", "menuitem");
      button.innerHTML = `<span>${esc(action.label)}</span><span>${action.children ? "›" : ""}</span>`;
      if (action.children) {
        button.dataset.weekSubmenu = String(index);
        button.setAttribute("aria-haspopup", "menu");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", "cutWeekSubmenu");
      } else {
        button.dataset.weekAction = action.action;
        if (action.date) button.dataset.weekDate = action.date;
      }
      return button;
    }
    function openWeeklySubmenu(parent, focus = false) {
      clearTimeout(weeklyHoverTimer);
      if (weeklyParent && weeklyParent !== parent) closeWeeklySubmenu();
      const action = weeklyActions(selectedWeeklyGroup)[Number(parent.dataset.weekSubmenu)];
      if (!action?.children) return;
      const child = qs(".cut-week-submenu", weekly.menu);
      qs(".cut-week-submenu-title", child).textContent = action.label;
      qs(".cut-week-submenu-list", child).replaceChildren(...action.children.map(weeklyActionButton));
      child.hidden = false;
      weeklyParent = parent;
      parent.setAttribute("aria-expanded", "true");
      if (compactWeeklyMenu()) weekly.menu.classList.add("is-drilled");
      else {
        const rootRect = weekly.menu.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        const right = rootRect.right + child.offsetWidth - 6 <= innerWidth - 12;
        child.style.left = right ? "calc(100% - 6px)" : "auto";
        child.style.right = right ? "auto" : "calc(100% - 6px)";
        child.style.top = `${Math.max(0, Math.min(parentRect.top - rootRect.top - 6, innerHeight - rootRect.top - child.offsetHeight - 12))}px`;
      }
      if (focus) weeklyChildItems()[0]?.focus({ preventScroll: true });
    }
    function openWeeklyMenu(group, x, y, source, input = "pointer") {
      closeWeeklyMenu(false);
      selectedWeeklyGroup = group;
      weeklyMenuTrigger = source;
      weekly.menu.dataset.input = input;
      weekly.menu.setAttribute("aria-label", `Acciones de ${group.farm || "finca pendiente"} y ${group.reference || "referencia pendiente"}`);
      const root = document.createElement("div");
      root.className = "cut-week-menu-root";
      const heading = document.createElement("div");
      heading.className = "cut-week-menu-heading";
      heading.textContent = `${group.farm || "Finca pendiente"} · ${group.reference || "Referencia pendiente"}`;
      root.append(heading, ...weeklyActions(group).map(weeklyActionButton));
      const child = document.createElement("div");
      child.id = "cutWeekSubmenu";
      child.className = "cut-week-submenu";
      child.setAttribute("role", "menu");
      child.hidden = true;
      child.innerHTML = '<button type="button" class="cut-week-menu-back">← Volver</button><div class="cut-week-submenu-title"></div><div class="cut-week-submenu-list"></div>';
      weekly.menu.replaceChildren(root, child);
      weekly.menu.hidden = false;
      const width = weekly.menu.offsetWidth, height = weekly.menu.offsetHeight;
      weekly.menu.style.left = `${Math.max(12, Math.min(x, innerWidth - width - 12))}px`;
      weekly.menu.style.top = `${Math.max(12, Math.min(y, innerHeight - height - 12))}px`;
      const surface = source.closest("[data-week-group]");
      surface?.classList.add("is-active");
      if (source.matches("button")) source.setAttribute("aria-expanded", "true");
      weeklyRootItems()[0]?.focus({ preventScroll: true });
    }
    async function runWeeklyAction(action, date = "") {
      const group = selectedWeeklyGroup;
      closeWeeklyMenu(false);
      if (!group) return;
      if (action === "details") {
        weekly.editor.scrollIntoView({ block: "start", behavior: "smooth" });
        const first = group.rows[0];
        setTimeout(() => qs(`[data-assignment-row="${first.id}"] [data-field="farm"]`)?.focus({ preventScroll: true }), 120);
      }
      if (action === "focus") {
        const day = weeklyDates().indexOf(date);
        if (day < 0) return;
        mobileSelectedDay = day;
        visibleDays.add(day);
        renderWeekly(validateRows());
        const index = weeklyGroups.findIndex((item) => item.key === group.key);
        const cell = qsa("[data-week-date]", weekly.body).find((input) => input.dataset.weekDate === date && input.closest("[data-week-group]")?.dataset.weekGroup === String(index))
          || qsa("[data-week-quantity]", weekly.body).find((input) => group.rows.some((row) => row.id === input.dataset.weekQuantity && row.cutDate === date));
        cell?.focus({ preventScroll: true });
        cell?.scrollIntoView({ block: "nearest", inline: "center" });
      }
      if (action === "remove-group" && !published && !isCorrection) {
        const previous = group.rows.map((row) => ({ ...row }));
        const ids = new Set(previous.map((row) => row.id));
        rows = rows.filter((row) => !ids.has(row.id));
        markChanged(); render();
        weeklyToast(`Fila ${group.farm} · ${group.reference} quitada del borrador.`, () => { rows.push(...previous); markChanged(); render(); });
      }
      if (action === "copy") {
        try { await navigator.clipboard.writeText(`${group.farm} · ${group.reference}`); weeklyToast("Finca y referencia copiadas."); }
        catch { weeklyToast(`${group.farm} · ${group.reference}`); }
      }
    }

    function parseDate(value) {
      const text = String(value || "").trim();
      const match = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      return match ? `${match[3]}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}` : text;
    }

    function parsePastedRows(raw) {
      return String(raw || "").trim().split(/\r?\n/).filter(Boolean).map((line) => {
        const [cutDate, farm, group, sector, client, reference, pallets, boxes, bunches] = line.split("\t");
        return newRow({
          cutDate: parseDate(cutDate), farm: String(farm || "").trim().toUpperCase(),
          group: String(group || "").trim().toUpperCase(), sector: String(sector || "").trim().toUpperCase(),
          client: String(client || "").trim().toUpperCase(), reference: String(reference || "").trim().toUpperCase(),
          pallets, boxes, bunches
        });
      });
    }

    function parseDelimitedLine(line, delimiter) {
      const cells = [];
      let cell = "";
      let quoted = false;
      for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        if (char === '"' && quoted && line[index + 1] === '"') { cell += '"'; index += 1; continue; }
        if (char === '"') { quoted = !quoted; continue; }
        if (char === delimiter && !quoted) { cells.push(cell.trim()); cell = ""; continue; }
        cell += char;
      }
      cells.push(cell.trim());
      return cells;
    }

    function parseDelimitedNumber(value) {
      const normalized = String(value ?? "").replace(/\s/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
      const number = Number(normalized);
      return Number.isFinite(number) ? number : 0;
    }

    async function parseDelimitedFile(file, mode) {
      const text = await file.text();
      const firstLine = text.split(/\r?\n/, 1)[0] || "";
      const delimiter = [";", ",", "\t"].reduce((best, candidate) => firstLine.split(candidate).length > firstLine.split(best).length ? candidate : best, ";");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return [];
      const headers = parseDelimitedLine(lines[0].replace(/^\uFEFF/, ""), delimiter).map((header) => header.trim().toLowerCase());
      const find = (...aliases) => headers.findIndex((header) => aliases.includes(header));
      const columns = {
        date: find("día de corte", "dia de corte", "fecha", "fecha corte"),
        farm: find("finca", "farm"),
        group: find("grupo", "grupo_gral"),
        sector: find("sector", "zona"),
        client: find("cliente"),
        reference: find("referencia", "marca"),
        referenceVersion: find("versión referencia", "version referencia", "version_ref", "versionref"),
        pallets: find("palés", "pales", "pallets", "cantidad pallets"),
        boxes: find("cajas por palé", "cajas por pale", "cajas_x_pallet"),
        bunches: find("racimos", "racimos estimados"),
        demand: find("pedido", "cantidad", "cajas solicitadas")
      };
      if (mode === "loading") {
        return lines.slice(1).map((line) => {
          const cells = parseDelimitedLine(line, delimiter);
          return { reference: cells[columns.reference] || "", demand: parseDelimitedNumber(cells[columns.demand]), client: cells[columns.client] || "FYFFES" };
        }).filter((row) => row.reference);
      }
      return lines.slice(1).map((line) => {
        const cells = parseDelimitedLine(line, delimiter);
        return newRow({
          cutDate: parseDate(cells[columns.date]), farm: String(cells[columns.farm] || "").trim().toUpperCase(),
          group: String(cells[columns.group] || "").trim().toUpperCase(), sector: String(cells[columns.sector] || "").trim().toUpperCase(),
          client: String(cells[columns.client] || "").trim().toUpperCase(), reference: String(cells[columns.reference] || "").trim().toUpperCase(),
          referenceVersion: columns.referenceVersion >= 0 ? cells[columns.referenceVersion] : 1,
          pallets: parseDelimitedNumber(cells[columns.pallets]), boxes: parseDelimitedNumber(cells[columns.boxes]), bunches: parseDelimitedNumber(cells[columns.bunches])
        });
      });
    }

    function mappingTemplate() {
      const pairs = [
        ["Día de corte", "Fecha de Corte"], ["Finca", "Finca"], ["Grupo", "Grupo_Gral"],
        ["Sector", "Zona"], ["Cliente", "Cliente"], ["Referencia", "Referencia"],
        ["Palés", "Cantidad Pallets"], ["Cajas / palé", "Cajas_x_Pallet"], ["Racimos", "Racimos estimados"]
      ];
      return pairs.map(([target, source]) => `<div><span>${esc(source)}</span><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"></path></svg><strong>${esc(target)}</strong></div>`).join("");
    }

    function previewTable(data, mode) {
      if (mode === "loading") {
        return `<div class="cut-preview-head"><strong>${data.length} referencias detectadas</strong><span>Pedido del cliente</span></div>
          <table><thead><tr><th>Cliente</th><th>Referencia</th><th>Cajas solicitadas</th><th>Estado</th></tr></thead>
          <tbody>${data.map((row) => `<tr><td>${esc(row.client)}</td><td>${esc(row.reference)}</td><td>${formatNumber(row.demand)}</td><td><span class="status status-active" data-sial-chip-adapter>Reconocida</span></td></tr>`).join("")}</tbody></table>`;
      }
      const results = validateRowsFor(data);
      return `<div class="cut-preview-head"><strong>${data.length} filas listas para importar</strong><span>Se agregarán al borrador</span></div>
        <table><thead><tr><th>Fecha</th><th>Finca</th><th>Referencia</th><th>Palés</th><th>Validación</th></tr></thead>
        <tbody>${data.map((row) => {
          const result = results.get(row.id);
          return `<tr><td>${esc(row.cutDate)}</td><td>${esc(row.farm)}</td><td>${esc(row.reference)}</td><td>${formatNumber(row.pallets)}</td><td>${rowStatus(result)}</td></tr>`;
        }).join("")}</tbody></table>`;
    }

    function validateRowsFor(candidateRows) {
      const previousRows = rows;
      rows = candidateRows;
      const results = validateRows();
      rows = previousRows;
      return results;
    }

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

    const fileNodes = (mode) => mode === "loading"
      ? { input: refs.loadingFile, zone: refs.loadingZone, summary: refs.loadingSummary, preview: refs.loadingPreview }
      : { input: refs.excelFile, zone: refs.excelZone, summary: refs.excelSummary, preview: refs.excelPreview };

    function clearFileUi(mode) {
      const nodes = fileNodes(mode);
      if (nodes.input) nodes.input.value = "";
      nodes.zone?.classList.remove("is-hidden", "is-error", "is-dragging");
      if (nodes.summary) {
        nodes.summary.className = "cut-file-summary is-hidden";
        nodes.summary.innerHTML = "";
      }
      nodes.preview?.classList.add("is-hidden");
      if (mode === "excel") refs.excelMapping?.classList.add("is-hidden");
    }

    function resetSourceDialog() {
      fileProcessToken += 1;
      sourceStage = 1;
      sourceFile = null;
      importedRows = [];
      clearFileUi("loading");
      clearFileUi("excel");
      if (refs.pasteInput) refs.pasteInput.value = "";
    }

    function removeSourceFile(mode) {
      fileProcessToken += 1;
      sourceStage = 1;
      sourceFile = null;
      importedRows = [];
      clearFileUi(mode);
      refs.sourceNext.disabled = true;
      refs.sourceNext.textContent = "Selecciona un archivo";
      window.setTimeout(() => fileNodes(mode).zone?.focus(), 0);
    }

    function renderFileState(mode, state, file, detail = "") {
      const { zone, summary } = fileNodes(mode);
      if (!summary) return;
      const states = {
        uploading: { title: "Cargando archivo", stage: "Preparando la carga…", badge: "Cargando", progress: 34, status: "chip" },
        analyzing: { title: "Analizando estructura", stage: "Reconociendo hojas, columnas y registros…", badge: "Analizando", progress: 76, status: "chip" },
        ready: { title: "Archivo listo", stage: "Puedes revisar los datos antes de agregarlos.", badge: "Listo", progress: 100, status: "status status-active" },
        error: { title: "Archivo no válido", stage: "Remuévelo y selecciona un archivo compatible.", badge: "Revisar", progress: 100, status: "status status-inactive" }
      };
      const current = states[state];
      const actionLabel = state === "uploading" || state === "analyzing" ? "Cancelar carga" : "Remover";
      const size = file?.size ? `${(file.size / 1024).toFixed(1)} KB` : "Archivo seleccionado";
      zone?.classList.add("is-hidden");
      summary.className = `cut-file-summary is-${state}`;
      summary.innerHTML = `
        <div class="cut-file-summary-main">
          <span class="cut-file-visual" aria-hidden="true">
            <svg class="icon" viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"></path><path d="M9 11h6M9 15h5"></path></svg>
          </span>
          <span class="cut-file-copy">
            <strong>${esc(file?.name || "Archivo")}</strong>
            <small>${esc(size)}${detail ? ` · ${esc(detail)}` : ""}</small>
          </span>
          <span class="${current.status}">${current.badge}</span>
          <button class="btn btn-ghost cut-file-remove" data-sial-button-adapter type="button" data-remove-source-file="${mode}">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>
            ${actionLabel}
          </button>
        </div>
        <div class="cut-file-progress" aria-hidden="true"><span style="width:${current.progress}%"></span></div>
        <div class="cut-file-stage"><strong>${current.title}</strong><span>${current.stage}</span></div>`;
      qs("[data-remove-source-file]", summary)?.addEventListener("click", () => removeSourceFile(mode));
    }

    function openModal(dialog, trigger) {
      lastTrigger = trigger || document.activeElement;
      refs.backdrop.hidden = false;
      dialog.hidden = false;
      document.body.classList.add("modal-open");
      requestAnimationFrame(() => requestAnimationFrame(() => modalControls(dialog)[0]?.focus()));
    }

    function modalControls(dialog) {
      return qsa('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]', dialog)
        .filter(element => element.getClientRects().length && !element.closest('.sial-native-proxy, [hidden], .is-hidden'));
    }

    function closeModals() {
      if (!refs.sourceDialog.hidden) fileProcessToken += 1;
      refs.backdrop.hidden = true;
      [refs.sourceDialog, refs.draftsDialog, refs.publishDialog].forEach((dialog) => { dialog.hidden = true; });
      document.body.classList.remove("modal-open");
      const trigger = lastTrigger?.classList.contains("sial-native-proxy")
        ? lastTrigger.previousElementSibling?.querySelector("button") : lastTrigger;
      requestAnimationFrame(() => trigger?.isConnected && trigger.focus());
    }

    function openSource(mode, trigger) {
      sourceMode = mode;
      resetSourceDialog();
      qsa("[data-source-loading], [data-source-excel], [data-source-paste]", refs.sourceDialog).forEach((panel) => panel.classList.add("is-hidden"));
      qs(`[data-source-${mode}]`, refs.sourceDialog).classList.remove("is-hidden");
      const copy = {
        loading: ["Cargar Loading Plan", "Compara el pedido recibido con las asignaciones del borrador.", "Analizar archivo"],
        excel: ["Importar aviso desde CSV", "Lee y valida las asignaciones antes de agregarlas al borrador.", "Analizar archivo"],
        paste: ["Pegar filas desde Excel", "Las filas tabuladas se validarán antes de agregarlas.", "Agregar al borrador"]
      }[mode];
      refs.sourceTitle.textContent = copy[0];
      refs.sourceDescription.textContent = copy[1];
      refs.sourceNext.textContent = mode === "paste" ? copy[2] : "Selecciona un archivo";
      refs.sourceNext.disabled = mode !== "paste";
      openModal(refs.sourceDialog, trigger);
    }

    async function prepareFile(mode, file) {
      const token = ++fileProcessToken;
      const allowed = mode === "excel" ? /\.csv$/i.test(file.name) : /\.(csv|tsv)$/i.test(file.name);
      if (!allowed || file.size > 10 * 1024 * 1024) {
        sourceFile = null;
        importedRows = [];
        renderFileState(mode, "error", file, allowed ? "supera el máximo de 10 MB" : "formato no compatible");
        refs.sourceNext.disabled = true;
        refs.sourceNext.textContent = "Selecciona otro archivo";
        return;
      }

      sourceFile = file;
      importedRows = [];
      sourceStage = 1;
      refs.sourceNext.disabled = true;
      refs.sourceNext.textContent = "Cargando…";
      renderFileState(mode, "uploading", file);
      const parse = parseDelimitedFile(file, mode === "loading" ? "loading" : "excel");

      try {
        await wait(420);
        if (token !== fileProcessToken) return;
        refs.sourceNext.textContent = "Analizando…";
        renderFileState(mode, "analyzing", file);
        const [parsed] = await Promise.all([parse, wait(680)]);
        if (token !== fileProcessToken) return;
        if (!parsed.length) throw new Error("Archivo sin filas");
        importedRows = parsed;
        const detail = mode === "loading"
          ? `${importedRows.length} referencias detectadas`
          : `${importedRows.length} filas detectadas`;
        renderFileState(mode, "ready", file, detail);
        refs.sourceNext.disabled = false;
        refs.sourceNext.textContent = "Revisar datos";
      } catch {
        if (token !== fileProcessToken) return;
        sourceFile = null;
        importedRows = [];
        renderFileState(mode, "error", file, "no fue posible leer su estructura");
        refs.sourceNext.disabled = true;
        refs.sourceNext.textContent = "Selecciona otro archivo";
      }
    }

    async function handleSourceNext() {
      if (sourceMode === "paste") {
        const parsed = parsePastedRows(refs.pasteInput.value);
        if (!parsed.length) {
          refs.pasteInput.classList.add("is-error");
          refs.pasteInput.setAttribute("aria-invalid", "true");
          window.CompanyFeedback?.show("No hay filas para agregar", "warning", "Pega las columnas separadas por tabulaciones.");
          refs.pasteInput.focus();
          return;
        }
        refs.pasteInput.removeAttribute("aria-invalid");
        refs.pasteInput.classList.remove("is-error");
        rows.push(...parsed);
        markChanged();
        closeModals();
        showSourceResult(`${parsed.length} filas pegadas y agregadas al borrador.`);
        render();
        return;
      }

      if (!sourceFile) {
        const input = sourceMode === "loading" ? refs.loadingFile : refs.excelFile;
        input.focus();
        input.closest(".cut-upload-zone").classList.add("is-error");
        return;
      }

      if (sourceStage === 1) {
        sourceStage = 2;
        const preview = sourceMode === "loading" ? refs.loadingPreview : refs.excelPreview;
        preview.innerHTML = `<div class="table-wrap" data-sial-table-adapter="materials" data-sial-local-pagination data-sial-table-min-width="640px">${previewTable(importedRows, sourceMode)}</div>`;
        preview.classList.remove("is-hidden");
        if (sourceMode === "excel") {
          refs.excelMapping.classList.toggle("is-hidden", /\.(csv|tsv)$/i.test(sourceFile.name));
          qs("[data-mapping-grid]").innerHTML = mappingTemplate();
        }
        refs.sourceNext.textContent = sourceMode === "loading" ? "Usar Loading Plan" : "Importar al borrador";
        return;
      }

      if (sourceMode === "loading") {
        loadingDemand = importedRows.reduce((result, row) => {
          result[row.reference] = Number(row.demand || 0);
          return result;
        }, {});
        showSourceResult(`Loading Plan cargado: ${importedRows.length} referencias listas para comparar.`);
      } else {
        rows.push(...importedRows);
        markChanged();
        showSourceResult(`${importedRows.length} filas importadas desde Excel. Revisa las validaciones antes de publicar.`);
      }
      closeModals();
      render();
    }

    function showSourceResult(message) {
      refs.sourceResult.classList.add("is-hidden");
      window.CompanyFeedback?.show("Información agregada", "success", message);
    }

    function saveDraft() {
      const drafts = getDrafts();
      const current = {
        id: "draft-current", code: `BOR-${refs.week.value.replace("SEM-", "").replace("-", "-")}-UI`,
        week: refs.week.value, type: refs.type.value, updated: "Ahora", owner: "Planeación",
        rows: rows.map((row) => ({ ...row })), missing: `${[...validateRows().values()].reduce((sum, result) => sum + result.errors.length, 0)} campos por revisar`
      };
      const index = drafts.findIndex((draft) => draft.id === current.id);
      if (index >= 0) drafts[index] = current;
      else drafts.unshift(current);
      try { saveDrafts(drafts); }
      catch { window.CompanyFeedback?.show("No se pudo guardar el borrador", "error", "Inténtalo nuevamente."); return; }
      refs.state.textContent = "Borrador guardado";
      refs.state.classList.remove("status-warning", "status-inactive"); refs.state.classList.add("status-active");
      qs("[data-last-saved]").textContent = "Guardado ahora";
      window.CompanyFeedback?.show("Borrador guardado", "success", "Puedes retomarlo desde Borradores.");
    }

    function renderDrafts() {
      const drafts = getDrafts();
      saveDrafts(drafts);
      refs.draftsList.innerHTML = drafts.map((draft) => `
        <article class="cut-draft-item">
          <div class="cut-draft-icon"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"></path><path d="M9 11h6M9 15h5"></path></svg></div>
          <div class="cut-draft-content">
            <div><strong>${esc(draft.code)}</strong><span class="status status-warning" data-sial-chip-adapter>Incompleto</span></div>
            <p>${esc(draft.week)} · ${esc(draft.type)} · ${draft.rows.length} asignaciones</p>
            <small>${esc(draft.missing)} · Actualizado ${esc(draft.updated)}</small>
          </div>
          <button class="btn btn-secondary" data-sial-button-adapter type="button" data-resume-draft="${esc(draft.id)}">Retomar</button>
        </article>
      `).join("");
      qsa("[data-resume-draft]", refs.draftsList).forEach((button) => {
        button.addEventListener("click", () => {
          const draft = drafts.find((item) => item.id === button.dataset.resumeDraft);
          if (!draft) return;
          rows = draft.rows.map((row) => ({ ...row, referenceVersion: Number(row.referenceVersion || 1), id: `row-${++rowSequence}` }));
          refs.week.value = draft.week;
          refs.type.value = draft.type;
          refs.version.value = "Sin versión";
          markChanged();
          closeModals();
          render();
        });
      });
    }

    function runValidation() {
      const results = validateRows();
      const errors = [...results.values()].flatMap((result) => result.errors);
      const warnings = [...results.values()].flatMap((result) => result.warnings);
      const changes = getChanges();
      const reasonMissing = isCorrection && !refs.changeReason.value.trim();
      const changesMissing = isCorrection && changes.length === 0;
      validated = errors.length === 0 && rows.length > 0 && !reasonMissing && !changesMissing;
      refs.publish.disabled = !validated;
      refs.validationSummary.classList.remove("is-hidden", "is-success", "is-warning");
      refs.validationSummary.classList.add(validated ? (warnings.length ? "is-warning" : "is-success") : "is-warning");
      refs.validationSummary.innerHTML = validated
        ? `<div><strong>${warnings.length ? `Aviso válido con ${warnings.length} advertencias` : isCorrection ? "Cambios listos para revisar" : "Aviso listo para publicar"}</strong><span>${warnings.length ? "Revisa las advertencias antes de confirmar." : isCorrection ? "El motivo, las asignaciones y el impacto fueron validados." : "Fincas, referencias, certificaciones y cantidades fueron validadas."}</span></div><button class="btn btn-primary" data-sial-button-adapter type="button" data-summary-publish>${isCorrection ? "Revisar cambios" : "Publicar aviso"}</button>`
        : `<div><strong>${errors.length + Number(reasonMissing) + Number(changesMissing) || 1} bloqueos impiden publicar</strong><span>${reasonMissing ? "Explica el motivo del cambio." : changesMissing ? "Realiza al menos un cambio permitido." : rows.length ? "Revisa las filas marcadas y vuelve a validar." : "Agrega al menos una asignación."}</span></div>`;
      qs("[data-summary-publish]")?.addEventListener("click", openPublish);
      refs.validationSummary.focus(); render(); return validated;
    }

    function openPublish(action = "publish") {
      if (!validated || published) return;
      pendingAction = typeof action === "string" ? action : "publish";
      const pallets = rows.reduce((sum, row) => sum + Number(row.pallets || 0), 0);
      const boxes = rows.reduce((sum, row) => sum + totalBoxes(row), 0);
      const warnings = [...validateRows().values()].reduce((sum, result) => sum + result.warnings.length, 0);
      qs("[data-publish-message]").textContent = isCorrection
        ? `${refs.code.textContent} conservará su identidad. Los cambios se registrarán como ${correctionMeta.nextVersion} y ${correctionMeta.originVersion} seguirá disponible.`
        : `${refs.code.textContent} para ${refs.week.value} se publicará como ${refs.version.value}. Después de publicarla, cualquier modificación deberá generar una nueva versión.`;
      qs("[data-publish-dialog] h2").textContent = pendingAction === "save" ? "Confirmar cambios" : isCorrection ? "Confirmar nueva versión" : "Confirmar publicación";
      qs("[data-confirm-publish]").textContent = pendingAction === "save" ? "Guardar modificación" : isCorrection ? "Publicar nueva versión" : "Publicar versión";
      qs("[data-publish-summary]").innerHTML = [["Fincas", unique(rows.map((row) => row.farm)).length], ["Palés", formatNumber(pallets)], ["Cajas", formatNumber(boxes)]].map(([label, value]) => `<span><strong>${esc(value)}</strong> ${esc(label.toLowerCase())}</span>`).join("");
      const changes = getChanges(); refs.publishChanges.classList.toggle("is-hidden", !isCorrection);
      if (isCorrection) refs.publishChanges.innerHTML = `<strong>Qué cambiará</strong><div>${changes.map((change) => `<span><b>${esc(change.label)}</b> · ${esc(change.farm)}: <del>${esc(change.before)}</del> → <ins>${esc(change.after)}</ins></span>`).join("")}</div><p><b>Motivo:</b> ${esc(refs.changeReason.value.trim())}</p>`;
      const publishValidation = qs("[data-publish-validation]");
      publishValidation.classList.remove("notice-warning", "notice-success");
      publishValidation.classList.add(warnings ? "notice-warning" : "notice-success");
      qs("[data-publish-validation]").innerHTML = warnings
        ? `<svg class="icon" viewBox="0 0 24 24"><path d="M12 3 2 21h20L12 3Z"></path></svg><div><strong>${warnings} advertencias identificadas</strong><span>Confirma que fueron revisadas antes de continuar.</span></div>`
        : `<svg class="icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"></path></svg><div><strong>Validación completa</strong><span>Sin errores ni advertencias pendientes.</span></div>`;
      openModal(refs.publishDialog, document.activeElement);
    }

    function publishNotice() {
      if (pendingAction === "save") { saveDraft(); closeModals(); return; }
      published = true; closeModals(); window.CompanyFeedback?.show("Aviso publicado"); refs.state.textContent = "Publicado"; refs.state.classList.remove("status-warning", "status-inactive"); refs.state.classList.add("status-active"); refs.publish.disabled = true; refs.validationSummary.classList.add("is-hidden");
      qs("[data-last-saved]").textContent = "Publicado ahora"; render(); window.scrollTo({ top: 0, behavior: "smooth" });
    }

    weekly.newFarm.innerHTML = options(Object.keys(farms), "", "Seleccionar finca");
    weekly.newReference.innerHTML = options(Object.keys(references), "", "Seleccionar referencia");
    weekly.newReference.addEventListener("change", () => {
      weekly.newClient.innerHTML = options(references[weekly.newReference.value]?.clients || clients, "", "Seleccionar cliente");
    });
    qs("[data-add-assignment]")?.addEventListener("click", () => {
      weekly.newForm.hidden = false;
      weekly.newError.hidden = true;
      if (!weekly.newReference.value) weekly.newClient.innerHTML = options([], "", "Elige referencia");
      weekly.newForm.scrollIntoView({ block: "nearest", behavior: "smooth" });
      weekly.newFarm.focus({ preventScroll: true });
    });
    qs("[data-week-new-cancel]")?.addEventListener("click", () => { weekly.newForm.hidden = true; weekly.newForm.reset(); });
    weekly.newForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const farm = weekly.newFarm.value, reference = weekly.newReference.value, client = weekly.newClient.value;
      const version = Number(weekly.newReferenceVersion.value);
      if (!farm || !reference || !client || !Number.isInteger(version) || version < 1) return;
      const existing = buildWeeklyGroups().find((group) => group.farm === farm && group.reference === reference && Number(group.version) === version);
      if (existing) {
        weekly.newError.textContent = "Esta finca y referencia ya tienen una fila. Escribe los palés directamente en ella.";
        weekly.newError.hidden = false;
        return;
      }
      const added = newRow({ farm, reference, client, referenceVersion: version });
      rows.push(added);
      weekly.newForm.hidden = true; weekly.newForm.reset(); weekly.newError.hidden = true;
      markChanged(); render();
      const group = weeklyGroups.findIndex((item) => item.rows.some((row) => row.id === added.id));
      qs(`[data-week-group="${group}"] [data-week-new]`, weekly.body)?.focus({ preventScroll: true });
    });
    weekly.body?.addEventListener("change", (event) => {
      const cell = event.target.closest("[data-week-cell-select]");
      if (cell) {
        const group = weeklyGroups[Number(cell.dataset.weekGroup)];
        const field = cell.dataset.weekCellSelect;
        if (!group || !cell.value || published || isReadOnly || field === "farm" && isCorrection) { editingWeeklyCell = null; renderWeekly(validateRows()); return; }
        const collision = weeklyGroups.some((other) => other !== group && (field === "farm" ? other.farm === cell.value && other.reference === group.reference : other.farm === group.farm && other.reference === cell.value) && other.version === group.version);
        if (collision) { weeklyToast("Esta combinación ya existe. Usa la fila existente."); editingWeeklyCell = null; renderWeekly(validateRows()); return; }
        group.rows.forEach((row) => {
          row[field] = cell.value;
          if (field === "farm") { row.group = farms[cell.value].group; row.sector = farms[cell.value].sector; }
          if (field === "reference") row.boxes = references[cell.value].boxes;
        });
        editingWeeklyCell = null; markChanged(); render();
        return;
      }
      const quantity = event.target.closest("[data-week-quantity]");
      const empty = event.target.closest("[data-week-new]");
      if (!quantity && !empty) return;
      const next = event.target.value.trim() === "" ? null : Number(event.target.value);
      if (next !== null && (!Number.isFinite(next) || next <= 0 || Math.abs(next * 1000 - Math.round(next * 1000)) > 1e-6)) { event.target.value = quantity ? String(rows.find((row) => row.id === quantity.dataset.weekQuantity)?.pallets || "") : ""; weeklyToast("Escribe palés positivos con máximo tres decimales."); return; }
      if (empty) {
        if (next === null || published || isCorrection) return;
        const group = weeklyGroups[Number(empty.dataset.weekNew)];
        const placeholder = group?.rows.find((row) => !row.cutDate && Number(row.pallets || 0) === 0);
        let added;
        if (placeholder) { placeholder.cutDate = empty.dataset.weekDate; placeholder.pallets = next; added = placeholder; }
        else { added = newRow({ ...group.rows[0], cutDate: empty.dataset.weekDate, pallets: next }); rows.push(added); }
        markChanged(); render();
        qsa("[data-week-quantity]", weekly.body).find((node) => node.dataset.weekQuantity === added.id)?.focus({ preventScroll: true });
        return;
      }
      const row = rows.find((item) => item.id === quantity.dataset.weekQuantity);
      if (!row || isFieldLocked("pallets")) return;
      if (next === null) {
        if (isCorrection) { quantity.value = String(row.pallets); weeklyToast("En una modificación solo puedes cambiar la cantidad de un día existente."); return; }
        const previous = { ...row };
        const group = buildWeeklyGroups().find((item) => item.rows.some((part) => part.id === row.id));
        if (group.rows.length === 1) { row.cutDate = ""; row.pallets = 0; }
        else rows = rows.filter((item) => item.id !== row.id);
        markChanged(); render();
        weeklyToast(`Día ${previous.cutDate} quitado del borrador.`, () => {
          const current = rows.find((item) => item.id === previous.id);
          if (current) Object.assign(current, previous); else rows.push(previous);
          markChanged(); render();
        });
        return;
      }
      row.pallets = next; markChanged(); render();
      qsa("[data-week-quantity]", weekly.body).find((node) => node.dataset.weekQuantity === row.id)?.focus({ preventScroll: true });
    });
    weekly.body?.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-week-edit-cell]");
      if (edit) {
        const group = weeklyGroups[Number(edit.dataset.weekGroup)];
        if (!group) return;
        editingWeeklyCell = { key: group.key, field: edit.dataset.weekEditCell };
        closeColumnFilter();
        renderWeekly(validateRows());
        qsa(`[data-week-cell-select="${edit.dataset.weekEditCell}"]`, qsa("[data-week-group]", weekly.body).find((node) => Number(node.dataset.weekGroup) === Number(edit.dataset.weekGroup))).find((node) => node.getClientRects().length)?.focus({ preventScroll: true });
        return;
      }
      const more = event.target.closest("[data-week-more]");
      if (!more) return;
      const rect = more.getBoundingClientRect();
      openWeeklyMenu(weeklyGroups[Number(more.dataset.weekMore)], rect.left, rect.bottom + 5, more);
    });
    weekly.body?.addEventListener("contextmenu", (event) => {
      if (event.target.closest("input, select, a")) return;
      const surface = event.target.closest("[data-week-group]");
      if (!surface) return;
      event.preventDefault();
      openWeeklyMenu(weeklyGroups[Number(surface.dataset.weekGroup)], event.clientX, event.clientY, surface);
    });
    weekly.body?.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && event.target.closest("[data-week-cell-select]")) { event.preventDefault(); editingWeeklyCell = null; renderWeekly(validateRows()); return; }
      if (!((event.shiftKey && event.key === "F10") || event.key === "ContextMenu")) return;
      const surface = event.target.closest("[data-week-group]");
      if (!surface) return;
      event.preventDefault();
      const rect = surface.getBoundingClientRect();
      openWeeklyMenu(weeklyGroups[Number(surface.dataset.weekGroup)], rect.left + 16, rect.top + 32, surface, "keyboard");
    });
    weekly.head?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-column-filter]");
      if (button) openColumnFilter(button.dataset.columnFilter, button, button.dataset.filterDate || "");
    });
    weekly.editor?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-column-filter]");
      if (button) openColumnFilter(button.dataset.columnFilter, button);
    });
    weekly.columnMenu?.addEventListener("input", (event) => {
      if (!event.target.matches(".cut-week-column-search")) return;
      const query = event.target.value.toLocaleLowerCase();
      qsa(".cut-week-column-options-list label", weekly.columnMenu).forEach((label) => { label.hidden = !label.textContent.toLocaleLowerCase().includes(query); });
    });
    weekly.columnMenu?.addEventListener("click", (event) => {
      if (event.target.closest("[data-filter-apply]")) applyColumnFilter();
      if (event.target.closest("[data-filter-clear]")) applyColumnFilter(true);
    });
    weekly.columnMenu?.addEventListener("keydown", (event) => { if (event.key === "Escape") { event.preventDefault(); closeColumnFilter(true); } });
    weekly.toast?.addEventListener("click", (event) => {
      if (!event.target.closest("[data-week-undo]") || !weeklyUndo) return;
      const undo = weeklyUndo; weeklyUndo = null; clearTimeout(weeklyToast.timer); weekly.toast.hidden = true; undo();
    });
    weekly.columns?.addEventListener("change", (event) => {
      const check = event.target.closest("[data-week-day]");
      if (!check) return;
      const day = Number(check.dataset.weekDay);
      if (check.checked) visibleDays.add(day);
      else if (visibleDays.size > 1) visibleDays.delete(day);
      else { check.checked = true; weeklyToast("Mantén al menos un día visible."); return; }
      closeWeeklyMenu(false); render();
    });
    weekly.date?.addEventListener("change", () => {
      const dates = weeklyDates();
      if (!dates.includes(weekly.date.value)) { weeklyToast("Selecciona una fecha de la semana productiva elegida."); weekly.date.value = dates[0]; renderWeekly(validateRows()); return; }
      visibleDays.add(dates.indexOf(weekly.date.value));
      mobileSelectedDay = dates.indexOf(weekly.date.value);
      renderWeekly(validateRows());
      qs(`[data-week-date="${weekly.date.value}"]`, weekly.head)?.scrollIntoView({ block: "nearest", inline: "center" });
    });
    weekly.reset?.addEventListener("click", () => {
      columnFilters.farm = null; columnFilters.reference = null; columnFilters.days.clear(); columnFilters.total = "all";
      weekDays.forEach((_, index) => visibleDays.add(index));
      weekly.date.value = weeklyDates()[0];
      closeWeeklyMenu(false); render();
    });
    qs("[data-detail-clear-filters]")?.addEventListener("click", () => weekly.reset.click());
    weekly.mobileDay?.addEventListener("change", () => { mobileSelectedDay = Number(weekly.mobileDay.value); closeWeeklyMenu(false); renderWeekly(validateRows()); });
    weekly.menu?.addEventListener("click", (event) => {
      if (event.target.closest(".cut-week-menu-back")) { closeWeeklySubmenu(true); return; }
      const item = event.target.closest('[role="menuitem"]');
      if (item?.dataset.weekSubmenu !== undefined) { openWeeklySubmenu(item, true); return; }
      if (item) runWeeklyAction(item.dataset.weekAction, item.dataset.weekDate || "");
    });
    weekly.menu?.addEventListener("pointerover", (event) => {
      if (compactWeeklyMenu() || event.pointerType === "touch") return;
      if (event.target.closest(".cut-week-submenu")) { clearTimeout(weeklyHoverTimer); return; }
      const item = event.target.closest('.cut-week-menu-root [role="menuitem"]');
      if (item?.dataset.weekSubmenu !== undefined) { clearTimeout(weeklyHoverTimer); weeklyHoverTimer = setTimeout(() => openWeeklySubmenu(item), 120); }
      else if (item) closeWeeklySubmenu();
    });
    weekly.menu?.addEventListener("pointerleave", () => { if (!compactWeeklyMenu() && weeklyParent) weeklyHoverTimer = setTimeout(() => closeWeeklySubmenu(), 260); });
    weekly.menu?.addEventListener("keydown", (event) => {
      const childFocus = document.activeElement?.closest(".cut-week-submenu");
      const items = childFocus ? weeklyChildItems() : weeklyRootItems();
      const index = items.indexOf(document.activeElement);
      if (event.key === "Escape") { event.preventDefault(); closeWeeklyMenu(); }
      if (event.key === "ArrowRight" && document.activeElement?.dataset.weekSubmenu !== undefined) { event.preventDefault(); openWeeklySubmenu(document.activeElement, true); }
      if (event.key === "ArrowLeft" && weeklyParent) { event.preventDefault(); closeWeeklySubmenu(true); }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); items[(index + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus(); }
      if (event.key === "Home") { event.preventDefault(); items[0]?.focus(); }
      if (event.key === "End") { event.preventDefault(); items.at(-1)?.focus(); }
      if (event.key === "Tab") closeWeeklyMenu(false);
    });
    document.addEventListener("pointerdown", (event) => { if (!weekly.menu.hidden && !weekly.menu.contains(event.target) && !event.target.closest("[data-week-more]")) closeWeeklyMenu(false); });
    document.addEventListener("pointerdown", (event) => { if (!weekly.columnMenu.hidden && !weekly.columnMenu.contains(event.target) && !event.target.closest("[data-column-filter], [data-open-column-filter]")) closeColumnFilter(); });
    window.addEventListener("resize", () => { closeWeeklyMenu(false); closeColumnFilter(); renderWeekly(validateRows()); });
    window.addEventListener("scroll", () => closeWeeklyMenu(false), true);
    qsa("[data-source]").forEach((button) => button.addEventListener("click", () => openSource(button.dataset.source, button)));
    refs.loadingFile?.addEventListener("change", async () => {
      refs.loadingZone.classList.remove("is-error");
      if (refs.loadingFile.files[0]) await prepareFile("loading", refs.loadingFile.files[0]);
    });
    refs.excelFile?.addEventListener("change", async () => {
      refs.excelZone.classList.remove("is-error");
      if (refs.excelFile.files[0]) await prepareFile("excel", refs.excelFile.files[0]);
    });
    qsa("[data-upload-zone]").forEach((zone) => {
      const mode = zone.dataset.uploadZone;
      zone.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        fileNodes(mode).input?.click();
      });
      ["dragenter", "dragover"].forEach((eventName) => zone.addEventListener(eventName, (event) => {
        event.preventDefault();
        zone.classList.add("is-dragging");
      }));
      zone.addEventListener("dragleave", (event) => {
        if (!event.relatedTarget || !zone.contains(event.relatedTarget)) zone.classList.remove("is-dragging");
      });
      zone.addEventListener("drop", (event) => {
        event.preventDefault();
        zone.classList.remove("is-dragging", "is-error");
        const file = event.dataTransfer?.files?.[0];
        if (file) prepareFile(mode, file);
      });
    });
    refs.sourceNext?.addEventListener("click", handleSourceNext);
    qsa("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModals));
    refs.backdrop?.addEventListener("click", closeModals);
    qs("[data-save-draft]")?.addEventListener("click", () => { if (!isCorrection) return saveDraft(); runValidation(); if (validated) openPublish("save"); });
    qs("[data-open-drafts]")?.addEventListener("click", (event) => {
      renderDrafts();
      openModal(refs.draftsDialog, event.currentTarget);
    });
    qs("[data-validate-notice]")?.addEventListener("click", runValidation);
    refs.publish?.addEventListener("click", openPublish);
    qs("[data-confirm-publish]")?.addEventListener("click", publishNotice);
    refs.changeReason?.addEventListener("input", markChanged);
    [refs.week, refs.type].forEach((control) => control?.addEventListener("change", () => {
      if (control === refs.week) { columnFilters.days.clear(); closeColumnFilter(); }
      refs.version.value = isCorrection ? correctionMeta.nextVersion : "Sin versión";
      refs.code.textContent = `AC-${refs.week.value.replace("SEM-", "")}`;
      markChanged();
      closeWeeklyMenu(false); render();
    }));
    document.addEventListener("keydown", (event) => {
      if (refs.backdrop.hidden || event.defaultPrevented) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopImmediatePropagation(); closeModals(); }
      if (event.key === "Tab") {
        const dialog = [refs.sourceDialog, refs.draftsDialog, refs.publishDialog].find(item => !item.hidden);
        const controls = modalControls(dialog);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    });

    saveDrafts(getDrafts());
    render();
  }

  window.SIALCutNoticeCreate = { init: initCutNoticeCreate };
})();
