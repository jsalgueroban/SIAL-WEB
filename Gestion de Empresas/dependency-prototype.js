/* Catálogo de demostración guardado únicamente en este navegador. */
(() => {
  const key = 'sial-proposal-dependencies-v1';
  const tbody = document.querySelector('.table-wrap tbody');
  const templates = Array.from(tbody.rows);
  const seeds = templates.map(row => ({...row.dataset}));
  const form = document.querySelector('[data-generic-form]');
  const name = document.getElementById('depName');
  const note = document.getElementById('depNameNote');
  let editing = null;
  function read() {
    const raw = localStorage.getItem(key);
    if (!raw) return structuredClone(seeds);
    const result = JSON.parse(raw);
    if (!Array.isArray(result)) throw new Error('No se pudieron leer las dependencias guardadas.');
    return result;
  }
  function error(text) { note.textContent = text; note.classList.add('error'); name.setAttribute('aria-invalid','true'); document.getElementById('sial-library-depName')?.focus(); }
  function audit(action, history) { return [`${action}|Propuesta local - ${new Date().toLocaleString('es-CO')}`, history].filter(Boolean).join(';'); }
  let rows;
  try { rows = read(); } catch (e) { error(e.message); return; }
  tbody.replaceChildren();
  rows.forEach(item => {
    const tr = (templates.find(row => row.dataset.code === item.code) || templates[0]).cloneNode(true);
    Object.assign(tr.dataset, item);
    tr.cells[0].textContent = item.code; tr.cells[1].textContent = item.name;
    const badge = tr.cells[2].querySelector('.status'); badge.className = `status status-${item.status}`; badge.textContent = item.status === 'active' ? 'Activo' : 'Inactivo';
    tr.cells[3].textContent = item.audit?.split(';')[0]?.replace('|',' · ') || '—';
    const edit = tr.querySelector('[data-edit-inline]');
    edit.addEventListener('click', () => {
      editing = item.code;
      name.value = item.name;
      name.dispatchEvent(new Event('input', {bubbles:true}));
      note.classList.remove('error'); name.removeAttribute('aria-invalid');
    });
    const toggle = tr.querySelector('button[aria-label="Activar"],button[aria-label="Inactivar"]');
    const activate = item.status === 'inactive';
    toggle.setAttribute('aria-label', activate ? 'Activar' : 'Inactivar');
    const svg = toggle.querySelector('svg'); svg.replaceChildren();
    const path = document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',activate ? 'M20 6 9 17l-5-5' : 'M18 6 6 18M6 6l12 12'); svg.append(path);
    toggle.addEventListener('click', () => {
      if (!confirm(`¿${activate ? 'Activar' : 'Inactivar'} ${item.name}?`)) return;
      try { const all = read(); const target = all.find(x => x.code === item.code); if (!target) throw new Error('Dependencia no encontrada.'); target.status = activate ? 'active' : 'inactive'; target.state = activate ? 'Activo' : 'Inactivo'; target.audit = audit(activate ? 'Activación' : 'Inactivación',target.audit); localStorage.setItem(key, JSON.stringify(all)); location.reload(); }
      catch (e) { error(e.message || 'No se pudo guardar el estado.'); }
    });
    tbody.append(tr);
  });
  document.querySelector('[data-open-inline-form]').addEventListener('click', () => { editing = null; form.reset(); note.classList.remove('error'); name.removeAttribute('aria-invalid'); });
  document.querySelector('[data-cancel-inline-form]').addEventListener('click', () => { editing = null; });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = name.value.trim().toUpperCase();
    if (!value) return error('Este campo es obligatorio.');
    try {
      const all = read();
      if (all.some(item => item.code !== editing && item.name.trim().toLocaleUpperCase('es') === value)) return error('Ya existe una dependencia con este nombre.');
      let item = editing && all.find(x => x.code === editing);
      if (editing && !item) throw new Error('Dependencia no encontrada.');
      if (!item) { item = {code:String(Math.max(0,...all.map(x => Number(x.code)||0))+1),status:'active',state:'Activo',audit:''}; all.push(item); }
      item.name = value; item.audit = audit(editing ? 'Edición' : 'Creación',item.audit);
      localStorage.setItem(key, JSON.stringify(all)); location.reload();
    } catch (e) { error(e.message || 'No se pudo guardar la dependencia.'); }
  });
})();
