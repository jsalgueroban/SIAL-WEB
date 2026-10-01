const SIAL = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function applyShell(activeKey) {
    if (window.SIALCore?.initShell) {
      window.SIALCore.initShell({ area: "gestion", module: "trazabilidad", view: activeKey || "auditoria" });
      return;
    }
    window.SIALCore?.initThemeToggle?.();
    const nav = qs("[data-nav]");
    if (!nav) return;
    const items = [
      ["auditoria", "auditoria-operativa.html", "Auditoria operativa"],
      ["poma", "generar-documento-poma.html", "Generar POMA"]
    ];
    nav.innerHTML = items.map(([key, href, label]) =>
      `<a class="nav-link ${key === activeKey ? "active" : ""}" href="${href}"><svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg><span>${label}</span></a>`
    ).join("");
  }

  function setFieldState(input, note, error, successText) {
    if (!input || !note) return;
    input.classList.toggle("is-error", Boolean(error));
    input.setAttribute("aria-invalid", error ? "true" : "false");
    note.classList.toggle("error", Boolean(error));
    note.classList.toggle("success", !error && Boolean(successText));
    note.textContent = error || successText || note.dataset.base || note.textContent;
  }

  function initTableFilters(config) {
    if (window.SIALCore?.initTableFilters) { window.SIALCore.initTableFilters(config); return; }
    const rows = qsa(config.rowSelector);
    const search = qs(config.search);
    const status = qs(config.status);
    const empty = qs(config.empty);
    const count = qs(config.count);
    function filterRows() {
      const term = (search?.value || "").trim().toLowerCase();
      const state = status?.value || "all";
      let visible = 0;
      rows.forEach((row) => {
        const show = (!term || row.textContent.toLowerCase().includes(term)) && (state === "all" || row.dataset.status === state);
        row.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      empty?.classList.toggle("show", visible === 0);
      if (count) count.textContent = `${visible} registros visibles`;
    }
    [search, status].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", filterRows);
    });
    filterRows();
  }

  function initDrawer() {
    const drawer = qs("#detailDrawer");
    const backdrop = qs("#detailBackdrop");
    if (!drawer || !backdrop) return;
    const close = () => { drawer.classList.remove("show"); backdrop.classList.remove("show"); };
    qsa("[data-open-detail]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const row = event.target.closest("tr");
        if (!row) return;
        qsa("[data-detail-target]").forEach((node) => {
          node.textContent = row.dataset[node.dataset.detailTarget] || "-";
        });
        const audit = qs("#detailAudit");
        if (audit) {
          audit.innerHTML = (row.dataset.audit || "").split(";").filter(Boolean).map((item) => {
            const [title, meta] = item.split("|");
            return `<div class="audit-item"><strong>${title || "-"}</strong><div class="muted">${meta || ""}</div></div>`;
          }).join("");
        }
        drawer.classList.add("show");
        backdrop.classList.add("show");
        qs("#closeDetail")?.focus();
      });
    });
    qs("#closeDetail")?.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  }

  function initEmbeddedForm(config = {}) {
    const panel = qs(config.panel || "[data-inline-form-panel]");
    const openButton = qs(config.openButton || "[data-open-inline-form]");
    const cancelButton = qs(config.cancelButton || "[data-cancel-inline-form]");
    const title = qs(config.title || "[data-inline-form-title]");
    const form = panel?.querySelector("form");
    if (!panel || !openButton) return;
    const open = (mode = "new") => {
      panel.classList.remove("is-hidden");
      openButton.setAttribute("aria-expanded", "true");
      if (title) title.textContent = mode === "edit" ? config.editTitle || "Editar registro" : config.newTitle || "Nuevo registro";
      panel.querySelector("input:not([readonly]), select, textarea")?.focus();
    };
    const close = () => {
      panel.classList.add("is-hidden");
      openButton.setAttribute("aria-expanded", "false");
      form?.reset();
      openButton.focus();
    };
    openButton.addEventListener("click", () => open("new"));
    cancelButton?.addEventListener("click", close);
    qsa(config.editButtons || "[data-edit-inline]").forEach((button) => button.addEventListener("click", () => open("edit")));
  }

  function initCatalogForm(config = {}) {
    const form = qs(config.form || "[data-catalog-form]");
    if (!form) return;
    const ok = qs("#formOk");
    const existingNames = (config.existingNames || "").split("|").map((item) => item.trim().toUpperCase()).filter(Boolean);
    qsa("[data-uppercase]", form).forEach((input) => input.addEventListener("input", (event) => { event.target.value = event.target.value.toUpperCase(); }));
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let fail = false;
      qsa("[data-required]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (note && !note.dataset.base) note.dataset.base = note.textContent;
        const empty = !String(input.value || "").trim();
        setFieldState(input, note, empty ? "Este campo es obligatorio." : "", "Dato validado.");
        if (empty) fail = true;
      });
      qsa("[data-unique-name]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        const value = input.value.trim().toUpperCase();
        if (value && existingNames.includes(value)) {
          setFieldState(input, note, "El nombre ya existe en la tabla maestra.", "");
          fail = true;
        }
      });
      qsa("[data-positive-number]", form).forEach((input) => {
        const note = qs(`#${input.getAttribute("aria-describedby")}`);
        if (input.value && Number(input.value) <= 0) {
          setFieldState(input, note, "Debe ser un valor numerico mayor a cero.", "");
          fail = true;
        }
      });
      ok?.classList.toggle("is-hidden", fail);
    });
  }



  const auditEvents = [
    { id: "AUD-TR-001", source: "web", sourceLabel: "Transporte web", operation: "OP-003", vehicle: "CMN-204", container: "--", type: "PROGRAMACION", phase: "Transporte", event: "Programacion de vehiculo", user: "admin.operaciones", at: "2026-06-18T09:00:00", location: "Puerto Cartagena", status: "PROGRAMADO", severity: "warning", sync: "Sincronizado", summary: "Programacion futura generada desde Transporte.", evidence: [], controls: ["Vehiculo|Asignado|CMN-204 disponible para semana operativa.|0", "Conductor|Asignado|Carlos Mendoza asociado a la programacion.|0"], comments: ["Sistema|18/06/2026 09:00|operationWeek derivado desde scheduledAt."], novelties: [], signatures: [], trace: ["Programacion futura|18/06/2026 09:00|warning", "Semana 2026-W26|Derivada desde fecha programada|active"], meta: ["scheduledAt: 2026-06-22T09:00", "operationWeek derivado", "Origen: Transporte web"] },
    { id: "AUD-MO-001", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "RECEPCION", phase: "ZE", event: "Recepcion vehiculo en ZE", user: "Maria Operadora", at: "2026-05-05T08:15:00", location: "ZE Puerto Norte", status: "RECIBIDO_EN_ZE", severity: "success", sync: "Sincronizado", summary: "Inicio de trazabilidad movil con vehiculo, contenedor y conductor confirmados.", evidence: ["EV-001|Placa vehiculo|Foto|OK|Recepcion|Maria Operadora|05/05/2026 08:13|Placa TUL458 visible.", "EV-002|Contenedor asociado|Foto|OK|Recepcion|Maria Operadora|05/05/2026 08:14|SIALU1234567 confirmado."], controls: ["Vehiculo|SIN_NOVEDAD|Placa y conductor coinciden con la programacion.|1", "Contenedor|SIN_NOVEDAD|Contenedor disponible en ZE.|1"], comments: ["Maria Operadora|05/05/2026 08:15|Recepcion sin novedades visibles."], novelties: [], signatures: [], trace: ["Recepcion ZE|05/05/2026 08:15|active", "Operacion activa|EXP-2026-0418|active"], meta: ["auditEventId: AUD-MO-001", "eventIdempotencyKey: EXP-2026-0418_zeReception", "syncStatus: SYNCED"] },
    { id: "AUD-MO-002", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "INSPECCION_EXTERNA", phase: "ZE", event: "Inspeccion externa ZE", user: "Maria Operadora", at: "2026-05-05T09:05:00", location: "ZE Puerto Norte", status: "APTO_CON_NOVEDAD", severity: "error", sync: "Pendiente de sincronizar", summary: "Inspeccion externa con novedad y evidencia pendiente por confirmar en backend.", evidence: ["EV-101|Fruta y empaque|Foto|OK|Fruta y empaque|Maria Operadora|05/05/2026 09:01|Fruta y empaque visibles sin novedad.", "EV-102|Empaque|Foto|Con novedad|Empaque|Maria Operadora|05/05/2026 09:02|Empaque con punto para revision.", "EV-103|Cargue a carro|Foto|OK|Cargue a carro|Maria Operadora|05/05/2026 09:03|Cargue en proceso registrado.", "EV-104|Cargue de contenedor a vehiculo|Foto|Con novedad|Cargue de contenedor a vehiculo|Maria Operadora|05/05/2026 09:04|Validar alineacion del cargue."], controls: ["Fruta y empaque|SIN_NOVEDAD|Producto y empaque visibles sin novedad.|1", "Empaque|CON_NOVEDAD|Empaque requiere revision visual.|1", "Cargue a carro|SIN_NOVEDAD|Cargue en proceso registrado.|1", "Cargue de contenedor a vehiculo|CON_NOVEDAD|Validar alineacion del cargue.|1"], comments: ["Maria Operadora|05/05/2026 09:05|Se deja novedad para revision de seguridad antes del despacho.", "Supervisor ZE|05/05/2026 09:12|Priorizar validacion de empaque y cargue cuando sincronice."], novelties: ["Empaque con revision pendiente.", "Cargue con validacion visual pendiente.", "Evento aun pendiente de sincronizacion."], signatures: [], trace: ["Recepcion ZE|05/05/2026 08:15|active", "Inspeccion externa|05/05/2026 09:05|warning", "Alerta automatica|APTO_CON_NOVEDAD|inactive"], meta: ["auditEventId: AUD-MO-002", "syncStatus: LOCAL_PENDING_SYNC", "Fotos requeridas: 14", "Resultado inspeccion: APTO_CON_NOVEDAD"] },
    { id: "AUD-MO-003", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "INSPECCION_INTERNA", phase: "ZE", event: "Inspeccion interna ZE", user: "Maria Operadora", at: "2026-05-05T09:45:00", location: "ZE Puerto Norte", status: "APTO", severity: "success", sync: "Sincronizado", summary: "Checklist interno completado con evidencias obligatorias principales.", evidence: ["EV-201|Cargue de contenedor a vehiculo|Foto|OK|Cargue de contenedor a vehiculo|Maria Operadora|05/05/2026 09:40|Cargue controlado sin novedad.", "EV-202|Limpieza de banano|Foto|OK|Limpieza de banano|Maria Operadora|05/05/2026 09:42|Producto limpio y disponible para continuar.", "EV-203|Cargue de pallet al vehiculo|Foto|OK|Cargue de pallet al vehiculo|Maria Operadora|05/05/2026 09:43|Pallet cargado y asegurado."], controls: ["Cargue de contenedor a vehiculo|SIN_NOVEDAD|Cargue controlado sin novedad.|1", "Limpieza de banano|SIN_NOVEDAD|Producto limpio y disponible para continuar.|1", "Cargue de pallet al vehiculo|SIN_NOVEDAD|Pallet cargado y asegurado.|1"], comments: ["Maria Operadora|05/05/2026 09:45|Interior apto para continuar flujo."], novelties: [], signatures: [], trace: ["Inspeccion externa|05/05/2026 09:05|warning", "Inspeccion interna|05/05/2026 09:45|active"], meta: ["auditEventId: AUD-MO-003", "syncStatus: SYNCED", "Resultado inspeccion: APTO"] },
    { id: "AUD-MO-004", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "RESPONSABILIDAD", phase: "Finca", event: "Sesion de responsabilidad", user: "Laura Pineda", at: "2026-05-05T11:30:00", location: "Finca Santa Isabel", status: "RESPONSABILIDAD_CAPTURADA", severity: "success", sync: "Sincronizado", summary: "Responsables de finca y conductor registrados antes del cargue.", evidence: ["EV-301|Firma conductor|Firma|OK|Responsabilidad|Laura Pineda|05/05/2026 11:29|Firma asociada a Carlos Mendoza."], controls: ["Conductor|FIRMADO|Carlos Mendoza confirma responsabilidad.|0", "Supervisor finca|FIRMADO|Laura Pineda confirma recepcion.|0"], comments: ["Laura Pineda|05/05/2026 11:30|Responsabilidad aceptada antes de cargue."], novelties: [], signatures: ["Conductor: Carlos Mendoza", "Supervisor finca: Laura Pineda"], trace: ["Recepcion finca|05/05/2026 10:58|active", "Responsabilidad|05/05/2026 11:30|active"], meta: ["auditEventId: AUD-MO-004", "syncStatus: SYNCED", "responsibilitySessionId: RESP-0418"] },
    { id: "AUD-MO-005", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "CIERRE", phase: "Finca", event: "Cierre de contenedor", user: "Laura Pineda", at: "2026-05-05T14:05:00", location: "Finca Santa Isabel", status: "CONTENEDOR_CERRADO", severity: "success", sync: "Sincronizado", summary: "Cierre con pallets cargados, sellos validados y evidencia final.", evidence: ["EV-401|Contenedor cerrado|Foto|OK|Cierre|Laura Pineda|05/05/2026 14:01|Puertas cerradas.", "EV-402|Sello final|Foto|OK|Sellos|Laura Pineda|05/05/2026 14:03|Sello validado."], controls: ["Pallets cargados|12|Cantidad confirmada.|0", "Sellos|SIN_NOVEDAD|Sello final conforme.|1"], comments: ["Laura Pineda|05/05/2026 14:05|Contenedor cerrado y listo para despacho."], novelties: [], signatures: ["Supervisor finca: Laura Pineda"], trace: ["Pallets cargados|05/05/2026 12:25|active", "Cierre contenedor|05/05/2026 14:05|active"], meta: ["auditEventId: AUD-MO-005", "Pallets cargados: 12", "syncStatus: SYNCED"] },
    { id: "AUD-MO-006", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0418", vehicle: "TUL458", container: "SIALU1234567", type: "ENTREGA", phase: "Puerto", event: "Entrega final en puerto", user: "Maria Operadora", at: "2026-05-05T18:10:00", location: "Puerto Cartagena", status: "EXPORTADO", severity: "success", sync: "Sincronizado", summary: "Entrega final y cierre de trazabilidad operativa.", evidence: ["EV-501|Recepcion puerto|Foto|OK|Entrega puerto|Maria Operadora|05/05/2026 18:08|Contenedor entregado."], controls: ["Recepcion puerto|SIN_NOVEDAD|Cierre correcto.|1"], comments: ["Maria Operadora|05/05/2026 18:10|Operacion cerrada en puerto."], novelties: [], signatures: [], trace: ["Recepcion puerto|05/05/2026 17:25|active", "Entrega final|05/05/2026 18:10|active"], meta: ["auditEventId: AUD-MO-006", "Vehiculo liberado", "Contenedor exportado"] },
    { id: "AUD-MO-007", source: "mobile", sourceLabel: "Operacion movil", operation: "EXP-2026-0520", vehicle: "XYZ789", container: "SIALB7654321", type: "INSPECCION_EXTERNA", phase: "ZE", event: "Inspeccion externa ZE", user: "Jorge Auditor", at: "2026-06-17T10:18:00", location: "ZE Puerto Norte", status: "NO_APTO", severity: "error", sync: "Error de sincronizacion", summary: "Inspeccion bloqueada por resultado NO_APTO y error de sincronizacion local.", evidence: ["EV-601|Pared lateral izquierda|Foto|Con novedad|Pared lateral izquierda|Jorge Auditor|17/06/2026 10:12|Abolladura visible.", "EV-602|Barras de cierre|Foto|Con novedad|Barras de cierre|Jorge Auditor|17/06/2026 10:15|Mecanismo requiere validacion."], controls: ["Pared lateral izquierda|CON_NOVEDAD|Abolladura visible.|1", "Barras de cierre|CON_NOVEDAD|Mecanismo observado.|1", "Resultado|NO_APTO|Evento bloquea avance operativo.|0"], comments: ["Jorge Auditor|17/06/2026 10:18|No continuar flujo hasta validacion de seguridad.", "Sistema movil|17/06/2026 10:19|Sincronizacion fallida. Registro conserva localId e idempotencyKey."], novelties: ["Resultado NO_APTO.", "Evento bloqueado para flujo siguiente.", "Sync fallida pendiente de reintento."], signatures: [], trace: ["Recepcion ZE|17/06/2026 09:40|active", "Inspeccion externa|17/06/2026 10:18|inactive", "Bloqueo|NO_APTO|inactive"], meta: ["auditEventId: AUD-MO-007", "syncStatus: SYNC_FAILED", "blockedEvent: portExternalInspection", "Resultado inspeccion: NO_APTO"] },
    { id: "AUD-TR-002", source: "web", sourceLabel: "Transporte web", operation: "OP-004-R", vehicle: "CAM-102", container: "--", type: "REPROGRAMACION", phase: "Transporte", event: "Reprogramacion de vehiculo", user: "admin.operaciones", at: "2026-06-19T10:20:00", location: "Puerto Cartagena", status: "REPROGRAMADO", severity: "warning", sync: "Sincronizado", summary: "Nueva programacion vinculada a operacion finalizada, sin modificar historico original.", evidence: [], controls: ["Operacion origen|OP-004|Registro finalizado usado para reprogramacion.|0", "Nuevo registro|OP-004-R|Operacion derivada para planificacion.|0"], comments: ["admin.operaciones|19/06/2026 10:20|Vehiculo finalizado reasignado a nueva operacion."], novelties: ["Nueva programacion vinculada al registro finalizado OP-004."], signatures: [], trace: ["Origen finalizado|OP-004|inactive", "Nueva programacion|19/06/2026 10:20|warning"], meta: ["No edita historico original", "Crea nueva operacion vinculada", "Origen: Transporte web"] }
  ];

  function initAuditTrail() {
    const esc = window.SIALCore?.escapeHtml || ((value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"));
    const norm = window.SIALCore?.normalize || ((value) => String(value || "").trim().toLowerCase());
    const controls = { search: qs("#auditSearch"), year: qs("#auditYear"), week: qs("#auditWeek"), from: qs("#auditFromDate"), to: qs("#auditToDate"), event: qs("#auditEvent"), status: qs("#auditStatus") };
    const workbench = qs("#auditWorkbench");
    const setText = (selector, value) => { const node = qs(selector); if (node) node.textContent = String(value); };
    const emptyText = (text) => `<div class="audit-empty-list">${esc(text)}</div>`;

    const operationContext = {
      "OP-003": { travelOrder: "OV-2026-003", externalZone: "ZE Puerto Cartagena", responsible: "Carlos Mendoza" },
      "OP-004-R": { travelOrder: "OV-2026-004R", externalZone: "ZE Puerto Cartagena", responsible: "admin.operaciones" },
      "EXP-2026-0418": { travelOrder: "OV-2026-0418", externalZone: "ZE Puerto Norte", responsible: "Maria Operadora" },
      "EXP-2026-0520": { travelOrder: "OV-2026-0520", externalZone: "ZE Puerto Norte", responsible: "Jorge Auditor" }
    };
    const statusLabels = {
      APTO: "Apto",
      APTO_CON_NOVEDAD: "Apto con Novedad",
      ASIGNADO: "Asignado",
      CON_NOVEDAD: "Con Novedad",
      CONTENEDOR_CERRADO: "Contenedor Cerrado",
      EXPORTADO: "Exportado",
      FIRMADO: "Firmado",
      LOCAL_PENDING_SYNC: "Pendiente de Sincronizar",
      PENDIENTE_DE_SINCRONIZAR: "Pendiente de Sincronizar",
      ERROR_DE_SINCRONIZACION: "Error de Sincronizacion",
      NO_APTO: "No Apto",
      NO_CAPTURADO_SEGURIDAD: "No Capturado por Seguridad",
      OK: "OK",
      PROGRAMADO: "Programado",
      REPROGRAMADO: "Reprogramado",
      RECIBIDO_EN_ZE: "Recibido en ZE",
      RESPONSABILIDAD_CAPTURADA: "Responsabilidad Capturada",
      SIN_NOVEDAD: "Sin Novedad",
      SYNCED: "Sincronizado",
      SYNC_FAILED: "Error de Sincronizacion"
    };

    const showProposalImages = false;
    const split = (item) => String(item || "").split("|");
    const readEvidence = (item) => { const [id, title, type, status, checkpoint, capturedBy, capturedAt, note, image] = split(item); return { id, title, type, status, checkpoint, capturedBy, capturedAt, note, image: showProposalImages ? image : "" }; };
    const readControl = (item) => { const [name, value, observation, hasPhoto] = split(item); return { name, value, observation, hasPhoto: hasPhoto === "1" }; };
    const readComment = (item) => { const [author, at, text] = split(item); return { author, at, text }; };
    const readTrace = (item) => { const [title, meta, status] = split(item); return { title, meta, status }; };
    const eventTime = (event) => new Date(event.at).getTime() || 0;
    const evidenceCount = (event) => (event.evidence || []).length;
    const formatStatus = (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) return "-";
      const upper = raw.toUpperCase().replace(/\s+/g, "_");
      if (statusLabels[upper]) return statusLabels[upper];
      return raw.replace(/_/g, " ").toLowerCase().split(" ").filter(Boolean).map((word) => word === "ze" ? "ZE" : word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    };
    const formatFreeText = (value) => Object.keys(statusLabels).sort((a, b) => b.length - a.length).reduce((text, key) => text.replaceAll(key, statusLabels[key]), String(value || ""));
    const statusClass = (severity) => severity === "success" ? "status-active" : severity === "error" ? "status-inactive" : "status-warning";
    const syncClass = (sync) => /error|failed|fall/i.test(sync || "") ? "status-inactive" : /pendiente|pending/i.test(sync || "") ? "status-warning" : "status-active";
    const valueClass = (value) => {
      const label = norm(formatStatus(value));
      if (/no apto|con novedad|no capturado|error|bloque/.test(label)) return "status-inactive";
      if (/pendiente|seguimiento|revision/.test(label)) return "status-warning";
      return "status-active";
    };
    const matchKey = (value) => norm(formatFreeText(value)).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    const findControlForEvidence = (evidence, controls) => {
      const candidates = [evidence.checkpoint, evidence.title].map(matchKey).filter(Boolean);
      return controls.find((control) => candidates.some((candidate) => {
        const key = matchKey(control.name);
        return key && (key === candidate || key.includes(candidate) || candidate.includes(key));
      }));
    };
    const formatDate = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? formatFreeText(value) : date.toLocaleString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); };
    const eventApprovals = {};
    const isInspectionEvent = (event) => /^INSPECCION_/i.test(String(event?.type || "")) || /inspeccion/i.test(String(event?.event || ""));
    const approvalEvidenceFor = (event) => (event.evidence || []).map(readEvidence).filter((item) => item.id);
    const requiresHumanApproval = (event) => isInspectionEvent(event) && approvalEvidenceFor(event).length > 0;
    const approvalFor = (event) => eventApprovals[event?.id || ""];
    const approveEventEvidence = (event) => {
      if (!requiresHumanApproval(event)) return;
      if (approvalFor(event)) return;
      const evidence = approvalEvidenceFor(event);
      eventApprovals[event.id] = {
        actor: "QA",
        at: new Date().toISOString(),
        evidenceCount: evidence.length
      };
    };
    const approvalComments = (event) => {
      const approval = approvalFor(event);
      if (!approval) return [];
      return [{
        author: approval.actor,
        at: formatDate(approval.at),
        text: `Aprobacion humana masiva registrada para ${approval.evidenceCount} ${approval.evidenceCount === 1 ? "evidencia" : "evidencias"} del evento ${event.id}.`
      }];
    };
    const treeApprovalMarkup = (event) => {
      if (!requiresHumanApproval(event)) return "";
      const approval = approvalFor(event);
      const approved = Boolean(approval);
      const total = approvalEvidenceFor(event).length;
      return `<div class="audit-tree-approval" data-approval-state="${approved ? "approved" : "pending"}"><span class="status ${approved ? "status-active" : "status-warning"}">${approved ? "Aprobacion completa" : `${total} ${total === 1 ? "evidencia" : "evidencias"}`}</span><button class="btn ${approved ? "btn-secondary" : "btn-primary"} audit-tree-approval-button" type="button" data-approve-inspection-event="${esc(event.id)}" ${approved ? "disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span>${approved ? "Aprobadas" : "Aprobar evidencias"}</span></button></div>`;
    };
    const bindTreeApprovalActions = (root) => {
      qsa("[data-approve-inspection-event]", root || document).forEach((button) => {
        button.addEventListener("click", () => {
          const event = auditEvents.find((item) => item.id === button.dataset.approveInspectionEvent);
          if (!event) return;
          approveEventEvidence(event);
          selectedEventId = event.id;
          selectedEvidenceId = "";
          viewMode = "evidence";
          requestVisualFocus("events");
          renderAll();
        });
      });
    };
    const shortDate = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? formatFreeText(value) : date.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" }); };
    const shortDayMonth = (date) => date.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit" });
    const weekInfo = (value) => {
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      const local = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      const day = local.getDay() || 7;
      const start = new Date(local);
      start.setDate(local.getDate() - day + 1);
      const thursday = new Date(start);
      thursday.setDate(start.getDate() + 3);
      const firstThursday = new Date(thursday.getFullYear(), 0, 4);
      const firstDay = firstThursday.getDay() || 7;
      const firstMonday = new Date(firstThursday);
      firstMonday.setDate(firstThursday.getDate() - firstDay + 1);
      const week = Math.floor((start - firstMonday) / 604800000) + 1;
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const year = thursday.getFullYear();
      return { key: `${year}-W${String(week).padStart(2, "0")}`, label: `Semana ${week}`, start: start.getTime() };
    };
    const sourceLabel = (event) => event.sourceLabel || (event.source === "web" ? "Transporte web" : "Operacion movil");
    const contextFor = (event) => {
      const base = operationContext[event.operation] || {};
      return {
        travelOrder: event.travelOrder || base.travelOrder || `OV-${String(event.operation || event.id).replace(/[^0-9A-Z]/gi, "").slice(-6)}`,
        externalZone: event.externalZone || base.externalZone || event.location || "Sin zona",
        responsible: event.responsible || base.responsible || event.user || "-"
      };
    };
    const refLabel = (event) => [event.vehicle, event.container].filter((value) => value && value !== "--").join(" / ") || event.operation;
    const operationEvents = (operation) => auditEvents.filter((item) => item.operation === operation).sort((a, b) => eventTime(a) - eventTime(b));
    const tracePosition = (event) => { const events = operationEvents(event.operation); const index = events.findIndex((item) => item.id === event.id); return `${Math.max(index + 1, 1)} de ${events.length}`; };
    const hasNovelty = (event) => event.severity === "error" || (event.novelties || []).length > 0 || /NO_APTO|APTO_CON_NOVEDAD|CON_NOVEDAD/i.test(event.status || "");
    const operationGroups = () => Object.values(auditEvents.reduce((acc, event) => {
      acc[event.operation] = acc[event.operation] || { operation: event.operation, events: [] };
      acc[event.operation].events.push(event);
      return acc;
    }, {})).map((group) => ({ ...group, events: group.events.sort((a, b) => eventTime(a) - eventTime(b)) }));
    const operationGroupsFor = (events) => Object.values(events.reduce((acc, event) => {
      acc[event.operation] = acc[event.operation] || { operation: event.operation, events: [] };
      acc[event.operation].events.push(event);
      return acc;
    }, {})).map((group) => {
      const ordered = group.events.sort((a, b) => eventTime(a) - eventTime(b));
      return { ...group, events: ordered, first: ordered[0], last: ordered[ordered.length - 1] };
    }).sort((a, b) => eventTime(b.last) - eventTime(a.last));
    const initialEvent = auditEvents.slice().sort((a, b) => eventTime(b) - eventTime(a))[0];
    let selectedEventId = initialEvent?.id || "";
    let selectedEvidenceId = "";
    let viewMode = "operation";
    let pendingFocusTarget = "";
    const shouldReduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const requestVisualFocus = (target) => { pendingFocusTarget = target; };
    const moveVisualFocus = () => {
      if (!pendingFocusTarget) return;
      const target = pendingFocusTarget;
      pendingFocusTarget = "";
      window.requestAnimationFrame(() => {
        const map = {
          events: {
            scroll: qs("#auditEventTimeline") || qs(".audit-review-panel"),
            focus: qs("#auditEventTimeline .audit-tree-node.active [data-audit-event]") || qs("#auditEventTimeline [data-audit-event]") || qs(".audit-review-panel")
          },
          evidence: {
            scroll: qs(".audit-evidence-panel"),
            focus: qs("#auditEvidenceGallery .audit-photo-card") || qs("#auditEvidenceGallery .audit-photo-nav:not([disabled])") || qs(".audit-evidence-panel")
          }
        };
        const region = map[target];
        if (!region?.scroll) return;
        region.scroll.scrollIntoView({ behavior: shouldReduceMotion() ? "auto" : "smooth", block: "start", inline: "nearest" });
        const focusTarget = region.focus || region.scroll;
        if (!focusTarget.hasAttribute("tabindex") && focusTarget.tabIndex < 0) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
        region.scroll.classList.add("audit-visual-focus");
        window.setTimeout(() => region.scroll.classList.remove("audit-visual-focus"), 900);
      });
    };

    const values = (key) => [...new Set(auditEvents.map((event) => event[key]).filter((value) => value && value !== "--"))].sort((a, b) => String(a).localeCompare(String(b), "es"));
    const fill = (selector, options, label = (value) => value) => {
      const select = qs(selector);
      if (!select) return;
      select.insertAdjacentHTML("beforeend", options.map((value) => `<option value="${esc(value)}">${esc(label(value))}</option>`).join(""));
    };
    const currentYear = String(new Date().getFullYear());
    const years = [...new Set(auditEvents.map((event) => {
      const year = new Date(event.at).getFullYear();
      return Number.isFinite(year) ? String(year) : "";
    }).filter(Boolean))];
    if (!years.includes(currentYear)) years.push(currentYear);
    years.sort((a, b) => Number(b) - Number(a));
    fill("#auditYear", years);
    if (controls.year) controls.year.value = currentYear;
    const weekOptions = Object.values(auditEvents.reduce((acc, event) => {
      const info = weekInfo(event.at);
      if (info) acc[info.key] = info;
      return acc;
    }, {})).sort((a, b) => b.start - a.start);
    fill("#auditWeek", weekOptions.map((item) => item.key), (key) => weekOptions.find((item) => item.key === key)?.label || key);
    fill("#auditEvent", values("type"), (value) => auditEvents.find((event) => event.type === value)?.event || value);

    const searchText = (event) => {
      const ctx = contextFor(event);
      return norm([event.id, sourceLabel(event), ctx.travelOrder, event.operation, ctx.externalZone, event.vehicle, event.container, event.type, event.event, event.phase, event.user, event.location, formatStatus(event.status), event.sync, event.summary, (event.evidence || []).join(" "), (event.controls || []).join(" "), (event.comments || []).join(" "), (event.meta || []).join(" ")].join(" "));
    };
    const dateOk = (event) => {
      const time = eventTime(event);
      if (controls.from?.value) {
        const from = new Date(`${controls.from.value}T00:00:00`).getTime();
        if (time < from) return false;
      }
      if (controls.to?.value) {
        const to = new Date(`${controls.to.value}T23:59:59`).getTime();
        if (time > to) return false;
      }
      return true;
    };
    const selectOk = (event, control, key) => !control || control.value === "all" || String(event[key]) === control.value;
    const yearOk = (event) => {
      const selectedYear = controls.year?.value || "all";
      if (selectedYear === "all") return true;
      const date = new Date(event.at);
      return !Number.isNaN(date.getTime()) && String(date.getFullYear()) === selectedYear;
    };
    const weekOk = (event) => {
      const selectedWeek = controls.week?.value || "all";
      if (selectedWeek === "all") return true;
      return weekInfo(event.at)?.key === selectedWeek;
    };
    function filteredEvents() {
      const term = norm(controls.search?.value || "");
      const state = controls.status?.value || "all";
      return auditEvents.filter((event) => (!term || searchText(event).includes(term)) && yearOk(event) && weekOk(event) && dateOk(event) && selectOk(event, controls.event, "type") && (state === "all" || event.severity === state || norm(event.sync).includes(state))).sort((a, b) => eventTime(b) - eventTime(a));
    }

    function renderOperationStrip(events) {
      const node = qs("#auditOperationStrip");
      if (!node) return;
      const groups = operationGroupsFor(events);
      if (!groups.length) {
        node.innerHTML = emptyText("No hay operaciones que coincidan con los filtros.");
        return;
      }
      const selected = auditEvents.find((event) => event.id === selectedEventId);
      node.innerHTML = groups.map((group) => {
        const current = group.operation === selected?.operation;
        const ctx = contextFor(group.last);
        const evidences = group.events.reduce((total, event) => total + evidenceCount(event), 0);
        const observed = group.events.some(hasNovelty);
        const syncPending = group.events.some((event) => /pendiente|error|failed/i.test(event.sync));
        const status = observed ? "Con Novedad" : syncPending ? "Pendiente Sync" : formatStatus(group.last.status);
        const css = observed ? "status-inactive" : syncPending ? "status-warning" : statusClass(group.last.severity);
        return `<button class="audit-case-card ${current ? "active" : ""}" type="button" data-audit-operation="${esc(group.operation)}" aria-label="${esc(`${ctx.travelOrder} ${group.operation}. ${status}. ${group.events.length} eventos y ${evidences} evidencias`)}"><span class="audit-case-status-dot ${css}" title="${esc(status)}" aria-hidden="true"></span><span class="audit-case-order">${esc(ctx.travelOrder)}</span><strong>${esc(group.operation)}</strong><small>${esc(ctx.externalZone)}</small><div><em>${esc(group.events.length)} eventos / ${esc(evidences)} evidencias</em></div></button>`;
      }).join("");
      qsa("[data-audit-operation]", node).forEach((button) => button.addEventListener("click", () => {
        const group = groups.find((item) => item.operation === button.dataset.auditOperation);
        if (!group?.last) return;
        selectedEventId = group.last.id;
        selectedEvidenceId = "";
        viewMode = "operation";
        requestVisualFocus("events");
        renderAll();
      }));
      qs(".audit-case-card.active", node)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }

    function renderQueue(events) {
      const queue = qs("#auditQueue");
      const ordered = events.slice().sort((a, b) => eventTime(b) - eventTime(a));
      const collapsed = viewMode !== "list";
      setText("#auditQueueCount", collapsed ? `${ordered.length}` : `${ordered.length} eventos`);
      qs("#auditQueueEmpty")?.classList.toggle("show", ordered.length === 0);
      qs("#auditExpandQueue")?.classList.toggle("show", collapsed);
      if (!queue) return;
      if (viewMode === "evidence") {
        const focus = auditEvents.find((event) => event.id === selectedEventId);
        if (focus) {
          const ctx = contextFor(focus);
          queue.innerHTML = `<button class="audit-queue-item audit-event-item audit-rail-item audit-focus-rail active" type="button" data-audit-focus-operation="${esc(focus.id)}" title="${esc(focus.operation)} - ${esc(focus.event)}"><span class="audit-severity-dot ${esc(focus.severity)}"></span><strong>${esc(focus.operation)}</strong><small>${esc(tracePosition(focus))} en el arbol</small><em>${esc(evidenceCount(focus))}</em></button>`;
          qs("[data-audit-focus-operation]", queue)?.addEventListener("click", () => { viewMode = "operation"; requestVisualFocus("events"); renderAll(); });
          return;
        }
      }
      queue.innerHTML = ordered.map((event) => {
        const ctx = contextFor(event);
        const selected = event.id === selectedEventId;
        const evidenceLabel = `${evidenceCount(event)} ${evidenceCount(event) === 1 ? "evidencia" : "evidencias"}`;
        if (collapsed) {
          return `<button class="audit-queue-item audit-event-item audit-rail-item ${selected ? "active" : ""}" type="button" data-audit-event-card="${esc(event.id)}" title="${esc(ctx.travelOrder)} - ${esc(event.event)}"><span class="audit-severity-dot ${esc(event.severity)}"></span><strong>${esc(ctx.travelOrder)}</strong><small>${esc(tracePosition(event))}</small><em>${esc(evidenceCount(event))}</em></button>`;
        }
        return `<button class="audit-queue-item audit-event-item ${selected ? "active" : ""}" type="button" data-audit-event-card="${esc(event.id)}"><span class="audit-severity-dot ${esc(event.severity)}"></span><strong>${esc(ctx.travelOrder)}</strong><span>${esc(event.operation)} / ${esc(ctx.externalZone)}</span><div class="audit-queue-meta"><span class="status ${statusClass(event.severity)}">${esc(formatStatus(event.status))}</span><em>${esc(evidenceLabel)}</em></div></button>`;
      }).join("");
      qsa("[data-audit-event-card]", queue).forEach((button) => button.addEventListener("click", () => { selectedEventId = button.dataset.auditEventCard; selectedEvidenceId = ""; viewMode = "operation"; requestVisualFocus("events"); renderAll(); }));
    }

    function renderSummary(event) {
      const node = qs("#auditOperationSummary");
      if (!node) return;
      const ctx = contextFor(event);
      const items = [["Vehiculo", event.vehicle || "--"], ["Contenedor", event.container || "--"], ["Responsable", ctx.responsible], ["Sincronizacion", formatStatus(event.sync)]];
      node.innerHTML = items.map(([label, value]) => `<div class="audit-summary-item"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");
    }

    function renderTimeline(event, visible) {
      const node = qs("#auditEventTimeline");
      const items = operationEvents(event.operation);
      setText("#auditTimelineMeta", `${items.length} eventos`);
      if (!node) return;
      node.innerHTML = items.map((item, index) => {
        const ctx = contextFor(item);
        const outsideFilter = !visible.some((visibleEvent) => visibleEvent.id === item.id);
        return `<article class="audit-flow-step audit-tree-node ${item.id === selectedEventId ? "active" : ""} ${outsideFilter ? "muted-step" : ""}"><button class="audit-tree-select" type="button" data-audit-event="${esc(item.id)}"><span class="audit-tree-index">${index + 1}</span><div class="audit-tree-copy"><strong>${esc(item.event)}</strong><small>${esc(item.operation)} / ${esc(shortDate(item.at))} / ${esc(ctx.externalZone)}</small></div><span class="status ${statusClass(item.severity)}">${esc(formatStatus(item.status))}</span></button>${treeApprovalMarkup(item)}</article>`;
      }).join("");
      qsa("[data-audit-event]", node).forEach((button) => button.addEventListener("click", () => { selectedEventId = button.dataset.auditEvent; selectedEvidenceId = ""; viewMode = "evidence"; requestVisualFocus("evidence"); renderAll(); }));
      bindTreeApprovalActions(node);
    }

    function evidenceViewData(event, item) {
      const controls = (event.controls || []).map(readControl);
      const title = item?.checkpoint || item?.title || "Punto fotografiado";
      const control = item ? findControlForEvidence(item, controls) : null;
      const observationValue = control?.value || item?.status || "";
      return {
        title,
        date: item?.capturedAt || "Sin fecha",
        image: item?.image || "",
        type: item?.type || "Evidencia",
        statusClass: valueClass(observationValue),
        statusText: formatStatus(observationValue)
      };
    }

    function ensurePhotoLightbox() {
      let node = qs("#auditPhotoLightbox");
      if (node) return node;
      document.body.insertAdjacentHTML("beforeend", `<div class="audit-photo-lightbox" id="auditPhotoLightbox" aria-hidden="true"></div>`);
      return qs("#auditPhotoLightbox");
    }

    function closePhotoLightbox() {
      const node = qs("#auditPhotoLightbox");
      if (!node) return;
      node.classList.remove("show");
      node.setAttribute("aria-hidden", "true");
    }

    function stepPhotoLightbox(delta) {
      const event = auditEvents.find((item) => item.id === selectedEventId);
      if (!event) return;
      const evidence = (event.evidence || []).map(readEvidence);
      const currentIndex = Math.max(0, evidence.findIndex((item) => item.id === selectedEvidenceId));
      const next = currentIndex + delta;
      if (!evidence[next]) return;
      selectedEvidenceId = evidence[next].id;
      renderEvidence(event);
      renderPhotoLightbox(event);
    }

    function renderPhotoLightbox(event) {
      const evidence = (event.evidence || []).map(readEvidence);
      if (!evidence.length) return;
      if (!evidence.some((item) => item.id === selectedEvidenceId)) selectedEvidenceId = evidence[0].id;
      const activeIndex = Math.max(0, evidence.findIndex((item) => item.id === selectedEvidenceId));
      const active = evidence[activeIndex];
      const detail = evidenceViewData(event, active);
      const node = ensurePhotoLightbox();
      if (!node) return;
      const imageMarkup = detail.image ? `<img src="${esc(detail.image)}" alt="${esc(detail.title)}" />` : `<div class="audit-photo-lightbox-empty"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span>Sin imagen asociada</span></div>`;
      node.innerHTML = `<div class="audit-photo-lightbox-scrim" data-lightbox-close></div><section class="audit-photo-lightbox-card" role="dialog" aria-modal="true" aria-labelledby="auditPhotoLightboxTitle"><button class="icon-btn audit-photo-lightbox-close" type="button" data-lightbox-close aria-label="Cerrar foto"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg></button><button class="icon-btn audit-photo-lightbox-nav prev" type="button" data-lightbox-step="-1" aria-label="Foto anterior" ${activeIndex === 0 ? "disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><figure class="audit-photo-lightbox-figure"><div class="audit-photo-lightbox-media">${imageMarkup}</div><figcaption class="audit-photo-lightbox-caption audit-photo-lightbox-caption-compact"><span>Foto ${activeIndex + 1} de ${evidence.length}</span><h3 id="auditPhotoLightboxTitle">${esc(detail.date)}</h3><em class="status ${esc(detail.statusClass)}">${esc(detail.statusText)}</em></figcaption></figure><button class="icon-btn audit-photo-lightbox-nav next" type="button" data-lightbox-step="1" aria-label="Foto siguiente" ${activeIndex === evidence.length - 1 ? "disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg></button></section>`;
      node.classList.add("show");
      node.setAttribute("aria-hidden", "false");
      qsa("[data-lightbox-close]", node).forEach((button) => button.addEventListener("click", closePhotoLightbox));
      qsa("[data-lightbox-step]", node).forEach((button) => button.addEventListener("click", () => stepPhotoLightbox(Number(button.dataset.lightboxStep || 0))));
      qs(".audit-photo-lightbox-close", node)?.focus();
    }

    function renderEvidence(event) {
      const evidence = (event.evidence || []).map(readEvidence);
      const ctx = contextFor(event);
      if (!evidence.some((item) => item.id === selectedEvidenceId)) selectedEvidenceId = evidence[0]?.id || "";
      const activeIndex = Math.max(0, evidence.findIndex((item) => item.id === selectedEvidenceId));
      const active = evidence[activeIndex];
      const detail = active ? evidenceViewData(event, active) : null;
      const photoMarkup = detail?.image ? `<img src="${esc(detail.image)}" alt="${esc(detail.title)}" loading="lazy" />` : `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg><span>Foto ${activeIndex + 1}</span>`;
      const title = qs("#auditEvidenceTitle");
      if (title) title.textContent = event.event;
      setText("#auditEvidenceCountLabel", `${evidence.length} ${evidence.length === 1 ? "foto" : "fotos"}`);
      const context = qs("#auditEvidenceContext");
      if (context) context.innerHTML = `<strong>${esc(event.operation)}</strong><span>${esc(tracePosition(event))} en el arbol / ${esc(ctx.externalZone)}</span>`;
      const gallery = qs("#auditEvidenceGallery");
      if (gallery) {
        gallery.innerHTML = active ? `<div class="audit-photo-viewer"><button class="icon-btn audit-photo-nav" type="button" data-evidence-step="-1" aria-label="Foto anterior" ${activeIndex === 0 ? "disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><article class="audit-gallery-item audit-photo-card" tabindex="-1"><div class="audit-gallery-head audit-gallery-head-compact"><span>Foto ${activeIndex + 1} de ${evidence.length}</span><strong>${esc(detail.date)}</strong><em class="status ${esc(detail.statusClass)}">${esc(detail.statusText)}</em></div><button class="audit-gallery-photo ${esc(detail.statusClass)} ${detail.image ? "has-image" : ""}" type="button" data-open-photo-lightbox aria-label="${esc(`Ampliar foto ${activeIndex + 1}`)}">${photoMarkup}</button></article><button class="icon-btn audit-photo-nav" type="button" data-evidence-step="1" aria-label="Foto siguiente" ${activeIndex === evidence.length - 1 ? "disabled" : ""}><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg></button></div>` : emptyText("El evento seleccionado no tiene evidencias fotograficas asociadas.");
        qsa("[data-evidence-step]", gallery).forEach((button) => button.addEventListener("click", () => {
          const nextIndex = activeIndex + Number(button.dataset.evidenceStep || 0);
          if (!evidence[nextIndex]) return;
          selectedEvidenceId = evidence[nextIndex].id;
          renderEvidence(event);
        }));
        qs("[data-open-photo-lightbox]", gallery)?.addEventListener("click", () => renderPhotoLightbox(event));
      }
    }

    function renderComments(event) {
      const comments = [...(event.comments || []).map(readComment), ...approvalComments(event)];
      const node = qs("#auditComments");
      if (node) node.innerHTML = comments.length ? comments.map((item) => `<article class="audit-comment"><strong>${esc(item.author)}</strong><span>${esc(formatFreeText(item.at))}</span><p>${esc(formatFreeText(item.text))}</p></article>`).join("") : emptyText("Sin comentarios o anotaciones registradas.");
    }

    function renderSelected(visible) {
      const selected = auditEvents.find((event) => event.id === selectedEventId);
      const detailButton = qs("#auditOpenDetail");
      if (!selected) {
        setText("#auditSelectedTitle", "Sin evento seleccionado");
        setText("#auditSelectedSubtitle", "Ajusta los filtros para volver a cargar registros auditables.");
        detailButton?.setAttribute("disabled", "disabled");
        return;
      }
      const ctx = contextFor(selected);
      detailButton?.removeAttribute("disabled");
      setText("#auditSelectedPhase", `${sourceLabel(selected)} / ${ctx.travelOrder}`);
      setText("#auditSelectedTitle", selected.event);
      setText("#auditSelectedSubtitle", `${selected.operation} / ${ctx.externalZone}`);
      renderSummary(selected);
      renderTimeline(selected, visible);
      renderEvidence(selected);
      renderComments(selected);
    }

    function list(items, empty, template) { return items && items.length ? items.map(template).join("") : emptyText(empty); }
    function openDrawer(event) {
      const drawer = qs("#auditDrawer");
      const backdrop = qs("#auditBackdrop");
      if (!drawer || !backdrop) return;
      qs("#auditDrawerTitle").textContent = event.event;
      qs("#auditDrawerSubtitle").textContent = `${sourceLabel(event)} - ${event.id}`;
      const map = { source: sourceLabel(event), operation: event.operation, reference: refLabel(event), user: event.user, date: formatDate(event.at), location: contextFor(event).externalZone, status: formatStatus(event.status), sync: formatStatus(event.sync) };
      qsa("[data-audit-target]").forEach((node) => { node.textContent = map[node.dataset.auditTarget] || "-"; });
      qs("#auditTraceList").innerHTML = list((event.trace || []).map(readTrace), "Sin trazabilidad registrada.", (item) => `<article class="audit-timeline-item ${esc(item.status)}"><strong>${esc(item.title)}</strong><span>${esc(formatFreeText(item.meta))}</span></article>`);
      qs("#auditEvidenceList").innerHTML = list((event.evidence || []).map(readEvidence), "Sin evidencias asociadas.", (item) => `<article class="audit-evidence-card"><div class="audit-evidence-thumb ${item.image ? "has-image" : ""}">${item.image ? `<img src="${esc(item.image || "")}" alt="${esc(item.title || "Evidencia")}" loading="lazy" />` : `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`}</div><strong>${esc(item.title)}</strong><span>${esc(item.type)} - ${esc(formatStatus(item.status))}</span><small>${esc(formatFreeText(item.note || ""))}</small></article>`);
      qs("#auditDrawerControls").innerHTML = list((event.controls || []).map(readControl), "Sin puntos de control asociados.", (point) => `<article class="audit-control-item"><div><strong>${esc(point.name)}</strong><span>${esc(formatFreeText(point.observation || "Sin observacion"))}</span></div><span class="status ${valueClass(point.value)}">${esc(formatStatus(point.value))}</span></article>`);
      qs("#auditNoveltyList").innerHTML = list([...(event.novelties || []), ...(event.comments || []).map((item) => { const comment = readComment(item); return `${comment.author}: ${comment.text}`; }), ...approvalComments(event).map((item) => `${item.author}: ${item.text}`)], "Sin novedades registradas.", (item) => `<div class="audit-note warning">${esc(formatFreeText(item))}</div>`);
      qs("#auditSignatureList").innerHTML = list(event.signatures || [], "Sin firmas/responsabilidad asociada.", (item) => `<div class="audit-note success">${esc(formatFreeText(item))}</div>`);
      drawer.classList.add("show");
      backdrop.classList.add("show");
      drawer.setAttribute("aria-hidden", "false");
      qs("#closeAuditDrawer")?.focus();
    }
    function closeDrawer() {
      qs("#auditDrawer")?.classList.remove("show");
      qs("#auditBackdrop")?.classList.remove("show");
      qs("#auditDrawer")?.setAttribute("aria-hidden", "true");
    }
    function renderAll() {
      const visible = filteredEvents();
      if (!visible.some((event) => event.id === selectedEventId)) {
        selectedEventId = visible[0]?.id || "";
        selectedEvidenceId = "";
        viewMode = visible.length ? "operation" : "list";
      }
      if (workbench) workbench.dataset.auditMode = viewMode;
      setText("#auditTrailCount", `${visible.length} eventos visibles`);
      renderOperationStrip(visible);
      renderQueue(visible);
      renderSelected(visible);
      moveVisualFocus();
    }

    const advancedFilters = qs("#auditAdvancedFilters");
    const filterToggle = qs("#auditToggleFilters");
    filterToggle?.addEventListener("click", () => {
      if (!advancedFilters) return;
      const willOpen = advancedFilters.hidden;
      advancedFilters.hidden = !willOpen;
      filterToggle.setAttribute("aria-expanded", String(willOpen));
      const label = qs("span", filterToggle);
      if (label) label.textContent = willOpen ? "Ocultar filtros" : "Mas filtros";
    });
    Object.values(controls).filter(Boolean).forEach((control) => control.addEventListener(control.tagName === "INPUT" ? "input" : "change", () => { viewMode = "operation"; selectedEvidenceId = ""; renderAll(); }));
    qs("#auditClearFilters")?.addEventListener("click", () => { Object.entries(controls).filter(([, control]) => Boolean(control)).forEach(([key, control]) => { control.value = key === "year" ? currentYear : control.tagName === "SELECT" ? "all" : ""; }); selectedEvidenceId = ""; viewMode = "operation"; renderAll(); controls.search?.focus(); });
    qs("#auditOpenDetail")?.addEventListener("click", () => { const event = auditEvents.find((item) => item.id === selectedEventId); if (event) openDrawer(event); });
    qs("#auditExpandQueue")?.addEventListener("click", () => { viewMode = "list"; renderAll(); });
    qs("#auditBackToOperation")?.addEventListener("click", () => { viewMode = "operation"; requestVisualFocus("events"); renderAll(); });
    qs("#auditCasesPrev")?.addEventListener("click", () => qs("#auditOperationStrip")?.scrollBy({ left: -360, behavior: "smooth" }));
    qs("#auditCasesNext")?.addEventListener("click", () => qs("#auditOperationStrip")?.scrollBy({ left: 360, behavior: "smooth" }));
    qs("#closeAuditDrawer")?.addEventListener("click", closeDrawer);
    qs("#auditBackdrop")?.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeDrawer(); });
    document.addEventListener("keydown", (event) => {
      const lightbox = qs("#auditPhotoLightbox");
      if (!lightbox?.classList.contains("show")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePhotoLightbox();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepPhotoLightbox(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepPhotoLightbox(1);
      }
    });
    renderAll();
  }
  return { applyShell, initTableFilters, initDrawer, initEmbeddedForm, initCatalogForm, initAuditTrail };
})();
