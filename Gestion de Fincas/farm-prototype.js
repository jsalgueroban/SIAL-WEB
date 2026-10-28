/* Persistencia local de la propuesta de fincas. No es un contrato de producto. */
const FarmPrototype = (() => {
  const key = "sial-farms-prototype-v1";
  const seed = [
    {code:"FIN-AC01",name:"FINCA LA ESPERANZA",producer:"AgroCeiba",group:"GRUPO COSTA NORTE",sector:"SECTOR NORTE",geo:"10.965,-74.801",active:true,audit:["Crear - admin.fincas · 22/04/2026 09:20","Editar - admin.fincas · 27/04/2026 08:12"]},
    {code:"FIN-BP07",name:"FINCA LOS ALMENDROS",producer:"Banapalma",group:"GRUPO ORIENTE UNO",sector:"SECTOR ORIENTE",geo:"10.615,-74.924",active:false,audit:["Crear - admin.fincas · 20/04/2026 10:05","Desactivar - auditor.master · 25/04/2026 14:40"]}
  ];
  function read(){try{const value=JSON.parse(localStorage.getItem(key));return Array.isArray(value)?value:seed}catch{return seed}}
  function write(value){localStorage.setItem(key,JSON.stringify(value))}
  function set(id,value){const el=document.getElementById(id);if(!el)return;el.value=value||"";el.dispatchEvent(new Event(el.tagName==="SELECT"?"change":"input",{bubbles:true}))}
  function form(){
    const params=new URLSearchParams(location.search), code=params.get("codigo"), editing=params.get("modo")==="editar", record=editing?read().find(x=>x.code===code):null;
    if(editing&&!record){const note=document.getElementById("formOk");note.textContent="No se encontró la finca solicitada.";note.classList.remove("is-hidden");document.querySelector('[type="submit"]').disabled=true;return}
    // La propuesta conserva una asignación inactiva existente al editar, pero no la ofrece en altas.
    for (const [id, catalog, existing] of [["group", "grupos", record?.group], ["sector", "sectores", record?.sector]]) {
      let items;
      try { items = JSON.parse(localStorage.getItem(`sial-farm-catalog-${catalog}`)); } catch { items = null; }
      if (!Array.isArray(items)) items = catalog === "grupos"
        ? [{name:"GRUPO COSTA NORTE",active:true},{name:"GRUPO ORIENTE UNO",active:false}]
        : [{name:"SECTOR NORTE",active:true},{name:"SECTOR ORIENTE",active:false}];
      const select = document.getElementById(id);
      if (!select) continue;
      const placeholder = select.options[0]?.textContent || "Selecciona una opción";
      select.replaceChildren(new Option(placeholder, ""));
      items.filter(item => item.active || item.name === existing).forEach(item => {
        select.add(new Option(item.active ? item.name : `${item.name} (inactivo)`, item.name));
      });
      if (existing && !items.some(item => item.name === existing)) {
        select.add(new Option(`${existing} (asignación anterior)`, existing));
      }
    }
    const codeField = document.getElementById("farmCode");
    // El catálogo local, no la lista inicial de ejemplo, define la unicidad del código.
    codeField.dataset.uniqueList = read().map(item => item.code).join("|");
    if(record){for(const [id,value] of Object.entries({farmCode:record.code,farmName:record.name,nit:record.nit,legalName:record.legalName,producer:record.producer,group:record.group,sector:record.sector,geo:record.geo}))set(id,value);document.getElementById("farmCode").dataset.originalValue=record.code.toUpperCase();document.querySelector('.page-title').textContent='Editar finca';}
    const el=document.querySelector('[data-generic-form]');el.addEventListener('submit',()=>{const ok=document.getElementById('formOk');if(ok.classList.contains('is-hidden'))return;const get=id=>document.getElementById(id)?.value.trim()||'';const nextCode=get('farmCode');const all=read();if(all.some(x=>x.code.toUpperCase()===nextCode.toUpperCase()&&x.code!==code)){
      ok.classList.add('is-hidden');
      const field=document.getElementById('farmCode'), note=document.getElementById('farmCodeNote');
      field.classList.add('is-error'); field.setAttribute('aria-invalid','true');
      if(note){note.textContent='El código de finca ya existe.';note.classList.add('error');note.classList.remove('success')}
      (field.closest('[data-sial-form-control]')?.querySelector('.sial-library-field input')||field).focus();
      return;
    }const next={code:nextCode,name:get('farmName'),nit:get('nit'),legalName:get('legalName'),producer:get('producer'),group:get('group'),sector:get('sector'),geo:get('geo'),active:record?.active??true,audit:[...(record?.audit||[]),`${record?'Editar':'Crear'} finca · ${new Date().toLocaleString('es-CO')}`]};write(record?all.map(x=>x.code===code?next:x):[next,...all]);location.href='gestion-fincas.html';});
  }
  function list(){
    const body=document.querySelector('.table-wrap tbody');if(!body)return;const template=body.querySelector('tr');const records=read();body.replaceChildren();
    const filter=document.getElementById('farmContext');
    if(filter){
      const sectors=[...new Set(records.map(item=>item.sector).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
      filter.replaceChildren(new Option('Todos los sectores','all'));
      sectors.forEach(name=>filter.add(new Option(name,name.replace(/^SECTOR\s+/,''))));
    }
    // Al cerrar el detalle con Escape el adaptador nativo se oculta antes del Drawer.
    // Conservamos el botón visible que lo abrió para restituir el foco en ambos cierres.
    const drawer = document.getElementById('detailDrawer');
    let detailTrigger = null;
    document.addEventListener('click', event => {
      const target = event.target.closest?.('[data-sial-component="Table"] button[aria-label^="Visualizar finca "]');
      if (target) detailTrigger = target;
      if (event.target.closest?.('.toolbar .sial-filter-reset')) {
        requestAnimationFrame(() => document.getElementById('sial-library-farmSearch')?.focus());
      }
    }, true);
    if (drawer) {
      let wasOpen = drawer.classList.contains('show');
      new MutationObserver(() => {
        const isOpen = drawer.classList.contains('show');
        if (wasOpen && !isOpen && detailTrigger?.isConnected) {
          const target = detailTrigger;
          requestAnimationFrame(() => requestAnimationFrame(() => target.focus()));
        }
        wasOpen = isOpen;
      }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
    }
    records.forEach(record=>{const row=template.cloneNode(true);const sector=record.sector.replace(/^SECTOR\s+/,'');Object.assign(row.dataset,{status:record.active?'active':'inactive',context:sector,code:record.code,name:record.name,producer:record.producer,group:record.group,sector,geo:record.geo,state:record.active?'Activo':'Inactivo',audit:record.audit.map(x=>x.replace(' · ','|')).join(';')});const cells=row.querySelectorAll('td');[record.code,record.name,record.producer,record.group,sector].forEach((value,i)=>cells[i].textContent=value);const chip=cells[5].querySelector('.status');chip.className=`status status-${record.active?'active':'inactive'}`;chip.textContent=record.active?'Activo':'Inactivo';cells[6].textContent=record.audit.at(-1);const buttons=cells[7].querySelectorAll('button');buttons[0].setAttribute('aria-label',`Visualizar finca ${record.code}`);const link=cells[7].querySelector('a');link.href=`registro-finca.html?modo=editar&codigo=${encodeURIComponent(record.code)}`;link.setAttribute('aria-label',`Editar finca ${record.code}`);const state=buttons[1];state.setAttribute('aria-label',record.active?'Inactivar':'Activar');state.addEventListener('click',()=>{const all=read().map(x=>x.code===record.code?{...x,active:!x.active,audit:[...x.audit,`${x.active?'Inactivar':'Activar'} finca · ${new Date().toLocaleString('es-CO')}`]}:x);write(all);location.reload()});body.append(row)});
  }
  return {form,list};
})();
