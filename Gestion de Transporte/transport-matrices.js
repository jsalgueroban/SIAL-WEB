/* Tablas de lectura de la propuesta. Datos locales, sin certificar elegibilidad productiva. */
window.TransportMatrices = (() => {
  const icon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
  const editIcon = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>';
  const text = value => value === undefined || value === null || value === '' ? 'No registrado' : String(value);
  const cell = (row, value) => { row.insertCell().textContent = text(value); };
  const state = (row, label, tone) => { const span=document.createElement('span');span.className=`status status-${tone}`;span.textContent=label;row.insertCell().append(span); };
  const actions = (row, label, href) => {
    const td=row.insertCell(), wrap=document.createElement('div'); wrap.className='row-actions';
    const view=document.createElement('button');view.type='button';view.className='icon-btn';view.dataset.openDetail='';view.setAttribute('aria-label',label);view.innerHTML=icon;wrap.append(view);
    if(href){const link=document.createElement('a');link.className='icon-btn';link.href=href;link.setAttribute('aria-label','Editar vehículo');link.innerHTML=editIcon;wrap.append(link)}
    td.append(wrap);
  };
  function availability(){
    const body=document.querySelector('.table-wrap tbody');if(!body)return;body.replaceChildren();
    TransportAvailability.list().forEach(vehicle=>{
      const result=TransportAvailability.get(vehicle.plate), record=result.record||vehicle, row=document.createElement('tr');
      const fleet=record.ownFleet==='true'?'Propia':record.ownFleet==='false'?'Tercero':'Sin información';
      const reason=result.signals.join(' '), label=result.eligible==='blocked'?'No disponible':result.eligible==='available'?'Disponible (demo)':'Por verificar';
      Object.assign(row.dataset,{code:record.plate,name:record.plate,status:result.eligible==='blocked'?'inactive':result.eligible==='available'?'active':'unknown',context:fleet==='Propia'?'propia':fleet==='Tercero'?'tercero':'unknown',company:text(record.carrierCompany),type:text(record.vehicleType),fleet,capacity:record.palletCapacity?`${record.palletCapacity} pallets`:'No registrada',reason,state:label,audit:typeof record.audit==='string'?record.audit:''});
      [record.plate,record.carrierCompany,record.vehicleType,fleet,row.dataset.capacity,reason].forEach(value=>cell(row,value));
      state(row,label,result.eligible==='blocked'?'inactive':result.eligible==='available'?'active':'warning');
      actions(row,`Visualizar disponibilidad de ${record.plate}`,result.record&&!result.record.isDemo?`registro-vehiculo.html?modo=editar&placa=${encodeURIComponent(record.plate)}`:null);body.append(row);
    });
  }
  function parseDate(value){
    if(!value)return null;
    let m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
    let y,month,day;
    if(m){y=Number(m[1]);month=Number(m[2]);day=Number(m[3]);}
    else {m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value));if(!m)return null;day=Number(m[1]);month=Number(m[2]);y=Number(m[3]);}
    const date=new Date(y,month-1,day);
    return date.getFullYear()===y && date.getMonth()===month-1 && date.getDate()===day ? {year:y,month,day} : null;
  }
  function format(value){const d=parseDate(value);return d?`${String(d.day).padStart(2,'0')}/${String(d.month).padStart(2,'0')}/${d.year}`:'No registrada';}
  function days(value){const d=parseDate(value);if(!d)return '—';const a=new Date(),target=Date.UTC(d.year,d.month-1,d.day),today=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return String(Math.round((target-today)/86400000));}
  function documents(){
    const body=document.querySelector('.table-wrap tbody');if(!body)return;body.replaceChildren();
    const records=typeof VehiclePrototype==='undefined'?[]:VehiclePrototype.read();
    if(new URLSearchParams(location.search).get('escenario')==='disponible'){const demo=TransportAvailability.get('DEMO-001').record;if(demo)records.push(demo);}
    for(const vehicle of records) for(const doc of [
      {kind:'SOAT',title:'SOAT',number:vehicle.soatNumber,issued:vehicle.soatIssuedAt,end:vehicle.soatEndAt||vehicle.soatDisplay},
      {kind:'TECNO',title:'Tecnomecánica',number:vehicle.techNumber,issued:vehicle.techIssuedAt,end:vehicle.techEndAt||vehicle.techDisplay}
    ]){
      const expired=TransportAvailability.due(doc.end),label=expired===true?'Vencido':expired===false?'Vigente':'Sin evaluar',tone=expired===true?'inactive':expired===false?'active':'warning';
      const row=document.createElement('tr'); Object.assign(row.dataset,{status:expired===true?'inactive':expired===false?'active':'unknown',context:doc.kind,code:`${vehicle.plate}|${doc.kind}`,plate:vehicle.plate,name:`${doc.title} ${vehicle.plate}`,company:text(vehicle.carrierCompany),document:doc.title,number:text(doc.number),end:format(doc.end),state:label,audit:typeof vehicle.audit==='string'?vehicle.audit:''});
      [vehicle.plate,vehicle.carrierCompany,doc.title,doc.number,format(doc.issued),format(doc.end),days(doc.end)].forEach(value=>cell(row,value));state(row,label,tone);
      actions(row,`Visualizar documento ${doc.title} de ${vehicle.plate}`,vehicle.isDemo?null:`registro-vehiculo.html?modo=editar&placa=${encodeURIComponent(vehicle.plate)}`);body.append(row);
    }
  }
  return {availability,documents};
})();
