import React,{useEffect,useState} from 'react';
import {Button,Card,Notice,SkeletonTable} from 'banasan-ui-conmat';
import {ConmatCarrierNotifications} from './conmat-carrier-notifications.jsx';
import {useConmatOrders} from './conmat-demo-store.js';

const titles={'conmat-dashboard':'Control de materiales e insumos','conmat-orders':'Órdenes de servicio','conmat-routes':'Agrupación de rutas','conmat-carrier':'Portal de transportadora','conmat-tracking':'Seguimiento operativo','conmat-closure':'Cierre operativo','conmat-documents':'Soportes de transportadora','conmat-document-review':'Revisión documental interna','conmat-history':'Historial de rutas'};
export function ConmatProposalContext({view,children}){
 const params=new URLSearchParams(location.search),company=params.get('empresa')||'caribe';
 const sourceOrder=useConmatOrders().find(order=>order.routeId);
 const internal=['conmat-dashboard','conmat-orders','conmat-routes','conmat-document-review'].includes(view)||(view==='conmat-history'?params.get('interno')!=='0':params.get('interno')==='1');
 const sharedNotifications=['conmat-dashboard','conmat-orders','conmat-routes'].includes(view);
 const [scenario,setScenario]=useState(()=>['error','cargando','sin-permiso'].includes(params.get('escenario'))?params.get('escenario'):null);
 useEffect(()=>{if(scenario!=='cargando')return;const timer=setTimeout(()=>setScenario(null),650);return()=>clearTimeout(timer);},[scenario]);
 useEffect(()=>{
  const allowed=internal?['conmat-panel.html','conmat-ordenes.html','conmat-rutas.html','conmat-seguimiento.html','conmat-cierre.html','conmat-soportes.html','conmat-revision-documental.html','conmat-historial.html']:['conmat-transportadora.html','conmat-seguimiento.html','conmat-cierre.html','conmat-soportes.html','conmat-historial.html'];
  const nav=document.querySelector('[data-nav]');if(!nav)return;
  function sync(){nav.querySelectorAll('a[href]').forEach(link=>{const url=new URL(link.href),file=decodeURIComponent(url.pathname).split('/').at(-1);if(!file.startsWith('conmat-'))return;link.hidden=!allowed.includes(file);const item=link.closest('.nav-tree-item');if(item)item.hidden=link.hidden;if(['conmat-seguimiento.html','conmat-cierre.html','conmat-soportes.html','conmat-historial.html'].includes(file)){url.searchParams.set('interno',internal?'1':'0');if(!internal)url.searchParams.set('empresa',company);link.href=url.href;}if(file==='conmat-transportadora.html'){url.searchParams.set('empresa',company);link.href=url.href;}});}
  sync();const observer=new MutationObserver(sync);observer.observe(nav,{childList:true,subtree:true});return()=>observer.disconnect();
 },[view,internal,company]);
 function retry(){const url=new URL(location.href);url.searchParams.delete('escenario');history.replaceState({},'',url);setScenario('cargando');}
 return <>{params.get('escenario')==='origen'&&sourceOrder&&<section style={{marginBottom:24}} aria-label="Cambio de orden en origen"><Notice variant="warning" heading="Una orden cambió en origen">La orden {sourceOrder.id} tiene cambios que pueden afectar la programación de {sourceOrder.routeId}. Revisa los materiales y cantidades antes de continuar.</Notice><Button variant="outlined" onClick={()=>location.assign(`conmat-ordenes.html?orden=${sourceOrder.id}`)}>Revisar orden</Button></section>}{scenario?<><p className="page-eyebrow">Transporte / CONMAT</p><h1 className="page-title">{titles[view]}</h1><Card>{scenario==='cargando'?<div role="status" aria-label="Cargando información"><SkeletonTable/></div>:<><Notice variant={scenario==='sin-permiso'?'warning':'error'} heading={scenario==='sin-permiso'?'Acceso no disponible':'No se pudo cargar la información'}>{scenario==='sin-permiso'?'Tu perfil no tiene acceso a esta consulta.':'Intenta cargar la información nuevamente.'}</Notice>{scenario!=='sin-permiso'&&<Button variant="outlined" onClick={retry}>Reintentar</Button>}</>}</Card></>:children}{sharedNotifications&&<ConmatCarrierNotifications internal companyId={company} onOpenRecord={item=>location.assign(item.kind==='order'?`conmat-ordenes.html?orden=${item.target}`:`conmat-historial.html?interno=1&ruta=${item.target}`)}/>}</>;
}
