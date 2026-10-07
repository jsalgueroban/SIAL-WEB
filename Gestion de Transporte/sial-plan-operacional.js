(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const documents = {
    remision: [
      { id: "REM-2026-0184", label: "REM-2026-0184 · Finca El Retiro", farm: "Finca El Retiro", quantity: 520, unit: "unidades", materials: "Caja de cartón corrugado", pickup: "Bodega principal", status: "Disponible" },
      { id: "REM-2026-0186", label: "REM-2026-0186 · Finca La Ceiba", farm: "Finca La Ceiba", quantity: 246, unit: "unidades", materials: "Caja de cartón y etiqueta", pickup: "Centro de distribución", status: "Disponible" }
    ],
    reserva: [{ id: "RES-2026-0047", label: "RES-2026-0047 · Finca Santa Isabel", farm: "Finca Santa Isabel", quantity: 12, unit: "pallets", materials: "Material de empaque reservado", pickup: "Bodega de suministros", status: "Disponible" }],
    rtp: [{ id: "RTP-2026-0881", label: "RTP-2026-0881 · Finca Santa Isabel", farm: "Finca Santa Isabel", quantity: 1480, unit: "unidades", materials: "Insumos de producción", pickup: "Proveedor regional", status: "Disponible" }]
  };
  const ownResources = ["TRK-421 · TRANSLOGISTICA SAS", "CAM-102 · Carga Pesada Ltda.", "CMN-204 · OPERADOR CARIBE SAS"];
  const externalResources = ["Transportadora Caribe", "Carga Sierra"];
  const drivers = ["Carlos Méndez", "Ana Lucía Paz", "Pedro Rojas"];
  let rowSequence = 0;

  function setValue(id, value = "") { const field = qs(`#${id}`); if (field) field.value = value || ""; }
  function selectedDocument() { const type = qs("#documentType").value; return (documents[type] || []).find((item) => item.id === qs("#sourceDocument").value) || null; }
  function options(items, placeholder) { return `<option value="">${placeholder}</option>${items.map((item) => `<option>${item}</option>`).join("")}`; }
  function isoWeek(value) {
    if (!value) return "";
    const date = new Date(value), utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())), day = utc.getUTCDay() || 7;
    utc.setUTCDate(utc.getUTCDate() + 4 - day);
    const start = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1)), week = Math.ceil((((utc - start) / 86400000) + 1) / 7);
    return `Semana ${week} - ${utc.getUTCFullYear()}`;
  }
  function renderDocumentDetail() {
    const item = selectedDocument();
    setValue("farmDisplay", item?.farm); setValue("needDisplay", item ? `${item.quantity} ${item.unit}` : ""); setValue("materialsDisplay", item?.materials);
    setValue("pickupDisplay", item?.pickup); setValue("documentStatusDisplay", item?.status); setValue("originDisplay", item?.pickup); setValue("destinationDisplay", item?.farm);
    qs("#assignmentRows").innerHTML = ""; rowSequence = 0; if (item) addRow(); updateCoverage();
  }
  function renderDocuments() {
    const items = documents[qs("#documentType").value] || [], select = qs("#sourceDocument");
    select.disabled = !items.length;
    select.innerHTML = items.length ? `<option value="">Selecciona el documento</option>${items.map((item) => `<option value="${item.id}">${item.label}</option>`).join("")}` : '<option value="">Primero selecciona el tipo</option>';
    renderDocumentDetail();
  }
  function defaultDate() {
    const date = new Date(); date.setDate(date.getDate() + 1); date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  function resourceOptions(mode) { return options(mode === "external" ? externalResources : ownResources, mode === "external" ? "Selecciona empresa" : "Selecciona vehículo"); }
  function addRow() {
    if (!selectedDocument()) { showAssignmentWarning("Selecciona primero el documento que origina el traslado."); return; }
    rowSequence += 1;
    const row = document.createElement("tr"); row.dataset.assignmentRow = String(rowSequence);
    row.innerHTML = `<td><select class="select" data-fleet aria-label="Tipo de flota fila ${rowSequence}"><option value="own">Flota propia</option><option value="external">Empresa tercera</option></select></td><td><select class="select assignment-resource" data-resource aria-label="Vehículo o empresa fila ${rowSequence}">${resourceOptions("own")}</select></td><td><select class="select" data-driver aria-label="Conductor fila ${rowSequence}">${options(drivers, "Selecciona conductor")}</select></td><td><input class="input" data-quantity type="number" min="1" aria-label="Cantidad fila ${rowSequence}" /></td><td><input class="input" data-date type="datetime-local" value="${qs("#dateOperative").value}" aria-label="Fecha fila ${rowSequence}" /></td><td><span data-week>${isoWeek(qs("#dateOperative").value)}</span></td><td><button class="icon-btn" type="button" data-remove aria-label="Quitar asignación"><svg class="icon" viewBox="0 0 24 24"><path d="m18 6-12 12M6 6l12 12"></path></svg></button></td>`;
    qs("#assignmentRows").appendChild(row); updateCoverage();
  }
  function updateCoverage() {
    const item = selectedDocument(), assigned = qsa("[data-quantity]", qs("#assignmentRows")).reduce((sum, input) => sum + (Number(input.value) || 0), 0);
    const remaining = item ? item.quantity - assigned : 0;
    qs("#assignedTotal").textContent = item ? `${assigned} ${item.unit}` : "0"; qs("#remainingTotal").textContent = item ? `${Math.max(remaining, 0)} ${item.unit}` : "0";
    const status = qs("#coverageStatus"); status.className = remaining === 0 && item ? "status status-active" : remaining < 0 ? "status status-inactive" : "status status-warning";
    status.textContent = remaining === 0 && item ? "Distribución completa" : remaining < 0 ? "Cantidad excedida" : assigned > 0 ? "Distribución parcial" : "Sin distribuir";
    showAssignmentWarning(remaining < 0 ? `La distribución supera en ${Math.abs(remaining)} ${item.unit} la cantidad pendiente.` : "", remaining < 0);
    return { item, assigned, remaining };
  }
  function showAssignmentWarning(message, show = Boolean(message)) { const box = qs("#assignmentWarning"); box.textContent = message; box.classList.toggle("is-hidden", !show); }
  function showResult(type, message) { const result = qs("#formOk"); result.className = `notice notice-${type}`; result.textContent = message; result.classList.remove("is-hidden"); result.scrollIntoView({ behavior: "auto", block: "center" }); }
  function validateRows() {
    const rows = qsa("[data-assignment-row]", qs("#assignmentRows")), { item, remaining } = updateCoverage(), errors = [], ownVehicles = new Set();
    if (!item) errors.push("Selecciona un documento disponible."); if (!rows.length) errors.push("Agrega al menos un vehículo."); if (remaining < 0) errors.push("La cantidad distribuida supera el pendiente.");
    rows.forEach((row, index) => {
      const fleet = qs("[data-fleet]", row).value, resource = qs("[data-resource]", row).value, driver = qs("[data-driver]", row).value, quantity = Number(qs("[data-quantity]", row).value), date = qs("[data-date]", row).value;
      if (!resource || !driver || quantity <= 0 || !date) errors.push(`Completa la asignación ${index + 1}.`);
      if (fleet === "own" && resource && ownVehicles.has(resource)) errors.push(`El vehículo de la asignación ${index + 1} está repetido.`);
      if (fleet === "own" && resource) ownVehicles.add(resource);
    });
    return errors;
  }
  function submit(event) {
    event.preventDefault(); const errors = validateRows();
    if (errors.length) { showResult("error", errors[0]); return; }
    const { item, remaining } = updateCoverage();
    showResult("success", `${item.id}: programación ${remaining === 0 ? "total" : "parcial"} preparada con ${qsa("[data-assignment-row]").length} vehículo(s).`);
  }
  function init() {
    const form = qs("#materialTransferForm"); if (!form) return;
    setValue("dateOperative", defaultDate()); setValue("weekDisplay", isoWeek(qs("#dateOperative").value));
    qs("#documentType").addEventListener("change", renderDocuments); qs("#sourceDocument").addEventListener("change", renderDocumentDetail); qs("#addAssignment").addEventListener("click", addRow);
    qs("#dateOperative").addEventListener("change", () => { setValue("weekDisplay", isoWeek(qs("#dateOperative").value)); });
    qs("#assignmentRows").addEventListener("change", (event) => { const row = event.target.closest("[data-assignment-row]"); if (event.target.matches("[data-fleet]")) qs("[data-resource]", row).innerHTML = resourceOptions(event.target.value); if (event.target.matches("[data-date]")) qs("[data-week]", row).textContent = isoWeek(event.target.value); updateCoverage(); });
    qs("#assignmentRows").addEventListener("input", updateCoverage); qs("#assignmentRows").addEventListener("click", (event) => { if (!event.target.closest("[data-remove]")) return; event.target.closest("tr").remove(); updateCoverage(); });
    form.addEventListener("submit", submit); form.addEventListener("reset", () => window.setTimeout(() => { renderDocuments(); setValue("dateOperative", defaultDate()); setValue("weekDisplay", isoWeek(qs("#dateOperative").value)); qs("#formOk").classList.add("is-hidden"); }));
    const params = new URLSearchParams(location.search), type = params.get("tipo"), id = params.get("id"); if (documents[type]) qs("#documentType").value = type; renderDocuments(); if (id && (documents[type] || []).some((item) => item.id === id)) { qs("#sourceDocument").value = id; renderDocumentDetail(); }
  }
  window.SIALOperationalPlan = { init };
})();
