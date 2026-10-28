(function () {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const store = window.SIALMaintenanceStore;
  const statusLabels = {active:'En mantenimiento', release:'Pendiente de liberación', planned:'Programado', closed:'Liberado'};
  const statusClasses = {active:'inactive', release:'warning', planned:'warning', closed:'active'};
  const formatDate = value => value ? String(value).slice(0,10).split('-').reverse().join('/') : '—';
  const formatDateTime = value => value ? `${formatDate(value)}${String(value).includes('T') ? ` · ${String(value).slice(11,16)}` : ''}` : '—';
  function hydrateList() {
    const body = qs('#maintenanceRows'); if (!body) return;
    body.replaceChildren();
    store.read().forEach(record => {
      const row = document.createElement('tr'); row.dataset.type = record.kind; row.dataset.status = record.status;
      const vehicle = row.insertCell(), link = document.createElement('a');
      link.className = 'table-link'; link.href = `detalle-mantenimiento.html?id=${encodeURIComponent(record.id)}`; link.textContent = record.vehicle; vehicle.append(link);
      [record.kind, record.cause, record.workshop, formatDate(record.start), formatDate(record.expected)].forEach(value => { row.insertCell().textContent = value || '—'; });
      const status = document.createElement('span'); status.className = `status status-${statusClasses[record.status] || 'warning'}`; status.textContent = statusLabels[record.status] || 'Sin información'; row.insertCell().append(status);
      const cell = row.insertCell(), actions = document.createElement('div'), action = document.createElement('a');
      actions.className = 'row-actions'; action.className = 'icon-btn'; action.href = link.href; action.setAttribute('aria-label', `Consultar mantenimiento ${record.id}`);
      action.innerHTML = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
      actions.append(action); cell.append(actions); body.append(row);
    });
  }
  function initList() {
    hydrateList();
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
    // Una programación futura no acredita que el vehículo ya esté en tránsito.
    const operationActive = () => vehicle.value && window.TransportAvailability?.get(vehicle.value).operationActive;
    const updateContext = () => {
      const activeTrip = Boolean(operationActive());
      const unavailable = !window.TransportAvailability;
      qs("[data-context-plate]").value = vehicle.value || "Sin seleccionar";
      qs("[data-context-state]").value = activeTrip ? "Operación en tránsito" : vehicle.value ? "Por verificar" : "Sin seleccionar";
      blocked.classList.toggle("is-hidden", !activeTrip);
      impact.textContent = unavailable ? "No se pudo consultar el estado operativo local." : vehicle.value ? (activeTrip ? "No puede registrarse mientras exista una operación en tránsito." : "Sin tránsito reportado en la propuesta. La disponibilidad final debe verificarse.") : "Selecciona un vehículo para validar su disponibilidad.";
      qs("#maintenanceSubmit").disabled = !vehicle.value || activeTrip || unavailable;
    };
    vehicle.addEventListener("change", updateContext);
    cost?.addEventListener("input", () => {
      costNote.textContent = Number(cost.value) > 5000000 ? "Para aprobar o ejecutar este costo se requerirán cotizaciones, aprobación y soporte de compra." : "Valor opcional en pesos colombianos.";
    });
    evidence?.addEventListener("change", () => {
      const files = Array.from(evidence.files || []);
      evidenceName.textContent = files.length === 0 ? "Ningún archivo seleccionado" : files.length === 1 ? files[0].name : `${files.length} archivos seleccionados`;
    });
    form.addEventListener("reset", () => requestAnimationFrame(() => { updateContext(); if (evidenceName) evidenceName.textContent = "Ningún archivo seleccionado"; feedback.hidden = true; costNote.textContent = "Valor opcional en pesos colombianos."; qsa(".is-error", form).forEach(field => { field.classList.remove("is-error"); field.removeAttribute("aria-invalid"); }); }));
    updateContext();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      feedback.hidden = true;
      if (!window.TransportAvailability || operationActive()) { updateContext(); return; }
      const required = qsa("[required]", form);
      let firstInvalid = null;
      required.forEach((field) => {
        const invalid = !field.checkValidity() || !String(field.value || "").trim();
        field.classList.toggle("is-error", invalid);
        field.setAttribute("aria-invalid", String(invalid));
        if (invalid && !firstInvalid) firstInvalid = field;
      });
      const start = qs("#maintenanceStart");
      const expected = qs("#maintenanceExpected");
      if (!firstInvalid && expected.value <= start.value) { expected.classList.add("is-error"); expected.setAttribute("aria-invalid", "true"); firstInvalid = expected; }
      const mileage = qs("#maintenanceMileage");
      const hours = qs("#maintenanceHours");
      if (!firstInvalid && !mileage.value && !hours.value) { mileage.classList.add("is-error"); hours.classList.add("is-error"); mileage.setAttribute("aria-invalid", "true"); hours.setAttribute("aria-invalid", "true"); firstInvalid = mileage; }
      if (firstInvalid) {
        feedback.textContent = firstInvalid === evidence ? "Adjunta al menos un soporte de ingreso." : firstInvalid === expected ? "La salida estimada debe ser posterior al ingreso." : firstInvalid === mileage ? "Indica el kilometraje o el horómetro de ingreso." : "Completa los campos obligatorios para revisar el registro.";
        feedback.hidden = false;
        const visibleControl = firstInvalid.closest(".sial-library-field-ready")?.querySelector(".sial-library-field input, .sial-library-field button, .sial-library-field [role=combobox]");
        (visibleControl || firstInvalid).focus();
        return;
      }
      const all = store.read();
      const year = new Date().getFullYear();
      const next = Math.max(0, ...all.map(item => Number(item.id.split('-').at(-1)) || 0)) + 1;
      let id = `MNT-${year}-${String(next).padStart(3,'0')}`;
      const button = qs('#maintenanceSubmit'); button.disabled = true;
      let attachments = [];
      try {
        attachments = await store.persistFiles(evidence.files, id);
        if (operationActive()) throw new Error('El vehículo ahora tiene una operación en tránsito.');
        const latest = store.read();
        if (latest.some(item => item.id === id)) {
          const revised = Math.max(0, ...latest.map(item => Number(item.id.split('-').at(-1)) || 0)) + 1;
          id = `MNT-${year}-${String(revised).padStart(3,'0')}`;
        }
        const value = id => qs(`#${id}`)?.value.trim() || '';
        const record = {id, vehicle:value('maintenanceVehicle'),kind:value('maintenanceKind'),cause:value('maintenanceCause'),priority:value('maintenancePriority'),workshop:value('maintenanceWorkshop'),responsible:value('maintenanceResponsible'),cost:value('maintenanceCost'),start:value('maintenanceStart'),expected:value('maintenanceExpected'),mileage:value('maintenanceMileage'),hours:value('maintenanceHours'),origin:value('maintenanceOrigin'),diagnosis:value('maintenanceDiagnosis'),notes:value('maintenanceNotes'),attachments,status:'active',audit:[`Ingreso registrado · ${new Date().toLocaleString('es-CO')}`]};
        store.write([record,...latest]);
        location.href = `detalle-mantenimiento.html?id=${encodeURIComponent(id)}`;
      } catch {
        if (attachments.length) await store.deleteFiles(attachments).catch(() => {});
        feedback.textContent = operationActive() ? 'El vehículo ahora tiene una operación en tránsito. No se guardó el mantenimiento.' : 'No se pudo guardar el mantenimiento o sus soportes en este navegador. Intenta nuevamente.';
        feedback.hidden = false; button.disabled = false;
      }
    });
  }

  function initDetail() {
    const id = new URLSearchParams(location.search).get("id") || "MNT-2026-017";
    const record = store.read().find(item => item.id === id);
    const page = qs("main .page");
    const originalRelease = qs('.release-card', page);
    const releaseTemplate = originalRelease?.cloneNode(true);
    const heading = qs('.page-title', page), subtitle = qs('.page-subtitle', page), breadcrumb = qs('.page-eyebrow', page);
    if (breadcrumb) breadcrumb.textContent = `Transporte / Mantenimientos / ${id}`;
    const appendEvidence = (parent, attachments, title) => {
      if (!attachments?.length) return;
      const section = document.createElement('section'); section.className = 'maintenance-panel';
      const h = document.createElement('h2'); h.textContent = title; section.append(h);
      attachments.forEach(item => {
        const button = document.createElement('button'); button.className = 'btn btn-secondary'; button.dataset.sialButtonAdapter = ''; button.type = 'button'; button.textContent = item.name;
        button.addEventListener('click', async () => {
          try { const file = await store.getFile(item.key); if (!file) throw new Error(); const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href=url; link.download=item.name; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
          catch { button.textContent = `No disponible: ${item.name}`; }
        });
        section.append(button);
      }); parent.append(section);
    };
    if (!record) {
      if (heading) heading.textContent = 'Mantenimiento no encontrado';
      if (subtitle) subtitle.textContent = 'No se encontró el expediente solicitado.';
      qsa(':scope > article, :scope > .maintenance-layout', page).forEach(node => node.remove()); return;
    }
    if (id !== 'MNT-2026-017') {
      if (heading) heading.textContent = `Mantenimiento ${id}`;
      if (subtitle) subtitle.textContent = 'Consulta la información y los eventos disponibles del expediente.';
      qsa(':scope > article, :scope > .maintenance-layout', page).forEach(node => node.remove());
      const card = document.createElement('article'); card.className='card';
      const body = document.createElement('div'); body.className='card-body';
      const dl = document.createElement('dl'); dl.className='sial-key-value-grid';
      const fields = [['Vehículo',record.vehicle],['Estado',statusLabels[record.status]],['Tipo',record.kind],['Taller',record.workshop],['Ingreso',formatDateTime(record.start)],['Salida estimada',formatDateTime(record.expected)],['Motivo',record.cause],['Diagnóstico',record.diagnosis],['Responsable',record.responsible],['Prioridad',record.priority],['Costo estimado',record.cost],['Kilometraje de ingreso',record.mileage],['Horómetro de ingreso',record.hours],['Origen',record.origin],['Observaciones',record.notes],['Resultado de liberación',record.release?.notes]];
      fields.filter(([,value])=>value).forEach(([label,value])=>{const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;if(label==='Estado'){const chip=document.createElement('span');chip.className=`status status-${statusClasses[record.status] || 'warning'}`;chip.dataset.sialChipAdapter='';chip.textContent=value;dd.append(chip)}else dd.textContent=value;item.append(dt,dd);dl.append(item)});
      body.append(dl); appendEvidence(body,record.attachments,'Soportes de ingreso'); appendEvidence(body,record.release?.attachments,'Evidencia de liberación');
      if(record.audit?.length){const section=document.createElement('section'),h=document.createElement('h2'),ul=document.createElement('ul');section.className='maintenance-panel';h.textContent='Eventos del expediente';record.audit.forEach(entry=>{const li=document.createElement('li');li.textContent=entry;ul.append(li)});section.append(h,ul);body.append(section)}
      if(record.status==='active'){
        const action=document.createElement('button');action.type='button';action.className='btn btn-secondary';action.dataset.sialButtonAdapter='';action.textContent='Marcar trabajo terminado';
        action.addEventListener('click',()=>{try{const all=store.read(),current=all.find(item=>item.id===id);if(!current||current.status!=='active')throw new Error();store.write(all.map(item=>item.id===id?{...item,status:'release',audit:[...(item.audit||[]),`Trabajo terminado · ${new Date().toLocaleString('es-CO')}`]}:item));location.reload()}catch{action.textContent='No se pudo guardar o el estado cambió. Recarga la vista.'}});body.append(action);
      }
      card.append(body);page.append(card);
      if(record.status==='release' && releaseTemplate){releaseTemplate.classList.add('mt-24');page.append(releaseTemplate);}
    } else {
      const status=qs('.maintenance-fact .status',page);
      if(status && record.status==='closed'){status.textContent='Liberado';status.className='status status-active';}
      const availability=qsa('.maintenance-fact .status',page)[1];
      if(availability && record.status==='closed'){availability.textContent='Por verificar';availability.className='status status-warning';}
      if(record.status==='closed') originalRelease?.remove();
      const target=qs('.maintenance-record',page);
      if(target){const releaseEvent = record.audit?.findLast(entry=>entry.startsWith('Liberar vehículo'));const timeline=qs('.maintenance-timeline',target);if(releaseEvent&&timeline){const item=document.createElement('div'),strong=document.createElement('strong'),span=document.createElement('span');item.className='maintenance-event';strong.textContent='Vehículo liberado';span.textContent=releaseEvent.replace('Liberar vehículo · ','');item.append(strong,span);timeline.prepend(item)}appendEvidence(target,record.release?.attachments,'Evidencia de liberación');if(record.release?.notes){const section=document.createElement('section');section.className='maintenance-panel';const h=document.createElement('h2'),p=document.createElement('p');h.textContent='Resultado de liberación';p.textContent=record.release.notes;section.append(h,p);target.append(section)}}
      qsa('.maintenance-file a[href="#"]',page).forEach(link=>{const text=document.createElement('span');text.className='muted';text.textContent='Archivo de demostración';link.replaceWith(text)});
    }
    const release = qs('#releaseForm',page); if (!release || record.status !== 'release') return;
    const result=qs('#releaseResult',page),evidence=qs('#releaseEvidence',page),evidenceName=qs('#releaseEvidenceName',page),feedback=qs('#releaseFeedback',page);
    evidence?.addEventListener('change',()=>{evidenceName.textContent=evidence.files?.[0]?.name||'Ningún archivo seleccionado'});
    release.addEventListener('submit',async event=>{
      event.preventDefault(); const notes=qs('#releaseNotes',page),invalid=!evidence.files?.length||!notes.value.trim();
      evidence.classList.toggle('is-error',!evidence.files?.length);notes.classList.toggle('is-error',!notes.value.trim());
      evidence.setAttribute('aria-invalid',String(!evidence.files?.length));notes.setAttribute('aria-invalid',String(!notes.value.trim()));
      if(invalid){feedback.textContent=!evidence.files?.length?'Adjunta la evidencia final para liberar.':'Escribe el resultado y las observaciones.';feedback.hidden=false;result.classList.add('is-hidden');(!evidence.files?.length?evidence:notes).focus();return;}
      const button=qs('#releaseSubmit',page);button.disabled=true;let attachments=[];
      try{const current=store.read().find(item=>item.id===id);if(!current||current.status!=='release')throw new Error('El estado del expediente cambió. Recarga la vista.');
        attachments=await store.persistFiles(evidence.files,`${id}/liberacion`);
        const latest=store.read();
        if (!latest.some(item => item.id===id && item.status==='release')) throw new Error('El estado del expediente cambió. Recarga la vista.');
        store.write(latest.map(item=>item.id===id?{...item,status:'closed',release:{notes:notes.value.trim(),attachments},audit:[...(item.audit||[]),`Liberar vehículo · ${new Date().toLocaleString('es-CO')}`]}:item));
        location.reload();
      }catch(error){if(attachments.length)await store.deleteFiles(attachments).catch(()=>{});feedback.textContent=error.message?.includes('estado')?error.message:'No se pudo guardar la liberación o su evidencia. Intenta nuevamente.';feedback.hidden=false;button.disabled=false;}
    });
  }

  window.SIALMaintenance = { initList, initForm, initDetail };
})();
