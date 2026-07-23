(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const formatNumber = (value) => Number(value || 0).toLocaleString("es-CO");
  const formatDate = (value) => {
    const [year, month, day] = String(value || "").split("-");
    return year && month && day ? `${day}/${month}/${year}` : "-";
  };

  const catalogs = {
    weeks: ["SEM-2026-30", "SEM-2026-31"],
    farms: ["FINCA LA ESPERANZA", "FINCA SANTA ISABEL", "FINCA LOS ALMENDROS"],
    sectors: ["SECTOR 01", "ZONA EMPAQUE", "SECTOR 04"],
    groups: ["GRUPO NORTE", "GRUPO CENTRO", "GRUPO SUR"],
    clients: ["FYFFES", "DOLE", "CHIQUITA", "GLOBAL FRUIT EXPORT"],
    references: ["AGSTDRA", "MPBORG303-5", "STDSRA-7"],
    boxes: ["48", "54", "66"]
  };

  const records = [
    { id: "cut-001", code: "AC-2026-030-01", week: "SEM-2026-30", cutDate: "2026-07-23", farm: "FINCA LA ESPERANZA", sector: "SECTOR 01", group: "GRUPO NORTE", client: "FYFFES", reference: "AGSTDRA", pallets: 120, boxes: 54, bunches: 5400, status: "CREADO", observation: "Planificacion inicial sin novedades.", lockReason: "" },
    { id: "cut-002", code: "AC-2026-031-02", week: "SEM-2026-31", cutDate: "2026-07-28", farm: "FINCA SANTA ISABEL", sector: "ZONA EMPAQUE", group: "GRUPO CENTRO", client: "DOLE", reference: "MPBORG303-5", pallets: 88, boxes: 48, bunches: 3960, status: "PROGRAMADO", observation: "Transporte confirmado para entrega directa.", lockReason: "El aviso ya genero pedido de materiales y programacion de transporte." },
    { id: "cut-003", code: "AC-2026-031-03", week: "SEM-2026-31", cutDate: "2026-07-30", farm: "FINCA LOS ALMENDROS", sector: "SECTOR 04", group: "GRUPO SUR", client: "CHIQUITA", reference: "STDSRA-7", pallets: 148, boxes: 54, bunches: 6120, status: "EN_CARGUE", observation: "Contenedor actualmente en proceso de cargue.", lockReason: "El contenedor asociado se encuentra en EN_CARGUE." }
  ];

  let sequence = 4;
  let currentRecord = null;
  let currentIsNew = false;

  const statusClass = (status) => status === "CREADO" ? "status-active" : status === "PROGRAMADO" ? "status-warning" : "status-inactive";
  const options = (values, selected) => values.map((value) => `<option value="${escapeHtml(value)}"${String(value) === String(selected) ? " selected" : ""}>${escapeHtml(value)}</option>`).join("");
  const inputField = (label, name, value, type = "text", wide = false) => `
    <label class="alt-field${wide ? " is-wide" : ""}>
      <span class="label">${escapeHtml(label)}</span>
      <input class="input" name="${escapeHtml(name)}" type="${type}" value="${escapeHtml(value)}" required />
    </label>`;
  const selectField = (label, name, value, values) => `
    <label class="alt-field">
      <span class="label">${escapeHtml(label)}</span>
      <select class="select" name="${escapeHtml(name)}" required>${options(values, value)}</select>
    </label>`;

  const formHtml = (record) => `
    <form class="alt-editor-form" data-alt-form>
      <section class="alt-form-section">
        <div>
          <h3 class="section-title">Planificacion</h3>
          <p class="card-subtitle">Define la semana, fecha y origen del aviso.</p>
        </div>
        <div class="alt-form-grid">
          ${selectField("Semana", "week", record.week, catalogs.weeks)}
          ${inputField("Dia de corte", "cutDate", record.cutDate, "date")}
          ${selectField("Finca", "farm", record.farm, catalogs.farms)}
          ${selectField("Sector", "sector", record.sector, catalogs.sectors)}
          ${selectField("Grupo", "group", record.group, catalogs.groups)}
        </div>
      </section>
      <section class="alt-form-section">
        <div>
          <h3 class="section-title">Producto y proyeccion</h3>
          <p class="card-subtitle">Los cambios de referencia o cantidades requieren recalculo de materiales.</p>
        </div>
        <div class="alt-form-grid">
          ${selectField("Cliente", "client", record.client, catalogs.clients)}
          ${selectField("Referencia", "reference", record.reference, catalogs.references)}
          ${inputField("Pallets", "pallets", record.pallets, "number")}
          ${selectField("Cajas por pallet", "boxes", record.boxes, catalogs.boxes)}
          ${inputField("Racimos", "bunches", record.bunches, "number")}
          ${inputField("Observaciones", "observation", record.observation || "", "text", true)}
        </div>
      </section>
    </form>`;

  const readonlyHtml = (record) => `
    ${record.lockReason ? `<div class="notice notice-warning"><span>${escapeHtml(record.lockReason)}</span></div>` : ""}
    <div class="alt-readonly-summary">
      ${[["Aviso", record.code], ["Estado", record.status], ["Semana", record.week], ["Dia de corte", formatDate(record.cutDate)], ["Finca", record.farm], ["Sector", record.sector], ["Cliente", record.client], ["Referencia", record.reference], ["Pallets", formatNumber(record.pallets)], ["Total cajas", formatNumber(record.pallets * record.boxes)]].map(([label, value]) => `<div class="detail-group"><span class="detail-label">${escapeHtml(label)}</span><div class="detail-value">${escapeHtml(value)}</div></div>`).join("")}
    </div>`;

  function masterRender() {
    const body = qs("[data-master-body]");
    if (!body) return;
    const search = String(qs("[data-master-search]")?.value || "").toLowerCase();
    const status = qs("[data-master-status]")?.value || "all";
    const visible = records.filter((record) => (!search || [record.code, record.farm, record.client, record.reference].join(" ").toLowerCase().includes(search)) && (status === "all" || record.status === status));
    body.innerHTML = visible.map((record) => `
      <tr data-record-id="${record.id}">
        <td><div class="alt-primary-cell"><strong class="alt-code">${escapeHtml(record.code)}</strong><span>${escapeHtml(record.week)} · ${formatDate(record.cutDate)}</span></div></td>
        <td>${escapeHtml(record.farm)}</td>
        <td>${escapeHtml(record.client)}</td>
        <td>${escapeHtml(record.reference)}</td>
        <td>${formatNumber(record.pallets)}</td>
        <td><span class="status ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td>
        <td><div class="row-actions"><button class="icon-btn" type="button" data-alt-action="view" data-id="${record.id}" aria-label="Ver ${escapeHtml(record.code)}" title="Ver detalle"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>${record.lockReason ? `<button class="icon-btn is-locked" type="button" data-alt-action="view" data-id="${record.id}" aria-label="Aviso bloqueado" title="Aviso bloqueado"><svg class="icon" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg></button>` : `<button class="icon-btn" type="button" data-alt-action="edit" data-id="${record.id}" aria-label="Editar ${escapeHtml(record.code)}" title="Editar"><svg class="icon" viewBox="0 0 24 24"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button>`}</div></td>
      </tr>`).join("");
    const count = qs("[data-master-count]");
    if (count) count.textContent = `${visible.length} ${visible.length === 1 ? "aviso" : "avisos"}`;
  }

  function boardRender() {
    const board = qs("[data-board]");
    if (!board) return;
    const week = qs("[data-board-week]")?.value || "all";
    const filtered = records.filter((record) => week === "all" || record.week === week);
    const states = [["CREADO", "Por gestionar"], ["PROGRAMADO", "Programados"], ["EN_CARGUE", "En cargue"]];
    board.innerHTML = states.map(([status, label]) => {
      const items = filtered.filter((record) => record.status === status);
      const cards = items.length ? items.map((record) => `
        <article class="alt-notice-card${record.lockReason ? " is-locked" : ""}>
          <div class="alt-notice-card-head"><h3>${escapeHtml(record.code)}</h3><span class="status ${statusClass(record.status)}">${escapeHtml(record.status)}</span></div>
          <div class="alt-notice-card-main"><strong>${escapeHtml(record.farm)}</strong><span>${formatDate(record.cutDate)} · ${escapeHtml(record.client)}</span><span>${escapeHtml(record.reference)} · ${formatNumber(record.pallets)} pallets</span></div>
          <div class="alt-notice-card-footer"><span>${escapeHtml(record.week)}</span><button class="btn btn-ghost" type="button" data-alt-action="${record.lockReason ? "view" : "edit"}" data-id="${record.id}">${record.lockReason ? "Consultar" : "Editar"}</button></div>
        </article>`).join("") : '<div class="alt-empty-column">Sin avisos en este estado.</div>';
      return `<section class="alt-board-column"><div class="alt-board-column-head"><h2>${label}</h2><span class="chip">${items.length}</span></div><div class="alt-board-list">${cards}</div></section>`;
    }).join("");
    const total = qs("[data-board-total]");
    if (total) total.textContent = `${filtered.length} avisos`;
  }

  function openEditor(record, editable, isNew = false) {
    currentRecord = record;
    currentIsNew = isNew;
    const mode = document.body.dataset.altMode;
    const surface = mode === "master" ? qs("[data-alt-drawer]") : qs("[data-alt-dialog]");
    const backdrop = mode === "master" ? qs("[data-alt-drawer-backdrop]") : qs("[data-alt-dialog-backdrop]");
    const title = qs("[data-alt-editor-title]", surface);
    const subtitle = qs("[data-alt-editor-subtitle]", surface);
    const content = qs("[data-alt-editor-content]", surface);
    const save = qs("[data-alt-save]", surface);
    if (title) title.textContent = isNew ? "Crear aviso de corte" : editable ? `Editar ${record.code}` : `Detalle ${record.code}`;
    if (subtitle) subtitle.textContent = mode === "master" ? "Trabaja un aviso sin perder el contexto del listado." : "Espacio dedicado para revisar la planeacion antes de confirmar.";
    if (content) content.innerHTML = editable ? formHtml(record) : readonlyHtml(record);
    save?.classList.toggle("is-hidden", !editable);
    surface?.removeAttribute("hidden");
    surface?.classList.add("show");
    surface?.setAttribute("aria-hidden", "false");
    backdrop?.removeAttribute("hidden");
    backdrop?.classList.add("show");
    window.setTimeout(() => editable ? qs("[name=week]", surface)?.focus() : qs("[data-alt-close]", surface)?.focus(), 0);
  }

  function closeEditor() {
    const mode = document.body.dataset.altMode;
    const surface = mode === "master" ? qs("[data-alt-drawer]") : qs("[data-alt-dialog]");
    const backdrop = mode === "master" ? qs("[data-alt-drawer-backdrop]") : qs("[data-alt-dialog-backdrop]");
    surface?.classList.remove("show");
    surface?.setAttribute("aria-hidden", "true");
    surface?.setAttribute("hidden", "");
    backdrop?.classList.remove("show");
    backdrop?.setAttribute("hidden", "");
    currentRecord = null;
    currentIsNew = false;
  }

  function saveEditor() {
    const mode = document.body.dataset.altMode;
    const surface = mode === "master" ? qs("[data-alt-drawer]") : qs("[data-alt-dialog]");
    const form = qs("[data-alt-form]", surface);
    if (!form?.reportValidity() || !currentRecord) return;
    const wasNew = currentIsNew;
    const values = Object.fromEntries(new FormData(form));
    Object.assign(currentRecord, values, { pallets: Number(values.pallets), boxes: Number(values.boxes), bunches: Number(values.bunches) });
    if (currentIsNew) {
      currentRecord.id = `cut-new-${sequence}`;
      currentRecord.code = `AC-2026-${currentRecord.week.endsWith("31") ? "031" : "030"}-${String(sequence++).padStart(2, "0")}`;
      currentRecord.status = "CREADO";
      currentRecord.lockReason = "";
      records.unshift(currentRecord);
    }
    closeEditor();
    masterRender();
    boardRender();
    const feedback = qs("[data-alt-feedback]");
    if (feedback) {
      feedback.textContent = wasNew ? "Aviso creado correctamente." : "Cambios aplicados al aviso.";
      feedback.classList.remove("is-hidden");
    }
  }

  function newDraft() {
    return { id: "", code: "", week: "SEM-2026-30", cutDate: "2026-07-23", farm: catalogs.farms[0], sector: catalogs.sectors[0], group: catalogs.groups[0], client: catalogs.clients[0], reference: catalogs.references[0], pallets: 1, boxes: 54, bunches: 1, status: "CREADO", observation: "", lockReason: "" };
  }

  function init() {
    masterRender();
    boardRender();
    qsa("[data-master-search], [data-master-status]").forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", masterRender));
    qs("[data-board-week]")?.addEventListener("change", boardRender);
    qsa("[data-alt-new]").forEach((button) => button.addEventListener("click", () => openEditor(newDraft(), true, true)));
    document.addEventListener("click", (event) => {
      const action = event.target.closest("[data-alt-action]");
      if (!action) return;
      const record = records.find((item) => item.id === action.dataset.id);
      if (record) openEditor(record, action.dataset.altAction === "edit" && !record.lockReason, false);
    });
    qsa("[data-alt-close]").forEach((button) => button.addEventListener("click", closeEditor));
    qsa("[data-alt-save]").forEach((button) => button.addEventListener("click", saveEditor));
    qsa("[data-alt-drawer-backdrop], [data-alt-dialog-backdrop]").forEach((backdrop) => backdrop.addEventListener("click", closeEditor));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeEditor(); });
  }

  window.SIALCutAlternatives = { init };
})();