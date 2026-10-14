(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function initList() {
    const rows = qsa("#maintenanceRows tr");
    if (!rows.length) return;
    const search = qs("#maintenanceSearch");
    const type = qs("#maintenanceType");
    const status = qs("#maintenanceStatus");
    const empty = qs("#maintenanceEmpty");
    const count = qs("#maintenanceCount");
    const pagination = qs("#maintenancePagination");
    let page = 1;
    let pageSize = 10;
    const apply = () => {
      const term = (search?.value || "").trim().toLowerCase();
      const matches = rows.filter((row) => (!term || row.textContent.toLowerCase().includes(term)) && (!type || type.value === "all" || row.dataset.type === type.value) && (!status || status.value === "all" || row.dataset.status === status.value));
      const total = matches.length;
      page = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
      rows.forEach((row) => { row.hidden = true; });
      matches.slice((page - 1) * pageSize, page * pageSize).forEach((row) => { row.hidden = false; });
      if (count) count.textContent = `${total} ${total === 1 ? "registro" : "registros"}`;
      if (empty) empty.classList.toggle("is-visible", total === 0);
      if (pagination) {
        pagination.dataset.sialPage = String(page);
        pagination.dataset.sialPageSize = String(pageSize);
        pagination.dataset.sialTotal = String(total);
        pagination.dispatchEvent(new CustomEvent("sial:table-page-state", { detail: { page, pageSize, total, sizes: [10, 30, 50] } }));
      }
    };
    [search, type, status].filter(Boolean).forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => { page = 1; apply(); }));
    pagination?.addEventListener("sial:table-page-request", (event) => { page = Number(event.detail?.page) || 1; apply(); });
    pagination?.addEventListener("sial:table-page-size-request", (event) => { pageSize = Number(event.detail?.pageSize) || 10; page = 1; apply(); });
    apply();
  }

  function initForm() {
    const form = qs("#maintenanceForm");
    if (!form) return;
    const vehicle = qs("#maintenanceVehicle");
    const impact = qs("#maintenanceImpact");
    const blocked = qs("#maintenanceBlocked");
    const evidence = qs("#maintenanceEvidence");
    const evidenceName = qs("#maintenanceEvidenceName");
    const feedback = qs("#maintenanceFormFeedback");
    const cost = qs("#maintenanceCost");
    const costNote = qs("#maintenanceCostNote");
    const queryVehicle = new URLSearchParams(location.search).get("vehiculo");
    if (queryVehicle && [...vehicle.options].some((option) => option.value === queryVehicle)) vehicle.value = queryVehicle;
    const updateContext = () => {
      const activeTrip = vehicle.value === "TRK-421";
      qs("[data-context-plate]").value = vehicle.value || "Sin seleccionar";
      qs("[data-context-state]").value = activeTrip ? "En tránsito a puerto" : vehicle.value ? "Disponible" : "Sin seleccionar";
      blocked.classList.toggle("is-hidden", !activeTrip);
      impact.textContent = vehicle.value ? (activeTrip ? "No puede registrarse mientras la operación OP-001 permanezca activa." : "El impacto sobre la disponibilidad se determina según la causa, la prioridad y las reglas operativas.") : "Selecciona un vehículo para validar su disponibilidad.";
      qs("#maintenanceSubmit").disabled = !vehicle.value || activeTrip;
    };
    vehicle.addEventListener("change", updateContext);
    cost?.addEventListener("input", () => {
      costNote.textContent = Number(cost.value) > 5000000 ? "Para aprobar o ejecutar este costo se requerirán cotizaciones, aprobación y soporte de compra." : "Valor opcional en pesos colombianos.";
    });
    evidence?.addEventListener("change", () => {
      const files = Array.from(evidence.files || []);
      evidenceName.textContent = files.length === 0 ? "Ningún archivo seleccionado" : files.length === 1 ? files[0].name : `${files.length} archivos seleccionados`;
    });
    form.addEventListener("reset", () => requestAnimationFrame(() => { updateContext(); if (evidenceName) evidenceName.textContent = "Ningún archivo seleccionado"; feedback.hidden = true; costNote.textContent = "Valor opcional en pesos colombianos."; qsa(".is-error", form).forEach(field => field.classList.remove("is-error")); }));
    updateContext();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      feedback.hidden = true;
      if (vehicle.value === "TRK-421") return;
      const required = qsa("[required]", form);
      let firstInvalid = null;
      required.forEach((field) => {
        const invalid = !field.checkValidity() || !String(field.value || "").trim();
        field.classList.toggle("is-error", invalid);
        if (invalid && !firstInvalid) firstInvalid = field;
      });
      const start = qs("#maintenanceStart");
      const expected = qs("#maintenanceExpected");
      if (!firstInvalid && expected.value <= start.value) { expected.classList.add("is-error"); firstInvalid = expected; }
      const mileage = qs("#maintenanceMileage");
      const hours = qs("#maintenanceHours");
      if (!firstInvalid && !mileage.value && !hours.value) { mileage.classList.add("is-error"); hours.classList.add("is-error"); firstInvalid = mileage; }
      if (firstInvalid) {
        feedback.textContent = firstInvalid === evidence ? "Adjunta al menos un soporte de ingreso." : firstInvalid === expected ? "La salida estimada debe ser posterior al ingreso." : firstInvalid === mileage ? "Indica el kilometraje o el horómetro de ingreso." : "Completa los campos obligatorios para revisar el registro.";
        feedback.hidden = false;
        firstInvalid.focus();
        return;
      }
      feedback.textContent = "Datos completos para revisión. Esta propuesta visual todavía no guarda el mantenimiento.";
      feedback.hidden = false;
    });
  }

  function initDetail() {
    const release = qs("#releaseForm");
    if (!release) return;
    const result = qs("#releaseResult");
    const evidence = qs("#releaseEvidence");
    const evidenceName = qs("#releaseEvidenceName");
    evidence?.addEventListener("change", () => {
      evidenceName.textContent = evidence.files?.[0]?.name || "Ningún archivo seleccionado";
    });
    release.addEventListener("submit", (event) => {
      event.preventDefault();
      const notes = qs("#releaseNotes");
      const invalid = !evidence.value || !notes.value.trim();
      evidence.classList.toggle("is-error", !evidence.value);
      notes.classList.toggle("is-error", !notes.value.trim());
      if (invalid) return;
      result.classList.remove("is-hidden");
      qs("#releaseSubmit").disabled = true;
      qs("#releaseSubmit").textContent = "Vehículo liberado";
    });
  }

  window.SIALMaintenance = { initList, initForm, initDetail };
})();
