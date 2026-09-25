const SIALAdditionalOrders = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const format = (value) => new Intl.NumberFormat("es-CO").format(value);
  const params = new URLSearchParams(location.search);
  const baseOrder = { id: "PED-SUG-2026-32-014", notice: "AC-2026-032", farm: "La Ceiba", farmCode: "FIN-014", reference: "AGSTDRA", week: "SEM-2026-32", status: "Validado" };
  baseOrder.category = "EMPA";
  const saveKey = `sial-hu666-additional:${baseOrder.id}`;
  const draftKey = `sial-hu666-draft:${baseOrder.id}`;
  const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  const icons = {
    add: '<path d="M12 5v14M5 12h14"></path>',
    arrow: '<path d="m15 18-6-6 6-6"></path>',
    check: '<path d="m20 6-11 11-5-5"></path>',
    alert: '<path d="M12 3 2 21h20L12 3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>',
    trash: '<path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v5M14 11v5"></path>'
  };

  const materials = [
    { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", base: 790, stock: 1280 },
    { code: "MAT-TAP-001", name: "Tapa de cartón", unit: "unidades", base: 925, stock: 900 },
    { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", base: 25, stock: 12 },
    { code: "MAT-EST-001", name: "Estiba de exportación", unit: "unidades", base: 28, stock: 12 }
  ];

  const seedRequests = [
    { id: "PAD-2026-32-002", base: baseOrder.id, notice: baseOrder.notice, farm: "La Ceiba", week: "SEM-2026-32", sequence: 2, lines: 2, quantity: "160 unidades", reason: "Incremento extraordinario del corte", status: "Pendiente de validación", updated: "Hoy, 10:42", document: "Pendiente de clasificación" },
    { id: "PAD-2026-32-001", base: baseOrder.id, notice: baseOrder.notice, farm: "La Ceiba", week: "SEM-2026-32", sequence: 1, lines: 1, quantity: "80 unidades", reason: "Diferencia de inventario", status: "Aprobado", updated: "Ayer, 16:10", document: "Remisión pendiente" },
    { id: "PAD-2026-31-004", base: "PED-SUG-2026-31-009", notice: "AC-2026-031", farm: "Vijagual", week: "SEM-2026-31", sequence: 4, lines: 2, quantity: "240 unidades", reason: "Entrega incompleta del proveedor", status: "En preparación", updated: "01/08/2026, 11:25", document: "REM-2026-0192" },
    { id: "PAD-2026-31-003", base: "PED-SUG-2026-31-006", notice: "AC-2026-031", farm: "Marte", week: "SEM-2026-31", sequence: 3, lines: 1, quantity: "40 unidades", reason: "Cambio operativo", status: "Entregado", updated: "31/07/2026, 17:40", document: "RPT-2026-0894" }
  ];

  const model = { category: "", lines: [{ material: materials[0].code, quantity: 0 }], reason: "", observation: "" };
  const listState = { page: 1, pageSize: 10 };

  function savedRequests() {
    try {
      const value = JSON.parse(localStorage.getItem(saveKey));
      if (Array.isArray(value)) return value;
      return value ? [value] : [];
    } catch { return []; }
  }

  function requests() {
    const saved = savedRequests();
    const savedIds = new Set(saved.map((item) => item.id));
    return [...saved, ...seedRequests.filter((item) => !savedIds.has(item.id))];
  }

  function nextSequence() {
    const current = requests().filter((item) => item.base === baseOrder.id && item.week === baseOrder.week);
    return current.reduce((max, item) => Math.max(max, Number(item.sequence) || 0), 0) + 1;
  }

  function requestKey(lines, reason) {
    const normalized = lines.map((line) => `${line.material}:${Number(line.quantity)}`).sort().join(",");
    return `${baseOrder.id}|${baseOrder.farmCode}|${reason}|${normalized}`;
  }

  function statusChip(value) {
    const key = String(value).toLowerCase();
    const cls = key.includes("entregado") || key === "aprobado" ? "status-active" : key.includes("rechaz") ? "status-inactive" : "status-warning";
    return `<span class="status ${cls}">${esc(value)}</span>`;
  }

  function header(title, subtitle, action = "", eyebrow = "Materiales / Pedidos adicionales") {
    return `<p class="page-eyebrow">${esc(eyebrow)}</p><div class="page-header additional-page-header"><div><h1 class="page-title">${esc(title)}</h1><p class="page-subtitle">${esc(subtitle)}</p></div>${action}</div>`;
  }

  function returnToAdditionalOrders() {
    return `<a class="btn btn-secondary" href="pedidos-adicionales.html">Volver a pedidos adicionales</a>`;
  }

  function deniedView() {
    return `${header("Pedidos adicionales", "Consulta restringida al alcance de tu usuario.")}<div class="notice notice-error additional-denied" role="alert"><div><strong>Información no disponible</strong><span>No existen pedidos visibles dentro de tu compañía y fincas autorizadas.</span></div></div><a class="btn btn-secondary mt-24" href="gestion-pedidos-materiales.html">Volver a Pedidos</a>`;
  }

  function listView() {
    return `
      ${header("Pedidos adicionales", "Consulta solicitudes excepcionales sin perder su relación con el pedido semanal.")}
      <article class="card additional-list-card">
        <div class="card-header">
          <div><h2 class="card-title">Gestión de solicitudes</h2><p class="card-subtitle">Cada adicional conserva el pedido base, su motivo y el estado del procesamiento.</p></div>
          <div class="card-actions"><span class="chip" data-additional-count>0 registros</span><a class="btn btn-primary" href="pedidos-adicionales.html?nuevo=1&base=${esc(baseOrder.id)}">${icon(icons.add)} Nuevo pedido adicional</a></div>
        </div>
        <div class="card-body">
          <div class="toolbar additional-list-toolbar">
          <input class="input additional-search" id="additionalSearch" type="search" aria-label="Buscar pedidos adicionales" placeholder="Buscar pedido, finca, aviso o motivo" />
          <select class="select" id="additionalStatus" aria-label="Filtrar por estado"><option value="">Todos los estados</option><option>Pendiente de validación</option><option>Aprobado</option><option>En preparación</option><option>Entregado</option></select>
          </div>
        </div>
        <div class="table-wrap"><table class="materials-table additional-list-table"><thead><tr><th>Pedido adicional</th><th>Pedido base</th><th>Solicitud</th><th>Motivo</th><th>Estado</th><th>Última actualización</th><th>Acciones</th></tr></thead><tbody data-additional-list></tbody></table></div>
        <div class="card-body" data-additional-empty-wrap hidden><div class="empty-state" data-additional-empty><h3>Sin resultados</h3><p>Ajusta la búsqueda o el estado para consultar otras solicitudes.</p></div></div>
        <div class="table-pagination" data-additional-pagination aria-label="Paginación de pedidos adicionales"></div>
      </article>
    `;
  }

  function renderList() {
    const body = qs("[data-additional-list]");
    if (!body) return;
    const term = (qs("#additionalSearch")?.value || "").trim().toLowerCase();
    const selected = qs("#additionalStatus")?.value || "";
    const visible = requests().filter((item) => {
      const haystack = [item.id, item.base, item.notice, item.farm, item.reason].join(" ").toLowerCase();
      return (!term || haystack.includes(term)) && (!selected || item.status === selected);
    });
    const total = visible.length;
    const totalPages = Math.max(1, Math.ceil(total / listState.pageSize));
    listState.page = Math.min(Math.max(listState.page, 1), totalPages);
    const startIndex = (listState.page - 1) * listState.pageSize;
    const pageItems = visible.slice(startIndex, startIndex + listState.pageSize);
    const start = total === 0 ? 0 : startIndex + 1;
    const end = Math.min(startIndex + listState.pageSize, total);
    const count = qs("[data-additional-count]");
    const emptyWrap = qs("[data-additional-empty-wrap]");
    if (count) count.textContent = `${start}-${end} de ${total} registros`;
    body.innerHTML = pageItems.map((item) => `<tr>
      <td><div class="materials-record-main"><strong>${esc(item.id)}</strong><span>Adicional ${esc(item.sequence)} de ${esc(item.week)}</span></div></td>
      <td><div class="materials-record-main"><strong>${esc(item.base)}</strong><span>${esc(item.notice)} · ${esc(item.farm)}</span></div></td>
      <td><strong>${esc(item.lines)} ${item.lines === 1 ? "material" : "materiales"}</strong><br><span class="muted">${esc(item.quantity)}</span></td>
      <td>${esc(item.reason)}</td><td>${statusChip(item.status)}</td><td class="muted">${esc(item.updated)}</td>
      <td><div class="row-actions"><a class="icon-btn" href="pedidos-adicionales.html?pedido=${encodeURIComponent(item.id)}" aria-label="Consultar ${esc(item.id)}">${icon(icons.eye)}</a></div></td>
    </tr>`).join("");
    const empty = qs("[data-additional-empty]");
    if (empty) { empty.hidden = visible.length > 0; empty.classList.toggle("show", visible.length === 0); }
    if (emptyWrap) emptyWrap.hidden = visible.length > 0;
    const pagination = qs("[data-additional-pagination]");
    if (pagination) {
      const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter((item) => totalPages <= 5 || Math.abs(item - listState.page) <= 2 || item === 1 || item === totalPages);
      const pageButtons = visiblePages.reduce((markup, item, index, items) => {
        const gap = index > 0 && item - items[index - 1] > 1 ? '<span class="pagination-gap" aria-hidden="true">…</span>' : "";
        const active = item === listState.page;
        return `${markup}${gap}<button class="pagination-btn${active ? " active" : ""}" type="button" data-additional-page="${item}"${active ? ' aria-current="page"' : ""}>${item}</button>`;
      }, "");
      pagination.innerHTML = `<div class="pagination-summary" aria-live="polite">Mostrando ${start}-${end} de ${total} registros</div><label class="pagination-size"><span>Registros por página</span><select class="select" data-additional-page-size aria-label="Registros por página"><option value="10" ${listState.pageSize === 10 ? "selected" : ""}>10</option><option value="30" ${listState.pageSize === 30 ? "selected" : ""}>30</option><option value="50" ${listState.pageSize === 50 ? "selected" : ""}>50</option></select></label><div class="pagination-pages" aria-label="Cambiar página"><button class="pagination-btn" type="button" data-additional-page="${listState.page - 1}" ${listState.page <= 1 ? "disabled" : ""}>Anterior</button>${pageButtons}<button class="pagination-btn" type="button" data-additional-page="${listState.page + 1}" ${listState.page >= totalPages ? "disabled" : ""}>Siguiente</button></div>`;
    }
  }

  function sourceChain() {
    return `<div class="additional-chain" aria-label="Cadena de origen del pedido"><div><span>Aviso de corte</span><strong>${esc(baseOrder.notice)}</strong></div><i aria-hidden="true">→</i><div><span>Pedido base</span><strong>${esc(baseOrder.id)}</strong></div><i aria-hidden="true">→</i><div class="is-current"><span>Nueva solicitud</span><strong>Adicional ${nextSequence()} · ${esc(baseOrder.week)}</strong></div></div>`;
  }

  function sourceContext() {
    return `<section class="additional-source-context" aria-labelledby="additional-source-title">
      <header class="additional-source-header"><div><span class="additional-section-kicker">Pedido base</span><h2 id="additional-source-title" class="card-title">${esc(baseOrder.id)}</h2><p class="card-subtitle">Esta solicitud conserva el origen del pedido semanal para su validación.</p></div><span class="status status-active">${esc(baseOrder.status)}</span></header>
      <dl class="additional-source-details"><div><dt>Aviso de corte</dt><dd>${esc(baseOrder.notice)}</dd></div><div><dt>Finca</dt><dd>${esc(baseOrder.farm)}</dd></div><div><dt>Referencia</dt><dd>${esc(baseOrder.reference)}</dd></div><div><dt>Semana</dt><dd>${esc(baseOrder.week)}</dd></div></dl>
    </section>`;
  }

  function materialOptions(selected, index) {
    return materials.map((item) => `<option value="${esc(item.code)}" ${item.code === selected ? "selected" : ""}>${esc(item.name)}</option>`).join("");
  }

  function lineResult(line) {
    const material = materials.find((item) => item.code === line.material);
    const quantity = Number(line.quantity);
    if (!material || !Number.isInteger(quantity) || quantity <= 0) return { type: "blocked", title: "Cantidad requerida", text: "Ingresa un entero mayor que cero." };
    if (quantity > material.stock) return { type: "warning", title: "Stock insuficiente", text: `Faltan ${format(quantity - material.stock)} ${material.unit}; requiere validación de abastecimiento.` };
    return { type: "ok", title: "Stock disponible", text: `Quedarían ${format(material.stock - quantity)} ${material.unit} visibles.` };
  }

  function resultMarkup(result) {
    const cls = result.type === "ok" ? "status-active" : result.type === "warning" ? "status-warning" : "status-inactive";
    return `<span class="status ${cls}">${esc(result.title)}</span><small>${esc(result.text)}</small>`;
  }

  function createView() {
    if (params.get("base") && params.get("base") !== baseOrder.id) return `${header("Nuevo pedido adicional", "La solicitud debe partir de un pedido válido.", returnToAdditionalOrders(), "Materiales / Pedidos adicionales / Registro")}<div class="notice notice-error" role="alert"><div><strong>Pedido base no disponible</strong><span>No existe información para mostrar dentro de tu alcance autorizado.</span></div></div>`;
    loadDraft();
    return `
      ${header("Nuevo pedido adicional", "Registra solo la necesidad que no quedó cubierta por el pedido semanal.", returnToAdditionalOrders(), "Materiales / Pedidos adicionales / Registro")}
      <form class="card additional-form" data-additional-form novalidate>
        ${sourceContext()}
        <section class="additional-form-section additional-materials-section" aria-labelledby="additional-materials-title">
          <header class="additional-section-header"><div><h2 id="additional-materials-title" class="card-title">Materiales solicitados</h2><p class="card-subtitle">Indica únicamente los materiales y cantidades que no cubrió el pedido base.</p></div><button class="btn btn-secondary" type="button" data-add-line ${model.lines.length >= materials.length ? "disabled" : ""}>${icon(icons.add)} Agregar material</button></header>
          <div class="additional-material-lines" data-additional-lines></div>
        </section>
        <section class="additional-form-section additional-reason-section" aria-labelledby="additional-reason-title">
          <header class="additional-section-header"><div><h2 id="additional-reason-title" class="card-title">Motivo y detalle</h2><p class="card-subtitle">Explica por qué esta necesidad no quedó cubierta por el pedido base.</p></div></header>
          <div class="additional-reason-fields">
            <div class="field"><label class="label" for="additionalCategory">Categoría del pedido <span class="required">*</span></label><select class="select" id="additionalCategory" required><option value="">Seleccionar categoría</option><option value="EMPA">EMPA · EMPAQUE</option><option value="ETIQ">ETIQ · ETIQUETA</option><option value="OPER">OPER · OPERATIVO</option></select><span class="field-error" data-category-error hidden>Selecciona una categoría activa.</span></div>
            <div class="field"><label class="label" for="additionalReason">Motivo de la solicitud</label><select class="select" id="additionalReason" required><option value="">Seleccionar motivo</option><option value="incremento-corte">Incremento extraordinario del corte</option><option value="inventario">Diferencia de inventario</option><option value="entrega-incompleta">Entrega incompleta del proveedor</option><option value="dano">Material dañado o no utilizable</option><option value="otro">Otra necesidad operativa</option></select><span class="field-error" data-reason-error hidden>Selecciona el motivo de la solicitud.</span></div>
            <div class="field"><label class="label" for="additionalObservation">Detalle <span class="additional-optional">Opcional</span></label><textarea class="input additional-textarea" id="additionalObservation" rows="3" placeholder="Agrega información útil para la validación."></textarea></div>
          </div>
        </section>
        <footer class="form-actions additional-submit-bar" aria-label="Acciones del pedido adicional">
          <div class="additional-submit-status" data-additional-summary aria-live="polite"></div>
          <div class="additional-submit-actions"><button class="btn btn-secondary" type="button" data-save-draft>Guardar borrador</button><button class="btn btn-primary" type="submit" data-submit-additional>Enviar a validación</button></div>
        </footer>
      </form>
      <div class="notice notice-success material-runtime-alert" data-additional-feedback hidden><span data-additional-feedback-message></span></div>
    `;
  }

  function loadDraft() {
    try {
      const draft = JSON.parse(localStorage.getItem(draftKey));
      if (!draft) return;
      model.category = draft.category || "";
      if (Array.isArray(draft.lines) && draft.lines.length) model.lines = draft.lines;
      model.reason = draft.reason || "";
      model.observation = draft.observation || "";
    } catch { localStorage.removeItem(draftKey); }
  }

  function renderLines() {
    const body = qs("[data-additional-lines]");
    if (!body) return;
    body.innerHTML = model.lines.map((line, index) => {
      const material = materials.find((item) => item.code === line.material) || materials[0];
      return `<article class="additional-material-line"><div class="additional-material-line-main"><div class="field additional-material-field"><label class="label" for="lineMaterial${index}">Material</label><select class="select" id="lineMaterial${index}" data-line-material="${index}">${materialOptions(line.material, index)}</select><small>${esc(material.code)} · ${esc(material.unit)}</small><dl class="additional-material-facts"><div><dt>Pedido base</dt><dd>${format(material.base)} ${esc(material.unit)}</dd></div><div><dt>Stock visible</dt><dd>${format(material.stock)} ${esc(material.unit)}</dd></div></dl></div><div class="field additional-quantity-field"><label class="label" for="lineQuantity${index}">Cantidad adicional</label><input class="input additional-quantity" id="lineQuantity${index}" aria-label="Cantidad adicional de ${esc(material.name)}" type="number" min="1" step="1" inputmode="numeric" value="${line.quantity || ""}" data-line-quantity="${index}" /><div class="additional-line-result">${resultMarkup(lineResult(line))}</div></div><button class="icon-btn additional-remove" type="button" aria-label="Quitar ${esc(material.name)}" data-remove-line="${index}" ${model.lines.length === 1 ? "disabled" : ""}>${icon(icons.trash)}</button></div></article>`;
    }).join("");
  }

  function formState() {
    const results = model.lines.map(lineResult);
    const blocked = results.filter((item) => item.type === "blocked").length;
    const shortages = results.filter((item) => item.type === "warning").length;
    return { blocked, shortages, valid: !blocked && Boolean(model.reason) && Boolean(model.category) };
  }

  function renderCreateState() {
    renderLines();
    const state = formState();
    const summary = qs("[data-additional-summary]");
    const submit = qs("[data-submit-additional]");
    const error = qs("[data-reason-error]");
    if (!summary || !submit) return;
    error.hidden = Boolean(model.reason) || model.lines.every((line) => !line.quantity);
    if (state.blocked) { summary.className = "additional-form-summary is-error"; summary.innerHTML = `${icon(icons.alert)}<div><strong>Completa las cantidades</strong><span>${state.blocked} ${state.blocked === 1 ? "línea necesita" : "líneas necesitan"} una cantidad válida.</span></div>`; }
    else if (!model.category) { summary.className = "additional-form-summary is-warning"; summary.innerHTML = `${icon(icons.alert)}<div><strong>Falta la categoría</strong><span>Selecciona cómo se clasifica el pedido.</span></div>`; }
    else if (!model.reason) { summary.className = "additional-form-summary is-warning"; summary.innerHTML = `${icon(icons.alert)}<div><strong>Falta el motivo</strong><span>Selecciona por qué necesitas este pedido adicional.</span></div>`; }
    else if (state.shortages) { summary.className = "additional-form-summary is-warning"; summary.innerHTML = `${icon(icons.alert)}<div><strong>${state.shortages} ${state.shortages === 1 ? "material supera" : "materiales superan"} el stock visible</strong><span>La solicitud quedará pendiente de validación de abastecimiento.</span></div>`; }
    else { summary.className = "additional-form-summary is-success"; summary.innerHTML = `${icon(icons.check)}<div><strong>Solicitud lista</strong><span>Las cantidades tienen stock visible y pasarán a validación.</span></div>`; }
    submit.disabled = !state.valid;
  }

  function draft() {
    localStorage.setItem(draftKey, JSON.stringify({ category: model.category, lines: model.lines, reason: model.reason, observation: model.observation }));
    feedback("El borrador quedó guardado en este dispositivo.");
  }

  function submit(event) {
    event.preventDefault();
    const state = formState();
    if (!state.valid) { renderCreateState(); qs(state.blocked ? "[data-line-quantity]" : "#additionalReason")?.focus(); return; }
    const idempotencyKey = requestKey(model.lines, model.reason);
    const existing = savedRequests().find((item) => item.idempotencyKey === idempotencyKey);
    if (existing) { feedback(`El pedido ${existing.id} ya fue registrado con la misma solicitud. No se creó un duplicado.`); return; }
    const sequence = nextSequence();
    const total = model.lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
    const now = new Date();
    const saved = { id: `PAD-2026-32-${String(sequence).padStart(3, "0")}`, base: baseOrder.id, notice: baseOrder.notice, farm: baseOrder.farm, farmCode: baseOrder.farmCode, week: baseOrder.week, reference: baseOrder.reference, sequence, lines: model.lines.length, quantity: `${format(total)} en unidades de cada material`, reason: qs("#additionalReason").selectedOptions[0].textContent, reasonCode: model.reason, observation: model.observation, status: "Pendiente de validación", updated: "Ahora", createdAt: now.toISOString(), actor: "QA Materiales · Web", document: "Pendiente de clasificación", shortages: state.shortages, idempotencyKey, detailLines: model.lines.map((line) => ({ ...line, ...materials.find((item) => item.code === line.material) })) };
    saved.category = model.category;
    localStorage.setItem(saveKey, JSON.stringify([...savedRequests(), saved]));
    localStorage.removeItem(draftKey);
    location.href = `pedidos-adicionales.html?pedido=${encodeURIComponent(saved.id)}&creado=1`;
  }

  function detailView(id) {
    const item = requests().find((request) => request.id === id);
    if (!item) return `${header("Consultar pedido adicional", "La solicitud debe estar dentro de tu alcance.", returnToAdditionalOrders(), "Materiales / Pedidos adicionales / Detalle")}<div class="notice notice-error" role="alert"><div><strong>Pedido no disponible</strong><span>No existe información para mostrar dentro de tu compañía y fincas autorizadas.</span></div></div>`;
    const created = params.get("creado") === "1";
    const steps = timeline(item.status);
    const lines = item.detailLines || [{ name: item.quantity, code: "Detalle consolidado", unit: "", quantity: "—", stock: "—" }];
    return `
      ${header(item.id, "Consulta el origen, la validación y los hitos posteriores de la solicitud.", `<div class="card-actions">${statusChip(item.status)}${returnToAdditionalOrders()}</div>`, "Materiales / Pedidos adicionales / Detalle")}
      <div class="notice notice-info"><strong>Categoría del pedido:</strong>&nbsp; ${esc(item.category || baseOrder.category)}</div>
      ${created ? `<div class="notice notice-success additional-created" role="status">${icon(icons.check)}<div><strong>Pedido adicional registrado</strong><span>La solicitud se creó una sola vez y quedó pendiente de validación.</span></div></div>` : ""}
      <article class="card additional-detail-card">
        <div class="additional-chain" aria-label="Cadena de origen del pedido"><div><span>Aviso de corte</span><strong>${esc(item.notice)}</strong></div><i aria-hidden="true">→</i><div><span>Pedido base</span><strong>${esc(item.base)}</strong></div><i aria-hidden="true">→</i><div class="is-current"><span>Pedido adicional</span><strong>${esc(item.id)}</strong></div></div>
        <div class="additional-context"><div><span>Finca</span><strong>${esc(item.farm)}</strong></div><div><span>Semana</span><strong>${esc(item.week)}</strong></div><div><span>Motivo</span><strong>${esc(item.reason)}</strong></div><div><span>Documento</span><strong>${esc(item.document)}</strong></div><div><span>Actor / fecha</span><strong>${esc(item.actor || "Histórico")}</strong><small>${esc(item.createdAt || item.updated)}</small></div><div><span>Idempotencia</span><strong>${esc(item.idempotencyKey || "Histórico")}</strong></div></div>
        <div class="card-header"><div><h2 class="card-title">Materiales solicitados</h2><p class="card-subtitle">Valores registrados al crear la solicitud.</p></div></div>
        <div class="table-wrap"><table class="materials-table additional-detail-table"><thead><tr><th>Material</th><th>Cantidad adicional</th><th>Stock consultado</th><th>Resultado inicial</th></tr></thead><tbody>${lines.map((line) => `<tr><td><div class="materials-record-main"><strong>${esc(line.name)}</strong><span>${esc(line.code || "")}</span></div></td><td>${line.quantity === "—" ? esc(item.quantity) : `${format(Number(line.quantity))} ${esc(line.unit)}`}</td><td>${line.stock === "—" ? "No detallado" : `${format(Number(line.stock))} ${esc(line.unit)}`}</td><td>${line.quantity === "—" ? statusChip("Registrado") : resultMarkup(lineResult({ material: line.code, quantity: line.quantity }))}</td></tr>`).join("")}</tbody></table></div>
        <div class="additional-detail-grid"><section><h2 class="card-title">Seguimiento</h2><div class="additional-timeline">${steps}</div></section><aside><h2 class="card-title">Condiciones de continuidad</h2><div class="additional-conditions"><div>${icon(icons.check)}<span>Origen y responsable registrados</span></div><div>${icon(item.status === "Entregado" ? icons.check : icons.alert)}<span>${item.status === "Entregado" ? "Entrega finalizada con soporte" : "Documento logístico y entrega aún no finalizados"}</span></div><div>${icon(icons.alert)}<span>No puede cerrarse con devolución, novedad o soporte pendiente</span></div></div></aside></div>
      </article>
    `;
  }

  function timeline(status) {
    const order = ["Registrado", "Pendiente de validación", "Aprobado", "En preparación", "Entregado"];
    const current = Math.max(1, order.indexOf(status));
    return order.map((label, index) => `<div class="additional-timeline-item ${index < current ? "is-done" : index === current ? "is-current" : ""}"><span>${index < current ? icon(icons.check) : ""}</span><div><strong>${esc(label)}</strong><p>${index === 0 ? "Solicitud vinculada al pedido base." : index === 1 ? "Revisión de cantidades, stock y motivo." : index === 2 ? "Decisión registrada por el responsable autorizado." : index === 3 ? "Clasificación documental y preparación logística." : "Entrega y soportes disponibles."}</p></div></div>`).join("");
  }

  function feedback(message) {
    const box = qs("[data-additional-feedback]");
    const text = qs("[data-additional-feedback-message]", box);
    if (!box || !text) return;
    text.textContent = message; box.hidden = false;
    clearTimeout(box.timer); box.timer = setTimeout(() => { box.hidden = true; }, 4200);
  }

  function bindList() {
    qs("#additionalSearch")?.addEventListener("input", () => { listState.page = 1; renderList(); });
    qs("#additionalStatus")?.addEventListener("change", () => { listState.page = 1; renderList(); });
    qs("[data-additional-pagination]")?.addEventListener("click", (event) => {
      const page = event.target.closest("[data-additional-page]");
      if (!page || page.disabled) return;
      listState.page = Number(page.dataset.additionalPage) || 1;
      renderList();
    });
    qs("[data-additional-pagination]")?.addEventListener("change", (event) => {
      const size = event.target.closest("[data-additional-page-size]");
      if (!size) return;
      listState.pageSize = Number(size.value) || 10;
      listState.page = 1;
      renderList();
    });
    renderList();
  }

  function bindCreate() {
    try { const active = new Set(JSON.parse(localStorage.getItem("sial-order-categories") || "[]").filter((item) => item.status === "ACTIVO").map((item) => item.code)); if (active.size) Array.from(qs("#additionalCategory").options).forEach((option) => { if (option.value && !active.has(option.value)) option.remove(); }); } catch { /* Conserva las categorías semilla. */ }
    qs("#additionalCategory").value = model.category;
    qs("#additionalReason").value = model.reason;
    qs("#additionalObservation").value = model.observation;
    qs("[data-additional-lines]")?.addEventListener("input", (event) => {
      const input = event.target.closest("[data-line-quantity]");
      if (!input) return;
      const index = Number(input.dataset.lineQuantity); model.lines[index].quantity = input.value === "" ? 0 : Number(input.value); renderCreateState(); qs(`[data-line-quantity="${index}"]`)?.focus({ preventScroll: true });
    });
    qs("[data-additional-lines]")?.addEventListener("change", (event) => {
      const select = event.target.closest("[data-line-material]"); if (!select) return;
      model.lines[Number(select.dataset.lineMaterial)].material = select.value; renderCreateState();
    });
    qs("[data-additional-lines]")?.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove-line]"); if (!remove || model.lines.length === 1) return;
      model.lines.splice(Number(remove.dataset.removeLine), 1); renderCreateState();
    });
    qs("[data-add-line]")?.addEventListener("click", () => {
      const used = new Set(model.lines.map((line) => line.material));
      const next = materials.find((item) => !used.has(item.code)); if (!next) return;
      model.lines.push({ material: next.code, quantity: 0 }); renderCreateState();
    });
    qs("#additionalReason")?.addEventListener("change", (event) => { model.reason = event.target.value; renderCreateState(); });
    qs("#additionalCategory")?.addEventListener("change", (event) => { model.category = event.target.value; renderCreateState(); });
    qs("#additionalObservation")?.addEventListener("input", (event) => { model.observation = event.target.value; });
    qs("[data-save-draft]")?.addEventListener("click", draft);
    qs("[data-additional-form]")?.addEventListener("submit", submit);
    renderCreateState();
  }

  function init() {
    SIALCore.initShell({ area: "gestion", module: "materiales", view: "pedidos" });
    const root = qs("[data-additional-root]"); if (!root) return;
    if (params.get("access") === "denied") { root.innerHTML = deniedView(); return; }
    const requested = params.get("pedido");
    if (requested) { root.innerHTML = detailView(requested); return; }
    if (params.get("nuevo") === "1") { root.innerHTML = createView(); if (qs("[data-additional-form]")) bindCreate(); return; }
    root.innerHTML = listView(); bindList();
  }

  return { init };
})();
