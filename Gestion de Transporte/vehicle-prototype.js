/* Persistencia local de la propuesta: no corresponde a un servicio productivo. */
const VehiclePrototype = (() => {
  const key = 'sial-transport-vehicles-v1';
  const seed = [
    {plate:'TRK-421',vehicleType:'TRACTOMULA',carrierCompany:'TRANSLOGISTICA SAS',ownFleet:'true',palletCapacity:'32',soatNumber:'SOAT-8821',soatDisplay:'31/12/2026',techNumber:'TM-9910',techDisplay:'15/11/2026',status:'active',opstatus:'transito',oplabel:'EN TRÁNSITO A PUERTO',audit:'Editar - admin.transportes|27/04/2026 08:12;Crear - admin.transportes|20/04/2026 09:20'},
    {plate:'CMN-204',vehicleType:'CAMION',carrierCompany:'OPERADOR CARIBE SAS',ownFleet:'false',palletCapacity:'18',soatNumber:'SOAT-7755',soatDisplay:'05/05/2026',techNumber:'TM-5530',techDisplay:'08/09/2026',status:'warning',opstatus:'disponible',oplabel:'DISPONIBLE',audit:'Revision documental - auditor.logistica|27/04/2026 10:30'},
    {plate:'RIG-118',vehicleType:'CAMION RIGIDO',carrierCompany:'TRANSPORTES ANDINOS',ownFleet:'false',palletCapacity:'12',soatNumber:'SOAT-6612',techNumber:'TM-4401',status:'inactive',opstatus:'nodisponible',oplabel:'NO DISPONIBLE',audit:'Desactivar - admin.transportes|24/04/2026 14:10'}
  ];
  const fields = ['plate','vehicleType','carrierCompany','ownFleet','palletCapacity','soatNumber','soatIssuedAt','soatStartAt','soatEndAt','insuranceCompany','techNumber','certifierCompany','techIssuedAt','techEndAt'];
  function read(){try {const value=JSON.parse(localStorage.getItem(key)); return Array.isArray(value)?value:seed;} catch{return seed;}}
  function statusSaved(plate){try{return JSON.parse(localStorage.getItem(`sial-catalog-state:${location.pathname.replace('registro-vehiculo.html','gestion-vehiculos.html')}`)||'{}')[plate]}catch{return null}}
  function date(value){return value?value.slice(0,10).split('-').reverse().join('/'):'—'}
  function fieldValue(id){return document.getElementById(id)?.value.trim()||''}
  function set(id,value){const field=document.getElementById(id);if(!field)return; if(field.tagName==='SELECT' && value && !Array.from(field.options).some(option=>option.value===value))field.add(new Option(`${value} (asignación anterior)`,value));field.value=value||'';field.dispatchEvent(new Event(field.tagName==='SELECT'?'change':'input',{bubbles:true}));}
  function showError(id,message){const field=document.getElementById(id),note=document.getElementById(`${id}Note`);if(!field)return;field.setAttribute('aria-invalid','true');field.classList.add('is-error');if(note){note.textContent=message;note.classList.add('error');note.setAttribute('role','alert')}const visible=field.closest('[data-sial-form-control]')?.querySelector('.sial-library-field input, .sial-library-field button');(visible||field).focus()}
  function showNotice(message){let note=document.getElementById('vehiclePrototypeNotice');if(!note){note=document.createElement('p');note.id='vehiclePrototypeNotice';note.className='field-note error';note.setAttribute('role','alert');document.querySelector('#vehicleForm').prepend(note)}note.textContent=message;}
  // El TextInput publicado no expone los atributos ARIA de error; se conectan localmente
  // a los mensajes de la validación existente sin alterar la librería.
  function wireTextAccessibility(form) {
    const ids = ['plate', 'soatNumber', 'techNumber', 'palletCapacity'];
    function attach() {
      let complete = true;
      for (const id of ids) {
        const native = document.getElementById(id), visible = document.getElementById(`sial-library-${id}`);
        const note = document.getElementById(`${id}Note`);
        if (!native || !visible || !note) { complete = false; continue; }
        if (visible.dataset.vehicleAriaReady === 'true') continue;
        visible.dataset.vehicleAriaReady = 'true';
        if (id !== 'palletCapacity') visible.setAttribute('aria-required','true');
        const live = document.createElement('span');live.id=`vehicle-${id}-description`;
        Object.assign(live.style,{position:'absolute',width:'1px',height:'1px',padding:'0',margin:'-1px',overflow:'hidden',clip:'rect(0, 0, 0, 0)',whiteSpace:'nowrap',border:'0'});
        form.append(live);
        const sync = () => {const invalid=native.getAttribute('aria-invalid')==='true';visible.setAttribute('aria-invalid',String(invalid));visible.setAttribute('aria-describedby',live.id);if(invalid)live.setAttribute('role','alert');else live.removeAttribute('role');const text=note.textContent.trim();if(live.textContent!==text)live.textContent=text};
        new MutationObserver(sync).observe(native,{attributes:true,attributeFilter:['aria-invalid']});
        new MutationObserver(sync).observe(note,{childList:true,characterData:true,subtree:true});
        sync();
      }
      return complete;
    }
    if (!attach()) {const observer=new MutationObserver(()=>{if(attach())observer.disconnect()});observer.observe(form,{childList:true,subtree:true});}
  }
  function form(){
    const params=new URLSearchParams(location.search);const mode=params.get('modo');const original=mode==='editar'?read().find(r=>r.plate===params.get('placa')):null;
    if(mode==='editar'&&!original){showNotice('No se encontró el vehículo solicitado.');document.querySelector('#vehicleForm [type=submit]').disabled=true;return}
    if(original){fields.forEach(id=>set(id,original[id]));document.querySelector('.page-title').textContent='Editar vehículo';}
    const form=document.getElementById('vehicleForm');wireTextAccessibility(form);form.addEventListener('submit',()=>{
      const errors=fields.filter(id=>id!=='palletCapacity').map(id=>document.getElementById(id)).filter(field=>field?.getAttribute('aria-invalid')==='true');if(errors.length){const first=errors[0], visible=first.closest('[data-sial-form-control]')?.querySelector('.sial-library-field input, .sial-library-field button');(visible||first).focus();return}
      const capacity=document.getElementById('palletCapacity');
      const capacityNote=document.getElementById('palletCapacityNote');
      if (capacity?.value && !Number.isInteger(Number(capacity.value))) {
        document.getElementById('formOk').classList.add('is-hidden');
        showError('palletCapacity','La capacidad debe ser un número entero.');return;
      }
      if (capacity) {capacity.removeAttribute('aria-invalid');capacity.classList.remove('is-error');}
      if (capacityNote?.classList.contains('error')) {capacityNote.classList.remove('error');capacityNote.textContent='Opcional. Entero para planeacion de carga. Los bloqueos operativos se gestionan desde sus expedientes.';}
      if(document.getElementById('formOk').classList.contains('is-hidden'))return;
      const values=Object.fromEntries(fields.map(id=>[id,fieldValue(id)]));values.plate=values.plate.toUpperCase();
      if(read().some(r=>r.plate.toUpperCase()===values.plate&&r.plate!==original?.plate)){document.getElementById('formOk').classList.add('is-hidden');showError('plate','Esta placa ya está registrada.');return}
      const now=new Date().toLocaleString('es-CO');const entry=`${original?'Editar':'Crear'} - prototipo.ui|${now}`;
      const oldStatus=original && statusSaved(original.plate); const next={...original,...values,status:oldStatus?.status||original?.status||'active',opstatus:original?.opstatus||'sin-informacion',oplabel:original?.oplabel||'SIN INFORMACIÓN',audit:`${entry}${oldStatus?.audit||original?.audit?`;${oldStatus?.audit||original.audit}`:''}`};
      try {
        const current=read();
        localStorage.setItem(key,JSON.stringify(original?current.map(r=>r.plate===original.plate?next:r):[next,...current]));
        if (original && oldStatus) {
          const stateKey=`sial-catalog-state:${location.pathname.replace('registro-vehiculo.html','gestion-vehiculos.html')}`;
          const saved=JSON.parse(localStorage.getItem(stateKey)||'{}');
          if(original.plate!==next.plate)delete saved[original.plate];
          saved[next.plate]={status:next.status,audit:next.audit};
          localStorage.setItem(stateKey,JSON.stringify(saved));
        }
      } catch {document.getElementById('formOk').classList.add('is-hidden');showNotice('No se pudo guardar en este navegador.');return}
      location.href='gestion-vehiculos.html';
    });
    form.addEventListener('reset',()=>{setTimeout(()=>{document.getElementById('formOk').classList.add('is-hidden');document.getElementById('vehiclePrototypeNotice')?.remove()},0)});
  }
  function list(){
    const body=document.querySelector('.table-wrap tbody');if(!body)return;const templates=Array.from(body.querySelectorAll('tr'));if(!templates.length)return;
    const drawer=document.getElementById('detailDrawer');let detailTrigger=null;
    document.addEventListener('click',event=>{
      const trigger=event.target.closest?.('[data-sial-component="Table"] button[aria-label^="Visualizar vehiculo "]');
      if(trigger) detailTrigger=trigger;
      if(event.target.closest?.('.toolbar .sial-filter-reset')) requestAnimationFrame(()=>document.getElementById('sial-library-vehicleSearch')?.focus());
    },true);
    if(drawer){let wasOpen=drawer.classList.contains('show');new MutationObserver(()=>{const isOpen=drawer.classList.contains('show');if(wasOpen&&!isOpen&&detailTrigger?.isConnected){const target=detailTrigger;requestAnimationFrame(()=>requestAnimationFrame(()=>target.focus()))}wasOpen=isOpen}).observe(drawer,{attributes:true,attributeFilter:['class']})}
    document.addEventListener('sial:table-state-change',event=>{
      requestAnimationFrame(()=>{if(event.detail?.row?.dataset.filterMatch==='false')requestAnimationFrame(()=>document.getElementById('sial-library-vehicleSearch')?.focus())});
    });
    const records=read();body.replaceChildren();records.forEach(record=>{const base=templates.find(r=>r.dataset.status===record.status)||templates[0],row=base.cloneNode(true),status=record.status||'active';Object.assign(row.dataset,{status,context:record.ownFleet==='true'?'propia':'tercero',code:record.plate,name:record.plate,type:record.vehicleType,vehicletype:record.vehicleType,company:record.carrierCompany,fleet:record.ownFleet==='true'?'Propia':'Tercero',capacity:record.palletCapacity?`${record.palletCapacity} pallets`:'No registrada',soat:`${record.soatNumber||'—'} | ${(record.soatEndAt?date(record.soatEndAt):record.soatDisplay||'—')}`,tech:`${record.techNumber||'—'} | ${(record.techEndAt?date(record.techEndAt):record.techDisplay||'—')}`,state:status==='active'?'Activo':status==='inactive'?'Inactivo':'Revision',opstatus:record.opstatus||'disponible',opstatelabel:record.oplabel||'DISPONIBLE',audit:record.audit||''});const cells=row.querySelectorAll('td');[record.plate,record.vehicleType,record.carrierCompany,row.dataset.fleet,record.palletCapacity||'—',record.soatEndAt?date(record.soatEndAt):record.soatDisplay||'—',record.techEndAt?date(record.techEndAt):record.techDisplay||'—'].forEach((v,i)=>cells[i].textContent=v);const state=cells[7].querySelector('.status');state.className=`status status-${status}`;state.textContent=row.dataset.state;const op=cells[8].querySelector('.status');op.className=`status status-${record.opstatus==='disponible'?'active':record.opstatus==='nodisponible'?'inactive':'warning'}`;op.textContent=row.dataset.opstatelabel;const buttons=cells[9].querySelectorAll('button');buttons[0].setAttribute('aria-label',`Visualizar vehiculo ${record.plate}`);buttons[1].setAttribute('aria-label',`${status==='inactive'?'Activar':'Inactivar'} vehiculo ${record.plate}`);const link=cells[9].querySelector('a');link.href=`registro-vehiculo.html?modo=editar&placa=${encodeURIComponent(record.plate)}`;link.setAttribute('aria-label',`Editar vehiculo ${record.plate}`);body.append(row)});
  }
  return {list,form,read};
})();
