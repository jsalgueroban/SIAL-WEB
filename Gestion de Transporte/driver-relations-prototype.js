/* Propuesta local: relaciones conductor-licencia, sin contrato de producto. */
const DriverRelations = (() => {
  const key = "sial-driver-licenses-v1";
  const seed = [
    {code:"CD-00124", name:"CARLOS MEJIA", license:"C2", expiration:"2026-09-12", company:"SIAL Central", state:"active", audit:["Crear - admin.transportes · 20/04/2026 08:14"]},
    {code:"CD-00124", name:"CARLOS MEJIA", license:"C3", expiration:"2026-11-15", company:"SIAL Central", state:"active", audit:["Crear - admin.transportes · 22/04/2026 10:07"]},
    {code:"CD-00141", name:"JULIAN PEREZ", license:"C3", expiration:"2026-05-02", company:"Banapalma", state:"warning", audit:["Editar - auditor.logistica · 26/04/2026 07:48"]}
  ];
  const drivers = {"CD-00124":{name:"CARLOS MEJIA",company:"SIAL Central"},"CD-00141":{name:"JULIAN PEREZ",company:"Banapalma"}};
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:seed}catch{return seed}};
  const write=v=>localStorage.setItem(key,JSON.stringify(v));
  const label=v=>v==="warning"?"Por vencer":"Vigente";
  const date=v=>v ? v.split("-").reverse().join("/") : "";
  function init(){
    const table=document.querySelector(".table-wrap tbody"), template=table.querySelector("tr"), panel=document.querySelector("[data-inline-form-panel]"), form=document.getElementById("relationForm"), opener=document.querySelector("[data-open-inline-form]"), cancel=document.querySelector("[data-cancel-inline-form]"), ok=document.getElementById("formOk");
    let editing=null, previousFocus=null;
    const syncOptions=(record)=>{
      let saved,driverStates;
      try{saved=JSON.parse(localStorage.getItem("sial-proposal-license-categories-v2"))}catch{saved=null}
      try{driverStates=JSON.parse(localStorage.getItem("sial-catalog-state:/Gestion%20de%20Transporte/gestion-conductores.html"))||{}}catch{driverStates={}}
      const categories=Array.isArray(saved)?saved:[{code:"C2",description:"Camiones rígidos",status:true},{code:"C3",description:"Tractocamiones",status:true},{code:"A1",description:"Motocicletas",status:false}];
      const select=document.getElementById("licenseCodeSelect");select.replaceChildren(new Option("Selecciona una categoría", ""));categories.filter(item=>item.status||item.code===record?.license).forEach(item=>select.add(new Option(`${item.code} - ${item.description}${item.status?"":" (inactiva)"}`,item.code)));if(record&&!categories.some(item=>item.code===record.license))select.add(new Option(`${record.license} (asignación anterior)`,record.license));
      let localDrivers;try{localDrivers=JSON.parse(localStorage.getItem("sial-drivers-v1"))}catch{localDrivers=null}
      if(Array.isArray(localDrivers))localDrivers.forEach(item=>{drivers[item.code]={name:`${item.firstName} ${item.lastName}`.trim(),company:item.company,state:item.state}});
      const driver=document.getElementById("driverCodeSelect");driver.replaceChildren(new Option("Selecciona un conductor", ""));Object.entries(drivers).forEach(([code,info])=>{const inactive=info.state==="inactive"||driverStates[code]?.status==="inactive";if(!inactive||code===record?.code)driver.add(new Option(`${code} - ${info.name}${inactive?" (inactivo)":""}`,code))});
      select.dispatchEvent(new Event("change",{bubbles:true}));driver.dispatchEvent(new Event("change",{bubbles:true}));
    };
    const focusInput=()=>requestAnimationFrame(()=>panel.querySelector(".sial-library-field input, .sial-library-field select, .sial-library-field button[aria-haspopup=listbox]")?.focus());
    const set=(id,value)=>{const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event(input.tagName==="SELECT"?"change":"input",{bubbles:true}))};
    const open=(record)=>{previousFocus=document.activeElement;editing=record;form.reset();syncOptions(record);ok.classList.add("is-hidden");document.getElementById("relationRuleNote").textContent="La combinación conductor + licencia debe ser única.";document.getElementById("relationRuleNote").classList.remove("error");panel.classList.remove("is-hidden");opener.setAttribute("aria-expanded","true");panel.querySelector("[data-inline-form-title]").textContent=record?"Editar relación":"Nueva relación";if(record){set("driverCodeSelect",record.code);set("licenseCodeSelect",record.license);set("expirationDate",record.expiration)}focusInput()};
    opener.addEventListener("click",()=>open(null));
    cancel.addEventListener("click",()=>{panel.classList.add("is-hidden");opener.setAttribute("aria-expanded","false");form.reset();requestAnimationFrame(()=>previousFocus?.isConnected&&previousFocus.focus())});
    const rows=read();table.replaceChildren();rows.forEach(r=>{const row=template.cloneNode(true), cells=row.querySelectorAll("td");Object.assign(row.dataset,{code:`${r.code}|${r.license}`,driver:r.code,name:r.name,license:r.license,expiration:date(r.expiration),company:r.company,context:r.company,status:r.state,state:label(r.state),audit:r.audit.map(v=>v.replace(" · ","|")).join(";")});cells[0].replaceChildren(document.createTextNode(r.code),document.createElement("br"));const n=document.createElement("span");n.className="muted";n.textContent=r.name;cells[0].append(n);cells[1].textContent=r.license;cells[2].textContent=date(r.expiration);cells[3].textContent=r.company;const chip=cells[4].querySelector(".status");chip.className=`status status-${r.state}`;chip.textContent=label(r.state);cells[5].textContent=r.audit.at(-1);const buttons=cells[6].querySelectorAll("button");buttons[0].setAttribute("aria-label",`Visualizar relación ${r.code} ${r.license}`);buttons[1].setAttribute("aria-label",`Editar relación ${r.code} ${r.license}`);buttons[1].addEventListener("click",()=>open(r));table.append(row)});
    form.addEventListener("submit",event=>{event.preventDefault();let valid=true;for(const [id,noteId,message] of [["driverCodeSelect","driverCodeNote","Selecciona un conductor activo."],["licenseCodeSelect","licenseCodeNote","Selecciona una categoría activa."],["expirationDate","expirationDateNote","Selecciona la fecha de vencimiento."]]){const input=document.getElementById(id), note=document.getElementById(noteId), fail=!input.value;input.setAttribute("aria-invalid",String(fail));input.classList.toggle("is-error",fail);note.classList.toggle("error",fail);if(fail){note.textContent=message;valid=false}}
      const code=document.getElementById("driverCodeSelect").value,license=document.getElementById("licenseCodeSelect").value,expiration=document.getElementById("expirationDate").value, message=document.getElementById("relationRuleNote"), duplicate=read().some(r=>r.code===code&&r.license===license&&(!editing||r.code!==editing.code||r.license!==editing.license));message.classList.toggle("error",duplicate);message.textContent=duplicate?"La relación conductor + licencia ya existe.":"La combinación conductor + licencia debe ser única.";if(duplicate){const field=document.getElementById("licenseCodeSelect"),note=document.getElementById("licenseCodeNote");field.setAttribute("aria-invalid","true");field.classList.add("is-error");note.classList.add("error");note.textContent="La relación conductor + licencia ya existe.";valid=false}if(!valid){const invalid=form.querySelector('[aria-invalid="true"]');const field=invalid?.closest('[data-sial-form-control]');(field?.querySelector('.sial-library-field input, .sial-library-field select, .sial-library-field button[aria-haspopup=listbox]')||invalid)?.focus();return}
      const record={code,license,expiration,...drivers[code],state:editing?.state||"active",audit:[...(editing?.audit||[]),`${editing?"Editar":"Crear"} relación · ${new Date().toLocaleString("es-CO")}`]};const all=read();write(editing?all.map(r=>r.code===editing.code&&r.license===editing.license?record:r):[record,...all]);location.reload();
    });
  }
  return {init,read};
})();
