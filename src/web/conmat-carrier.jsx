import React,{useEffect,useRef,useState} from 'react';
import {Button,Card,Chip,DateInput,EditIcon,FilterToolbar,IconButton,Notice,Pagination,SelectInput,Table,TableRowActions,TextInput,ToastProvider,Toolbar,ViewIcon} from 'banasan-ui-conmat';
import {ConmatFloatingView} from './conmat-floating-view.jsx';
import {carriers,materialTotals,useConmatOrders,useConmatRoutes} from './conmat-demo-store.js';
import {carrierName,carrierWorkspace,portalState,portalMaterials} from './conmat-carrier-model.js';
import '../../vendor/conmat-ui-20261123/filter-toolbar.scoped.css';
import './conmat-carrier.css';
import {operationalAssignmentRows} from './conmat-assignment-model.js';
import {EmbeddedConmatAssignment} from './conmat-assignment.jsx';
import {ConmatCarrierNotifications} from './conmat-carrier-notifications.jsx';

const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const dateLabel=value=>value?new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'Sin fecha';
const dateKey=value=>value?`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`:'';

const tone=state=>state==='Finalizada'?'active':state==='Pendiente de asignación'||state==='Con novedades'?'warning':state==='Sin programación activa'?'inactive':'info';
const materialColumns=[{key:'name',header:'Material / insumo',render:item=>item.name},{key:'qty',header:'Cantidad',align:'right',render:item=>item.quantity},{key:'unit',header:'Unidad',render:item=>item.unit}];

