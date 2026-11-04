/* UI adapters for the existing audit workbench; no authorization rules. */
(() => {
  const toolbar = document.querySelector('.audit-filter-row.primary');
  if (!toolbar) return;
  const reset = document.querySelector('#auditClearFilters');
  reset.removeAttribute('data-sial-button-adapter');
  reset.className = 'sial-filter-reset';
  reset.setAttribute('aria-label', 'Limpiar filtros');
  reset.title = 'Limpiar filtros';
  reset.innerHTML = '<svg viewBox="0 0 24 24" class="icon" aria-hidden="true"><path d="m15 3-5 9m-4 0 8 4-3 6-9-5 4-5Zm0 0 4 2m-5 3 3-4m0 6 3-4"/></svg>';
  toolbar.append(reset);
  const controls = [...document.querySelectorAll('.audit-filter-panel input, .audit-filter-panel select')];
  const initial = new Map(controls.map(control => [control, control.value]));
  const sync = () => { reset.hidden = !controls.some(control => control.value !== initial.get(control)); };
  controls.forEach(control => ['input', 'change'].forEach(type => control.addEventListener(type, sync)));
  reset.addEventListener('click', () => {
    controls.forEach(control => control.dispatchEvent(new Event(control.tagName === 'SELECT' ? 'change' : 'input', {bubbles: true})));
    sync();
    document.querySelector('#sial-library-auditSearch')?.focus();
  });
  sync();
  // Labels stay visible above every library filter.
  toolbar.querySelectorAll('select').forEach(control => {
    const field = document.createElement('div');
    field.className = 'security-filter-field';
    control.setAttribute('aria-label', ({auditYear:'Año',auditWeek:'Semana',auditEvent:'Evento',auditStatus:'Estado o sincronización'})[control.id]);
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = control.getAttribute('aria-label').replace('Filtrar por ', '');
    control.before(field); field.append(label, control);
  });
  const from = document.querySelector('#auditFromDate');
  const to = document.querySelector('#auditToDate');
  [from, to].forEach(control => control?.addEventListener('input', () => {
    const invalid = Boolean(from.value && to.value && from.value > to.value);
    to.setAttribute('aria-invalid', String(invalid));
    if (invalid) CompanyFeedback.show('Revisa el rango de fechas', 'error', 'La fecha final debe ser igual o posterior a la inicial.');
  }));
  // Preserve contextual detail/evidence markup and contain keyboard focus.
  document.addEventListener('keydown', event => {
    const overlay = document.querySelector('#auditPhotoLightbox.show [role="dialog"]') || document.querySelector('#auditDrawer.show');
    if (!overlay || event.key !== 'Tab') return;
    const items = [...overlay.querySelectorAll('button:not(:disabled), a[href], input, [tabindex="0"]')].filter(e => e.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelector('#auditDrawer')?.setAttribute('role', 'dialog');
  document.querySelector('#auditDrawer')?.setAttribute('aria-modal', 'true');
})();
