/* Catálogos de demostración de Empresa, almacenados en este navegador. */
window.CompanyTaxonomy = (() => {
  function init(kind) {
    const isType = kind === 'type';
    const key = isType ? 'sial-proposal-company-types-v1' : 'sial-proposal-company-type-relations-v1';
    const tbody = document.querySelector('.table-wrap tbody');
    const templates = [...tbody.rows];
    const form = document.querySelector(isType ? '[data-catalog-form]' : '#companyTypeRelationForm');
    const company = document.getElementById('companyCodeSelect');
    const type = document.getElementById('companyTypeSelect');
    const name = document.getElementById('companyTypeName');
    const note = document.getElementById('formOk');
    const title = document.querySelector('[data-inline-form-title]');
    let editing = null;
    const seed = templates.map(row => {
      const x = {...row.dataset};
      if (!isType) x.typeId = [...type.options].find(option => option.textContent.trim().toUpperCase() === String(x.type).toUpperCase())?.value || '';
      return x;
    });
    function read() {
      const raw = localStorage.getItem(key);
      if (!raw) {
        const legacy = JSON.parse(localStorage.getItem(`sial-catalog-state:${location.pathname}`) || '{}');
        if (!legacy || Array.isArray(legacy) || typeof legacy !== 'object') throw new Error('No se pudieron leer los estados guardados.');
        return structuredClone(seed).map(item => {
          const previous = legacy[item.code];
          return previous && ['active','inactive'].includes(previous.status) ? {...item,status:previous.status,audit:previous.audit || item.audit} : item;
        });
      }
      const rows = JSON.parse(raw);
      if (!Array.isArray(rows)) throw new Error('No se pudieron leer los registros guardados.');
      return rows;
    }
    function error(message) { note.classList.remove('is-hidden'); note.classList.add('error'); note.setAttribute('role','alert'); note.textContent = message; }
    function change(input, value) { input.value = value; input.dispatchEvent(new Event(input.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true})); }
    let rows;
    try { rows = read(); } catch (e) { error(e.message); return; }
    tbody.replaceChildren();
    rows.forEach(item => {
      const row = (templates.find(t => t.dataset.code === item.code) || templates[0]).cloneNode(true);
      Object.assign(row.dataset, item);
      if (!isType) row.dataset.id = `${item.code}|${item.typeId}`;
      if (isType) { row.cells[0].textContent=item.code; row.cells[1].textContent=item.name; row.cells[2].textContent=item.use || 'Sin descripción'; }
      else { row.cells[0].replaceChildren(document.createTextNode(item.code),document.createElement('br')); const span=document.createElement('span');span.className='muted';span.textContent=item.name;row.cells[0].append(span); row.cells[1].textContent=item.type; }
      const badge=row.querySelector('.status'); if (badge) {badge.className=`status status-${item.status || 'active'}`;badge.textContent=item.status==='inactive'?'Inactivo':'Activo';}
      const toggle=row.querySelector('button[aria-label^="Activar"],button[aria-label^="Inactivar"]');
      if (toggle) {
        const label=(toggle.getAttribute('aria-label') || 'registro').replace(/^(Activar|Inactivar)\s+/i,'');
        const activate=item.status==='inactive';
        toggle.setAttribute('aria-label',`${activate?'Activar':'Inactivar'} ${label}`);
        toggle.innerHTML=activate?'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>':'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 6-12 12"></path><path d="m6 6 12 12"></path></svg>';
      }
      const edit=row.querySelector('[data-edit-inline]');
      edit?.addEventListener('click',()=>{ editing=isType ? item.code : `${item.code}|${item.typeId}`; if(isType)change(name,item.name);else{change(company,item.code);change(type,item.typeId);} note.classList.add('is-hidden'); });
      row._sialPersistState=({status,audit})=>{const all=read();const target=all.find(x=>isType?x.code===item.code:`${x.code}|${x.typeId}`===`${item.code}|${item.typeId}`);if(!target)throw new Error('Registro no encontrado.');target.status=status;target.audit=audit;localStorage.setItem(key,JSON.stringify(all));};
      tbody.append(row);
    });
    document.querySelector('[data-open-inline-form]')?.addEventListener('click',()=>{editing=null;note.classList.add('is-hidden');});
    document.querySelector('[data-cancel-inline-form]')?.addEventListener('click',()=>{editing=null;note.classList.add('is-hidden');});
    form.addEventListener('submit', event => {
      event.preventDefault();
      try {
        const all=read();
        if(isType) {
          const value=name.value.trim().toLocaleUpperCase('es');
          if(value.length<3)return error('Ingresa un nombre de al menos tres caracteres.');
          if(all.some(x=>x.code!==editing && x.name.toLocaleUpperCase('es')===value))return error('Ya existe un tipo con ese nombre.');
          let item=editing&&all.find(x=>x.code===editing);
          if(editing&&!item)throw new Error('El tipo ya no está disponible.');
          if(!item){item={code:String(Math.max(0,...all.map(x=>Number(x.code)||0))+1),status:'active',context:'',use:'Sin descripción'};all.push(item);}
          item.name=value;
        } else {
          if(!company.value||!type.value)return error('Selecciona una empresa y un tipo.');
          const id=`${company.value}|${type.value}`;
          if(all.some(x=>`${x.code}|${x.typeId}`===id && id!==editing))return error('La relación entre empresa y tipo ya existe.');
          let item=editing&&all.find(x=>`${x.code}|${x.typeId}`===editing);
          if(editing&&!item)throw new Error('La relación ya no está disponible.');
          if(!item){item={status:'active'};all.push(item);}
          const label=company.selectedOptions[0].textContent.split(' - ').slice(1).join(' - ').trim() || company.selectedOptions[0].textContent;
          Object.assign(item,{code:company.value,name:label,typeId:type.value,type:type.selectedOptions[0].textContent.trim(),context:type.selectedOptions[0].textContent.trim()});
        }
        localStorage.setItem(key,JSON.stringify(all));
        window.CompanyFeedback?.next(location.pathname.split('/').pop(), editing ? 'Cambios guardados' : isType ? 'Tipo registrado' : 'Relación registrada');
        location.reload();
      } catch(e) { window.CompanyFeedback?.show('No se pudo guardar','error',e.message || 'Intenta nuevamente.'); }
    });
  }
  return {init};
})();
