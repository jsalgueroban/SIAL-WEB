import {assignmentApplies,assignmentCoverage,assignmentOrders,operationalAssignmentRows,routeAssignments} from './conmat-assignment-model.js';

export const trackingSteps=[{id:'programmed',label:'Programación confirmada'},{id:'prepare',label:'Pendiente de salida'},{id:'depart',label:'Salida registrada'},{id:'arrive',label:'Llegada a finca'},{id:'deliver',label:'Entrega registrada'},{id:'return',label:'Retorno registrado'},{id:'close',label:'Cierre operativo'}];
export const assignmentKey=assignment=>[assignment.targetId,assignment.at,assignment.vehicleId,assignment.driverId,assignment.date,assignment.start,assignment.end].join('|');
export function trackingRecord(route,assignment){
 const key=assignmentKey(assignment),stored=route.trackingRecords?.find(record=>record.key===key);
 if(stored)return stored;
 const stage=route.state===3?'Finalizada':route.state===2?'En operación':route.note.startsWith('Salida programada')?'Pendiente de salida':'Programada';
 const at=assignment.at||`${assignment.date}T${assignment.start}:00-05:00`,actor=assignment.actor||'Operador de transporte';
 const ids=stage==='Finalizada'?trackingSteps.map(step=>step.id):stage==='En operación'?['programmed','prepare','depart']:stage==='Pendiente de salida'?['programmed','prepare']:['programmed'];
 const events=ids.map(id=>({kind:id,label:trackingSteps.find(step=>step.id===id).label,at,actor,observation:''}));
 const issue=!route.trackingRecords?.length&&route.note.startsWith('Novedad')?{id:`seed:${route.id}:${assignment.targetId}`,observation:route.note.replace(/^Novedad:\s*/,''),at,actor}:null;
 return {key,targetId:assignment.targetId,stage,events,issues:issue?[issue]:[]};
}
export function nextTrackingStep(record){
 if(record.stage==='Finalizada')return null;
 return trackingSteps.find(step=>step.id!=='close'&&!record.events.some(event=>event.kind===step.id))||null;
}
export function trackingRows(routes,orders,companyId){
 return routes.filter(route=>route.phase==='Programada'&&(!companyId||route.carrierId===companyId)).flatMap(route=>operationalAssignmentRows(route,orders).filter(assignment=>assignment.valid).map(assignment=>{
  const record=trackingRecord(route,assignment),linked=assignmentOrders(route,orders,assignment.scope,assignment.targetId);
  return {...assignment,id:`${route.id}:${assignment.targetId}`,route,record,farms:[...new Set(linked.map(order=>order.farm))],issues:record.issues.filter(issue=>!issue.resolvedAt)};
 }));
}
export function trackingDelay(row,now=Date.now()){
 if(row.record.stage==='Finalizada')return '';
 const departed=row.record.events.some(event=>event.kind==='depart');
 if(!departed&&now>new Date(`${row.date}T${row.start}:00-05:00`).getTime())return 'Salida atrasada';
 if(departed&&now>new Date(`${row.date}T${row.end}:00-05:00`).getTime())return 'Fin estimado vencido';
 return '';
}
export function trackingIndicators(rows){
 const distinct=predicate=>new Set(rows.filter(predicate).map(row=>row.vehicleId)).size;
 return [{label:'Programados',value:distinct(row=>row.record.stage==='Programada')},{label:'Pendientes de salida',value:distinct(row=>row.record.stage==='Pendiente de salida')},{label:'En operación',value:distinct(row=>row.record.stage==='En operación')},{label:'Con novedades',value:distinct(row=>row.issues.length>0)},{label:'Finalizados',value:distinct(row=>row.record.stage==='Finalizada')}];
}
export function synchronizeTrackingRoute(route,orders){
 const rows=trackingRows([route],orders,route.carrierId),coverage=assignmentCoverage(route,orders);
 const issues=rows.flatMap(row=>row.issues),active=rows.some(row=>row.record.stage==='En operación'),finished=rows.length>0&&rows.every(row=>row.record.stage==='Finalizada');
 const state=finished?3:active?2:coverage.complete?1:0;
 const pendingClose=rows.some(row=>row.record.events.some(event=>event.kind==='return'));
 const note=issues.length?`Novedad: ${issues.at(-1).observation}`:finished?'Recorrido finalizado':pendingClose?'Retorno registrado · Pendiente de cierre':active?'En operación':state===0?(coverage.assigned?`Asignación parcial · ${coverage.assigned} de ${coverage.groups} subgrupos`:'Pendiente de vehículo y conductor'):rows.some(row=>row.record.stage==='Pendiente de salida')?'Pendiente de salida':'Vehículo y conductor asignados';
 return {...route,state,note};
}
export function validateTrackingCommand(routes,orders,command){
 const route=routes.find(route=>route.id===command.routeId&&route.carrierId===command.companyId&&route.phase==='Programada');
 if(!route)throw new Error('El servicio no está disponible para tu empresa.');
 const assignment=routeAssignments(route).find(assignment=>assignment.targetId===command.targetId&&assignmentApplies(route,assignment,orders));
 if(!assignment)throw new Error('La asignación cambió o requiere revisión. Actualiza el servicio antes de continuar.');
 const record=trackingRecord(route,assignment);
 if(command.assignmentKey&&command.assignmentKey!==record.key)throw new Error('La asignación cambió. Revisa el seguimiento nuevamente.');
 if(record.stage==='Finalizada'||route.state===3)throw new Error('El servicio está finalizado y sólo permite consulta.');
 if(command.action==='milestone'){
  const next=nextTrackingStep(record);
  if(!next||next.id!==command.step)throw new Error('El hito no corresponde al siguiente paso de la operación.');
  if(command.step==='depart'&&!assignmentCoverage(route,orders).complete)throw new Error('Completa las asignaciones de la ruta antes de registrar la salida.');
 }else if(command.action==='issue'||command.action==='resolve'){
  if(!command.observation?.trim()){const error=new Error('Escribe las observaciones de la novedad.');error.field='observation';throw error;}
  if(command.action==='resolve'&&!record.issues.some(issue=>issue.id===command.issueId&&!issue.resolvedAt))throw new Error('Esta novedad ya fue atendida o no pertenece al servicio.');
 }else throw new Error('Selecciona una acción válida.');
 return {route,assignment,record};
}
