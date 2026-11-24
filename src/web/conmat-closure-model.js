import {assignmentCoverage} from './conmat-assignment-model.js';
import {trackingRows} from './conmat-tracking-model.js';

export function closureReview(route,orders){
 const linked=orders.filter(order=>order.routeId===route.id),services=trackingRows([route],orders,route.carrierId);
 const issues=services.flatMap(service=>service.issues);
 const checks=[
  {label:'Ruta vigente para cierre',done:route.phase==='Programada'&&!['Cancelada','Anulado','Anulada'].includes(route.programmingStatus)},
  {label:'Órdenes vinculadas a la ruta',done:linked.length>0&&linked.every(order=>order.status!=='Cancelada'&&!['Cancelada','Anulado'].includes(order.programmingStatus)&&!route.trips.some(trip=>trip.id===order.tripId&&trip.programmingStatus==='Anulado'))},
  {label:'Asignaciones completas y vigentes',done:assignmentCoverage(route,orders).complete},
  {label:'Retorno registrado en todos los servicios',done:services.length>0&&services.every(service=>service.record.events.some(event=>event.kind==='return'))},
  {label:'Novedades operativas atendidas',done:issues.length===0}
 ];
 const signature=JSON.stringify({route,linked});
 return {linked,services,issues,checks,signature,ready:route.state!==3&&checks.every(check=>check.done)};
}
export function validateClosure(routes,orders,command){
 const route=routes.find(route=>route.id===command.routeId&&route.carrierId===command.companyId);
 if(!route||route.phase!=='Programada')throw new Error('La ruta no está vigente o no pertenece a tu empresa.');
 if(route.state===3||route.closure)throw new Error('La ruta ya está finalizada y sólo permite consulta.');
 const review=closureReview(route,orders);
 if(!review.ready)throw new Error('Completa las condiciones operativas antes de finalizar la ruta.');
 if(command.signature!==review.signature)throw new Error('La operación cambió. Revisa la información actualizada antes de confirmar.');
 return {route,review};
}
