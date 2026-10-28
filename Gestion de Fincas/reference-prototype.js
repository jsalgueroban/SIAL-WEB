/* Persistencia local de la propuesta; no constituye un contrato de producto. */
const ReferencePrototype = (() => {
  const key = "sial-farm-references-v1";
  const seed = [
    { code: "REF-BAN-001", version: 4, name: "BANANO EXPORTACION 54 CAJAS", type: "BANANO", classRef: "EXPORTACION LARGA", netMin: "18.5", netMax: "19.2", state: "active", audit: ["Copia de v3 - calidad · 26/04/2026 15:12", "Nueva version - ing.master · 27/04/2026 09:30"] },
    { code: "REF-PLT-008", version: 2, name: "PLATANO INDUSTRIAL 48 CAJAS", type: "PLATANO", classRef: "INDUSTRIAL CORTA", netMin: "16.0", netMax: "16.6", state: "warning", audit: ["Crear - calidad · 24/04/2026 10:40", "Copia de v1 - calidad · 26/04/2026 15:12"] }
  ];
  const fields = { refCode: "code", refVersion: "version", refName: "name", fruitType: "type", classRef: "classRef", grossMin: "grossMin", grossMax: "grossMax", netMin: "netMin", netMax: "netMax", factor: "factor", boxes: "boxes" };
  const read = () => {
    try { const saved = JSON.parse(localStorage.getItem(key)); return Array.isArray(saved) ? saved : seed; }
    catch { return seed; }
  };
  const write = (items) => localStorage.setItem(key, JSON.stringify(items));
  const find = (items, code, version) => items.find((item) => item.code === code && Number(item.version) === Number(version));
  const dispatch = (element) => element.dispatchEvent(new Event(element.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
  const date = () => new Date().toLocaleString("es-CO");

  function fill(source, mode) {
    Object.entries(fields).forEach(([id, keyName]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const value = mode === "copiar" && id === "refCode" ? ""
        : mode === "copiar" && id === "refVersion" ? "1"
        : mode === "versionar" && id === "refVersion" ? String(Math.max(Number(source.version), ...read().filter((item) => item.code.toLocaleUpperCase("es") === source.code.toLocaleUpperCase("es")).map((item) => Number(item.version) || 0)) + 1)
        : String(source[keyName] ?? "");
      input.value = value;
      dispatch(input);
    });
  }

  // Catálogos locales de la propuesta. La referencia histórica conserva su asignación
  // al versionar; en una copia o alta solo se ofrecen registros activos.
  function syncCatalogs(historical) {
    const configs = [
      { id: "fruitType", key: "sial-farm-catalog-productos", fallback: [{ name: "BANANO", active: true }, { name: "AGUACATE", active: true }], old: historical?.type, label: (item) => item.name, placeholder: "Selecciona tipo" },
      { id: "classRef", key: "sial-farm-reference-classes", fallback: [{ name: "EXPORTACION", size: "LARGA", active: true }, { name: "INDUSTRIAL", size: "CORTA", active: false }], old: historical?.classRef, label: (item) => `${item.name} ${item.size}`, placeholder: "Selecciona clase" }
    ];
    configs.forEach(({ id, key: catalogKey, fallback, old, label, placeholder }) => {
      let saved;
      try { saved = JSON.parse(localStorage.getItem(catalogKey)); } catch { saved = null; }
      const items = Array.isArray(saved) ? saved : fallback;
      const select = document.getElementById(id);
      if (!select) return;
      select.replaceChildren(new Option(placeholder, ""));
      const available = new Set();
      items.forEach((item) => {
        const name = label(item);
        if (!item.active && name !== old) return;
        select.add(new Option(item.active ? name : `${name} (asignación anterior inactiva)`, name));
        available.add(name);
      });
      if (old && !available.has(old)) select.add(new Option(`${old} (asignación anterior)`, old));
    });
  }

  function showFieldError(id, message) {
    const input = document.getElementById(id);
    const note = input && document.getElementById(input.getAttribute("aria-describedby"));
    if (!input || !note) return;
    input.setAttribute("aria-invalid", "true");
    input.classList.add("is-error");
    note.classList.remove("success");
    note.classList.add("error");
    note.textContent = message;
    const visible = input.closest("[data-sial-form-control]")?.querySelector(".sial-library-field input, .sial-library-field select");
    (visible || input).focus();
  }

  function showFormError(message) {
    let feedback = document.getElementById("formOk");
    if (!feedback) {
      feedback = document.createElement("div");
      feedback.id = "formOk";
      feedback.className = "reference-list-error";
      document.querySelector(".card-header")?.insertAdjacentElement("afterend", feedback);
    }
    feedback.textContent = message;
    feedback.classList.remove("is-hidden");
    feedback.classList.add("reference-form-error");
    feedback.setAttribute("role", "alert");
  }

  function form() {
    const params = new URLSearchParams(location.search);
    const requestedMode = params.get("modo");
    const source = find(read(), params.get("codigo"), params.get("version"));
    let copySource = requestedMode === "copiar" ? source : null;
    const selector = document.getElementById("copyFrom");
    const formElement = document.querySelector("[data-generic-form]");
    if (!formElement) return;

    syncCatalogs(requestedMode === "versionar" ? source : null);
    if (requestedMode === "copiar" || requestedMode === "versionar") {
      if (!source) {
        showFormError("No se encontró la referencia solicitada.");
        formElement.querySelector('[type="submit"]').disabled = true;
        return;
      }
      fill(source, requestedMode);
      document.querySelector(".page-title").textContent = requestedMode === "copiar" ? "Copiar referencia" : "Nueva versión de referencia";
    }

    if (selector) {
      selector.replaceChildren(new Option("Crear desde cero", ""));
      read().forEach((item) => selector.add(new Option(`${item.code} v${item.version}`, `${item.code}|${item.version}`)));
      if (copySource) selector.value = `${copySource.code}|${copySource.version}`;
      if (requestedMode === "versionar") {
        selector.disabled = true;
      } else {
        selector.addEventListener("change", () => {
          const [code, version] = selector.value.split("|");
          copySource = find(read(), code, version) || null;
          if (copySource) fill(copySource, "copiar");
          else fill({}, "nuevo");
        });
      }
    }

    formElement.addEventListener("submit", () => {
      const feedback = document.getElementById("formOk");
      feedback.classList.remove("reference-form-error");
      feedback.setAttribute("role", "status");
      if (feedback.classList.contains("is-hidden")) return;
      const values = {};
      Object.entries(fields).forEach(([id, keyName]) => { values[keyName] = document.getElementById(id).value.trim(); });
      values.version = Number(values.version);
      const all = read();
      const previous = all.filter((item) => item.code.toLocaleUpperCase("es") === values.code.toLocaleUpperCase("es"));
      if (requestedMode === "versionar" && values.code.toLocaleUpperCase("es") !== source.code.toLocaleUpperCase("es")) {
        feedback.classList.add("is-hidden");
        showFieldError("refCode", "La nueva versión debe conservar el código de la referencia original.");
        return;
      }
      if (!Number.isInteger(values.version) || values.version < 1 || previous.some((item) => Number(item.version) >= values.version)) {
        feedback.classList.add("is-hidden");
        showFieldError("refVersion", "Ingresa una versión entera mayor que las versiones existentes para este código.");
        return;
      }
      values.state = "active";
      const action = requestedMode === "versionar" ? "Nueva versión" : copySource ? `Crear desde copia de ${copySource.code} v${copySource.version}` : "Crear referencia";
      values.audit = [...(requestedMode === "versionar" && source ? source.audit : []), `${action} · ${date()}`];
      try { write([values, ...all]); }
      catch { showFormError("No fue posible guardar la referencia en este navegador. Inténtalo de nuevo."); return; }
      location.href = "gestion-referencias.html";
    });
  }

  function list() {
    const body = document.querySelector(".table-wrap tbody");
    const template = body?.querySelector("tr");
    if (!body || !template) return;
    body.replaceChildren();
    read().forEach((initial) => {
      let record = initial;
      const row = template.cloneNode(true);
      const cells = row.querySelectorAll("td");
      const actions = cells[8];
      const buttons = actions.querySelectorAll("button");
      const links = actions.querySelectorAll("a");
      const refresh = () => {
        const label = record.state === "active" ? "Activo" : record.state === "inactive" ? "Inactivo" : "Revisión";
        Object.assign(row.dataset, { status: record.state, context: record.type, code: record.code, version: String(record.version), name: record.name, type: record.type, class: record.classRef, weight: `${record.netMin} - ${record.netMax}`, state: label, audit: record.audit.map((entry) => entry.replace(" · ", "|")).join(";") });
        [record.code, String(record.version), record.name, record.type, record.classRef, `${record.netMin} - ${record.netMax}`].forEach((value, index) => { cells[index].textContent = value; });
        const chip = cells[6].querySelector(".status");
        chip.className = `status status-${record.state}`;
        chip.textContent = label;
        cells[7].textContent = record.audit.at(-1) || "—";
        buttons[0].setAttribute("aria-label", `Visualizar referencia ${record.code} version ${record.version}`);
        links[0].href = `registro-referencia.html?modo=versionar&codigo=${encodeURIComponent(record.code)}&version=${record.version}`;
        links[1].href = `registro-referencia.html?modo=copiar&codigo=${encodeURIComponent(record.code)}&version=${record.version}`;
        links[0].setAttribute("aria-label", `Editar referencia ${record.code} version ${record.version}`);
        links[1].setAttribute("aria-label", `Copiar referencia ${record.code} version ${record.version}`);
        buttons[1].setAttribute("aria-label", `${record.state === "inactive" ? "Activar" : "Inactivar"} referencia ${record.code} version ${record.version}`);
      };
      buttons[1].addEventListener("click", () => {
        const current = find(read(), record.code, record.version);
        if (!current) return;
        const updated = { ...current, state: current.state === "inactive" ? "active" : "inactive", audit: [...current.audit, `${current.state === "inactive" ? "Activar" : "Inactivar"} referencia · ${date()}`] };
        try { write(read().map((item) => item.code === current.code && Number(item.version) === Number(current.version) ? updated : item)); }
        catch { showFormError("No fue posible actualizar el estado en este navegador."); return; }
        record = updated;
        refresh();
        document.getElementById("refSearch")?.dispatchEvent(new Event("input", { bubbles: true }));
        requestAnimationFrame(() => {
          const label = buttons[1].getAttribute("aria-label");
          const nextAction = Array.from(document.querySelectorAll(".sial-library-table button[aria-label]"))
            .find((element) => element.getAttribute("aria-label") === label && element.getClientRects().length);
          const search = document.querySelector(".sial-library-search input");
          (nextAction || search)?.focus();
        });
      });
      refresh();
      body.append(row);
    });
  }
  return { form, list };
})();
