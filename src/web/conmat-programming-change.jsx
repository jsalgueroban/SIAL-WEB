import React,{useState} from 'react';
import {Button,CheckboxInput,Chip,DateInput,KeyValueGrid,Notice,SelectInput,Table,TextInput} from 'banasan-ui-conmat';
import {ConmatFloatingView} from './conmat-floating-view.jsx';
import {changeConmatProgramming,previewConmatProgrammingChange} from './conmat-demo-store.js';

const dateKey=value=>value?`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`:'';
const actions=[{value:'cancel',label:'Cancelar programación de órdenes'},{value:'annul',label:'Anular un viaje'},{value:'reschedule',label:'Reprogramar'}];
const status={cancel:'Cancelada',annul:'Anulado',reschedule:'Reprogramado'};
export function ConmatProgrammingChange({route,orders,onClose,onSuccess}){
 const [action,setAction]=useState('cancel'),[scope,setScope]=useState('orders'),[targetId,setTarget]=useState('');
 const [ids,setIds]=useState([]),[date,setDate]=useState(null),[reason,setReason]=useState(''),[review,setReview]=useState(null),[error,setError]=useState('');
 const linked=orders.filter(order=>order.routeId===route.id);
 const targets=scope==='trip'?route.trips.filter(trip=>trip.programmingStatus!=='Anulado').map(trip=>({value:trip.id,label:trip.name})):route.trips.filter(trip=>trip.programmingStatus!=='Anulado').flatMap(trip=>trip.groups.map(group=>({value:group.id,label:`${trip.name} / ${group.name}`})));
 const command={routeId:route.id,action,scope,targetId,ids,date:dateKey(date),reason};
 function resetAction(value){setAction(value);setScope(value==='annul'?'trip':'orders');setTarget('');setError('');}
 function submit(event){event.preventDefault();try{if(!review){setReview({...previewConmatProgrammingChange(command),command});setError('');}else{const result=changeConmatProgramming({...review.command,expectedIds:review.orders.map(order=>order.id)});onSuccess(result);}}catch(failure){setError(failure.message);}}
 const columns=[{key:'id',header:'Orden',render:order=>order.id},{key:'farm',header:'Finca',render:order=>order.farm},{key:'date',header:'Fecha actual',render:order=>order.plannedDate||route.plannedDate||'Sin fecha'}];
 return <ConmatFloatingView title={review?'Revisar cambio de programación':'Cambiar programación'} subtitle={`${route.id} · ${route.name}`} onClose={onClose}>
  <form className="conmat-route-form" onSubmit={submit}>
   {review?<>
    <KeyValueGrid columns={2} items={[{label:'Acción',value:actions.find(item=>item.value===action).label},{label:'Alcance',value:review.scopeLabel},{label:'Resultado',value:<Chip preset={action==='reschedule'?'info':'warning'}>{status[action]}</Chip>},{label:'Órdenes afectadas',value:review.orders.length},...(action==='reschedule'?[{label:'Nueva fecha',value:dateKey(date)}]:[]),{label:'Motivo',value:reason.trim()}]}/>
    <Table data={review.orders} columns={columns} minWidth="360px" emptyState="Viaje sin órdenes: sólo se anulará su estructura."/>
    <p>{action==='reschedule'?'Se conservará la agrupación y sólo cambiará la fecha de las órdenes incluidas.':'Las órdenes afectadas quedarán preasignadas y disponibles para nueva programación. Las demás conservarán su programación.'}</p>
    {review.assigned&&<Notice variant="warning">Esta ruta ya tiene asignación operativa. El cambio requiere comunicar la programación actualizada a la transportadora.</Notice>}
   </>:<>
    <SelectInput id="conmat-change-action" label="Acción" value={action} options={actions} onChange={resetAction}/>
    {action==='reschedule'&&<SelectInput id="conmat-change-scope" label="Aplicar a" value={scope} options={[{value:'route',label:'Ruta completa'},{value:'group',label:'Un subgrupo'},{value:'orders',label:'Órdenes seleccionadas'}]} onChange={value=>{setScope(value);setTarget('');setError('');}}/>}
    {(scope==='trip'||scope==='group')&&<SelectInput id="conmat-change-target" label={scope==='trip'?'Viaje':'Subgrupo'} placeholder="Seleccionar" value={targetId} options={targets} onChange={value=>{setTarget(value);setError('');}}/>}
    {scope==='orders'&&<fieldset className="conmat-change-orders"><legend>Órdenes que cambiarán</legend>{linked.length?<><CheckboxInput id="conmat-change-all" label="Seleccionar todas las órdenes de la ruta" value={linked.every(order=>ids.includes(order.id))} onChange={value=>setIds(value?linked.map(order=>order.id):[])}/>{linked.map(order=><CheckboxInput key={order.id} id={`conmat-change-${order.id}`} label={`${order.id} · ${order.farm} · ${order.plannedDate||route.plannedDate||'Sin fecha'}`} value={ids.includes(order.id)} onChange={value=>{setIds(current=>value?[...current,order.id]:current.filter(id=>id!==order.id));setError('');}}/>)}</>:<p>Esta ruta no tiene órdenes programadas.</p>}</fieldset>}
    {action==='reschedule'&&<DateInput id="conmat-change-date" label="Nueva fecha programada" value={date} onChange={value=>{setDate(value);setError('');}}/>}
    <TextInput id="conmat-change-reason" label="Motivo del cambio" placeholder="Describe la razón de este cambio" required value={reason} onChange={value=>{setReason(value);setError('');}}/>
   </>}
   {error&&<Notice variant="error">{error}</Notice>}
   <footer className="conmat-route-form-actions"><Button type="button" variant="outlined" onClick={()=>{if(review){setReview(null);setError('');}else onClose();}}>{review?'Volver a editar':'Volver'}</Button><Button type="submit" variant="filled">{review?'Confirmar cambio':'Revisar cambio'}</Button></footer>
  </form>
 </ConmatFloatingView>;
}
