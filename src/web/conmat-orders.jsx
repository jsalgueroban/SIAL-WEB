import React, {useEffect, useRef, useState} from 'react';
import {Card, CheckboxInput, Chip, DateInput, IconButton, KeyValueGrid, Notice, Pagination, SelectInput, Table, TableRowActions, ToastProvider, Toolbar, ViewIcon, useToast} from '@banasandev/banasan-ui';
import {TextInput} from '@banasandev/banasan-ui';
import {canPreassign, carrierName, carriers, materialTotals, preassignOrders, useConmatOrders} from './conmat-demo-store.js';
import './conmat-orders.css';
import {ConmatFloatingView} from './conmat-floating-view.jsx';
import {Button, FilterToolbar} from 'banasan-ui-conmat';
import '../../vendor/conmat-ui-20261123/filter-toolbar.scoped.css';

const statePreset={Pendiente:'warning',Preasignada:'info',Programada:'active',Cancelada:'inactive'};
const dateFormat=new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
const eventFormat=new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'America/Bogota'});
const displayDate=value=>dateFormat.format(new Date(`${value}T12:00:00Z`));
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
const options=values=>values.map(value=>({value,label:value}));
const amount=value=>new Intl.NumberFormat('es-CO').format(value);
const viewStorageKey='sial-conmat-order-view-v1';
function readView(){try{return JSON.parse(sessionStorage.getItem(viewStorageKey)||'{}');}catch{return {};}}
const lineColumns=[{key:'material',header:'Material / insumo',render:line=>line.name},{key:'quantity',header:'Cantidad',align:'right',render:line=>amount(line.quantity)},{key:'unit',header:'Unidad',render:line=>line.unit}];

