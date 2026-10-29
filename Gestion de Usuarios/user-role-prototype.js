/* Relaciones de demostración guardadas solo en este navegador. */
(() => {
  const key = 'sial-proposal-user-company-roles-v1';
  const catalog = {
    'SIAL Central': [['Administrador general','Acceso administrativo completo.'],['Seguridad y roles','Gestión de usuarios, roles y permisos.'],['Consulta auditoria','Consulta trazabilidad y reportes.'],['Coordinador logistico','Gestiona flujos operativos.'],['Gestor documental','Administra soportes y documentos.']],
    Banapalma: [['Supervisor campo','Gestión operativa regional.'],['Gestor documental','Administra soportes y documentos.'],['Consulta operativa','Acceso de lectura operacional.']],
    AgroCeiba: [['Consulta historica','Acceso de lectura histórica.']]
  };
  const defaults = {'SIAL Central':['Administrador general','Seguridad y roles'],Banapalma:['Supervisor campo']};
  const select = document.getElementById('companyEdit'), available = document.getElementById('availableRoles'), assigned = document.getElementById('assignedRoles');
  const feedback = document.getElementById('roleEditFeedback'), relations = document.getElementById('userRelations');
  const count = document.querySelector('.relation-summary-head [data-sial-chip-adapter]');
  const audit = document.getElementById('relationAudit');
  let saved, working = [], selections = new Set(), dragged = null;
  const preview = document.createElement('div');
  preview.className = 'user-role-drag-preview';
  preview.setAttribute('aria-hidden', 'true');
  const previewIcon = document.createElement('span');
  previewIcon.className = 'user-role-drag-preview-icon';
  previewIcon.innerHTML = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5 42 15v18L24 43 6 33V15L24 5Z" stroke="currentColor" stroke-width="2.5"/><path d="m6 15 18 10 18-10M24 25v18" stroke="currentColor" stroke-width="2.5"/></svg>';
  const previewText = document.createElement('span');
  preview.append(previewIcon, previewText);
  document.body.append(preview);
  function clearDrag(){
    for(const box of [available,assigned]){
      box.classList.remove('is-role-drop-target');
      box.querySelectorAll('.is-role-dragging').forEach(card=>card.classList.remove('is-role-dragging'));
    }
    dragged=null;
  }
  function read(){const raw=localStorage.getItem(key);if(!raw)return {user:'m.garcia',relations:structuredClone(defaults),audit:[]};const value=JSON.parse(raw);if(!value || value.user!=='m.garcia' || !value.relations || typeof value.relations!=='object')throw new Error('No se pueden leer las asignaciones locales.');return value;}
  function message(text, bad=false){feedback.textContent=text;feedback.classList.toggle('error',bad);}
  try { saved=read(); } catch(e){message(e.message,true);document.getElementById('saveUserRoles').disabled=true;return;}
  function roleCard(role,description){const label=document.createElement('label');label.className='role-option';label.dataset.role=role;const input=document.createElement('input');input.type='checkbox';input.checked=selections.has(role);const text=document.createElement('span'),title=document.createElement('strong'),desc=document.createElement('span');title.textContent=role;desc.textContent=description;text.append(title,desc);label.append(input,text);return label;}
  function render(){
    const company=select.value;available.replaceChildren();assigned.replaceChildren();
    for(const [box,title] of [[available,'Roles disponibles en la empresa'],[assigned,'Roles asignados al usuario']]){const head=document.createElement('p');head.className='role-box-title';head.textContent=title;box.append(head);}
    for(const [role,description] of catalog[company]||[])(working.includes(role)?assigned:available).append(roleCard(role,description));
    for(const box of [available,assigned])if(box.querySelectorAll('.role-option').length===0){const empty=document.createElement('p');empty.className='field-note';empty.textContent='No hay roles en esta lista.';box.append(empty);}
    requestAnimationFrame(()=>document.querySelectorAll('[data-sial-role-card-adapter] .sial-library-role-card').forEach(el=>{el.draggable=true;}));
  }
  function renderRelations(){
    relations.replaceChildren();const entries=Object.entries(saved.relations).filter(([,roles])=>roles.length);
    count.textContent=`${entries.length} ${entries.length===1?'relación activa':'relaciones activas'}`;
    for(const [company,roles] of entries){const item=document.createElement('div');item.className='assignment-item';const info=document.createElement('div'),heading=document.createElement('strong'),detail=document.createElement('div');heading.textContent=company;detail.className='muted';detail.textContent=roles.join(', ');info.append(heading,detail);const actions=document.createElement('div');actions.className='assignment-actions';const edit=document.createElement('button');edit.type='button';edit.className='btn btn-secondary';edit.textContent='Editar';edit.addEventListener('click',()=>{select.value=company;select.dispatchEvent(new Event('change',{bubbles:true}));select.scrollIntoView({block:'center'});});const remove=document.createElement('button');remove.type='button';remove.className='btn btn-secondary';remove.textContent='Quitar';remove.addEventListener('click',()=>{if(entries.length<=1){message('El usuario debe conservar al menos una empresa activa con roles.',true);return;}if(!confirm(`¿Quitar la relación con ${company}?`))return;try{const next=read();delete next.relations[company];next.audit.unshift({company,action:'Relación eliminada',at:new Date().toISOString(),actor:'Propuesta local'});localStorage.setItem(key,JSON.stringify(next));saved=next;load();renderRelations();message('Relación eliminada en este navegador.');}catch{message('No se pudo guardar la relación.',true);}});actions.append(edit,remove);item.append(info,actions);relations.append(item);}
  }
  function load(){working=[...(saved.relations[select.value]||[])];selections.clear();audit.value=saved.audit.find(x=>x.company===select.value)?.at ? new Date(saved.audit.find(x=>x.company===select.value).at).toLocaleString('es-CO') : '';audit.dispatchEvent(new Event('input',{bubbles:true}));render();}
  function move(from,to){const relevant=[...from.querySelectorAll('.role-option')].map(x=>x.dataset.role).filter(x=>selections.has(x));if(!relevant.length){message('Selecciona al menos un rol para moverlo.',true);return;}working=to===assigned?[...new Set([...working,...relevant])]:working.filter(x=>!relevant.includes(x));selections.clear();render();message('Cambios pendientes por guardar.');
    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      setTimeout(()=>{for(const label of to.querySelectorAll('.role-option')){if(!relevant.includes(label.dataset.role))continue;const card=label.previousElementSibling;if(!card?.classList.contains('sial-library-role-card'))continue;card.animate([{opacity:.45,transform:'translateY(-8px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:260,easing:'cubic-bezier(.23,1,.32,1)'});}},60);
    }
  }
  for(const box of [available,assigned]){
    box.addEventListener('change',e=>{const label=e.target.closest('.role-option');if(!label)return;e.target.checked?selections.add(label.dataset.role):selections.delete(label.dataset.role);});
    box.addEventListener('dragstart',e=>{const card=e.target.closest('.sial-library-role-card'),label=card?.nextElementSibling;if(!label?.dataset.role){e.preventDefault();return;}dragged=box;if(!selections.has(label.dataset.role)){selections.clear();selections.add(label.dataset.role);}const moving=[...box.querySelectorAll('.role-option')].filter(item=>selections.has(item.dataset.role));previewText.textContent=moving.length===1?'1 rol':`${moving.length} roles`;e.dataTransfer.setData('text/plain','roles');e.dataTransfer.effectAllowed='move';e.dataTransfer.setDragImage(preview,29,29);for(const item of moving)item.previousElementSibling?.classList.add('is-role-dragging');});
    box.addEventListener('dragover',e=>{if(dragged&&dragged!==box){e.preventDefault();e.dataTransfer.dropEffect='move';box.classList.add('is-role-drop-target');}});
    box.addEventListener('dragleave',e=>{if(!box.contains(e.relatedTarget))box.classList.remove('is-role-drop-target');});
    box.addEventListener('drop',e=>{if(dragged&&dragged!==box){e.preventDefault();const source=dragged;clearDrag();move(source,box);}else clearDrag();});
    box.addEventListener('dragend',clearDrag);
  }
  document.getElementById('addSelectedRoles').addEventListener('click',()=>move(available,assigned));
  document.getElementById('removeSelectedRoles').addEventListener('click',()=>move(assigned,available));
  select.addEventListener('change',()=>{load();message('');});
  document.getElementById('restoreUserRoles').addEventListener('click',()=>{load();message('Se restauraron los roles guardados.');});
  document.getElementById('saveUserRoles').addEventListener('click',()=>{if(!working.length){message('Selecciona al menos un rol para guardar la relación.',true);return;}try{const next=read();next.relations[select.value]=[...working];next.audit.unshift({company:select.value,action:'Roles actualizados',at:new Date().toISOString(),actor:'Propuesta local'});localStorage.setItem(key,JSON.stringify(next));saved=next;load();renderRelations();message('Roles guardados en este navegador; no se modificó el sistema real.');}catch{message('No se pudieron guardar los roles en este navegador.',true);}});
  load();renderRelations();
})();
