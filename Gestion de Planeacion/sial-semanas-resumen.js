/* Resumen de la propuesta: se calcula a partir de los registros y catálogo de ejemplo. */
window.SIALWeekSummary = (() => {
  function init() {
    const yearFilter = document.querySelector('#weekYear');
    const rows = Array.from(document.querySelectorAll('.table-wrap tbody tr[data-year]'));
    const sequence = document.querySelector('[data-week-sequence]');
    const description = document.querySelector('[data-week-sequence-description]');
    if (!rows.length || !sequence || !description) return;
    const years = [...new Set(rows.map(row => row.dataset.year))].sort((a, b) => Number(b) - Number(a));
    // Caso local de composición; Semanas conserva dos indicadores por defecto.
    const grid = document.querySelector('.week-indicator-grid');
    if (new URLSearchParams(location.search).get('indicators') === '3' && grid && !grid.querySelector('[data-week-summary-inactive]')) {
      const card = document.createElement('article');
      card.className = 'week-indicator';
      card.innerHTML = '<div><h2>Semanas inactivas</h2><p>Del año consultado</p></div><strong data-week-summary-inactive>—</strong>';
      grid.append(card);
    }
    let catalog = [];
    let catalogLoaded = false;
    function render() {
      const year = yearFilter?.value !== 'all' ? yearFilter.value : (years.includes(String(new Date().getFullYear())) ? String(new Date().getFullYear()) : years[0]);
      const weeks = rows.filter(row => row.dataset.year === year);
      const first = weeks.find(row => Number(row.dataset.week) === 1);
      const yearLabel = document.querySelector('[data-week-summary-year]');
      if (yearLabel) yearLabel.textContent = year || '—';
      document.querySelector('[data-week-summary-total]').textContent = String(weeks.length);
      document.querySelector('[data-week-summary-active]').textContent = String(weeks.filter(row => row.dataset.status === 'active').length);
      const inactive = document.querySelector('[data-week-summary-inactive]');
      if (inactive) inactive.textContent = String(weeks.filter(row => row.dataset.status === 'inactive').length);
      description.textContent = `Ciclo de ${year}, desde la cinta inicial de la semana 1 · datos de la propuesta.`;
      sequence.replaceChildren();
      if (!catalogLoaded || !first || !catalog.length) {
        const empty = document.createElement('span');
        empty.className = 'week-ribbon-empty';
        empty.textContent = !catalogLoaded ? 'Cargando secuencia…' : 'No hay datos suficientes para mostrar el ciclo de cintas.';
        sequence.append(empty);
        return;
      }
      const initial = first.dataset.ribbon.split(' - ')[0];
      const offset = catalog.findIndex(item => item.code === initial);
      if (offset < 0) {
        const empty = document.createElement('span'); empty.className = 'week-ribbon-empty';
        empty.textContent = 'La cinta inicial no está disponible en el catálogo de la propuesta.'; sequence.append(empty); return;
      }
      [...catalog.slice(offset), ...catalog.slice(0, offset)].forEach(item => {
        const label = document.createElement('span');
        label.className = 'week-sequence-item';
        label.dataset.ribbonCode = item.code;
        const swatch = document.createElement('span');
        swatch.className = 'week-sequence-swatch'; swatch.setAttribute('aria-hidden', 'true');
        const code = document.createElement('strong'); code.textContent = item.code;
        const name = document.createElement('span'); name.textContent = item.name === 'Cafe' ? 'Café' : item.name;
        label.append(swatch, code, name); sequence.append(label);
      });
    }
    yearFilter?.addEventListener('change', render);
    const observer = new MutationObserver(render);
    rows.forEach(row => observer.observe(row, { attributes: true, attributeFilter: ['data-status'] }));
    render();
    fetch('gestion-cintas.html').then(response => { if (!response.ok) throw new Error('Catálogo no disponible'); return response.text(); }).then(html => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      catalog = Array.from(doc.querySelectorAll('tbody tr[data-code][data-order]'))
        .filter(row => row.dataset.status === 'active')
        .map(row => ({ code: row.dataset.code, name: row.dataset.name, order: Number(row.dataset.order) }))
        .sort((a, b) => a.order - b.order);
    }).catch(() => { catalog = []; }).finally(() => { catalogLoaded = true; render(); });
  }
  return { init };
})();
