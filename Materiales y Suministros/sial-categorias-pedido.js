const SIALOrderCategories = (() => {
  const key = "sial-order-categories";
  const seed = [
    { code: "ETIQ", name: "ETIQUETA", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:20" },
    { code: "OPER", name: "OPERATIVO", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:24" },
    { code: "EMPA", name: "EMPAQUE", status: "ACTIVO", audit: "Crear - materiales.admin · 25/09/2026 08:28" },
    { code: "ARCH", name: "ARCHIVADA", status: "INACTIVO", audit: "Inactivar - materiales.admin · 25/09/2026 09:10" }
  ];
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const qs = (selector, root = document) => root.querySelector(selector);
  let categories = load();
  let editing = "";

  function load() {
    try { const value = JSON.parse(localStorage.getItem(key) || "null"); return Array.isArray(value) ? value : seed; }
    catch { return seed; }
  }
  function save() { localStorage.setItem(key, JSON.stringify(categories)); }
  function status(value) { return `<span class="status ${value === "ACTIVO" ? "status-active" : "status-inactive"}">${value === "ACTIVO" ? "Activo" : "Inactivo"}</span>`; }
  function openAudit(code) {
    const item = categories.find((entry) => entry.code === code);
    if (!item) return;
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    const history = Array.isArray(item.history) && item.history.length ? item.history : [item.audit];
    qs('[data-detail-target="code"]').textContent = item.code;
    qs('[data-detail-target="name"]').textContent = item.name;
    qs('[data-detail-target="status"]').innerHTML = status(item.status);
    qs("#detailAudit").innerHTML = history.map((entry) => {
      const [title, meta] = String(entry).split(" · ");
      return `<div class="audit-item"><strong>${esc(title || "Actualización")}</strong><div class="muted">${esc(meta || "")}</div></div>`;
    }).join("");
    drawer.hidden = false;
    backdrop.hidden = false;
    drawer.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => { drawer.classList.add("show"); backdrop.classList.add("show"); qs("#closeDetail").focus(); });
  }
  function closeAudit() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove("show");
    backdrop.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
    window.setTimeout(() => { drawer.hidden = true; backdrop.hidden = true; }, 220);
  }
  function setForm(open, mode = "new") {
    const panel = qs("[data-category-inline-form]");
    const trigger = qs("[data-category-new]");
    panel.classList.toggle("is-hidden", !open);
    trigger.setAttribute("aria-expanded", String(open));
    if (open) {
      qs("[data-category-form-title]").textContent = mode === "edit" ? `Editar ${editing}` : "Nueva categoría";
      qs("[data-category-form-subtitle]").textContent = mode === "edit" ? "Actualiza el nombre sin alterar el código ni el histórico." : "El código será único y se guardará en mayúsculas.";
      qs(mode === "edit" ? "#categoryName" : "#categoryCode").focus();
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else trigger.focus();
  }

  function shell() {
    return `
      <p class="page-eyebrow">Materiales / Configuración</p>
      <div class="page-header"><div><h1 class="page-title">Categorías de pedido</h1><p class="page-subtitle">Administra la clasificación compartida por pedidos y materiales.</p></div></div>
      <div class="notice notice-info"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5"></path><path d="M12 16h.01"></path></svg><span>Los códigos utilizados se conservan para mantener el histórico; una categoría inactiva deja de estar disponible en solicitudes nuevas.</span></div>
      <section>
        <article class="card workflow-table-card standard-master-card"><div class="card-header"><div><h2 class="card-title">Categorías registradas</h2><p class="card-subtitle">Consulta códigos, nombres, estado y trazabilidad.</p></div><div class="card-actions"><span class="chip" data-category-count></span><button class="btn btn-primary" type="button" data-category-new aria-expanded="false" aria-controls="categoryInlineForm">Registrar categoría</button></div></div><div class="card-body"><div class="toolbar category-toolbar"><label class="search-field"><span class="sr-only">Buscar categoría</span><input class="input" id="categorySearch" placeholder="Buscar por código o nombre" /></label><select class="select" id="categoryStatus" aria-label="Filtrar por estado"><option value="">Todos los estados</option><option value="ACTIVO">Activas</option><option value="INACTIVO">Inactivas</option></select></div></div>
        <div class="inline-form-panel category-inline-form is-hidden" id="categoryInlineForm" data-category-inline-form><div class="form-heading"><h2 data-category-form-title>Nueva categoría</h2><p data-category-form-subtitle>El código será único y se guardará en mayúsculas.</p></div><div class="form-body"><form data-category-form novalidate><div class="grid"><div class="field span-4"><label class="label">Estado inicial</label><span class="status status-active">Activo</span><div class="field-note">Las categorías nuevas quedan disponibles para selección.</div></div><div class="field span-3"><label class="label" for="categoryCode">Código <span class="required">*</span></label><input class="input" id="categoryCode" maxlength="12" autocomplete="off" placeholder="ETIQ" required /><div class="field-note">Único, sin espacios y en mayúsculas.</div></div><div class="field span-5"><label class="label" for="categoryName">Nombre <span class="required">*</span></label><input class="input" id="categoryName" maxlength="60" autocomplete="off" placeholder="ETIQUETA" required /><div class="field-note">Nombre visible en pedidos y materiales.</div></div></div><div class="notice notice-warning" data-category-message hidden></div><div class="form-actions"><button class="btn btn-secondary" type="button" data-category-cancel>Cancelar</button><button class="btn btn-primary" type="submit">Guardar categoría</button></div></form></div></div>
        <div class="table-wrap"><table><thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Auditoría</th><th class="actions-column">Acciones</th></tr></thead><tbody data-category-rows></tbody></table></div><div class="empty-state" data-category-empty hidden>No hay categorías que coincidan con los filtros.</div><div class="table-pagination"><div class="pagination-summary" data-category-pagination aria-live="polite"></div><label class="pagination-size"><span>Registros por página</span><select class="select" aria-label="Registros por página"><option>10</option></select></label><div class="pagination-pages" aria-label="Cambiar página"><button class="pagination-btn" type="button" disabled>Anterior</button><button class="pagination-btn active" type="button" aria-current="page">1</button><button class="pagination-btn" type="button" disabled>Siguiente</button></div></div></article>
        <div class="drawer-backdrop" id="detailBackdrop" hidden></div><aside class="drawer" id="detailDrawer" aria-label="Auditoría de categoría" aria-hidden="true" aria-modal="true" role="dialog" hidden><div class="drawer-head"><div><h3>Auditoría de categoría</h3><p>Historial de cambios y disponibilidad del registro.</p></div><button class="icon-btn" type="button" id="closeDetail" aria-label="Cerrar auditoría"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button></div><div class="drawer-body"><div class="detail-group"><span class="detail-label">Código</span><div class="detail-value" data-detail-target="code">-</div></div><div class="detail-group"><span class="detail-label">Nombre</span><div class="detail-value" data-detail-target="name">-</div></div><div class="detail-group"><span class="detail-label">Estado</span><div class="detail-value" data-detail-target="status">-</div></div><div class="detail-group"><span class="detail-label">Auditoría</span><div class="stack" id="detailAudit"></div></div></div></aside>
      </section>`;
  }

  function renderRows() {
    const search = (qs("#categorySearch")?.value || "").trim().toLowerCase();
    const state = qs("#categoryStatus")?.value || "";
    const filtered = categories.filter((item) => (!search || `${item.code} ${item.name}`.toLowerCase().includes(search)) && (!state || item.status === state));
    qs("[data-category-rows]").innerHTML = filtered.map((item) => `<tr><td><strong>${esc(item.code)}</strong></td><td>${esc(item.name)}</td><td>${status(item.status)}</td><td class="muted">${esc(item.audit)}</td><td><div class="row-actions"><button class="icon-btn" type="button" data-category-audit="${esc(item.code)}" aria-label="Ver auditoría de ${esc(item.name)}" title="Ver auditoría"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg></button><button class="icon-btn" type="button" data-category-edit="${esc(item.code)}" aria-label="Editar categoría ${esc(item.name)}" title="Editar categoría"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button><button class="icon-btn" type="button" data-category-toggle="${esc(item.code)}" data-state-action="${item.status === "ACTIVO" ? "inactive" : "active"}" aria-label="${item.status === "ACTIVO" ? "Inactivar" : "Activar"} categoría ${esc(item.name)}" title="${item.status === "ACTIVO" ? "Inactivar categoría" : "Activar categoría"}"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${item.status === "ACTIVO" ? `<path d="m18 6-12 12"></path><path d="m6 6 12 12"></path>` : `<path d="M20 6 9 17l-5-5"></path>`}</svg></button></div></td></tr>`).join("");
    qs("[data-category-count]").textContent = `${filtered.length} ${filtered.length === 1 ? "categoría" : "categorías"}`;
    qs("[data-category-pagination]").textContent = filtered.length ? `Mostrando 1-${filtered.length} de ${filtered.length} registros` : "Mostrando 0 registros";
    qs("[data-category-empty]").hidden = filtered.length > 0;
  }

  function resetForm() {
    editing = ""; qs("[data-category-form]").reset(); qs("#categoryCode").disabled = false; qs("[data-category-form-title]").textContent = "Nueva categoría"; qs("[data-category-message]").hidden = true;
  }
  function edit(code) {
    const item = categories.find((entry) => entry.code === code); if (!item) return;
    editing = code; qs("#categoryCode").value = item.code; qs("#categoryCode").disabled = true; qs("#categoryName").value = item.name; setForm(true, "edit");
  }
  function submit(event) {
    event.preventDefault();
    const code = qs("#categoryCode").value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const name = qs("#categoryName").value.trim().toUpperCase();
    const message = qs("[data-category-message]");
    if (!code || !name) { message.textContent = "Completa el código y el nombre."; message.hidden = false; return; }
    if (!editing && categories.some((item) => item.code === code)) { message.textContent = `El código ${code} ya existe y no puede reutilizarse.`; message.hidden = false; return; }
    const audit = `${editing ? "Editar" : "Crear"} - materiales.admin · ${new Date().toLocaleString("es-CO")}`;
    if (editing) categories = categories.map((item) => item.code === editing ? { ...item, name, audit, history: [audit, ...(item.history || [item.audit])] } : item);
    else categories.unshift({ code, name, status: "ACTIVO", audit, history: [audit] });
    save(); resetForm(); renderRows(); setForm(false);
  }

  function init() {
    SIALCore.initShell({ area: "gestion", module: "materiales", view: "categoriasPedido" });
    const root = qs("[data-category-root]"); if (!root) return; root.innerHTML = shell();
    qs("#categoryCode").addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""); });
    [qs("#categorySearch"), qs("#categoryStatus")].forEach((control) => control.addEventListener(control.tagName === "SELECT" ? "change" : "input", renderRows));
    qs("[data-category-form]").addEventListener("submit", submit);
    qs("[data-category-new]").addEventListener("click", () => { resetForm(); setForm(true, "new"); });
    qs("[data-category-cancel]").addEventListener("click", () => { resetForm(); setForm(false); });
    qs("#closeDetail").addEventListener("click", closeAudit);
    qs("#detailBackdrop").addEventListener("click", closeAudit);
    root.addEventListener("click", (event) => {
      const auditButton = event.target.closest("[data-category-audit]"); if (auditButton) openAudit(auditButton.dataset.categoryAudit);
      const editButton = event.target.closest("[data-category-edit]"); if (editButton) edit(editButton.dataset.categoryEdit);
      const toggle = event.target.closest("[data-category-toggle]"); if (toggle) { categories = categories.map((item) => { if (item.code !== toggle.dataset.categoryToggle) return item; const audit = `${item.status === "ACTIVO" ? "Inactivar" : "Activar"} - materiales.admin · ${new Date().toLocaleString("es-CO")}`; return { ...item, status: item.status === "ACTIVO" ? "INACTIVO" : "ACTIVO", audit, history: [audit, ...(item.history || [item.audit])] }; }); save(); renderRows(); }
    });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeAudit(); }); renderRows();
  }
  return { init };
})();
