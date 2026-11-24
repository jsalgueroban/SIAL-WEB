const companyIds=['caribe','norte','rutas'];
const plates=[['WFX-123','KLM-456','TUV-789'],['TRK-421','NRT-204','NRT-118'],['RDC-210','RDC-322','RDC-405']];
const names=[['Carlos Pérez','Ana Herrera','Luis Medina'],['Marta Ríos','José Torres','Pedro Díaz'],['Laura Peña','Diego Ruiz','Juan López']];
export const assignmentVehicles=companyIds.flatMap((carrierId,index)=>plates[index].map((plate,i)=>({id:`${carrierId}-vehicle-${i+1}`,carrierId,plate,enabled:i<2,description:i<2?'Documentación habilitada':'No habilitado · documentación vencida'})));
export const assignmentDrivers=companyIds.flatMap((carrierId,index)=>names[index].map((name,i)=>({id:`${carrierId}-driver-${i+1}`,carrierId,name,enabled:i<2,description:i<2?'Licencia habilitada':'No habilitado · licencia vencida'})));
export function routeAssignments(route){
 if(Array.isArray(route.assignments))return route.assignments;
 if(route.state<1||!/^R-00[2-6]$/.test(route.id))return [];
 return [{scope:'route',targetId:route.id,vehicleId:`${route.carrierId}-vehicle-1`,driverId:`${route.carrierId}-driver-1`,date:route.plannedDate,start:route.id==='R-006'?'14:00':'08:00',end:route.id==='R-006'?'18:00':'12:00',at:'2026-11-23T13:00:00Z',actor:'Operador de transporte'}];
}
export function assignmentOrders(route,orders,scope,targetId){return orders.filter(order=>order.routeId===route.id&&(scope==='route'||order.subgroupId===targetId));}
export function assignmentApplies(route,assignment,orders){
 const selected=assignmentOrders(route,orders,assignment.scope,assignment.targetId);
 return selected.length>0&&selected.every(order=>(order.plannedDate||route.plannedDate)===assignment.date)&&(!assignment.orderIds||JSON.stringify(selected.map(order=>order.id).sort())===JSON.stringify([...assignment.orderIds].sort()));
}
export function assignmentCoverage(route,orders){
 const groups=route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups).filter(group=>orders.some(order=>order.routeId===route.id&&order.subgroupId===group.id));
 const assignments=routeAssignments(route).filter(assignment=>assignmentApplies(route,assignment,orders));
 const complete=groups.length>0&&(assignments.some(assignment=>assignment.scope==='route')||groups.every(group=>assignments.some(assignment=>assignment.targetId===group.id)));
 return {complete,assigned:assignments.length,groups:groups.length};
}
export function operationalAssignmentRows(route,orders){
 return routeAssignments(route).map(assignment=>({...assignment,scopeLabel:assignment.scope==='route'?'Ruta completa':route.trips.flatMap(trip=>trip.groups).find(group=>group.id===assignment.targetId)?.name||'Subgrupo sin órdenes',plate:assignmentVehicles.find(vehicle=>vehicle.id===assignment.vehicleId)?.plate||'Sin vehículo',driver:assignmentDrivers.find(driver=>driver.id===assignment.driverId)?.name||'Sin conductor',valid:assignmentApplies(route,assignment,orders)}));
}
function fail(field,message){const error=new Error(message);error.field=field;throw error;}
export function validateOperationalAssignment(routes,orders,command){
 const route=routes.find(route=>route.id===command.routeId&&route.carrierId===command.companyId&&route.phase==='Programada');
 if(!route)fail('route','No se encontró un servicio asignado a tu empresa.');
 if(route.state>=2)fail('route','El servicio ya está en ejecución o finalizado y sólo permite consulta.');
 if(!['route','group'].includes(command.scope))fail('scope','Selecciona un alcance válido.');
 const activeGroups=route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups);
 if(command.scope==='route'&&command.targetId!==route.id||command.scope==='group'&&!activeGroups.some(group=>group.id===command.targetId))fail('scope','Selecciona un subgrupo activo de esta ruta.');
 const selected=assignmentOrders(route,orders,command.scope,command.targetId);
 if(!selected.length)fail('scope','Este alcance no tiene órdenes vigentes.');
 const dates=[...new Set(selected.map(order=>order.plannedDate||route.plannedDate))];
 if(dates.length!==1||!dates[0])fail('date','El alcance tiene fechas distintas o incompletas. Revisa la programación antes de asignar.');
 if(command.date!==dates[0])fail('date','La fecha de programación cambió. Vuelve a revisar el servicio.');
 const existingAssignments=routeAssignments(route);
 if(existingAssignments.some(assignment=>assignment.scope!==command.scope))fail('scope','Esta ruta ya utiliza otro alcance de asignación. No se puede mezclar ruta completa y subgrupos.');
 const vehicle=assignmentVehicles.find(vehicle=>vehicle.id===command.vehicleId&&vehicle.carrierId===command.companyId&&vehicle.enabled);
 const driver=assignmentDrivers.find(driver=>driver.id===command.driverId&&driver.carrierId===command.companyId&&driver.enabled);
 if(!vehicle)fail('vehicle','Selecciona un vehículo habilitado de tu empresa.');
 if(!driver)fail('driver','Selecciona un conductor habilitado de tu empresa.');
 const clock=/^(?:[01]\d|2[0-3]):[0-5]\d$/;
 if(!clock.test(command.start||''))fail('start','Escribe la hora de salida en formato HH:mm.');
 if(!clock.test(command.end||'')||command.end<=command.start)fail('end','El fin estimado debe ser posterior a la salida, en el mismo día.');
 const previous=existingAssignments.find(assignment=>assignment.scope===command.scope&&assignment.targetId===command.targetId);
 if(previous&&!command.reason?.trim())fail('reason','Indica el motivo del reemplazo o cambio de horario.');
 if(previous&&['vehicleId','driverId','date','start','end'].every(key=>previous[key]===command[key])&&assignmentApplies(route,previous,orders))fail('form','No hay cambios en la asignación.');
 if(command.expectedIds&&JSON.stringify([...command.expectedIds].sort())!==JSON.stringify(selected.map(order=>order.id).sort()))fail('form','Las órdenes cambiaron. Revisa la asignación nuevamente.');
 for(const candidate of routes.filter(candidate=>candidate.phase==='Programada'))for(const assignment of routeAssignments(candidate)){
  if(candidate.id===route.id&&assignment.scope===command.scope&&assignment.targetId===command.targetId)continue;
  if(!assignmentApplies(candidate,assignment,orders)||assignment.date!==command.date||assignment.end<=command.start||assignment.start>=command.end)continue;
  if(assignment.vehicleId===vehicle.id)fail('vehicle',`${vehicle.plate} tiene un servicio superpuesto en ${candidate.id} (${assignment.start}–${assignment.end}).`);
  if(assignment.driverId===driver.id)fail('driver',`${driver.name} tiene un servicio superpuesto en ${candidate.id} (${assignment.start}–${assignment.end}).`);
 }
 return {route,orders:selected,previous,vehicle,driver};
}
