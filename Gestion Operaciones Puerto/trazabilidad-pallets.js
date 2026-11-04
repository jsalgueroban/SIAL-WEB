const SIALPalletTrace = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => window.SIALCore?.escapeHtml ? window.SIALCore.escapeHtml(value ?? "") : String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
  const params = new URLSearchParams(location.search);
  const eyeIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const closeIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>';

  const records = [];

  // Explicit simulations of contracts found in the real pallet feature.
  const simulationBase = {simulation:true,farm:'Santa Isabel',farmCode:'0527',week:'SEM-2026-43',reference:'BAN-REF-014 V1',type:'Completo',boxes:54,location:'ZE Puerto Norte',container:'No asignado',operation:'OP-DEMO-4301',dispatch:'No disponible'};
  const simulationActor = {location:'ZE Puerto Norte',responsible:'Carlos Mendoza'};
  records.unshift(
    {...simulationBase,sscc:'177012345678900101',status:'Pallet rearmado',statusKey:'reassembled',updated:'23/10/2026, 10:30',events:[
      ['23/10/2026','10:30','Pallet rearmado','ZE Puerto Norte','ARM-DEMO-4301']
    ],movementDetails:[{...simulationActor,build:{start:'23/10/2026, 10:00',end:'23/10/2026, 10:30',responsible:'Carlos Mendoza',sources:[{sscc:'177012345678900118',boxes:30},{sscc:'177012345678900125',boxes:24}],composition:[{reference:'BAN-REF-014',version:'V1',boxes:54}],observations:'Consolidación de 30 y 24 cajas provenientes de dos pallets.'}}]},
    {...simulationBase,sscc:'177012345678900118',type:'Incompleto',boxes:18,status:'Pallet rearmado',statusKey:'reassembled',updated:'23/10/2026, 10:30',events:[
      ['23/10/2026','07:00','Pallet creado','Finca Santa Isabel','ARM-DEMO-4300'],
      ['23/10/2026','10:30','Pallet rearmado','30 cajas evacuadas a otro pallet','ARM-DEMO-4301']
    ],movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {...simulationActor,build:{start:'23/10/2026, 10:00',end:'23/10/2026, 10:30',responsible:'Carlos Mendoza',destinations:[{sscc:'177012345678900101',boxes:30}],composition:[{reference:'BAN-REF-014',version:'V1',boxes:30}],observations:'Se retiraron 30 cajas. El contenido actual del pallet conserva 18 cajas.'}}]},
    {...simulationBase,sscc:'177012345678900132',status:'Descargado de camión',statusKey:'unloaded-truck',updated:'23/10/2026, 11:20',events:[
      ['23/10/2026','07:00','Pallet creado','Finca Santa Isabel','ARM-DEMO-4302'],
      ['23/10/2026','08:30','Cargado en camión','Finca Santa Isabel','OP-DEMO-4302'],
      ['23/10/2026','11:20','Descargado de camión','ZE Puerto Norte','OP-DEMO-4302']
    ],operation:'OP-DEMO-4302',movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {location:'Finca Santa Isabel',responsible:'Laura Martínez',vehicle:'CAM102',filing:'419',driver:'Andrés Torres',loadingStartedAt:'23/10/2026, 08:00',loadingCompletedAt:'23/10/2026, 08:30'}, {...simulationActor,vehicle:'CAM102',filing:'419',driver:'Andrés Torres',novelty:'Con novedad',noveltyReason:'Embalaje dañado',observation:'Se identificaron dos cajas con embalaje deteriorado durante la descarga. Se registró la novedad para su revisión; la cantidad recibida se conserva en 54 cajas.'}]},
    {...simulationBase,sscc:'177012345678900149',location:'Finca Santa Isabel',status:'Cargado en camión',statusKey:'loaded-truck',updated:'23/10/2026, 09:15',events:[
      ['23/10/2026','07:15','Pallet creado','Finca Santa Isabel','ARM-DEMO-4303'],
      ['23/10/2026','09:15','Cargado en camión','Finca Santa Isabel','OP-DEMO-4303']
    ],operation:'OP-DEMO-4303',movementDetails:[{location:'Finca Santa Isabel',responsible:'Laura Martínez'}, {location:'Finca Santa Isabel',responsible:'Laura Martínez',vehicle:'CAM102',filing:'419',driver:'Andrés Torres',loadingStartedAt:'23/10/2026, 08:45',loadingCompletedAt:'23/10/2026, 09:15'}]}
  );

  // Case inspected in the live product on 2026-11-03. Other rows remain synthetic.
  const liveTransport = {container:'MMAU145959-7',vehicle:'KUS221',filing:'62',driver:'SANDRO JOSE CABRERA MELÉNDEZ'};
  records.unshift({sscc:'353970050177452895',farm:'MANANTIAL ORGÁNICO',farmCode:'0419',week:'SEM-2026-43',reference:'EDKORG V1',type:'Completo',boxes:54,status:'Descargado de contenedor',statusKey:'unloaded',location:'Zona Externa.',container:'MMAU145959-7',operation:'OP-7724E616',dispatch:'No disponible',updated:'22/10/2026, 20:47:24',events:[
    ['22/10/2026','08:45','Pallet creado','MANANTIAL ORGÁNICO','ARM-0BC45CDF'],
    ['22/10/2026','11:56','Cargado en contenedor','MANANTIAL ORGÁNICO','OP-7724E616'],
    ['22/10/2026','17:36','Despachado a puerto','MANANTIAL ORGÁNICO','OP-7724E616'],
    ['22/10/2026','18:55','Recibido en puerto','Zona Externa','OP-7724E616'],
    ['22/10/2026','20:47','Descargado de contenedor','Zona Externa.','OP-7724E616'],
  ],movementDetails:[
    {location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON',build:{start:'22/10/2026, 08:00',end:'22/10/2026, 08:45',responsible:'ANGIE MELISSA CONSTANTE PABON',composition:[{reference:'EDKORG',version:'V1',boxes:54}]}},
    {...liveTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...liveTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...liveTransport,location:'Zona Externa',responsible:'KEINER LUIS PACHECO SANCHEZ'},
    {...liveTransport,location:'Zona Externa.',responsible:'NIDIA ESTER BARROS CARDONA',novelty:'Sin novedad'},
  ]});

  const secondTransport = {container:'MMAU135866-8',vehicle:'KUS342',filing:'64',driver:'DIEGO ALFREDO ANGARITA DIETES'};
  records.splice(1,0,{sscc:'353970050177492747',farm:'MANANTIAL ORGÁNICO',farmCode:'0419',week:'SEM-2026-43',reference:'CLORFTFYMI13 V4',type:'Incompleto',boxes:26,status:'Descargado de contenedor',statusKey:'unloaded',statusTone:'success',location:'Zona Externa.',container:'MMAU135866-8',operation:'OP-C042A898',dispatch:'No disponible',updated:'23/10/2026, 21:21:27',events:[
    ['23/10/2026','16:01','Pallet creado','MANANTIAL ORGÁNICO','ARM-1BA8DA60'],
    ['23/10/2026','17:12','Cargado en contenedor','MANANTIAL ORGÁNICO','OP-C042A898'],
    ['23/10/2026','18:26','Despachado a puerto','MANANTIAL ORGÁNICO','OP-C042A898'],
    ['23/10/2026','19:02','Recibido en puerto','Zona Externa','OP-C042A898'],
    ['23/10/2026','21:21','Descargado de contenedor','Zona Externa.','OP-C042A898']
  ],movementDetails:[
    {location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON',build:{start:'23/10/2026, 13:01',end:'23/10/2026, 16:01',responsible:'ANGIE MELISSA CONSTANTE PABON',composition:[{reference:'CLORFTFYMI13',version:'V4',boxes:26}]}},
    {...secondTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ANGIE MELISSA CONSTANTE PABON'},
    {...secondTransport,location:'MANANTIAL ORGÁNICO · 0419',responsible:'ESTEBAN DAVID BARRAZA CABRERA'},
    {...secondTransport,location:'Zona Externa',responsible:'JUAN CARLOS ANAYA ANAYA'},
    {...secondTransport,location:'Zona Externa.',responsible:'VANESA ALEXANDRA FONSECA LOPEZ',novelty:'Sin novedad'}
  ]});
  records[0].statusTone='success';
  // Complete simulated creation events using explicit fixture data, never real identities.
  for(const record of records.filter(item=>item.simulation)) {
    if(record.events[0][2]!=='Pallet creado') continue;
    const start=record.events[0][1];
    record.movementDetails[0].build={start:`23/10/2026, ${start==='07:15'?'06:30':'06:15'}`,end:`23/10/2026, ${start}`,responsible:'Laura Martínez',composition:[{reference:'BAN-REF-014',version:'V1',boxes:record.sscc==='177012345678900118'?48:54}]};
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
    renderRows();

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
