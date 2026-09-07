(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  const sourceCatalog = {
    orden: [
      {
        id: "OTI-546-002", label: "OTI-546-002 · Finca El Retiro", eligible: true, status: "Disponible para planificación", farm: "Finca El Retiro",
        document: "Remisión REM-2026-0184", need: "520 unidades de caja de cartón", pickup: "Punto de recogida pendiente", destination: "Finca El Retiro",
        priority: "No informada", restriction: "Peso y volumen no están informados en esta muestra. La cantidad y el tipo de vehículo permanecen pendientes del servicio de capacidad.", defaultTrip: "materiales"
      },
      {
        id: "OTI-546-001", label: "OTI-546-001 · Finca Santa Isabel", eligible: false, status: "Ya atendida", farm: "Finca Santa Isabel",
        document: "RPT-2026-0881", need: "1.480 unidades de insumos", pickup: "Documento histórico", destination: "Finca Santa Isabel",
        priority: "No informada", restriction: "Esta orden se presenta como atendida en la propuesta y no puede originar un nuevo plan.", defaultTrip: "materiales"
      }
    ],
    aviso: [
      {
        id: "AC-2026-032", label: "AC-2026-032 · SEM-2026-32", eligible: true, status: "Publicado y preoperativo", farm: "La Ceiba, Marte y Vijagual",
        document: "Aviso de corte · SEM-2026-32", need: "38 palés en 3 fincas", pickup: "Puerto por definir", destination: "Fincas del aviso",
        priority: "No informada", restriction: "La propuesta usa los palés del aviso para contextualizar los viajes. Contenedores, capacidades, ventanas y saldo requieren contrato de operación.", defaultTrip: "contenedor-vacio"
      },
      {
        id: "AC-2026-031-02", label: "AC-2026-031-02 · SEM-2026-31", eligible: false, status: "Programación iniciada", farm: "La Ceiba, Marte y Catalina",
        document: "Aviso de corte · SEM-2026-31", need: "Operación ya iniciada", pickup: "No aplica", destination: "No aplica",
        priority: "No informada", restriction: "El aviso ya tiene programación iniciada. Los ajustes deben registrarse como novedad autorizada.", defaultTrip: "contenedor-vacio"
      }
    ]
  };

  const movementLabels = {
    materiales: "Materiales hacia finca",
    "contenedor-vacio": "Contenedor vacío hacia finca",
    "contenedor-cargado": "Retorno de contenedor cargado"
  };

  const state = { source: null, trips: [], activeTripId: null, assignmentTripId: null, tripSequence: 0 };

  const refs = {};

  function showFeedback(type, message, target = refs.feedback) {
    if (!target) return;
    target.className = `notice notice-${type}`;
    target.innerHTML = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 16h.01"></path></svg><span>${esc(message)}</span>`;
    target.classList.remove("is-hidden");
  }

  function hideFeedback(target = refs.feedback) {
    target?.classList.add("is-hidden");
  }

  function sourceFromControls() {
    return (sourceCatalog[refs.originType.value] || []).find((item) => item.id === refs.origin.value) || null;
  }

  function populateOrigins(selectedId) {
    const items = sourceCatalog[refs.originType.value] || [];
    refs.origin.innerHTML = items.map((item) => `<option value="${esc(item.id)}"${item.id === selectedId ? " selected" : ""}>${esc(item.label)}</option>`).join("");
  }

  function sourceDetails(item) {
    return [
      ["Documento", item.document], ["Estado", item.status], ["Finca o alcance", item.farm],
      ["Necesidad", item.need], ["Punto de recogida", item.pickup], ["Destino", item.destination]
    ];
  }

  function createTrip(source) {
    state.tripSequence += 1;
    return {
      id: `trip-${state.tripSequence}`,
      label: `Viaje ${state.tripSequence}`,
      movement: source.defaultTrip,
      origin: source.pickup === "No aplica" ? "" : source.pickup,
      destination: source.destination === "No aplica" ? "" : source.destination,
      scheduledAt: refs.planDate.value || "",
      need: source.need,
      assignment: null,
      assignmentMode: "own",
      availability: "pending"
    };
  }

  function resetTrips(source) {
    state.tripSequence = 0;
    state.trips = [createTrip(source)];
    state.activeTripId = state.trips[0].id;
    state.assignmentTripId = null;
  }

  function loadSource() {
    const item = sourceFromControls();
    hideFeedback();
    refs.sourceSummary.classList.add("is-hidden");
    refs.sourceLoading.classList.remove("is-hidden");
    refs.sourceChip.textContent = "Consultando origen";

    window.setTimeout(() => {
      refs.sourceLoading.classList.add("is-hidden");
      if (!item) {
        state.source = null;
        refs.sourceChip.textContent = "Sin origen cargado";
        showFeedback("error", "Selecciona un documento de origen para continuar.");
        renderTrips();
        renderAssignment();
        return;
      }

      state.source = item;
      refs.sourceData.innerHTML = sourceDetails(item).map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("");
      refs.sourceRestriction.textContent = item.restriction;
      refs.sourceSummary.classList.remove("is-hidden");
      refs.sourceChip.textContent = item.eligible ? "Origen disponible" : "Origen no elegible";
      refs.planPriority.value = item.priority;
      resetTrips(item);
      renderTrips();
      renderAssignment();
      if (!item.eligible) showFeedback("warning", "Este origen no puede crear un plan nuevo. Selecciona un documento disponible para continuar.");
    }, 180);
  }

  function assignmentLabel(trip) {
    if (!trip.assignment) return "Sin asignar";
    if (trip.assignment.mode === "external") return trip.assignment.company || "Empresa externa";
    return `${trip.assignment.vehicle || "Vehículo"} · ${trip.assignment.driver || "Conductor"}`;
  }

  function statusMarkup(trip) {
    if (trip.availability === "conflict") return '<span class="status status-inactive">Conflicto</span>';
    if (trip.availability === "ready") return '<span class="status status-active">Listo para confirmar</span>';
    return '<span class="status status-warning">Pendiente de asignación</span>';
  }

  function renderTrips() {
    const hasTrips = state.trips.length > 0;
    refs.tripEmpty.classList.toggle("is-hidden", hasTrips);
    refs.tripBody.innerHTML = state.trips.map((trip) => `
      <tr class="${trip.id === state.activeTripId ? "is-selected" : ""}" data-trip-id="${esc(trip.id)}">
        <td><strong>${esc(trip.label)}</strong></td>
        <td><select class="select" data-trip-field="movement" aria-label="Movimiento de ${esc(trip.label)}"><option value="materiales"${trip.movement === "materiales" ? " selected" : ""}>${movementLabels.materiales}</option><option value="contenedor-vacio"${trip.movement === "contenedor-vacio" ? " selected" : ""}>${movementLabels["contenedor-vacio"]}</option><option value="contenedor-cargado"${trip.movement === "contenedor-cargado" ? " selected" : ""}>${movementLabels["contenedor-cargado"]}</option></select></td>
        <td><input class="input" data-trip-field="origin" aria-label="Origen de ${esc(trip.label)}" value="${esc(trip.origin)}" /></td>
        <td><input class="input" data-trip-field="destination" aria-label="Destino de ${esc(trip.label)}" value="${esc(trip.destination)}" /></td>
        <td><input class="input" data-trip-field="scheduledAt" type="datetime-local" aria-label="Fecha y hora de ${esc(trip.label)}" value="${esc(trip.scheduledAt)}" /></td>
        <td><div class="trip-need">${esc(trip.need)}</div></td>
        <td><span class="muted">${esc(assignmentLabel(trip))}</span></td>
        <td><div class="plan-trip-status">${statusMarkup(trip)}</div></td>
        <td><div class="row-actions plan-trip-actions"><button class="icon-btn" type="button" data-select-trip aria-label="Asignar recursos a ${esc(trip.label)}" title="Asignar recursos"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-8 0v2"></path><circle cx="12" cy="7" r="4"></circle><path d="M19 8v6M16 11h6"></path></svg></button><button class="icon-btn" type="button" data-remove-trip data-state-action="inactive" aria-label="Quitar ${esc(trip.label)}" title="Quitar viaje"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12M6 6l12 12"></path></svg></button></div></td>
      </tr>`).join("");
  }

  function activeTrip() {
    return state.trips.find((trip) => trip.id === state.activeTripId) || null;
  }

  function resetAssignmentInputs() {
    refs.assignmentVehicle.value = "";
    refs.assignmentDriver.value = "";
    refs.assignmentCompany.value = "";
    refs.assignmentExternalVehicle.value = "";
    refs.assignmentExternalDriver.value = "";
    hideFeedback(refs.assignmentFeedback);
  }

  function renderAssignment() {
    const trip = activeTrip();
    const selected = Boolean(trip && state.source?.eligible);
    refs.assignmentMode.disabled = !selected;
    refs.checkAssignment.disabled = !selected;
    refs.assignmentSubtitle.textContent = selected ? `${trip.label}: ${movementLabels[trip.movement]}. Completa la asignación correspondiente.` : "Selecciona un viaje de un origen disponible para asignar sus recursos.";
    refs.ownFields.classList.toggle("is-hidden", !selected || refs.assignmentMode.value !== "own");
    refs.externalFields.classList.toggle("is-hidden", !selected || refs.assignmentMode.value !== "external");
    refs.assignmentValidationAction.classList.toggle("is-hidden", !selected);

    if (!selected) {
      resetAssignmentInputs();
      state.assignmentTripId = null;
      return;
    }

    const assignment = trip.assignment;
    if (state.assignmentTripId !== trip.id) {
      resetAssignmentInputs();
      state.assignmentTripId = trip.id;
    }
    refs.assignmentMode.value = assignment?.mode || trip.assignmentMode || "own";
    refs.ownFields.classList.toggle("is-hidden", refs.assignmentMode.value !== "own");
    refs.externalFields.classList.toggle("is-hidden", refs.assignmentMode.value !== "external");
    refs.checkAssignment.textContent = refs.assignmentMode.value === "external" ? "Validar datos de asignación" : "Validar disponibilidad";
    if (assignment?.mode === "own") {
      refs.assignmentVehicle.value = assignment.vehicle || "";
      refs.assignmentDriver.value = assignment.driver || "";
    }
    if (assignment?.mode === "external") {
      refs.assignmentCompany.value = assignment.company || "";
      refs.assignmentExternalVehicle.value = assignment.vehicle || "";
      refs.assignmentExternalDriver.value = assignment.driver || "";
    }
  }

  function updateTripFromRow(target) {
    const row = target.closest("[data-trip-id]");
    const trip = state.trips.find((item) => item.id === row?.dataset.tripId);
    const field = target.dataset.tripField;
    if (!trip || !field) return;
    trip[field] = target.value;
    trip.availability = trip.assignment ? "pending" : trip.availability;
    renderTrips();
    renderAssignment();
  }

  function addTrip() {
    if (!state.source?.eligible) {
      showFeedback("warning", "Carga un origen disponible antes de agregar viajes.");
      return;
    }
    const trip = createTrip(state.source);
    state.trips.push(trip);
    state.activeTripId = trip.id;
    renderTrips();
    renderAssignment();
    qs(`[data-trip-id="${trip.id}"] [data-select-trip]`)?.focus();
  }

  function selectTrip(id) {
    state.activeTripId = id;
    hideFeedback(refs.assignmentFeedback);
    renderTrips();
    renderAssignment();
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    refs.assignmentSection.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function removeTrip(id) {
    if (state.trips.length === 1) {
      showFeedback("warning", "El plan requiere al menos un viaje. Ajusta el viaje existente o cambia el origen.");
      return;
    }
    state.trips = state.trips.filter((trip) => trip.id !== id);
    if (state.activeTripId === id) state.activeTripId = state.trips[0]?.id || null;
    renderTrips();
    renderAssignment();
  }

  function checkAssignment() {
    const trip = activeTrip();
    if (!trip) return;
    const mode = refs.assignmentMode.value;
    hideFeedback(refs.assignmentFeedback);

    if (mode === "own") {
      const vehicle = refs.assignmentVehicle.value;
      const driver = refs.assignmentDriver.value;
      if (!vehicle || !driver) {
        showFeedback("error", "Selecciona vehículo y conductor para validar esta asignación.", refs.assignmentFeedback);
        return;
      }
      if (vehicle === "CAM-101") {
        trip.assignment = null;
        trip.availability = "conflict";
        showFeedback("error", "Conflicto de demostración: CAM-101 tiene una asignación incompatible en este horario. Selecciona otro recurso o ajusta el viaje.", refs.assignmentFeedback);
      } else {
        trip.assignment = { mode, vehicle, driver };
        trip.assignmentMode = mode;
        trip.availability = "ready";
        showFeedback("success", "Asignación preparada en la propuesta. La disponibilidad y la reserva reales deben confirmarse en el servicio de Transporte.", refs.assignmentFeedback);
      }
    } else {
      const company = refs.assignmentCompany.value;
      const vehicle = refs.assignmentExternalVehicle.value.trim();
      const driver = refs.assignmentExternalDriver.value.trim();
      if (!company || !vehicle || !driver) {
        showFeedback("error", "Registra empresa, vehículo y conductor para continuar con la asignación externa.", refs.assignmentFeedback);
        return;
      }
      trip.assignment = { mode, company, vehicle, driver };
      trip.assignmentMode = mode;
      trip.availability = "ready";
      showFeedback("success", "Datos externos completos para la propuesta. La autorización y disponibilidad se validan fuera de esta vista.", refs.assignmentFeedback);
    }
    renderTrips();
    renderAssignment();
  }

  function validatePlan() {
    const errors = [];
    if (!state.source?.eligible) errors.push("Selecciona un documento de origen disponible.");
    if (!refs.planDate.value) errors.push("Indica la fecha y hora base del plan.");
    if (!state.trips.length) errors.push("Agrega al menos un viaje.");
    state.trips.forEach((trip) => {
      if (!trip.origin || !trip.destination || !trip.scheduledAt) errors.push(`${trip.label} requiere origen, destino y fecha.`);
      if (trip.availability === "conflict") errors.push(`${trip.label} tiene un conflicto de disponibilidad.`);
      if (trip.availability !== "ready") errors.push(`${trip.label} requiere una asignación validada.`);
    });
    return errors;
  }

  function saveDraft() {
    if (!state.source) {
      showFeedback("warning", "Carga un origen antes de guardar el borrador.");
      return;
    }
    showFeedback("success", "Borrador guardado en esta propuesta. No se creó un plan ni se reservó disponibilidad en el backend.");
  }

  function confirmPlan(event) {
    event.preventDefault();
    const errors = validatePlan();
    if (errors.length) {
      showFeedback("error", errors[0]);
      return;
    }
    showFeedback("success", `Plan preparado con ${state.trips.length} ${state.trips.length === 1 ? "viaje" : "viajes"}. La confirmación es simulada y no genera operaciones ni reservas reales.`);
    refs.confirmPlan.disabled = true;
    refs.confirmPlan.classList.add("is-loading");
  }

  function bindEvents() {
    refs.originType.addEventListener("change", () => {
      populateOrigins();
      state.source = null;
      refs.sourceSummary.classList.add("is-hidden");
      refs.sourceChip.textContent = "Sin origen cargado";
      state.trips = [];
      state.activeTripId = null;
      renderTrips();
      renderAssignment();
    });
    refs.loadSource.addEventListener("click", loadSource);
    refs.addTrip.addEventListener("click", addTrip);
    refs.tripBody.addEventListener("change", (event) => updateTripFromRow(event.target));
    refs.tripBody.addEventListener("click", (event) => {
      const select = event.target.closest("[data-select-trip]");
      const remove = event.target.closest("[data-remove-trip]");
      const id = event.target.closest("[data-trip-id]")?.dataset.tripId;
      if (select && id) selectTrip(id);
      if (remove && id) removeTrip(id);
    });
    refs.assignmentMode.addEventListener("change", () => {
      const trip = activeTrip();
      if (trip) {
        trip.assignmentMode = refs.assignmentMode.value;
        trip.assignment = null;
        trip.availability = "pending";
      }
      renderTrips();
      renderAssignment();
    });
    refs.checkAssignment.addEventListener("click", checkAssignment);
    refs.saveDraft.addEventListener("click", saveDraft);
    refs.form.addEventListener("submit", confirmPlan);
    refs.planDate.addEventListener("change", () => {
      state.trips.forEach((trip) => { if (!trip.scheduledAt) trip.scheduledAt = refs.planDate.value; });
      renderTrips();
    });
  }

  function init() {
    Object.assign(refs, {
      form: qs("#operationPlanForm"), originType: qs("#planOriginType"), origin: qs("#planOrigin"), loadSource: qs("[data-load-source]"), sourceChip: qs("[data-source-chip]"),
      sourceLoading: qs("[data-source-loading]"), sourceSummary: qs("[data-source-summary]"), sourceData: qs("[data-source-data]"), sourceRestriction: qs("[data-source-restriction]"),
      planDate: qs("#planDate"), planPriority: qs("#planPriority"), tripBody: qs("[data-trip-body]"), tripEmpty: qs("[data-trip-empty]"), addTrip: qs("[data-add-trip]"),
      assignmentSection: qs("[data-assignment-section]"), assignmentSubtitle: qs("[data-assignment-subtitle]"), assignmentMode: qs("#assignmentMode"),
      ownFields: qs("[data-own-fields]"), externalFields: qs("[data-external-fields]"), assignmentValidationAction: qs("[data-assignment-validation-action]"), assignmentVehicle: qs("#assignmentVehicle"), assignmentDriver: qs("#assignmentDriver"),
      assignmentCompany: qs("#assignmentCompany"), assignmentExternalVehicle: qs("#assignmentExternalVehicle"), assignmentExternalDriver: qs("#assignmentExternalDriver"),
      checkAssignment: qs("[data-check-assignment]"), assignmentFeedback: qs("[data-assignment-feedback]"), feedback: qs("[data-plan-feedback]"), saveDraft: qs("[data-save-draft]"), confirmPlan: qs("[data-confirm-plan]")
    });
    if (!refs.form) return;
    const route = new URLSearchParams(window.location.search);
    const type = route.get("origen");
    const id = route.get("id");
    if (["orden", "aviso"].includes(type)) refs.originType.value = type;
    populateOrigins(id);
    bindEvents();
    loadSource();
  }

  window.SIALOperationalPlan = { init };
})();
