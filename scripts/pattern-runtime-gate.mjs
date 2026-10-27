// Browser-side audit of mounted SIAL components; it does not certify a HU.
export function auditPatternRuntime({ expected = [], requireNavigation = false, checkRecordCount = false, localExpandedTable = false } = {}) {
  const visible = (element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
  };
  const issues = [];
  const components = {};
  const directRoot = document.querySelector('[data-sial-react-view]');
  const visibleToasts = [...document.querySelectorAll('[role="status"], [role="alert"]')]
    .filter((element) => visible(element) && /toast/i.test(element.className?.toString() || ''));
  for (const toast of visibleToasts) {
    let container = toast;
    while (container && !['fixed', 'absolute'].includes(getComputedStyle(container).position)) container = container.parentElement;
    if (!container) {
      issues.push('toast visible dentro del flujo de lectura; usar feedback transitorio superpuesto');
    }
  }
  if (directRoot && ![...document.styleSheets].some((sheet) => sheet.href?.includes('/shared/vendor/sial-ui-runtime.css'))) {
    issues.push('React directo: no se cargó la hoja CSS publicada de la librería');
  }
  const directSelectors = {
    TextInput: 'input[id]:not([type="number"]):not([type="date"]):not([type="checkbox"])',
    SelectInput: 'button[aria-haspopup="listbox"]',
    Chip: '.bui-base-chip',
    Button: '.bui-button',
    Table: '.bui-table',
    Pagination: '.bui-pagination',
  };
  for (const name of expected) {
    const adapted = [...document.querySelectorAll('[data-sial-component]')]
      .filter((element) => element.dataset.sialComponent === name);
    const instances = adapted.length || !directRoot || !directSelectors[name]
      ? adapted : [...directRoot.querySelectorAll(directSelectors[name])];
    const mounted = instances.filter((element) => element.matches('input, textarea, select') || element.childElementCount > 0 || element.textContent.trim());
    const shown = mounted.filter(visible);
    components[name] = { declared: instances.length, mounted: mounted.length, visible: shown.length };
    if (!shown.length) issues.push(`${name}: no hay instancia publicada visible y montada`);
  }

  const toolbars = [...document.querySelectorAll('.toolbar, [class*="-toolbar"]')]
    .filter((element) => visible(element) && element.querySelectorAll('input, select, [role="combobox"], [role="searchbox"]').length >= 2);
  const toolbarGeometry = toolbars.map((toolbar, index) => {
    const boundary = toolbar.getBoundingClientRect();
    const controls = [...toolbar.querySelectorAll('input, select, button, [role="combobox"], [role="searchbox"]')]
      .filter(visible);
    const overflow = controls.filter((control) => control.getBoundingClientRect().bottom > boundary.bottom + 2);
    if (overflow.length) issues.push(`toolbar ${index + 1}: ${overflow.length} control(es) desbordan por abajo`);
    return { index, controls: controls.length, bottom: Math.round(boundary.bottom), overflow: overflow.length };
  });

  const nativeDuplicates = [...document.querySelectorAll('.toolbar select, .toolbar input[data-sial-search-adapter]')]
    .filter((element) => visible(element) && element.parentElement?.querySelector('[data-sial-component]'));
  if (nativeDuplicates.length) issues.push(`${nativeDuplicates.length} control(es) nativo(s) duplicado(s) visibles`);

  const tableHeaders = [...document.querySelectorAll('.table-wrap thead, [role="table"] [role="rowgroup"]')].filter(visible);
  if (localExpandedTable) {
    const table = document.querySelector('.transport-orders-table');
    const toggles = [...document.querySelectorAll('.transport-order-toggle')].filter(visible);
    if (!table || !toggles.length || toggles.some((button) => !button.hasAttribute('aria-expanded'))) {
      issues.push('tabla local HU546: faltan filas o controles de expansión accesibles');
    }
  }
  if (toolbars.length && tableHeaders.length) {
    const bottom = Math.max(...toolbars.map((element) => element.getBoundingClientRect().bottom));
    const top = Math.min(...tableHeaders.map((element) => element.getBoundingClientRect().top));
    if (top < bottom - 2) issues.push('el encabezado de tabla invade la toolbar');
  }

  if (expected.includes('Pagination')) {
    const pagination = [...document.querySelectorAll('[data-sial-component="Pagination"], [data-sial-react-view] .bui-pagination')].find(visible);
    if (pagination && !pagination.textContent.trim()) issues.push('Pagination montado sin rango, total ni navegación visible');
  }

  let recordCount;
  if (checkRecordCount) {
    const countText = [...document.querySelectorAll('[data-sial-component="Chip"], [data-sial-react-view] .bui-base-chip')]
      .filter(visible).map((element) => element.textContent.trim())
      .find((value) => /^\d+\s+registros?\b/i.test(value));
    const paginationText = [...document.querySelectorAll('[data-sial-component="Pagination"], [data-sial-react-view] .bui-pagination')]
      .filter(visible).map((element) => element.textContent.trim())[0] || '';
    const count = countText ? Number(countText.match(/^\d+/)[0]) : null;
    const total = Number(paginationText.match(/\bde\s+(\d+)\s+registros?/i)?.[1]);
    const rowSelector = localExpandedTable
      ? '.transport-orders-table tbody tr.transport-order-row'
      : '[data-sial-component="Table"] tbody tr, [data-sial-react-view] .bui-table tbody tr';
    const rows = [...document.querySelectorAll(rowSelector)].filter(visible).length;
    recordCount = { count, total: Number.isNaN(total) ? null : total, visibleRows: rows };
    if (count === null || Number.isNaN(total)) issues.push('contador o total de paginación no legible');
    else if (count !== total || rows > total) issues.push('contador, paginación y filas visibles no concuerdan');
  }

  const current = location.pathname.replace(/\/$/, '');
  const navigation = [...document.querySelectorAll('nav a[href], [role="navigation"] a[href]')]
    .filter((anchor) => {
      try { return new URL(anchor.href, location.href).pathname.replace(/\/$/, '') === current; }
      catch { return false; }
    });
  if (requireNavigation && !navigation.length) issues.push('no existe enlace de navegación hacia esta vista');

  return {
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    components,
    toolbarGeometry,
    recordCount,
    navigationLinks: navigation.length,
    issues,
    passed: issues.length === 0,
  };
}
