import {useSyncExternalStore} from 'react';
import {assignmentApplies,assignmentCoverage,assignmentDrivers,assignmentVehicles,routeAssignments,validateOperationalAssignment} from './conmat-assignment-model.js';
import {synchronizeTrackingRoute,trackingRecord,trackingSteps,validateTrackingCommand} from './conmat-tracking-model.js';
import {validateClosure} from './conmat-closure-model.js';
import {documentVersions,validateSupportCommand,validateSupportReview} from './conmat-documents-model.js';
export const routeFixtures=[
{id:'R-001',name:'Norte · Zona A',carrier:'Transportes del Caribe',farms:['El Rubí','La Bacota'],state:0,orders:3,qty:[['Cartón',55,'bultos'],['Estibas',20,'estibas']],note:'Pendiente de vehículo y conductor',docs:'Pendiente de soporte'},
{id:'R-002',name:'Centro · Zona B',carrier:'Logística del Norte',farms:['Villa Beatriz','Las Mercedes'],state:1,orders:2,qty:[['Cartón',85,'bultos']],note:'Salida programada · 24 nov., 08:00',docs:'Pendiente de soporte'},
{id:'R-003',name:'Sur · Zona C',carrier:'Transportes del Caribe',farms:['Arenal','Porvenir'],state:2,orders:2,qty:[['Mezcla 12-20-7',60,'bultos']],note:'Novedad: espera en finca',docs:'Pendiente de soporte'},
{id:'R-004',name:'Occidente · Zona D',carrier:'Rutas del Caribe',farms:['La Ceiba','Ángeles'],state:3,orders:2,qty:[['Estibas',40,'estibas']],note:'Recorrido finalizado',docs:'En revisión'},
{id:'R-005',name:'Norte · Zona E',carrier:'Logística del Norte',farms:['El Rubí'],state:1,orders:1,qty:[['Cartón',30,'bultos']],note:'Salida programada · 25 nov., 09:00',docs:'Pendiente de soporte'},
{id:'R-006',name:'Centro · Zona F',carrier:'Rutas del Caribe',farms:['Plantación'],state:3,orders:1,qty:[['Cartón',25,'bultos']],note:'Recorrido finalizado',docs:'Pendiente de soporte'}];
export const carriers=[
 {id:'caribe',name:'Transportes del Caribe',enabled:true},
 {id:'norte',name:'Logística del Norte',enabled:true},
 {id:'rutas',name:'Rutas del Caribe',enabled:true},
 {id:'suspendida',name:'Transportes del Magdalena',enabled:false}
];
const farms=['El Rubí','La Bacota','Villa Beatriz','Las Mercedes','Arenal','Porvenir','La Ceiba','Ángeles','Plantación'];
const material=(name,quantity,unit)=>({name,quantity,unit});
const carrierFor=name=>carriers.find(company=>company.name===name)?.id||'';
const routed=routeFixtures.flatMap((route,index)=>Array.from({length:route.orders},(_,position)=>{
 const items=route.id==='R-001'?[position===0?material('Cartón',55,'bultos'):material('Estibas',10,'estibas')]:[material(route.qty[0][0],Math.floor(route.qty[0][1]/route.orders)+(position===0?route.qty[0][1]%route.orders:0),route.qty[0][2])];
 return {routeId:route.id,carrierId:carrierFor(route.carrier),farm:route.farms[position%route.farms.length],status:'Programada',items};
}));
const pending=[
 {farm:'Plantación',items:[material('Mezcla 12-20-7',35,'bultos')]},
 {farm:'El Rubí',items:[material('Cartón',70,'bultos')]},
 {farm:'La Ceiba',items:[material('Estibas',18,'estibas')]},
 {farm:'Porvenir',items:[material('Cartón',42,'bultos')]},
 {farm:'Villa Beatriz',items:[material('Cartón',50,'bultos'),material('Estibas',12,'estibas')]},
 {farm:'Arenal',items:[material('Mezcla 12-20-7',22,'bultos')],originChange:'La cantidad de mezcla cambió de 15 a 22 bultos en la orden de origen.'},
 {farm:'Las Mercedes',items:[material('Estibas',30,'estibas')]},
 {farm:'Ángeles',items:[material('Cartón',64,'bultos')]}
].map(order=>({...order,status:'Pendiente',carrierId:'',routeId:null}));
const other=[
 {farm:'Plantación',items:[material('Cartón',90,'bultos')],status:'Preasignada',carrierId:'caribe',routeId:null},
 {farm:'La Bacota',items:[material('Estibas',16,'estibas')],status:'Preasignada',carrierId:'norte',routeId:null},
 {farm:'El Rubí',items:[material('Cartón',20,'bultos')],status:'Cancelada',carrierId:'',routeId:null}
];
export const initialOrders=[...pending,...other,...routed].map((order,index)=>({...order,id:`OS-${String(4801+index).padStart(5,'0')}`,createdAt:`2026-11-${String(23-index%5).padStart(2,'0')}`,events:order.status==='Preasignada'?[{at:'2026-11-23T13:00:00Z',actor:'Usuario de demostración',before:'Sin preasignar',after:carriers.find(company=>company.id===order.carrierId)?.name}]:[]}));
const storageKey='sial-conmat-demo-orders-v1';
export const initialRoutes=routeFixtures.map((route,index)=>{
 const linked=initialOrders.filter(order=>order.routeId===route.id);
 const farms=[...new Set(linked.map(order=>order.farm))];
 return {id:route.id,name:route.name,carrierId:carrierFor(route.carrier),plannedDate:`2026-11-${route.id==='R-002'?'24':route.id==='R-005'?'25':'23'}`,phase:'Programada',state:route.state,docs:route.docs,note:route.note,events:[],trips:[{id:`${route.id}-V01`,name:'Viaje 1',groups:farms.map((farm,position)=>({id:`${route.id}-V01-S${String(position+1).padStart(2,'0')}`,name:`Subgrupo ${position+1}`}))}]};
});
function attachInitialHierarchy(orders,routes){
 return orders.map(order=>{
  if(!order.routeId)return {...order,tripId:null,subgroupId:null};
  const route=routes.find(candidate=>candidate.id===order.routeId);
  const farmIndex=[...new Set(initialOrders.filter(candidate=>candidate.routeId===order.routeId).map(candidate=>candidate.farm))].indexOf(order.farm);
  return {...order,tripId:route.trips[0].id,subgroupId:route.trips[0].groups[Math.max(0,farmIndex)].id};
 });
}
function initialState(orders=initialOrders){return {version:2,orders:attachInitialHierarchy(orders,initialRoutes),routes:structuredClone(initialRoutes)};}
function readSnapshot(){
 try{
  const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
  if(saved?.orders?.length===initialOrders.length&&saved.orders.every((order,index)=>order.id===initialOrders[index].id&&Array.isArray(order.items)&&Array.isArray(order.events))){
   if(saved.version===2&&Array.isArray(saved.routes)){validateGraph(saved);return saved;}
   if(saved.version===1)return initialState(saved.orders);
  }
 }catch{}
 return initialState();
}
const listeners=new Set();
let snapshot=readSnapshot();
export function subscribeOrders(listener){listeners.add(listener);return()=>listeners.delete(listener);}
export function useConmatOrders(){return useSyncExternalStore(subscribeOrders,()=>snapshot.orders);}
export function useConmatRoutes(){return useSyncExternalStore(subscribeOrders,()=>snapshot.routes);}
export function useConmatRouteSummaries(){const routes=useConmatRoutes();const orders=useConmatOrders();return routes.map(route=>summarizeRoute(route,orders));}
export function canPreassign(order){return !order.routeId&&(order.status==='Pendiente'||order.status==='Preasignada');}
export function carrierName(id){return carriers.find(company=>company.id===id)?.name||'Sin preasignar';}
export function routeEditable(route){return route.state<2;}
export function routeStateLabel(route){return route.phase==='En construcción'?'En construcción':['Pendiente de asignación','Programada','En ejecución','Finalizada'][route.state];}
export function materialTotals(selected){
 const totals=new Map();
 selected.forEach(order=>order.items.forEach(item=>{const key=JSON.stringify([item.name,item.unit]);const current=totals.get(key)||{name:item.name,unit:item.unit,quantity:0};current.quantity+=item.quantity;totals.set(key,current);}));
 return [...totals.values()];
}
export function summarizeRoute(route,orders){
 const linked=orders.filter(order=>order.routeId===route.id);
 return {...route,carrier:carrierName(route.carrierId),farms:[...new Set(linked.map(order=>order.farm))],orders:linked.length,qty:materialTotals(linked).map(line=>[line.name,line.quantity,line.unit])};
}
function validateGraph(state){
 const routeIds=new Set();
 state.routes.forEach(route=>{if(routeIds.has(route.id))throw new Error('Identificador de ruta repetido.');routeIds.add(route.id);const ids=new Set();route.trips.forEach(trip=>{if(ids.has(trip.id))throw new Error('Viaje repetido.');ids.add(trip.id);trip.groups.forEach(group=>{if(ids.has(group.id))throw new Error('Subgrupo repetido.');ids.add(group.id);});});});
 const orderIds=new Set();
 state.orders.forEach(order=>{
  if(orderIds.has(order.id))throw new Error('Orden repetida.');orderIds.add(order.id);
  if(!order.routeId){if(order.tripId||order.subgroupId||order.status==='Programada')throw new Error('Orden sin agrupación válida.');return;}
  const route=state.routes.find(candidate=>candidate.id===order.routeId);
  const trip=route?.trips.find(candidate=>candidate.id===order.tripId);
  if(!trip?.groups.some(group=>group.id===order.subgroupId)||route.carrierId!==order.carrierId||!['Preasignada','Programada'].includes(order.status))throw new Error('La orden no coincide con la estructura de su ruta.');
  if(route.phase==='Programada'&&order.status!=='Programada')throw new Error('El estado de la orden no coincide con su programación.');
 });
}
function commit(next){
 next={...next,routes:next.routes.map(route=>{
  if(route.trackingRecords?.length)return synchronizeTrackingRoute(route,next.orders);
  if(route.phase!=='Programada'||route.state>=2||!Array.isArray(route.assignments))return route;
  const coverage=assignmentCoverage(route,next.orders);
  return {...route,state:coverage.complete?1:0,note:coverage.complete?'Vehículo y conductor asignados':coverage.assigned?`Asignación parcial · ${coverage.assigned} de ${coverage.groups} subgrupos`:'Pendiente de vehículo y conductor'};
 })};
 validateGraph(next);
 try{localStorage.setItem(storageKey,JSON.stringify(next));}catch{throw new Error('No se pudo conservar la demostración. No se aplicaron cambios.');}
 snapshot=next;listeners.forEach(listener=>listener());
}
function eventRecord(operation,before,after){return {at:new Date().toISOString(),actor:'Usuario de demostración',operation,before,after};}
function requireRoute(id,state=snapshot){const route=state.routes.find(candidate=>candidate.id===id);if(!route)throw new Error('No se encontró la ruta.');return route;}
function requireEditable(route){if(!routeEditable(route))throw new Error('La ruta ya está en ejecución o finalizada y sólo permite consulta.');}
function nextId(prefix,records){const max=Math.max(0,...records.map(record=>Number(record.id.slice(prefix.length))||0));return `${prefix}${String(max+1).padStart(2,'0')}`;}
export function preassignOrders(ids,carrierId){
 const company=carriers.find(company=>company.id===carrierId&&company.enabled);
 if(!company)throw new Error('Selecciona una transportadora habilitada.');
 const selected=snapshot.orders.filter(order=>ids.includes(order.id));
 if(!selected.length||selected.length!==ids.length||selected.some(order=>!canPreassign(order)))throw new Error('La selección cambió. Las órdenes agrupadas deben gestionarse desde su ruta.');
 const changed=selected.filter(order=>order.carrierId!==carrierId||order.status!=='Preasignada');
 if(!changed.length)throw new Error('Las órdenes ya están preasignadas a esta transportadora.');
 const orders=snapshot.orders.map(order=>changed.some(candidate=>candidate.id===order.id)?{...order,status:'Preasignada',carrierId,events:[...order.events,{...eventRecord('Preasignación',carrierName(order.carrierId),company.name),previousCarrierId:order.carrierId}]}:order);
 commit({...snapshot,orders});return changed.length;
}
export function saveConmatRoute({id,name,carrierId,plannedDate}){
 if(!name.trim())throw new Error('Escribe el nombre de la ruta.');
 if(!carriers.some(company=>company.id===carrierId&&company.enabled))throw new Error('Selecciona una transportadora habilitada.');
 const next=structuredClone(snapshot);
 let route;
 if(id){route=requireRoute(id,next);requireEditable(route);}else{
  const number=Math.max(0,...next.routes.map(route=>Number(route.id.replace('R-',''))||0))+1;
  route={id:`R-${String(number).padStart(3,'0')}`,name:'',carrierId,plannedDate:'',phase:'En construcción',state:0,docs:'Pendiente de soporte',note:'Agrupación en construcción',events:[],trips:[]};next.routes.push(route);
 }
 const previousCarrierId=route.carrierId;
 const before=id?`${route.name} · ${carrierName(route.carrierId)} · ${route.plannedDate||'Sin fecha'}`:'Sin ruta';
 if(id&&route.state>0&&!Array.isArray(route.assignments))route.assignments=structuredClone(routeAssignments(route));
 if(route.carrierId!==carrierId){route.assignments=[];next.orders=next.orders.map(order=>order.routeId===route.id?{...order,carrierId,events:[...order.events,eventRecord('Cambio de transportadora de ruta',carrierName(order.carrierId),carrierName(carrierId))]}:order);}
 Object.assign(route,{name:name.trim(),carrierId,plannedDate:plannedDate||''});
 route.events.push({...eventRecord(id?'Editar ruta':'Crear ruta',before,`${route.name} · ${carrierName(carrierId)} · ${plannedDate||'Sin fecha'}`),...(previousCarrierId!==carrierId?{previousCarrierId}:{})});
 commit(next);return route.id;
}
export function saveConmatLevel({routeId,tripId,groupId,kind,name}){
 if(!name.trim())throw new Error(`Escribe el nombre del ${kind==='trip'?'viaje':'subgrupo'}.`);
 const next=structuredClone(snapshot),route=requireRoute(routeId,next);requireEditable(route);
 let level;
 if(kind==='trip'){
  level=tripId?route.trips.find(trip=>trip.id===tripId):null;
  if(level?.programmingStatus==='Anulado')throw new Error('El viaje anulado se conserva sólo para consulta.');
  if(tripId&&!level)throw new Error('El viaje ya no está disponible.');
  if(!level){level={id:nextId(`${route.id}-V`,route.trips),name:'',groups:[]};route.trips.push(level);}
 }else{
  const trip=route.trips.find(candidate=>candidate.id===tripId);if(!trip||trip.programmingStatus==='Anulado')throw new Error('Selecciona un viaje activo.');
  level=groupId?trip.groups.find(group=>group.id===groupId):null;
  if(groupId&&!level)throw new Error('El subgrupo ya no está disponible.');
  if(!level){level={id:nextId(`${trip.id}-S`,trip.groups),name:''};trip.groups.push(level);}
 }
 const before=level.name||'Sin agrupación';level.name=name.trim();route.events.push(eventRecord(kind==='trip'?'Guardar viaje':'Guardar subgrupo',before,level.name));commit(next);return level.id;
}
function validateMove({routeId,ids,toGroupId,fromGroupId}){
 const route=requireRoute(routeId);requireEditable(route);
 const destination=route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups.map(group=>({...group,tripId:trip.id}))).find(group=>group.id===toGroupId);
 if(toGroupId!=='available'&&!destination)throw new Error('Selecciona un subgrupo de esta ruta.');
 if(!ids.length||new Set(ids).size!==ids.length)throw new Error('Selecciona órdenes sin duplicarlas.');
 const selected=ids.map(id=>snapshot.orders.find(order=>order.id===id));
 if(selected.some(order=>!order||order.carrierId!==route.carrierId||order.status==='Cancelada'||(order.routeId&&order.routeId!==routeId)||(!order.routeId&&order.status!=='Preasignada')))throw new Error('Sólo se pueden incorporar órdenes preasignadas de la misma transportadora.');
 if(selected.some(order=>(order.subgroupId||'available')!==fromGroupId))throw new Error('La selección cambió. Revisa su agrupación actual.');
 if(fromGroupId===toGroupId)throw new Error('Elige un subgrupo diferente.');
 return {route,destination};
}
export function canMoveConmatOrders(command){try{validateMove(command);return true;}catch{return false;}}
export function moveConmatOrders(command){
 const {route,destination}=validateMove(command);
 const next=structuredClone(snapshot),target=requireRoute(route.id,next);
 const before=command.fromGroupId==='available'?'Órdenes disponibles':command.fromGroupId;
 const after=destination?destination.id:'Órdenes disponibles';
 next.orders=next.orders.map(order=>command.ids.includes(order.id)?{...order,plannedDate:null,programmingStatus:null,routeId:destination?route.id:null,tripId:destination?destination.tripId:null,subgroupId:destination?destination.id:null,status:destination?(route.phase==='Programada'?'Programada':'Preasignada'):'Preasignada',events:[...order.events,eventRecord('Mover orden',before,after)]}:order);
 target.events.push(eventRecord(`Mover ${command.ids.join(', ')}`,before,after));commit(next);
}
export function routeProgrammingIssues(route,orders=snapshot.orders){
 const issues=[];
 if(!route.plannedDate)issues.push('Define la fecha programada de la ruta.');
 const activeTrips=route.trips.filter(trip=>trip.programmingStatus!=='Anulado');
 if(!activeTrips.length)issues.push('Agrega al menos un viaje activo.');
 activeTrips.forEach(trip=>{if(!trip.groups.length)issues.push(`${trip.name} no tiene subgrupos.`);trip.groups.forEach(group=>{if(!orders.some(order=>order.routeId===route.id&&order.subgroupId===group.id))issues.push(`${trip.name} / ${group.name} no tiene órdenes.`);});});
 return issues;
}
export function confirmConmatRoute(id){
 const route=requireRoute(id);requireEditable(route);
 if(route.phase!=='En construcción')throw new Error('La ruta ya tiene una programación confirmada.');
 const issues=routeProgrammingIssues(route);if(issues.length)throw new Error(issues.join(' '));
 const next=structuredClone(snapshot),target=requireRoute(id,next);target.phase='Programada';target.note='Pendiente de vehículo y conductor';
 target.events.push(eventRecord('Confirmar programación','En construcción','Programada'));
 next.orders=next.orders.map(order=>order.routeId===id?{...order,status:'Programada',events:[...order.events,eventRecord('Programar orden','Preasignada',id)]}:order);
 commit(next);
}
export function previewConmatProgrammingChange({routeId,action,scope,ids=[],targetId,date,reason}){
 const route=requireRoute(routeId);requireEditable(route);
 if(!reason?.trim())throw new Error('Escribe el motivo del cambio.');
 if(!['cancel','annul','reschedule'].includes(action))throw new Error('Selecciona una acción válida.');
 if(action!=='reschedule'&&scope!==(action==='annul'?'trip':'orders'))throw new Error('El alcance no corresponde a la acción.');
 if(!['route','group','orders','trip'].includes(scope)||(action==='reschedule'&&scope==='trip'))throw new Error('Selecciona un alcance válido.');
 const linked=snapshot.orders.filter(order=>order.routeId===routeId);
 const trip=scope==='trip'?route.trips.find(trip=>trip.id===targetId&&trip.programmingStatus!=='Anulado'):null;
 const group=scope==='group'?route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups).find(group=>group.id===targetId):null;
 if((scope==='trip'&&!trip)||(scope==='group'&&!group))throw new Error('Selecciona una agrupación activa.');
 const selected=scope==='orders'?linked.filter(order=>ids.includes(order.id)):scope==='trip'?linked.filter(order=>order.tripId===targetId):scope==='group'?linked.filter(order=>order.subgroupId===targetId):linked;
 if(scope==='orders'&&(!ids.length||new Set(ids).size!==ids.length||selected.length!==ids.length))throw new Error('Selecciona órdenes que sigan perteneciendo a esta ruta.');
 if(!selected.length&&action!=='annul')throw new Error('El alcance seleccionado no tiene órdenes.');
 if(action==='reschedule'){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||new Date(`${date}T12:00:00Z`).toISOString().slice(0,10)!==date)throw new Error('Selecciona una fecha válida.');
  if(selected.every(order=>(order.plannedDate||route.plannedDate)===date))throw new Error('La nueva fecha debe ser diferente de la programación actual.');
 }
 return {orders:selected,scopeLabel:trip?.name||group?.name||(scope==='route'?'Ruta completa':'Órdenes seleccionadas'),assigned:route.state===1};
}
export function changeConmatProgramming(command){
 const preview=previewConmatProgrammingChange(command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 if(route.state>0&&!Array.isArray(route.assignments))route.assignments=structuredClone(routeAssignments(route));
 if(command.expectedIds&&JSON.stringify([...command.expectedIds].sort())!==JSON.stringify(preview.orders.map(order=>order.id).sort()))throw new Error('La composición cambió. Vuelve a revisar el alcance antes de confirmar.');
 const label={cancel:'Cancelada',annul:'Anulado',reschedule:'Reprogramado'}[command.action];
 const operation={cancel:'Cancelar programación',annul:'Anular viaje',reschedule:'Reprogramar'}[command.action];
 const selectedIds=preview.orders.map(order=>order.id);
 const before=preview.orders.map(order=>`${order.id}: ${order.routeId}/${order.tripId}/${order.subgroupId} · ${order.plannedDate||route.plannedDate}`).join('; ')||preview.scopeLabel;
 const after=command.action==='reschedule'?`${preview.scopeLabel} · ${command.date}`:'Disponibles para nueva programación';
 const event={...eventRecord(operation,before,after),reason:command.reason.trim(),programmingStatus:label,orderIds:selectedIds,communication:preview.assigned?'Pendiente de comunicar a la transportadora':'Sin asignación operativa'};
 next.orders=next.orders.map(order=>selectedIds.includes(order.id)?{...order,...(command.action==='reschedule'?{plannedDate:command.date}:{routeId:null,tripId:null,subgroupId:null,status:'Preasignada',plannedDate:null}),programmingStatus:label,events:[...order.events,event]}:order);
 if(command.action==='annul')route.trips.find(trip=>trip.id===command.targetId).programmingStatus='Anulado';
 if(command.action==='reschedule'&&command.scope==='route')route.plannedDate=command.date;
 if(command.action==='reschedule'&&command.scope==='group')route.trips.flatMap(trip=>trip.groups).find(group=>group.id===command.targetId).plannedDate=command.date;
 route.events.push(event);commit(next);return {count:selectedIds.length,label};
}
export function previewConmatAssignment(command){return validateOperationalAssignment(snapshot.routes,snapshot.orders,command);}
export function saveConmatAssignment(command){
 const checked=previewConmatAssignment(command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 const actor='Operador de transporte',at=new Date().toISOString();
 const assignment={scope:command.scope,targetId:command.targetId,vehicleId:command.vehicleId,driverId:command.driverId,date:command.date,start:command.start,end:command.end,actor,at,orderIds:checked.orders.map(order=>order.id)};
 route.assignments=[...routeAssignments(route).filter(assignment=>assignment.targetId!==command.targetId),assignment];
 const describe=assignment=>`${assignmentVehicles.find(vehicle=>vehicle.id===assignment.vehicleId)?.plate||'Vehículo'} · ${assignmentDrivers.find(driver=>driver.id===assignment.driverId)?.name||'Conductor'} · ${assignment.date} ${assignment.start}–${assignment.end}`;
 const event={...eventRecord(checked.previous?'Reemplazar asignación operativa':'Confirmar asignación operativa',checked.previous?describe(checked.previous):'Sin asignación',describe(assignment)),actor,at,reason:command.reason?.trim()||'',targetId:command.targetId};
 route.events.push(event);commit(next);return assignment;
}
export function reviewConmatSupport(command){
 const checked=validateSupportReview(snapshot.routes,command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 const at=new Date().toISOString(),actor='Revisor Banasan',status=command.action==='approve'?'Aprobado':'Rechazado',observation=command.observation?.trim()||'';
 route.documentVersions=structuredClone(checked.versions);
 Object.assign(route.documentVersions.at(-1),{status,reviewedAt:at,reviewedBy:actor,reviewObservation:observation});
 route.docs=status;route.administrative={enabled:status==='Aprobado',version:checked.latest.id,at,actor};
 route.events.push({...eventRecord(command.action==='approve'?'Soporte aprobado':'Soporte rechazado','En revisión',status),at,actor,reason:observation||checked.latest.name});
 commit(next);return status;
}
export function saveConmatSupport(command){
 const checked=validateSupportCommand(snapshot.routes,command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 const at=new Date().toISOString(),actor='Operador de transporte';
 route.documentVersions=structuredClone(documentVersions(route));
 const before=route.docs;
 if(command.action==='upload')route.documentVersions.push({...command.file,number:checked.versions.length+1,at,actor,status:'Soporte cargado',observation:command.observation?.trim()||'',services:routeAssignments(route).filter(assignment=>assignmentApplies(route,assignment,next.orders)).map(assignment=>assignment.targetId)});
 else Object.assign(route.documentVersions.at(-1),{status:'En revisión',submittedAt:at,submittedBy:actor});
 route.docs=route.documentVersions.at(-1).status;
 route.administrative={enabled:false};
 route.events.push({...eventRecord(command.action==='upload'?'Soporte cargado':'Soporte enviado a revisión',before,route.docs),at,actor,reason:route.documentVersions.at(-1).name});
 commit(next);return route.documentVersions.at(-1);
}
export function closeConmatRoute(command){
 const checked=validateClosure(snapshot.routes,snapshot.orders,command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 const actor='Operador de transporte',at=new Date().toISOString(),observation=command.observation?.trim()||'';
 const records=routeAssignments(route).map(assignment=>trackingRecord(route,assignment));
 route.trackingRecords=[...(route.trackingRecords||[]).filter(record=>!records.some(current=>current.key===record.key)),...structuredClone(records)];
 for(const service of checked.review.services){const record=route.trackingRecords.find(record=>record.key===service.record.key);record.stage='Finalizada';record.events.push({kind:'close',label:'Cierre operativo',at,actor,observation});}
 route.closure={at,actor,observation};
 route.events.push({...eventRecord('Cierre operativo','En operación','Finalizada'),at,actor,reason:observation});
 commit(next);return route.id;
}
export function recordConmatTracking(command){
 const checked=validateTrackingCommand(snapshot.routes,snapshot.orders,command),next=structuredClone(snapshot),route=requireRoute(command.routeId,next);
 const actor='Operador de transporte',at=new Date().toISOString(),observation=command.observation?.trim()||'';
 const records=routeAssignments(route).map(assignment=>trackingRecord(route,assignment));
 route.trackingRecords=[...(route.trackingRecords||[]).filter(record=>!records.some(current=>current.key===record.key)),...structuredClone(records)];
 const record=route.trackingRecords.find(record=>record.key===checked.record.key);
 let label;
 if(command.action==='milestone'){
  label=trackingSteps.find(step=>step.id===command.step).label;
  record.events.push({kind:command.step,label,at,actor,observation});
  if(command.step==='prepare')record.stage='Pendiente de salida';
  if(command.step==='depart')record.stage='En operación';
 }else if(command.action==='issue'){
  label='Novedad reportada';record.issues.push({id:`${at}:${record.issues.length}`,observation,actor,at});
  record.events.push({kind:'issue',label,observation,actor,at});
 }else{
  label='Novedad atendida';const issue=record.issues.find(issue=>issue.id===command.issueId);
  Object.assign(issue,{resolvedAt:at,resolvedBy:actor,resolution:observation});
  record.events.push({kind:'resolve',label,observation,actor,at});
 }
 route.events.push({...eventRecord(label,checked.record.stage,record.stage),at,actor,reason:observation,targetId:command.targetId});
 commit(next);return label;
}
window.addEventListener('storage',event=>{if(event.key===storageKey){snapshot=readSnapshot();listeners.forEach(listener=>listener());}});
