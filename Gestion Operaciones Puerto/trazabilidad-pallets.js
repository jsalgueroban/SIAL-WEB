const SIALPalletTrace = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => window.SIALCore?.escapeHtml ? window.SIALCore.escapeHtml(value ?? "") : String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const params = new URLSearchParams(location.search);
  const eyeIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const closeIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>';

  const records = [...window.SIALPalletTraceRecords];
  const sscc = params.get('sscc');
  if (sscc && !records.some(item => item.sscc === sscc)) {
    const snapshot = window.SIALWebProposalUI?.cargoPalletRecord(sscc);
    if (snapshot) records.push(snapshot);
  }
  const requestedFarm = params.get("finca") || "all";
  const state = { farm: requestedFarm, search: "", status: "all", week: "all", page: 1, pageSize: 10, selected: null, selectedEvent: null };

  function statusChip(record) {
    const statusClass = record.statusKey === "exported" ? "status-active" : record.statusKey === "warning" ? "status-warning" : record.statusKey === "farm" ? "status-neutral" : "status-info";
    const tone = record.statusKey === "exported" ? "active" : record.statusKey === "warning" ? "warning" : record.statusKey === "farm" ? "neutral" : "info";
    return `<span class="status ${statusClass}" data-sial-chip-adapter data-sial-chip-tone="${record.statusTone || tone}">${esc(record.status)}</span>`;
  }

  function filteredRecords() {
    const term = state.search.trim().toLowerCase();
    return records.filter((record) => {
      const farmMatch = state.farm === "all" || record.farmCode === state.farm;
      const statusMatch = state.status === "all" || record.statusKey === state.status;
      const weekMatch = state.week === "all" || record.week === state.week;
      const searchMatch = !term || [record.sscc, record.farm, record.reference, record.container, record.operation, record.dispatch].join(" ").toLowerCase().includes(term);
      return farmMatch && statusMatch && weekMatch && searchMatch;
    });
  }

  function renderPagination(total) {
    const pagination = qs("[data-trace-pagination]");
    if (!pagination) return;
    const totalPages = Math.max(1, Math.ceil(total / state.pageSize));
    state.page = Math.min(Math.max(state.page, 1), totalPages);
    const start = total ? ((state.page - 1) * state.pageSize) + 1 : 0;
    const end = Math.min(state.page * state.pageSize, total);
    pagination.innerHTML = `
      <div class="pagination-summary" aria-live="polite">Mostrando ${start}-${end} de ${total} registros</div>
      <label class="pagination-size"><span>Registros por página</span><select class="select" data-trace-page-size aria-label="Registros por página"><option value="10" ${state.pageSize === 10 ? "selected" : ""}>10</option><option value="30" ${state.pageSize === 30 ? "selected" : ""}>30</option><option value="50" ${state.pageSize === 50 ? "selected" : ""}>50</option></select></label>
      <div class="pagination-pages" aria-label="Cambiar página">
        <button class="pagination-btn" type="button" data-trace-page="${state.page - 1}" ${state.page <= 1 ? "disabled" : ""}>Anterior</button>
        <button class="pagination-btn active" type="button" aria-current="page">${state.page}</button>
        <button class="pagination-btn" type="button" data-trace-page="${state.page + 1}" ${state.page >= totalPages ? "disabled" : ""}>Siguiente</button>
      </div>`;
  }

  function renderRows() {
    const body = qs("[data-trace-rows]");
    const emptyBody = qs("[data-trace-empty-body]");
    const count = qs("#traceCount");
    if (!body) return;
    const filtered = filteredRecords();
    const start = (state.page - 1) * state.pageSize;
    const pageRecords = filtered.slice(start, start + state.pageSize);
    body.innerHTML = pageRecords.map((record) => `
      <tr data-trace-sscc="${esc(record.sscc)}" class="${state.selected === record.sscc ? "trace-row-selected" : ""}">
        <td><div class="trace-primary-cell"><strong class="trace-sscc">${esc(record.sscc)}</strong>${record.simulation?'<span>Caso de simulación</span>':''}</div></td>
        <td><div class="trace-primary-cell"><strong>${esc(record.farm)}</strong><span>${esc(record.week)}</span></div></td>
        <td><div class="trace-primary-cell"><strong>${esc(record.type)}</strong><span>${esc(record.reference)} · ${esc(record.boxes)} cajas</span></div></td>
        <td>${esc(record.location)}</td>
        <td>${statusChip(record)}</td>
        <td>${esc(record.updated)}</td>
        <td><div class="row-actions"><button class="icon-btn" type="button" data-consult-trace="${esc(record.sscc)}" aria-label="Consultar trazabilidad del pallet ${esc(record.sscc)}" title="Consultar trazabilidad">${eyeIcon}</button></div></td>
      </tr>`).join("");
    if (emptyBody) emptyBody.hidden = filtered.length !== 0;
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? "registro visible" : "registros visibles"}`;
    renderPagination(filtered.length);
  }

  function renderDetail(sscc) {
    const detail=qs('[data-trace-detail]');
    const record=records.find(item=>item.sscc===sscc);
    if(!detail || !record || !window.SIALWebProposalUI?.mountPalletDetail) return;
    state.selected=sscc;
    renderRows();
    detail.hidden=false;
    window.SIALWebProposalUI.mountPalletDetail(detail,record,()=>closeDetail());
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    detail.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }

  function closeDetail(restoreFocus = true) {
    const detail = qs("[data-trace-detail]");
    const selected = state.selected;
    state.selected = null;
    state.selectedEvent = null;
    if (detail) { window.SIALWebProposalUI?.unmountPalletDetail(detail); detail.hidden = true; }
    renderRows();
    if (restoreFocus && selected) qs(`[data-consult-trace="${selected}"]`)?.focus({ preventScroll: true });
  }

  function syncFarmQuery() {
    const nextParams = new URLSearchParams(location.search);
    nextParams.delete("vista");
    if (state.farm === "all") nextParams.delete("finca"); else nextParams.set("finca", state.farm);
    history.replaceState(null, "", `${location.pathname}${nextParams.toString() ? `?${nextParams}` : ""}`);
  }

  function denied() {
    const root = qs("[data-pallet-trace-root]");
    if (!root) return;
    root.innerHTML = '<p class="page-eyebrow">Operaciones puerto / Pallets</p><div class="page-header"><div><h1 class="page-title">Trazabilidad de pallets</h1><p class="page-subtitle">Consulta restringida a las fincas y operaciones autorizadas.</p></div></div><div class="notice notice-error" role="alert"><span><strong>Información no disponible</strong><br />No existen pallets visibles dentro de tu alcance.</span></div><a class="btn btn-secondary" href="index.html">Volver a Puerto</a>';
  }

  function resetAndRender() {
    state.page = 1;
    closeDetail(false);
  }

  function init() {
    SIAL.applyShell("trazabilidadPallets");
    if (params.get("access") === "denied") { denied(); return; }
    const farmSelect = qs("#traceFarm");
    qs('#traceStatus').innerHTML='<option value="all">Todas las fases</option>'+[...new Map(records.map(record=>[record.statusKey,record.status])).entries()].map(([value,label])=>`<option value="${esc(value)}">${esc(label)}</option>`).join('');
    qs('#traceWeek').innerHTML='<option value="all">Todas las semanas</option>'+[...new Set(records.map(record=>record.week))].map(week=>`<option value="${esc(week)}">${esc(week)}</option>`).join('');
    const farms = [...new Map(records.map((record) => [record.farmCode, record.farm])).entries()];
    farmSelect?.insertAdjacentHTML("beforeend", farms.map(([code, name]) => `<option value="${esc(code)}">${esc(name)}</option>`).join(""));
    if (farms.some(([code]) => code === state.farm)) farmSelect.value = state.farm; else state.farm = "all";
    if (sscc) {
      state.search = sscc;
      qs("#traceSearch").value = sscc;
    }
    renderRows();
    if (sscc && filteredRecords().some(item => item.sscc === sscc)) renderDetail(sscc);

    qs("#traceSearch")?.addEventListener("input", (event) => { state.search = event.target.value; resetAndRender(); });
    farmSelect?.addEventListener("change", (event) => { state.farm = event.target.value; syncFarmQuery(); resetAndRender(); });
    qs("#traceStatus")?.addEventListener("change", (event) => { state.status = event.target.value; resetAndRender(); });
    qs("#traceWeek")?.addEventListener("change", (event) => { state.week = event.target.value; resetAndRender(); });
    qs("[data-trace-rows]")?.addEventListener("click", (event) => { const button = event.target.closest("[data-consult-trace]"); if (button) renderDetail(button.dataset.consultTrace); });
    qs("[data-trace-pagination]")?.addEventListener("click", (event) => { const button = event.target.closest("[data-trace-page]"); if (!button || button.disabled) return; state.page = Number(button.dataset.tracePage); closeDetail(false); });
    qs("[data-trace-pagination]")?.addEventListener("change", (event) => { if (!event.target.matches("[data-trace-page-size]")) return; state.pageSize = Number(event.target.value); state.page = 1; closeDetail(false); });
  }

  return { init };
})();

SIALPalletTrace.init();
