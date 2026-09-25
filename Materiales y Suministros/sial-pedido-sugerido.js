const SIALSuggestedOrder = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const stateKey = "sial-hu659-generated";
  const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  const icons = {
    check: '<path d="m20 6-11 11-5-5"></path>',
    alert: '<path d="M12 3 2 21h20L12 3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M8 7h8"></path><path d="M8 11h2M14 11h2M8 15h2M14 15h2"></path>',
    download: '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle>'
  };

  const scenarios = {
    ceiba: {
      farm: "La Ceiba", code: "FIN-014", week: "SEM-2026-32", notice: "AC-2026-032", version: "Inicial",
      recipe: "REC-AGSTDRA · versión 3", inventory: "03/08/2026, 06:40", status: "ready",
      scope: "Banasan · finca autorizada", reference: "AGSTDRA", boxes: 2004, pallets: 38,
      message: "Las fuentes están completas. Revisa la fórmula antes de generar el pedido sugerido.",
      materials: [
        { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", need: 2004, stock: 1280, reserved: 120, incoming: 200, safety: 100 },
        { code: "MAT-TAP-001", name: "Tapa de cartón", unit: "unidades", need: 2004, stock: 900, reserved: 100, incoming: 500, safety: 100 },
        { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", need: 42, stock: 12, reserved: 2, incoming: 10, safety: 3 },
        { code: "MAT-EST-001", name: "Estiba de exportación", unit: "unidades", need: 38, stock: 12, reserved: 3, incoming: 5, safety: 4 }
      ]
    },
    marte: {
      farm: "Marte", code: "FIN-022", week: "SEM-2026-32", notice: "AC-2026-032", version: "Inicial",
      recipe: "Sin receta vigente", inventory: "03/08/2026, 06:35", status: "blocked", scope: "Banasan · finca autorizada",
      reference: "ALGFT18BD", boxes: 1040, pallets: 20,
      message: "No se puede calcular: la referencia ALGFT18BD no tiene una receta vigente.",
      resolution: "Solicita al responsable de materiales publicar la receta antes de generar el pedido."
    },
    vijagual: {
      farm: "Vijagual", code: "FIN-031", week: "SEM-2026-32", notice: "AC-2026-032", version: "Inicial",
      recipe: "REC-MPBORG303 · versión 2", inventory: "31/07/2026, 17:10", status: "blocked", scope: "Banasan · finca autorizada",
      reference: "MPBORG303", boxes: 960, pallets: 18,
      message: "No se puede calcular: el inventario de la finca está pendiente de actualización.",
      resolution: "Actualiza los movimientos de inventario para evitar sugerir cantidades con un saldo desactualizado."
    }
  };

  const format = (value) => new Intl.NumberFormat("es-CO").format(value);
  const suggested = (row) => Math.max(0, row.need + row.safety - (row.stock - row.reserved) - row.incoming);

  function statusChip(type, text) {
    return `<span class="status ${type === "ok" ? "status-active" : type === "blocked" ? "status-inactive" : "status-warning"}">${esc(text)}</span>`;
  }

  function sourceItem(label, value, state = "ok") {
    return `<div class="suggest-source-item ${state === "blocked" ? "is-blocked" : ""}">${icon(state === "blocked" ? icons.alert : icons.check)}<span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
  }

  function shell() {
    return `
      <p class="page-eyebrow">Materiales / Pedidos</p>
      <div class="page-header suggest-page-header">
        <div><h1 class="page-title">Pedido sugerido por finca</h1><p class="page-subtitle">Calcula la necesidad de materiales desde el aviso de corte, la receta vigente y el inventario disponible.</p></div>
      </div>

      <article class="card suggest-selector-card">
        <div class="card-header">
          <div><h2 class="card-title">Origen del cálculo</h2><p class="card-subtitle">Selecciona un aviso publicado y una finca dentro de tu alcance.</p></div>
          <a class="btn btn-secondary" href="../Gestion%20de%20Planeacion/consultar-aviso-corte.html?aviso=AC-2026-032">${icon(icons.eye)} Ver aviso</a>
        </div>
        <div class="card-body suggest-selector-grid">
          <div class="field"><label class="label" for="suggestNotice">Aviso de corte</label><select class="select" id="suggestNotice"><option value="AC-2026-032">AC-2026-032 · SEM-2026-32 · Publicado</option><option disabled>Los borradores no están disponibles</option></select></div>
          <div class="field"><label class="label" for="suggestFarm">Finca</label><select class="select" id="suggestFarm"><option value="ceiba">La Ceiba · lista para calcular</option><option value="marte">Marte · receta pendiente</option><option value="vijagual">Vijagual · inventario pendiente</option><option disabled>Solo se muestran fincas autorizadas</option></select></div>
          <div class="field"><label class="label" for="suggestCategory">Categoría del pedido <span class="required">*</span></label><select class="select" id="suggestCategory" required><option value="">Seleccionar categoría</option><option value="EMPA">EMPA · EMPAQUE</option><option value="ETIQ">ETIQ · ETIQUETA</option><option value="OPER">OPER · OPERATIVO</option></select></div>
          <button class="btn btn-primary" type="button" data-suggest-calculate>${icon(icons.calc)} Calcular sugerido</button>
        </div>
      </article>
      <section data-suggest-result aria-live="polite"></section>
      <div class="notice notice-success material-runtime-alert" data-suggest-feedback hidden><span data-suggest-feedback-message></span></div>
    `;
  }

  function readyView(data) {
    const generatedId = localStorage.getItem(`${stateKey}:${data.notice}:${data.code}`);
    return `
      <div class="notice notice-success suggest-state" role="status">${icon(icons.check)}<div><strong>Información lista para calcular</strong><span>${esc(data.message)}</span></div></div>
      <article class="card suggest-workspace">
        <div class="suggest-source-band" aria-label="Fuentes utilizadas">
          ${sourceItem("Aviso publicado", `${data.notice} · ${data.version}`)}
          ${sourceItem("Receta aplicada", data.recipe)}
          ${sourceItem("Inventario consultado", data.inventory)}
          ${sourceItem("Alcance", data.scope)}
        </div>
        <div class="card-header suggest-workspace-head">
          <div><p class="page-eyebrow">${esc(data.farm)} · ${esc(data.reference)} · <span data-suggest-category-label>categoría pendiente</span></p><h2 class="card-title">Cálculo de materiales</h2><p class="card-subtitle">${format(data.boxes)} cajas y ${format(data.pallets)} palés planificados en ${esc(data.week)}.</p></div>
          ${generatedId ? statusChip("ok", "Pedido generado") : statusChip("warning", "Pendiente de generar")}
        </div>
        <div class="table-wrap">
          <table class="materials-table suggest-formula-table">
            <thead><tr><th>Material</th><th>Necesidad del aviso</th><th>Stock físico</th><th>Ya reservado</th><th>Por recibir</th><th>Margen de seguridad</th><th>Sugerido</th></tr></thead>
            <tbody>${data.materials.map((row) => `
              <tr>
                <td><div class="materials-record-main"><strong>${esc(row.name)}</strong><span>${esc(row.code)} · ${esc(row.unit)}</span></div></td>
                <td class="suggest-number">${format(row.need)}</td><td class="suggest-number">${format(row.stock)}</td><td class="suggest-number">${format(row.reserved)}</td><td class="suggest-number">${format(row.incoming)}</td><td class="suggest-number">${format(row.safety)}</td>
                <td class="suggest-result-cell"><strong>${format(suggested(row))}</strong><span>${esc(row.unit)}</span></td>
              </tr>`).join("")}</tbody>
          </table>
        </div>
        <div class="suggest-formula-note"><strong>Cómo se obtiene:</strong><span>necesidad del aviso + margen de seguridad − stock utilizable − cantidades por recibir. El stock reservado no se considera disponible.</span></div>
        <div class="suggest-footer">
          <div class="suggest-total"><span>Materiales calculados</span><strong>${data.materials.length}</strong><small>Las cantidades conservan su unidad de medida por material.</small></div>
          <div class="card-actions"><button class="btn btn-secondary" type="button" data-suggest-export>${icon(icons.download)} Exportar cálculo</button>${generatedId ? `<a class="btn btn-primary" href="ajustar-pedido-sugerido.html?pedido=${encodeURIComponent(generatedId)}">Revisar y ajustar</a>` : `<button class="btn btn-primary" type="button" data-suggest-generate>Generar pedido sugerido</button>`}</div>
        </div>
      </article>
      ${auditView(data, generatedId)}
    `;
  }

  function blockedView(data) {
    return `
      <div class="notice notice-error suggest-state" role="alert" tabindex="-1" data-suggest-block>${icon(icons.alert)}<div><strong>Cálculo bloqueado</strong><span>${esc(data.message)}</span></div></div>
      <article class="card suggest-workspace">
        <div class="suggest-source-band" aria-label="Fuentes utilizadas">
          ${sourceItem("Aviso publicado", `${data.notice} · ${data.version}`)}
          ${sourceItem("Receta", data.recipe, data.recipe.startsWith("Sin") ? "blocked" : "ok")}
          ${sourceItem("Inventario consultado", data.inventory, data.farm === "Vijagual" ? "blocked" : "ok")}
          ${sourceItem("Alcance", data.scope)}
        </div>
        <div class="card-body suggest-block-body">
          <div><p class="page-eyebrow">${esc(data.farm)} · ${esc(data.reference)}</p><h2 class="card-title">Qué debes resolver</h2><p>${esc(data.resolution)}</p></div>
          <a class="btn btn-secondary" href="${data.farm === "Vijagual" ? "inventario-materiales-finca.html" : "gestion-materiales.html"}">${data.farm === "Vijagual" ? "Revisar inventario" : "Revisar configuración"}</a>
        </div>
      </article>`;
  }

  function auditView(data, generatedId) {
    return `<article class="card suggest-audit-card"><div class="card-header"><div><h2 class="card-title">Trazabilidad del cálculo</h2><p class="card-subtitle">Origen y resultado de las acciones realizadas sobre este sugerido.</p></div></div><div class="card-body suggest-audit-list">
      ${generatedId ? `<div class="suggest-audit-item"><span class="suggest-audit-dot"></span><div><strong>Pedido sugerido generado</strong><p>${esc(generatedId)} · QA Materiales · Web</p></div><time>03/08/2026, 09:18</time></div>` : ""}
      <div class="suggest-audit-item"><span class="suggest-audit-dot"></span><div><strong>Cálculo consultado</strong><p>${esc(data.notice)} · ${esc(data.farm)} · Web</p></div><time>03/08/2026, 09:15</time></div>
      <div class="suggest-audit-item"><span class="suggest-audit-dot"></span><div><strong>Fuentes verificadas</strong><p>${esc(data.recipe)} · inventario ${esc(data.inventory)}</p></div><time>03/08/2026, 09:15</time></div>
    </div></article>`;
  }

  function showDenied(root) {
    root.innerHTML = `<div class="notice notice-error suggest-state" role="alert"><div><strong>Sin acceso</strong><span>La finca solicitada no está disponible dentro de tu compañía y alcance autorizado.</span></div></div>`;
    qs("[data-suggest-generate]")?.remove();
  }

  function renderScenario(key, focusBlock = false) {
    const root = qs("[data-suggest-result]");
    const data = scenarios[key];
    if (!root || !data) { if (root) showDenied(root); return; }
    root.innerHTML = data.status === "ready" ? readyView(data) : blockedView(data);
    bindResultActions(data);
    const categoryLabel = qs("[data-suggest-category-label]");
    if (categoryLabel) categoryLabel.textContent = qs("#suggestCategory")?.value || "categoría pendiente";
    if (focusBlock) qs("[data-suggest-block]")?.focus({ preventScroll: true });
  }

  function feedback(message, type = "success") {
    const box = qs("[data-suggest-feedback]");
    const text = qs("[data-suggest-feedback-message]", box);
    if (!box || !text) return;
    box.className = `notice notice-${type} material-runtime-alert`;
    text.textContent = message;
    box.hidden = false;
    window.clearTimeout(box.timer);
    box.timer = window.setTimeout(() => { box.hidden = true; text.textContent = ""; }, 4200);
  }

  function exportCsv(data) {
    const header = ["Material","Código","Unidad","Necesidad","Stock","Reservado","Por recibir","Margen de seguridad","Sugerido"];
    const rows = data.materials.map((row) => [row.name,row.code,row.unit,row.need,row.stock,row.reserved,row.incoming,row.safety,suggested(row)]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `pedido-sugerido-${data.notice}-${data.code}.csv`; link.click(); URL.revokeObjectURL(url);
    feedback("Se exportó el cálculo de la finca seleccionada.");
  }

  function bindResultActions(data) {
    qs("[data-suggest-export]")?.addEventListener("click", () => exportCsv(data));
    qs("[data-suggest-generate]")?.addEventListener("click", (event) => {
      const category = qs("#suggestCategory")?.value;
      if (!category) { feedback("Selecciona una categoría activa antes de generar el pedido.", "warning"); qs("#suggestCategory")?.focus(); return; }
      const key = `${stateKey}:${data.notice}:${data.code}`;
      const existing = localStorage.getItem(key);
      if (existing) { feedback(`El pedido ${existing} ya existe. No se creó un duplicado.`, "info"); return; }
      const id = `PED-SUG-${data.week.replace("SEM-", "")}-${data.code.replace("FIN-", "")}`;
      localStorage.setItem(key, id);
      localStorage.setItem(`${key}:category`, category);
      event.currentTarget.disabled = true;
      event.currentTarget.textContent = "Pedido ya generado";
      feedback(`Pedido ${id} generado para ${data.farm}.`);
      renderScenario(qs("#suggestFarm").value);
    });
  }

  function deniedShell() {
    return `<p class="page-eyebrow">Materiales / Pedidos</p><div class="page-header"><div><h1 class="page-title">Pedido sugerido por finca</h1><p class="page-subtitle">Consulta restringida al alcance de tu usuario.</p></div><div class="card-actions"><a class="btn btn-secondary" href="index.html">Volver a materiales</a></div></div><div class="notice notice-error suggest-state" role="alert"><div><strong>Sin acceso</strong><span>No existe información disponible dentro de tu compañía y fincas autorizadas.</span></div></div>`;
  }

  function init() {
    SIALCore.initShell({ area: "gestion", module: "materiales", view: "pedidos" });
    const root = qs("[data-material-root]");
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const requestedFarm = params.get("finca");
    if (params.get("access") === "denied" || (requestedFarm && !scenarios[requestedFarm])) { root.innerHTML = deniedShell(); return; }
    root.innerHTML = shell();
    try { const active = new Set(JSON.parse(localStorage.getItem("sial-order-categories") || "[]").filter((item) => item.status === "ACTIVO").map((item) => item.code)); if (active.size) Array.from(qs("#suggestCategory").options).forEach((option) => { if (option.value && !active.has(option.value)) option.remove(); }); } catch { /* Conserva las categorías semilla. */ }
    if (requestedFarm) qs("#suggestFarm").value = requestedFarm;
    renderScenario(requestedFarm || "ceiba");
    qs("#suggestCategory")?.addEventListener("change", (event) => { const label = qs("[data-suggest-category-label]"); if (label) label.textContent = event.target.value || "categoría pendiente"; });
    qs("[data-suggest-calculate]")?.addEventListener("click", () => renderScenario(qs("#suggestFarm").value, true));
  }

  return { init };
})();
