import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { SelectInput, DateInput, Table, Chip, Drawer, IconButton, ViewIcon, Pagination, TableRowActions, Notice } from '@banasandev/banasan-ui';
import '@banasandev/banasan-ui/style.css';
import './farm-consultations.css';
import { TableFilterReset } from './table-filter-reset.jsx';
const params = new URLSearchParams(location.search);
const authorized = params.get('demo') === 'santa-isabel';
const pickups = location.pathname.includes('recogidas-previstas');

// Fixtures ficticios: sólo cantidades generales y operaciones de una finca.
const anchor = new Date(new Date().toLocaleString('en-US', {timeZone:'America/Bogota'}));
anchor.setHours(12,0,0,0);
const dayAt = offset => { const day=new Date(anchor); day.setDate(day.getDate()+offset); return day; };
const dateKey = day => day ? [day.getFullYear(),day.getMonth()+1,day.getDate()].join('-') : '';
const format = day => day.toLocaleDateString('es-CO',{day:'numeric',month:'short',year:'numeric'});
const departures = [
 {id:1042,age:0,time:'08:40',pallets:18,status:'Registrado'},
 {id:1038,age:2,time:'15:15',pallets:12,status:'Con novedad',reason:'Dos pallets quedaron pendientes de cargue.',incident:'En revisión',support:'Se despacharon 12 pallets. Dos pallets quedaron en finca para revisión.'},
 {id:1011,age:14,time:'11:20',pallets:16,status:'Registrado'}
];
const schedules = [
 {offset:0,status:'Pendiente de cargue',vehicles:3,containers:2},
 {offset:0,status:'Con cargue registrado',vehicles:1,containers:0},
 {offset:1,status:'Pendiente de cargue',vehicles:2,containers:1}
];
const options = values => values.map(value=>({value,label:value}));
function Status({value}) { return <Chip preset={value==='Con novedad'?'warning':'info'}>{value}</Chip>; }
function App() {
 const [period,setPeriod]=useState('Todos los períodos');
 const [status,setStatus]=useState('Todos los estados');
 const [date,setDate]=useState(new Date(anchor));
 const [selected,setSelected]=useState(null);
 const [page,setPage]=useState(1);
 const [pageSize,setPageSize]=useState(10);
 const trigger=useRef(null);
 const visible=departures.filter(row=>(period==='Todos los períodos'||row.age<(period==='Últimos 7 días'?7:30))&&(status==='Todos los estados'||row.status===status));
 const currentPage=Math.min(page,Math.max(1,Math.ceil(visible.length/pageSize)));
 const rows=schedules.filter(row=>dateKey(dayAt(row.offset))===dateKey(date)&&(status==='Todos los estados'||row.status===status));
 const total=key=>rows.reduce((sum,row)=>sum+row[key],0);
 const changed=period!=='Todos los períodos'||status!=='Todos los estados'||dateKey(date)!==dateKey(anchor);
 function reset(){setPeriod('Todos los períodos');setStatus('Todos los estados');setDate(new Date(anchor));setPage(1);}
 function closeDetail(){setSelected(null);requestAnimationFrame(()=>trigger.current?.focus());}
 const columns=[{key:'id',header:'Operación',render:row=>row.id},{key:'date',header:'Fecha de salida',render:row=>`${format(dayAt(-row.age))} · ${row.time}`},{key:'operation',header:'Operación realizada',render:()=> 'Salida hacia ZE'},{key:'pallets',header:'Pallets',render:row=>row.pallets,align:'right'},{key:'status',header:'Estado',render:row=><Status value={row.status}/>}];
 const query=authorized?'?demo=santa-isabel':'';
 return <>
 <p className="page-eyebrow">Fincas / {pickups?'Recogidas previstas':'Despachos realizados'}</p>
 <div className="page-header"><div><h1 className="page-title">{pickups?'Recogidas previstas':'Despachos realizados'}</h1><p className="page-subtitle">{authorized?'Finca Santa Isabel · ':''}{pickups?'Consulta los vehículos y contenedores programados para recoger carga.':'Consulta las salidas registradas, su estado y las novedades autorizadas.'}</p></div><a className="btn btn-secondary" href={(pickups?'despachos-realizados.html':'recogidas-previstas.html')+query}>{pickups?'Consultar despachos':'Consultar recogidas'}</a></div>
 {!authorized?<Notice variant="warning" heading="Consulta no disponible">Necesitas una finca autorizada para consultar su operación.</Notice>:<>
 <article className="card standard-master-card farm-consultation-card">
 <div className="card-header"><div><h2 className="card-title">{pickups?'Programación de recogidas':'Despachos registrados'}</h2><p className="card-subtitle">{pickups?'Cantidades generales para la fecha y el estado seleccionados.':'Consulta el detalle para revisar novedades y soportes.'}</p></div>{!pickups&&<div className="card-actions"><Chip preset="info">{visible.length} {visible.length===1?'registro':'registros'}</Chip></div>}</div>
 <div className="card-body"><div className="toolbar farm-consultation-toolbar">
 {pickups?<DateInput label="Fecha de recogida" value={date} onChange={setDate}/>:<SelectInput label="Período" value={period} onChange={value=>{setPeriod(value);setPage(1);}} options={options(['Todos los períodos','Últimos 7 días','Últimos 30 días'])}/>}
 <SelectInput label="Estado" value={status} onChange={value=>{setStatus(value);setPage(1);}} options={options(['Todos los estados',...(pickups?['Pendiente de cargue','Con cargue registrado']:['Registrado','Con novedad'])])}/>
 <TableFilterReset active={changed} onReset={reset}/></div></div>
 {pickups?<div className="card-body farm-pickup-summary" aria-live="polite"><dl className="sial-key-value-grid"><div><dt>Fecha de recogida</dt><dd>{date?format(date):'Sin fecha seleccionada'}</dd></div><div><dt>Vehículos programados</dt><dd>{total('vehicles')}</dd></div><div><dt>Contenedores programados</dt><dd>{total('containers')}</dd></div></dl>{!rows.length&&<Notice variant="info" heading={date?'Sin recogidas programadas':'Selecciona una fecha'}>{date?'No hay recogidas para la fecha y el estado seleccionados.':'Selecciona una fecha para consultar la programación.'}</Notice>}</div>:<>
 <Table columns={columns} data={visible.slice((currentPage-1)*pageSize,currentPage*pageSize)} rowKey={row=>row.id} minWidth="860px" tableProps={{'aria-label':'Despachos de Finca Santa Isabel'}} emptyState="No hay despachos para los filtros seleccionados." actionsHeader="Acciones" actionsWidth="90px" actions={row=><TableRowActions label={'Acciones de operación '+row.id}><IconButton variant="ghost" aria-label={'Ver despacho '+row.id} onClick={event=>{trigger.current=event.currentTarget;setSelected(row);}}><ViewIcon/></IconButton></TableRowActions>}/>
 <Pagination page={currentPage} pageSize={pageSize} total={visible.length} pageSizeOptions={[2,10,20]} onPageChange={setPage} onPageSizeChange={value=>{setPageSize(value);setPage(1);}}/>
 </>}
 </article><p className="farm-consultation-demo">Datos ficticios de demostración · Consulta de la finca actual.</p>
 </>}
 {selected&&<Drawer show title="Detalle de despacho" subtitle={'Operación '+selected.id} ariaLabel={'Detalle de despacho '+selected.id} onClose={closeDetail} data={[
 {label:'Finca',children:'Finca Santa Isabel'},
 {label:'Fecha de salida',children:format(dayAt(-selected.age))+' · '+selected.time},
 {label:'Operación realizada',children:'Salida hacia ZE'},
 {label:'Cantidad despachada',children:selected.pallets+' pallets'},
 {label:'Estado',children:<Status value={selected.status}/>},
 {label:'Novedad',children:selected.reason?<><strong>{selected.incident}</strong><p>{selected.reason}</p></>:'Sin novedades registradas.'},
 {label:'Soportes autorizados',children:selected.support?<><strong>Acta de salida {selected.id}</strong><p>{selected.support}</p><small>Contenido ficticio de demostración.</small></>:'Sin soportes asociados en esta demostración.'}
 ]}/>}
 </>;
}
const target=document.querySelector('[data-farm-consultation]');
if(target) createRoot(target).render(<App/>);
