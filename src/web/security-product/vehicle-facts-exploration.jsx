import React from 'react';
import {KeyValueGrid} from '@banasandev/banasan-ui';
const isPreview = () => location.pathname.endsWith('/exploracion-informacion-vehiculos.html');
export const usesVehicleSummary = () => location.pathname.endsWith('/seguimiento-vehiculos.html') || (isPreview() && new URLSearchParams(location.search).get('layoutPreview') === 'b');
export function VehicleFacts({items,columns,scope}) {
  if (!isPreview() && !usesVehicleSummary()) return <KeyValueGrid items={items} columns={columns}/>;
  const variant = usesVehicleSummary() ? 'b' : 'a';
  const get = label => items.find(item=>item.label===label);
  const list = (labels, className='') => <dl className={'vf-list '+className}>{labels.map(label=>get(label)).filter(Boolean).map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>;
  if(scope==='milestone') return <div className={'vf-milestone vf-'+variant}>
    {list(['Etapa','Contenedor asignado','Carga','Responsable'],'vf-event-facts')}
    <div className="vf-event-note">{list(['Observación'])}</div>
  </div>;
  const groups=[['Vehículo',['Placa','Tipo de vehículo','Contenedor','Capacidad pallets']],['Asignación',['Conductor','Documento del conductor','Transportadora','Carrier']],['Ubicación',['Ubicación actual','Destino']]];
  if(variant==='a') return <div><div className="vf-groups">{groups.map(([title,labels])=><section key={title}><h4>{title}</h4>{list(labels)}</section>)}</div><section className="vf-administration"><h4>Registro</h4>{list(['Registro de la operación','Responsable de la operación','Sincronización'])}</section></div>;
  return <div className="vf-register vf-register-organized"><div className="vf-register-columns">{[...groups.slice(0,2),['Registro de la operación',['Registro de la operación','Responsable de la operación','Sincronización']]].map(([title,labels])=><section key={title}><h4>{title}</h4>{list(labels)}</section>)}</div></div>;
}
export function VehiclePreviewSwitch(){
 if(!isPreview()) return null;
 const variant=new URLSearchParams(location.search).get('layoutPreview')==='b'?'b':'a';
 return <div className="vf-preview-bar"><div><strong>Exploración de información</strong><p>Solo contexto e hito · datos de demostración · composición B integrada en la vista principal</p></div><nav aria-label="Alternativas de composición"><a aria-current={variant==='a'?'page':undefined} href="?layoutPreview=a">A · Grupos temáticos</a><a aria-current={variant==='b'?'page':undefined} href="?layoutPreview=b">B · Resumen y registro</a><a href="seguimiento-vehiculos.html">Vista vigente</a></nav></div>;
}

export function VehicleRouteContext({event}) {
 if(!usesVehicleSummary()) return null;
 return <div className="vf-route vf-route-readable vf-route-compact"><div className="vf-route-point"><span className="vf-route-marker" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><dl><dt>Ubicación actual del vehículo</dt><dd>{event.currentLocation}</dd></dl></div><span className="vf-route-direction" aria-hidden="true"><svg width="30" height="20" viewBox="0 0 30 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 10h25m-6-6 6 6-6 6"/></svg></span><div className="vf-route-point"><span className="vf-route-marker" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 21V3m0 1c5-4 9 4 14 0v9c-5 4-9-4-14 0"/></svg></span><dl><dt>Destino de la operación</dt><dd>{event.destination}</dd></dl></div></div>;
}
