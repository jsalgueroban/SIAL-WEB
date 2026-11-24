import {carrierName,materialTotals,routeStateLabel} from './conmat-demo-store.js';

export function carrierWorkspace(routes,orders,companyId){
 const ownRoutes=routes.filter(route=>route.carrierId===companyId&&route.phase==='Programada');
 const ownOrders=orders.filter(order=>order.carrierId===companyId&&(!order.routeId?order.status==='Preasignada':ownRoutes.some(route=>route.id===order.routeId)));
 const notifications=ownRoutes.flatMap(route=>[
  {id:`route:${route.id}`,kind:'route',target:route.id,title:'Ruta recibida',description:`${route.id} · ${route.name}`,at:'2026-11-23T13:00:00Z'},
  ...route.events.map((event,index)=>({id:`route:${route.id}:${index}:${event.at}`,kind:'route',target:route.id,title:event.operation,description:event.reason||`${event.before} → ${event.after}`,at:event.at}))
 ]);
 ownOrders.filter(order=>!order.routeId).forEach(order=>order.events.filter(event=>!event.operation||event.operation==='Preasignación').forEach((event,index)=>notifications.push({id:`order:${order.id}:${index}:${event.at}`,kind:'order',target:order.id,title:'Orden preasignada',description:`${order.id} · ${order.farm}`,at:event.at})));
 routes.filter(route=>route.carrierId!==companyId).forEach(route=>route.events.filter(event=>event.previousCarrierId===companyId).forEach((event,index)=>notifications.push({id:`withdrawn-route:${route.id}:${index}:${event.at}`,kind:'route',target:route.id,title:'Ruta retirada de tu empresa',description:`${route.id} · La ruta ya no está asignada a tu empresa.`,at:event.at,withdrawn:true})));
 orders.filter(order=>order.carrierId!==companyId).forEach(order=>order.events.filter(event=>event.previousCarrierId===companyId).forEach((event,index)=>notifications.push({id:`withdrawn-order:${order.id}:${index}:${event.at}`,kind:'order',target:order.id,title:'Preasignación retirada',description:`${order.id} · La orden ya no está preasignada a tu empresa.`,at:event.at,withdrawn:true})));
 return {routes:ownRoutes,orders:ownOrders,notifications:notifications.sort((a,b)=>b.at.localeCompare(a.at))};
}
export function portalState(route,orders){return !orders.some(order=>order.routeId===route.id)?'Sin programación activa':routeStateLabel(route);}
export function portalMaterials(route,orders){return materialTotals(orders.filter(order=>order.routeId===route.id));}
export {carrierName};
