const SIALOrderTrace = (() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const esc = (value) => SIALCore.escapeHtml(value ?? "");
  const stageIcons = [
    '<path d="m4 7 8-4 8 4-8 4Z"></path><path d="M4 7v10l8 4 8-4V7M12 11v10"></path>',
    '<path d="M9 5h6M9 9h6M9 13h4"></path><path d="M7 3h10a2 2 0 0 1 2 2v16H5V5a2 2 0 0 1 2-2Z"></path>',
    '<path d="M3 6h18v12H3Z"></path><path d="m8 10 4 4 4-4M12 4v10"></path>',
    '<path d="M4 5v14M4 12h13"></path><path d="m13 8 4 4-4 4M4 5h6"></path>',
    '<path d="M4 17c3-7 7-10 16-10"></path><path d="m16 4 4 3-3 4"></path><circle cx="5" cy="17" r="2"></circle>',
    '<path d="M4 9 12 4l8 5v11H4Z"></path><path d="M8 20v-6h8v6M8 10h8"></path><path d="m14 7 2 2-2 2"></path>',
    '<path d="m4 7 8-4 8 4-8 4Z"></path><path d="M4 7v10l8 4 8-4V7M12 11v10"></path><path d="m8 15 2 2 5-5"></path>'
  ];
  const truckIcon = '<g class="truck-body"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"></path><path class="truck-light" d="M18 12h2"></path></g><circle class="truck-wheel" cx="7" cy="18" r="2"></circle><circle class="truck-wheel truck-wheel-rear" cx="18" cy="18" r="2"></circle>';
  const deliveryTruckIcon = '<g class="truck-body"><path d="M3 7h10v10H3Z"></path><path d="M13 10h4l4 3v4h-8"></path><path d="M3 7 7 3h6v4M3 7l4 4 6-4"></path><path class="truck-light" d="M18 13h2"></path></g><circle class="truck-wheel" cx="7" cy="19" r="2"></circle><circle class="truck-wheel truck-wheel-rear" cx="18" cy="19" r="2"></circle>';

  const orders = {
    "PED-2026-10482": {
      id:"PED-2026-10482", type:"Pedido estándar", category:"EMPA · EMPAQUE", destination:"Finca Santa Isabel", requested:"1.480 unidades", document:"RPT-2026-0881", source:"Aviso de corte · Semana 39", current:4,
      stages:[
        {label:"Preparación", state:"complete", time:"23 sep · 07:12", owner:"Planeación", location:"SIAL Web", detail:"Se consolidaron las cantidades requeridas para iniciar la gestión del pedido.", evidence:"Aviso de corte · Semana 39"},
        {label:"Creación", state:"complete", time:"23 sep · 08:05", owner:"Supervisor de materiales", location:"SIAL Web", detail:"El pedido fue creado con las líneas y cantidades aprobadas.", evidence:"Solicitud PED-2026-10482"},
        {label:"Despacho", state:"complete", time:"23 sep · 10:46", owner:"Bodega principal", location:"Centro de distribución", detail:"El pedido fue alistado y entregado al transportador.", evidence:"Lista de despacho LD-9021"},
        {label:"En salida", state:"complete", time:"23 sep · 12:05", owner:"Transportes del Caribe", location:"Centro de distribución", detail:"El vehículo confirmó salida del centro de distribución.", evidence:"Orden OTI-546-001"},
        {label:"En tránsito", state:"current", time:"23 sep · 12:18", executionTime:"23 sep · 12:18", owner:"Transportes del Caribe", location:"Ruta CD → Santa Isabel", detail:"El vehículo TUL-458 se dirige a Finca Santa Isabel. Sin novedades reportadas.", evidence:"Orden OTI-546-001 · GPS activo"},
        {label:"En finca", state:"pending", time:"Pendiente", executionTime:"23 sep · 13:42", owner:"Almacén de finca", location:"Finca Santa Isabel", detail:"El vehículo llegó a la finca y está pendiente la confirmación de descarga.", evidence:"Llegada y foto requeridas"},
        {label:"Entrega realizada", state:"pending", time:"Pendiente", executionTime:"23 sep · 14:05", completionTime:"23 sep · 14:12", owner:"Almacén de finca", location:"Finca Santa Isabel", detail:"La entrega se completa al registrar cantidades, firma y evidencia final.", evidence:"POD pendiente"}
      ]
    },
    "PED-2026-10481": {
      id:"PED-2026-10481", type:"Pedido adicional", destination:"Finca El Retiro", requested:"520 unidades", document:"REM-2026-0184", source:"Solicitud adicional · Semana 39", current:6,
      stages:[
        {label:"Preparación",state:"complete",time:"22 sep · 07:20",owner:"Almacén de finca",location:"Finca El Retiro",detail:"Necesidad adicional consolidada para gestión.",evidence:"Solicitud adicional · Semana 39"},
        {label:"Creación",state:"complete",time:"22 sep · 08:18",owner:"Supervisor de materiales",location:"SIAL Web",detail:"Pedido adicional creado y aprobado.",evidence:"Solicitud PED-2026-10481"},
        {label:"Despacho",state:"complete",time:"22 sep · 10:04",owner:"Bodega principal",location:"Centro de distribución",detail:"Material completo y remisión generada.",evidence:"Remisión REM-2026-0184"},
        {label:"En salida",state:"complete",time:"22 sep · 11:50",owner:"Transportes del Caribe",location:"Centro de distribución",detail:"Vehículo liberado para iniciar recorrido.",evidence:"Orden OTI-546-002"},
        {label:"En tránsito",state:"complete",time:"22 sep · 12:30",owner:"Transportes del Caribe",location:"Ruta CD → El Retiro",detail:"Recorrido completado sin novedades.",evidence:"GPS finalizado"},
        {label:"En finca",state:"complete",time:"22 sep · 14:08",owner:"Laura Pineda",location:"Finca El Retiro",detail:"Vehículo recibido y descarga verificada.",evidence:"Registro de llegada"},
        {label:"Entrega realizada",state:"current",time:"22 sep · 14:12",owner:"Laura Pineda",location:"Finca El Retiro",detail:"Pedido entregado con cantidades, firma y evidencia completas.",evidence:"Foto + firma · POD-682-014"}
      ]
    }
  };
  const orderBlueprints = JSON.parse(JSON.stringify(orders));
  const AUTO_INTERVAL = 5000;

  let order = orders["PED-2026-10482"];
  let journeyRun = 0;
  let autoTimer = 0;

  function positionFor(index){ return ((index+.5)/order.stages.length)*100; }
  function activeIcon(index){ if(index<=1) return stageIcons[index]; return index===order.stages.length-1?deliveryTruckIcon:truckIcon; }

  function stageExecutionTime(index){
    const stage=order.stages[index];
    if(index>order.current)return {start:"Pendiente",end:"Pendiente"};
    const start=stage.executionTime||stage.time.replace("Desde ","");
    if(index===order.current){
      const end=index===order.stages.length-1?(stage.completionTime||start):"En curso";
      return {start,end};
    }
    const next=order.stages[index+1];
    return {start,end:next?(next.executionTime||next.time.replace("Desde ","")):(stage.completionTime||start)};
  }

  function stageTimeMarkup(index){
    const range=stageExecutionTime(index);
    return `<span><b>Inicio</b>${esc(range.start)}</span><span><b>Fin</b>${esc(range.end)}</span>`;
  }

  function applyJourneyState(journey,activeIndex,isCurrent){
    journey.querySelectorAll("[data-stage-index]").forEach((button,index)=>{
      button.classList.remove("is-complete","is-current","is-pending","is-alert","is-advance");
      button.removeAttribute("aria-current");
      if(index<activeIndex || (index===activeIndex&&!isCurrent)) button.classList.add("is-complete");
      else if(index===activeIndex){button.classList.add("is-current");button.setAttribute("aria-current","step");}
      else button.classList.add("is-pending");
    });
  }

  const wait = (duration) => new Promise(resolve=>window.setTimeout(resolve,duration));
  async function animateJourney(journey,startIndex,fromEmpty,run){
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepDuration=reduced?0:620;
    const vehicle=qs(".journey-vehicle",journey);
    journey.style.setProperty("--progress",`${positionFor(startIndex)}%`);
    journey.style.setProperty("--vehicle-progress",`${positionFor(startIndex)}%`);
    journey.style.setProperty("--vehicle-step",String(startIndex));
    if(fromEmpty){
      applyJourneyState(journey,-1,false); vehicle.classList.add("is-hidden");
      await wait(reduced?0:420); if(run!==journeyRun)return;
      vehicle.classList.remove("is-hidden");
      applyJourneyState(journey,0,order.current===0);
    } else applyJourneyState(journey,startIndex,startIndex===order.current);
    for(let index=startIndex+1;index<=order.current;index+=1){
      if(run!==journeyRun)return;
      applyJourneyState(journey,index-1,false);
      vehicle.classList.add("is-driving");
      journey.style.setProperty("--progress",`${positionFor(index)}%`);
      journey.style.setProperty("--vehicle-progress",`${positionFor(index)}%`);
      journey.style.setProperty("--vehicle-step",String(index));
      await wait(stepDuration); if(run!==journeyRun)return;
      vehicle.classList.remove("is-driving");
      applyJourneyState(journey,index,index===order.current);
      await wait(reduced?0:110);
    }
  }

  function renderJourney(advancedIndex=-1,startIndex=0,fromEmpty=true){
    const journey=qs("[data-journey]");
    const initialPosition=positionFor(startIndex);
    journey.style.setProperty("--progress",`${initialPosition}%`);
    journey.style.setProperty("--vehicle-progress",`${initialPosition}%`);
    journey.style.setProperty("--vehicle-step",String(startIndex));
    journey.innerHTML=`<li class="journey-vehicle ${order.current===order.stages.length-1?"is-delivered":""}" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24">${activeIcon(order.current)}</svg></li>`+order.stages.map((stage,index)=>`<li><button class="journey-step is-pending" style="--stage-index:${index}" type="button" data-stage-index="${index}"><span class="journey-marker"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${stageIcons[index]}</svg></span><span class="journey-label">${esc(stage.label)}</span><span class="journey-time">${stageTimeMarkup(index)}</span></button></li>`).join("");
    journey.querySelectorAll("[data-stage-index]").forEach(button=>button.addEventListener("click",()=>inspectStage(button)));
    journeyRun+=1; animateJourney(journey,startIndex,fromEmpty,journeyRun);
  }

  function inspectStage(button){
    const journey=qs("[data-journey]");
    journey.querySelectorAll(".is-inspected").forEach(item=>item.classList.remove("is-inspected"));
    button.classList.add("is-inspected");
    window.setTimeout(()=>button.classList.remove("is-inspected"),620);
  }

  function renderCurrent(){
    const stage=order.stages[order.current]; const next=order.stages[order.current+1];
    qs("[data-stage-number]").textContent=String(order.current+1);
    qs("[data-current-title]").textContent=stage.label;
    qs("[data-current-icon]").innerHTML=activeIcon(order.current);
    qs(".state-orbit").classList.toggle("is-driving",order.current>1&&order.current<order.stages.length-1);
    qs("[data-current-summary]").textContent=stage.detail;
    qs("[data-current-owner]").textContent=stage.owner;
    qs("[data-current-duration]").textContent=order.current===order.stages.length-1?"Cerrado":"1 h 24 min";
    qs("[data-current-next]").textContent=next?`Completar ${next.label.toLowerCase()}`:"Pedido finalizado";
    qs("[data-live-label]").textContent=order.current===order.stages.length-1
      ?`Seguimiento finalizado · última actualización ${stage.time}`
      :`Seguimiento activo · última actualización ${stage.time}`;
  }

  function renderOrder(advancedIndex=-1,startIndex=0,fromEmpty=true){
    qs("[data-order-id]").textContent=order.id;
    const context=qs("[data-order-context]");
    context.innerHTML=`<div><dt>Tipo de pedido</dt><dd>${esc(order.type)}</dd></div><div><dt>Categoría</dt><dd>${esc(order.category || "Sin categoría")}</dd></div><div><dt>Destino</dt><dd>${esc(order.destination)}</dd></div><div><dt>Cantidad solicitada</dt><dd>${esc(order.requested)}</dd></div><div><dt>Documento logístico</dt><dd>${esc(order.document)}</dd></div><div><dt>Origen</dt><dd>${esc(order.source)}</dd></div>`;
    context.hidden=false;
    renderCurrent(); renderJourney(advancedIndex,startIndex,fromEmpty);
  }

  function findOrder(value){
    if(!value.trim()){showInitialState();return;}
    const canonicalId="PED-2026-10482";
    qs("#orderSearch").value=canonicalId;
    order=JSON.parse(JSON.stringify(orderBlueprints[canonicalId]));
    qs("[data-trace-empty]").hidden=true; qs("[data-trace-result]").hidden=false;
    renderOrder(-1,0); scheduleAutoAdvance();
  }

  function showInitialState(){
    window.clearTimeout(autoTimer); journeyRun+=1;
    qs("[data-order-context]").hidden=true;
    qs("[data-trace-empty]").hidden=false;
    qs("[data-trace-result]").hidden=true;
  }

  async function simulate(){
    if(order.current>=order.stages.length-1)return;
    const previousIndex=order.current; const nextIndex=previousIndex+1;
    const previous=order.stages[previousIndex]; const next=order.stages[nextIndex];
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const journey=qs("[data-journey]"); const vehicle=qs(".journey-vehicle",journey);
    journeyRun+=1;
    previous.state="complete";
    previous.time=previous.executionTime||previous.time.replace("Desde ","");
    next.state="current";
    next.time=next.executionTime||next.time;
    applyJourneyState(journey,previousIndex,false);
    vehicle.classList.add("is-driving");
    journey.style.setProperty("--progress",`${positionFor(nextIndex)}%`);
    journey.style.setProperty("--vehicle-progress",`${positionFor(nextIndex)}%`);
    journey.style.setProperty("--vehicle-step",String(nextIndex));
    await wait(reduced?0:680);
    order.current=nextIndex;
    qs(`[data-stage-index="${previousIndex}"] .journey-time`,journey).innerHTML=stageTimeMarkup(previousIndex);
    qs(`[data-stage-index="${nextIndex}"] .journey-time`,journey).innerHTML=stageTimeMarkup(nextIndex);
    vehicle.classList.remove("is-driving","is-delivered");
    vehicle.classList.toggle("is-delivered",nextIndex===order.stages.length-1);
    qs(".icon",vehicle).innerHTML=activeIcon(nextIndex);
    applyJourneyState(journey,nextIndex,true);
    const card=qs("[data-current-state]"); card.classList.add("is-leaving");
    await wait(reduced?0:180);
    renderCurrent();
    card.classList.remove("is-leaving"); card.classList.add("is-arriving");
    window.setTimeout(()=>card.classList.remove("is-arriving"),reduced?0:430);
  }

  function resetCycle(){
    const resetOrder=JSON.parse(JSON.stringify(orderBlueprints[order.id]));
    resetOrder.current=0;
    resetOrder.stages.forEach((stage,index)=>{stage.state=index===0?"current":"pending";});
    order=resetOrder;
    renderOrder(-1,0,true);
  }

  function scheduleAutoAdvance(delay=AUTO_INTERVAL){
    window.clearTimeout(autoTimer);
    autoTimer=window.setTimeout(async()=>{
      if(order.current>=order.stages.length-1) resetCycle();
      else await simulate();
      scheduleAutoAdvance();
    },delay);
  }

  function init(){
    SIALCore.initShell({area:"gestion",module:"materiales",view:"trazabilidad-pedido"});
    qs("[data-trace-search]").addEventListener("submit",event=>{event.preventDefault();findOrder(qs("#orderSearch").value);});
    qs("#orderSearch").addEventListener("input",event=>{if(!event.target.value.trim())showInitialState();});
    showInitialState();
  }

  return {init};
})();

SIALOrderTrace.init();
