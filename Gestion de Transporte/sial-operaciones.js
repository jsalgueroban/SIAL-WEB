const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const vehicleData = {
    "TRK-421": { plate: "TRK-421", type: "TRACTOMULA", capacity: 32, company: "TRANSLOGISTICA SAS" },
    "CAM-101": { plate: "CAM-101", type: "CAMION", capacity: 18, company: "Transportes del Valle" },
    "TRK-422": { plate: "TRK-422", type: "TRACTOMULA", capacity: 32, company: "Flota Oriente S.A.S." },
    "CAM-102": { plate: "CAM-102", type: "CAMION RIGIDO", capacity: 22, company: "Carga Pesada Ltda." },
    "CMN-204": { plate: "CMN-204", type: "CAMION", capacity: 18, company: "OPERADOR CARIBE SAS" }
  };

  // El único vehículo de prueba adicional procede del escenario expresamente autorizado.
  (window.TransportAvailability?.list() || []).filter(item => item.isDemo).forEach(item => {
    vehicleData[item.plate] = { plate: item.plate, type: item.vehicleType, capacity: item.palletCapacity, company: item.carrierCompany };
  });

  const driverData = {
    "DRV-001": { code: "DRV-001", name: "Carlos Mendez", license: "C2", licenseExp: "2026-12-15", arlExp: "2026-11-30", status: "Activo" },
    "DRV-003": { code: "DRV-003", name: "Ana Lucia Paz", license: "C3", licenseExp: "2026-10-20", arlExp: "2026-09-15", status: "Activo" },
    "DRV-005": { code: "DRV-005", name: "Pedro Rojas", license: "C2", licenseExp: "2027-01-10", arlExp: "2026-12-01", status: "Activo" }
  };

  // Se reutilizan los catálogos locales; los DRV históricos no equivalen a un conductor vigente.
  function validDateOnly(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function eligibleDrivers(scheduledAt = "") {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    const requested = scheduledAt.slice(0,10);
    const requiredDate = requested && requested > today ? requested : today;
    let categories;
    try { categories = JSON.parse(localStorage.getItem("sial-proposal-license-categories-v2")); } catch { categories = null; }
    const activeCategories = new Set((Array.isArray(categories) ? categories : [{code:"C2",status:true},{code:"C3",status:true},{code:"A1",status:false}]).filter(item => item.status === true).map(item => item.code));
    const relations = typeof DriverRelations === "undefined" ? [] : DriverRelations.read();
    const drivers = typeof DriverPrototype === "undefined" ? [] : DriverPrototype.read();
    return drivers.flatMap(driver => {
      if (driver.state !== "active" || !validDateOnly(driver.arlStart) || !validDateOnly(driver.arlEnd) || driver.arlStart > today || driver.arlEnd < requiredDate) return [];
      const license = relations.filter(item => item.code === driver.code && item.state === "active" && activeCategories.has(item.license) && validDateOnly(item.expiration) && item.expiration >= requiredDate).sort((a,b) => b.expiration.localeCompare(a.expiration))[0];
      return license ? [{code:driver.code,name:`${driver.firstName} ${driver.lastName}`.trim(),license:license.license,licenseExp:license.expiration,arlExp:driver.arlEnd,status:"Activo"}] : [];
    });
  }
  eligibleDrivers().forEach(item => { driverData[item.code] = item; });

  const destinationsByType = {
    Finca: ["Finca El Rosario", "Finca San Jose", "Finca La Aurora"],
    Puerto: ["Puerto ZE", "Puerto Cartagena", "Puerto Santa Marta"]
  };

  const operationData = {
    "OP-001": { vehicle: "TRK-421", driver: "DRV-001", week: "2026-W24", date: "2026-06-10T07:30", destType: "Puerto", dest: "Puerto ZE", obs: "Cargue de contenedor refrigerado." },
    "OP-002": { vehicle: "CAM-101", driver: "DRV-003", week: "2026-W24", date: "2026-06-10T06:15", destType: "Finca", dest: "Finca El Rosario", obs: "" },
    "OP-003": { vehicle: "CMN-204", driver: "DRV-005", week: "2026-W26", date: "2026-06-22T09:00", destType: "Puerto", dest: "Puerto Cartagena", obs: "Programacion futura." },
    "OP-004": { vehicle: "CAM-102", driver: "", week: "2026-W23", date: "2026-06-08T08:00", destType: "Puerto", dest: "Puerto Cartagena", obs: "Operacion finalizada disponible para reprogramacion." }
  };

  // Fuente local de la maqueta. La elegibilidad productiva sigue siendo del servicio.
  const operationStorageKey = window.SIALOperationStore.key;
  const readOperations = () => window.SIALOperationStore.read();
  const savedOperations = () => {
    try { const value = JSON.parse(localStorage.getItem(operationStorageKey)); return Array.isArray(value) ? value : []; } catch { return []; }
  };
  function hydrateOperationList() {
    const body = qs("#operationTableBody"); if (!body) return;
    const ids = { "TRK-421": "OP-001", "CAM-101": "OP-002", "CMN-204": "OP-003", "CAM-102": "OP-004" };
    const records = readOperations();
    const template = qs('tr[data-plate="TRK-421"]', body);
    const rendered = new Set();
    function hydrate(row, item, isNew) {
      const driver = driverData[item.driver]?.name || item.driver || "--";
      const state = item.state || "PROGRAMADO";
      const status = state === "FINALIZADO" ? "inactive" : state === "DISPONIBLE" ? "active" : "warning";
      const label = calculateOperationWeek(item.date)?.label || item.week;
      const date = item.date ? `${item.date.slice(8,10)}/${item.date.slice(5,7)}/${item.date.slice(0,4)} ${item.date.slice(11,16)}` : "--";
      const info = vehicleData[item.vehicle] || window.TransportAvailability?.get(item.vehicle)?.record || {};
      if (isNew) row.dataset.traceability = `${item.origin ? `Reprogramada desde ${item.origin}|${date}|status-warning;` : ""}Programación creada|${date}|status-warning`;
      Object.assign(row.dataset, { code: item.id, operationId: item.id, plate: item.vehicle, vehicleType: info.type || info.vehicleType || "Sin información", driver, destinationType: item.destType, destination: item.dest, context: item.destType.toLowerCase(), date, week: isFutureDate(item.date) ? "future" : item.week, weekLabel: label, state, status, audit: (item.audit || []).map(entry => `${entry}|`).join(";") });
      const cells = qsa("td", row);
      if (cells.length >= 8) {
        [item.vehicle, driver, item.destType, item.dest, date, label].forEach((value, index) => { cells[index].textContent = value; });
        const badge = qs(".status", cells[6]); if (badge) { badge.textContent = state; badge.className = `status status-${status}`; }
        const link = qs("a", cells[7]);
        if (link && isNew) { const scenario = new URLSearchParams(location.search).get("escenario"); link.href = `inicio-operacion.html?modo=editar&id=${encodeURIComponent(item.id)}${scenario === "disponible" ? "&escenario=disponible" : ""}`; }
      }
    }
    qsa("tr[data-plate]", body).forEach(row => {
      const id = ids[row.dataset.plate], item = records.find(record => record.id === id);
      if (!item) return;
      row.dataset.operationId = id; row.dataset.code = id; rendered.add(id);
      if (savedOperations().some(saved => saved.id === id)) hydrate(row, item, false);
    });
    if (template) records.filter(item => !rendered.has(item.id)).reverse().forEach(item => {
      const row = template.cloneNode(true); hydrate(row, item, true); body.prepend(row);
    });
  }

  function getUrlParams() {
    const params = {};
    window.location.search.replace(/^\?/, "").split("&").forEach((pair) => {
      const [key, val] = pair.split("=");
      if (key) params[decodeURIComponent(key)] = val ? decodeURIComponent(val) : "";
    });
    return params;
  }

  function applyShell(activeKey) {
    const moduleId = "transporte";
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: moduleId, view: activeKey || "gestion" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["gestion", "gestion-conductores.html", "Gestion de conductores"],
      ["licencias", "gestion-categorias-licencia.html", "Gestion de licencias"],
      ["relacion", "relacion-conductor-licencia.html", "Conductor + licencia"],
      ["vehiculos", "gestion-vehiculos.html", "Gestion de vehiculos"],
      ["tiposVehiculo", "gestion-tipos-vehiculo.html", "Tipos de vehiculos"],
      ["dashboard", "dashboard-transporte.html", "Dashboard transporte"],
      ["documental", "matriz-documental-vehiculos.html", "Matriz documental"],
      ["disponibilidad", "disponibilidad-operativa.html", "Disponibilidad"],
      ["mantenimientos", "gestion-mantenimientos.html", "Mantenimientos"],
      ["operaciones", "gestion-operaciones.html", "Programacion de vehiculos"]
    ];
    nav.innerHTML = items.map(([key, href, label]) =>
      `<a class="nav-link ${key === activeKey ? "active" : ""}" href="${href}"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>${label}</span></a>`
    ).join("");
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function formatDate(date) {
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
  }

  function isFutureDate(value) {
    if (!value) return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
  }

  function calculateOperationWeek(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const cleanDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = cleanDate.getUTCDay() || 7;
    cleanDate.setUTCDate(cleanDate.getUTCDate() + 4 - day);
    const weekYear = cleanDate.getUTCFullYear();
    const yearStart = new Date(Date.UTC(weekYear, 0, 1));
    const week = Math.ceil((((cleanDate - yearStart) / 86400000) + 1) / 7);
    const start = new Date(date);
    const localDay = start.getDay() || 7;
    start.setDate(start.getDate() - localDay + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      key: `${weekYear}-W${pad(week)}`,
      label: `Semana ${week} - ${weekYear} (${formatDate(start)} al ${formatDate(end)})`
    };
  }

  const escapeMarkup = (value) => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

  function vehicleOptions(selected = "") {
    const items = Object.values(vehicleData).filter(item => window.TransportAvailability?.get(item.plate)?.eligible === "available" || item.plate === selected);
    const placeholder = items.length ? "Vehículo" : "Sin vehículos con disponibilidad verificable";
    return `<option value="">${placeholder}</option>${items.map((item) =>
      `<option value="${escapeMarkup(item.plate)}" ${item.plate === selected ? "selected" : ""}>${escapeMarkup(item.plate)} - ${escapeMarkup(item.type)}</option>`
    ).join("")}`;
  }

  function driverOptions(selected = "") {
    return `<option value="">Conductor</option>${eligibleDrivers().map((item) =>
      `<option value="${escapeMarkup(item.code)}" ${item.code === selected ? "selected" : ""}>${escapeMarkup(item.name)}</option>`
    ).join("")}`;
  }

  function populateDestinationSelect(select, type, selected = "") {
    if (!select) return;
    const options = destinationsByType[type] || [];
    select.innerHTML = options.length ? '<option value="">Selecciona destino</option>' : '<option value="">Primero selecciona tipo</option>';
    options.forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      o.selected = opt === selected;
      select.appendChild(o);
    });
  }

  function setFieldState(input, note, error, successText) {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function updateWeekDisplay(dateInput, weekDisplay, operationWeek, note, allowPast = false) {
    const week = calculateOperationWeek(dateInput?.value || "");
    if (!week) {
      if (weekDisplay) weekDisplay.value = "";
      if (operationWeek) operationWeek.value = "";
      setFieldState(dateInput, note, "Selecciona una fecha valida.", "");
      return false;
    }
    if (!allowPast && !isFutureDate(dateInput.value)) {
      if (weekDisplay) weekDisplay.value = week.label;
      if (operationWeek) operationWeek.value = week.key;
      setFieldState(dateInput, note, "La fecha debe ser futura para poder planificar.", "");
      return false;
    }
    if (weekDisplay) weekDisplay.value = week.label;
    if (operationWeek) operationWeek.value = week.key;
    setFieldState(dateInput, note, "", `Semana calculada: ${week.label}`);
    return true;
  }

  function initOperationForm() {
    const form = qs("#operationForm");
    if (!form) return;
    const ok = qs("#formOk");
    const params = getUrlParams();
    const isEdit = params.modo === "editar";
    const isReprogram = params.modo === "reprogramar";
    const opId = params.id || "";
    const currentOperation = readOperations().find(item => item.id === opId);
    if (currentOperation) {
      operationData[opId] = currentOperation;
      if (!vehicleData[currentOperation.vehicle]) vehicleData[currentOperation.vehicle] = { plate: currentOperation.vehicle, type: "Sin información", capacity: "", company: "Sin información" };
    }

    const vehicleSelect = qs("#vehicleSelect");
    if (vehicleSelect) {
      const eligible = (window.TransportAvailability?.list() || []).filter(item => window.TransportAvailability.get(item.plate).eligible === "available");
      vehicleSelect.replaceChildren(new Option("Selecciona vehículo disponible", ""));
      eligible.forEach(item => vehicleSelect.add(new Option(item.isDemo ? `${item.plate} · Vehículo de demostración` : item.plate, item.plate)));
      if (currentOperation && !Array.from(vehicleSelect.options).some(option => option.value === currentOperation.vehicle)) vehicleSelect.add(new Option(`${currentOperation.vehicle} · Asignación anterior`, currentOperation.vehicle));
      const note = qs("#vehicleSelectNote");
      if (note) note.textContent = eligible.length ? "Solo vehículos con disponibilidad verificada en este escenario." : "No hay vehículos con disponibilidad verificable. Consulta la vista de disponibilidad.";
    }
    const driverSelect = qs("#driverSelect");
    if (driverSelect) {
      driverSelect.replaceChildren(new Option("Selecciona conductor activo", ""));
      eligibleDrivers().forEach(item => { driverData[item.code] = item; driverSelect.add(new Option(item.name, item.code)); });
      if (currentOperation && !Array.from(driverSelect.options).some(option => option.value === currentOperation.driver)) {
        const historical = driverData[currentOperation.driver];
        if (currentOperation.driver) { const item = new Option(`${historical?.name || currentOperation.driver} (histórico; selecciona un conductor vigente)`, currentOperation.driver); item.disabled = true; driverSelect.add(item); }
      }
      const note = qs("#driverSelectNote");
      if (note) note.textContent = "Conductores activos con ARL y categoría de licencia vigentes en los datos locales.";
    }
    const weekDisplay = qs("#weekDisplay");
    const operationWeek = qs("#operationWeek");
    const dateInput = qs("#dateOperative");
    const dateNote = qs("#dateOperativeNote");
    const destType = qs("#destinationType");
    const destSelect = qs("#destinationSelect");

    const readonlyFields = {
      plate: qs("#plateDisplay"),
      vehType: qs("#vehicleTypeDisplay"),
      capacity: qs("#capacityDisplay"),
      company: qs("#companyDisplay"),
      license: qs("#licenseDisplay"),
      licenseExp: qs("#licenseExpDisplay"),
      arlExp: qs("#arlExpDisplay")
    };

    const setVehicleReadOnly = (value) => {
      const data = vehicleData[value];
      if (readonlyFields.plate) readonlyFields.plate.value = data?.plate || "";
      if (readonlyFields.vehType) readonlyFields.vehType.value = data?.type || "";
      if (readonlyFields.capacity) readonlyFields.capacity.value = data?.capacity || "";
      if (readonlyFields.company) readonlyFields.company.value = data?.company || "";
    };

    const setDriverReadOnly = (value) => {
      const data = driverData[value];
      if (readonlyFields.license) readonlyFields.license.value = data?.license || "";
      if (readonlyFields.licenseExp) readonlyFields.licenseExp.value = data?.licenseExp || "";
      if (readonlyFields.arlExp) readonlyFields.arlExp.value = data?.arlExp || "";
    };

    if (isEdit) {
      const op = operationData[opId];
      qs(".page-eyebrow").textContent = "Transporte / Programacion de vehiculos / Editar programacion";
      qs(".page-title").textContent = "Editar programacion";
      qs(".page-subtitle").textContent = "Modifica los datos editables de la programacion. La semana operativa se calcula desde la fecha programada.";
      qs(".form-heading h2").textContent = "Edicion de programacion";
      qs(".form-heading p").textContent = "Campos editables: conductor, tipo de destino, destino y observaciones.";
      qs("#operationFormSubmit").textContent = "Guardar cambios";
      qs(".notice-info span").innerHTML = "Solo se permite editar la programacion si el vehiculo no ha cambiado de estado posterior. La auditoria se registra al guardar.";

      if (op) {
        vehicleSelect.value = op.vehicle;
        vehicleSelect.disabled = true;
        setVehicleReadOnly(op.vehicle);
        driverSelect.value = op.driver;
        setDriverReadOnly(op.driver);
        dateInput.value = op.date;
        dateInput.disabled = true;
        updateWeekDisplay(dateInput, weekDisplay, operationWeek, dateNote, true);
        destType.value = op.destType;
        populateDestinationSelect(destSelect, op.destType, op.dest);
        qs("#operationObservations").value = op.obs || "";
      }
      qs(".form-actions .btn-secondary[type=reset]").style.display = "none";
    }

    if (isReprogram) {
      const op = operationData[opId];
      qs(".page-eyebrow").textContent = "Transporte / Programacion de vehiculos / Reprogramar vehiculo";
      qs(".page-title").textContent = "Reprogramar vehiculo";
      qs(".page-subtitle").textContent = "Crea una nueva programacion a partir de un vehiculo con operacion finalizada. El origen queda como trazabilidad, no se edita la operacion anterior.";
      qs(".form-heading h2").textContent = "Reprogramacion desde operacion finalizada";
      qs(".form-heading p").textContent = "Vehiculo precargado desde el registro finalizado; define nuevo conductor, fecha futura y destino.";
      qs("#operationFormSubmit").textContent = "Guardar reprogramacion";
      qs(".notice-info span").innerHTML = "La reprogramacion crea una nueva operacion. El vehiculo debe estar disponible y sin programacion activa vigente.";
      if (op) {
        vehicleSelect.value = op.vehicle;
        vehicleSelect.disabled = true;
        setVehicleReadOnly(op.vehicle);
        const resultMsg = qs("#formResultMessage");
        if (resultMsg) resultMsg.textContent = `Origen: ${opId} finalizada. Nueva programacion pendiente de fecha, conductor y destino.`;
      }
    }

    if ((isEdit && (!currentOperation || !currentOperation.state.startsWith("PROGRAMADO"))) || (isReprogram && (!currentOperation || currentOperation.state !== "FINALIZADO"))) {
      const submit = qs("#operationFormSubmit"); if (submit) submit.disabled = true;
      ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error");
      ok.textContent = currentOperation ? "Esta operación ya cambió de estado y no puede editarse." : "No se encontró la operación solicitada.";
      ok.setAttribute("role", "alert");
    }

    if (!isEdit && !isReprogram && dateInput?.value) {
      updateWeekDisplay(dateInput, weekDisplay, operationWeek, dateNote);
    }

    const required = isEdit
      ? [
          ["driverSelect", "Selecciona un conductor activo con ARL y licencia vigentes para la fecha.", v => eligibleDrivers(dateInput?.value || "").some(item => item.code === v)],
          ["destinationType", "Selecciona el tipo de destino.", v => Boolean(v)],
          ["destinationSelect", "Selecciona el destino.", v => Boolean(v)]
        ]
      : [
          ["vehicleSelect", "Selecciona un vehiculo disponible.", v => Boolean(v)],
          ["driverSelect", "Selecciona un conductor activo con ARL y licencia vigentes para la fecha.", v => eligibleDrivers(dateInput?.value || "").some(item => item.code === v)],
          ["dateOperative", "Selecciona una fecha futura para planificar.", () => updateWeekDisplay(dateInput, weekDisplay, operationWeek, dateNote)],
          ["destinationType", "Selecciona el tipo de destino.", v => Boolean(v)],
          ["destinationSelect", "Selecciona el destino.", v => Boolean(v)]
        ];

    vehicleSelect?.addEventListener("change", () => setVehicleReadOnly(vehicleSelect.value));
    driverSelect?.addEventListener("change", () => setDriverReadOnly(driverSelect.value));
    dateInput?.addEventListener("change", () => updateWeekDisplay(dateInput, weekDisplay, operationWeek, dateNote, isEdit));
    dateInput?.addEventListener("input", () => updateWeekDisplay(dateInput, weekDisplay, operationWeek, dateNote, isEdit));

    destType?.addEventListener("change", () => {
      populateDestinationSelect(destSelect, destType.value);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      required.forEach(([id, message, rule]) => {
        const input = qs(`#${id}`);
        const note = qs(`#${id}Note`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const error = rule(input?.value || "") ? "" : message;
        setFieldState(input, note, error, "Dato validado.");
        if (error) fail = true;
      });
      ok?.classList.toggle("is-hidden", fail);
      if (fail) {
        const first = form.querySelector('[aria-invalid="true"]');
        const visible = first?.closest("[data-sial-form-control]")?.querySelector(".sial-library-field input, .sial-library-field button, .sial-library-field [role=combobox]");
        (visible || first)?.focus();
      }
      if (!fail) {
        const vehicle = vehicleSelect.value;
        if (!isEdit) {
          const availability = window.TransportAvailability?.get(vehicle);
          if (availability?.eligible !== "available") {
            const message = availability?.eligible === "blocked"
              ? `El vehículo no puede programarse: ${(availability.signals || []).join(" ")}`
              : "No se pudo verificar que el vehículo esté disponible. La programación requiere una fuente de elegibilidad confirmada.";
            ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error");
            ok.setAttribute("role", "alert"); ok.textContent = message;
            (qs("#sial-library-vehicleSelect") || vehicleSelect)?.focus();
            return;
          }
          const current = readOperations();
          if (isReprogram && current.some(item => item.vehicle === vehicle && item.id !== opId && item.state?.startsWith("PROGRAMADO") && new Date(item.date).getTime() > Date.now())) {
            ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error"); ok.setAttribute("role", "alert");
            ok.textContent = "El vehículo ya tiene una programación futura vigente; no puede reprogramarse en este escenario."; return;
          }
          const next = Math.max(0, ...current.map(item => Number(item.id.replace("OP-", "")) || 0)) + 1;
          const id = `OP-${String(next).padStart(3, "0")}`;
          const created = { id, vehicle, driver: driverSelect.value, week: operationWeek.value, date: dateInput.value,
            destType: destType.value, dest: destSelect.value, obs: qs("#operationObservations").value.trim(),
            state: `PROGRAMADO A ${destType.value.toUpperCase()}`, audit: [`Crear programación · ${new Date().toLocaleString("es-CO")}`],
            ...(isReprogram ? { origin: opId } : {}), ...(availability.record?.isDemo ? { isDemo: true } : {}) };
          try { window.SIALOperationStore.write([created, ...current]); }
          catch { ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error"); ok.setAttribute("role", "alert"); ok.textContent = "No fue posible guardar la programación en este navegador."; return; }
          window.location.href = `gestion-operaciones.html${params.escenario === "disponible" ? "?escenario=disponible" : ""}`;
          return;
        }
        const current = readOperations().find(item => item.id === opId);
        if (!current || !current.state.startsWith("PROGRAMADO")) {
          ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error");
          ok.setAttribute("role", "alert"); ok.textContent = "Esta operación ya cambió de estado y no puede editarse."; return;
        }
        const updated = { ...current, driver: driverSelect.value, destType: destType.value, dest: destSelect.value,
          obs: qs("#operationObservations").value.trim(), audit: [...(current.audit || []), `Editar programación · ${new Date().toLocaleString("es-CO")}`] };
        try {
          const changes = readOperations().map(item => item.id === opId ? updated : item);
          window.SIALOperationStore.write(changes);
        } catch { ok.classList.remove("is-hidden", "notice-success"); ok.classList.add("notice-error"); ok.setAttribute("role", "alert"); ok.textContent = "No fue posible guardar los cambios en este navegador."; return; }
        window.location.href = `gestion-operaciones.html${params.escenario === "disponible" ? "?escenario=disponible" : ""}`;
      }
    });

    form.addEventListener("reset", () => {
      setTimeout(() => {
        qsa(".is-error", form).forEach((node) => { node.classList.remove("is-error"); node.removeAttribute("aria-invalid"); });
        qsa(".field-note", form).forEach((note) => {
          note.classList.remove("error", "success");
          if (note.dataset.base) note.textContent = note.dataset.base;
        });
        ok?.classList.add("is-hidden");
        Object.values(readonlyFields).forEach((field) => { if (field) field.value = ""; });
        if (!isEdit) {
          if (destSelect) destSelect.innerHTML = '<option value="">Primero selecciona tipo de destino</option>';
          if (vehicleSelect) {
            const sourceOp = isReprogram ? operationData[opId] : null;
            if (sourceOp) {
              vehicleSelect.value = sourceOp.vehicle;
              vehicleSelect.disabled = true;
              setVehicleReadOnly(sourceOp.vehicle);
            } else {
              vehicleSelect.value = "";
              vehicleSelect.disabled = false;
            }
          }
          if (dateInput) { dateInput.value = ""; dateInput.disabled = false; }
          if (weekDisplay) weekDisplay.value = "";
          if (operationWeek) operationWeek.value = "";
        }
        qs("#operationFormSubmit")?.removeAttribute("disabled");
        qs("#operationFormSubmit")?.classList.remove("is-loading");
      }, 0);
    });
  }

  function initBulkVehicleScheduling() {
    const rowsContainer = qs("#bulkRows");
    if (!rowsContainer) return;
    const baseDate = qs("#bulkBaseDate");
    const destType = qs("#bulkDestinationType");
    const destSelect = qs("#bulkDestinationSelect");
    const addButton = qs("#addBulkRow");
    const validateButton = qs("#validateBulkRows");
    const saveButton = qs("#saveBulkRows");
    const statusChip = qs("#bulkStatusChip");
    const ok = qs("#bulkOk");
    const warning = qs("#bulkWarning");
    let rowIndex = 0;

    const clearMessages = () => {
      ok?.classList.add("is-hidden");
      warning?.classList.add("is-hidden");
      if (saveButton) saveButton.disabled = true;
      if (statusChip) statusChip.textContent = "Sin validar";
    };

    const setRowStatus = (row, message, type = "muted") => {
      const target = qs("[data-bulk-status]", row);
      if (!target) return;
      target.className = type === "error" ? "status status-inactive" : type === "success" ? "status status-active" : "status status-warning";
      target.textContent = message;
    };

    const updateRowWeek = (row) => {
      const date = qs("[data-bulk-date]", row);
      const weekTarget = qs("[data-bulk-week]", row);
      const week = calculateOperationWeek(date?.value || "");
      if (weekTarget) {
        weekTarget.textContent = week ? week.label : "-";
        weekTarget.dataset.weekKey = week?.key || "";
      }
      return week;
    };

    const addRow = () => {
      rowIndex += 1;
      const row = document.createElement("tr");
      row.dataset.bulkRow = String(rowIndex);
      row.innerHTML = `
        <td><select class="select compact-control" data-bulk-vehicle aria-label="Vehiculo fila ${rowIndex}">${vehicleOptions()}</select></td>
        <td><select class="select compact-control" data-bulk-driver aria-label="Conductor fila ${rowIndex}">${driverOptions()}</select></td>
        <td><input class="input compact-control" type="datetime-local" data-bulk-date aria-label="Fecha fila ${rowIndex}" value="${baseDate?.value || ""}" /></td>
        <td><span class="bulk-week" data-bulk-week>-</span></td>
        <td><span class="status status-warning" data-bulk-status>Pendiente</span></td>
        <td><button class="icon-btn" type="button" data-remove-bulk-row aria-label="Quitar fila"><svg class="icon" viewBox="0 0 24 24"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg></button></td>
        `;
      rowsContainer.appendChild(row);
      updateRowWeek(row);
      clearMessages();
    };

    const validateRows = () => {
      const rows = qsa("tr", rowsContainer);
      const errors = [];
      const vehicles = new Map();
      const drivers = new Map();
      const payload = [];

      if (!destType?.value) errors.push("Selecciona el tipo de destino del lote.");
      if (!destSelect?.value) errors.push("Selecciona el destino del lote.");
      if (!rows.length) errors.push("Agrega al menos una fila para programar.");

      rows.forEach((row, index) => {
        const rowNumber = index + 1;
        const vehicle = qs("[data-bulk-vehicle]", row);
        const driver = qs("[data-bulk-driver]", row);
        const date = qs("[data-bulk-date]", row);
        const week = updateRowWeek(row);
        const rowErrors = [];

        [vehicle, driver, date].forEach((input) => input?.classList.remove("is-error"));
        if (!vehicle?.value) rowErrors.push("vehiculo");
        if (vehicle?.value && window.TransportAvailability?.get(vehicle.value)?.eligible !== "available") rowErrors.push("disponibilidad no verificada");
        if (!driver?.value) rowErrors.push("conductor");
        else if (!eligibleDrivers(date?.value || "").some(item => item.code === driver.value)) rowErrors.push("conductor sin vigencia verificable");
        if (!date?.value || !week || !isFutureDate(date.value)) rowErrors.push("fecha futura");
        if (vehicle?.value && vehicles.has(vehicle.value)) rowErrors.push("vehiculo duplicado");
        if (driver?.value && drivers.has(driver.value)) rowErrors.push("conductor duplicado");

        if (vehicle?.value) vehicles.set(vehicle.value, rowNumber);
        if (driver?.value) drivers.set(driver.value, rowNumber);

        if (rowErrors.length) {
          if (!vehicle?.value || rowErrors.includes("vehiculo duplicado")) vehicle?.classList.add("is-error");
          if (!driver?.value || rowErrors.includes("conductor duplicado")) driver?.classList.add("is-error");
          if (!date?.value || rowErrors.includes("fecha futura")) date?.classList.add("is-error");
          setRowStatus(row, "Revisar", "error");
          errors.push(`Fila ${rowNumber}: ${rowErrors.join(", ")}.`);
        } else {
          setRowStatus(row, "Validada", "success");
          payload.push({
            vehicleId: vehicle.value,
            driverId: driver.value,
            scheduledAt: date.value,
            operationWeek: week.key,
            destinationType: destType.value,
            destinationId: destSelect.value,
            observations: ""
          });
        }
      });

      const valid = errors.length === 0;
      if (warning) {
        warning.classList.toggle("is-hidden", valid);
        warning.innerHTML = valid ? "" : `<svg class="icon" viewBox="0 0 24 24"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="m10.3 3.8-7 12.2A2 2 0 0 0 5 19h14a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"></path></svg><span>${errors.join(" ")}</span>`;
      }
      if (ok) ok.classList.add("is-hidden");
      if (saveButton) saveButton.disabled = !valid;
      if (statusChip) statusChip.textContent = valid ? `${payload.length} ${payload.length === 1 ? "fila validada" : "filas validadas"}` : "Requiere ajustes";
      return { valid, payload, errors };
    };

    destType?.addEventListener("change", () => {
      populateDestinationSelect(destSelect, destType.value);
      clearMessages();
    });
    [baseDate, destSelect].filter(Boolean).forEach((control) => control.addEventListener("change", clearMessages));
    addButton?.addEventListener("click", addRow);
    validateButton?.addEventListener("click", validateRows);
    saveButton?.addEventListener("click", () => {
      const result = validateRows();
      if (!result.valid) return;
      const current = readOperations();
      let counter = Math.max(0, ...current.map(item => Number(item.id.replace("OP-", "")) || 0));
      const created = result.payload.map(item => ({
        id: `OP-${String(++counter).padStart(3, "0")}`,
        vehicle: item.vehicleId, driver: item.driverId, date: item.scheduledAt, week: item.operationWeek,
        destType: item.destinationType, dest: item.destinationId, obs: item.observations,
        state: `PROGRAMADO A ${item.destinationType.toUpperCase()}`,
        audit: [`Crear programación · ${new Date().toLocaleString("es-CO")}`],
        ...(window.TransportAvailability?.get(item.vehicleId)?.record?.isDemo ? { isDemo: true } : {})
      }));
      try { window.SIALOperationStore.write([...created, ...current]); }
      catch { if (warning) { warning.classList.remove("is-hidden"); warning.textContent = "No fue posible guardar el lote en este navegador."; } return; }
      window.location.reload();
    });

    rowsContainer.addEventListener("input", (event) => {
      const row = event.target.closest("tr");
      if (!row) return;
      updateRowWeek(row);
      setRowStatus(row, "Pendiente", "warning");
      clearMessages();
    });
    rowsContainer.addEventListener("change", (event) => {
      const row = event.target.closest("tr");
      if (!row) return;
      updateRowWeek(row);
      setRowStatus(row, "Pendiente", "warning");
      clearMessages();
    });
    rowsContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-bulk-row]");
      if (!button) return;
      button.closest("tr")?.remove();
      clearMessages();
    });

    addRow();
    addRow();
  }

  function initOperationDrawer() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;
    const drawerHead = qs(".drawer-head", drawer);
    const drawerTitle = qs("h3", drawerHead);
    const drawerDescription = qs("p", drawerHead);
    const drawerBody = qs(".drawer-body", drawer);
    const closeButton = qs("#closeDetail");
    const originalTitle = drawerTitle?.textContent || "Detalle de programación";
    const originalDescription = drawerDescription?.textContent || "Consulta lateral de la programación.";
    const operationIdsByPlate = {
      "TRK-421": "OP-001",
      "CAM-101": "OP-002",
      "CMN-204": "OP-003",
      "CAM-102": "OP-004",
      "TRK-422": "OP-005"
    };
    let currentRow = null;
    let lastTrigger = null;
    let visibleTrigger = null;
    document.addEventListener("click", (event) => {
      const target = event.target.closest?.('[data-sial-component="Table"] button[aria-label="Visualizar programacion"]');
      if (target) visibleTrigger = target;
    }, true);
    let wasOpen = drawer.classList.contains("show");
    new MutationObserver(() => {
      const isOpen = drawer.classList.contains("show");
      if (wasOpen && !isOpen && visibleTrigger?.isConnected) {
        const target = visibleTrigger;
        requestAnimationFrame(() => requestAnimationFrame(() => target.focus()));
      }
      wasOpen = isOpen;
    }).observe(drawer, { attributes: true, attributeFilter: ["class"] });

    const Ticket = window.SIALPrintableTicket;
    if (!Ticket) return;
    drawer.dataset.sialTicketShell = "";
    const detailContent = document.createElement("div");
    detailContent.dataset.sialTicketDetail = "";
    while (drawerBody.firstChild) detailContent.appendChild(drawerBody.firstChild);
    drawerBody.appendChild(detailContent);

    const ticket = Ticket.createPreview({
      id: "operationTicket",
      brand: "SIAL",
      verificationHelp: "Consulte la programación con este código en SIAL.",
      printShell: drawer
    });
    drawerBody.appendChild(ticket.element);

    let ticketActions;

    const formatGeneratedAt = () => new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());

    const getOperationId = (row) => row?.dataset.operationId || operationIdsByPlate[row?.dataset.plate] || "";

    const resetToDetail = () => {
      drawer.dataset.view = "detail";
      ticket.element.hidden = true;
      detailContent.hidden = false;
      if (drawerTitle) drawerTitle.textContent = originalTitle;
      if (drawerDescription) drawerDescription.textContent = originalDescription;
      ticketActions.setMode("detail");
      ticketActions.setPrinting(false);
    };

    const showTicket = () => {
      if (!currentRow) return;
      const operationId = getOperationId(currentRow);
      const vehicle = vehicleData[currentRow.dataset.plate] || {};
      const generatedAt = formatGeneratedAt();
      const verificationCode = `${operationId}-${currentRow.dataset.plate || "SIAL"}`;
      ticket.render({
        ticketId: `TKT-${operationId}`,
        eyebrow: "OPERACIÓN DE TRANSPORTE",
        title: "Ticket de programación",
        meta: `Programación ${operationId} · Versión 1`,
        state: currentRow.dataset.state,
        primaryFields: [
          { label: "Vehículo", value: currentRow.dataset.plate },
          { label: "Tipo", value: currentRow.dataset.vehicleType },
          { label: "Transportadora", value: vehicle.company || "Dato pendiente", wide: true },
          { label: "Conductor", value: currentRow.dataset.driver, wide: true }
        ],
        secondaryFields: [
          { label: "Destino", value: `${currentRow.dataset.destinationType} · ${currentRow.dataset.destination}`, wide: true },
          { label: "Fecha programada", value: currentRow.dataset.date, wide: true },
          { label: "Semana", value: currentRow.dataset.weekLabel },
          { label: "Generado", value: generatedAt }
        ],
        verificationCode,
        footerNote: "Documento operativo · No reemplaza los registros de trazabilidad."
      });
      drawer.dataset.view = "ticket";
      detailContent.hidden = true;
      ticket.element.hidden = false;
      if (drawerTitle) drawerTitle.textContent = "Ticket de programación";
      if (drawerDescription) drawerDescription.textContent = "Vista previa preparada para impresión térmica o PDF.";
      ticketActions.setMode("preview");
      ticketActions.setPrinting(true);
      ticket.focus();
      ticket.play().then(() => ticketActions.setPrinting(false));
    };

    ticketActions = Ticket.createDrawerActions({
      onGenerate: showTicket,
      onBack: () => {
        resetToDetail();
        ticketActions.focusGenerate();
      },
      onPrint: () => {
        ticket.print();
        ticketActions.focusPrint();
      }
    });
    drawer.appendChild(ticketActions.element);

    const close = () => {
      resetToDetail();
      drawer.classList.remove("show");
      backdrop.classList.remove("show");
      lastTrigger?.focus();
    };
    qsa("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = event.target.closest("tr");
        if (!row) return;
        currentRow = row;
        lastTrigger = button;
        resetToDetail();
        qsa("[data-detail-target]").forEach((node) => {
          const key = node.dataset.detailTarget;
          const datasetKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
          node.textContent = row.dataset[datasetKey] || "-";
        });
        const trace = qs("#detailTraceability");
        if (trace) {
          const entries = (row.dataset.traceability || "").split(";").filter(Boolean).map(item => {
            const [title, meta, statusClass] = item.split("|");
            const wrapper = document.createElement("div"); wrapper.className = "license-item";
            const heading = document.createElement("strong"); heading.textContent = title || "-";
            const detail = document.createElement("div"); detail.className = "muted"; detail.textContent = meta || "";
            wrapper.append(heading, detail);
            if (["status-active", "status-inactive", "status-warning"].includes(statusClass)) {
              const status = document.createElement("span"); status.className = `status ${statusClass}`; status.textContent = statusClass.replace("status-", ""); wrapper.append(status);
            }
            return wrapper;
          });
          trace.replaceChildren(...entries);
        }
        const audit = qs("#detailAudit");
        if (audit) {
          const entries = (row.dataset.audit || "").split(";").filter(Boolean).map(item => {
            const [title, meta] = item.split("|");
            const wrapper = document.createElement("div"); wrapper.className = "audit-item";
            const heading = document.createElement("strong"); heading.textContent = title || "-";
            const detail = document.createElement("div"); detail.className = "muted"; detail.textContent = meta || "";
            wrapper.append(heading, detail); return wrapper;
          });
          audit.replaceChildren(...entries);
        }
        const ticketAvailable = Boolean(getOperationId(row) && row.dataset.date && row.dataset.date !== "--");
        ticketActions.setAvailability(
          ticketAvailable,
          "Esta fila no corresponde a una programación persistida; no hay ticket para imprimir."
        );
        drawer.classList.add("show");
        backdrop.classList.add("show");
        closeButton?.focus();
      });
    });
    closeButton?.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("show")) close();
    });
  }

  function initTableFilters(config) {
    if (window.SIALCore?.initTableFilters) {
      window.SIALCore.initTableFilters(config);
      return;
    }
    const rows = qsa(config.rowSelector);
    const search = qs(config.search);
    const status = qs(config.status);
    const context = qs(config.context);
    const extraFilters = (config.extraFilters || []).map((item) => ({ ...item, control: qs(item.select) }));
    const empty = qs(config.empty);
    const count = qs(config.count);

    function filterRows() {
      const term = (search?.value || "").trim().toLowerCase();
      const state = status?.value || "all";
      const ctx = context?.value || "all";
      let visible = 0;
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        const stateOk = state === "all" || row.dataset.status === state;
        const ctxOk = ctx === "all" || row.dataset.context === ctx;
        const extraOk = extraFilters.every(({ control, datasetKey }) => {
          const value = control?.value || "all";
          return value === "all" || row.dataset[datasetKey] === value;
        });
        const show = (!term || text.includes(term)) && stateOk && ctxOk && extraOk;
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      if (empty) empty.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} registros visibles`;
    }
    [search, status, context, ...extraFilters.map((item) => item.control)].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    filterRows();
  }

  return { applyShell, initOperationForm, initBulkVehicleScheduling, initOperationDrawer, initTableFilters, hydrateOperationList, setFieldState, calculateOperationWeek };
})();





