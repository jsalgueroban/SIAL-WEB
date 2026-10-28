/* Datos y operaciones locales para la propuesta; no equivalen a backend ni permisos. */
const DriverPrototype = (() => {
  const key = "sial-drivers-v1";
  const seed = [
    {code:"CD-00124",firstName:"CARLOS",lastName:"MEJIA",idType:"CC",idNumber:"1032456789",company:"SIAL Central",phone:"3004567890",arlCompany:"SEGUROS BOLIVAR",arlStart:"2026-01-01",arlEnd:"2026-12-31",licenses:[{code:"C2",expiration:"2026-09-12"},{code:"C3",expiration:"2026-11-15"}],state:"active",audit:["Crear|admin.transportes - 20/04/2026 08:14","Editar ARL|auditor.logistica - 22/04/2026 10:07"]},
    {code:"CD-00141",firstName:"JULIAN",lastName:"PEREZ",idType:"CC",idNumber:"80213456",company:"Banapalma",phone:"3017654321",arlCompany:"COLMENA",arlStart:"2026-03-15",arlEnd:"2027-03-14",licenses:[{code:"C3",expiration:"2026-05-02"}],state:"warning",audit:["Crear|admin.transportes - 15/04/2026 10:22","Revision documental|coordinador.logistico - 26/04/2026 07:48"]},
    {code:"CD-00088",firstName:"RICARDO",lastName:"OSPINA",idType:"CC",idNumber:"91234567",company:"AgroCeiba",phone:"3009988776",arlCompany:"SURA",arlStart:"2026-02-01",arlEnd:"2027-01-31",licenses:[{code:"C2",expiration:""}],state:"inactive",audit:["Inactivar|auditor.logistica - 19/04/2026 09:05","Bloquear asignacion|coordinador.logistico - 19/04/2026 09:11"]}
  ];
  const read=()=>{
    try {
      const x=JSON.parse(localStorage.getItem(key));
      if(Array.isArray(x))return x;
      const previous=JSON.parse(localStorage.getItem("sial-catalog-state:/Gestion%20de%20Transporte/gestion-conductores.html")||"{}");
      return seed.map(item=>{
        const entry=previous[item.code]||previous[`${item.idType} ${item.idNumber}`];
        return entry&&["active","inactive"].includes(entry.status)?{...item,state:entry.status,audit:typeof entry.audit==="string"?entry.audit.split(";").filter(Boolean):item.audit}:item;
      });
    }catch{return seed}
  };
  const write=x=>localStorage.setItem(key,JSON.stringify(x));
  const displayDate=x=>x?x.split('-').reverse().join('/'):'Sin fecha disponible';
  const stateLabel=s=>s==='inactive'?'Inactivo':s==='warning'?'Revisión':'Activo';
  function list(){
    const body=document.querySelector('.table-wrap tbody');if(!body)return;const template=body.querySelector('tr');body.replaceChildren();
    read().forEach(record=>{
      const row=template.cloneNode(true),name=`${record.firstName} ${record.lastName}`.trim(),identity=`${record.idType} ${record.idNumber}`,state=record.state||'active',cells=row.querySelectorAll('td');
      Object.assign(row.dataset,{code:record.code,id:record.code,identity,name,company:record.company,context:record.company,phone:record.phone,status:state,state:stateLabel(state),licenses:(record.licenses||[]).map(x=>`${x.code}|Vence ${displayDate(x.expiration)}`).join(';'),audit:(record.audit||[]).join(';')});
      cells[0].textContent=record.code;cells[1].textContent=name;cells[2].textContent=identity;cells[3].textContent=(record.licenses||[]).map(x=>x.code).join(', ')||'Sin categorías';cells[4].replaceChildren(document.createTextNode(record.arlCompany||'Sin dato'),document.createElement('br'));const coverage=document.createElement('span');coverage.className='muted';coverage.textContent=`${displayDate(record.arlStart)} - ${displayDate(record.arlEnd)}`;cells[4].append(coverage);cells[5].textContent=record.company;cells[6].textContent=record.phone;const chip=cells[7].querySelector('.status');chip.className=`status status-${state}`;chip.textContent=stateLabel(state);
      const buttons=cells[8].querySelectorAll('button'),link=cells[8].querySelector('a');buttons[0].setAttribute('aria-label',`Ver detalle de conductor ${record.code}`);link.href=`registro-conductor.html?modo=editar&codigo=${encodeURIComponent(record.code)}`;link.setAttribute('aria-label',`Editar conductor ${record.code}`);buttons[1].setAttribute('aria-label',`${state==='inactive'?'Activar':'Inactivar'} conductor ${record.code}`);body.append(row);
    });
    document.addEventListener('sial:table-state-change',event=>{const row=event.detail?.row,code=row?.dataset.code;if(!code)return;write(read().map(item=>item.code===code?{...item,state:row.dataset.status,audit:String(row.dataset.audit||'').split(';').filter(Boolean)}:item))});
  }
  function populateCategories(form, record) {
    let saved;
    try { saved=JSON.parse(localStorage.getItem("sial-proposal-license-categories-v2")); } catch { saved=null; }
    const categories=Array.isArray(saved)?saved:[
      {code:"C2",description:"Camiones rígidos de servicio público",status:true},
      {code:"C3",description:"Vehículos articulados y tractocamiones",status:true},
      {code:"A1",description:"Motocicletas de bajo cilindraje",status:false}
    ];
    const historic=record?.licenses||[], grid=form.querySelector(".license-grid");
    if(!grid)return;
    grid.replaceChildren();
    const codes=new Set();
    const show=(item)=>{
      const assigned=historic.find(x=>x.code===item.code);
      if(!item.status&&!assigned)return;
      codes.add(item.code);
      const itemEl=document.createElement("div");itemEl.className="license-option";
      const checkbox=document.createElement("input");checkbox.type="checkbox";checkbox.name="licenseCategory";checkbox.value=item.code;checkbox.id=`license-${item.code}`;checkbox.checked=record?Boolean(assigned):item.code==="C2"&&item.status;checkbox.defaultChecked=checkbox.checked;
      const label=document.createElement("label");label.htmlFor=checkbox.id;const strong=document.createElement("strong");strong.textContent=item.code;const description=document.createElement("span");description.textContent=item.status?item.description:`${item.description||"Categoría"} (asignación histórica inactiva)`;label.append(strong,description);
      const field=document.createElement("div");field.className="field";field.dataset.sialFormControl="";const dateLabel=document.createElement("label");dateLabel.className="label";dateLabel.htmlFor=`exp${item.code}`;dateLabel.textContent="Vencimiento";const date=document.createElement("input");date.className="input";date.id=dateLabel.htmlFor;date.type="date";date.value=assigned?.expiration||"";date.defaultValue=date.value;field.append(dateLabel,date);itemEl.append(checkbox,label,field);grid.append(itemEl);
    };
    categories.forEach(item=>show(item));
    historic.filter(item=>!codes.has(item.code)).forEach(item=>show({code:item.code,description:"Categoría no disponible en el catálogo",status:false}));
  }
  function form(){
    const params=new URLSearchParams(location.search),editing=params.get('modo')==='editar',code=params.get('codigo'),record=editing?read().find(x=>x.code===code):null,form=document.getElementById('driverForm'),ok=document.getElementById('formOk');if(!form)return;
    if(editing&&!record){ok.textContent='No se encontró el conductor solicitado.';ok.classList.remove('is-hidden');form.querySelector('[type="submit"]').disabled=true;return}
    populateCategories(form,record);
    if(record){document.querySelector('.page-title').textContent='Editar conductor';for(const id of ['company','firstName','lastName','idType','idNumber','phone','email','licenseNumber','arlCompany','arlStart','arlEnd']){const field=document.getElementById(id);if(!field)continue;field.value=record[id]||'';field.dispatchEvent(new Event(field.tagName==='SELECT'?'change':'input',{bubbles:true}))}form.querySelectorAll('input[name="licenseCategory"]').forEach(box=>{const match=(record.licenses||[]).find(x=>x.code===box.value);box.checked=Boolean(match);const expiry=document.getElementById(`exp${box.value}`);if(expiry)expiry.value=match?.expiration||''})}
    form.addEventListener('submit',()=>{if(ok.classList.contains('is-hidden')){const invalid=form.querySelector('[aria-invalid="true"]');const field=invalid?.closest('[data-sial-form-control]');(field?.querySelector('.sial-library-field input, .sial-library-field button[aria-haspopup=listbox]')||invalid||form.querySelector('input[name="licenseCategory"]'))?.focus();return}const get=id=>document.getElementById(id).value.trim(),all=read(),idType=get('idType'),idNumber=get('idNumber'),phone=get('phone');const duplicate=all.find(x=>x.code!==code&&((x.idType===idType&&x.idNumber===idNumber)||x.phone===phone));if(duplicate){const same=duplicate.idType===idType&&duplicate.idNumber===idNumber;const field=document.getElementById(same?'idNumber':'phone'),note=document.getElementById(same?'idNumberNote':'phoneNote');field.setAttribute('aria-invalid','true');field.classList.add('is-error');note.classList.add('error');note.textContent=same?'Ya existe un conductor con esta identificación.':'El celular ya está registrado.';ok.classList.add('is-hidden');(field.closest('[data-sial-form-control]')?.querySelector('.sial-library-field input')||field).focus();return}
      const max=Math.max(0,...all.map(x=>Number(x.code.replace(/^CD-/,''))||0)),next={code:record?.code||`CD-${String(max+1).padStart(5,'0')}`,company:get('company'),firstName:get('firstName'),lastName:get('lastName'),idType,idNumber,phone,email:get('email'),licenseNumber:get('licenseNumber'),arlCompany:get('arlCompany'),arlStart:get('arlStart'),arlEnd:get('arlEnd'),licenses:Array.from(form.querySelectorAll('input[name="licenseCategory"]:checked')).map(x=>({code:x.value,expiration:document.getElementById(`exp${x.value}`).value})),state:record?.state||'active',audit:[...(record?.audit||[]),`${record?'Editar':'Crear'}|prototipo.ui - ${new Date().toLocaleString('es-CO')}`]};write(record?all.map(x=>x.code===code?next:x):[next,...all]);location.href='gestion-conductores.html';
    });
  }
  return {list,form,read};
})();
