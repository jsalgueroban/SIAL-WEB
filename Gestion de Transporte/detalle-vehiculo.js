const VehicleDetail = (() => {
  const $ = id => document.getElementById(id);
  const value = v => v || 'No registrado';
  const formatDate = v => v ? v.slice(0, 10).split('-').reverse().join('/') : '';
  function fields(id, rows) {
    const container = $(id); container.replaceChildren();
    rows.forEach(([label, text]) => {const group=document.createElement('div'), dt=document.createElement('dt'), dd=document.createElement('dd'); dt.textContent=label; dd.textContent=value(text); group.append(dt,dd); container.append(group);});
  }
  function init() {
    const plate = new URLSearchParams(location.search).get('placa');
    const record = VehiclePrototype.read().find(item => item.plate === plate);
    if (!record) { $('vehicleNotFound').hidden=false; return; }
    $('vehicleDetail').hidden=false;
    const saved=VehiclePrototype.statusSaved(record.plate), status=saved?.status || record.status || 'active';
    const statusLabel=({active:'Activo',inactive:'Inactivo',warning:'Revisión'})[status] || status;
    $('vehiclePlate').textContent=record.plate; $('vehicleCompany').textContent=value(record.carrierCompany);
    $('vehicleType').textContent=value(record.vehicleType); $('vehicleFleet').textContent=record.ownFleet==='true'?'Propia':'Tercero';
    $('vehicleCapacity').textContent=record.palletCapacity ? `${record.palletCapacity} pallets` : 'No registrada'; $('vehicleStatus').textContent=statusLabel; $('vehicleStatus').classList.add(`status-${status}`);
    const op=$('vehicleOperationalStatus'); op.textContent=value(record.oplabel); op.classList.add(`status-${record.opstatus==='disponible'?'active':record.opstatus==='nodisponible'?'inactive':'warning'}`);
    $('generalEdit').href=`registro-vehiculo.html?modo=editar&placa=${encodeURIComponent(record.plate)}`;
    const soatDate=formatDate(record.soatEndAt)||record.soatDisplay, techDate=formatDate(record.techEndAt)||record.techDisplay;
    fields('generalFields', [['Motivo de indisponibilidad', record.unavailabilityReason]]);
    const docs=[['SOAT',record.soatNumber,soatDate],['Tecnomecánica',record.techNumber,techDate]];
    docs.forEach(([name,number,date])=>{const row=document.createElement('div'), title=document.createElement('strong'), meta=document.createElement('span'); row.className='document-row';title.textContent=name;meta.textContent=[number,date ? `Vencimiento: ${date}` : 'Fecha no registrada'].filter(Boolean).join(' · ');row.append(title,meta);$('documentSummary').append(row);});
    fields('documentFields', [['Número de SOAT',record.soatNumber],['Aseguradora',record.insuranceCompany],['Expedición SOAT',formatDate(record.soatIssuedAt)],['Inicio de vigencia SOAT',formatDate(record.soatStartAt)],['Vencimiento SOAT',soatDate],['Número tecnomecánica',record.techNumber],['Empresa certificadora',record.certifierCompany],['Expedición tecnomecánica',formatDate(record.techIssuedAt)],['Vencimiento tecnomecánica',techDate]]);
    const audit=saved?.audit || record.audit; const entries=audit ? audit.split(';').filter(Boolean) : [];
    if (!entries.length) $('auditEntries').textContent='No hay movimientos de auditoría registrados.';
    entries.forEach(entry=>{const [action, date]=entry.split('|'), row=document.createElement('div'), title=document.createElement('strong'), time=document.createElement('span'); title.textContent=action; time.textContent=date||''; row.append(title,time); $('auditEntries').append(row);});
    // Ejemplos locales con la forma de los contratos de operación y cargue; no son datos de producción.
    const example = record.plate === 'TRK-421' ? {
      filing:'RAD-2026-001', week:'Semana 44 · 2026', driver:'Conductor de ejemplo', stage:'Cargue en finca', origin:'Finca de ejemplo', destination:'Puerto de ejemplo', container:'No asociado',
      timeline:[['Programación','28/10/2026 · 07:00'],['Ingreso a finca','28/10/2026 · 08:15'],['Cargue en finca','28/10/2026 · 09:00']],
      pallets:[{position:1,sscc:'770000000000000001',boxes:48},{position:2,sscc:'770000000000000002',boxes:48},{position:3,sscc:'770000000000000003',boxes:42},{position:4,sscc:'770000000000000004',boxes:48}]
    } : null;
    if (!example) {
      ['overviewTimeline','operationContent','loadingContent'].forEach(id=>$(id).textContent='No hay una operación de ejemplo asociada a este vehículo.');
    } else {
      function timeline(target){const list=document.createElement('ol');list.className='operation-timeline';example.timeline.forEach(([name,date],index)=>{const item=document.createElement('li'),title=document.createElement('strong'),time=document.createElement('span');if(index===example.timeline.length-1)item.className='current';title.textContent=name;time.textContent=date;item.append(title,time);list.append(item);});target.append(list);}
      const exampleLabel=document.createElement('p');exampleLabel.className='example-label';exampleLabel.textContent='Recorrido de ejemplo';$('overviewTimeline').append(exampleLabel);timeline($('overviewTimeline'));
      const opHeader=document.createElement('div');opHeader.className='operation-label';opHeader.textContent=`${example.filing} · ${example.week} · Ejemplo`; $('operationContent').append(opHeader);
      const opFields=document.createElement('dl');opFields.id='operationFields';opFields.className='detail-fields operation-fields';$('operationContent').append(opFields);
      fields('operationFields',[['Radicado',example.filing],['Semana operativa',example.week],['Conductor',example.driver],['Etapa',example.stage],['Origen',example.origin],['Destino',example.destination],['Contenedor',example.container]]);
      const opTimeline=document.createElement('div');opTimeline.className='operation-history';const heading=document.createElement('h3');heading.textContent='Recorrido registrado';opTimeline.append(heading);timeline(opTimeline);$('operationContent').append(opTimeline);
      const summary=document.createElement('div');summary.className='loading-summary';const boxes=example.pallets.reduce((n,p)=>n+p.boxes,0);summary.textContent=`Ejemplo · ${example.pallets.length} pallets activos · ${boxes} cajas · Capacidad registrada: ${record.palletCapacity || 'no registrada'}${record.palletCapacity?' pallets':''}`;$('loadingContent').append(summary);
      const help=document.createElement('p');help.className='loading-help';help.textContent='Selecciona una posición registrada para consultar el pallet. La distribución es esquemática.';$('loadingContent').append(help);
      const layout=document.createElement('div');layout.className='loading-layout';const positions=document.createElement('div');positions.className='loading-positions';positions.setAttribute('aria-label','Posiciones registradas');const detail=document.createElement('div');detail.className='pallet-detail';detail.setAttribute('aria-live','polite');
      function selectPallet(pallet, button){positions.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));detail.replaceChildren();const title=document.createElement('h3');title.textContent=`Posición ${pallet.position}`;const list=document.createElement('dl');list.className='detail-fields';detail.append(title,list);[['SSCC',pallet.sscc],['Cajas',String(pallet.boxes)],['Estado','Activo']].forEach(([key,val])=>{const group=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=val;group.append(dt,dd);list.append(group);});}
      example.pallets.forEach((pallet,index)=>{const button=document.createElement('button');button.type='button';button.textContent=`Posición ${pallet.position}`;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>selectPallet(pallet,button));positions.append(button);if(index===0)selectPallet(pallet,button);});layout.append(positions,detail);$('loadingContent').append(layout);
    }
    const tabs=[...document.querySelectorAll('[role=tab]')];
    function select(tab, focus=false){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$(t.getAttribute('aria-controls')).hidden=!active;});if(focus)tab.focus();}
    tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();select(tabs[next],true);});});
    document.querySelectorAll('[data-select-tab]').forEach(button=>button.addEventListener('click',()=>select($(`tab-${button.dataset.selectTab}`),true)));
    const type=(record.vehicleType||'').toUpperCase();
    const isTractor=type.includes('TRACTO'), isTruck=type.includes('CAMION') || type.includes('CAMIÓN');
    const profile=$('vehicleProfile');
    if(isTractor || isTruck){$('vehiclePlateOverlay').textContent=record.plate; $('vehiclePlateOverlay').hidden=false; $('vehiclePlateOverlay').classList.toggle('vehicle-plate-truck',isTruck && !isTractor);}
    if(isTractor || isTruck){profile.src=isTractor?'assets/tractomula-cabina-sial.png':'assets/camion-carpa-cerrada-rojo.png';profile.alt=`Representación ilustrativa de ${isTractor?'una tractomula con contenedor refrigerado':'un camión rígido'} en vista lateral`;profile.addEventListener('error',()=>{profile.hidden=true;$('vehiclePlateOverlay').hidden=true;$('vehicleProfileFallback').hidden=false;});}
    else {profile.hidden=true;$('vehiclePlateOverlay').hidden=true;$('vehicleProfileFallback').hidden=false;}
    if (isTruck && !isTractor) {
      const colors=['rojo','blanco','azul'];
      const color=colors[Array.from(record.plate).reduce((sum,char)=>sum+char.charCodeAt(0),0)%colors.length];
      profile.src=`assets/camion-carpa-cerrada-${color}.png`;
    }
  }
  return {init};
})();
