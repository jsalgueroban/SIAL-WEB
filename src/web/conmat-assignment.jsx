import React,{useEffect,useState} from 'react';
import {Button,Chip,DateInput,DrawerAuditList,EditIcon,IconButton,KeyValueGrid,Notice,SearchSelectInput,SelectInput,Table,TableRowActions,TextInput,Toolbar,useToast} from 'banasan-ui-conmat';
import {carriers,previewConmatAssignment,saveConmatAssignment,useConmatOrders,useConmatRoutes} from './conmat-demo-store.js';
import {assignmentCoverage,assignmentApplies,assignmentDrivers,assignmentOrders,assignmentVehicles,routeAssignments} from './conmat-assignment-model.js';
import {carrierWorkspace} from './conmat-carrier-model.js';
import {ConmatFloatingView} from './conmat-floating-view.jsx';
import './conmat-carrier.css';
import './conmat-assignment.css';

const dateLabel=value=>value?new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'Sin fecha';
const timeLabel=value=>new Intl.DateTimeFormat('es-CO',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit',timeZone:'America/Bogota'}).format(new Date(value));
const vehicleName=id=>assignmentVehicles.find(vehicle=>vehicle.id===id)?.plate||'Sin vehículo';
const driverName=id=>assignmentDrivers.find(driver=>driver.id===id)?.name||'Sin conductor';
export function ConmatAssignment(){
 useEffect(()=>{const params=new URLSearchParams(location.search);location.replace(`conmat-transportadora.html?empresa=${encodeURIComponent(params.get('empresa')||'caribe')}&asignar=${encodeURIComponent(params.get('ruta')||'1')}`);},[]);
 return <p>Abriendo asignación operativa…</p>;
}
export function EmbeddedConmatAssignment(props){return <AssignmentPanel {...props}/>;}
function AssignmentPanel({companyId,initialRouteId,onClose,onSaved}){
 const orders=useConmatOrders(),routes=useConmatRoutes(),toast=useToast();
 const company=carriers.find(company=>company.id===companyId&&company.enabled);
 const own=carrierWorkspace(routes,orders,companyId);
 const [routeId,setRouteId]=useState(initialRouteId||own.routes[0]?.id||'');
 const route=own.routes.find(route=>route.id===routeId);
 const [scope,setScope]=useState(()=>route&&routeAssignments(route)[0]?.scope||'route');
 const [groupId,setGroupId]=useState(''),[history,setHistory]=useState(false);
 const groups=route?route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups.map(group=>({...group,tripName:trip.name}))).filter(group=>own.orders.some(order=>order.subgroupId===group.id)):[];
 const targetId=scope==='route'?routeId:groups.some(group=>group.id===groupId)?groupId:groups[0]?.id||'';
 const existing=route?routeAssignments(route).find(assignment=>assignment.scope===scope&&assignment.targetId===targetId):null;
 const editable=route&&route.state<2;
 const scopeLabel=scope==='route'?'Ruta completa':groups.find(group=>group.id===targetId)?.name||'Subgrupo';
 function chooseRoute(id){setRouteId(id);setScope(routeAssignments(own.routes.find(route=>route.id===id))[0]?.scope||'route');setGroupId('');}
 const assignmentColumns=[{key:'scope',header:'Alcance',render:assignment=>assignment.scope==='route'?'Ruta completa':groups.find(group=>group.id===assignment.targetId)?.name||'Subgrupo sin órdenes'},{key:'vehicle',header:'Placa',render:assignment=><strong>{vehicleName(assignment.vehicleId)}</strong>},{key:'driver',header:'Conductor',render:assignment=>driverName(assignment.driverId)},{key:'window',header:'Programación',render:assignment=><div className="conmat-carrier-cell"><span>{dateLabel(assignment.date)}</span><small>{assignment.start}–{assignment.end}</small></div>},{key:'state',header:'Estado',render:assignment=><Chip preset={assignmentApplies(route,assignment,own.orders)?'active':'warning'}>{assignmentApplies(route,assignment,own.orders)?'Vigente':'Revisar programación'}</Chip>}];
 const events=route?route.events.filter(event=>event.operation.toLowerCase().includes('asignación operativa')):[];
 const initialHistory=route&&!Array.isArray(route.assignments)?routeAssignments(route).map(assignment=>({operation:'Asignación registrada',before:'Sin asignación',after:`${vehicleName(assignment.vehicleId)} · ${driverName(assignment.driverId)} · ${assignment.date} ${assignment.start}–${assignment.end}`,actor:assignment.actor,at:assignment.at})):[];
 return <section className="inline-form-panel inline-form-compact conmat-assignment conmat-assignment-embedded" id="conmat-assignment-panel" aria-label="Asignación operativa" tabIndex={-1}>
  <Toolbar className="form-heading conmat-assignment-head"><div><h2>Asignar vehículo y conductor</h2><p className="card-subtitle">{route?`${route.id} · ${route.name}`:company?.name||'Servicio no disponible'}</p></div><Button variant="ghost" onClick={onClose}>Cerrar asignación</Button></Toolbar>
  {!company||!route?<Notice variant="warning">La ruta no pertenece a tu empresa o todavía no tiene programación confirmada.</Notice>:<>
   <div className="form-body conmat-assignment-body">
    <section className="conmat-assignment-context"><SelectInput id="conmat-assign-route" label="Ruta" value={routeId} options={own.routes.map(route=>({value:route.id,label:`${route.id} · ${route.name}`}))} onChange={chooseRoute}/><SelectInput id="conmat-assign-scope" label="Aplicar asignación a" value={scope} disabled={!editable} options={[{value:'route',label:'Ruta completa',disabled:routeAssignments(route).some(assignment=>assignment.scope==='group')},{value:'group',label:'Un subgrupo',disabled:routeAssignments(route).some(assignment=>assignment.scope==='route')}]} onChange={value=>{setScope(value);setGroupId('');}}/>{scope==='group'&&<SelectInput id="conmat-assign-group" label="Subgrupo" value={targetId} options={groups.map(group=>({value:group.id,label:`${group.tripName} / ${group.name}`}))} onChange={setGroupId}/>}<p className="conmat-assignment-farms">{[...new Set(assignmentOrders(route,own.orders,scope,targetId).map(order=>order.farm))].join(' · ')||'Sin órdenes en este alcance'}</p></section>
    {editable?<AssignmentForm key={`${route.id}:${scope}:${targetId}:${existing?.at||'new'}`} route={route} orders={own.orders} companyId={companyId} scope={scope} targetId={targetId} scopeLabel={scopeLabel} existing={existing} onCancel={onClose} onSaved={assignment=>{toast.success({title:'Asignación confirmada',description:'El vehículo y el conductor ya están disponibles en la consulta del servicio.'});const updated={...route,assignments:[...routeAssignments(route).filter(item=>item.targetId!==assignment.targetId),assignment]};onSaved(assignmentCoverage(updated,own.orders).complete);}}/>:<Notice variant="info">El servicio está {route.state===2?'en ejecución':'finalizado'}. La asignación sólo permite consulta.</Notice>}
   </div>
   {(routeAssignments(route).length>0||events.length>0)&&<><Toolbar className="conmat-assignment-results-head"><h3>Asignaciones de la ruta</h3><Button variant="ghost" onClick={()=>setHistory(true)}>Historial de asignación</Button></Toolbar>
   <Table data={routeAssignments(route)} columns={assignmentColumns} minWidth="710px" rowKey={assignment=>assignment.targetId} emptyState="La ruta aún no tiene vehículo ni conductor asignados." actions={assignment=>editable?<TableRowActions label={`Acciones de ${assignment.targetId}`}><IconButton variant="ghost" aria-label={`Editar asignación ${assignment.scope==='route'?'de ruta':groups.find(group=>group.id===assignment.targetId)?.name||'de subgrupo'}`} title="Editar asignación" onClick={()=>{setScope(assignment.scope);setGroupId(assignment.targetId);document.getElementById('conmat-assign-vehicle')?.focus();}}><EditIcon size={18}/></IconButton></TableRowActions>:null}/>
   </>}
   {history&&<ConmatFloatingView title="Historial de asignación" subtitle={`${route.id} · ${route.name}`} onClose={()=>setHistory(false)}><div className="conmat-carrier-detail">{events.length||initialHistory.length?<DrawerAuditList items={[...initialHistory,...events].reverse().map(event=>({title:<><strong>{event.operation}</strong><p>{event.before} → {event.after}</p>{event.reason&&<p>Motivo: {event.reason}</p>}</>,meta:`${event.actor} · ${timeLabel(event.at)}`}))}/>:<p>No se han registrado asignaciones para esta ruta.</p>}</div></ConmatFloatingView>}
  </>}
 </section>;
}
function AssignmentForm({route,orders,companyId,scope,targetId,scopeLabel,existing,onSaved,onCancel}){
 const [vehicleId,setVehicle]=useState(existing?.vehicleId||''),[driverId,setDriver]=useState(existing?.driverId||''),[start,setStart]=useState(existing?.start||'08:00'),[end,setEnd]=useState(existing?.end||'12:00'),[reason,setReason]=useState(''),[error,setError]=useState(null),[review,setReview]=useState(null);
 const dates=[...new Set(assignmentOrders(route,orders,scope,targetId).map(order=>order.plannedDate||route.plannedDate))],date=dates.length===1?dates[0]:'';
 const command={companyId,routeId:route.id,scope,targetId,vehicleId,driverId,date,start,end,reason};
 const validation=field=>({status:error?.field===field,message:error?.field===field?error.message:undefined});
 function change(set){return value=>{set(value);setError(null);};}
 function showError(failure){setError(failure);const field={vehicle:'vehicle',driver:'driver',start:'start',end:'end',reason:'reason',date:'date',scope:'scope'}[failure.field];if(field)requestAnimationFrame(()=>document.getElementById(`conmat-assign-${field}`)?.focus());}
 function preview(event){event.preventDefault();try{setReview({...previewConmatAssignment(command),command});setError(null);}catch(failure){showError(failure);}}
 function confirm(){try{const assignment=saveConmatAssignment({...review.command,expectedIds:review.orders.map(order=>order.id)});setReview(null);onSaved(assignment);}catch(failure){setReview(null);showError(failure);}}
 return <form onSubmit={preview} className="conmat-assignment-form">
  <section><h3>{existing?'Actualizar vehículo y conductor':'Vehículo y conductor'}</h3><div className="conmat-assignment-fields">
   <SearchSelectInput id="conmat-assign-vehicle" label="Placa del vehículo" placeholder="Seleccionar vehículo" searchPlaceholder="Buscar placa" required value={vehicleId} options={assignmentVehicles.filter(vehicle=>vehicle.carrierId===companyId).map(vehicle=>({value:vehicle.id,label:vehicle.plate,description:vehicle.description,disabled:!vehicle.enabled}))} onChange={change(setVehicle)} validate={validation('vehicle')}/>
   <SearchSelectInput id="conmat-assign-driver" label="Conductor" placeholder="Seleccionar conductor" searchPlaceholder="Buscar conductor" required value={driverId} options={assignmentDrivers.filter(driver=>driver.carrierId===companyId).map(driver=>({value:driver.id,label:driver.name,description:driver.description,disabled:!driver.enabled}))} onChange={change(setDriver)} validate={validation('driver')}/>
  </div></section>
  <section><h3>Horario del servicio</h3><div className="conmat-assignment-schedule"><DateInput id="conmat-assign-date" label="Fecha programada" value={date?new Date(`${date}T12:00:00`):null} readonly helperText="Definida en la programación del servicio." validate={validation('date')}/><TextInput id="conmat-assign-start" label="Hora de salida" helperText="Formato de 24 horas: HH:mm." value={start} required onChange={change(setStart)} validate={validation('start')}/><TextInput id="conmat-assign-end" label="Fin estimado" helperText="Posterior a la salida, en el mismo día." value={end} required onChange={change(setEnd)} validate={validation('end')}/></div></section>
  {existing&&<TextInput id="conmat-assign-reason" label="Motivo del cambio" placeholder="Describe por qué se modifica la asignación" required value={reason} onChange={change(setReason)} validate={validation('reason')}/>}
  {error&&!['vehicle','driver','start','end','reason','date'].includes(error.field)&&<Notice variant="error">{error.message}</Notice>}
  <footer className="form-actions conmat-assignment-actions"><Button type="button" variant="outlined" onClick={onCancel}>Cancelar</Button><Button type="submit" variant="filled">{existing?'Revisar cambio':'Revisar asignación'}</Button></footer>
  {review&&<ConmatFloatingView title={existing?'Revisar cambio de asignación':'Revisar asignación'} subtitle={`${route.id} · ${scopeLabel}`} onClose={()=>setReview(null)}><div className="conmat-carrier-detail"><KeyValueGrid columns={2} items={[{label:'Alcance',value:scopeLabel},{label:'Órdenes',value:review.orders.length},{label:'Placa',value:review.vehicle.plate},{label:'Conductor',value:review.driver.name},{label:'Fecha',value:dateLabel(date)},{label:'Horario',value:`${start}–${end}`},...(existing?[{label:'Motivo',value:reason.trim()}]:[])]}/><p>La asignación quedará disponible para consulta de la transportadora y de Banasan.</p><footer className="form-actions conmat-assignment-actions"><Button variant="outlined" onClick={()=>setReview(null)}>Volver</Button><Button variant="filled" onClick={confirm}>Confirmar asignación</Button></footer></div></ConmatFloatingView>}
 </form>;
}
