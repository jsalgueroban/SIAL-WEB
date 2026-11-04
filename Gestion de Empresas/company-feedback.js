/* Feedback del prototipo: el adaptador monta el Toast publicado de la librería. */
(() => {
  const key = 'sial-company-feedback-v1';
  let timer;
  function host() {
    const page = document.querySelector('main .page');
    if (!page) return null;
    let node = page.querySelector(':scope > [data-sial-toast-adapter][data-company-feedback]');
    if (!node) {
      node = document.createElement('div');
      node.dataset.sialToastAdapter = '';
      node.dataset.companyFeedback = '';
      node.hidden = true;
      page.append(node);
    }
    return node;
  }
  function show(title, variant = 'success', description = '') {
    const node = host();
    if (!node) return;
    clearTimeout(timer);
    node.dataset.sialToastTitle = title;
    node.dataset.sialToastVariant = variant;
    node.textContent = description;
    node.hidden = false;
    timer = setTimeout(() => { node.hidden = true; }, 5000);
  }
  function next(target, title) {
    try { sessionStorage.setItem(key, JSON.stringify({ target, title })); } catch { /* No afecta el guardado. */ }
  }
  function confirm(title, description, action) {
    return new Promise((resolve) => {
      const previous = document.activeElement;
      const dialog = document.createElement('dialog');
      dialog.className = 'company-confirm';
      dialog.setAttribute('aria-labelledby', 'company-confirm-title');
      dialog.setAttribute('aria-describedby', 'company-confirm-description');
      const heading = document.createElement('h2'); heading.id = 'company-confirm-title'; heading.textContent = title;
      const message = document.createElement('p'); message.id = 'company-confirm-description'; message.textContent = description;
      const actions = document.createElement('div'); actions.className = 'company-confirm-actions';
      const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'btn btn-secondary'; cancel.dataset.sialButtonAdapter = ''; cancel.textContent = 'Cancelar';
      const accept = document.createElement('button'); accept.type = 'button'; accept.className = 'btn btn-primary'; accept.dataset.sialButtonAdapter = ''; accept.textContent = action;
      actions.append(cancel, accept); dialog.append(heading, message, actions); document.body.append(dialog);
      let accepted = false;
      cancel.addEventListener('click', () => dialog.close());
      accept.addEventListener('click', () => { accepted = true; dialog.close(); });
      dialog.addEventListener('keydown', (event) => { if (event.key === 'Escape') { event.preventDefault(); dialog.close(); } });
      dialog.addEventListener('close', () => { dialog.remove(); if (previous?.isConnected) previous.focus(); resolve(accepted); }, { once: true });
      dialog.showModal();
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (dialog.open && (document.activeElement === document.body || document.activeElement === dialog || document.activeElement === cancel)) {
          (cancel.previousElementSibling?.querySelector('button') || cancel).focus();
        }
      }));
    });
  }
  window.CompanyFeedback = { show, next, confirm };
  function init() {
    host();
    try {
      const message = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (message && location.pathname.endsWith('/' + message.target)) {
        sessionStorage.removeItem(key);
        show(message.title);
      }
    } catch { /* La navegación sigue disponible si falla el almacenamiento de sesión. */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
