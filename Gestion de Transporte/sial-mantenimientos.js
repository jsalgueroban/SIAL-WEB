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
    const apply = () => {
      const term = (search?.value || "").trim().toLowerCase();
      let visible = 0;
      rows.forEach((row) => {
        const matches = (!term || row.textContent.toLowerCase().includes(term)) && (!type || type.value === "all" || row.dataset.type === type.value) && (!status || status.value === "all" || row.dataset.status === status.value);
        row.hidden = !matches;
        if (matches) visible += 1;
      });
      if (count) count.textContent = `${visible} registros visibles`;
      if (empty) empty.classList.toggle("is-visible", visible === 0);
    };
    [search, type, status].filter(Boolean).forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", apply));
    apply();
  }

  function initForm() {
    const form = qs("#maintenanceForm");
    if (!form) return;
    const vehicle = qs("#maintenanceVehicle");
    const impact = qs("#maintenanceImpact");
    const success = qs("#maintenanceSuccess");
    const blocked = qs("#maintenanceBlocked");
    const evidence = qs("#maintenanceEvidence");
    const evidenceName = qs("#maintenanceEvidenceName");
    const queryVehicle = new URLSearchParams(location.search).get("vehiculo");
    if (queryVehicle && [...vehicle.options].some((option) => option.value === queryVehicle)) vehicle.value = queryVehicle;
    const updateContext = () => {
      const activeTrip = vehicle.value === "TRK-421";
      qs("[data-context-plate]").value = vehicle.value || "Sin seleccionar";
      qs("[data-context-state]").value = activeTrip ? "En tránsito a puerto" : vehicle.value ? "Disponible" : "Sin seleccionar";
      blocked.classList.toggle("is-hidden", !activeTrip);
      impact.textContent = vehicle.value ? (activeTrip ? "No puede registrarse mientras la operación OP-001 permanezca activa." : "Al registrar el mantenimiento, el vehículo cambiará a No disponible.") : "Selecciona un vehículo para validar su disponibilidad.";
      qs("#maintenanceSubmit").disabled = !vehicle.value || activeTrip;
    };
    vehicle.addEventListener("change", updateContext);
    evidence?.addEventListener("change", () => {
      const files = Array.from(evidence.files || []);
      evidenceName.textContent = files.length === 0 ? "Ningún archivo seleccionado" : files.length === 1 ? files[0].name : `${files.length} archivos seleccionados`;
    });
    form.addEventListener("reset", () => requestAnimationFrame(() => { updateContext(); if (evidenceName) evidenceName.textContent = "Ningún archivo seleccionado"; }));
    updateContext();
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const required = qsa("[required]", form);
      let firstInvalid = null;
      required.forEach((field) => {
        const invalid = !String(field.value || "").trim();
        field.classList.toggle("is-error", invalid);
        if (invalid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) { firstInvalid.focus(); return; }
      success.classList.remove("is-hidden");
      success.scrollIntoView({ behavior: "smooth", block: "center" });
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
