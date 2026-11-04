(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const toolbarSelector = '.toolbar, .filters, .workflow-filters, .sial-ui-master-toolbar, .sial-ui-category-toolbar, .materials-date-range, .permission-toolbar';
  const resetSelector = '.sial-filter-reset, .sial-filter-reset-row';
  const visibleReset = (toolbar) => Array.from(toolbar.children).find((item) =>
    item.matches(resetSelector) && getComputedStyle(item).display !== 'none' && !item.hidden);
  const bounds = (toolbar) => new Map(Array.from(toolbar.children)
    .filter((item) => !item.matches(resetSelector) && item.getBoundingClientRect().width)
    .map((item) => [item, item.getBoundingClientRect()]));

  function capture(event) {
    if (reduced.matches) return;
    // SelectInput renders its listbox in a portal outside the toolbar. Capture the
    // toolbar before the option's click or keyboard handler changes React state.
    const toolbars = document.querySelectorAll(`main ${toolbarSelector.split(', ').join(', main ')}`);
    toolbars.forEach((toolbar) => captureToolbar(toolbar));
  }

  function captureToolbar(toolbar) {
    const before = bounds(toolbar);
    const reset = visibleReset(toolbar);
    const resetRect = reset?.getBoundingClientRect();
    // React and the legacy adapters both commit their filter state after the event.
    requestAnimationFrame(() => {
      const nextReset = visibleReset(toolbar);
      if (Boolean(reset) === Boolean(nextReset)) return;
      for (const [item, first] of before) {
        if (!item.isConnected) continue;
        const last = item.getBoundingClientRect();
        if (!last.width || !last.height) continue;
        const dx = first.left - last.left;
        const dy = first.top - last.top;
        const sx = first.width / last.width;
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.002) continue;
        item.getAnimations().filter((animation) => animation.id === 'farm-filter-layout').forEach((animation) => animation.cancel());
        const animation = item.animate([
          { transform: `translate(${dx}px, ${dy}px) scaleX(${sx})`, transformOrigin: 'left bottom', offset: 0 },
          { transform: `translate(${-dx * 0.09}px, ${-dy * 0.09}px) scaleX(${1 + (1 - sx) * 0.09})`, transformOrigin: 'left bottom', offset: 0.68 },
          { transform: 'translate(0, 0) scaleX(1)', transformOrigin: 'left bottom', offset: 1 }
        ], { duration: 520, easing: 'cubic-bezier(.22, .8, .24, 1)' });
        animation.id = 'farm-filter-layout';
      }
      if (nextReset) {
        nextReset.animate([
          { opacity: 0, transform: 'translateX(-16px) scale(.78)', offset: 0 },
          { opacity: 1, transform: 'translateX(3px) scale(1.08)', offset: 0.68 },
          { opacity: 1, transform: 'translateX(0) scale(1)', offset: 1 }
        ], { duration: 480, easing: 'cubic-bezier(.22, .8, .24, 1)' });
      } else if (resetRect && resetRect.width) {
        const ghost = reset.cloneNode(true);
        ghost.setAttribute('aria-hidden', 'true');
        ghost.setAttribute('inert', '');
        ghost.removeAttribute('id');
        ghost.classList.remove('is-hidden');
        Object.assign(ghost.style, { position: 'fixed', left: `${resetRect.left}px`, top: `${resetRect.top}px`, width: `${resetRect.width}px`, height: `${resetRect.height}px`, margin: '0', pointerEvents: 'none', zIndex: '20' });
        ghost.hidden = false;
        document.body.appendChild(ghost);
        ghost.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'translateX(-6px) scale(.9)' }], { duration: 180, easing: 'ease-out' }).finished.finally(() => ghost.remove());
      }
    });
  }
  ['input', 'change', 'click', 'keydown'].forEach((type) => document.addEventListener(type, capture, true));
})();
