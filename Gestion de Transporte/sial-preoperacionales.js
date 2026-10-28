(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  function initList() {
    const rows = $$("#preopRows tr");
    const search = $("#preopSearch"), type = $("#preopType"), status = $("#preopStatus");
    const pagination = $("#preopPagination");
    let page = 1, pageSize = 10;
    const apply = () => {
      const term = search.value.trim().toLocaleLowerCase("es");
      const matches = rows.filter(row => (!term || row.textContent.toLocaleLowerCase("es").includes(term)) && (type.value === "all" || row.dataset.type === type.value) && (status.value === "all" || row.dataset.status === status.value));
      page = Math.min(page, Math.max(1, Math.ceil(matches.length / pageSize)));
      rows.forEach(row => { row.hidden = true; });
      matches.slice((page - 1) * pageSize, page * pageSize).forEach(row => { row.hidden = false; });
      $("#preopCount").textContent = `${matches.length} ${matches.length === 1 ? "registro" : "registros"}`;
      $("#preopEmpty").classList.toggle("is-visible", matches.length === 0);
      pagination.dataset.sialPage = page;
      pagination.dataset.sialPageSize = pageSize;
      pagination.dataset.sialTotal = matches.length;
      pagination.dispatchEvent(new CustomEvent("sial:table-page-state", { detail: { page, pageSize, total: matches.length, sizes: [10, 30, 50] } }));
    };
    [search, type, status].forEach(control => control.addEventListener(control === search ? "input" : "change", () => { page = 1; apply(); }));
    pagination.addEventListener("sial:table-page-request", event => { page = Number(event.detail?.page) || 1; apply(); });
    pagination.addEventListener("sial:table-page-size-request", event => { pageSize = Number(event.detail?.pageSize) || 10; page = 1; apply(); });
    apply();
  }
  const catalogue = [
    ["Documentos", ["Vencimiento SOAT", "Vencimiento revisión tecnicomecánica", "Tarjeta de propiedad", "Vencimiento licencia del conductor"]],
    ["Luces", ["Tablero interno", "Techo interno", "Luces de posición delanteras", "Luces delanteras", "Luces altas delanteras", "Exploradoras", "Luces traseras", "Luces de freno", "Luces de reversa"]],
    ["Habitáculo", ["Vidrio panorámico", "Vidrios laterales", "Cinturones de seguridad", "Limpiaparabrisas", "Cierre de puertas", "Aire acondicionado", "Seguros", "Accesorios en general"]],
    ["Motor", ["Líquido de frenos", "Líquido de parabrisas", "Líquido de dirección", "Refrigerante del motor", "Nivel de aceite", "Correas: tensión y desgaste", "Estado general del motor"]],
    ["Kit de carretera", ["Extintor vigente", "Botiquín", "Gato", "Llanta de repuesto"]],
    ["Generales", ["Estado de llantas", "Estado de defensas o golpes", "Alineación y balanceo", "Amortiguadores", "Freno de mano", "Frenos", "Clutch o embrague", "Estado de dirección", "Encendido", "Fugas visibles"]]
  ];
  const examples = {
    "INSP-2026-041": { vehicle: "TRK-421", type: "Tractomula", driver: "Carlos Méndez", date: "14/10/2026 · 06:45", status: "Condicionada", style: "status-warning", program: "POM-2026-014", findings: { "Luces de freno": "Intermitencia en el lado derecho.", "Estado de llantas": "Desgaste visible en llanta posterior." }, history: [["14/10 · 06:45", "Inspección registrada por Carlos Méndez."], ["14/10 · 07:12", "Novedades remitidas para revisión de transporte."]] },
    "INSP-2026-040": { vehicle: "CAM-102", type: "Camión rígido", driver: "Ana Lucía Paz", date: "14/10/2026 · 05:50", status: "Apta", style: "status-active", program: "Sin programación cargada", findings: {}, history: [["14/10 · 05:50", "Inspección registrada por Ana Lucía Paz."]] },
    "INSP-2026-039": { vehicle: "FLT-001", type: "Camión", driver: "Jorge López", date: "13/10/2026 · 07:10", status: "No apta", style: "status-inactive", program: "Sin programación cargada", findings: { "Frenos": "Respuesta irregular en prueba.", "Líquido de frenos": "Nivel por debajo del mínimo.", "Estado de llantas": "Desgaste visible." }, history: [["13/10 · 07:10", "Inspección registrada por Jorge López."], ["13/10 · 07:30", "Vehículo señalado como no apto para esta operación."]] },
    "INSP-2026-038": { vehicle: "TRK-422", type: "Tractomula", driver: "Luis Herrera", date: "13/10/2026 · 06:20", status: "Pendiente", style: "status-warning", program: "Sin programación cargada", findings: { "Extintor vigente": "Soporte de vigencia por confirmar." }, history: [["13/10 · 06:20", "Inspección registrada por Luis Herrera."]] }
  };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  function initDetail() {
    const id = new URLSearchParams(location.search).get("id") || "INSP-2026-041";
    const record = examples[id];
    if (!record) { $("#preopDetail").innerHTML = '<div class="card-body">No se encontró la inspección solicitada. <a href="gestion-preoperacionales.html">Volver a la consulta</a>.</div>'; return; }
    $("#preopDetail").innerHTML = `<div class="preop-detail-head"><div><h2>${escape(id)}</h2><p>${escape(record.vehicle)} · ${escape(record.type)} · ${escape(record.date)}</p></div><span class="status ${record.style}" data-sial-chip-adapter>${escape(record.status)}</span></div><dl class="preop-facts"><div><dt>Vehículo</dt><dd>${escape(record.vehicle)}</dd></div><div><dt>Conductor</dt><dd>${escape(record.driver)}</dd></div><div><dt>Programación</dt><dd>${escape(record.program)}</dd></div><div><dt>Novedades</dt><dd>${Object.keys(record.findings).length} de 42</dd></div></dl><div class="preop-detail-body">${catalogue.map(([name, items]) => `<section class="preop-detail-section"><h3 class="preop-section-title">${escape(name)} <small>${items.filter(item => record.findings[item]).length} novedades</small></h3>${items.map(item => `<div class="preop-detail-row"><strong>${escape(item)}</strong><span class="status ${record.findings[item] ? "status-warning" : "status-active"}" data-sial-chip-adapter>${record.findings[item] ? "Con novedad" : "Sin novedad"}</span><span class="muted">${escape(record.findings[item] || "—")}</span></div>`).join("")}</section>`).join("")}<section class="preop-detail-section"><h3 class="preop-section-title">Seguimiento</h3><ol class="preop-timeline">${record.history.map(([date, text]) => `<li><time>${escape(date)}</time><span>${escape(text)}</span></li>`).join("")}</ol></section><div class="preop-back"><a class="btn btn-secondary" href="gestion-preoperacionales.html">Volver a inspecciones</a></div></div>`;
  }
  window.SIALPreop = { initList, initDetail };
})();
