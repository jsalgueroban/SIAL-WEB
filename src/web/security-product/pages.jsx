import './poma-normalization.css';
import React, {useMemo} from 'react';
import {Card, Notice, ToastProvider} from '@banasandev/banasan-ui';
import {OperationalAuditWorkbench} from './operational-audit-workbench';
import {OperationalAuditToolbar} from './operational-audit-toolbar';
import {OperationalAuditTableActions} from './operational-audit-table-actions';
import {OperationalVehicleAuditWorkbench} from './operational-vehicle-audit-workbench';
import {usesVehicleSummary} from './vehicle-facts-exploration';
import {OperationalVehicleAuditToolbar} from './operational-vehicle-audit-toolbar';
import {PomaWorkspace} from './poma-workspace';
import {PomaToolbar} from './poma-toolbar';
import {useQueryParams,loadPomaRows,getOperationalAuditFilters,filterOperationalAuditEvents,getVehicleOperationalFilters,filterVehicleOperationalEvents} from './bridge';
import {containerEvents,vehicleEvents,stages,locations} from './fixtures';

function Page({title,description,route,notice,children}){return <ToastProvider><section className="page security-product-page"><p className="page-eyebrow">{route}</p><div className="page-header"><div><h1 className="page-title">{title}</h1><p className="page-subtitle">{description}</p></div></div>{notice && <Notice variant="info">{notice}</Notice>}{children}</section></ToastProvider>;}
function ReviewCard({title,actions,toolbar,children}){return <article className="card security-review-card"><div className="card-header"><h2 className="card-title">{title}</h2><div className="card-actions">{actions}</div></div><div className="card-body">{toolbar}</div>{children}</article>;}
function ContainersContent(){
 const {params}=useQueryParams();
 const events=filterOperationalAuditEvents(params.get('demoState')==='empty'?[]:containerEvents,getOperationalAuditFilters(params));
 const wrap=content=><ReviewCard title="Centro de revisión" actions={<OperationalAuditTableActions events={events}/>} toolbar={<OperationalAuditToolbar/>}>{content}</ReviewCard>;
 return <OperationalAuditWorkbench events={events} renderSelector={wrap} hasActiveFilters={["search","containerStage","fromDate","toDate","weekNumber","year"].some(key=>Boolean(params.get(key)))}/>;
}
export function SecurityContainers(){return <Page title="Seguimiento de operaciones de contenedores" description="Centro de revisión para operaciones de contenedores: movimientos, ubicación, inspecciones, evidencias y trazabilidad por operación." route="Seguridad / Seguimiento de operaciones" notice="La prioridad es revisar operaciones de contenedores, recorrer sus movimientos y abrir evidencias de inspección sin perder trazabilidad."><ContainersContent/></Page>;}
function VehiclesContent(){
 const {params}=useQueryParams();
 const demoLong=params.get('demoState')==='long-journey';
 const source=demoLong ? vehicleEvents.map(event=>({...event,trace:Array.from({length:6},(_,batch)=>event.trace.map(node=>{
   const date=new Date(node.occurredAtValue); date.setDate(date.getDate()-(5-batch));
   const pad=n=>String(n).padStart(2,'0');
   return {...node,id:`${node.id}-demo-${batch}`,occurredAtValue:`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`,occurredAt:`${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`};
 })).flat()})) : vehicleEvents;
 const events=filterVehicleOperationalEvents(params.get('demoState')==='empty'?[]:source,getVehicleOperationalFilters(params));
 const split=usesVehicleSummary();
 const selector=content=><ReviewCard title="Centro de control vehicular" toolbar={<OperationalVehicleAuditToolbar stages={stages} locations={locations}/>} >{content}</ReviewCard>;
 if(params.get('demoState')==='error') return selector(<Notice variant="error">No fue posible cargar la trazabilidad de vehículos.</Notice>);
 const workbench=<OperationalVehicleAuditWorkbench events={events} renderSelector={split?selector:undefined} hasActiveFilters={["search","year","weekNumber","vehicleStageId","locationId"].some(key=>Boolean(params.get(key)))}/>;
 return <>{demoLong && <Notice variant="info">Recorrido ampliado de demostración para revisar desplazamiento y selección. No representa una operación real.</Notice>}{split?workbench:selector(workbench)}</>;
}
export function SecurityVehicles(){return <Page title="Seguimiento operacional de vehículos" description="Centro de control para conocer la ubicación, etapa y recorrido de cada vehículo dentro de una operación de transporte." route="Seguridad / Seguimiento de vehículos"><VehiclesContent/></Page>;}
function PomaContent(){const {params,version}=useQueryParams();const radication=params.get('radication')||'';const data=useMemo(()=>loadPomaRows(radication),[radication,version]);return <div className="poma-workspace grid gap-5"><Card className="bg-(--color-surface) p-0!"><header className="border-b border-(--color-border-subtle) px-5 py-4"><h2 className="mt-1 text-[18px] font-semibold text-(--color-text)">Consultar por radicación</h2><p className="mt-1.5 text-[13px] leading-[1.55] text-(--color-text-2)">Busca la salida del vehículo por su número de radicación.</p></header><div className="p-5"><PomaToolbar/></div></Card><PomaWorkspace data={data}/></div>;}
export function SecurityPoma(){return <Page title="Generar documento POMA" description="Revisa los datos de cada cargue y su tramo antes de generar y descargar el POMA." route="Auditoría / Documento POMA"><PomaContent/></Page>;}
