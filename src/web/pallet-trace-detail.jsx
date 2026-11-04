import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Button, Chip, FlowTimeline, Table} from '@banasandev/banasan-ui';
import './pallet-trace-detail.css';
const roots = new WeakMap();
const Facts=({items})=><dl className="pallet-facts">{items.filter(item=>item[1]!==undefined&&item[1]!==null&&item[1]!=='').map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
function Transfers({title,items}) {
 if(!items?.length) return null;
 return <section className="pallet-transfers"><h4>{title}</h4><ul>{items.map(item=><li key={item.sscc}><span>{item.sscc}</span><strong>{item.boxes} cajas</strong></li>)}</ul></section>;
}
function PalletDetail({record,onClose}) {
 const [selected,setSelected]=useState(record.events.length-1);
 const movement=record.events[selected];
 const extra=record.movementDetails?.[selected];
 const current=selected===record.events.length-1;
 const build=extra?.build;
 const hasNovelty=['Con novedad','Rechazado'].includes(extra?.novelty);
 const items=record.events.map((event,index)=>({key:String(index),title:event[2],meta:record.movementDetails?.[index]?.location || event[3],timestamp:{dateTime:`${event[0].split('/').reverse().join('-')}T${event[1]}:00`,label:`${event[0]} · ${event[1]}`},statusLabel:index===record.events.length-1?'Estado actual':'Completado',statusTone:index===record.events.length-1?'info':'success'})).reverse();
 return <div className="pallet-detail-content">
  <header className="pallet-detail-heading"><div><h2>Trazabilidad del pallet {record.sscc}</h2><p>{record.farm} · {record.week}{record.simulation ? " · Caso de simulación" : ""}</p></div><Button variant="outlined" onClick={onClose}>Cerrar trazabilidad</Button></header>
  <div className="pallet-current"><div><span>Ubicación actual</span><strong>{record.location}</strong></div><Chip tone={record.statusTone || (record.statusKey==='warning'?'warning':record.statusKey==='farm'?'inactive':'info')}>{record.status}</Chip></div>
  <Facts items={[["Contenido actual",`${record.type} · ${record.reference} · ${record.boxes} cajas`],["Operación",record.operation],["Despacho",record.dispatch],["Contenedor",record.container]]}/>
  <div className="pallet-workspace">
   <section className="pallet-journey"><div className="pallet-section-heading"><h3>Recorrido del pallet</h3><Chip tone="info">{record.events.length} {record.events.length===1 ? 'evento' : 'eventos'}</Chip></div><FlowTimeline variant="connected" aria-label="Recorrido del pallet" reverseIndex items={items} selectedKey={String(selected)} onSelect={key=>setSelected(Number(key))}/></section>
   <section className="pallet-movement" aria-label="Detalle del evento seleccionado" aria-live="polite"><div key={selected} className="pallet-movement-body"><div className="pallet-section-heading"><span>Evento {selected+1} de {record.events.length}</span><Chip tone={current?'info':'success'}>{current?'Estado actual':'Completado'}</Chip></div><h3>{movement[2]}</h3>{!extra?.loadingStartedAt && !extra?.loadingCompletedAt && <p className="pallet-event-time">{movement[0]} · {movement[1]}</p>}
    <Facts items={extra ? [["Inicio de cargue",extra.loadingStartedAt],["Fin de cargue",extra.loadingCompletedAt],["Lugar",extra.location],["Responsable",extra.responsible],["Contenedor",extra.container],["Vehículo",extra.vehicle],["Radicado del vehículo",extra.filing],["Conductor",extra.driver],["Registro asociado",movement[4]]] : [["Lugar y responsable",movement[3]],["Registro asociado",movement[4]]]}/>
    {extra?.novelty&&<section className="pallet-novelty"><div className="pallet-section-heading"><h4>Resultado de la descarga</h4><Chip tone={extra.novelty==='Rechazado'?'error':hasNovelty?'warning':'success'}>{extra.novelty}</Chip></div>{hasNovelty&&<Facts items={[["Motivo",extra.noveltyReason]]}/>} {hasNovelty&&extra.observation&&<div className="pallet-observation"><h4>Observaciones</h4><p>{extra.observation}</p></div>}</section>}
    {build&&<section className="pallet-build"><div className="pallet-section-heading"><h4>Información del armado</h4><Chip tone="info">{build.composition.length} {build.composition.length===1?"referencia":"referencias"} · {build.composition.reduce((sum,row)=>sum+row.boxes,0)} cajas</Chip></div><Facts items={[["Inicio",build.start],["Finalización",build.end],...(build.responsible!==extra.responsible?[["Responsable",build.responsible]]:[]) ]}/><Transfers title="Pallets de origen del armado" items={build.sources}/><Transfers title="Cajas evacuadas a otros pallets" items={build.destinations}/><Table columns={[{key:'reference',header:'Referencia',render:row=>row.reference},{key:'version',header:'Versión',render:row=>row.version},{key:'boxes',header:'Cajas',render:row=>row.boxes}]} data={build.composition} rowKey={row=>`${row.reference}-${row.version}`} minWidth="300px"/>{build.observations&&<div className="pallet-observation"><h4>Observaciones del armado</h4><p>{build.observations}</p></div>}</section>}
   </div></section>
  </div>
 </div>;
}
export function mountPalletDetail(element,record,onClose) {
 let root=roots.get(element);if(!root){root=createRoot(element);roots.set(element,root);}
 root.render(<PalletDetail key={record.sscc} record={record} onClose={onClose}/>);
}
export function unmountPalletDetail(element){const root=roots.get(element);if(root){root.unmount();roots.delete(element);}}

