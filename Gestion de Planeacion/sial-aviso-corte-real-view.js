(function () {
  const data = window.SIAL_CUT_REAL_46;
  const root = document.querySelector('[data-real-notice]');
  if (!data || !root) { window.SIALCutNoticeRealView = { init() {} }; return; }

  const $ = (selector) => root.querySelector(selector);
  const menu = document.querySelector('[data-real-menu]');
  const state = { view: 'pallets', group: '', farm: '', reference: '', page: 1 };
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const size = 20;
  const format = (value) => Number(value || 0).toLocaleString('es-CO', { maximumFractionDigits: 3 });
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const sum = (items) => items.reduce((total, value) => total + Number(value || 0), 0);
  const lower = (value) => String(value || '').toLocaleLowerCase('es-CO');
  const currentRows = data.rows.map((row) => ({ ...row, total: sum(row.d) }));
  const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es'));
  const groups = unique(currentRows.map((row) => row.g));
  const totalPallets = sum(currentRows.map((row) => row.total));
  const totalBoxes = sum(currentRows.map((row) => row.total * row.b));

  function referenceRows() {
    const mapped = new Map();
    currentRows.forEach((row) => {
      if (!mapped.has(row.r)) mapped.set(row.r, { r: row.r, b: row.b, d: [0, 0, 0, 0, 0, 0], farms: new Set() });
      const item = mapped.get(row.r);
      item.farms.add(row.f);
      row.d.forEach((value, index) => { item.d[index] += Number(value || 0); });
    });
    return [...mapped.values()].map((row) => ({ ...row, total: sum(row.d) })).sort((a, b) => a.r.localeCompare(b.r, 'es'));
  }
  const refs = referenceRows();

  function filtered() {
    const source = state.view === 'versions' ? data.versions : state.view === 'references' ? refs : currentRows;
    return source.filter((row) =>
      (!state.group || row.g === state.group) &&
      (!state.farm || lower(row.f).includes(lower(state.farm))) &&
      (!state.reference || lower(row.r).includes(lower(state.reference)))
    );
  }

  function heading() {
    const copy = {
      pallets: ['Palés por finca y referencia', 'La misma lectura de “Resumen Pallets”: programación de lunes a sábado, por grupo, finca y referencia.'],
      boxes: ['Cajas por finca y referencia', 'Cada celda se calcula con los palés y las cajas por palé de la referencia en este archivo.'],
      references: ['Consolidado por referencia', 'Agrupa todas las fincas por referencia y día; abre una fila para consultar sus fincas.'],
      versions: ['Cambios por versión', '“Inicial” y versiones 1 a 3 son etiquetas del Excel, aún pendientes de conciliación con la numeración del producto.']
    }[state.view];
    $('[data-real-heading]').textContent = copy[0];
    $('[data-real-description]').textContent = copy[1];
    root.querySelectorAll('[data-real-tab]').forEach((tab) => { const selected = tab.dataset.realTab === state.view; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
  }

  function filters() {
    const groupControl = state.view === 'references' ? '' : `<label>Grupo<select data-real-filter="group" aria-label="Filtrar grupo"><option value="">Todos</option>${groups.map((group) => `<option value="${escape(group)}"${state.group === group ? ' selected' : ''}>${escape(group)}</option>`).join('')}</select></label>`;
    const farmControl = state.view === 'references' ? '' : '<label>Finca<input data-real-filter="farm" aria-label="Buscar finca" placeholder="Buscar" autocomplete="off"></label>';
    const refControl = '<label>Referencia<input data-real-filter="reference" aria-label="Buscar referencia" placeholder="Buscar" autocomplete="off"></label>';
    const daysHead = days.map((day, index) => `<th scope="col"><span>${day}</span><small>${data.dates[index].slice(8)}/11</small></th>`).join('');
    let cells;
    if (state.view === 'references') cells = `<th scope="col">${refControl}</th><th scope="col">Cajas / palé</th><th scope="col">Fincas</th>${daysHead}<th scope="col">Total palés</th>`;
    else if (state.view === 'versions') cells = `<th scope="col">${groupControl}</th><th scope="col">${farmControl}</th><th scope="col">${refControl}</th><th scope="col">Inicial</th><th scope="col">Versión 1</th><th scope="col">Versión 2</th><th scope="col">Versión 3</th><th scope="col">Cambio V2 → V3</th>`;
    else cells = `<th scope="col">${groupControl}</th><th scope="col">${farmControl}</th><th scope="col">${refControl}</th><th scope="col">Cajas / palé</th>${daysHead}<th scope="col">Total ${state.view === 'boxes' ? 'cajas' : 'palés'}</th>`;
    $('[data-real-head]').innerHTML = `<tr>${cells}</tr>`;
    const farm = $('[data-real-filter="farm"]'); if (farm) farm.value = state.farm;
    const ref = $('[data-real-filter="reference"]'); if (ref) ref.value = state.reference;
  }

  function rowHtml(row, index) {
    const open = `<button class="cut-real-more" type="button" data-real-more="${index}" aria-label="Opciones de ${escape(row.r)}">⋯</button>`;
    if (state.view === 'references') return `<tr tabindex="0" data-real-row="${index}"><th scope="row"><span>${escape(row.r)}</span>${open}</th><td>${format(row.b)}</td><td>${format(row.farms.size)}</td>${row.d.map((value) => `<td>${value ? format(value) : '—'}</td>`).join('')}<td class="cut-real-total">${format(row.total)}</td></tr>`;
    if (state.view === 'versions') {
      const delta = Number(row.v[3] || 0) - Number(row.v[2] || 0);
      return `<tr tabindex="0" data-real-row="${index}"${delta ? ' class="cut-real-changed"' : ''}><td>${escape(row.g)}</td><td>${escape(row.f)}</td><th scope="row"><span>${escape(row.r)}</span>${open}</th>${row.v.map((value) => `<td>${value === null ? '—' : format(value)}</td>`).join('')}<td class="cut-real-delta">${delta > 0 ? '+' : ''}${delta ? format(delta) : '—'}</td></tr>`;
    }
    const values = state.view === 'boxes' ? row.d.map((value) => value * row.b) : row.d;
    const total = state.view === 'boxes' ? row.total * row.b : row.total;
    return `<tr tabindex="0" data-real-row="${index}"><td>${escape(row.g)}</td><td>${escape(row.f)}</td><th scope="row"><span>${escape(row.r)}</span>${open}</th><td>${format(row.b)}</td>${values.map((value) => `<td>${value ? format(value) : '—'}</td>`).join('')}<td class="cut-real-total">${format(total)}</td></tr>`;
  }

  function renderBody() {
    const rows = filtered();
    const pages = Math.max(1, Math.ceil(rows.length / size));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * size;
    const pageRows = rows.slice(start, start + size);
    $('[data-real-body]').innerHTML = pageRows.length ? pageRows.map((row, index) => rowHtml(row, start + index)).join('') : `<tr><td colspan="${state.view === 'versions' ? 8 : state.view === 'references' ? 10 : 11}" class="cut-real-empty">No hay registros para estos filtros.</td></tr>`;
    $('[data-real-result-count]').textContent = `${format(rows.length)} ${state.view === 'references' ? 'referencias' : 'combinaciones'}`;
    $('[data-real-page-status]').textContent = rows.length ? `Mostrando ${start + 1}–${Math.min(start + size, rows.length)} de ${format(rows.length)}` : 'Sin resultados';
    $('[data-real-prev]').disabled = state.page === 1;
    $('[data-real-next]').disabled = state.page === pages;
    let foot;
    if (state.view === 'versions') {
      const totals = [0, 1, 2, 3].map((index) => sum(rows.map((row) => row.v[index])));
      foot = `<tr><th colspan="3">Total del resultado</th>${totals.map((value) => `<td>${format(value)}</td>`).join('')}<td>${format(totals[3] - totals[2])}</td></tr>`;
    } else {
      const daysTotal = [0, 1, 2, 3, 4, 5].map((index) => sum(rows.map((row) => state.view === 'boxes' ? row.d[index] * row.b : row.d[index])));
      foot = `<tr><th colspan="${state.view === 'references' ? 3 : 4}">Total del resultado</th>${daysTotal.map((value) => `<td>${format(value)}</td>`).join('')}<td>${format(sum(daysTotal))}</td></tr>`;
    }
    $('[data-real-foot]').innerHTML = foot;
    menu.hidden = true;
  }

  function render() { heading(); filters(); renderBody(); }
  function changeView(view, row) {
    state.view = view;
    state.page = 1;
    state.group = view === 'references' ? '' : (row?.g || '');
    state.farm = view === 'references' ? '' : (row?.f || '');
    state.reference = row?.r || '';
    render();
    root.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  function openMenu(row, x, y) {
    const options = [
      ['pallets', 'Ver palés por finca'], ['boxes', 'Ver cajas por finca'],
      ['references', 'Ver consolidado por referencia'], ['versions', 'Comparar versiones']
    ].filter(([view]) => view !== state.view);
    menu.innerHTML = `<div class="cut-real-menu-title">${escape(row.f ? `${row.f} · ${row.r}` : row.r)}</div><div data-real-menu-root><button type="button" data-real-submenu>Ir a otra perspectiva <span>›</span></button><button type="button" data-real-filter-row>Mostrar solo esta referencia</button></div><div data-real-menu-sub hidden><button type="button" data-real-back>‹ Volver</button>${options.map(([view, label]) => `<button type="button" data-real-go="${view}">${label}</button>`).join('')}</div>`;
    menu._row = row;
    menu.hidden = false;
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - 250))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - 225))}px`;
    menu.querySelector('[data-real-submenu]').focus({ preventScroll: true });
  }

  function init() {
    $('[data-real-summary]').innerHTML = `<div><strong>${format(totalPallets)}</strong><span>palés programados</span></div><div><strong>${format(totalBoxes)}</strong><span>cajas calculadas</span></div><div><strong>${format(currentRows.length)}</strong><span>combinaciones actuales</span></div><div><strong>${format(refs.length)}</strong><span>referencias</span></div>`;
    render();
    root.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-real-tab]');
      if (tab) { state.view = tab.dataset.realTab; state.page = 1; state.group = ''; state.farm = ''; state.reference = ''; render(); return; }
      if (event.target.closest('[data-real-prev]')) { state.page--; renderBody(); return; }
      if (event.target.closest('[data-real-next]')) { state.page++; renderBody(); return; }
      const more = event.target.closest('[data-real-more]');
      if (more) { const row = filtered()[Number(more.dataset.realMore)]; if (row) { const rect = more.getBoundingClientRect(); openMenu(row, rect.right, rect.bottom); } }
    });
    root.querySelector('.cut-real-tabs').addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabs = [...root.querySelectorAll('[data-real-tab]')];
      const current = tabs.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      tabs[next].click();
    });
    root.addEventListener('input', (event) => {
      const filter = event.target.closest('[data-real-filter]');
      if (!filter) return;
      state[filter.dataset.realFilter] = filter.value;
      state.page = 1;
      renderBody();
    });
    root.addEventListener('change', (event) => {
      const filter = event.target.closest('[data-real-filter]');
      if (!filter) return;
      state[filter.dataset.realFilter] = filter.value;
      state.page = 1;
      renderBody();
    });
    root.addEventListener('contextmenu', (event) => {
      const target = event.target.closest('[data-real-row]');
      if (!target) return;
      event.preventDefault();
      const row = filtered()[Number(target.dataset.realRow)];
      if (row) openMenu(row, event.clientX, event.clientY);
    });
    root.addEventListener('keydown', (event) => {
      if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
        const target = event.target.closest('[data-real-row]');
        if (!target) return;
        event.preventDefault();
        const row = filtered()[Number(target.dataset.realRow)];
        const rect = target.getBoundingClientRect();
        if (row) openMenu(row, rect.left + 20, rect.top + 20);
      }
    });
    menu.addEventListener('click', (event) => {
      if (event.target.closest('[data-real-submenu]')) { menu.querySelector('[data-real-menu-root]').hidden = true; menu.querySelector('[data-real-menu-sub]').hidden = false; menu.querySelector('[data-real-back]').focus(); return; }
      if (event.target.closest('[data-real-back]')) { menu.querySelector('[data-real-menu-sub]').hidden = true; menu.querySelector('[data-real-menu-root]').hidden = false; menu.querySelector('[data-real-submenu]').focus(); return; }
      if (event.target.closest('[data-real-filter-row]')) { state.reference = menu._row.r; state.page = 1; const field = $('[data-real-filter="reference"]'); if (field) field.value = state.reference; renderBody(); return; }
      const go = event.target.closest('[data-real-go]');
      if (go) changeView(go.dataset.realGo, menu._row);
    });
    document.addEventListener('pointerdown', (event) => { if (!menu.hidden && !menu.contains(event.target) && !event.target.closest('[data-real-more]')) menu.hidden = true; });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !menu.hidden) menu.hidden = true; });
  }

  window.SIALCutNoticeRealView = { init };
})();
