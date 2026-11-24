import React,{useEffect,useRef,useState} from 'react';
import {Button,Card,Chip,DateInput,DrawerAuditList,EditIcon,FilterToolbar,GroupMove,IconButton,KeyValueGrid,Notice,SelectInput,Table,TextInput,ToastProvider,Toolbar,TreeList,useToast} from 'banasan-ui-conmat';
import {ConmatFloatingView} from './conmat-floating-view.jsx';
import {canMoveConmatOrders,carrierName,carriers,confirmConmatRoute,materialTotals,moveConmatOrders,routeEditable,routeProgrammingIssues,routeStateLabel,saveConmatLevel,saveConmatRoute,useConmatOrders,useConmatRoutes} from './conmat-demo-store.js';
import './conmat-routes.css';
import {ConmatProgrammingChange} from './conmat-programming-change.jsx';

const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
const dateKey=value=>value?`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`:'';
const parseDate=value=>value?new Date(`${value}T12:00:00`):null;
const showDate=value=>value?new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',year:'numeric'}).format(parseDate(value)):'Sin definir';
const eventDate=value=>new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'America/Bogota'}).format(new Date(value));
const quantity=value=>new Intl.NumberFormat('es-CO').format(value);
const options=values=>values.map(value=>({value,label:value}));
const materialsColumns=[{key:'name',header:'Material / insumo',render:line=>line.name},{key:'quantity',header:'Cantidad',align:'right',render:line=>quantity(line.quantity)},{key:'unit',header:'Unidad',render:line=>line.unit}];
function locate(routes,key){
 for(const route of routes){
  if(route.id===key)return {route};
  for(const trip of route.trips){if(trip.id===key)return {route,trip};const group=trip.groups.find(group=>group.id===key);if(group)return {route,trip,group};}
 }
 return {};
}
export function ConmatRoutes(){return <ToastProvider placement="bottom-right"><RoutesWorkspace/></ToastProvider>;}
function RoutesWorkspace(){
 const routes=useConmatRoutes(),orders=useConmatOrders(),toast=useToast();
 const [query,setQuery]=useState(''),[carrierFilter,setCarrierFilter]=useState(new URLSearchParams(location.search).get('transportadora')||'Todos'),[phaseFilter,setPhaseFilter]=useState('Todos'),[date,setDate]=useState(null);
 const [allTrips,setAllTrips]=useState(false);
 const [expanded,setExpanded]=useState(()=>[...carriers.map(company=>`company:${company.id}`),...routes.map(route=>route.id)]);
 const [selected,setSelected]=useState(new URLSearchParams(location.search).get('ruta')||routes[0]?.id||'');
 const [editor,setEditor]=useState(null),[name,setName]=useState(''),[company,setCompany]=useState(''),[planned,setPlanned]=useState(null),[error,setError]=useState('');
 const [movement,setMovement]=useState(null),[programming,setProgramming]=useState(false),[history,setHistory]=useState(false),[totals,setTotals]=useState(false);
 const [changingProgramming,setChangingProgramming]=useState(false);
 const returnFocus=useRef(null);
 const filtered=routes.filter(route=>{
  const linked=orders.filter(order=>order.routeId===route.id);
  return (carrierFilter==='Todos'||route.carrierId===carrierFilter)&&(phaseFilter==='Todos'||(phaseFilter==='Programada'?route.phase==='Programada'&&route.state<2:routeStateLabel(route)===phaseFilter))&&(!date||(route.plannedDate===dateKey(date)||linked.some(order=>order.plannedDate===dateKey(date))))&&normalize(`${route.id} ${route.name} ${carrierName(route.carrierId)} ${linked.map(order=>order.farm).join(' ')}`).includes(normalize(query.trim()));
 });
 const found=locate(filtered,selected);const context=found.route?found:filtered.length?{route:filtered[0]}:{};
 const {route,group}=context;
 const trip=context.trip||route?.trips.find(trip=>trip.programmingStatus!=='Anulado')||route?.trips[0];
 const editable=route&&routeEditable(route);
 const structureEditable=editable&&trip?.programmingStatus!=='Anulado';

 const linked=route?orders.filter(order=>order.routeId===route.id):[];
 const tripGroups=route?(allTrips?route.trips:trip?[trip]:[]).filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups.map(group=>({...group,trip}))):[];
 const available=route?orders.filter(order=>order.status==='Preasignada'&&!order.routeId&&order.carrierId===route.carrierId):[];
 const stateTone=route?(route.phase==='En construcción'?'info':route.state===3?'active':route.state===0?'warning':'info'):'info';
 const nodes=carriers.filter(carrier=>filtered.some(route=>route.carrierId===carrier.id)).map(carrier=>({value:`company:${carrier.id}`,label:carrier.name,children:filtered.filter(route=>route.carrierId===carrier.id).map(route=>({value:route.id,label:`${route.id} · ${route.name}`,description:[...new Set(orders.filter(order=>order.routeId===route.id).map(order=>order.farm))].join(' · ')||'Sin órdenes agrupadas',children:route.trips.map(trip=>({value:trip.id,label:trip.programmingStatus==='Anulado'?`${trip.name} · Anulado`:trip.name,children:trip.groups.map(group=>({value:group.id,label:group.name,description:[...new Set(orders.filter(order=>order.subgroupId===group.id).map(order=>order.farm))].join(' · ')||'Sin órdenes'}))}))}))}));
 useEffect(()=>{if(route)setExpanded(current=>[...new Set([...current,`company:${route.carrierId}`,route.id,...(context.trip?[context.trip.id]:[])])]);},[route?.id,route?.carrierId,context.trip?.id]);
 function choose(key){const id=key.startsWith('company:')?filtered.find(route=>route.carrierId===key.slice(8))?.id:key;if(id)setSelected(id);setAllTrips(false);setTotals(false);}
 function beginEditor(kind,editing=false){
  returnFocus.current=document.activeElement;
  const editingRoute=kind==='route'&&editing?route:null;
  const editingLevel=kind==='trip'&&editing?trip:kind==='group'&&editing?(group||trip?.groups[0]):null;
  setEditor({kind,routeId:kind==='route'?editingRoute?.id:route.id,tripId:kind==='group'?trip.id:editingLevel?.id,groupId:kind==='group'?editingLevel?.id:undefined});
  setName(editingRoute?.name||editingLevel?.name||(kind==='trip'?`Viaje ${(route?.trips.length||0)+1}`:kind==='group'?`Subgrupo ${(trip?.groups.length||0)+1}`:''));
  setCompany(editingRoute?.carrierId||(carrierFilter!=='Todos'?carrierFilter:''));setPlanned(parseDate(editingRoute?.plannedDate));setError('');
 }
 function closeFloat(){setChangingProgramming(false);setEditor(null);setMovement(null);setProgramming(false);setHistory(false);setError('');requestAnimationFrame(()=>{if(returnFocus.current?.isConnected&&!returnFocus.current.disabled)returnFocus.current.focus();});}
 function save(event){
  event.preventDefault();
  try{
   const id=editor.kind==='route'?saveConmatRoute({id:editor.routeId,name,carrierId:company,plannedDate:dateKey(planned)}):saveConmatLevel({...editor,name});
   setSelected(id);setAllTrips(false);setQuery('');setPhaseFilter('Todos');setDate(null);if(editor.kind==='route')setCarrierFilter(company);closeFloat();toast.success({title:editor.kind==='route'?'Ruta guardada':editor.kind==='trip'?'Viaje guardado':'Subgrupo guardado',description:'El cambio se conservó en la demostración.'});
  }catch(reason){setError(reason.message);}
 }
 function requestMove(ids,fromGroupId,toGroupId){returnFocus.current=document.activeElement;setError('');setMovement({routeId:route.id,ids,fromGroupId,toGroupId});}
 function move(){try{moveConmatOrders(movement);closeFloat();toast.success({title:movement.toGroupId==='available'?'Órdenes retiradas de la ruta':'Agrupación actualizada',description:'Órdenes y totales actualizados en la propuesta.'});}catch(reason){setError(reason.message);}}
 const groupLabel=id=>id==='available'?'Órdenes disponibles':route.trips.flatMap(trip=>trip.groups.map(group=>({...group,trip}))).filter(group=>group.id===id).map(group=>`${group.trip.name} / ${group.name}`)[0]||id;
 const orderItem=order=>({id:order.id,label:order.id,description:order.farm,detail:<span className="conmat-route-order-lines">{order.programmingStatus==='Reprogramado'&&<span>Reprogramado · {showDate(order.plannedDate)}</span>}{order.items.map(line=><span key={line.name+line.unit}>{line.name} · {quantity(line.quantity)} {line.unit}</span>)}</span>,dragPreview:{label:order.id}});
 const groups=route?[{id:'available',label:'Órdenes disponibles',eyebrow:'Preasignadas sin agrupar',items:available.map(orderItem),emptyText:'No hay órdenes preasignadas sin agrupar para esta empresa.',moveHereLabel:count=>`Retirar ${count===1?'orden':`${count} órdenes`}`},...tripGroups.map(group=>({id:group.id,label:allTrips?`${group.trip.name} / ${group.name}`:group.name,items:orders.filter(order=>order.subgroupId===group.id).map(orderItem),emptyText:'Agrega órdenes preasignadas a este subgrupo.',moveHereLabel:count=>`Colocar ${count===1?'orden':`${count} órdenes`} aquí`}))]:[];
 const issues=route?routeProgrammingIssues(route,orders):[];
 const editorTitle=editor?(editor.kind==='route'?(editor.routeId?'Editar ruta':'Nueva ruta'):editor.kind==='trip'?(editor.tripId?'Editar viaje':'Nuevo viaje'):(editor.groupId?'Editar subgrupo':'Nuevo subgrupo')):'';
 const changingCarrier=editor?.kind==='route'&&editor.routeId&&company&&route?.carrierId!==company&&linked.length>0;
 return <div className="conmat-routes">
  <header className="conmat-routes-page-head"><div><p className="page-eyebrow">Transporte / CONMAT</p><h1 className="page-title">Agrupación de rutas</h1><p className="page-subtitle">Organiza las órdenes preasignadas en rutas, viajes y subgrupos.</p></div><div className="conmat-routes-nav"><Button variant="outlined" onClick={()=>location.assign('conmat-ordenes.html?estado=Preasignada')}>Órdenes preasignadas</Button><Button variant="ghost" onClick={()=>location.assign('conmat-panel.html')}>Volver al panel</Button></div></header>
  <Notice variant="info">Datos de demostración compartidos con órdenes y panel. Los cambios se conservan en este navegador.</Notice>
  <Card className="conmat-routes-shell"><Toolbar className="conmat-routes-topbar"><h2>Rutas y agrupaciones</h2><Button variant="filled" onClick={()=>beginEditor('route')}>Nueva ruta</Button></Toolbar>
   <FilterToolbar className="conmat-routes-filters" primaryCount={3} active={Boolean(query||carrierFilter!=='Todos'||phaseFilter!=='Todos'||date)} onClear={()=>{setQuery('');setCarrierFilter('Todos');setPhaseFilter('Todos');setDate(null);}}>
    <TextInput id="conmat-route-search" label="Buscar ruta o finca" placeholder="Identificador o nombre" value={query} onChange={setQuery}/>
    <SelectInput id="conmat-route-carrier" label="Transportadora" value={carrierFilter} options={[{value:'Todos',label:'Todas'},...carriers.filter(company=>company.enabled).map(company=>({value:company.id,label:company.name}))]} onChange={setCarrierFilter}/>
    <SelectInput id="conmat-route-phase" label="Estado de la ruta" value={phaseFilter} options={options(['Todos','En construcción','Programada','En ejecución','Finalizada'])} onChange={setPhaseFilter}/>
    <DateInput id="conmat-route-date" label="Fecha programada" value={date} onChange={setDate}/>
   </FilterToolbar>
   {filtered.length?<div className="conmat-route-layout"><aside className="conmat-route-list" aria-label="Estructura de rutas"><h3>Por transportadora</h3><TreeList nodes={nodes} variant="navigation" selectedValue={group?.id||context.trip?.id||route?.id} onSelect={choose} expandedValues={expanded} onExpandedChange={setExpanded}/></aside>
    <section className="conmat-route-workspace" aria-label="Organizar la ruta">
     <div className="conmat-route-mobile-selector"><SelectInput id="conmat-route-mobile" label="Ruta" value={route.id} options={filtered.map(route=>({value:route.id,label:`${route.id} · ${route.name}`}))} onChange={choose}/></div>
     <header className="conmat-route-context"><div><p className="conmat-route-company">{carrierName(route.carrierId)}</p><h2>{route.id} · {route.name}</h2><p className="conmat-route-meta">{[...new Set(linked.map(order=>order.farm))].join(' · ')||'Sin fincas agrupadas'}</p></div><div className="conmat-route-context-actions"><Chip preset={stateTone}>{routeStateLabel(route)}</Chip><IconButton variant="ghost" aria-label="Editar ruta" title="Editar ruta" disabled={!editable} onClick={()=>beginEditor('route',true)}><EditIcon size={18}/></IconButton></div></header>
     <div className="conmat-route-info-line"><span>{showDate(route.plannedDate)}</span><span>{route.trips.filter(trip=>trip.programmingStatus!=='Anulado').length} {route.trips.filter(trip=>trip.programmingStatus!=='Anulado').length===1?'viaje':'viajes'} · {linked.length} {linked.length===1?'orden':'órdenes'}</span></div>
     <Toolbar className="conmat-route-tools"><div><Button variant="ghost" onClick={()=>setTotals(value=>!value)} aria-expanded={totals} aria-controls="conmat-route-materials">Materiales</Button><Button variant="ghost" onClick={()=>location.assign(`conmat-historial.html?interno=1&ruta=${route.id}`)}>Historial</Button></div><Button variant="outlined" disabled={!editable} onClick={()=>{returnFocus.current=document.activeElement;setChangingProgramming(true);}}>Cambiar programación</Button></Toolbar>
     <div id="conmat-route-materials" hidden={!totals}><Table data={materialTotals(linked)} columns={materialsColumns} minWidth="360px" emptyState="La ruta todavía no tiene materiales agrupados."/></div>
     {!editable&&<Notice variant="info">Esta ruta está {route.state===2?'en ejecución':'finalizada'}. Su composición es de sólo consulta.</Notice>}
     <div className="conmat-route-trip-editor">
      <Toolbar className="conmat-route-trip-toolbar"><div className="conmat-route-trip-picker">{route.trips.length>0&&<><SelectInput id="conmat-trip" label="Viaje" value={trip?.id||''} options={route.trips.map(trip=>({value:trip.id,label:trip.programmingStatus==='Anulado'?`${trip.name} · Anulado`:trip.name}))} onChange={choose}/><IconButton variant="ghost" title="Editar viaje" aria-label="Editar viaje" disabled={!structureEditable} onClick={()=>beginEditor('trip',true)}><EditIcon size={17}/></IconButton></>}</div><div className="conmat-route-trip-actions"><Button variant="ghost" disabled={!editable} onClick={()=>beginEditor('trip')}>Nuevo viaje</Button>{route.trips.filter(trip=>trip.programmingStatus!=='Anulado').length>1&&<Button variant="ghost" onClick={()=>setAllTrips(value=>!value)}>{allTrips?'Volver al viaje':'Mover entre viajes'}</Button>}</div></Toolbar>
      {allTrips&&<Notice variant="info">Estás reorganizando órdenes entre todos los viajes de la ruta.</Notice>}
      {trip?.programmingStatus==='Anulado'&&!allTrips?<Notice variant="warning">Este viaje fue anulado. Sus órdenes quedaron disponibles para nueva programación; la estructura se conserva para consulta.</Notice>:<>
       {trip&&<Toolbar className="conmat-route-subgroup-toolbar"><h3>{allTrips?'Subgrupos de la ruta':'Subgrupos del viaje'}</h3><div><Button variant="ghost" disabled={!structureEditable||!trip.groups.length} onClick={()=>beginEditor('group',true)}>Editar subgrupo</Button><Button variant="outlined" disabled={!structureEditable} onClick={()=>beginEditor('group')}>Nuevo subgrupo</Button></div></Toolbar>}
       {!route.trips.length?<div className="conmat-route-empty"><h3>Crea el primer viaje</h3><p>Después podrás agregar sus subgrupos e incorporar órdenes preasignadas.</p></div>:tripGroups.length?<GroupMove key={`${route.id}:${allTrips?'all':trip?.id}`} label="Agrupar órdenes preasignadas" groups={groups} disabled={!editable} canMove={event=>canMoveConmatOrders({routeId:route.id,ids:[event.itemId],fromGroupId:event.fromGroupId,toGroupId:event.toGroupId})} onMove={event=>requestMove([event.itemId],event.fromGroupId,event.toGroupId)} onMoveMany={event=>requestMove(event.itemIds,event.fromGroupId,event.toGroupId)}/>:<div className="conmat-route-empty"><h3>Este viaje aún no tiene subgrupos</h3><p>Agrega un subgrupo para incorporar las órdenes.</p></div>}
      </>}
     </div>
     {route.phase==='En construcción'&&<Toolbar className="conmat-route-confirm"><p>Confirma cuando hayas terminado de organizar todos los viajes.</p><Button variant="filled" onClick={()=>{returnFocus.current=document.activeElement;setError('');setProgramming(true);}}>Confirmar programación</Button></Toolbar>}
    </section>
   </div>:<div className="conmat-route-empty"><h3>No hay rutas para estos filtros</h3><p>Limpia los filtros o crea una nueva ruta.</p></div>}
  </Card>
  {changingProgramming&&<ConmatProgrammingChange route={route} orders={orders} onClose={closeFloat} onSuccess={result=>{closeFloat();toast.success({title:'Programación actualizada',description:`${result.count} ${result.count===1?'orden afectada':'órdenes afectadas'}. Consulta el historial para ver el cambio.`});}}/>}
  {editor&&<ConmatFloatingView title={editorTitle} subtitle={editor.kind==='route'?'Identificación y programación de la ruta':`${route.id} · ${route.name}`} onClose={closeFloat}>
   <form className="conmat-route-form" onSubmit={save}>{editor.kind==='group'&&editor.groupId&&<SelectInput id="conmat-edit-group" label="Subgrupo" value={editor.groupId} options={trip.groups.map(group=>({value:group.id,label:group.name}))} onChange={id=>{setEditor(current=>({...current,groupId:id}));setName(trip.groups.find(group=>group.id===id).name);setError('');}}/>}<TextInput id="conmat-route-name" label={editor.kind==='route'?'Nombre de la ruta':editor.kind==='trip'?'Nombre del viaje':'Nombre del subgrupo'} required value={name} onChange={value=>{setName(value);setError('');}}/>
    {editor.kind==='route'&&<><SelectInput id="conmat-editor-carrier" label="Empresa transportadora" placeholder="Seleccionar transportadora" value={company} required options={carriers.filter(company=>company.enabled).map(company=>({value:company.id,label:company.name}))} onChange={value=>{setCompany(value);setError('');}}/><DateInput id="conmat-editor-date" label="Fecha programada" value={planned} onChange={setPlanned}/></>}
    {changingCarrier&&<Notice variant="warning">La nueva transportadora se aplicará también a las {linked.length} órdenes de esta ruta.</Notice>}
    {error&&<Notice variant="error">{error}</Notice>}
    <footer className="conmat-route-form-actions"><Button type="button" variant="outlined" onClick={closeFloat}>Cancelar</Button><Button type="submit" variant="filled">{editor.kind==='route'?'Guardar ruta':editor.kind==='trip'?'Guardar viaje':'Guardar subgrupo'}</Button></footer>
   </form></ConmatFloatingView>}
  {movement&&<ConmatFloatingView title={movement.toGroupId==='available'?'Retirar órdenes de la ruta':'Confirmar agrupación'} subtitle={`${movement.ids.length} ${movement.ids.length===1?'orden seleccionada':'órdenes seleccionadas'}`} onClose={closeFloat}><div className="conmat-route-form"><KeyValueGrid columns={2} items={[{label:'Origen',value:groupLabel(movement.fromGroupId)},{label:'Destino',value:groupLabel(movement.toGroupId)}]}/><p>Se conservarán las órdenes, sus materiales y cantidades. {movement.toGroupId==='available'?'Quedarán preasignadas y disponibles para una nueva agrupación.':'Se actualizarán las fincas y los totales del subgrupo.'}</p>{error&&<Notice variant="error">{error}</Notice>}<footer className="conmat-route-form-actions"><Button variant="outlined" onClick={closeFloat}>Cancelar</Button><Button variant="filled" onClick={move}>Confirmar movimiento</Button></footer></div></ConmatFloatingView>}
  {programming&&<ConmatFloatingView title="Confirmar programación" subtitle={`${route.id} · ${route.name}`} onClose={closeFloat}><div className="conmat-route-form"><KeyValueGrid columns={2} items={[{label:'Transportadora',value:carrierName(route.carrierId)},{label:'Fecha programada',value:showDate(route.plannedDate)}]}/>{issues.length?<Notice variant="warning" heading="Completa la agrupación">{issues.map(issue=><p key={issue}>{issue}</p>)}</Notice>:<p>Las {linked.length} órdenes pasarán a programadas y la ruta aparecerá en el panel operativo. La transportadora realizará después la asignación de vehículo y conductor.</p>}{error&&<Notice variant="error">{error}</Notice>}<footer className="conmat-route-form-actions"><Button variant="outlined" onClick={closeFloat}>Volver</Button><Button variant="filled" disabled={issues.length>0} onClick={()=>{try{confirmConmatRoute(route.id);closeFloat();toast.success({title:'Programación confirmada',description:'La ruta y sus órdenes se actualizaron en la propuesta.'});}catch(reason){setError(reason.message);}}}>Confirmar programación</Button></footer></div></ConmatFloatingView>}
  {history&&<ConmatFloatingView title="Historial de cambios" subtitle={`${route.id} · ${route.name}`} onClose={closeFloat}><div className="conmat-route-form">{route.events.length?<DrawerAuditList items={[...route.events].reverse().map(event=>({title:<><strong>{event.operation}</strong>{event.programmingStatus&&<Chip preset={event.programmingStatus==='Reprogramado'?'info':'warning'}>{event.programmingStatus}</Chip>}<p>{event.before} → {event.after}</p>{event.reason&&<p>Motivo: {event.reason}</p>}{event.communication&&<p>{event.communication}</p>}</>,meta:`${event.actor} · ${eventDate(event.at)}`}))}/>:<Notice variant="info">Esta ruta de ejemplo aún no tiene cambios registrados.</Notice>}</div></ConmatFloatingView>}
 </div>;
}
