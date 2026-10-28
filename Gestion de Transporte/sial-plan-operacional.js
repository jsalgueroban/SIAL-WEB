(function () {
  const byId = (id) => document.getElementById(id);
  const documents = [
    { id: "REM-2026-0184", type: "Remisión", farm: "Finca El Retiro", pickup: "Bodega principal" },
    { id: "REM-2026-0186", type: "Remisión", farm: "Finca La Ceiba", pickup: "Centro de distribución" },
    { id: "RES-2026-0047", type: "Reserva", farm: "Finca Santa Isabel", pickup: "Bodega de suministros" },
    { id: "RTP-2026-0881", type: "RTP", farm: "Finca Santa Isabel", pickup: "Proveedor regional" }
  ];
  const vehicles = {
    own: ["TRK-421 · TRANSLOGISTICA SAS", "CAM-102 · Carga Pesada Ltda.", "CMN-204 · OPERADOR CARIBE SAS"],
    external: ["EXT-014 · Transportadora Caribe", "EXT-021 · Carga Sierra"]
  };
  const seedPrograms = [
    { id: "POM-2026-014", driver: "Carlos Méndez", vehicle: "TRK-421 · TRANSLOGISTICA SAS", trips: [{ documentId: "REM-2026-0184", date: "2026-10-14T07:30" }], status: "Programado" },
    { id: "POM-2026-013", driver: "Ana Lucía Paz", vehicle: "CMN-204 · OPERADOR CARIBE SAS", trips: [{ documentId: "RTP-2026-0881", date: "2026-10-13T08:00" }], status: "En curso" }
  ];
  const storageKey = "sial-transport-operational-plan";
  let programs;
  try { const saved = JSON.parse(localStorage.getItem(storageKey)); programs = Array.isArray(saved) ? saved : seedPrograms; }
  catch { programs = seedPrograms; }
  const focusControl = (id) => (byId(`sial-library-${id}`) || byId(id))?.focus();
  let trips = [];
  let pendingDocument = "";
  let detailTrigger = null;
  let visibleDetailTrigger = null;
  document.addEventListener("click", (event) => {
    const button = event.target.closest?.('[data-sial-component="Table"] button[aria-label^="Ver viajes de "]');
    if (button) visibleDetailTrigger = button;
  }, true);

  function option(value, label) {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = label;
    return item;
  }
  function setOptions(select, placeholder, items) {
    select.replaceChildren(option("", placeholder));
    items.forEach((item) => select.appendChild(option(item.value, item.label)));
  }
  function formatDate(value) {
    if (!value) return "—";
    const [date, time] = value.split("T");
    return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)} · ${time}`;
  }
  function defaultDate(index) {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(8 + index * 3, 0, 0, 0);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  }
  function showMessage(message, success = false) {
    const field = byId("formMessage");
    field.textContent = message;
    field.classList.remove("is-hidden");
    field.classList.toggle("is-success", success);
  }
  function clearMessage() { byId("formMessage").classList.add("is-hidden"); }
  function renderVehicleOptions() {
    setOptions(byId("vehicle"), "Selecciona un vehículo", vehicles[byId("fleet").value].map((value) => ({ value, label: value })));
    renderDocumentOptions();
  }
  function renderDocumentOptions() {
    const selected = byId("sourceDocument");
    const enabled = Boolean(byId("vehicle").value);
    const occupied = new Set(programs.flatMap((program) => program.status === "Finalizado" ? [] : program.trips.map((trip) => trip.documentId)));
    const available = documents.filter((item) => !occupied.has(item.id) && !trips.some((trip) => trip.documentId === item.id));
    setOptions(selected, enabled ? (available.length ? "Selecciona un documento" : "No hay más documentos disponibles") : "Primero selecciona un vehículo",
      enabled ? available.map((item) => ({ value: item.id, label: `${item.id} · ${item.type} · ${item.farm}` })) : []);
    selected.disabled = !enabled || !available.length;
    byId("addDocument").disabled = !enabled || !available.length;
    if (enabled && pendingDocument && available.some((item) => item.id === pendingDocument)) {
      selected.value = pendingDocument;
      pendingDocument = "";
    }
  }
  function renderTrips() {
    const body = byId("tripRows");
    body.replaceChildren();
    trips.forEach((trip, index) => {
      const source = documents.find((item) => item.id === trip.documentId);
      const row = document.createElement("tr");
      const ordinal = row.insertCell();
      ordinal.textContent = String(index + 1);
      const identity = row.insertCell();
      const name = document.createElement("strong");
      name.textContent = source.id;
      const type = document.createElement("small");
      type.textContent = source.type;
      identity.append(name, document.createElement("br"), type);
      const route = row.insertCell();
      route.textContent = `${source.pickup} → ${source.farm}`;
      const schedule = row.insertCell();
      const date = document.createElement("input");
      date.className = "input";
      date.type = "datetime-local";
      date.value = trip.date;
      date.required = true;
      date.setAttribute("aria-label", `Fecha y hora del viaje ${index + 1}, ${source.id}`);
      date.addEventListener("change", () => { trip.date = date.value; clearMessage(); });
      schedule.appendChild(date);
      const actions = row.insertCell();
      actions.className = "trip-order";
      [["Subir", "up", index === 0], ["Bajar", "down", index === trips.length - 1], ["Quitar", "remove", false]].forEach(([label, action, disabled]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.disabled = disabled;
        button.dataset.tripAction = action;
        button.dataset.index = String(index);
        button.setAttribute("aria-label", `${label} viaje ${index + 1}: ${source.id}`);
        actions.appendChild(button);
      });
      body.appendChild(row);
    });
    byId("tripEmpty").classList.toggle("is-hidden", trips.length > 0);
    renderDocumentOptions();
  }
  function renderPrograms() {
    const search = byId("programSearch").value.trim().toLocaleLowerCase("es");
    const status = byId("programStatus").value;
    const visible = programs.filter((program) => (status === "all" || program.status === status) &&
      [program.id, program.driver, program.vehicle, ...program.trips.map((trip) => trip.documentId)].join(" ").toLocaleLowerCase("es").includes(search));
    byId("clearProgramFilters").hidden = !search && status === "all";
    const body = byId("programRows");
    body.replaceChildren();
    visible.forEach((program) => {
      const row = document.createElement("tr");
      [program.id, program.driver, program.vehicle].forEach((value) => { row.insertCell().textContent = value; });
      const docCell = row.insertCell();
      docCell.className = "plan-documents";
      const count = document.createElement("strong");
      count.textContent = `${program.trips.length} ${program.trips.length === 1 ? "viaje" : "viajes"}`;
      const list = document.createElement("small");
      list.textContent = program.trips.map((trip) => trip.documentId).join(" → ");
      docCell.append(count, list);
      row.insertCell().textContent = formatDate(program.trips[0]?.date);
      const state = document.createElement("span");
      state.className = `status ${program.status === "Finalizado" ? "status-inactive" : program.status === "En curso" ? "status-warning" : "status-active"}`;
      state.dataset.sialChipAdapter = "true";
      state.textContent = program.status;
      row.insertCell().appendChild(state);
      const action = document.createElement("button");
      action.type = "button";
      action.className = "icon-btn";
      action.title = "Ver viajes";
      action.setAttribute("aria-label", `Ver viajes de ${program.id}`);
      action.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      action.addEventListener("click", (event) => showProgramDetail(program, event.currentTarget));
      const actionWrap = document.createElement("div");
      actionWrap.className = "row-actions";
      actionWrap.appendChild(action);
      row.insertCell().appendChild(actionWrap);
      body.appendChild(row);
    });
    byId("programCount").textContent = `${visible.length} ${visible.length === 1 ? "registro" : "registros"}`;
    byId("programEmpty").classList.toggle("is-hidden", visible.length !== 0);
  }
  function detailGroup(label, value) {
    const group = document.createElement("div");
    group.className = "detail-group";
    const caption = document.createElement("span");
    caption.className = "detail-label";
    caption.textContent = label;
    const content = document.createElement("div");
    content.className = "detail-value";
    content.textContent = value;
    group.append(caption, content);
    return group;
  }
  function showProgramDetail(program, trigger) {
    detailTrigger = trigger;
    const body = byId("detailBody");
    body.replaceChildren(
      detailGroup("Programación", program.id),
      detailGroup("Conductor", program.driver),
      detailGroup("Vehículo", program.vehicle),
      detailGroup("Estado", program.status)
    );
    program.trips.forEach((trip, index) => {
      const source = documents.find((item) => item.id === trip.documentId);
      body.appendChild(detailGroup(`Viaje ${index + 1} · ${trip.documentId}`,
        `${source?.pickup || "Origen por consultar"} → ${source?.farm || "Destino por consultar"} · ${formatDate(trip.date)}`));
    });
    byId("detailBackdrop").classList.add("show");
    byId("detailDrawer").classList.add("show");
    byId("detailDrawer").setAttribute("aria-hidden", "false");
    byId("closeDetail").focus();
  }
  function closeDetail() {
    byId("detailBackdrop").classList.remove("show");
    byId("detailDrawer").classList.remove("show");
    byId("detailDrawer").setAttribute("aria-hidden", "true");
    const target = visibleDetailTrigger?.isConnected ? visibleDetailTrigger : detailTrigger;
    requestAnimationFrame(() => requestAnimationFrame(() => target?.focus()));
  }
  function openForm() {
    byId("programPanel").classList.remove("is-hidden");
    byId("newProgram").setAttribute("aria-expanded", "true");
    byId("programHeading").setAttribute("tabindex", "-1");
    byId("programHeading").focus();
    byId("programPanel").scrollIntoView({ block: "start" });
  }
  function closeForm() {
    byId("programPanel").classList.add("is-hidden");
    byId("newProgram").setAttribute("aria-expanded", "false");
    byId("materialTransferForm").reset();
    trips = [];
    renderVehicleOptions();
    renderTrips();
    clearMessage();
    (byId("newProgram").previousElementSibling?.querySelector("button") || byId("newProgram")).focus();
  }
  function save(event) {
    event.preventDefault();
    if (!byId("driver").value) { showMessage("Selecciona el conductor."); focusControl("driver"); return; }
    if (!byId("vehicle").value) { showMessage("Selecciona el vehículo antes de agregar documentos."); focusControl("vehicle"); return; }
    if (!trips.length) { showMessage("Agrega al menos un documento para programar un viaje."); focusControl("sourceDocument"); return; }
    if (trips.some((trip) => !trip.date)) { showMessage("Indica fecha y hora para cada viaje."); byId("tripRows").querySelectorAll("input")[trips.findIndex((trip) => !trip.date)].focus(); return; }
    for (let index = 1; index < trips.length; index += 1) {
      if (trips[index].date <= trips[index - 1].date) { showMessage("Las fechas deben seguir el orden de los viajes."); byId("tripRows").querySelectorAll("input")[index].focus(); return; }
    }
    const next = Math.max(0, ...programs.map((item) => Number(item.id.split("-").pop()) || 0)) + 1;
    programs.unshift({ id: `POM-2026-${String(next).padStart(3, "0")}`, driver: byId("driver").value, vehicle: byId("vehicle").value,
      trips: trips.map((item) => ({ ...item })), status: "Programado", observations: byId("operationObservations").value.trim() });
    localStorage.setItem(storageKey, JSON.stringify(programs));
    byId("programSearch").value = "";
    byId("programStatus").value = "all";
    byId("programSearch").dispatchEvent(new Event("input", { bubbles: true }));
    byId("programStatus").dispatchEvent(new Event("change", { bubbles: true }));
    renderPrograms();
    closeForm();
  }
  function init() {
    if (!byId("materialTransferForm")) return;
    renderVehicleOptions();
    renderPrograms();
    byId("newProgram").addEventListener("click", openForm);
    byId("cancelProgram").addEventListener("click", closeForm);
    byId("fleet").addEventListener("change", () => { renderVehicleOptions(); clearMessage(); });
    byId("vehicle").addEventListener("change", () => { renderDocumentOptions(); clearMessage(); });
    byId("addDocument").addEventListener("click", () => {
      const id = byId("sourceDocument").value;
      if (!id) { showMessage("Selecciona un documento disponible."); focusControl("sourceDocument"); return; }
      trips.push({ documentId: id, date: defaultDate(trips.length) });
      renderTrips();
      clearMessage();
    });
    byId("tripRows").addEventListener("click", (event) => {
      const button = event.target.closest("[data-trip-action]");
      if (!button) return;
      const index = Number(button.dataset.index);
      if (button.dataset.tripAction === "remove") trips.splice(index, 1);
      else {
        const target = index + (button.dataset.tripAction === "up" ? -1 : 1);
        [trips[index], trips[target]] = [trips[target], trips[index]];
      }
      renderTrips();
      clearMessage();
    });
    byId("materialTransferForm").addEventListener("submit", save);
    byId("programSearch").addEventListener("input", renderPrograms);
    byId("programStatus").addEventListener("change", renderPrograms);
    byId("clearProgramFilters").addEventListener("click", () => {
      byId("programSearch").value = "";
      byId("programStatus").value = "all";
      byId("programSearch").dispatchEvent(new Event("input", { bubbles: true }));
      byId("programStatus").dispatchEvent(new Event("change", { bubbles: true }));
      focusControl("programSearch");
    });
    byId("closeDetail").addEventListener("click", closeDetail);
    byId("detailBackdrop").addEventListener("click", closeDetail);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && byId("detailDrawer").classList.contains("show")) closeDetail(); });
    const params = new URLSearchParams(location.search);
    const requested = params.get("id");
    const origin = params.get("origen");
    if (requested && origin === "orden") {
      documents.push({ id: requested, type: "Orden de materiales", farm: "Destino de la orden", pickup: "Origen de la orden" });
      pendingDocument = requested;
      byId("sourceContext").textContent = `Origen de la planificación: orden de materiales ${requested}`;
      byId("sourceContext").classList.remove("is-hidden");
      openForm();
    } else if (requested && origin === "aviso") {
      byId("sourceContext").textContent = `Origen de la planificación: aviso de corte ${requested}`;
      byId("sourceContext").classList.remove("is-hidden");
      openForm();
    } else if (requested && documents.some((item) => item.id === requested)) {
      pendingDocument = requested;
      openForm();
    }
  }
  window.SIALOperationalPlan = { init };
})();
