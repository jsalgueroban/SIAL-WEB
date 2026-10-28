/* Restaura foco al cerrar el detalle y limpiar filtros de las vistas vehiculares. */
function installVehicleDetailFocus(actionLabel, searchId) {
  const drawer = document.getElementById('detailDrawer');
  if (!drawer) return;
  let trigger = null;
  document.addEventListener('click', event => {
    const button = event.target.closest?.('[data-sial-component="Table"] button[aria-label]');
    if (button?.getAttribute('aria-label')?.startsWith(actionLabel)) trigger = button;
    if (event.target.closest?.('.toolbar .sial-filter-reset')) {
      requestAnimationFrame(() => document.getElementById(`sial-library-${searchId}`)?.focus());
    }
  }, true);
  let opened = drawer.classList.contains('show');
  new MutationObserver(() => {
    const now = drawer.classList.contains('show');
    if (opened && !now && trigger?.isConnected) {
      const target = trigger;
      requestAnimationFrame(() => requestAnimationFrame(() => target.focus()));
    }
    opened = now;
  }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
}
