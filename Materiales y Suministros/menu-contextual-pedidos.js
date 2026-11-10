(() => {
  'use strict';

  // Datos ilustrativos del prototipo. Las vistas reales conservan sus reglas y permisos.
  const contexts = {
    orders: {
      title: 'Pedidos de materiales',
      subtitle: 'El menú muestra accesos propios del pedido y de su estado.',
      search: 'Buscar pedido o finca',
      placeholder: 'Código o finca',
      singular: 'pedido',
      plural: 'pedidos',
      headers: ['Pedido', 'Finca', 'Material destacado', 'Disponibilidad', 'Estado', 'Acciones'],
      entries: [
        { id: 'PED-2026-10482', primary: 'PED-2026-10482', secondary: 'Finca Santa Isabel', item: 'Caja cartón corrugado', metric: 'Parcial', status: 'pending', label: 'Pendiente', subline: 'Sugerido', approval: true },
        { id: 'PAD-2026-32-002', primary: 'PAD-2026-32-002', secondary: 'Finca El Retiro', item: 'Etiqueta de identificación', metric: 'Parcial', status: 'review', label: 'En revisión', subline: 'Adicional', approval: true },
        { id: 'PED-1044', primary: 'PED-1044', secondary: 'Finca La Palma', item: 'Esquineros kraft', metric: 'Disponible', status: 'closed', label: 'Cerrado', subline: 'Recurrente', approval: false },
      ],
    },
    materials: {
      title: 'Catálogo de materiales',
      subtitle: 'La acción parte del código SAP, sin ocupar columnas con varios botones.',
      search: 'Buscar código o material',
      placeholder: 'Código SAP o nombre',
      singular: 'material',
      plural: 'materiales',
      headers: ['Código SAP', 'Referencia', 'Material', 'Unidad', 'Estado', 'Acciones'],
      entries: [
        { id: 'PAR-16FT7BD-8-101279', primary: '101279', secondary: '16FT7BD-8', item: 'BASE BBS11 FYFFES 13 KG (20 UND) V2', metric: 'UN', status: 'review', label: 'En revisión', subline: 'Código SAP' },
        { id: 'PAR-16FT7BD-8-5418', primary: '5418', secondary: '16FT7BD-8', item: 'ESQUINERO KRAFT 2.13 MTS (20 UND)', metric: 'UN', status: 'review', label: 'En revisión', subline: 'Código SAP' },
        { id: 'PAR-16FT7BD-8-4925', primary: '4925', secondary: '16FT7BD-8', item: 'ZUNCHO AMARILLO SIN IMPRESIÓN', metric: 'M', status: 'review', label: 'En revisión', subline: 'Código SAP' },
      ],
    },
    stock: {
      title: 'Inventario por finca',
      subtitle: 'Las opciones usan el material y la finca de la fila seleccionada.',
      search: 'Buscar material o finca',
      placeholder: 'Código SAP o finca',
      singular: 'saldo',
      plural: 'saldos',
      headers: ['Código SAP', 'Finca', 'Material', 'Disponible', 'Estado', 'Acciones'],
      entries: [
        { id: 'STK-001', primary: '101279', secondary: 'Finca Santa Isabel', item: 'Caja cartón corrugado', metric: '1.280 unidades', reserved: '120 unidades', movement: 'Entrada por recepción · MOV-8821', status: 'active', label: 'Activo', subline: 'Saldo STK-001' },
        { id: 'STK-002', primary: '101279', secondary: 'Finca El Retiro', item: 'Caja cartón corrugado', metric: '360 unidades', reserved: '40 unidades', movement: 'Ajuste por daño · MOV-8814', status: 'review', label: 'En revisión', subline: 'Saldo STK-002' },
        { id: 'STK-003', primary: '1970', secondary: 'Finca Santa Isabel', item: 'Estiba madera exportación', metric: '94 unidades', reserved: '12 unidades', movement: 'Salida a orden OTI-546-001', status: 'active', label: 'Activo', subline: 'Saldo STK-003' },
      ],
    },
  };

  // Cada contexto aporta comandos; el motor del menú conserva foco, posición y entradas.
  const actionSets = {
    orders: [
      { label: 'Consultar pedido', children: [
        { label: 'Ver resumen', action: 'summary' },
        { label: 'Consultar disponibilidad', action: 'availability' },
      ] },
      { label: 'Copiar código', action: 'copy' },
      { separator: true },
      { label: 'Abrir aprobación', hint: 'Pedido', action: 'approval', when: (entry) => entry.approval },
      { label: 'Ir a trazabilidad', hint: 'Bandeja', action: 'trace' },
    ],
    materials: [
      { label: 'Ver ficha del material', hint: 'Aquí', action: 'summary' },
      { label: 'Copiar código SAP', action: 'copy' },
      { separator: true },
      { label: 'Consultar inventario', children: [
        { label: 'Todas las fincas', action: 'inventory' },
        { label: 'Finca Santa Isabel', action: 'inventory', location: 'Finca Santa Isabel' },
        { label: 'Finca El Retiro', action: 'inventory', location: 'Finca El Retiro' },
      ] },
      { label: 'Abrir catálogo', hint: 'Bandeja', action: 'catalog' },
    ],
    stock: [
      { label: 'Consultar saldo', children: [
        { label: 'Ver saldo de finca', action: 'summary' },
        { label: 'Ver último movimiento', action: 'movement' },
      ] },
      { label: 'Copiar código SAP', action: 'copy' },
      { separator: true },
      { label: 'Abrir movimientos del material', hint: 'Código SAP', action: 'movements' },
    ],
  };

  const rows = document.getElementById('contextRows');
  const featured = document.getElementById('featureSurface');
  const menu = document.getElementById('contextMenu');
  const panel = document.getElementById('detailPanel');
  const search = document.getElementById('contextSearch');
  const filter = document.getElementById('statusFilter');
  const toast = document.getElementById('demoToast');
  const tabs = [...document.querySelectorAll('[role="tab"][data-context]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let context = 'orders';
  let activeEntry = null;
  let trigger = null;
  let toastTimer = 0;
  let lastInput = 'pointer';
  let stockLocation = '';
  let submenuParent = null;
  let submenuTimer = 0;

  const config = () => contexts[context];
  const entryFor = (row) => config().entries.find((entry) => entry.id === row?.dataset.contextId);
  const compactMenu = () => window.matchMedia('(max-width: 720px)').matches;
  const rootItems = () => [...menu.querySelectorAll('.context-demo-menu-root [role="menuitem"]')];
  const childItems = () => [...menu.querySelectorAll('.context-demo-submenu [role="menuitem"]')];
  const activeItems = () => submenuParent && compactMenu() ? childItems() : submenuParent && document.activeElement?.closest('.context-demo-submenu') ? childItems() : rootItems();

  function filteredEntries() {
    const query = search.value.trim().toLocaleLowerCase('es');
    return config().entries.filter((entry) =>
      (filter.dataset.value === 'all' || entry.status === filter.dataset.value) &&
      (context !== 'stock' || !stockLocation || entry.secondary === stockLocation) &&
      [entry.primary, entry.secondary, entry.item, entry.metric].join(' ').toLocaleLowerCase('es').includes(query)
    );
  }

  function renderRows() {
    const visible = filteredEntries();
    rows.replaceChildren();
    visible.forEach((entry) => {
      const row = document.createElement('tr');
      row.dataset.contextId = entry.id;
      row.tabIndex = 0;
      row.setAttribute('aria-label', `${entry.primary}, ${entry.secondary}, ${entry.label}. Mayús más F10 para abrir acciones.`);
      [entry.primary, entry.secondary, entry.item, entry.metric, entry.label].forEach((value, index) => {
        const cell = document.createElement('td');
        cell.dataset.label = config().headers[index];
        if (index === 0) {
          const wrapper = document.createElement('span');
          wrapper.className = 'context-code';
          const code = document.createElement('strong');
          code.textContent = value;
          const subline = document.createElement('small');
          subline.textContent = entry.subline;
          wrapper.append(code, subline);
          cell.append(wrapper);
        } else if (index === 4) {
          const status = document.createElement('span');
          status.className = 'context-status';
          status.dataset.status = entry.status;
          status.textContent = value;
          cell.append(status);
        } else cell.textContent = value;
        row.append(cell);
      });
      const actions = document.createElement('td');
      const more = document.createElement('button');
      more.className = 'context-more';
      more.type = 'button';
      more.textContent = '⋯';
      more.setAttribute('aria-label', `Más acciones para ${entry.primary} en ${entry.secondary}`);
      more.setAttribute('aria-haspopup', 'menu');
      more.setAttribute('aria-expanded', 'false');
      more.setAttribute('aria-controls', 'contextMenu');
      actions.append(more);
      row.append(actions);
      rows.append(row);
    });
    const noun = visible.length === 1 ? config().singular : config().plural;
    document.getElementById('visibleCount').textContent = `${visible.length} ${noun}`;
    document.getElementById('emptyState').hidden = visible.length > 0;
    closeMenu(false);
  }

  function renderFeatured() {
    const entry = config().entries[0];
    const card = document.createElement('div');
    card.className = 'context-demo-feature-card';
    card.dataset.contextId = entry.id;
    card.tabIndex = 0;
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `${entry.primary}, ${entry.secondary}. Mayús más F10 para abrir acciones.`);
    const label = document.createElement('div');
    label.className = 'context-demo-feature-copy';
    const eyebrow = document.createElement('span');
    eyebrow.textContent = 'También desde una tarjeta';
    const title = document.createElement('strong');
    title.textContent = entry.primary;
    const description = document.createElement('small');
    description.textContent = `${entry.secondary} · ${entry.item}`;
    label.append(eyebrow, title, description);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'context-more';
    button.textContent = '⋯';
    button.setAttribute('aria-label', `Más acciones para ${entry.primary} en tarjeta`);
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'contextMenu');
    card.append(label, button);
    featured.replaceChildren(card);
  }

  function setContext(next, query = '') {
    if (!contexts[next]) return;
    context = next;
    stockLocation = '';
    closeMenu(false);
    panel.hidden = true;
    search.value = query;
    filter.dataset.value = 'all';
    const current = config();
    document.getElementById('contextTitle').textContent = current.title;
    document.getElementById('contextSubtitle').textContent = current.subtitle;
    document.getElementById('searchLabel').textContent = current.search;
    search.placeholder = current.placeholder;
    document.getElementById('contextHeaders').replaceChildren(...current.headers.map((name) => {
      const header = document.createElement('th');
      header.textContent = name;
      return header;
    }));
    tabs.forEach((tab) => {
      const selected = tab.dataset.context === next;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) document.getElementById('contextSurface').setAttribute('aria-labelledby', tab.id);
    });
    renderStatusFilter();
    renderFeatured();
    renderRows();
  }

  function renderStatusFilter() {
    const statuses = [...new Map(config().entries.map((entry) => [entry.status, entry.label])).entries()];
    const field = document.getElementById('statusFilterField');
    field.hidden = statuses.length < 2;
    field.closest('.context-demo-toolbar').classList.toggle('is-search-only', field.hidden);
    filter.replaceChildren();
    [['all', 'Todos'], ...statuses].forEach(([value, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.status = value;
      button.textContent = label;
      button.setAttribute('aria-pressed', String(filter.dataset.value === value));
      filter.append(button);
    });
  }

  function actionsFor(entry) {
    return actionSets[context].filter((action) => !action.when || action.when(entry));
  }

  function closeMenu(restoreFocus = true) {
    if (menu.hidden) return;
    menu.hidden = true;
    clearTimeout(submenuTimer);
    submenuParent = null;
    menu.classList.remove('is-drilled');
    document.querySelectorAll('[data-context-id]').forEach((surface) => surface.classList.remove('is-active'));
    if (trigger instanceof HTMLButtonElement) trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus && trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  }

  function closeSubmenu(restoreFocus = false) {
    clearTimeout(submenuTimer);
    const child = menu.querySelector('.context-demo-submenu');
    if (!child || child.hidden) return;
    child.hidden = true;
    menu.classList.remove('is-drilled');
    submenuParent?.setAttribute('aria-expanded', 'false');
    if (restoreFocus || child.contains(document.activeElement)) submenuParent?.focus({ preventScroll: true });
    submenuParent = null;
  }

  function renderAction(action, index) {
    if (action.separator) {
      const separator = document.createElement('div');
      separator.className = 'context-demo-menu-separator';
      separator.setAttribute('role', 'separator');
      return separator;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'context-demo-menu-item';
    button.setAttribute('role', 'menuitem');
    if (action.children) {
      button.dataset.submenu = 'true';
      button.dataset.submenuIndex = String(index);
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', 'contextSubmenu');
    } else {
      button.dataset.action = action.action;
      if (action.location) button.dataset.location = action.location;
    }
    const label = document.createElement('span');
    label.textContent = action.label;
    const hint = document.createElement('span');
    hint.textContent = action.children ? '›' : action.hint || '';
    button.append(label, hint);
    return button;
  }

  function openSubmenu(parent, focusChild = false) {
    clearTimeout(submenuTimer);
    if (submenuParent && submenuParent !== parent) closeSubmenu();
    const action = actionsFor(activeEntry)[Number(parent.dataset.submenuIndex)];
    if (!action) return;
    const child = menu.querySelector('.context-demo-submenu');
    const title = child.querySelector('.context-demo-submenu-title');
    const list = child.querySelector('.context-demo-submenu-list');
    title.textContent = action.label;
    list.replaceChildren(...action.children.filter((item) => !item.when || item.when(activeEntry)).map(renderAction));
    child.hidden = false;
    submenuParent = parent;
    parent.setAttribute('aria-expanded', 'true');
    if (compactMenu()) {
      menu.classList.add('is-drilled');
    } else {
      const parentRect = parent.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const right = menuRect.right + child.offsetWidth - 6 <= window.innerWidth - 12;
      child.style.left = right ? 'calc(100% - 6px)' : 'auto';
      child.style.right = right ? 'auto' : 'calc(100% - 6px)';
      child.style.top = `${Math.max(0, Math.min(parentRect.top - menuRect.top - 6, window.innerHeight - menuRect.top - child.offsetHeight - 12))}px`;
    }
    if (focusChild) childItems()[0]?.focus({ preventScroll: true });
  }

  function openMenu(entry, x, y, source, input = 'pointer') {
    closeMenu(false);
    activeEntry = entry;
    trigger = source;
    lastInput = input;
    menu.dataset.input = input;
    menu.setAttribute('aria-label', `Acciones de ${entry.primary} en ${entry.secondary}`);
    menu.replaceChildren();
    const root = document.createElement('div');
    root.className = 'context-demo-menu-root';
    const heading = document.createElement('div');
    heading.className = 'context-demo-menu-head';
    heading.textContent = `${entry.primary} · ${entry.label}`;
    root.append(heading, ...actionsFor(entry).map(renderAction));
    const child = document.createElement('div');
    child.id = 'contextSubmenu';
    child.className = 'context-demo-submenu';
    child.setAttribute('role', 'menu');
    child.setAttribute('aria-label', 'Opciones adicionales');
    child.hidden = true;
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'context-demo-menu-back';
    back.textContent = '← Volver';
    const childTitle = document.createElement('div');
    childTitle.className = 'context-demo-submenu-title';
    const childList = document.createElement('div');
    childList.className = 'context-demo-submenu-list';
    child.append(back, childTitle, childList);
    menu.append(root, child);
    menu.hidden = false;
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    const left = Math.max(12, Math.min(x, window.innerWidth - width - 12));
    const top = Math.max(12, Math.min(y, window.innerHeight - height - 12));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.setProperty('--menu-origin-x', `${Math.max(12, Math.min(x - left, width - 12))}px`);
    menu.style.setProperty('--menu-origin-y', `${Math.max(8, Math.min(y - top, height - 8))}px`);
    document.querySelectorAll('[data-context-id]').forEach((surface) => surface.classList.toggle('is-active', surface === source || (source instanceof HTMLButtonElement && surface.contains(source))));
    if (source instanceof HTMLButtonElement) source.setAttribute('aria-expanded', 'true');
    rootItems()[0]?.focus({ preventScroll: true });
  }

  function addLink(container, label, href, primary = false) {
    const link = document.createElement('a');
    link.className = primary ? 'btn btn-primary' : 'btn btn-secondary';
    link.href = href;
    link.textContent = label;
    container.append(link);
  }

  function showDetail(entry, action) {
    const title = context === 'orders' ? 'Pedido seleccionado' : context === 'materials' ? 'Material seleccionado' : 'Saldo seleccionado';
    document.getElementById('detailKicker').textContent = title;
    document.getElementById('detailTitle').textContent = entry.primary;
    document.getElementById('detailSubtitle').textContent = entry.secondary;
    const body = document.getElementById('detailBody');
    body.replaceChildren();
    const facts = document.createElement('div');
    facts.className = 'context-demo-facts';
    const values = context === 'orders'
      ? [['Material', entry.item], ['Disponibilidad', entry.metric], ['Estado', entry.label]]
      : context === 'materials'
        ? [['Material', entry.item], ['Unidad', entry.metric], ['Estado', entry.label]]
        : [['Material', entry.item], ['Disponible', entry.metric], ['Reservado', entry.reserved]];
    values.forEach(([name, value]) => {
      const item = document.createElement('div');
      const caption = document.createElement('span');
      caption.textContent = name;
      const data = document.createElement('strong');
      data.textContent = value;
      item.append(caption, data);
      facts.append(item);
    });
    const note = document.createElement('p');
    if (action === 'movement') note.textContent = `Último movimiento: ${entry.movement}. La operación y auditoría se consultan en la vista de movimientos.`;
    else if (action === 'availability') note.textContent = 'La disponibilidad del ejemplo es ilustrativa. La decisión real requiere el stock vigente por finca y material.';
    else note.textContent = 'Este resumen conserva el contexto del registro. Las operaciones extensas continúan en su vista correspondiente.';
    const links = document.createElement('div');
    links.className = 'detail-actions';
    if (context === 'orders') {
      addLink(links, 'Ir a trazabilidad', 'trazabilidad-pedido.html');
      if (entry.approval) addLink(links, 'Ir a aprobación', `aprobacion-pedidos-materiales.html?pedido=${encodeURIComponent(entry.id)}`, true);
    } else if (context === 'materials') {
      addLink(links, 'Abrir catálogo', 'gestion-materiales.html');
    } else {
      addLink(links, 'Abrir movimientos del material', `movimientos-inventario.html?material=${encodeURIComponent(entry.primary)}`, true);
    }
    body.append(facts, note, links);
    panel.hidden = false;
    panel.dataset.input = lastInput;
    panel.scrollIntoView({ behavior: 'instant', block: 'start' });
    panel.focus({ preventScroll: true });
  }

  function notify(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }

  async function runAction(action, location = '') {
    const entry = activeEntry;
    closeMenu(false);
    if (!entry) return;
    if (action === 'summary' || action === 'availability' || action === 'movement') showDetail(entry, action);
    if (action === 'approval' && entry.approval) location.href = `aprobacion-pedidos-materiales.html?pedido=${encodeURIComponent(entry.id)}`;
    if (action === 'trace') location.href = 'trazabilidad-pedido.html';
    if (action === 'catalog') location.href = 'gestion-materiales.html';
    if (action === 'movements') location.href = `movimientos-inventario.html?material=${encodeURIComponent(entry.primary)}`;
    if (action === 'inventory') {
      setContext('stock', entry.primary);
      stockLocation = location;
      renderRows();
      document.getElementById('tab-stock').focus();
      notify(`Inventario filtrado por código ${entry.primary}${location ? ` en ${location}` : ''}.`);
    }
    if (action === 'copy') {
      try { await navigator.clipboard.writeText(entry.primary); notify(`Código ${entry.primary} copiado.`); }
      catch { notify(`No se pudo copiar. Código: ${entry.primary}`); }
    }
  }

  function bindSurface(surface) {
    surface.addEventListener('contextmenu', (event) => {
      const target = event.target.closest('[data-context-id]');
      if (!target || event.target.closest('a, input, textarea, select')) return;
      event.preventDefault();
      const entry = entryFor(target);
      if (entry) openMenu(entry, event.clientX, event.clientY, target);
    });
    surface.addEventListener('click', (event) => {
      const button = event.target.closest('.context-more');
      if (!button || !surface.contains(button)) return;
      const entry = entryFor(button.closest('[data-context-id]'));
      if (!entry) return;
      const rect = button.getBoundingClientRect();
      openMenu(entry, rect.left, rect.bottom + 5, button);
    });
    surface.addEventListener('keydown', (event) => {
      if (!((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu')) return;
      const target = event.target.closest('[data-context-id]');
      if (!target) return;
      event.preventDefault();
      const entry = entryFor(target);
      const rect = target.getBoundingClientRect();
      if (entry) openMenu(entry, rect.left + 18, rect.top + 28, target, 'keyboard');
    });
  }
  bindSurface(rows);
  bindSurface(featured);
  menu.addEventListener('click', (event) => {
    if (event.target.closest('.context-demo-menu-back')) { closeSubmenu(true); return; }
    const item = event.target.closest('[role="menuitem"]');
    if (item?.dataset.submenu) { openSubmenu(item, true); return; }
    if (item) runAction(item.dataset.action, item.dataset.location || '');
  });
  menu.addEventListener('pointerover', (event) => {
    if (compactMenu() || event.pointerType === 'touch') return;
    if (event.target.closest('.context-demo-submenu')) { clearTimeout(submenuTimer); return; }
    const item = event.target.closest('.context-demo-menu-root [role="menuitem"]');
    if (item?.dataset.submenu) {
      clearTimeout(submenuTimer);
      submenuTimer = setTimeout(() => openSubmenu(item), 120);
    } else if (item) closeSubmenu();
  });
  menu.addEventListener('pointerleave', () => {
    if (!compactMenu() && submenuParent) submenuTimer = setTimeout(() => closeSubmenu(), 260);
  });
  menu.addEventListener('keydown', (event) => {
    const items = activeItems();
    const index = items.indexOf(document.activeElement);
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key === 'ArrowRight' && document.activeElement?.dataset.submenu) { event.preventDefault(); openSubmenu(document.activeElement, true); }
    if (event.key === 'ArrowLeft' && submenuParent) { event.preventDefault(); closeSubmenu(true); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
    }
    if (event.key === 'Home') { event.preventDefault(); items[0]?.focus(); }
    if (event.key === 'End') { event.preventDefault(); items.at(-1)?.focus(); }
    if (event.key === 'Tab') closeMenu(false);
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setContext(tab.dataset.context));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      setContext(tabs[next].dataset.context);
      tabs[next].focus();
    });
  });
  document.addEventListener('pointerdown', (event) => {
    if (!menu.hidden && !menu.contains(event.target) && !event.target.closest('.context-more')) closeMenu(false);
  });
  window.addEventListener('resize', () => closeMenu(false));
  window.addEventListener('scroll', () => closeMenu(false), true);
  document.getElementById('closeDetail').addEventListener('click', () => { panel.hidden = true; });
  search.addEventListener('input', renderRows);
  filter.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-status]');
    if (!button) return;
    filter.dataset.value = button.dataset.status;
    filter.querySelectorAll('button').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderRows();
  });
  setContext('orders');
})();
