const SIALOrderAdjustment = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const format = (value) => new Intl.NumberFormat("es-CO").format(value);
  const params = new URLSearchParams(location.search);
  const orderId = params.get("pedido") || "PED-SUG-2026-32-014";
  const stateKey = `sial-hu660-adjustment:${orderId}`;
  const adjustmentRuleState = "pending";
  const icon = (path) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
  const icons = {
    arrow: '<path d="m15 18-6-6 6-6"></path>',
    alert: '<path d="M12 3 2 21h20L12 3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path>',
    check: '<path d="m20 6-11 11-5-5"></path>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path>'
  };

  const order = {
    id: "PED-SUG-2026-32-014", notice: "AC-2026-032", farm: "La Ceiba", farmCode: "FIN-014",
    week: "SEM-2026-32", reference: "AGSTDRA", version: "Inicial", category: localStorage.getItem("sial-hu659-generated:AC-2026-032:FIN-014:category") || "EMPA",
    rows: [
      { code: "MAT-CAR-001", name: "Caja de cartón corrugado", unit: "unidades", suggested: 744, stock: 1280, tolerance: 10 },
      { code: "MAT-TAP-001", name: "Tapa de cartón", unit: "unidades", suggested: 804, stock: 900, tolerance: 10 },
      { code: "MAT-ETQ-001", name: "Etiqueta de trazabilidad", unit: "rollos", suggested: 25, stock: 12, tolerance: 15 },
      { code: "MAT-EST-001", name: "Estiba de exportación", unit: "unidades", suggested: 28, stock: 12, tolerance: 15 }
    ]
  };

  const model = {
    rows: order.rows.map((row) => ({ ...row, adjusted: row.suggested })),
    submitted: localStorage.getItem(stateKey),
    reason: "",
    observation: ""
  };

  function deniedShell() {
    return `<p class="page-eyebrow">Materiales / Pedidos</p><div class="page-header"><div><h1 class="page-title">Revisar cantidades del pedido</h1><p class="page-subtitle">Consulta restringida al alcance de tu usuario.</p></div><div class="card-actions"><a class="btn btn-secondary" href="gestion-pedidos-materiales.html">Volver a pedidos</a></div></div><div class="notice notice-error adjust-denied" role="alert"><div><strong>Pedido no disponible</strong><span>No existe información para mostrar dentro de tu compañía y fincas autorizadas.</span></div></div>`;
  }

  function shell() {
    return `
      <p class="page-eyebrow">Materiales / Pedidos</p>
      <div class="page-header adjust-page-header">
        <div><h1 class="page-title">Revisar cantidades del pedido</h1><p class="page-subtitle">Compara el sugerido, ajusta lo necesario y deja el motivo antes de confirmar.</p></div>
        <div class="card-actions"><span class="status status-warning" data-adjust-order-status>Pendiente de revisión</span><a class="btn btn-secondary" href="gestion-pedidos-materiales.html">Volver a pedidos</a></div>
      </div>

      <div class="notice notice-warning adjust-rule-notice" role="alert">${icon(icons.alert)}<div><strong>Regla de ajuste pendiente</strong><span>La matriz oficial de tolerancias, el tratamiento del sugerido cero y el aprobador aún no están publicados. Esta propuesta bloquea cualquier cambio de cantidad hasta que exista esa configuración.</span></div></div>

      <article class="card adjust-card">
        <div class="adjust-context" aria-label="Contexto del pedido">
          <div><span>Pedido</span><strong>${esc(order.id)}</strong></div>
          <div><span>Aviso de corte</span><strong>${esc(order.notice)}</strong></div>
          <div><span>Finca</span><strong>${esc(order.farm)}</strong></div>
          <div><span>Categoría</span><strong>${esc(order.category)}</strong></div>
          <div><span>Referencia y semana</span><strong>${esc(order.reference)} · ${esc(order.week)}</strong></div>
        </div>

        <div class="card-header adjust-table-head">
          <div><h2 class="card-title">Cantidades por material</h2><p class="card-subtitle">El estado de cada fila se actualiza al cambiar la cantidad solicitada.</p></div>
          <button class="btn btn-secondary" type="button" data-adjust-reset>${icon(icons.reset)} Restablecer cantidades</button>
        </div>
        <div class="table-wrap">
          <table class="materials-table adjust-table">
            <thead><tr><th>Material</th><th>Sugerido</th><th>Stock visible</th><th>Cantidad solicitada</th><th>Variación</th><th>Validación</th></tr></thead>
            <tbody data-adjust-rows></tbody>
          </table>
        </div>
        <p class="adjust-rule-footnote">Los porcentajes de referencia no se aplican como regla operativa. Solo las cantidades sin cambio pueden confirmarse mientras la matriz oficial siga pendiente.</p>

        <div class="adjust-review-grid">
          <section class="adjust-fields" aria-labelledby="adjustReasonTitle">
            <div><h2 class="card-title" id="adjustReasonTitle">Justificación del ajuste</h2><p class="card-subtitle">Solo es obligatoria cuando cambias una cantidad.</p></div>
            <div class="field"><label class="label" for="adjustReason">Motivo</label><select class="select" id="adjustReason"><option value="">Seleccionar motivo</option><option value="cambio-produccion">Cambio en la necesidad de producción</option><option value="inventario">Diferencia de inventario identificada</option><option value="presentacion">Ajuste de presentación o empaque</option><option value="otro">Otro motivo operativo</option></select><span class="field-error" data-adjust-reason-error hidden>Selecciona el motivo del ajuste.</span></div>
            <div class="field"><label class="label" for="adjustObservation">Detalle del ajuste <span class="adjust-optional">(opcional)</span></label><textarea class="input adjust-textarea" id="adjustObservation" rows="3" placeholder="Agrega información útil para quien revise el pedido."></textarea></div>
          </section>
          <aside class="adjust-summary" aria-labelledby="adjustSummaryTitle">
            <h2 class="card-title" id="adjustSummaryTitle">Resultado de la revisión</h2>
            <div class="adjust-summary-list">
              <div><span>Sin cambios</span><strong data-count-unchanged>0</strong></div>
              <div><span>Dentro del límite</span><strong data-count-within>0</strong></div>
              <div><span>Requieren aprobación</span><strong data-count-exception>0</strong></div>
              <div><span>Con bloqueo</span><strong data-count-blocked>0</strong></div>
            </div>
            <div class="adjust-next" data-adjust-next aria-live="polite"></div>
          </aside>
        </div>

        <div class="adjust-actions">
          <p data-adjust-action-help>Revisa las cantidades antes de continuar.</p>
          <div class="card-actions"><a class="btn btn-secondary" href="gestion-pedidos-materiales.html" data-adjust-secondary>Guardar para después</a><button class="btn btn-primary" type="button" data-adjust-submit></button></div>
        </div>
      </article>
      <article class="card adjust-audit-card" data-adjust-audit></article>
      <div class="notice notice-success material-runtime-alert" data-adjust-feedback hidden><span data-adjust-feedback-message></span></div>
    `;
  }

  function classify(row) {
    const value = Number(row.adjusted);
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) return { type: "blocked", label: "Cantidad no válida", detail: "Ingresa un número entero igual o mayor que cero." };
    if (value === row.suggested) return { type: "unchanged", label: "Sin cambio", detail: "No requiere aplicar una tolerancia." };
    if (adjustmentRuleState !== "confirmed") return { type: "blocked", label: "Regla pendiente", detail: "La tolerancia oficial aún no está configurada." };
    if (row.suggested === 0 && value > 0) return { type: "blocked", label: "Regla pendiente", detail: "Debe definirse cómo solicitar cuando el sugerido es cero." };
    const percent = Math.abs(((value - row.suggested) / row.suggested) * 100);
    if (percent > row.tolerance) return { type: "exception", label: "Requiere aprobación", detail: `Supera el límite ilustrativo del ${row.tolerance}%.` };
    return { type: "within", label: "Dentro del límite", detail: `Se mantiene dentro del ${row.tolerance}%.` };
  }

  function variation(row) {
    const value = Number(row.adjusted);
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) return "—";
    const delta = value - row.suggested;
    if (!delta) return "0";
    if (row.suggested === 0) return `+${format(delta)}`;
    const percent = Math.abs((delta / row.suggested) * 100);
    return `${delta > 0 ? "+" : "−"}${format(Math.abs(delta))} · ${percent.toFixed(1).replace(".", ",")}%`;
  }

  function chip(result) {
    const className = result.type === "unchanged" ? "status-active" : result.type === "within" ? "status-active" : result.type === "exception" ? "status-warning" : "status-inactive";
    return `<span class="status ${className}">${esc(result.label)}</span><small>${esc(result.detail)}</small>`;
  }

  function renderRows() {
    const body = qs("[data-adjust-rows]");
    if (!body) return;
    body.innerHTML = model.rows.map((row, index) => {
      const result = classify(row);
      return `<tr class="adjust-row is-${result.type}">
        <td><div class="materials-record-main"><strong>${esc(row.name)}</strong><span>${esc(row.code)} · ${esc(row.unit)}</span></div></td>
        <td class="adjust-number"><strong>${format(row.suggested)}</strong><span>${esc(row.unit)}</span></td>
        <td class="adjust-number"><strong>${format(row.stock)}</strong><span>${esc(row.unit)}</span></td>
        <td><input class="input adjust-quantity" id="adjustQty${index}" aria-label="Cantidad solicitada de ${esc(row.name)}" type="number" min="0" step="1" inputmode="numeric" value="${esc(row.adjusted)}" data-adjust-quantity="${index}" ${model.submitted ? "disabled" : ""} /></td>
        <td class="adjust-variation">${esc(variation(row))}</td>
        <td class="adjust-validation">${chip(result)}</td>
      </tr>`;
    }).join("");
    bindQuantityInputs();
  }

  function summary() {
    const counts = { unchanged: 0, within: 0, exception: 0, blocked: 0 };
    model.rows.forEach((row) => counts[classify(row).type] += 1);
    const changed = counts.within + counts.exception + counts.blocked;
    const reasonMissing = changed > 0 && !model.reason;
    return { counts, changed, reasonMissing };
  }

  function renderState() {
    renderRows();
    const { counts, changed, reasonMissing } = summary();
    Object.entries(counts).forEach(([key, value]) => { const target = qs(`[data-count-${key}]`); if (target) target.textContent = value; });
    const next = qs("[data-adjust-next]");
    const submit = qs("[data-adjust-submit]");
    const help = qs("[data-adjust-action-help]");
    const reasonError = qs("[data-adjust-reason-error]");
    const status = qs("[data-adjust-order-status]");
    if (!next || !submit || !help) return;

    if (model.submitted) {
      const saved = JSON.parse(model.submitted);
      status.className = `status ${saved.status === "Pendiente de aprobación" ? "status-warning" : "status-active"}`;
      status.textContent = saved.status;
      next.className = "adjust-next is-success";
      next.innerHTML = `${icon(icons.check)}<div><strong>Revisión registrada</strong><span>${esc(saved.message)}</span></div>`;
      submit.textContent = saved.status;
      submit.disabled = true;
      qs("[data-adjust-reset]").disabled = true;
      qs("#adjustReason").disabled = true;
      qs("#adjustObservation").disabled = true;
      qs("[data-adjust-secondary]").textContent = "Volver a Pedidos";
      help.textContent = "La revisión quedó registrada y no se duplicará al recargar.";
      renderAudit(saved);
      return;
    }

    reasonError.hidden = !reasonMissing;
    if (counts.blocked) {
      next.className = "adjust-next is-error";
      next.innerHTML = `${icon(icons.alert)}<div><strong>No puedes continuar</strong><span>Corrige las filas marcadas antes de guardar.</span></div>`;
      submit.textContent = "Resolver bloqueos";
      submit.disabled = true;
      help.textContent = "Hay cantidades que aún no cumplen una regla definida.";
    } else if (reasonMissing) {
      next.className = "adjust-next is-warning";
      next.innerHTML = `${icon(icons.alert)}<div><strong>Falta el motivo</strong><span>Selecciona por qué cambiaste las cantidades.</span></div>`;
      submit.textContent = counts.exception ? "Enviar a aprobación" : "Guardar y validar";
      submit.disabled = true;
      help.textContent = "La justificación acompaña el historial del pedido.";
    } else if (counts.exception) {
      next.className = "adjust-next is-warning";
      next.innerHTML = `${icon(icons.alert)}<div><strong>${counts.exception} ${counts.exception === 1 ? "ajuste supera" : "ajustes superan"} el límite</strong><span>El pedido quedará pendiente hasta que el responsable definido lo apruebe.</span></div>`;
      submit.textContent = "Enviar a aprobación";
      submit.disabled = false;
      help.textContent = "No se aprueba automáticamente ninguna excepción.";
    } else {
      next.className = "adjust-next is-success";
      next.innerHTML = `${icon(icons.check)}<div><strong>${changed ? "Ajustes dentro del límite" : "Cantidades confirmadas"}</strong><span>${changed ? "Puedes guardar la revisión." : "El pedido conserva las cantidades sugeridas."}</span></div>`;
      submit.textContent = changed ? "Guardar y validar" : "Confirmar pedido";
      submit.disabled = false;
      help.textContent = changed ? "Los cambios quedarán registrados en la trazabilidad." : "No se registrarán diferencias de cantidad.";
    }
    status.className = "status status-warning";
    status.textContent = counts.exception ? "Con excepción" : changed ? "Con ajustes" : "Pendiente de revisión";
    renderAudit();
  }

  function renderAudit(saved) {
    const target = qs("[data-adjust-audit]");
    if (!target) return;
    const changes = model.rows.filter((row) => Number(row.adjusted) !== row.suggested);
    target.innerHTML = `<div class="card-header"><div><h2 class="card-title">Trazabilidad de la revisión</h2><p class="card-subtitle">Diferencias y decisiones asociadas al pedido.</p></div></div><div class="card-body adjust-audit-list">
      ${saved ? `<div class="adjust-audit-item"><span></span><div><strong>${esc(saved.status)}</strong><p>${esc(saved.message)} · QA Materiales · Web</p></div><time>03/08/2026, 11:10</time></div>` : ""}
      ${changes.length ? changes.map((row) => `<div class="adjust-audit-item"><span></span><div><strong>${esc(row.name)}</strong><p>${format(row.suggested)} → ${format(Number(row.adjusted))} ${esc(row.unit)} · ${esc(classify(row).label)}</p></div><time>En revisión</time></div>`).join("") : `<div class="adjust-audit-empty">Aún no hay diferencias de cantidad.</div>`}
      <div class="adjust-audit-item"><span></span><div><strong>Pedido sugerido recibido</strong><p>${esc(order.notice)} · ${esc(order.farm)} · ${esc(order.id)}</p></div><time>03/08/2026, 09:18</time></div>
    </div>`;
  }

  function bindQuantityInputs() {
    qsa("[data-adjust-quantity]").forEach((input) => input.addEventListener("input", () => {
      const index = Number(input.dataset.adjustQuantity);
      model.rows[index].adjusted = input.value === "" ? NaN : Number(input.value);
      renderState();
      qs(`#adjustQty${index}`)?.focus({ preventScroll: true });
    }));
  }

  function submitReview() {
    const { counts, changed, reasonMissing } = summary();
    if (counts.blocked || reasonMissing || model.submitted) return;
    const status = counts.exception ? "Pendiente de aprobación" : "Validado";
    const message = counts.exception
      ? `${counts.exception} ${counts.exception === 1 ? "excepción quedó registrada" : "excepciones quedaron registradas"}; no se asignó un aprobador porque esa matriz sigue pendiente.`
      : changed ? `${changed} ${changed === 1 ? "ajuste quedó validado" : "ajustes quedaron validados"} dentro de los límites ilustrativos.` : "Las cantidades sugeridas fueron confirmadas sin cambios.";
    const saved = { status, message, reason: model.reason || "Sin cambios", observation: model.observation, rows: model.rows.map(({ code, suggested, adjusted }) => ({ code, suggested, adjusted })) };
    localStorage.setItem(stateKey, JSON.stringify(saved));
    model.submitted = JSON.stringify(saved);
    renderState();
    feedback(status === "Pendiente de aprobación" ? "La excepción quedó registrada y pendiente de aprobación." : "La revisión del pedido quedó guardada.");
    qs("[data-adjust-order-status]")?.focus({ preventScroll: true });
  }

  function reset() {
    if (model.submitted) return;
    model.rows.forEach((row) => { row.adjusted = row.suggested; });
    model.reason = "";
    model.observation = "";
    qs("#adjustReason").value = "";
    qs("#adjustObservation").value = "";
    renderState();
    feedback("Se restablecieron las cantidades sugeridas.");
  }

  function feedback(message) {
    const box = qs("[data-adjust-feedback]");
    const text = qs("[data-adjust-feedback-message]", box);
    if (!box || !text) return;
    text.textContent = message;
    box.hidden = false;
    window.clearTimeout(box.timer);
    box.timer = window.setTimeout(() => { box.hidden = true; }, 4200);
  }

  function bind() {
    qs("#adjustReason")?.addEventListener("change", (event) => { model.reason = event.target.value; renderState(); });
    qs("#adjustObservation")?.addEventListener("input", (event) => { model.observation = event.target.value; });
    qs("[data-adjust-reset]")?.addEventListener("click", reset);
    qs("[data-adjust-submit]")?.addEventListener("click", submitReview);
  }

  function init() {
    SIALCore.initShell({ area: "gestion", module: "materiales", view: "pedidos" });
    const root = qs("[data-adjustment-root]");
    if (!root) return;
    if (params.get("access") === "denied" || orderId !== order.id) { root.innerHTML = deniedShell(); return; }
    if (params.get("scenario") === "cero") { model.rows[2].suggested = 0; model.rows[2].adjusted = 0; }
    if (model.submitted) {
      try {
        const saved = JSON.parse(model.submitted);
        saved.rows?.forEach((savedRow) => {
          const row = model.rows.find((item) => item.code === savedRow.code);
          if (row) row.adjusted = Number(savedRow.adjusted);
        });
        model.reason = saved.reason === "Sin cambios" ? "" : (saved.reason || "");
        model.observation = saved.observation || "";
      } catch {
        localStorage.removeItem(stateKey);
        model.submitted = null;
      }
    }
    root.innerHTML = shell();
    qs("#adjustReason").value = model.reason;
    qs("#adjustObservation").value = model.observation;
    bind();
    renderState();
  }

  return { init };
})();
