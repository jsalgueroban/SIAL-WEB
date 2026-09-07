(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const number = (value) => Number(value || 0).toLocaleString("es-CO");

  const baseLines = [
    { id: "L1", farm: "LA CEIBA", client: "FYFFES", reference: "AGSTDRA", certification: "CONVENCIONAL", pallets: 18, boxes: 972, cutDate: "03/08/2026" },
    { id: "L2", farm: "MARTE", client: "FYFFES", reference: "ALGFT18BD", certification: "FAIRTRADE", pallets: 12, boxes: 648, cutDate: "04/08/2026" },
    { id: "L3", farm: "VIJAGUAL", client: "DOLE", reference: "MPBORG303", certification: "ORGÁNICA FAIRTRADE", pallets: 8, boxes: 384, cutDate: "05/08/2026" }
  ];

  const cloneLines = (changes = {}) => baseLines.map((line) => ({ ...line, ...(changes[line.id] || {}) }));
  const extraLines = [
    { id: "L4", farm: "CATALINA", client: "CHIQUITA", reference: "20LD7RA", certification: "CONVENCIONAL", pallets: 20, boxes: 1100, cutDate: "05/08/2026" },
    { id: "L5", farm: "TAMACARA", client: "GLOBAL FRUIT EXPORT", reference: "STDSRA", certification: "CONVENCIONAL", pallets: 24, boxes: 1252, cutDate: "06/08/2026" },
    { id: "L6", farm: "PRIMAVERA", client: "DOLE", reference: "AGSTDRA", certification: "CONVENCIONAL", pallets: 20, boxes: 1152, cutDate: "06/08/2026" }
  ];
  const version = (id, label, state, publishedAt, owner, reason, lines, differences = []) => ({ id, label, state, publishedAt, owner, reason, lines, differences });

  const commonFlow = [
    { area: "Planeación", status: "Publicado", detail: "Versión disponible", tone: "active" },
    { area: "Materiales", status: "Recibido", detail: "Sugerencias generadas", tone: "active" },
    { area: "Transporte", status: "Pendiente", detail: "Sin programación iniciada", tone: "warning" },
    { area: "Finca", status: "Disponible", detail: "3 fincas notificadas", tone: "active" },
    { area: "Puerto", status: "Pendiente", detail: "Sin operación iniciada", tone: "warning" }
  ];

  const catalog = {
    "AC-2026-032": {
      code: "AC-2026-032", week: "SEM-2026-32", type: "Inicial", status: "Publicado", group: "published", stage: "Preoperativa",
      owner: "Laura Gómez", company: "Banasan", current: "initial", canCorrect: true,
      scope: "Puedes consultar las 3 fincas incluidas porque pertenecen a tu alcance autorizado.",
      note: "Aviso vigente sin novedades pendientes.",
      versions: [version("initial", "Inicial", "Vigente", "02/08/2026, 10:24", "Laura Gómez", "Publicación inicial", cloneLines())],
      flow: commonFlow,
      evidence: [
        { name: "Loading Plan SEM-2026-32.xlsx", kind: "Loading Plan", date: "02/08/2026, 09:12" },
        { name: "Aviso AC-2026-032.pdf", kind: "Aviso publicado", date: "02/08/2026, 10:24" },
        { name: "Validación de referencias", kind: "Resultado de validación", date: "02/08/2026, 10:18" }
      ],
      history: [
        { date: "02/08/2026, 10:24", actor: "Laura Gómez", action: "Publicó la versión Inicial", origin: "Web", result: "Disponible para las áreas autorizadas" },
        { date: "02/08/2026, 10:18", actor: "Laura Gómez", action: "Validó certificaciones y cantidades", origin: "Web", result: "Sin bloqueos" },
        { date: "01/08/2026, 16:42", actor: "Carlos Mejía", action: "Creó el aviso desde Loading Plan", origin: "Web", result: "Borrador creado" }
      ]
    },
    "AC-2026-031-02": {
      code: "AC-2026-031-02", week: "SEM-2026-31", type: "Proyectado", status: "Publicado", group: "published", stage: "Programación iniciada",
      owner: "Laura Gómez", company: "Banasan", current: "v2", canCorrect: false,
      scope: "Puedes consultar las 5 fincas incluidas. La programación de transporte ya inició.",
      note: "La versión vigente es de consulta y no admite correcciones directas.",
      blockedReason: "La programación de transporte ya inició. Cualquier ajuste debe gestionarse como novedad autorizada.",
      versions: [
        version("v2", "Versión 2", "Vigente", "01/08/2026, 16:20", "Laura Gómez", "Ajuste confirmado por el cliente", cloneLines({ L1: { client: "DOLE", pallets: 20, boxes: 1080 }, L2: { pallets: 14, boxes: 756 } }).concat(extraLines.slice(0, 2)), [
          { line: "LA CEIBA", field: "Cliente", before: "FYFFES", after: "DOLE", impact: "Materiales" },
          { line: "LA CEIBA", field: "Palés", before: "18", after: "20", impact: "Materiales y Transporte" },
          { line: "MARTE", field: "Palés", before: "12", after: "14", impact: "Materiales y Transporte" }
        ]),
        version("initial", "Inicial", "Anterior", "30/07/2026, 11:30", "Laura Gómez", "Publicación inicial", cloneLines())
      ],
      flow: [
        { area: "Planeación", status: "Publicado", detail: "Versión 2 vigente", tone: "active" },
        { area: "Materiales", status: "Confirmado", detail: "Pedido actualizado", tone: "active" },
        { area: "Transporte", status: "En programación", detail: "Vehículos asignados", tone: "active" },
        { area: "Finca", status: "En preparación", detail: "5 fincas notificadas", tone: "active" },
        { area: "Puerto", status: "Pendiente", detail: "Sin recepción", tone: "warning" }
      ],
      evidence: [
        { name: "Loading Plan SEM-2026-31.xlsx", kind: "Loading Plan", date: "30/07/2026, 08:10" },
        { name: "Cambio cliente 01-08.pdf", kind: "Soporte del cambio", date: "01/08/2026, 15:48" },
        { name: "Aviso AC-2026-031-02 V2.pdf", kind: "Aviso publicado", date: "01/08/2026, 16:20" }
      ],
      history: [
        { date: "01/08/2026, 16:20", actor: "Laura Gómez", action: "Publicó la Versión 2", origin: "Web", result: "3 cambios trazados" },
        { date: "01/08/2026, 15:48", actor: "Laura Gómez", action: "Registró el motivo del cambio", origin: "Web", result: "Impacto confirmado" },
        { date: "30/07/2026, 11:30", actor: "Laura Gómez", action: "Publicó la versión Inicial", origin: "Web", result: "Aviso distribuido" }
      ]
    },
    "AC-2026-031-01": {
      code: "AC-2026-031-01", week: "SEM-2026-31", type: "Corrección", status: "Requiere corrección", group: "attention", stage: "Preoperativa",
      owner: "Mónica Salas", company: "Banasan", current: "v2", canCorrect: true,
      scope: "Puedes consultar las 4 fincas incluidas y preparar una corrección porque la operación continúa en etapa preoperativa.",
      note: "Una referencia quedó inactiva después de la publicación.",
      blockedReason: "La referencia ALGFT18BD requiere sustitución antes de continuar con Materiales y Transporte.",
      versions: [
        version("v2", "Versión 2", "Vigente con bloqueo", "01/08/2026, 14:05", "Mónica Salas", "Corrección de cantidades", cloneLines({ L2: { pallets: 13, boxes: 702 } }).concat([{ ...extraLines[0], pallets: 25, boxes: 1398 }]), [
          { line: "MARTE", field: "Palés", before: "12", after: "13", impact: "Materiales y Transporte" },
          { line: "MARTE", field: "Cajas", before: "648", after: "702", impact: "Materiales" }
        ]),
        version("initial", "Inicial", "Anterior", "28/07/2026, 11:30", "Mónica Salas", "Publicación inicial", cloneLines())
      ],
      flow: [
        { area: "Planeación", status: "Atención", detail: "Referencia inactiva", tone: "inactive" },
        { area: "Materiales", status: "Detenido", detail: "Pendiente de corrección", tone: "inactive" },
        { area: "Transporte", status: "Pendiente", detail: "Sin programación", tone: "warning" },
        { area: "Finca", status: "Informado", detail: "4 fincas visibles", tone: "active" },
        { area: "Puerto", status: "Pendiente", detail: "Sin operación iniciada", tone: "warning" }
      ],
      evidence: [{ name: "Aviso AC-2026-031-01 V2.pdf", kind: "Aviso publicado", date: "01/08/2026, 14:05" }],
      history: [
        { date: "01/08/2026, 14:05", actor: "Sistema", action: "Detectó una referencia inactiva", origin: "Catálogo de referencias", result: "Operación bloqueada" },
        { date: "01/08/2026, 13:48", actor: "Mónica Salas", action: "Publicó la Versión 2", origin: "Web", result: "Versión publicada" },
        { date: "28/07/2026, 11:30", actor: "Mónica Salas", action: "Publicó la versión Inicial", origin: "Web", result: "Aviso distribuido" }
      ]
    },
    "BOR-2026-033-01": {
      code: "BOR-2026-033-01", week: "SEM-2026-32", type: "Inicial", status: "Borrador incompleto", group: "draft", stage: "Preparación",
      owner: "Carlos Mejía", company: "Banasan", current: "draft", canCorrect: false, canEdit: true,
      scope: "Puedes consultar y continuar las 2 fincas incluidas en este borrador.", note: "Falta confirmar una referencia antes de validar.",
      versions: [version("draft", "Borrador", "En preparación", "02/08/2026, 08:42", "Carlos Mejía", "Trabajo en curso", cloneLines().slice(0, 2))],
      flow: [{ area: "Planeación", status: "Borrador", detail: "No publicado", tone: "warning" }],
      evidence: [{ name: "Loading Plan SEM-2026-32.xlsx", kind: "Loading Plan", date: "02/08/2026, 08:36" }],
      history: [{ date: "02/08/2026, 08:42", actor: "Carlos Mejía", action: "Guardó el borrador", origin: "Web", result: "1 referencia pendiente" }]
    },
    "BOR-2026-032-02": {
      code: "BOR-2026-032-02", week: "SEM-2026-32", type: "Proyectado", status: "Por conciliar", group: "attention", stage: "Preparación",
      owner: "Carlos Mejía", company: "Banasan", current: "draft", canCorrect: false, canEdit: true,
      scope: "Puedes consultar y continuar las 3 fincas incluidas en este borrador.", note: "El Loading Plan tiene 420 cajas pendientes por asignar.",
      versions: [version("draft", "Borrador", "En preparación", "28/07/2026, 15:48", "Carlos Mejía", "Conciliación pendiente", cloneLines())],
      flow: [{ area: "Planeación", status: "Atención", detail: "420 cajas pendientes", tone: "inactive" }],
      evidence: [{ name: "Loading Plan SEM-2026-32.xlsx", kind: "Loading Plan", date: "28/07/2026, 15:40" }],
      history: [{ date: "28/07/2026, 15:48", actor: "Carlos Mejía", action: "Comparó el Loading Plan", origin: "Web", result: "420 cajas por asignar" }]
    },
    "AC-2026-030-01": {
      code: "AC-2026-030-01", week: "SEM-2026-30", type: "Inicial", status: "Cerrado", group: "published", stage: "Cerrada",
      owner: "Laura Gómez", company: "Banasan", current: "initial", canCorrect: false,
      scope: "Puedes consultar el cierre histórico de las 6 fincas incluidas.", note: "Semana cerrada. Consulta disponible para trazabilidad.",
      blockedReason: "La operación está cerrada y no admite cambios.",
      versions: [version("initial", "Inicial", "Histórica", "20/07/2026, 09:10", "Laura Gómez", "Publicación inicial", cloneLines())],
      flow: [{ area: "Operación", status: "Cerrada", detail: "Trazabilidad completa", tone: "active" }],
      evidence: [{ name: "Cierre SEM-2026-30.pdf", kind: "Cierre operativo", date: "24/07/2026, 17:10" }],
      history: [{ date: "24/07/2026, 17:10", actor: "Laura Gómez", action: "Cerró la semana operativa", origin: "Web", result: "Consulta histórica" }]
    }
  };

  function init() {
    const route = new URLSearchParams(window.location.search);
    const notice = catalog[route.get("aviso") || "AC-2026-032"];
    const refs = {
      loading: qs("[data-consult-loading]"), error: qs("[data-consult-error]"), content: qs("[data-consult-content]"),
      title: qs("[data-consult-title]"), status: qs("[data-consult-status]"), subtitle: qs("[data-consult-subtitle]"), scope: qs("[data-consult-scope]"),
      primary: qs("[data-consult-primary]"), code: qs("[data-consult-code]"), description: qs("[data-consult-description]"), version: qs("[data-consult-version]"),
      versionState: qs("[data-consult-version-state]"), meta: qs("[data-consult-meta]"), block: qs("[data-consult-block]"), lines: qs("[data-consult-lines]"),
      lineCount: qs("[data-consult-line-count]"), versions: qs("[data-consult-versions]"), diffs: qs("[data-consult-diffs]"), diffCount: qs("[data-consult-diff-count]"),
      diffSubtitle: qs("[data-consult-diff-subtitle]"), diffWrap: qs("[data-consult-diff-wrap]"), noDiff: qs("[data-consult-no-diff]"), flow: qs("[data-consult-flow]"),
      evidence: qs("[data-consult-evidence]"), history: qs("[data-consult-history]"), export: qs("[data-consult-export]")
    };

    window.setTimeout(() => {
      refs.loading.classList.add("is-hidden");
      if (!notice) { refs.scope.classList.add("is-hidden"); refs.status.textContent = "Sin acceso"; refs.status.className = "status status-inactive"; refs.subtitle.textContent = "El aviso solicitado no está disponible dentro de tu alcance."; refs.export.classList.add("is-hidden"); refs.error.classList.remove("is-hidden"); return; }
      refs.content.classList.remove("is-hidden");
      renderNotice(notice, notice.current);
    }, 260);

    let activeVersionId = notice?.current || "";

    function renderNotice(item, versionId) {
      const selected = item.versions.find((entry) => entry.id === versionId) || item.versions[0];
      activeVersionId = selected.id;
      refs.title.textContent = item.group === "draft" ? "Consultar borrador de aviso" : "Consultar aviso de corte";
      refs.status.textContent = item.status;
      refs.status.className = `status ${item.group === "attention" ? "status-inactive" : item.group === "draft" ? "status-warning" : "status-active"}`;
      refs.subtitle.textContent = `${item.week} · ${item.type} · ${item.stage}`;
      refs.scope.querySelector("span").textContent = item.scope;
      refs.code.textContent = item.code;
      refs.description.textContent = item.note;
      refs.version.textContent = selected.label;
      refs.versionState.textContent = `${selected.state} · ${selected.publishedAt}`;

      const pallets = selected.lines.reduce((sum, line) => sum + Number(line.pallets || 0), 0);
      const boxes = selected.lines.reduce((sum, line) => sum + Number(line.boxes || 0), 0);
      refs.meta.innerHTML = [
        ["Semana", item.week], ["Empresa", item.company], ["Responsable", item.owner],
        ["Fincas visibles", new Set(selected.lines.map((line) => line.farm)).size], ["Palés", number(pallets)], ["Cajas", number(boxes)]
      ].map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("");

      refs.block.classList.toggle("is-hidden", !item.blockedReason);
      if (item.blockedReason) refs.block.innerHTML = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20L12 3Z"></path><path d="M12 9v5M12 17h.01"></path></svg><div><strong>Atención operativa</strong><span>${esc(item.blockedReason)}</span></div>`;

      refs.primary.classList.toggle("is-hidden", !(item.canCorrect || item.canEdit));
      if (item.canEdit) { refs.primary.textContent = "Continuar borrador"; refs.primary.href = `crear-aviso-corte.html?modo=editar&aviso=${encodeURIComponent(item.code)}`; }
      else if (item.canCorrect) { refs.primary.textContent = "Preparar corrección"; refs.primary.href = `crear-aviso-corte.html?modo=corregir&aviso=${encodeURIComponent(item.code)}`; }

      refs.lineCount.textContent = `${selected.lines.length} ${selected.lines.length === 1 ? "asignación" : "asignaciones"}`;
      refs.lines.innerHTML = selected.lines.map((line) => `<tr><td><strong>${esc(line.farm)}</strong></td><td><strong>${esc(line.client)}</strong><span class="cut-hub-meta">${esc(line.reference)}</span></td><td>${esc(line.certification)}</td><td class="is-number">${number(line.pallets)}</td><td class="is-number">${number(line.boxes)}</td><td>${esc(line.cutDate)}</td></tr>`).join("");

      refs.versions.innerHTML = item.versions.map((entry, index) => `<button class="cut-version-item${entry.id === selected.id ? " is-active" : ""}" type="button" data-version-id="${esc(entry.id)}" aria-pressed="${entry.id === selected.id}"><span><strong>${esc(entry.label)}</strong><small>${esc(entry.state)}</small></span><time>${esc(entry.publishedAt)}</time><small>${esc(entry.owner)}</small>${index === 0 ? '<span class="status status-active">Vigente</span>' : ""}</button>`).join("");
      qsa("[data-version-id]", refs.versions).forEach((button) => button.addEventListener("click", () => renderNotice(item, button.dataset.versionId)));

      refs.diffCount.textContent = `${selected.differences.length} ${selected.differences.length === 1 ? "cambio" : "cambios"}`;
      refs.diffSubtitle.textContent = selected.differences.length ? `Motivo: ${selected.reason}` : "Esta versión no tiene una anterior para comparar.";
      refs.diffWrap.classList.toggle("is-hidden", selected.differences.length === 0);
      refs.noDiff.classList.toggle("is-hidden", selected.differences.length > 0);
      refs.noDiff.innerHTML = '<strong>Sin diferencias anteriores</strong><span>Estás consultando la primera versión disponible de este aviso.</span>';
      refs.diffs.innerHTML = selected.differences.map((change) => `<tr><td>${esc(change.line)}</td><td><strong>${esc(change.field)}</strong></td><td><del>${esc(change.before)}</del></td><td><ins>${esc(change.after)}</ins></td><td>${esc(change.impact)}</td></tr>`).join("");

      const canPlanTransport = item.group === "published" && item.stage === "Preoperativa";
      refs.flow.innerHTML = item.flow.map((step) => `<div class="cut-flow-item"><span class="cut-flow-marker is-${esc(step.tone)}"></span><div><strong>${esc(step.area)}</strong><small>${esc(step.detail)}</small></div><span class="status status-${esc(step.tone)}">${esc(step.status)}</span></div>`).join("") + (canPlanTransport ? `<div class="cut-flow-plan-action"><a class="btn btn-primary" href="../Gestion%20de%20Transporte/plan-operacional.html?origen=aviso&id=${encodeURIComponent(item.code)}">Planificar transporte</a></div>` : "");
      refs.evidence.innerHTML = item.evidence.map((file, index) => `<div class="cut-evidence-item"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l3 3v15H6z"></path><path d="M9 11h6M9 15h5"></path></svg><div><strong>${esc(file.name)}</strong><small>${esc(file.kind)} · ${esc(file.date)}</small></div><button class="btn btn-ghost" type="button" data-evidence-index="${index}">Ver</button></div>`).join("") + '<div class="cut-evidence-preview is-hidden" data-evidence-preview></div>';
      qsa("[data-evidence-index]", refs.evidence).forEach((button) => button.addEventListener("click", () => {
        const file = item.evidence[Number(button.dataset.evidenceIndex)];
        const preview = qs("[data-evidence-preview]", refs.evidence);
        preview.innerHTML = `<div><strong>${esc(file.name)}</strong><span>Vista previa del soporte disponible en la propuesta.</span></div><button class="icon-btn" type="button" data-close-evidence aria-label="Cerrar vista previa"><svg class="icon" viewBox="0 0 24 24"><path d="m18 6-12 12M6 6l12 12"></path></svg></button>`;
        preview.classList.remove("is-hidden");
        qs("[data-close-evidence]", preview).addEventListener("click", () => preview.classList.add("is-hidden"));
      }));

      refs.history.innerHTML = item.history.map((entry) => `<article><span class="cut-timeline-marker"></span><div><div class="cut-timeline-head"><strong>${esc(entry.action)}</strong><time>${esc(entry.date)}</time></div><p>${esc(entry.actor)} · ${esc(entry.origin)}</p><small>${esc(entry.result)}</small></div></article>`).join("");
    }

    refs.export.addEventListener("click", () => {
      if (!notice) return;
      const selected = notice.versions.find((entry) => entry.id === activeVersionId) || notice.versions[0];
      const rows = [["Aviso", notice.code], ["Semana", notice.week], ["Versión", selected.label], [], ["Finca", "Cliente", "Referencia", "Certificación", "Palés", "Cajas", "Día de corte"], ...selected.lines.map((line) => [line.farm, line.client, line.reference, line.certification, line.pallets, line.boxes, line.cutDate])];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";")).join("\r\n");
      const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })); link.download = `${notice.code}-${selected.label.replace(/\s+/g, "-")}.csv`; link.click(); URL.revokeObjectURL(link.href);
    });
  }

  window.SIALCutNoticeDetail = { init };
})();
