(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const notices = [
    {
      id: "AC-2026-032", week: "SEM-2026-32", type: "Inicial", version: "Sin versión",
      status: "Publicado", group: "published", farms: 3, pallets: 38, boxes: 2004, canCorrect: true, operationalStage: "Preoperativa",
      updated: "Hoy, 10:24", owner: "Laura Gómez", note: "Sin novedades pendientes.",
      history: ["Publicado hoy a las 10:24", "Validado hoy a las 10:18", "Creado ayer a las 16:42"]
    },
    {
      id: "BOR-2026-033-01", week: "SEM-2026-32", type: "Inicial", version: "Borrador",
      status: "Borrador incompleto", group: "draft", farms: 2, pallets: 20, boxes: 1040,
      updated: "Hoy, 08:42", owner: "Carlos Mejía", note: "Falta confirmar una referencia antes de validar.",
      history: ["Guardado hoy a las 08:42", "Loading Plan cargado hoy a las 08:36"]
    },
    {
      id: "AC-2026-031-02", week: "SEM-2026-31", type: "Proyectado", version: "Versión 2",
      status: "Publicado", group: "published", farms: 5, pallets: 86, boxes: 4572, canCorrect: false, operationalStage: "Programación iniciada",
      blockedReason: "La programación de transporte ya inició. La versión se conserva en consulta.",
      updated: "Ayer, 16:20", owner: "Laura Gómez", note: "Versión proyectada distribuida sin novedades.",
      history: ["Publicado ayer a las 16:20", "Validado ayer a las 16:12"]
    },
    {
      id: "AC-2026-031-01", week: "SEM-2026-31", type: "Modificación", version: "Versión 1",
      status: "Requiere modificación", group: "attention", farms: 4, pallets: 64, boxes: 3456, canCorrect: true, operationalStage: "Preoperativa",
      updated: "Ayer, 14:05", owner: "Mónica Salas", note: "Una referencia quedó inactiva después de la publicación.",
      history: ["Bloqueo detectado ayer a las 14:05", "Publicado el 28/07/2026 a las 11:30"]
    },
    {
      id: "BOR-2026-032-02", week: "SEM-2026-32", type: "Proyectado", version: "Borrador",
      status: "Por conciliar", group: "attention", farms: 3, pallets: 31, boxes: 1674,
      updated: "28/07/2026, 15:48", owner: "Carlos Mejía", note: "El Loading Plan tiene 420 cajas pendientes por asignar.",
      history: ["Comparación actualizada el 28/07/2026", "Borrador creado el 28/07/2026"]
    },
    {
      id: "AC-2026-030-01", week: "SEM-2026-30", type: "Inicial", version: "Sin versión",
      status: "Cerrado", group: "published", farms: 6, pallets: 102, boxes: 5508, canCorrect: false, operationalStage: "Cerrada",
      blockedReason: "La operación ya fue cerrada. Solo está disponible para trazabilidad.",
      updated: "24/07/2026, 17:10", owner: "Laura Gómez", note: "Semana cerrada. Consulta disponible para trazabilidad.",
      history: ["Semana cerrada el 24/07/2026", "Publicado el 20/07/2026"]
    }
  ];

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const number = (value) => Number(value || 0).toLocaleString("es-CO");
  const statusClass = (group, status) => {
    if (group === "attention") return "status-inactive";
    if (group === "draft") return "status-warning";
    return status === "Cerrado" ? "status-inactive" : "status-active";
  };

  function init() {
    const refs = {
      body: qs("[data-hub-body]"),
      search: qs("[data-hub-search]"),
      view: qs("[data-hub-view]"),
      week: qs("[data-hub-week]"),
      type: qs("[data-hub-type]"),
      clear: qs("[data-hub-clear]"),
      empty: qs("[data-hub-empty]"),
      resultCount: qs("[data-hub-result-count]"),
      pagination: qs(".table-pagination")
    };
    if (!refs.body) return;


    let page = 1;
    let pageSize = 10;
    // Escenario aislado para comprobar varias páginas sin alterar la bandeja habitual.
    if (new URLSearchParams(location.search).get("escenario") === "volumen") {
      const sample = [...notices];
      for (let i = 0; i < 18; i++) notices.push({ ...sample[i % sample.length], id: `DEMO-${String(i + 1).padStart(3, "0")}` });
    }
    const actionFor = (item) => {
      if (item.group === "draft" || item.version === "Borrador") return { label: "Continuar", mode: "editar" };
      if (item.canCorrect) return { label: item.group === "attention" ? "Modificar" : "Preparar modificación", mode: "corregir" };
      return { label: "Consultar", mode: "consultar" };
    };

    const filtered = () => {
      const term = refs.search.value.trim().toLowerCase();
      const activeView = refs.view.value;
      return notices.filter((item) => {
        const matchesView = activeView === "all"
          || (activeView === "draft" ? item.version === "Borrador" : item.group === activeView);
        const matchesWeek = refs.week.value === "all" || item.week === refs.week.value;
        const matchesType = refs.type.value === "all" || item.type === refs.type.value;
        const haystack = [item.id, item.week, item.owner, item.status, item.type].join(" ").toLowerCase();
        return matchesView && matchesWeek && matchesType && (!term || haystack.includes(term));
      });
    };

    const rowHtml = (item) => {
      const action = actionFor(item);
      const actionUrl = `crear-aviso-corte.html?modo=${encodeURIComponent(action.mode)}&aviso=${encodeURIComponent(item.id)}`;
      const detailUrl = `consultar-aviso-corte.html?aviso=${encodeURIComponent(item.id)}`;
      const editAction = action.mode === "consultar" ? "" : `
              <a class="icon-btn" href="${actionUrl}" aria-label="${esc(action.label)} ${esc(item.id)}" title="${esc(action.label)}">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
              </a>`;
      return `
        <tr data-hub-row="${esc(item.id)}">
          <td>
            <a class="cut-hub-code" href="${detailUrl}">${esc(item.id)}</a>
            <span class="cut-hub-meta">${esc(item.owner)}</span>
          </td>
          <td><strong>${esc(item.week)}</strong></td>
          <td><strong>${esc(item.type)}</strong><span class="cut-hub-meta">${esc(item.version)}</span></td>
          <td>
            <div class="cut-hub-scope">
              <span><strong>${number(item.farms)}</strong> fincas</span>
              <span><strong>${number(item.pallets)}</strong> palés</span>
              <span><strong>${number(item.boxes)}</strong> cajas</span>
            </div>
          </td>
          <td><span class="status ${statusClass(item.group, item.status)}" data-sial-chip-adapter>${esc(item.status)}</span></td>
          <td><strong>${esc(item.updated)}</strong><span class="cut-hub-meta">${esc(item.note)}</span></td>
          <td>
            <div class="row-actions cut-hub-row-actions">
              <a class="icon-btn" href="${detailUrl}" aria-label="Consultar ${esc(item.id)}" title="Consultar aviso">
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </a>
              ${editAction}
            </div>
          </td>
        </tr>`;
    };

    function render() {
      const visible = filtered();
      page = Math.max(1, Math.min(page, Math.ceil(visible.length / pageSize) || 1));
      refs.body.innerHTML = visible.slice((page - 1) * pageSize, page * pageSize).map(rowHtml).join("");
      if (refs.pagination) {
        Object.assign(refs.pagination.dataset, { sialPage: String(page), sialPageSize: String(pageSize), sialTotal: String(visible.length) });
        refs.pagination.dispatchEvent(new CustomEvent("sial:table-page-state", { detail: { page, pageSize, total: visible.length } }));
      }
      refs.empty.classList.toggle("is-hidden", visible.length > 0);
      qs(".cut-hub-table-wrap").classList.toggle("is-hidden", visible.length === 0);
      refs.resultCount.textContent = `${visible.length} ${visible.length === 1 ? "aviso visible" : "avisos visibles"}`;
      refs.clear.classList.toggle("is-hidden", !refs.search.value && refs.view.value === "all" && refs.week.value === "all" && refs.type.value === "all");
    }

    function clearFilters() {
      refs.search.value = "";
      refs.view.value = "all";
      refs.week.value = "all";
      refs.type.value = "all";
      [refs.search, refs.view, refs.week, refs.type].forEach((control) => {
        control.dispatchEvent(new Event(control === refs.search ? "input" : "change", { bubbles: true }));
      });
      render();
    }

    [refs.search, refs.view, refs.week, refs.type].forEach((control) => control.addEventListener(control === refs.search ? "input" : "change", () => { page = 1; render(); }));
    refs.pagination?.addEventListener("sial:table-page-request", (event) => { page = event.detail.page; render(); });
    refs.pagination?.addEventListener("sial:table-page-size-request", (event) => { pageSize = event.detail.pageSize; page = 1; render(); });
    refs.clear.addEventListener("click", clearFilters);
    qs("[data-hub-empty-clear]")?.addEventListener("click", clearFilters);

    render();
  }

  window.SIALCutNoticeList = { init };
})();
