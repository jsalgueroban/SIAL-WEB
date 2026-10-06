const SIALOrderAdjustment = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const format = (value) => new Intl.NumberFormat("es-CO").format(value);
  const params = new URLSearchParams(location.search);
  const orderId = params.get("pedido") || "PED-SUG-2026-32-014";
  const stateKey = `sial-hu660-adjustment:${orderId}`;
  const order = { id: orderId, notice: "AC-2026-032", farm: "La Ceiba", week: "SEM-2026-32", category: "EMPA", recipes: [
    { id: "REC-AGSTDRA-V3", reference: "AGSTDRA", version: "V3", boxes: 1200, pallets: 23, rows: [
      { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", suggested: 520, marginPercent: 10 },
      { code: "MAT-TAP-001", name: "Tapa de cartón", unit: "unidades", suggested: 580, marginPercent: 10 },
      { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", suggested: 16, marginPercent: 15 }
    ] },
    { id: "REC-20LD7RA-20-V2", reference: "20LD7RA-20", version: "V2", boxes: 804, pallets: 15, rows: [
      { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", suggested: 224, marginPercent: 10 },
      { code: "MAT-EST-001", name: "Estiba de exportación", unit: "unidades", suggested: 28, marginPercent: 15 },
      { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", suggested: 9, marginPercent: 15 }
    ] }
  ] };

  const model = order.recipes.map((recipe) => ({ ...recipe, rows: recipe.rows.map((row) => ({ ...row, requested: row.suggested, justification: "" })) }));
  const marginQuantity = (row) => Math.ceil(row.suggested * row.marginPercent / 100);
  const limit = (row) => ({ min: Math.max(0, row.suggested - marginQuantity(row)), max: row.suggested + marginQuantity(row) });
  const changed = (row) => Number(row.requested) !== row.suggested;
  const outside = (row) => Number(row.requested) < limit(row).min || Number(row.requested) > limit(row).max;

  function rowMarkup(row, recipeIndex, rowIndex, submitted) {
    const requestedId = `requested-${recipeIndex}-${rowIndex}`;
    const justificationId = `justification-${recipeIndex}-${rowIndex}`;
    return `<article class="adjust-material-item" data-adjust-line="${recipeIndex}:${rowIndex}">
      <div class="adjust-material-grid">
        <div class="adjust-material-identity"><div class="materials-record-main"><strong>${esc(row.name)}</strong><span>${esc(row.code)} · ${esc(row.unit)}</span></div></div>
        <div class="adjust-reference-group"><div><span>Sugerido</span><strong>${format(row.suggested)} <small>${esc(row.unit)}</small></strong></div><div><span>Margen</span><strong>${row.marginPercent}% · ${format(marginQuantity(row))} <small>${esc(row.unit)}</small></strong></div></div>
        <div class="adjust-request-group"><label class="adjust-request-label" for="${requestedId}">Cantidad solicitada</label><div class="adjust-request-control"><input class="input adjust-quantity" id="${requestedId}" type="number" min="0" step="1" value="${esc(row.requested)}" data-requested aria-label="Cantidad solicitada de ${esc(row.name)}" ${submitted ? "disabled" : ""}><div class="adjust-inline-state" data-margin-state></div></div></div>
      </div>
      <div class="adjust-justification-panel" data-justification-panel hidden>
        <label class="label" for="${justificationId}">Justificación del cambio <span class="required">*</span></label>
        <textarea class="textarea adjust-justification-input" id="${justificationId}" rows="2" data-justification placeholder="Explique por qué necesita una cantidad diferente" ${submitted ? "disabled" : ""}>${esc(row.justification)}</textarea>
        <span class="field-error" data-justification-error hidden>Explique por qué la cantidad difiere del sugerido.</span>
      </div>
    </article>`;
  }

  function recipeMarkup(recipe, recipeIndex, submitted) {
    return `<section class="recipe-order-group adjust-recipe-group" aria-labelledby="request-${esc(recipe.id)}"><div class="recipe-order-header adjust-recipe-header"><div><h3 id="request-${esc(recipe.id)}">${esc(recipe.reference)} · ${esc(recipe.version)}</h3><p class="adjust-recipe-meta"><span>${esc(recipe.id)}</span><span>${format(recipe.boxes)} cajas</span><span>${format(recipe.pallets)} pallets</span></p></div></div><div class="adjust-comparison-head" aria-hidden="true"><span>Material</span><span>Referencia</span><span>Solicitud</span></div><div class="adjust-material-list">${recipe.rows.map((row, rowIndex) => rowMarkup(row, recipeIndex, rowIndex, submitted)).join("")}</div></section>`;
  }

  function shell() {
    const submitted = Boolean(localStorage.getItem(stateKey));
    return `<p class="page-eyebrow">Materiales / Solicitud de pedido</p><div class="page-header"><div><h1 class="page-title">Solicitud de pedido por receta</h1><p class="page-subtitle">Confirma las cantidades de cada receta y justifica cualquier diferencia frente al sugerido.</p></div><div class="page-header-actions"><a class="btn btn-secondary" href="gestion-pedidos-materiales.html">Volver al sugerido</a></div></div><article class="card"><div class="card-header"><div><h2 class="card-title">${esc(order.id)} · ${esc(order.farm)}</h2><p class="card-subtitle">${esc(order.notice)} · ${esc(order.week)} · ${model.length} recetas</p></div><span class="status ${submitted ? "status-active" : "status-warning"}">${submitted ? "Solicitud enviada" : "Borrador"}</span></div><div class="recipe-order-groups">${model.map((recipe, index) => recipeMarkup(recipe, index, submitted)).join("")}</div><div class="card-body"><div class="notice notice-warning" data-adjust-errors hidden></div><div class="form-actions"><button class="btn btn-secondary" type="button" data-reset ${submitted ? "disabled" : ""}>Restablecer sugeridos</button><button class="btn btn-primary" type="button" data-submit ${submitted ? "disabled" : ""}>${submitted ? "Solicitud enviada" : "Enviar solicitud"}</button></div></div></article><div class="toast" role="status" aria-live="polite" data-feedback></div>`;
  }

  function rowFromElement(element) { const [recipeIndex, rowIndex] = element.dataset.adjustLine.split(":").map(Number); return model[recipeIndex].rows[rowIndex]; }
  function validate(showErrors = false) {
    const errors = [];
    qsa("[data-adjust-line]").forEach((element) => {
      const row = rowFromElement(element); const requested = Number(qs("[data-requested]", element).value); const justification = qs("[data-justification]", element).value.trim();
      row.requested = requested; row.justification = justification;
      const invalidQuantity = !Number.isFinite(requested) || requested < 0; const missingJustification = !invalidQuantity && changed(row) && !justification;
      qs("[data-justification-panel]", element).hidden = !changed(row);
      element.classList.toggle("is-changed", !invalidQuantity && changed(row));
      element.classList.toggle("is-exception", !invalidQuantity && outside(row));
      if (invalidQuantity) errors.push(`${row.name}: ingrese una cantidad válida.`); if (missingJustification) errors.push(`${row.name}: falta la justificación del cambio.`);
      qs("[data-justification]", element).classList.toggle("is-error", showErrors && missingJustification); qs("[data-justification-error]", element).hidden = !(showErrors && missingJustification);
      const state = qs("[data-margin-state]", element); state.innerHTML = invalidQuantity ? '<span class="status status-inactive">Cantidad inválida</span>' : !changed(row) ? '<span class="adjust-neutral-state">Sin cambio</span>' : outside(row) ? '<span class="status status-warning">Fuera del margen</span>' : '<span class="status status-active">Dentro del margen</span>';
    });
    const box = qs("[data-adjust-errors]"); box.hidden = !(showErrors && errors.length); box.textContent = errors.join(" "); return errors;
  }
  function flash(message) { const node = qs("[data-feedback]"); node.textContent = message; node.className = "toast toast-success show"; setTimeout(() => node.classList.remove("show"), 3200); }
  function bind() {
    qsa("[data-requested], [data-justification]").forEach((control) => control.addEventListener("input", () => validate(false)));
    qs("[data-reset]")?.addEventListener("click", () => { model.forEach((recipe) => recipe.rows.forEach((row) => { row.requested = row.suggested; row.justification = ""; })); qs("[data-adjustment-root]").innerHTML = shell(); bind(); validate(false); flash("Se restablecieron las cantidades sugeridas."); });
    qs("[data-submit]")?.addEventListener("click", () => { if (validate(true).length) return; const payload = { id: order.id, status: model.some((recipe) => recipe.rows.some(outside)) ? "Pendiente de aprobación excepcional" : "Pendiente de aprobación", recipes: model }; localStorage.setItem(stateKey, JSON.stringify(payload)); localStorage.setItem("sial-order-request-latest", JSON.stringify(payload)); qs("[data-adjustment-root]").innerHTML = shell(); bind(); validate(false); flash("La solicitud fue enviada a aprobación de Materiales."); });
  }
  function init() {
    SIALCore.initShell({ area: "gestion", module: "materiales", view: "pedidos" }); const root = qs("[data-adjustment-root]"); if (!root) return;
    try { const saved = JSON.parse(localStorage.getItem(stateKey) || "null"); if (saved?.recipes) saved.recipes.forEach((recipe, recipeIndex) => recipe.rows.forEach((row, rowIndex) => Object.assign(model[recipeIndex].rows[rowIndex], row))); } catch { /* Mantiene la semilla de demostración. */ }
    root.innerHTML = shell(); bind(); validate(false);
  }
  return { init };
})();
