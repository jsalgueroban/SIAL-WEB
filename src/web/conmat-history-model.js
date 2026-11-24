export function visibleHistoryRoutes(routes,{internal=false,companyId}={}){return routes.filter(route=>internal||(route.phase==='Programada'&&route.carrierId===companyId));}
export function routeHistory(route,operation='Todas'){
 return (route.events||[]).map((event,index)=>({...event,key:`${route.id}:${index}:${event.at}`,index})).filter(event=>operation==='Todas'||event.operation===operation).sort((a,b)=>b.at.localeCompare(a.at)||b.index-a.index);
}
export function historyScope(route,event){
 if(event.orderIds?.length)return event.orderIds.join(' · ');
 if(!event.targetId||event.targetId===route.id)return 'Ruta completa';
 const trip=route.trips.find(trip=>trip.id===event.targetId),group=route.trips.flatMap(trip=>trip.groups).find(group=>group.id===event.targetId);
 return trip?.name||group?.name||event.targetId;
}
export function historyRecordHref(route,event,{internal=false,companyId}={}){
 const role=internal?'interno=1':`empresa=${encodeURIComponent(companyId||route.carrierId)}`;
 const target=/soporte/i.test(event.operation)?internal?'conmat-revision-documental.html':'conmat-soportes.html':/cierre operativo/i.test(event.operation)?'conmat-cierre.html':/asignaci|hito|salida|llegada|entrega|retorno|novedad/i.test(event.operation)?'conmat-seguimiento.html':internal?'conmat-rutas.html':'conmat-transportadora.html';
 return `${target}?${role}&ruta=${encodeURIComponent(route.id)}`;
}