export function ConmatCarrier(){return <ToastProvider placement="bottom-right"><CarrierPage/></ToastProvider>;}
function CarrierPage(){
 const orders=useConmatOrders(),routes=useConmatRoutes();
 const params=new URLSearchParams(location.search),companyId=params.get('empresa')||'caribe';
 const company=carriers.find(company=>company.id===companyId&&company.enabled);
 const own=carrierWorkspace(routes,orders,companyId);
 const [assignmentRouteId,setAssignmentRoute]=useState(()=>params.get('asignar')==='1'?own.routes.find(route=>route.state<2)?.id||'':params.get('asignar')||'');
 const assignmentTrigger=useRef(null);
 useEffect(()=>{if(assignmentRouteId){const panel=document.getElementById('conmat-assignment-panel');panel?.scrollIntoView({block:'start',behavior:'auto'});document.getElementById('conmat-assign-route')?.focus({preventScroll:true});}},[assignmentRouteId]);
 function openAssignment(id){assignmentTrigger.current=document.activeElement;setDetail(null);setAssignmentRoute(id);}
 function closeAssignment(){setAssignmentRoute('');requestAnimationFrame(()=>{const target=assignmentTrigger.current;(target?.isConnected?target:document.getElementById('conmat-carrier-search'))?.focus();});}

 const [mode,setMode]=useState('routes'),[query,setQuery]=useState(''),[status,setStatus]=useState('Todos'),[date,setDate]=useState(null),[page,setPage]=useState(1),[size,setSize]=useState(5);
 const [detail,setDetail]=useState(()=>params.get('ruta')?{kind:'route',id:params.get('ruta')}:params.get('orden')?{kind:'order',id:params.get('orden')}:null);
 const [loading,setLoading]=useState(params.get('escenario')==='cargando'),[failed,setFailed]=useState(params.get('escenario')==='error');
 useEffect(()=>{if(loading){const timer=setTimeout(()=>setLoading(false),650);return()=>clearTimeout(timer);}},[loading]);
 const route=detail?.kind==='route'?own.routes.find(route=>route.id===detail.id):null;
 const order=detail?.kind==='order'?own.orders.find(order=>order.id===detail.id):null;
 const filtered=mode==='routes'?own.routes.filter(route=>{
  const linked=own.orders.filter(order=>order.routeId===route.id);
  return (status==='Todos'||(status==='Con novedades'?route.state===2&&route.note.startsWith('Novedad'):portalState(route,own.orders)===status))&&(!date||linked.some(order=>(order.plannedDate||route.plannedDate)===dateKey(date)))&&normalize(`${route.id} ${route.name} ${linked.map(order=>order.farm).join(' ')}`).includes(normalize(query));
 }):own.orders.filter(order=>!order.routeId&&normalize(`${order.id} ${order.farm} ${order.items.map(item=>item.name).join(' ')}`).includes(normalize(query)));
 const current=Math.min(page,Math.max(1,Math.ceil(filtered.length/size)));
 function filter(set){return value=>{set(value);setPage(1);};}
 function changeMode(value){setMode(value);setStatus('Todos');setDate(null);setQuery('');setPage(1);}
 const routeColumns=[{key:'route',header:'Ruta / fincas',render:route=><div className="conmat-carrier-cell"><strong>{route.id} · {route.name}</strong><small>{[...new Set(own.orders.filter(order=>order.routeId===route.id).map(order=>order.farm))].join(' · ')||'Sin órdenes vigentes'}</small></div>},{key:'date',header:'Fecha programada',render:route=><div className="conmat-carrier-cell">{dateLabel(route.plannedDate)}{own.orders.some(order=>order.routeId===route.id&&order.plannedDate&&order.plannedDate!==route.plannedDate)&&<small>Con fechas por orden</small>}</div>},{key:'orders',header:'Órdenes',align:'center',render:route=>own.orders.filter(order=>order.routeId===route.id).length},{key:'status',header:'Estado',render:route=><div className="conmat-carrier-cell"><span className="conmat-carrier-state"><Chip preset={tone(portalState(route,own.orders))}>{portalState(route,own.orders)}</Chip></span>{route.state===2&&route.note.startsWith('Novedad')&&<small>{route.note}</small>}</div>}];
 const orderColumns=[{key:'order',header:'Orden',render:order=><strong>{order.id}</strong>},{key:'farm',header:'Finca',render:order=>order.farm},{key:'items',header:'Materiales / cantidades',render:order=><div className="conmat-carrier-cell">{order.items.map(item=><span key={item.name+item.unit}>{item.name} · {item.quantity} {item.unit}</span>)}</div>},{key:'status',header:'Programación',render:()=> <Chip preset="info">Preasignada sin ruta</Chip>}];
 return <div className="conmat-carrier">
   {!company?<Notice variant="error" heading="Empresa no disponible">No se pudo identificar una empresa transportadora habilitada para este acceso.</Notice>:<>
    <p className="page-eyebrow">Transporte / CONMAT</p>
    <div className="page-header"><div><h1 className="page-title">Portal de transportadora</h1><p className="page-subtitle">Consulta las rutas, órdenes y cambios de programación asignados a tu empresa.</p></div><Button variant="outlined" onClick={()=>location.assign(`conmat-seguimiento.html?empresa=${companyId}`)}>Seguimiento operativo</Button></div>
    <Card className="conmat-carrier-register"><Toolbar className="card-header conmat-carrier-card-head"><div><h2 className="card-title">Servicios asignados</h2><p className="card-subtitle">{company.name}</p></div><Button variant="filled" disabled={mode!=='routes'||loading||failed||!filtered.some(route=>route.state<2&&own.orders.some(order=>order.routeId===route.id))} onClick={()=>openAssignment(filtered.find(route=>route.state<2&&own.orders.some(order=>order.routeId===route.id)).id)}>Asignación operativa</Button></Toolbar>
     <FilterToolbar className="conmat-carrier-filters" primaryCount={3} active={Boolean(query||status!=='Todos'||date)} onClear={()=>{setQuery('');setStatus('Todos');setDate(null);setPage(1);}}>
      <TextInput id="conmat-carrier-search" label={mode==='routes'?'Buscar ruta o finca':'Buscar orden, finca o material'} placeholder="Identificador o nombre" value={query} onChange={filter(setQuery)}/>
      <SelectInput id="conmat-carrier-query" label="Consulta" value={mode} options={[{value:'routes',label:'Rutas asignadas'},{value:'orders',label:'Órdenes sin ruta'}]} onChange={changeMode}/>
      {mode==='routes'&&<SelectInput id="conmat-carrier-state" label="Estado" value={status} options={['Todos','Pendiente de asignación','Programada','En ejecución','Con novedades','Finalizada','Sin programación activa'].map(value=>({value,label:value}))} onChange={filter(setStatus)}/>}
      {mode==='routes'&&<DateInput id="conmat-carrier-date" label="Fecha programada" value={date} onChange={filter(setDate)}/>}
     </FilterToolbar>
     {assignmentRouteId&&<EmbeddedConmatAssignment key={assignmentRouteId} companyId={companyId} initialRouteId={assignmentRouteId} onClose={closeAssignment} onSaved={complete=>{if(complete)closeAssignment();}}/>}
     {failed?<div className="conmat-carrier-message"><Notice variant="error" heading="No se pudieron consultar los servicios">Intenta cargar la información nuevamente.</Notice><Button variant="outlined" onClick={()=>{setFailed(false);setLoading(true);}}>Reintentar</Button></div>:<><Table columns={mode==='routes'?routeColumns:orderColumns} data={loading?[]:filtered.slice((current-1)*size,current*size)} loading={loading} rowKey={item=>item.id} minWidth="740px" emptyState={<div className="conmat-carrier-empty"><strong>{query||status!=='Todos'||date?'No hay resultados para estos filtros':mode==='routes'?'Todavía no tienes rutas asignadas':'No hay órdenes preasignadas sin ruta'}</strong><p>{mode==='routes'?'Las rutas aparecerán cuando Banasan confirme su programación.':'Las órdenes agrupadas se consultan desde su ruta.'}</p></div>} actions={item=><TableRowActions label={`Acciones de ${item.id}`}><IconButton variant="ghost" title="Consultar detalle" aria-label={`Consultar ${item.id}`} onClick={()=>setDetail({kind:mode==='routes'?'route':'order',id:item.id})}><ViewIcon size={18}/></IconButton>{mode==='routes'&&item.state<2&&own.orders.some(order=>order.routeId===item.id)&&<IconButton variant="ghost" aria-label={`Asignar ${item.id}`} title="Asignar vehículo y conductor" onClick={()=>openAssignment(item.id)}><EditIcon size={18}/></IconButton>}</TableRowActions>}/><Pagination page={current} pageSize={size} total={loading?0:filtered.length} pageSizeOptions={[1,5,10]} onPageChange={setPage} onPageSizeChange={value=>{setSize(value);setPage(1);}}/></>}
    </Card>
    {detail&&<ConmatFloatingView title={route?`${route.id} · ${route.name}`:order?order.id:'Servicio no disponible'} subtitle={company.name} onClose={()=>setDetail(null)}><div className="conmat-carrier-detail">
     {route?<><div className="conmat-carrier-detail-context"><Chip preset={tone(portalState(route,own.orders))}>{portalState(route,own.orders)}</Chip><p>Fecha de ruta: <strong>{dateLabel(route.plannedDate)}</strong></p><p>{route.note}</p></div><h3>Asignación operativa</h3><Table minWidth="410px" data={operationalAssignmentRows(route,own.orders)} columns={[{key:'scope',header:'Alcance',render:item=>item.scopeLabel},{key:'plate',header:'Placa',render:item=>item.plate},{key:'driver',header:'Conductor',render:item=>item.driver},{key:'window',header:'Horario',render:item=><span>{item.start}–{item.end}{!item.valid?' · Revisar programación':''}</span>}]} emptyState="Pendiente de vehículo y conductor."/>{route.state<2&&own.orders.some(order=>order.routeId===route.id)&&<Button variant="outlined" onClick={()=>openAssignment(route.id)}>Gestionar asignación</Button>}<Button variant="ghost" onClick={()=>location.assign(`conmat-seguimiento.html?empresa=${companyId}&ruta=${route.id}`)}>Ver seguimiento</Button><h3>Viajes, subgrupos y órdenes</h3>{route.trips.map(trip=><section className="conmat-carrier-trip" key={trip.id}><h4>{trip.name}{trip.programmingStatus==='Anulado'?' · Anulado':''}</h4>{trip.groups.map(group=>{const linked=own.orders.filter(order=>order.subgroupId===group.id);return <div key={group.id}><h5>{group.name}</h5>{linked.length?<Table minWidth="390px" data={linked} columns={[{key:'id',header:'Orden / finca',render:order=><div className="conmat-carrier-cell"><strong>{order.id}</strong><small>{order.farm}</small></div>},{key:'items',header:'Materiales / cantidades',render:order=><div className="conmat-carrier-cell">{order.items.map(item=><span key={item.name+item.unit}>{item.name} · {item.quantity} {item.unit}</span>)}</div>},{key:'date',header:'Fecha',render:order=>dateLabel(order.plannedDate||route.plannedDate)}]}/>:<p>Sin órdenes vigentes en este subgrupo.</p>}</div>;})}</section>)}<h3>Materiales de la ruta</h3><Table minWidth="320px" columns={materialColumns} data={portalMaterials(route,own.orders)} emptyState="Sin materiales agrupados."/></>:order?<><p><strong>{order.farm}</strong> · Orden preasignada</p><Notice variant="info">Banasan aún no ha vinculado esta orden a una ruta.</Notice><Table minWidth="320px" columns={materialColumns} data={materialTotals([order])}/></>:<Notice variant="warning">El servicio no pertenece a tu empresa o su programación ya no está disponible.</Notice>}
    </div></ConmatFloatingView>}
    <ConmatCarrierNotifications companyId={companyId} onOpenRecord={item=>setDetail({kind:item.kind,id:item.target})}/>
   </>}
 </div>;
}
