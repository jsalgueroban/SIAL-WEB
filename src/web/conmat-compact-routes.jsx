import React,{useEffect,useRef,useState} from 'react';
import {Button,Card,Chip,SelectInput} from 'banasan-ui-conmat';
import {canMoveConmatOrders,carrierName,carriers,materialTotals,routeEditable,routeStateLabel} from './conmat-demo-store.js';

const dragType='application/x-sial-orders';

// Feature composition: external table drags are validated by the shared demo store.
export function CompactRouteCards({routes,orders,selectedIds,draggedIds,carrier,onCarrierChange,onCreate,onManage,onReview}){
 const [hovered,setHovered]=useState(null),[opened,setOpened]=useState(null);
 const hoverTimer=useRef(null),pendingRoute=useRef(null);
 useEffect(()=>{if(!draggedIds.length){clearTimeout(hoverTimer.current);pendingRoute.current=null;setHovered(null);}return()=>clearTimeout(hoverTimer.current);},[draggedIds.length]);
 function hoverRoute(id){if(pendingRoute.current===id)return;clearTimeout(hoverTimer.current);pendingRoute.current=id;hoverTimer.current=setTimeout(()=>setHovered(id),300);}
 function leaveRoute(event,id){if(event.currentTarget.contains(event.relatedTarget))return;clearTimeout(hoverTimer.current);pendingRoute.current=null;setHovered(current=>current===id?null:current);}
 const active=draggedIds.length?hovered:opened;
 function allowed(route,ids,groupId){return ids.length>0&&ids.every(itemId=>canMoveConmatOrders({routeId:route.id,ids:[itemId],fromGroupId:'available',toGroupId:groupId}));}
 function drop(event,route,groupId){
  if(!event.dataTransfer.types.includes(dragType))return;
  event.preventDefault();event.stopPropagation();
  try{const ids=JSON.parse(event.dataTransfer.getData(dragType));if(Array.isArray(ids)&&allowed(route,ids,groupId))onReview(route,ids,groupId);}catch{/* A foreign or stale drag cannot mutate the graph. */}
 }
 return <Card className="conmat-compact-routes">
  <header className="conmat-compact-heading"><h2>Rutas</h2><Button variant="outlined" onClick={onCreate}>Nueva ruta</Button></header>
  <SelectInput id="conmat-compact-carrier" label="Transportadora" value={carrier} options={[{value:'Todos',label:'Todas'},...carriers.filter(c=>c.enabled).map(c=>({value:c.id,label:c.name}))]} onChange={onCarrierChange}/>
  <p className="conmat-compact-help">Arrastra una orden sobre una ruta para desplegar sus destinos.</p>
  <div className="conmat-compact-list">
   {routes.map(route=>{
    const linked=orders.filter(order=>order.routeId===route.id);
    const trips=route.trips.filter(trip=>trip.programmingStatus!=='Anulado');
    const destinations=trips.flatMap(trip=>trip.groups.map(group=>({trip,group})));
    const expanded=active===route.id;
    const compatible=draggedIds.length>0&&destinations.some(({group})=>allowed(route,draggedIds,group.id));
    return <article key={route.id} data-route-card={route.id} className={`conmat-compact-card${expanded?' is-expanded':''}${draggedIds.length?(compatible?' is-compatible':' is-unavailable'):''}`} onDragEnter={event=>{if(event.dataTransfer.types.includes(dragType))hoverRoute(route.id);}} onDragLeave={event=>leaveRoute(event,route.id)} onDragOver={event=>{if(event.dataTransfer.types.includes(dragType)){event.preventDefault();hoverRoute(route.id);event.dataTransfer.dropEffect='none';}}}>
     <div className="conmat-compact-identity"><strong>{route.id} · {route.name}</strong><Chip preset={routeEditable(route)?'info':'inactive'}>{routeStateLabel(route)}</Chip></div>
     <p className="conmat-compact-company">{carrierName(route.carrierId)}</p>
     <p className="conmat-compact-meta">{linked.length} órdenes · {trips.length} viajes</p>
     <div className="conmat-compact-totals">{materialTotals(linked).map(line=><span key={line.name+line.unit}>{line.name} · {new Intl.NumberFormat('es-CO').format(line.quantity)} {line.unit}</span>)}{!linked.length&&<span>Sin órdenes agrupadas</span>}</div>
     <div className="conmat-compact-actions"><Button variant="ghost" aria-expanded={expanded} aria-controls={`destinations-${route.id}`} onClick={()=>setOpened(opened===route.id?null:route.id)}>{expanded?'Ocultar destinos':'Ver destinos'}</Button><Button variant="ghost" onClick={()=>onManage(route)}>Gestionar {route.id}</Button></div>
     {expanded&&<div id={`destinations-${route.id}`} className="conmat-compact-destinations">
      {!routeEditable(route)&&<p role="status">Ruta de sólo consulta: no admite nuevas órdenes.</p>}
      {routeEditable(route)&&draggedIds.length>0&&!compatible&&destinations.length>0&&<p role="status">Requiere órdenes preasignadas de esta transportadora.</p>}
      {!destinations.length&&<p>Esta ruta aún no tiene destinos activos. Usa Gestionar para crear viajes y subgrupos.</p>}
      {trips.map(trip=><section key={trip.id} className="conmat-compact-trip"><h3>{trip.name}</h3>{trip.groups.map(group=>{
       const canDrop=allowed(route,draggedIds,group.id),canSelect=allowed(route,selectedIds,group.id);
       const count=linked.filter(order=>order.subgroupId===group.id).length;
       return <div key={group.id} data-drop-group={group.id} className={`conmat-compact-drop${canDrop?' is-allowed':''}`} onDragOver={event=>{if(event.dataTransfer.types.includes(dragType)){event.preventDefault();event.stopPropagation();event.dataTransfer.dropEffect=canDrop?'move':'none';}}} onDrop={event=>drop(event,route,group.id)}>
        <div><strong>{group.name}</strong><small>{count} órdenes · {canDrop?'Suelta aquí':routeEditable(route)?'Destino de agrupación':'Sólo consulta'}</small></div>
        <Button variant="outlined" disabled={!canSelect} onClick={()=>onReview(route,selectedIds,group.id)}>Agregar seleccionadas</Button>
       </div>;
      })}</section>)}
     </div>}
    </article>;
   })}
   {!routes.length&&<p className="conmat-compact-help">No hay rutas para esta transportadora. Puedes crear una nueva.</p>}
  </div>
 </Card>;
}