export function ConmatOrders(){return <ToastProvider placement="bottom-right"><OrdersView/></ToastProvider>;}
function OrdersView(){
 const orders=useConmatOrders();
 const toast=useToast();
 const [previousView]=useState(readView);
 const initialStatus=new URLSearchParams(location.search).get('estado')||previousView.status;
 const [query,setQuery]=useState(previousView.query||''),[status,setStatus]=useState(['Pendiente','Preasignada','Programada','Cancelada'].includes(initialStatus)?initialStatus:'Todos');
 const [farm,setFarm]=useState(previousView.farm||'Todas'),[material,setMaterial]=useState(previousView.material||'Todos'),[date,setDate]=useState(previousView.date?new Date(previousView.date):null);
 const [page,setPage]=useState(previousView.page||1),[size,setSize]=useState(previousView.size||10),[selected,setSelected]=useState((previousView.selected||[]).filter(id=>orders.some(order=>order.id===id&&canPreassign(order))));
 const [detailId,setDetailId]=useState(new URLSearchParams(location.search).get('orden')),[assigning,setAssigning]=useState(false),[carrier,setCarrier]=useState(''),[review,setReview]=useState(false),[showBatch,setShowBatch]=useState(false),[error,setError]=useState('');
 const scenario=new URLSearchParams(location.search).get('escenario');
 const [loadError,setLoadError]=useState(scenario==='error'),[loading,setLoading]=useState(scenario==='cargando');
 const trigger=useRef(null),headerCheckbox=useRef(null);
 useEffect(()=>{try{sessionStorage.setItem(viewStorageKey,JSON.stringify({query,status,farm,material,date:date?.toISOString()||null,page,size,selected}));}catch{}},[query,status,farm,material,date,page,size,selected]);
 useEffect(()=>{if(!loading)return;const timer=setTimeout(()=>setLoading(false),650);return()=>clearTimeout(timer);},[loading]);
 const dateKey=date?`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`:'';
 const filtered=orders.filter(order=>(status==='Todos'||order.status===status)&&(farm==='Todas'||order.farm===farm)&&(material==='Todos'||order.items.some(line=>line.name===material))&&(!dateKey||order.createdAt===dateKey)&&normalize(`${order.id} ${order.farm} ${order.items.map(line=>line.name).join(' ')}`).includes(normalize(query.trim())));
 const activePage=Math.min(page,Math.max(1,Math.ceil(filtered.length/size)));
 const visible=filtered.slice((activePage-1)*size,activePage*size);
 const eligibleVisible=visible.filter(canPreassign);
 const chosen=orders.filter(order=>selected.includes(order.id)&&canPreassign(order));
 const hiddenSelection=chosen.filter(order=>!filtered.some(candidate=>candidate.id===order.id)).length;
 const allPageSelected=eligibleVisible.length>0&&eligibleVisible.every(order=>selected.includes(order.id));
 const partialPage=eligibleVisible.some(order=>selected.includes(order.id))&&!allPageSelected;
 const detail=orders.find(order=>order.id===detailId);
 const changedCount=chosen.filter(order=>order.status!=='Preasignada'||order.carrierId!==carrier).length;
 const activeFilters=Boolean(query||status!=='Todos'||farm!=='Todas'||material!=='Todos'||date);
 useEffect(()=>{const input=headerCheckbox.current?.querySelector('input');if(input){input.indeterminate=partialPage;input.setAttribute('aria-checked',partialPage?'mixed':String(allPageSelected));}},[partialPage,allPageSelected]);
 function changeFilter(set){return value=>{set(value);setPage(1);};}
 function clearFilters(){setQuery('');setStatus('Todos');setFarm('Todas');setMaterial('Todos');setDate(null);setPage(1);}
 function toggle(id,checked){setSelected(current=>checked?[...new Set([...current,id])]:current.filter(candidate=>candidate!==id));}
 function togglePage(checked){const ids=eligibleVisible.map(order=>order.id);setSelected(current=>checked?[...new Set([...current,...ids])]:current.filter(id=>!ids.includes(id)));}
 function openDetail(order){trigger.current=document.activeElement;setDetailId(order.id);const url=new URL(location.href);url.searchParams.set('orden',order.id);history.replaceState({},'',url);}
 function closeDrawer(){const url=new URL(location.href);url.searchParams.delete('orden');history.replaceState({},'',url);setDetailId(null);setAssigning(false);setReview(false);setError('');requestAnimationFrame(()=>{const target=trigger.current;const fallback=document.getElementById('conmat-order-search');if(target?.isConnected&&!target.disabled)target.focus();else fallback?.focus();});}
 function openAssign(){setShowBatch(false);trigger.current=document.activeElement;const same=chosen.length&&chosen.every(order=>order.carrierId===chosen[0].carrierId);setCarrier(same?chosen[0].carrierId:'');setReview(false);setError('');setAssigning(true);}
 function submit(event){
  event.preventDefault();
  if(!carriers.some(company=>company.id===carrier&&company.enabled)){setError('Selecciona una transportadora habilitada.');document.getElementById('conmat-assignment-carrier')?.focus();return;}
  if(!changedCount){setError('Las órdenes seleccionadas ya están preasignadas a esta transportadora.');return;}
  if(!review){setReview(true);setError('');return;}
  try{
   const count=preassignOrders(chosen.map(order=>order.id),carrier);
   setSelected([]);closeDrawer();
   toast.success({title:`${count} ${count===1?'orden preasignada':'órdenes preasignadas'}`,description:`${carrierName(carrier)}. Cambio conservado en la demostración.`,duration:6000,action:<Button variant="ghost" onClick={()=>location.assign(`conmat-rutas.html?transportadora=${carrier}`)}>Agrupar rutas</Button>});
  }catch(reason){setError(reason.message);setReview(false);}
 }
 const columns=[
  {key:'selection',width:'44px',header:<div ref={headerCheckbox} className="conmat-order-checkbox"><CheckboxInput id="conmat-select-page" label="Seleccionar órdenes disponibles de esta página" value={allPageSelected} disabled={!eligibleVisible.length} onChange={togglePage}/></div>,render:order=><div className="conmat-order-checkbox" title={canPreassign(order)?`Seleccionar ${order.id}`:order.routeId?'Orden agrupada. Gestiona su composición desde la ruta.':'Sólo consulta: la orden ya está programada o cancelada'}><CheckboxInput id={`select-${order.id}`} label={`Seleccionar ${order.id}`} disabled={!canPreassign(order)} value={canPreassign(order)&&selected.includes(order.id)} onChange={checked=>toggle(order.id,checked)}/></div>},
  {key:'order',header:'Orden / creación',render:order=><div className="conmat-order-identity"><strong>{order.id}</strong><small>{displayDate(order.createdAt)}</small></div>},
  {key:'farm',header:'Finca',render:order=>order.farm},
  {key:'materials',header:'Material / insumo',render:order=><div className="conmat-order-lines">{order.items.map(line=><span key={line.name+line.unit}>{line.name}</span>)}</div>},
  {key:'quantity',header:'Cantidad',align:'right',render:order=><div className="conmat-order-lines">{order.items.map(line=><span key={line.name+line.unit}>{amount(line.quantity)}</span>)}</div>},
  {key:'units',header:'Unidad',render:order=><div className="conmat-order-lines">{order.items.map(line=><span key={line.name+line.unit}>{line.unit}</span>)}</div>},
  {key:'carrier',header:'Transportadora',render:order=>carrierName(order.carrierId)},
  {key:'state',header:'Programación',render:order=><div><Chip preset={statePreset[order.status]}>{order.status}</Chip>{order.programmingStatus&&<small className="conmat-order-change">{order.programmingStatus==='Cancelada'?'Programación cancelada':order.programmingStatus==='Anulado'?'Viaje anulado':`Reprogramada · ${order.plannedDate}`}</small>}</div>}
 ];
 const batchColumns=[{key:'id',header:'Orden',render:order=>order.id},{key:'farm',header:'Finca',render:order=>order.farm},{key:'before',header:'Transportadora actual',render:order=>carrierName(order.carrierId)}];
 return <div className="conmat-orders">
  <header className="conmat-orders-heading"><div><p className="page-eyebrow">Transporte / CONMAT</p><h1 className="page-title">Órdenes y preasignación</h1><p className="page-subtitle">Consulta las órdenes de servicio y preasigna la empresa que realizará el transporte.</p></div><div className="conmat-orders-nav"><Button variant="outlined" onClick={()=>location.assign('conmat-rutas.html')}>Agrupar rutas</Button><Button variant="ghost" onClick={()=>location.assign('conmat-panel.html')}>Volver al panel</Button></div></header>
  <Notice variant="info">Datos de demostración. Los cambios se conservan en este navegador para recorrer la propuesta.</Notice>
  <Card className="conmat-orders-register">
   <Toolbar className="conmat-orders-card-head"><div className="conmat-orders-title"><h2>Órdenes de servicio</h2>{chosen.length>0&&<span role="status"><Chip preset="info">{chosen.length} {chosen.length===1?'orden seleccionada':'órdenes seleccionadas'}</Chip></span>}{hiddenSelection>0&&<small>{hiddenSelection} fuera de los filtros actuales</small>}</div><Button id="conmat-batch-assignment" variant="filled" disabled={!chosen.length||loading||loadError} onClick={openAssign}>Preasignar transportadora</Button></Toolbar>
   <FilterToolbar className="conmat-orders-filters" primaryCount={3} active={activeFilters} onClear={clearFilters}>
    <TextInput id="conmat-order-search" label="Buscar orden, finca o material" placeholder="Consecutivo o nombre" value={query} onChange={changeFilter(setQuery)}/>
    <SelectInput id="conmat-order-state" label="Programación" value={status} options={options(['Todos','Pendiente','Preasignada','Programada','Cancelada'])} onChange={changeFilter(setStatus)}/>
    <SelectInput id="conmat-order-farm" label="Finca" value={farm} options={options(['Todas',...new Set(orders.map(order=>order.farm))])} onChange={changeFilter(setFarm)}/>
    <SelectInput id="conmat-order-material" label="Material / insumo" value={material} options={options(['Todos',...new Set(orders.flatMap(order=>order.items.map(line=>line.name)))])} onChange={changeFilter(setMaterial)}/>
    <DateInput id="conmat-order-date" label="Fecha de creación" value={date} onChange={changeFilter(setDate)}/>
   </FilterToolbar>

   {loadError?<div className="conmat-orders-feedback"><Notice variant="error" heading="No se pudieron consultar las órdenes">La información no está disponible en este momento.</Notice><Button variant="outlined" onClick={()=>{setLoadError(false);setLoading(true);}}>Reintentar</Button></div>:<><Table data={visible} columns={columns} minWidth="1120px" rowKey={order=>order.id} loading={loading} emptyState={<div className="conmat-orders-empty"><strong>No hay órdenes para estos filtros</strong><p>Prueba otra búsqueda o limpia los filtros para volver a la consulta.</p></div>} actions={order=><TableRowActions label={`Acciones de ${order.id}`}><IconButton variant="ghost" aria-label={`Ver orden ${order.id}`} title="Ver orden" onClick={()=>openDetail(order)}><ViewIcon/></IconButton></TableRowActions>}/><Pagination page={activePage} pageSize={size} total={filtered.length} pageSizeOptions={[5,10,20]} onPageChange={setPage} onPageSizeChange={value=>{setSize(value);setPage(1);}}/></>}
  </Card>
  {detail&&<ConmatFloatingView onClose={closeDrawer} title={detail.id} subtitle="Orden de servicio" data={[{label:'Fecha de creación',children:displayDate(detail.createdAt)},{label:'Finca',children:detail.farm},{label:'Programación',children:<Chip preset={statePreset[detail.status]}>{detail.status}</Chip>},{label:'Transportadora',children:carrierName(detail.carrierId)},...(detail.programmingStatus?[{label:'Último cambio de programación',children:detail.programmingStatus==='Anulado'?'Viaje anulado':detail.programmingStatus},...(detail.plannedDate?[{label:'Nueva fecha programada',children:displayDate(detail.plannedDate)}]:[])]:[])]}>
   <div className="conmat-order-detail">
    {detail.originChange&&<Notice variant="warning" heading="Orden actualizada en origen">{detail.originChange}</Notice>}
    <section><h3>Materiales solicitados</h3><Table data={detail.items} columns={lineColumns} minWidth="320px"/></section>
    {detail.routeId&&<section><h3>Ruta asociada</h3><Button variant="outlined" onClick={()=>location.assign(`conmat-rutas.html?ruta=${detail.routeId}`)}>Consultar {detail.routeId}</Button></section>}
    {detail.status==='Cancelada'&&<Notice variant="info">Esta orden está cancelada en origen y no está disponible para preasignación.</Notice>}
    {detail.events.length>0&&<section><h3>Historial de la orden</h3>{detail.events.map((event,index)=><div className="conmat-order-event" key={index}><strong>{event.operation||'Preasignación'}</strong><p>{event.before} → {event.after}</p>{event.reason&&<p>Motivo: {event.reason}</p>}<p>{event.actor} · {eventFormat.format(new Date(event.at))}</p></div>)}</section>}
   </div>
  </ConmatFloatingView>}
  {assigning&&<ConmatFloatingView onClose={closeDrawer} title={review?'Revisar preasignación':'Preasignar transportadora'} subtitle={`${chosen.length} ${chosen.length===1?'orden seleccionada':'órdenes seleccionadas'}`}>
   <form className="conmat-preassignment-form" onSubmit={submit}>
    {review?<KeyValueGrid columns={2} items={[{label:'Transportadora seleccionada',value:carrierName(carrier)},{label:'Fincas',value:new Set(chosen.map(order=>order.farm)).size}]}/>:<SelectInput id="conmat-assignment-carrier" label="Empresa transportadora" placeholder="Seleccionar transportadora" required value={carrier} onChange={value=>{setCarrier(value);setError('');}} options={carriers.map(company=>({value:company.id,label:company.enabled?company.name:`${company.name} · No habilitada`,disabled:!company.enabled}))} validate={{status:Boolean(error),message:error}}/>}
    {review&&chosen.some(order=>order.status==='Preasignada'&&order.carrierId!==carrier)&&<Notice variant="warning">Se cambiará la transportadora de las órdenes que ya tenían una preasignación.</Notice>}
    <section className="conmat-batch-disclosure"><Button type="button" variant="ghost" aria-expanded={showBatch} aria-controls="conmat-floating-batch" onClick={()=>setShowBatch(value=>!value)}>{showBatch?'Ocultar órdenes':'Consultar órdenes incluidas'}</Button><div id="conmat-floating-batch" hidden={!showBatch}><Table data={chosen} columns={batchColumns} minWidth="430px"/></div></section>
    {review&&<section><h3>Materiales del lote</h3><Table data={materialTotals(chosen)} columns={lineColumns} minWidth="320px"/></section>}
    {review&&<p className="conmat-preassignment-help">Las órdenes conservarán sus materiales y cantidades. La preasignación las deja disponibles para organizar rutas; no asigna vehículo ni conductor.</p>}
    <footer className="conmat-preassignment-actions"><Button type="button" variant="outlined" onClick={review?()=>setReview(false):closeDrawer}>{review?'Volver':'Cancelar'}</Button><Button type="submit">{review?'Confirmar preasignación':'Revisar preasignación'}</Button></footer>
   </form>
  </ConmatFloatingView>}
 </div>;
}
