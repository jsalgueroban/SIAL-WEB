/* Persistencia local de demostración; no representa datos ni auditoría del sistema real. */
window.CompanyPrototype = (() => {
  const key = 'sial-proposal-companies-v1';
  const seeds = [
    {code:'EMP-0012', name:'SIAL Central', nit:'900123456-1', roles:'Administrador general;Seguridad y roles;Consulta auditoria', scope:'Operacion central', context:'central', status:'active', audit:'Edicion de datos base|admin.sial - 22/04/2026 09:18;Actualizacion de roles|seguridad.sial - 21/04/2026 15:06'},
    {code:'EMP-0034', name:'Banapalma', nit:'901456789-4', roles:'Supervisor campo;Gestor documental', scope:'Operacion regional', context:'regional', status:'warning', audit:'Revision de NIT|auditor.master - 20/04/2026 11:04;Cambio de estado|admin.sial - 19/04/2026 14:32'},
    {code:'EMP-0007', name:'AgroCeiba', nit:'800998877-2', roles:'Consulta historica', scope:'Sin alta de usuarios', context:'blocked', status:'inactive', audit:'Inactivacion administrativa|seguridad.sial - 18/04/2026 08:55'}
  ];
  const id = new URLSearchParams(location.search).get('empresa');
  const digits = value => String(value || '').replace(/\D/g, '');
  function read() {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(seeds);
    const rows = JSON.parse(raw);
    if (!Array.isArray(rows)) throw new Error('Datos locales inválidos');
    return rows;
  }
  function current() { try { return id ? read().find(row => row.code === id) : null; } catch { return null; } }
  function isDuplicate(nit) { try { return read().some(row => row.code !== id && digits(row.nit) === digits(nit)); } catch { return false; } }
  function notice(message) {
    let node = document.getElementById('companyStorageError');
    if (!node) { node = document.createElement('p'); node.id = 'companyStorageError'; node.className = 'field-note error'; node.setAttribute('role','alert'); (document.querySelector('[data-company-form]') || document.querySelector('.page')).prepend(node); }
    node.textContent = message;
  }
  function stamp(action) { return `${action}|Propuesta local - ${new Date().toLocaleString('es-CO')}`; }
  function save(form) {
    try {
      const rows = read();
      const existing = id && rows.find(row => row.code === id);
      if (id && !existing) throw new Error('La empresa no está disponible para edición.');
      const nit = form.querySelector('#nit').value.trim();
      if (rows.some(row => row.code !== id && digits(row.nit) === digits(nit))) throw new Error('Ya existe una empresa con este NIT.');
      const sequence = Math.max(0, ...rows.map(row => Number(row.code?.replace(/^EMP-/, '')) || 0)) + 1;
      const row = existing || {code:`EMP-${String(sequence).padStart(4,'0')}`, roles:'', scope:'Sin información', context:'', status:'active', audit:''};
      row.name = form.querySelector('#companyName').value.trim().toUpperCase();
      row.nit = nit;
      row.businessName = form.querySelector('#businessName').value.trim().toUpperCase();
      row.types = Array.from(form.querySelectorAll('[data-company-type-assignment]'), item => item.dataset.companyTypeAssignment);
      row.audit = [stamp(existing ? 'Edición de empresa' : 'Creación de empresa'), row.audit].filter(Boolean).join(';');
      if (!existing) rows.push(row);
      localStorage.setItem(key, JSON.stringify(rows));
      location.href = 'gestion-empresas.html';
      return true;
    } catch (error) { notice(error.message || 'No se pudo guardar la empresa en este navegador.'); return false; }
  }
  function initForm() {
    if (!id) return;
    const row = current();
    if (!row) { notice('No se encontró la empresa solicitada. Vuelve a la gestión para seleccionarla.'); document.querySelector('[data-company-form] button[type=submit]').disabled = true; return; }
    document.querySelector('.page-title').textContent = 'Editar empresa';
    for (const [field,value] of Object.entries({companyName:row.name,nit:row.nit,businessName:row.businessName || ''})) {
      const input = document.getElementById(field); input.value = value; input.dispatchEvent(new Event('input',{bubbles:true}));
    }
  }
  function initList() {
    const tbody = document.querySelector('.table-wrap tbody');
    if (!tbody) return;
    let rows;
    try { rows = read(); } catch { notice('No se pudieron leer las empresas guardadas en este navegador.'); return; }
    const templates = Array.from(tbody.children);
    tbody.replaceChildren();
    rows.forEach((row, index) => {
      const tr = (templates.find(item => item.dataset.code === row.code) || templates[0]).cloneNode(true);
      const status = row.status || 'active';
      const state = {active:'Activo',warning:'Revision',inactive:'Inactivo'}[status] || status;
      Object.assign(tr.dataset,{status,context:row.context || '',code:row.code,name:row.name,nit:row.nit,roles:row.roles || '',scope:row.scope || 'Sin información',state,audit:row.audit || ''});
      const cells = tr.cells;
      cells[0].textContent = row.code; cells[1].textContent = row.name; cells[2].textContent = row.nit;
      cells[3].textContent = row.roles ? `${row.roles.split(';').length} roles` : 'Sin roles registrados';
      cells[4].textContent = row.scope || 'Sin información';
      const badge = cells[5].querySelector('.status'); badge.className = `status status-${status}`; badge.textContent = state;
      cells[6].textContent = (row.audit || '').split(';')[0]?.split('|')[1] || '—';
      const edit = tr.querySelector('a[aria-label="Editar empresa"]'); edit.href = `registro-empresa.html?empresa=${encodeURIComponent(row.code)}`;
      const toggle = tr.querySelector('button[aria-label="Inactivar empresa"],button[aria-label="Activar empresa"]');
      toggle.setAttribute('aria-label', status === 'inactive' ? 'Activar empresa' : 'Inactivar empresa');
      const icon = toggle.querySelector('svg');
      icon.replaceChildren();
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', status === 'inactive' ? 'M20 6 9 17l-5-5' : 'M18 6 6 18M6 6l12 12');
      icon.append(path);
      toggle.addEventListener('click', () => {
        const active = status === 'inactive';
        if (!window.confirm(`¿${active ? 'Activar' : 'Inactivar'} ${row.name}?`)) return;
        try {
          const latest = read(); const target = latest.find(item => item.code === row.code);
          if (!target) throw new Error('La empresa ya no está disponible.');
          target.status = active ? 'active' : 'inactive';
          target.audit = [stamp(active ? 'Activación de empresa' : 'Inactivación de empresa'), target.audit].filter(Boolean).join(';');
          localStorage.setItem(key, JSON.stringify(latest)); location.reload();
        } catch (error) { notice(error.message || 'No se pudo guardar el estado.'); }
      });
      tbody.append(tr);
    });
  }
  return {current,isDuplicate,save,initForm,initList};
})();
