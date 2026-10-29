/* Datos de demostración locales al navegador. */
(() => {
  const key = 'sial-proposal-clients-v1';
  const tbody = document.querySelector('.table-wrap tbody');
  const templates = [...tbody.rows], seeds = templates.map(row => ({...row.dataset}));
  const form = document.querySelector('[data-generic-form]');
  const fields = {code:'clientCode',name:'clientName',taxid:'clientTaxId',context:'clientType',country:'clientCountry',contact:'clientContact',email:'clientEmail'};
  const types = {exportador:'Exportador',cliente:'Cliente comercial',mixto:'Cliente + exportador'};
  let editing = null;
  function read() { const raw = localStorage.getItem(key); if (!raw) return structuredClone(seeds); const data = JSON.parse(raw); if (!Array.isArray(data)) throw new Error('No se pudieron leer los clientes locales.'); return data; }
  function showError(id, message) { const input=document.getElementById(id), note=document.getElementById(`${id}Note`); input.setAttribute('aria-invalid','true'); if (note) { note.textContent=message; note.classList.add('error'); } (document.getElementById(`sial-library-${id}`)||input).focus(); }
  function stamp(action, history) { return [`${action}|Propuesta local - ${new Date().toLocaleString('es-CO')}`,history].filter(Boolean).join(';'); }
  let rows; try { rows=read(); } catch (e) { showError('clientCode',e.message); return; }
  tbody.replaceChildren();
  rows.forEach(item => {
    const tr=(templates.find(x=>x.dataset.code===item.code)||templates[0]).cloneNode(true);
    Object.assign(tr.dataset,item); tr.cells[0].textContent=item.code; tr.cells[1].textContent=item.name; tr.cells[2].textContent=item.taxid; tr.cells[3].textContent=types[item.context]||item.type||'—'; tr.cells[4].textContent=item.country; tr.cells[5].textContent=item.contact||'—';
    const badge=tr.cells[6].querySelector('.status'); badge.className=`status status-${item.status}`; badge.textContent=item.status==='active'?'Activo':'Inactivo'; tr.cells[7].textContent=(item.audit||'').split(';')[0].replace('|',' · ');
    tr.querySelector('[data-edit-inline]').addEventListener('click',()=>{ editing=item.code; Object.entries(fields).forEach(([prop,id])=>{ const input=document.getElementById(id);input.value=item[prop]||'';input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true})); }); });
    const toggle=tr.querySelector('button[aria-label="Activar cliente"],button[aria-label="Inactivar cliente"]'), activate=item.status==='inactive'; toggle.setAttribute('aria-label',activate?'Activar cliente':'Inactivar cliente'); const svg=toggle.querySelector('svg');svg.replaceChildren();const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',activate?'M20 6 9 17l-5-5':'M18 6 6 18M6 6l12 12');svg.append(path);
    toggle.addEventListener('click',()=>{if(!confirm(`¿${activate?'Activar':'Inactivar'} ${item.name}?`))return;try{const all=read(),target=all.find(x=>x.code===item.code);if(!target)throw new Error('Cliente no encontrado.');target.status=activate?'active':'inactive';target.state=activate?'Activo':'Inactivo';target.audit=stamp(activate?'Activación':'Inactivación',target.audit);localStorage.setItem(key,JSON.stringify(all));location.reload();}catch(e){showError('clientCode',e.message||'No se pudo guardar el estado.');}});
    tbody.append(tr);
  });
  document.querySelector('[data-open-inline-form]').addEventListener('click',()=>{editing=null;form.reset();});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=Object.fromEntries(Object.entries(fields).map(([prop,id])=>[prop,document.getElementById(id).value.trim()]));
    for(const prop of ['code','name','taxid','context','country'])if(!data[prop])return showError(fields[prop],'Este campo es obligatorio.');
    data.code=data.code.toUpperCase();data.name=data.name.toUpperCase();data.country=data.country.toUpperCase();data.contact=data.contact.toUpperCase();
    if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))return showError('clientEmail','Ingresa un correo válido.');
    try {const all=read();for(const prop of ['code','name'])if(all.some(x=>x.code!==editing&&x[prop].toUpperCase()===data[prop]))return showError(fields[prop],'Este valor ya existe.');let item=editing&&all.find(x=>x.code===editing);if(editing&&!item)throw new Error('Cliente no encontrado.');if(!item){item={status:'active',state:'Activo',audit:''};all.push(item);}Object.assign(item,data,{type:types[data.context]});item.audit=stamp(editing?'Edición':'Creación',item.audit);localStorage.setItem(key,JSON.stringify(all));location.reload();}catch(e){showError('clientCode',e.message||'No se pudo guardar el cliente.');}
  });
})();
